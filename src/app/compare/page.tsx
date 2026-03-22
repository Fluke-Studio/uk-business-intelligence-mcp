import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compare UK Business Data APIs | Endole vs OpenCorporates vs UK Business Intel',
  description:
    'Compare UK business data APIs side by side. See pricing, features, and data sources for Endole, OpenCorporates, CompanyCheck, and UK Business Intelligence API.',
  openGraph: {
    title: 'Compare UK Business Data APIs',
    description: 'Side-by-side comparison of UK business data providers. Find the best API for your needs.',
    type: 'website',
    locale: 'en_GB',
  },
  alternates: { canonical: 'https://ukbusinessintel.com/compare' },
};

const competitors = [
  {
    name: 'UK Business Intel',
    slug: null,
    highlight: true,
    pricing: 'From £0/mo',
    perLookup: '~1.6p',
    freeTier: '100 lookups/month',
    dataSources: ['Companies House', 'Google Places', 'DNS/SSL', 'Social Media'],
    api: true,
    mcp: true,
    selfServe: true,
    contract: 'No',
  },
  {
    name: 'Endole',
    slug: 'endole-alternative',
    highlight: false,
    pricing: 'From £39/mo',
    perLookup: '60p–£3',
    freeTier: 'Basic CH only',
    dataSources: ['Companies House', 'Credit Data', 'Financials'],
    api: true,
    mcp: false,
    selfServe: true,
    contract: 'No',
  },
  {
    name: 'OpenCorporates',
    slug: 'opencorporates-alternative',
    highlight: false,
    pricing: '£2,250/yr',
    perLookup: '~£4.50',
    freeTier: 'Very limited',
    dataSources: ['Company Registries (200+ countries)'],
    api: true,
    mcp: false,
    selfServe: false,
    contract: 'Annual',
  },
  {
    name: 'DueDil',
    slug: null,
    highlight: false,
    pricing: 'Custom (enterprise)',
    perLookup: 'Undisclosed',
    freeTier: 'None',
    dataSources: ['Companies House', 'Credit', 'Financials', 'Web'],
    api: true,
    mcp: false,
    selfServe: false,
    contract: 'Annual',
  },
  {
    name: 'ZoomInfo',
    slug: null,
    highlight: false,
    pricing: '$15,000+/yr',
    perLookup: 'Undisclosed',
    freeTier: 'None',
    dataSources: ['Proprietary B2B Database'],
    api: true,
    mcp: false,
    selfServe: false,
    contract: 'Annual',
  },
];

export default function ComparePage() {
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
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Compare UK Business Data APIs
          </h1>
          <p className="text-lg text-zinc-400 max-w-3xl leading-relaxed">
            Side-by-side comparison of UK business data providers. See which API gives
            you the most data for the lowest price.
          </p>
        </div>
      </section>

      {/* Comparison table */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left px-4 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wide">Provider</th>
                <th className="text-left px-4 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wide">Pricing</th>
                <th className="text-left px-4 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wide">Per Lookup</th>
                <th className="text-left px-4 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wide">Free Tier</th>
                <th className="text-left px-4 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wide">Self-Serve</th>
                <th className="text-left px-4 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wide">Contract</th>
                <th className="text-left px-4 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wide">MCP</th>
              </tr>
            </thead>
            <tbody>
              {competitors.map((c) => (
                <tr
                  key={c.name}
                  className={`border-b border-zinc-800/50 ${
                    c.highlight ? 'bg-emerald-500/5' : 'hover:bg-zinc-800/30'
                  } transition-colors`}
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {c.highlight && (
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full shrink-0" />
                      )}
                      <span className={`font-medium ${c.highlight ? 'text-emerald-400' : 'text-zinc-200'}`}>
                        {c.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-zinc-300">{c.pricing}</td>
                  <td className={`px-4 py-4 font-mono text-xs ${c.highlight ? 'text-emerald-400 font-bold' : 'text-zinc-400'}`}>
                    {c.perLookup}
                  </td>
                  <td className="px-4 py-4 text-zinc-400">{c.freeTier}</td>
                  <td className="px-4 py-4">
                    {c.selfServe ? (
                      <span className="text-emerald-400">&#x2713;</span>
                    ) : (
                      <span className="text-zinc-600">&#x2717;</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-zinc-400">{c.contract}</td>
                  <td className="px-4 py-4">
                    {c.mcp ? (
                      <span className="text-emerald-400">&#x2713;</span>
                    ) : (
                      <span className="text-zinc-600">&#x2717;</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Individual comparison links */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-bold mb-6">Detailed Comparisons</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            <a href="/compare/endole-alternative" className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-emerald-500/30 transition-colors group">
              <h3 className="font-semibold text-zinc-200 group-hover:text-emerald-400 transition-colors mb-2">Endole Alternative</h3>
              <p className="text-sm text-zinc-500">60x cheaper per lookup. Compare features, pricing, and data coverage.</p>
            </a>
            <a href="/compare/opencorporates-alternative" className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-emerald-500/30 transition-colors group">
              <h3 className="font-semibold text-zinc-200 group-hover:text-emerald-400 transition-colors mb-2">OpenCorporates Alternative</h3>
              <p className="text-sm text-zinc-500">Self-serve API with more data sources at a fraction of the price.</p>
            </a>
            <a href="/compare/duedil-alternative" className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-emerald-500/30 transition-colors group">
              <h3 className="font-semibold text-zinc-200 group-hover:text-emerald-400 transition-colors mb-2">DueDil Alternative</h3>
              <p className="text-sm text-zinc-500">No enterprise sales call. Self-serve signup with transparent pricing.</p>
            </a>
            <a href="/compare/companycheck-alternative" className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-emerald-500/30 transition-colors group">
              <h3 className="font-semibold text-zinc-200 group-hover:text-emerald-400 transition-colors mb-2">CompanyCheck Alternative</h3>
              <p className="text-sm text-zinc-500">Full API access instead of website-only lookups. Four data sources.</p>
            </a>
            <a href="/compare/cognism-alternative" className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-emerald-500/30 transition-colors group">
              <h3 className="font-semibold text-zinc-200 group-hover:text-emerald-400 transition-colors mb-2">Cognism Alternative</h3>
              <p className="text-sm text-zinc-500">From £0/month instead of $15,000+/year. UK-focused business data.</p>
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6 sm:p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">Try It Free</h2>
            <p className="text-zinc-400 text-sm mb-6">
              100 free lookups per month. No credit card. No contract. See why developers
              choose us over enterprise providers.
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
            <a href="/data" className="hover:text-zinc-300 transition-colors">Business Data</a>
            <a href="/#pricing" className="hover:text-zinc-300 transition-colors">Pricing</a>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
