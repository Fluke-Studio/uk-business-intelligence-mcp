import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OpenCorporates Alternative — Self-Serve UK Business Data API | UK Business Intel',
  description:
    'Looking for an OpenCorporates alternative? UK Business Intelligence API offers self-serve signup, free tier, and enriched UK business data at a fraction of the price.',
  openGraph: {
    title: 'OpenCorporates Alternative — No Annual Contract',
    description: 'Self-serve UK business data API with free tier. No £2,250/yr commitment. More data sources per lookup.',
    type: 'website',
    locale: 'en_GB',
  },
  alternates: { canonical: 'https://ukbusinessintel.com/compare/opencorporates-alternative' },
};

const features = [
  { feature: 'UK Company Data', us: true, them: true },
  { feature: 'Google Places Ratings & Reviews', us: true, them: false },
  { feature: 'Website Health / SSL Check', us: true, them: false },
  { feature: 'Social Media Discovery', us: true, them: false },
  { feature: 'International Coverage (200+ countries)', us: false, them: true },
  { feature: 'REST API', us: true, them: true },
  { feature: 'MCP Server (Claude/Cursor)', us: true, them: false },
  { feature: 'Free Tier', us: true, them: false },
  { feature: 'Self-Serve Signup', us: true, them: false },
  { feature: 'Monthly Billing', us: true, them: false },
  { feature: 'No Annual Contract', us: true, them: false },
];

function Check() {
  return <span className="text-emerald-400 text-base">&#x2713;</span>;
}

function Cross() {
  return <span className="text-zinc-600 text-base">&#x2717;</span>;
}

export default function OpenCorporatesAlternativePage() {
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
            <a href="/compare" className="text-zinc-400 hover:text-white transition-colors">Compare</a>
            <a href="/#pricing" className="text-zinc-400 hover:text-white transition-colors">Pricing</a>
            <a href="/docs" className="text-zinc-400 hover:text-white transition-colors">Docs</a>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="pt-24 px-6">
        <div className="max-w-5xl mx-auto">
          <nav aria-label="Breadcrumb" className="text-xs text-zinc-500">
            <a href="/" className="hover:text-zinc-300 transition-colors">Home</a>
            <span className="mx-2">/</span>
            <a href="/compare" className="hover:text-zinc-300 transition-colors">Compare</a>
            <span className="mx-2">/</span>
            <span className="text-zinc-300">OpenCorporates Alternative</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="pt-6 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 text-xs font-medium px-3 py-1.5 rounded-full mb-6 border border-emerald-500/20">
            No annual contract required
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            OpenCorporates Alternative
            <br />
            <span className="text-emerald-400">for UK Business Data</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-3xl leading-relaxed">
            OpenCorporates charges &pound;2,250/year with strict rate limits (500 calls/month).
            We offer self-serve signup, a generous free tier, and enriched data from
            four sources &mdash; all with monthly billing and no contract.
          </p>
        </div>
      </section>

      {/* Price highlight */}
      <section className="px-6 pb-12">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <p className="text-sm text-zinc-500 uppercase tracking-wide font-medium mb-2">OpenCorporates</p>
            <p className="text-3xl font-bold text-zinc-300">&pound;2,250</p>
            <p className="text-sm text-zinc-500 mt-1">per year (annual contract)</p>
            <p className="text-xs text-zinc-600 mt-2">500 calls/month, 200/day limit</p>
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6">
            <p className="text-sm text-emerald-400 uppercase tracking-wide font-medium mb-2">UK Business Intel</p>
            <p className="text-3xl font-bold text-emerald-400">From &pound;0</p>
            <p className="text-sm text-zinc-400 mt-1">per month (cancel any time)</p>
            <p className="text-xs text-zinc-500 mt-2">100 free lookups, up to 20,000/mo</p>
          </div>
        </div>
      </section>

      {/* Feature comparison */}
      <section className="px-6 pb-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold mb-6">Feature Comparison</h2>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left px-4 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wide">Feature</th>
                  <th className="text-center px-4 py-3 text-emerald-400 font-medium text-xs uppercase tracking-wide">UK Business Intel</th>
                  <th className="text-center px-4 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wide">OpenCorporates</th>
                </tr>
              </thead>
              <tbody>
                {features.map((f) => (
                  <tr key={f.feature} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                    <td className="px-4 py-3 text-zinc-300">{f.feature}</td>
                    <td className="px-4 py-3 text-center">{f.us ? <Check /> : <Cross />}</td>
                    <td className="px-4 py-3 text-center">{f.them ? <Check /> : <Cross />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* When to choose them */}
      <section className="px-6 pb-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold mb-4">When to Choose OpenCorporates Instead</h2>
          <div className="space-y-4 text-sm text-zinc-400 leading-relaxed">
            <p>OpenCorporates is the better choice if you need:</p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong className="text-zinc-300">International coverage</strong> &mdash; 200+ countries and jurisdictions. We focus on UK businesses only.</li>
              <li><strong className="text-zinc-300">Bulk data access</strong> &mdash; They offer data dumps for large-scale analysis</li>
              <li><strong className="text-zinc-300">Open data advocacy</strong> &mdash; OpenCorporates champions corporate transparency globally</li>
            </ul>
            <p>
              If your focus is UK businesses and you want enriched data (not just registry records),
              developer-friendly pricing, and instant self-serve access, we&apos;re the better fit.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6 sm:p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">Try It Without the Contract</h2>
            <p className="text-zinc-400 text-sm mb-6">
              100 free lookups per month. No annual commitment. Get your API key in 30 seconds.
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
            <a href="/compare" className="hover:text-zinc-300 transition-colors">Compare APIs</a>
            <a href="/data" className="hover:text-zinc-300 transition-colors">Business Data</a>
            <a href="/#pricing" className="hover:text-zinc-300 transition-colors">Pricing</a>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
