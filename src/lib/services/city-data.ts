import { getIndustryFromSIC } from '@/lib/data/sic-codes';

const API_BASE = 'https://api.company-information.service.gov.uk';

function getAuthHeader(): string {
  const apiKey = process.env.COMPANIES_HOUSE_API_KEY || '';
  return 'Basic ' + Buffer.from(apiKey + ':').toString('base64');
}

export interface CityCompany {
  company_name: string;
  company_number: string;
  company_status: string;
  date_of_creation: string | null;
  sic_codes: string[];
  address_snippet: string | null;
}

export interface CityData {
  companies: CityCompany[];
  total_results: number;
  industry_counts: Record<string, number>;
  status_counts: Record<string, number>;
  newest_company: CityCompany | null;
}

interface CHSearchItem {
  company_number?: string;
  title?: string;
  company_status?: string;
  date_of_creation?: string;
  sic_codes?: string[];
  address_snippet?: string;
  company_type?: string;
}

interface CHSearchResponse {
  items?: CHSearchItem[];
  total_results?: number;
}

export async function fetchCityCompanies(cityName: string): Promise<CityData> {
  // Use CH advanced search to find active companies by location
  const url = new URL(`${API_BASE}/advanced-search/companies`);
  url.searchParams.set('location', cityName);
  url.searchParams.set('company_status', 'active');
  url.searchParams.set('size', '30');

  const res = await fetch(url.toString(), {
    headers: { Authorization: getAuthHeader() },
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    // Fallback to basic search if advanced search fails
    return fetchCityCompaniesFallback(cityName);
  }

  const data = (await res.json()) as CHSearchResponse;
  return processCHResults(data);
}

async function fetchCityCompaniesFallback(cityName: string): Promise<CityData> {
  const res = await fetch(
    `${API_BASE}/search/companies?q=${encodeURIComponent(cityName)}&items_per_page=30`,
    {
      headers: { Authorization: getAuthHeader() },
      signal: AbortSignal.timeout(15000),
    }
  );

  if (!res.ok) {
    return { companies: [], total_results: 0, industry_counts: {}, status_counts: {}, newest_company: null };
  }

  const data = (await res.json()) as CHSearchResponse;
  return processCHResults(data);
}

function processCHResults(data: CHSearchResponse): CityData {
  const items = data.items || [];
  const industryCounts: Record<string, number> = {};
  const statusCounts: Record<string, number> = {};
  let newest: CityCompany | null = null;

  const companies: CityCompany[] = items
    .filter((item) => item.company_number && item.title)
    .map((item) => {
      const company: CityCompany = {
        company_name: item.title || '',
        company_number: item.company_number || '',
        company_status: item.company_status || 'unknown',
        date_of_creation: item.date_of_creation || null,
        sic_codes: item.sic_codes || [],
        address_snippet: item.address_snippet || null,
      };

      // Count industries
      if (company.sic_codes.length > 0) {
        const industry = getIndustryFromSIC(company.sic_codes[0]);
        industryCounts[industry] = (industryCounts[industry] || 0) + 1;
      }

      // Count statuses
      const status = company.company_status;
      statusCounts[status] = (statusCounts[status] || 0) + 1;

      // Track newest
      if (company.date_of_creation) {
        if (!newest || (newest.date_of_creation && company.date_of_creation > newest.date_of_creation)) {
          newest = company;
        }
      }

      return company;
    });

  return {
    companies,
    total_results: data.total_results || companies.length,
    industry_counts: industryCounts,
    status_counts: statusCounts,
    newest_company: newest,
  };
}
