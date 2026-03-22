import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DueDil Alternative — Self-Serve UK Business Data API | UK Business Intel',
  description:
    'Looking for a DueDil alternative? UK Business Intelligence API offers self-serve signup, transparent pricing, and enriched UK business data without enterprise sales calls.',
  openGraph: {
    title: 'DueDil Alternative — No Sales Call Required',
    description: 'Self-serve UK business data API. No enterprise contract. Four data sources in one API call.',
    type: 'website',
    locale: 'en_GB',
  },
  alternates: { canonical: 'https://ukbusinessintel.com/compare/duedil-alternative' },
};

const features = [
  { feature: 'UK Company Data', us: true, them: true },
  { feature: 'Google Places Ratings & Reviews', us: true, them: false },
  { feature: 'Website Health / SSL Check', us: true, them: false },
  { feature: 'Social Media Discovery', us: true, them: false },
  { feature: 'Financial Data & Credit Risk', us: false, them: true },
  { feature: 'Shareholder Information', us: false, them: true },
  { feature: 'REST API', us: true, them: true },
  { feature: 'MCP Server (Claude/Cursor)', us: true, them: false },
  { feature: 'Free Tier', us: true, them: false },
  { feature: 'Self-Serve Signup', us: true, them: false },
  { feature: 'Transparent Pricing', us: true, them: false },
  { feature: 'No Sales Call Required', us: true, them: false },
];

function Check() { return <span className="text-emerald-400 text-base">&#x2713;</span>; }
function Cross() { return <span className="text-zinc-600 text-base">&#x2717;</span>; }

export default function DueDilAlternativePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-[family-name:var(--font-geist-sans)] overflow-x-hidden w-full">
      <nav className="fixed top-0 w-full z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-black font-bold text-sm">UK</div>
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

      <div className="pt-24 px-6"><div className="max-w-5xl mx-auto">
        <nav aria-label="Breadcrumb" className="text-xs text-zinc-500">
          <a href="/" className="hover:text-zinc-300">Home</a><span className="mx-2">/</span>
          <a href="/compare" className="hover:text-zinc-300">Compare</a><span className="mx-2">/</span>
          <span className="text-zinc-300">DueDil Alternative</span>
        </nav>
      </div></div>

      <section className="pt-6 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 text-xs font-medium px-3 py-1.5 rounded-full mb-6 border border-emerald-500/20">
            No enterprise sales call needed
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            DueDil Alternative for
            <br /><span className="text-emerald-400">UK Business Data</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-3xl leading-relaxed">
            DueDil requires an enterprise sales process with custom pricing. We offer instant
            self-serve signup, transparent pricing from &pound;0/month, and enriched data from
            four sources that DueDil doesn&apos;t cover.
          </p>
        </div>
      </section>

      <section className="px-6 pb-12">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <p className="text-sm text-zinc-500 uppercase tracking-wide font-medium mb-2">DueDil</p>
            <p className="text-3xl font-bold text-zinc-300">Custom Quote</p>
            <p className="text-sm text-zinc-500 mt-1">Enterprise sales required</p>
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6">
            <p className="text-sm text-emerald-400 uppercase tracking-wide font-medium mb-2">UK Business Intel</p>
            <p className="text-3xl font-bold text-emerald-400">From &pound;0</p>
            <p className="text-sm text-zinc-400 mt-1">Self-serve, instant access</p>
          </div>
        </div>
      </section>

      <section className="px-6 pb-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold mb-6">Feature Comparison</h2>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full text-sm min-w-[500px]">
              <thead><tr className="border-b border-zinc-800">
                <th className="text-left px-4 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wide">Feature</th>
                <th className="text-center px-4 py-3 text-emerald-400 font-medium text-xs uppercase tracking-wide">UK Business Intel</th>
                <th className="text-center px-4 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wide">DueDil</th>
              </tr></thead>
              <tbody>{features.map((f) => (
                <tr key={f.feature} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                  <td className="px-4 py-3 text-zinc-300">{f.feature}</td>
                  <td className="px-4 py-3 text-center">{f.us ? <Check /> : <Cross />}</td>
                  <td className="px-4 py-3 text-center">{f.them ? <Check /> : <Cross />}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="px-6 pb-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold mb-4">When to Choose DueDil Instead</h2>
          <div className="space-y-4 text-sm text-zinc-400 leading-relaxed">
            <p>DueDil is the better choice if you need:</p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong className="text-zinc-300">Financial statements</strong> &mdash; Detailed P&amp;L and balance sheet data</li>
              <li><strong className="text-zinc-300">Shareholder information</strong> &mdash; Ownership structure and beneficial owners</li>
              <li><strong className="text-zinc-300">Enterprise compliance features</strong> &mdash; AML screening and watchlist monitoring</li>
            </ul>
            <p>If you need company verification with Google reviews, website health, and social media data at transparent pricing, we&apos;re the better fit.</p>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6 sm:p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">Skip the Sales Call</h2>
            <p className="text-zinc-400 text-sm mb-6">100 free lookups per month. No contract, no sales process. Get your API key in 30 seconds.</p>
            <a href="/#pricing" className="inline-block bg-emerald-500 text-black font-semibold px-8 py-3 rounded-lg hover:bg-emerald-400 transition-colors text-sm">Get Free API Key</a>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ukbusinessintel.com' },
        { '@type': 'ListItem', position: 2, name: 'Compare', item: 'https://ukbusinessintel.com/compare' },
        { '@type': 'ListItem', position: 3, name: 'DueDil Alternative', item: 'https://ukbusinessintel.com/compare/duedil-alternative' },
      ] }) }} />

      <footer className="border-t border-zinc-800/50 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <a href="/" className="flex items-center gap-2"><div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center text-black font-bold text-xs">UK</div><span className="text-sm text-zinc-400">Business Intelligence API</span></a>
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
