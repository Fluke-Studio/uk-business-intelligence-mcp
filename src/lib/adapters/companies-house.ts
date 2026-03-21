import { DataSourceAdapter, AdapterInput, AdapterResult } from './types';

interface CompaniesHouseData {
  company_number: string;
  company_name: string;
  company_status: string;
  incorporation_date: string | null;
  company_type: string;
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
}

const API_BASE = 'https://api.company-information.service.gov.uk';

function getAuthHeader(): string {
  const apiKey = process.env.COMPANIES_HOUSE_API_KEY || '';
  return 'Basic ' + Buffer.from(apiKey + ':').toString('base64');
}

async function searchCompany(
  businessName: string,
  location: string
): Promise<string | null> {
  const query = `${businessName} ${location}`;
  const res = await fetch(
    `${API_BASE}/search/companies?q=${encodeURIComponent(query)}&items_per_page=1`,
    {
      headers: { Authorization: getAuthHeader() },
      signal: AbortSignal.timeout(10000),
    }
  );

  if (!res.ok) return null;

  const data = (await res.json()) as { items?: Array<{ company_number?: string }> };
  if (data.items && data.items.length > 0) {
    return data.items[0].company_number ?? null;
  }
  return null;
}

async function fetchCompanyProfile(companyNumber: string): Promise<Record<string, unknown> | null> {
  const res = await fetch(`${API_BASE}/company/${companyNumber}`, {
    headers: { Authorization: getAuthHeader() },
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) return null;
  return (await res.json()) as Record<string, unknown>;
}

async function fetchOfficers(companyNumber: string): Promise<Array<Record<string, unknown>>> {
  const res = await fetch(
    `${API_BASE}/company/${companyNumber}/officers?items_per_page=50`,
    {
      headers: { Authorization: getAuthHeader() },
      signal: AbortSignal.timeout(10000),
    }
  );
  if (!res.ok) return [];
  const data = (await res.json()) as { items?: Array<Record<string, unknown>> };
  return data.items || [];
}

export const companiesHouseAdapter: DataSourceAdapter<CompaniesHouseData> = {
  source: 'companies_house',
  cacheTtlSeconds: 604800, // 7 days

  getCacheKey(input: AdapterInput): string | null {
    if (input.company_number) {
      return `ch:${input.company_number}`;
    }
    return null; // Can't cache until we know the company number
  },

  async fetch(input: AdapterInput): Promise<AdapterResult<CompaniesHouseData>> {
    try {
      // Resolve company number
      let companyNumber = input.company_number;
      if (!companyNumber) {
        companyNumber = await searchCompany(input.business_name, input.location) ?? undefined;
      }

      if (!companyNumber) {
        return { success: false, data: null, source: 'companies_house', cached: false, error: 'No matching company found' };
      }

      // Fetch profile and officers in parallel
      const [profile, officers] = await Promise.all([
        fetchCompanyProfile(companyNumber),
        fetchOfficers(companyNumber),
      ]);

      if (!profile) {
        return { success: false, data: null, source: 'companies_house', cached: false, error: 'Failed to fetch company profile' };
      }

      const addr = profile.registered_office_address as Record<string, string> | undefined;
      const directors = officers
        .filter((o) => o.officer_role === 'director')
        .map((o) => ({
          name: (o.name as string) || '',
          role: (o.officer_role as string) || '',
          appointed_on: (o.appointed_on as string) || null,
          resigned_on: (o.resigned_on as string) || null,
        }));

      const data: CompaniesHouseData = {
        company_number: companyNumber,
        company_name: (profile.company_name as string) || '',
        company_status: (profile.company_status as string) || '',
        incorporation_date: (profile.date_of_creation as string) || null,
        company_type: (profile.type as string) || '',
        sic_codes: (profile.sic_codes as string[]) || [],
        registered_address: addr
          ? {
              address_line_1: addr.address_line_1 || null,
              address_line_2: addr.address_line_2 || null,
              locality: addr.locality || null,
              region: addr.region || null,
              postal_code: addr.postal_code || null,
              country: addr.country || null,
            }
          : null,
        directors,
      };

      return { success: true, data, source: 'companies_house', cached: false };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return { success: false, data: null, source: 'companies_house', cached: false, error: message };
    }
  },
};
