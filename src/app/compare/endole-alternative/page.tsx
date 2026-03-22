import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Endole Alternative — 60x Cheaper UK Business Data API | UK Business Intel',
  description:
    'Looking for an Endole alternative? UK Business Intelligence API gives you Companies House records, Google reviews, website health, and social media data at 60x lower cost per lookup.',
  openGraph: {
    title: 'Endole Alternative — 60x Cheaper Per Lookup',
    description: 'Compare UK Business Intel vs Endole. Same Companies House data, plus Google Places, DNS, and social media enrichment at a fraction of the price.',
    type: 'website',
    locale: 'en_GB',
  },
  alternates: { canonical: 'https://ukbusinessintel.com/compare/endole-alternative' },
};

const features = [
  { feature: 'Companies House Data', us: true, them: true },
  { feature: 'Google Places Ratings & Reviews', us: true, them: false },
  { feature: 'Website Health / SSL Check', us: true, them: false },
  { feature: 'Social Media Discovery', us: true, them: false },
  { feature: 'Credit Scores', us: false, them: true },
  { feature: '10-Year Financials', us: false, them: true },
  { feature: 'CCJ / Mortgage Data', us: false, them: false },
  { feature: 'REST API', us: true, them: true },
  { feature: 'MCP Server (Claude/Cursor)', us: true, them: false },
  { feature: 'Free Tier', us: true, them: false },
  { feature: 'No Contract Required', us: true, them: true },
  { feature: 'Self-Serve Signup', us: true, them: true },
];

const pricingComparison = [
  { tier: 'Free', us: '£0/mo (100 lookups)', them: 'Basic CH data only' },
  { tier: 'Starter', us: '£29/mo (1,000 lookups)', them: '£39/mo (limited)' },
  { tier: 'Growth', us: '£79/mo (5,000 lookups)', them: 'Custom quote' },
  { tier: 'Scale', us: '£199/mo (20,000 lookups)', them: 'Custom quote' },
  { tier: 'Per lookup cost', us: '~1.6p at Growth', them: '60p–£3 per call' },
];

function Check() {
  return <span className="text-emerald-400 text-base">&#x2713;</span>;
}

function Cross() {
  return <span className="text-zinc-600 text-base">&#x2717;</span>;
}

export default function EndoleAlternativePage() {
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
            <span className="text-zinc-300">Endole Alternative</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="pt-6 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 text-xs font-medium px-3 py-1.5 rounded-full mb-6 border border-emerald-500/20">
            60x cheaper per API call
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Endole Alternative for
            <br />
            <span className="text-emerald-400">UK Business Data</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-3xl leading-relaxed">
            Endole charges 60p&ndash;&pound;3 per API call. We charge ~1.6p at the Growth tier.
            Same Companies House data, plus Google Places ratings, website health checks,
            and social media discovery that Endole doesn&apos;t offer.
          </p>
        </div>
      </section>

      {/* Price highlight */}
      <section className="px-6 pb-12">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <p className="text-sm text-zinc-500 uppercase tracking-wide font-medium mb-2">Endole</p>
            <p className="text-3xl font-bold text-zinc-300">60p&ndash;&pound;3</p>
            <p className="text-sm text-zinc-500 mt-1">per API call</p>
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6">
            <p className="text-sm text-emerald-400 uppercase tracking-wide font-medium mb-2">UK Business Intel</p>
            <p className="text-3xl font-bold text-emerald-400">~1.6p</p>
            <p className="text-sm text-zinc-400 mt-1">per lookup (Growth tier)</p>
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
                  <th className="text-center px-4 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wide">Endole</th>
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

      {/* Pricing comparison */}
      <section className="px-6 pb-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold mb-6">Pricing Comparison</h2>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left px-4 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wide">Tier</th>
                  <th className="text-left px-4 py-3 text-emerald-400 font-medium text-xs uppercase tracking-wide">UK Business Intel</th>
                  <th className="text-left px-4 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wide">Endole</th>
                </tr>
              </thead>
              <tbody>
                {pricingComparison.map((row) => (
                  <tr key={row.tier} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                    <td className="px-4 py-3 text-zinc-300 font-medium">{row.tier}</td>
                    <td className="px-4 py-3 text-zinc-300">{row.us}</td>
                    <td className="px-4 py-3 text-zinc-400">{row.them}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Honest assessment */}
      <section className="px-6 pb-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold mb-4">When to Choose Endole Instead</h2>
          <div className="space-y-4 text-sm text-zinc-400 leading-relaxed">
            <p>
              We believe in honest comparisons. Endole is the better choice if you need:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong className="text-zinc-300">Credit scores</strong> &mdash; Endole provides company credit ratings that we don&apos;t currently offer</li>
              <li><strong className="text-zinc-300">10-year financial history</strong> &mdash; Detailed profit/loss and balance sheet data</li>
              <li><strong className="text-zinc-300">CCJ and mortgage data</strong> &mdash; Legal charge information</li>
            </ul>
            <p>
              However, if you need company verification, customer reviews, website health,
              and social media presence &mdash; or you&apos;re looking for a developer-friendly API
              at a fraction of the cost &mdash; UK Business Intel is the better fit.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6 sm:p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">Switch from Endole and Save</h2>
            <p className="text-zinc-400 text-sm mb-6">
              Start with 100 free lookups. No credit card, no contract. See the difference yourself.
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
