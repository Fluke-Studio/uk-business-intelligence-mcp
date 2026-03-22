import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { UK_CITIES, getCityBySlug } from '@/lib/data/uk-cities';
import { getIndustryFromSIC } from '@/lib/data/sic-codes';
import { fetchCityCompanies } from '@/lib/services/city-data';

export const revalidate = 604800; // 1 week

interface PageProps {
  params: Promise<{ city: string }>;
}

export async function generateStaticParams() {
  return UK_CITIES.map((city) => ({ city: city.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city: slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) return { title: 'Not Found' };

  const title = `Businesses in ${city.name} — Company Data & Intelligence | UK Business Intel`;
  const description = `Browse registered companies in ${city.name}, ${city.region}. Company status, directors, SIC codes, and more. Powered by Companies House data with Google Places enrichment.`;

  return {
    title,
    description,
    openGraph: {
      title: `Businesses in ${city.name} | UK Business Intelligence`,
      description,
      type: 'website',
      locale: 'en_GB',
    },
    twitter: { card: 'summary', title, description },
    alternates: {
      canonical: `https://ukbusinessintel.com/data/businesses-in-${city.slug}`,
    },
  };
}

function makeReportSlug(name: string, location: string): string {
  return `${name}-${location}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default async function CityPage({ params }: PageProps) {
  const { city: slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) notFound();

  const data = await fetchCityCompanies(city.name);

  // Sort industries by count descending
  const topIndustries = Object.entries(data.industry_counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  // Get nearby cities for internal linking
  const nearbyCities = UK_CITIES
    .filter((c) => c.slug !== city.slug)
    .sort(() => Math.random() - 0.5)
    .slice(0, 8);

  const activeCount = data.status_counts['active'] || 0;

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-[family-name:var(--font-geist-sans)] overflow-x-hidden w-full">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-black font-bold text-sm">
              UK
            </div>
            <span className="font-semibold text-sm hidden sm:block">Business Intel API</span>
          </a>
          <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm">
            <a href="/" className="text-zinc-400 hover:text-white transition-colors">Home</a>
            <a href="/#pricing" className="text-zinc-400 hover:text-white transition-colors">Pricing</a>
            <a href="/docs" className="text-zinc-400 hover:text-white transition-colors">Docs</a>
            <a href="/tools/company-lookup" className="text-zinc-400 hover:text-white transition-colors">Lookup</a>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="pt-24 px-6">
        <div className="max-w-5xl mx-auto">
          <nav aria-label="Breadcrumb" className="text-xs text-zinc-500">
            <a href="/" className="hover:text-zinc-300 transition-colors">Home</a>
            <span className="mx-2">/</span>
            <a href="/data" className="hover:text-zinc-300 transition-colors">Business Data</a>
            <span className="mx-2">/</span>
            <span className="text-zinc-300">{city.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="pt-6 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Businesses in {city.name}
          </h1>
          <p className="text-lg text-zinc-400 max-w-3xl leading-relaxed">
            Browse {data.total_results.toLocaleString()} registered companies in {city.name}, {city.region}.
            Get company status, directors, SIC codes, and enriched business intelligence
            via our API.
          </p>
        </div>
      </section>

      {/* Stats cards */}
      <section className="px-6 pb-12">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-5">
            <p className="text-2xl sm:text-3xl font-bold text-emerald-400">
              {data.total_results.toLocaleString()}
            </p>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">Total Companies</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-5">
            <p className="text-2xl sm:text-3xl font-bold text-emerald-400">{activeCount}</p>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">Active (shown)</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-5">
            <p className="text-2xl sm:text-3xl font-bold text-emerald-400">{topIndustries.length}</p>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">Industries</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-5">
            <p className="text-2xl sm:text-3xl font-bold text-emerald-400">{city.country}</p>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">Country</p>
          </div>
        </div>
      </section>

      {/* Top Industries */}
      {topIndustries.length > 0 && (
        <section className="px-6 pb-12">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold mb-6">
              Top Industries in {city.name}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {topIndustries.map(([industry, count]) => (
                <div
                  key={industry}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-colors"
                >
                  <p className="text-sm font-medium text-zinc-200 mb-1">{industry}</p>
                  <p className="text-xs text-zinc-500">{count} companies</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Company table */}
      <section className="px-6 pb-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold mb-6">
            Registered Companies in {city.name}
          </h2>

          {data.companies.length > 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              {/* Desktop table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 text-left">
                      <th className="px-4 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wide">Company</th>
                      <th className="px-4 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wide">Number</th>
                      <th className="px-4 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wide">Status</th>
                      <th className="px-4 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wide">Incorporated</th>
                      <th className="px-4 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wide">Industry</th>
                      <th className="px-4 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wide">Report</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {data.companies.map((company) => {
                      const industry = company.sic_codes.length > 0
                        ? getIndustryFromSIC(company.sic_codes[0])
                        : null;
                      const reportSlug = makeReportSlug(company.company_name, city.name);

                      return (
                        <tr key={company.company_number} className="hover:bg-zinc-800/30 transition-colors">
                          <td className="px-4 py-3">
                            <p className="font-medium text-zinc-200 text-sm">{company.company_name}</p>
                            {company.address_snippet && (
                              <p className="text-xs text-zinc-500 mt-0.5 truncate max-w-xs">{company.address_snippet}</p>
                            )}
                          </td>
                          <td className="px-4 py-3 text-zinc-400 font-mono text-xs">{company.company_number}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                              company.company_status === 'active'
                                ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                                : 'text-zinc-400 bg-zinc-700/30 border border-zinc-700/50'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                company.company_status === 'active' ? 'bg-emerald-400' : 'bg-zinc-500'
                              }`} />
                              {company.company_status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-zinc-400 text-xs">{company.date_of_creation || '-'}</td>
                          <td className="px-4 py-3 text-zinc-400 text-xs">{industry || '-'}</td>
                          <td className="px-4 py-3">
                            <a
                              href={`/report/${reportSlug}`}
                              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                            >
                              View report &rarr;
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="sm:hidden divide-y divide-zinc-800/50">
                {data.companies.map((company) => {
                  const reportSlug = makeReportSlug(company.company_name, city.name);
                  return (
                    <div key={company.company_number} className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium text-zinc-200 text-sm">{company.company_name}</p>
                          <p className="text-xs text-zinc-500 mt-0.5">{company.company_number}</p>
                        </div>
                        <span className={`shrink-0 inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                          company.company_status === 'active'
                            ? 'text-emerald-400 bg-emerald-500/10'
                            : 'text-zinc-400 bg-zinc-700/30'
                        }`}>
                          {company.company_status}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-zinc-500">{company.date_of_creation || 'Unknown date'}</span>
                        <a
                          href={`/report/${reportSlug}`}
                          className="text-xs text-emerald-400 hover:text-emerald-300"
                        >
                          Full report &rarr;
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
              <p className="text-zinc-400">No company data available for {city.name} right now.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6 sm:p-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-xl sm:text-2xl font-bold mb-3">
                Get Full Business Intelligence for {city.name} Companies
              </h2>
              <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                This page shows basic Companies House data. Our API enriches each business
                with Google reviews, website health, SSL status, and social media links.
                60x cheaper than Endole. Start free.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="/#pricing"
                  className="bg-emerald-500 text-black font-semibold px-8 py-3 rounded-lg hover:bg-emerald-400 transition-colors text-sm"
                >
                  Get Free API Key &mdash; 100 lookups/month
                </a>
                <a
                  href="/tools/company-lookup"
                  className="border border-zinc-700 text-zinc-300 font-medium px-6 py-3 rounded-lg hover:bg-zinc-800 transition-colors text-sm"
                >
                  Try Free Lookup
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO content block */}
      <section className="px-6 pb-16 border-t border-zinc-800/50 pt-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold mb-4">
            About Business Data in {city.name}
          </h2>
          <div className="space-y-4 text-sm text-zinc-400 leading-relaxed">
            <p>
              {city.name} is home to {data.total_results.toLocaleString()} registered
              companies according to Companies House records. The {city.region} area
              supports a diverse business landscape
              {topIndustries.length > 0 && (
                <>, with top industries including {topIndustries.slice(0, 3).map(([ind]) => ind).join(', ')}</>
              )}.
            </p>
            <p>
              Our UK Business Intelligence API provides enriched data for every company
              in {city.name}. Beyond basic Companies House records, each lookup returns
              Google Places ratings and reviews, website health and SSL status, and
              social media presence &mdash; all in a single API call.
            </p>
            <h3 className="text-lg font-semibold text-white pt-2">
              Common use cases for {city.name} business data
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong className="text-zinc-300">KYB Compliance</strong> &mdash; Verify {city.name} businesses for onboarding and due diligence</li>
              <li><strong className="text-zinc-300">Lead Generation</strong> &mdash; Find and qualify prospects in the {city.region} area</li>
              <li><strong className="text-zinc-300">Market Research</strong> &mdash; Analyse industry trends and competition in {city.name}</li>
              <li><strong className="text-zinc-300">Credit Checks</strong> &mdash; Verify company status and director information</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Internal links: other cities */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-bold mb-6">Browse Businesses in Other Cities</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {nearbyCities.map((c) => (
              <a
                key={c.slug}
                href={`/data/businesses-in-${c.slug}`}
                className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-emerald-500/30 hover:bg-zinc-800/50 transition-colors"
              >
                <p className="text-sm font-medium text-zinc-200">{c.name}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{c.region}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <a href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center text-black font-bold text-xs">
              UK
            </div>
            <span className="text-sm text-zinc-400">Business Intelligence API</span>
          </a>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-zinc-500">
            <a href="/docs" className="hover:text-zinc-300 transition-colors">API Docs</a>
            <a href="/tools/company-lookup" className="hover:text-zinc-300 transition-colors">Company Lookup</a>
            <a href="/tools/business-checker" className="hover:text-zinc-300 transition-colors">Business Checker</a>
            <a href="/#pricing" className="hover:text-zinc-300 transition-colors">Pricing</a>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'Dataset',
              name: `Registered Companies in ${city.name}`,
              description: `Business data for ${data.total_results.toLocaleString()} companies registered in ${city.name}, ${city.region}. Includes company status, SIC codes, directors, and more.`,
              url: `https://ukbusinessintel.com/data/businesses-in-${city.slug}`,
              creator: {
                '@type': 'Organization',
                name: 'UK Business Intelligence',
                url: 'https://ukbusinessintel.com',
              },
              spatialCoverage: {
                '@type': 'Place',
                name: `${city.name}, ${city.region}, ${city.country}`,
              },
              license: 'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/',
              isBasedOn: 'https://www.gov.uk/government/organisations/companies-house',
            },
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ukbusinessintel.com' },
                { '@type': 'ListItem', position: 2, name: 'Business Data', item: 'https://ukbusinessintel.com/data' },
                { '@type': 'ListItem', position: 3, name: `Businesses in ${city.name}`, item: `https://ukbusinessintel.com/data/businesses-in-${city.slug}` },
              ],
            },
          ]),
        }}
      />
    </div>
  );
}
