import { Industry } from '@/lib/data/industries';

const API_BASE = 'https://api.company-information.service.gov.uk';

function getAuthHeader(): string {
  const apiKey = process.env.COMPANIES_HOUSE_API_KEY || '';
  return 'Basic ' + Buffer.from(apiKey + ':').toString('base64');
}

export interface IndustryCompany {
  company_name: string;
  company_number: string;
  company_status: string;
  date_of_creation: string | null;
  sic_codes: string[];
  address_snippet: string | null;
  locality: string | null;
}

export interface IndustryData {
  companies: IndustryCompany[];
  total_results: number;
  city_counts: Record<string, number>;
}

interface CHSearchItem {
  company_number?: string;
  title?: string;
  company_status?: string;
  date_of_creation?: string;
  sic_codes?: string[];
  address_snippet?: string;
  address?: { locality?: string };
}

interface CHSearchResponse {
  items?: CHSearchItem[];
  total_results?: number;
}

export async function fetchIndustryCompanies(industry: Industry): Promise<IndustryData> {
  // Use the first SIC prefix for the primary search
  const sicCode = industry.sicPrefixes[0];

  const url = new URL(`${API_BASE}/advanced-search/companies`);
  url.searchParams.set('sic_codes', sicCode);
  url.searchParams.set('company_status', 'active');
  url.searchParams.set('size', '30');

  const res = await fetch(url.toString(), {
    headers: { Authorization: getAuthHeader() },
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    // Fallback: basic search with industry name
    return fetchIndustryFallback(industry);
  }

  const data = (await res.json()) as CHSearchResponse;
  return processResults(data);
}

async function fetchIndustryFallback(industry: Industry): Promise<IndustryData> {
  const res = await fetch(
    `${API_BASE}/search/companies?q=${encodeURIComponent(industry.name)}&items_per_page=30`,
    {
      headers: { Authorization: getAuthHeader() },
      signal: AbortSignal.timeout(15000),
    }
  );

  if (!res.ok) {
    return { companies: [], total_results: 0, city_counts: {} };
  }

  const data = (await res.json()) as CHSearchResponse;
  return processResults(data);
}

function processResults(data: CHSearchResponse): IndustryData {
  const items = data.items || [];
  const cityCounts: Record<string, number> = {};

  const companies: IndustryCompany[] = items
    .filter((item) => item.company_number && item.title)
    .map((item) => {
      const locality = item.address?.locality || extractLocality(item.address_snippet) || null;

      if (locality) {
        cityCounts[locality] = (cityCounts[locality] || 0) + 1;
      }

      return {
        company_name: item.title || '',
        company_number: item.company_number || '',
        company_status: item.company_status || 'unknown',
        date_of_creation: item.date_of_creation || null,
        sic_codes: item.sic_codes || [],
        address_snippet: item.address_snippet || null,
        locality,
      };
    });

  return {
    companies,
    total_results: data.total_results || companies.length,
    city_counts: cityCounts,
  };
}

function extractLocality(addressSnippet: string | null | undefined): string | null {
  if (!addressSnippet) return null;
  // Address snippets are typically "Line1, City, Postcode" — try to extract city
  const parts = addressSnippet.split(',').map((p) => p.trim());
  if (parts.length >= 2) {
    // The second-to-last part is usually the city (before postcode)
    return parts[parts.length - 2] || null;
  }
  return null;
}
