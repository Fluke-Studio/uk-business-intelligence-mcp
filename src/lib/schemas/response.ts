export interface EnrichedBusinessProfile {
  query: {
    business_name: string;
    location: string;
    company_number: string | null;
    domain: string | null;
  };

  companies_house: {
    company_number: string | null;
    company_name: string | null;
    company_status: string | null;
    incorporation_date: string | null;
    company_type: string | null;
    sic_codes: string[];
    registered_address: {
      address_line_1: string | null;
      address_line_2: string | null;
      locality: string | null;
      region: string | null;
      postal_code: string | null;
      country: string | null;
    } | null;
    directors: Array<{
      name: string;
      role: string;
      appointed_on: string | null;
      resigned_on: string | null;
    }>;
  };

  google_places: {
    place_id: string | null;
    display_name: string | null;
    formatted_address: string | null;
    rating: number | null;
    review_count: number | null;
    phone: string | null;
    website: string | null;
    google_maps_url: string | null;
  };

  website: {
    domain: string | null;
    is_live: boolean | null;
    http_status: number | null;
    ssl_valid: boolean | null;
    ssl_expiry: string | null;
  };

  social: {
    facebook: string | null;
    instagram: string | null;
    linkedin: string | null;
    twitter: string | null;
  };

  meta: {
    sources_successful: string[];
    sources_failed: string[];
    sources_skipped: string[];
    cached_sources: string[];
    enriched_at: string;
    duration_ms: number;
  };
}

export function createEmptyProfile(query: {
  business_name: string;
  location: string;
  company_number?: string;
  domain?: string;
}): EnrichedBusinessProfile {
  return {
    query: {
      business_name: query.business_name,
      location: query.location,
      company_number: query.company_number ?? null,
      domain: query.domain ?? null,
    },
    companies_house: {
      company_number: null,
      company_name: null,
      company_status: null,
      incorporation_date: null,
      company_type: null,
      sic_codes: [],
      registered_address: null,
      directors: [],
    },
    google_places: {
      place_id: null,
      display_name: null,
      formatted_address: null,
      rating: null,
      review_count: null,
      phone: null,
      website: null,
      google_maps_url: null,
    },
    website: {
      domain: null,
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
      sources_successful: [],
      sources_failed: [],
      sources_skipped: [],
      cached_sources: [],
      enriched_at: new Date().toISOString(),
      duration_ms: 0,
    },
  };
}
