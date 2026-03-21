import DemoSection from './components/DemoSection';
import PricingTable from './components/PricingTable';

const dataSources = [
  {
    title: 'Companies House',
    description: 'Is this company active or dissolved? Who runs it? Where\'s it registered? Full Companies House record without touching their clunky API.',
    icon: (
      <svg aria-hidden="true" className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    cache: '7-day cache',
  },
  {
    title: 'Google Places',
    description: 'What do customers think? How do they get in touch? Star ratings, review counts, phone numbers, and Google Maps links in one call.',
    icon: (
      <svg aria-hidden="true" className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    cache: '24hr cache',
  },
  {
    title: 'Website & SSL',
    description: 'Is their website actually live? Is the SSL certificate valid or about to expire? Instant domain health check.',
    icon: (
      <svg aria-hidden="true" className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    cache: '24hr cache',
  },
  {
    title: 'Social Media',
    description: 'Are they active on social media? Facebook, Instagram, LinkedIn, and Twitter/X links found automatically from their website.',
    icon: (
      <svg aria-hidden="true" className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    cache: '24hr cache',
  },
];

const steps = [
  {
    number: '1',
    title: 'Get Your API Key',
    description: 'Sign up with your email. Get a free API key instantly — 100 lookups/month, no card required.',
  },
  {
    number: '2',
    title: 'Make a Request',
    description: 'Send a business name and location. That\'s it. Two fields, one POST request.',
  },
  {
    number: '3',
    title: 'Get the Full Picture',
    description: 'Get back company status, star ratings, SSL health, and social links \u2014 all matched to the same business, ready to use.',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-[family-name:var(--font-geist-sans)] overflow-x-hidden w-full">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-black font-bold text-sm">
              UK
            </div>
            <span className="font-semibold text-sm hidden sm:block">Business Intel API</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm">
            <a href="#demo" className="text-zinc-400 hover:text-white transition-colors">Demo</a>
            <a href="#sources" className="text-zinc-400 hover:text-white transition-colors hidden sm:block">Sources</a>
            <a href="#pricing" className="text-zinc-400 hover:text-white transition-colors">Pricing</a>
            <a href="/docs" className="text-zinc-400 hover:text-white transition-colors">Docs</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 text-xs font-medium px-3 py-1.5 rounded-full mb-6 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Now with MCP support for Claude Desktop
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
            UK Business Intelligence
            <br />
            <span className="text-emerald-400">in One API Call</span>
          </h1>

          <p className="text-lg text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Know everything about any UK business in under 2 seconds. Company records, reviews,
            website health, and social profiles &mdash; one API call, one JSON response.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#pricing"
              className="bg-emerald-500 text-black font-semibold px-8 py-3 rounded-lg hover:bg-emerald-400 transition-colors text-sm"
            >
              Get Free API Key
            </a>
            <a
              href="#demo"
              className="border border-zinc-700 text-zinc-300 font-medium px-8 py-3 rounded-lg hover:bg-zinc-800 transition-colors text-sm"
            >
              See Live Demo
            </a>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-12 text-xs text-zinc-500">
            <span>100 free lookups/month</span>
            <span className="hidden sm:block w-1 h-1 bg-zinc-700 rounded-full" />
            <span>No credit card required</span>
            <span className="hidden sm:block w-1 h-1 bg-zinc-700 rounded-full" />
            <span>MCP compatible</span>
          </div>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="py-20 px-6 border-t border-zinc-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 md:gap-12">
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5 sm:p-8">
              <h3 className="text-red-400 font-semibold mb-4 text-sm uppercase tracking-wide">The problem</h3>
              <ul className="space-y-3 text-sm text-zinc-400">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">&#x2717;</span>
                  Spend days wiring up Companies House, Google Places, DNS lookups, and web scrapers
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">&#x2717;</span>
                  Write matching logic to figure out if two records are the same business
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">&#x2717;</span>
                  Build your own caching, retry logic, and failure handling for each provider
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">&#x2717;</span>
                  Pay enterprise vendors &pound;2,250+/year for what should be a simple lookup
                </li>
              </ul>
            </div>
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5 sm:p-8">
              <h3 className="text-emerald-400 font-semibold mb-4 text-sm uppercase tracking-wide">Our solution</h3>
              <ul className="space-y-3 text-sm text-zinc-400">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">&#x2713;</span>
                  One API key, one POST request, one JSON response
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">&#x2713;</span>
                  Intelligent matching across Companies House &amp; Google Places
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">&#x2713;</span>
                  Built-in caching, rate limiting, and graceful degradation
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">&#x2713;</span>
                  Developer-friendly pricing from &pound;0/month
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Demo */}
      <DemoSection />

      {/* How It Works */}
      <section className="py-24 px-6 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 sm:mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Sources */}
      <section id="sources" className="py-24 px-6 border-t border-zinc-800/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">Four Data Sources, One Response</h2>
          <p className="text-zinc-400 text-center mb-12 max-w-xl mx-auto">
            Every lookup queries all four sources in parallel, with intelligent caching to keep costs low.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {dataSources.map((source) => (
              <div
                key={source.title}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6 hover:border-zinc-700 transition-colors overflow-hidden"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="shrink-0 hidden sm:block">{source.icon}</div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                      <h3 className="font-semibold text-sm sm:text-base">{source.title}</h3>
                      <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">{source.cache}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{source.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MCP Section */}
      <section className="py-24 px-6 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-400 text-xs font-medium px-3 py-1.5 rounded-full mb-6 border border-purple-500/20">
            MCP Compatible
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Works with Claude Desktop</h2>
          <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
            Ask Claude &ldquo;Is this business legit?&rdquo; and get directors, reviews, website status,
            and social profiles back instantly. One line of config, zero code.
          </p>

          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 sm:p-6 max-w-lg mx-auto text-left overflow-x-auto">
            <pre className="text-xs sm:text-sm font-mono text-zinc-300 whitespace-pre-wrap break-all">
              <code>{`npx uk-business-intelligence-mcp`}</code>
            </pre>
          </div>
          <p className="text-zinc-500 text-xs mt-4">
            That&apos;s the entire setup. One command. Works with Claude Desktop, Cursor, and any MCP client.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <PricingTable />

      {/* API Reference Preview */}
      <section id="docs" className="py-24 px-6 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">API Reference</h2>
          <p className="text-zinc-400 text-center mb-12">
            Simple REST API. One endpoint does everything.
          </p>

          <div className="space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded">POST</span>
                <code className="text-xs sm:text-sm font-mono text-zinc-300 break-all">/api/v1/enrich</code>
              </div>
              <p className="text-sm text-zinc-400 mb-4">
                Enrich a UK business. Returns a comprehensive profile from all data sources.
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="text-zinc-500 text-xs uppercase tracking-wide mb-2">Required</h4>
                  <ul className="space-y-1 text-zinc-400">
                    <li><code className="text-emerald-400">business_name</code> &mdash; Business name</li>
                    <li><code className="text-emerald-400">location</code> &mdash; City or town</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-zinc-500 text-xs uppercase tracking-wide mb-2">Optional</h4>
                  <ul className="space-y-1 text-zinc-400">
                    <li><code className="text-zinc-500">company_number</code> &mdash; Companies House number</li>
                    <li><code className="text-zinc-500">domain</code> &mdash; Business website domain</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2 py-0.5 rounded">POST</span>
                  <code className="text-xs font-mono text-zinc-400 break-all">/api/v1/keys</code>
                </div>
                <p className="text-xs text-zinc-500">Create a new API key</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-500/10 text-blue-400 text-xs font-bold px-2 py-0.5 rounded">GET</span>
                  <code className="text-xs font-mono text-zinc-400">/api/v1/usage</code>
                </div>
                <p className="text-xs text-zinc-500">Check your usage quota</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-500/10 text-blue-400 text-xs font-bold px-2 py-0.5 rounded">GET</span>
                  <code className="text-xs font-mono text-zinc-400">/api/v1/health</code>
                </div>
                <p className="text-xs text-zinc-500">Service health check</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-zinc-800/50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Start Enriching UK Businesses Today</h2>
          <p className="text-zinc-400 mb-8">
            Your first 100 lookups are free. No card. No commitment. Just data.
          </p>
          <a
            href="#pricing"
            className="inline-block bg-emerald-500 text-black font-semibold px-8 py-3 rounded-lg hover:bg-emerald-400 transition-colors text-sm"
          >
            Get Started for Free
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center text-black font-bold text-xs">
              UK
            </div>
            <span className="text-sm text-zinc-400">Business Intelligence API</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-zinc-500">
            <a href="/docs" className="hover:text-zinc-300 transition-colors">API Docs</a>
            <a href="/tools/company-lookup" className="hover:text-zinc-300 transition-colors">Company Lookup</a>
            <a href="/tools/business-checker" className="hover:text-zinc-300 transition-colors">Business Checker</a>
            <a href="#pricing" className="hover:text-zinc-300 transition-colors">Pricing</a>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
