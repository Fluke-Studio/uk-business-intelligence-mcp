import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CompanyCheck Alternative — Full Business Intelligence API | UK Business Intel',
  description:
    'Looking for a CompanyCheck alternative with API access? UK Business Intelligence API gives you Companies House data plus Google reviews, website health, and social media in one call.',
  openGraph: {
    title: 'CompanyCheck Alternative — API-First Business Data',
    description: 'Four data sources in one API call. Companies House + Google Places + DNS + Social Media. Free tier available.',
    type: 'website',
    locale: 'en_GB',
  },
  alternates: { canonical: 'https://ukbusinessintel.com/compare/companycheck-alternative' },
};

const features = [
  { feature: 'Companies House Data', us: true, them: true },
  { feature: 'Google Places Ratings & Reviews', us: true, them: false },
  { feature: 'Website Health / SSL Check', us: true, them: false },
  { feature: 'Social Media Discovery', us: true, them: false },
  { feature: 'Basic Credit Info', us: false, them: true },
  { feature: 'REST API', us: true, them: false },
  { feature: 'MCP Server (Claude/Cursor)', us: true, them: false },
  { feature: 'Bulk Lookups', us: true, them: false },
  { feature: 'Free Tier', us: true, them: true },
  { feature: 'Developer-Friendly', us: true, them: false },
];

function Check() { return <span className="text-emerald-400 text-base">&#x2713;</span>; }
function Cross() { return <span className="text-zinc-600 text-base">&#x2717;</span>; }

export default function CompanyCheckAlternativePage() {
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
          <span className="text-zinc-300">CompanyCheck Alternative</span>
        </nav>
      </div></div>

      <section className="pt-6 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 text-xs font-medium px-3 py-1.5 rounded-full mb-6 border border-emerald-500/20">
            API-first, not website-only
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            CompanyCheck Alternative
            <br /><span className="text-emerald-400">with Full API Access</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-3xl leading-relaxed">
            CompanyCheck is a website for manual company lookups. We&apos;re an API built for
            developers and automation. Get Companies House data plus Google reviews,
            website health, and social media &mdash; all programmatically.
          </p>
        </div>
      </section>

      <section className="px-6 pb-12">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <p className="text-sm text-zinc-500 uppercase tracking-wide font-medium mb-2">CompanyCheck</p>
            <p className="text-3xl font-bold text-zinc-300">Website Only</p>
            <p className="text-sm text-zinc-500 mt-1">Manual lookups, no API</p>
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6">
            <p className="text-sm text-emerald-400 uppercase tracking-wide font-medium mb-2">UK Business Intel</p>
            <p className="text-3xl font-bold text-emerald-400">REST API + MCP</p>
            <p className="text-sm text-zinc-400 mt-1">Automate everything</p>
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
                <th className="text-center px-4 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wide">CompanyCheck</th>
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
          <h2 className="text-xl font-bold mb-4">When to Choose CompanyCheck Instead</h2>
          <div className="space-y-4 text-sm text-zinc-400 leading-relaxed">
            <p>CompanyCheck is fine if you just need:</p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong className="text-zinc-300">Quick manual lookups</strong> &mdash; Search one company at a time via their website</li>
              <li><strong className="text-zinc-300">Basic credit indicators</strong> &mdash; Simple credit risk scores</li>
            </ul>
            <p>If you need API access, automation, bulk lookups, or enriched data beyond Companies House, we&apos;re the clear upgrade.</p>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6 sm:p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">Upgrade to API Access</h2>
            <p className="text-zinc-400 text-sm mb-6">100 free lookups per month. Full REST API. No credit card required.</p>
            <a href="/#pricing" className="inline-block bg-emerald-500 text-black font-semibold px-8 py-3 rounded-lg hover:bg-emerald-400 transition-colors text-sm">Get Free API Key</a>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ukbusinessintel.com' },
        { '@type': 'ListItem', position: 2, name: 'Compare', item: 'https://ukbusinessintel.com/compare' },
        { '@type': 'ListItem', position: 3, name: 'CompanyCheck Alternative', item: 'https://ukbusinessintel.com/compare/companycheck-alternative' },
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
