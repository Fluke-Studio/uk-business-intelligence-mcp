import type { Metadata } from 'next';
import { UK_CITIES } from '@/lib/data/uk-cities';

export const metadata: Metadata = {
  title: 'UK Business Data by City | Company Intelligence & Verification',
  description:
    'Browse business data for 50+ UK cities. Company status, directors, SIC codes, and enriched intelligence from Companies House, Google Places, and more.',
  openGraph: {
    title: 'UK Business Data by City',
    description:
      'Browse registered companies across 50+ UK cities. Powered by Companies House with Google Places enrichment.',
    type: 'website',
    locale: 'en_GB',
  },
  alternates: {
    canonical: 'https://ukbusinessintel.com/data',
  },
};

// Group cities by country
function groupByCountry() {
  const groups: Record<string, typeof UK_CITIES> = {};
  for (const city of UK_CITIES) {
    if (!groups[city.country]) groups[city.country] = [];
    groups[city.country].push(city);
  }
  return groups;
}

export default function DataIndexPage() {
  const groups = groupByCountry();
  const countryOrder = ['England', 'Scotland', 'Wales', 'Northern Ireland'];

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

      {/* Hero */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            UK Business Data by City
          </h1>
          <p className="text-lg text-zinc-400 max-w-3xl leading-relaxed">
            Browse registered companies across {UK_CITIES.length} UK cities and towns.
            Each page shows real Companies House data with links to full business
            intelligence reports.
          </p>
        </div>
      </section>

      {/* City grid by country */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto space-y-12">
          {countryOrder.map((country) => {
            const cities = groups[country];
            if (!cities || cities.length === 0) return null;
            return (
              <div key={country}>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                  {country}
                  <span className="text-xs text-zinc-500 font-normal bg-zinc-800 px-2 py-0.5 rounded">
                    {cities.length} cities
                  </span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {cities.map((city) => (
                    <a
                      key={city.slug}
                      href={`/data/businesses-in-${city.slug}`}
                      className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-emerald-500/30 hover:bg-zinc-800/50 transition-colors group"
                    >
                      <p className="text-sm font-medium text-zinc-200 group-hover:text-emerald-400 transition-colors">
                        {city.name}
                      </p>
                      <p className="text-xs text-zinc-500 mt-0.5">{city.region}</p>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6 sm:p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">
              Need This Data via API?
            </h2>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              Get Companies House records, Google reviews, website health, and social
              media links for any UK business in one API call. 100 free lookups/month.
            </p>
            <a
              href="/#pricing"
              className="inline-block bg-emerald-500 text-black font-semibold px-8 py-3 rounded-lg hover:bg-emerald-400 transition-colors text-sm"
            >
              Get Free API Key
            </a>
          </div>
        </div>
      </section>

      {/* SEO content */}
      <section className="px-6 pb-16 border-t border-zinc-800/50 pt-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold mb-4">About UK Business Data</h2>
          <div className="space-y-4 text-sm text-zinc-400 leading-relaxed">
            <p>
              The UK has millions of registered companies spread across its cities and towns.
              This directory provides a city-by-city view of business registrations using
              official Companies House data, enriched with additional intelligence from
              Google Places, DNS health checks, and social media discovery.
            </p>
            <p>
              Our API combines four data sources into a single call, giving developers,
              agencies, and compliance teams a complete picture of any UK business.
              Unlike Endole, OpenCorporates, or DueDil, our pricing starts at &pound;0/month
              with 100 free lookups &mdash; and paid plans are up to 60x cheaper per lookup.
            </p>
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
    </div>
  );
}
