import { EnrichRequest } from '@/lib/schemas/request';
import { EnrichedBusinessProfile, createEmptyProfile } from '@/lib/schemas/response';
import { AdapterInput } from '@/lib/adapters/types';
import { cachedFetch } from './cache';
import { companiesHouseAdapter } from '@/lib/adapters/companies-house';
import { googlePlacesAdapter } from '@/lib/adapters/google-places';
import { dnsCheckAdapter } from '@/lib/adapters/dns-check';
import { webScraperAdapter } from '@/lib/adapters/web-scraper';

function extractDomain(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    // Prepend protocol if missing so new URL() can parse it
    const withProtocol = url.includes('://') ? url : `https://${url}`;
    const parsed = new URL(withProtocol);
    return parsed.hostname;
  } catch {
    return null;
  }
}

function applyPlanGating(
  profile: EnrichedBusinessProfile,
  plan?: string
): EnrichedBusinessProfile {
  if (plan !== 'free') return profile;

  // Free tier: only Companies House + Google Places data
  return {
    ...profile,
    website: {
      domain: profile.website.domain, // keep the domain they can see
      is_live: null,
      http_status: null,
      ssl_valid: null,
      ssl_expiry: null,
    },
    social: {
      facebook: null,
      instagram: null,
      linkedin: null,
      twitter: null,
    },
    meta: {
      ...profile.meta,
      sources_skipped: [...profile.meta.sources_skipped, 'dns_gated', 'social_gated'],
    },
  };
}

export async function enrichBusiness(
  request: EnrichRequest,
  plan?: string
): Promise<EnrichedBusinessProfile> {
  const startTime = Date.now();
  const profile = createEmptyProfile(request);

  const input: AdapterInput = {
    business_name: request.business_name,
    location: request.location,
    company_number: request.company_number,
    domain: request.domain,
  };

  // Round 1: Companies House + Google Places in parallel
  const [chResult, gpResult] = await Promise.allSettled([
    cachedFetch(companiesHouseAdapter, input),
    cachedFetch(googlePlacesAdapter, input),
  ]);

  // Merge Companies House data
  if (chResult.status === 'fulfilled' && chResult.value.success && chResult.value.data) {
    const ch = chResult.value.data;
    profile.companies_house = {
      company_number: ch.company_number,
      company_name: ch.company_name,
      company_status: ch.company_status,
      incorporation_date: ch.incorporation_date,
      company_type: ch.company_type,
      sic_codes: ch.sic_codes,
      registered_address: ch.registered_address,
      directors: ch.directors,
    };
    profile.meta.sources_successful.push('companies_house');
    if (chResult.value.cached) profile.meta.cached_sources.push('companies_house');

    // Update cache key now that we have a company number
    if (ch.company_number && !input.company_number) {
      input.company_number = ch.company_number;
    }
  } else {
    profile.meta.sources_failed.push('companies_house');
  }

  // Merge Google Places data
  if (gpResult.status === 'fulfilled' && gpResult.value.success && gpResult.value.data) {
    const gp = gpResult.value.data;
    profile.google_places = {
      place_id: gp.place_id,
      display_name: gp.display_name,
      formatted_address: gp.formatted_address,
      rating: gp.rating,
      review_count: gp.review_count,
      phone: gp.phone,
      website: gp.website,
      google_maps_url: gp.google_maps_url,
    };
    profile.meta.sources_successful.push('google_places');
    if (gpResult.value.cached) profile.meta.cached_sources.push('google_places');

    // Discover domain from Google Places website if not already known
    if (!input.domain && gp.website) {
      const discovered = extractDomain(gp.website);
      if (discovered) {
        input.domain = discovered;
        profile.query.domain = discovered;
      }
    }
  } else {
    profile.meta.sources_failed.push('google_places');
  }

  // Round 2: DNS + Web Scraper (only if domain is available)
  if (input.domain) {
    profile.website.domain = input.domain;

    const [dnsResult, scrapeResult] = await Promise.allSettled([
      cachedFetch(dnsCheckAdapter, input),
      cachedFetch(webScraperAdapter, input),
    ]);

    // Merge DNS data
    if (dnsResult.status === 'fulfilled' && dnsResult.value.success && dnsResult.value.data) {
      const d = dnsResult.value.data;
      profile.website.is_live = d.is_live;
      profile.website.http_status = d.http_status;
      profile.website.ssl_valid = d.ssl_valid;
      profile.website.ssl_expiry = d.ssl_expiry;
      profile.meta.sources_successful.push('dns');
      if (dnsResult.value.cached) profile.meta.cached_sources.push('dns');
    } else {
      profile.meta.sources_failed.push('dns');
    }

    // Merge scrape data
    if (scrapeResult.status === 'fulfilled' && scrapeResult.value.success && scrapeResult.value.data) {
      profile.social = scrapeResult.value.data;
      profile.meta.sources_successful.push('scrape');
      if (scrapeResult.value.cached) profile.meta.cached_sources.push('scrape');
    } else {
      profile.meta.sources_failed.push('scrape');
    }
  } else {
    // No domain available — these adapters were not attempted
    profile.meta.sources_skipped.push('dns');
    profile.meta.sources_skipped.push('scrape');
  }

  // Finalize metadata
  profile.meta.enriched_at = new Date().toISOString();
  profile.meta.duration_ms = Date.now() - startTime;

  return applyPlanGating(profile, plan);
}
