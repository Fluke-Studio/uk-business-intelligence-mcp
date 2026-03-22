'use client';

import { useState } from 'react';

type DemoState = 'idle' | 'loading' | 'success' | 'error';

function syntaxHighlight(json: string): string {
  return json
    .replace(/("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*")\s*:/g, '<span class="text-emerald-400">$1</span>:')
    .replace(/:\s*("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*")/g, ': <span class="text-amber-300">$1</span>')
    .replace(/:\s*(true|false)/g, ': <span class="text-sky-400">$1</span>')
    .replace(/:\s*(null)/g, ': <span class="text-zinc-500">$1</span>')
    .replace(/:\s*(\d+\.?\d*)/g, ': <span class="text-violet-400">$1</span>');
}

export default function CompanyLookupPage() {
  const [businessName, setBusinessName] = useState('');
  const [location, setLocation] = useState('');
  const [demoState, setDemoState] = useState<DemoState>('idle');
  const [responseData, setResponseData] = useState<object | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !location.trim()) return;

    setDemoState('loading');
    setResponseData(null);
    setErrorMessage('');

    try {
      const res = await fetch('/api/v1/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business_name: businessName.trim(), location: location.trim() }),
      });

      if (!res.ok) {
        if (res.status === 429) {
          setErrorMessage('Rate limit reached. You get 5 free lookups per day — come back tomorrow or get an API key for unlimited access.');
        } else {
          const body = await res.json().catch(() => null);
          setErrorMessage(body?.error || `Request failed (${res.status}). Please try again.`);
        }
        setDemoState('error');
        return;
      }

      const data = await res.json();
      setResponseData(data);
      setDemoState('success');
    } catch {
      setErrorMessage('Network error. Please check your connection and try again.');
      setDemoState('error');
    }
  };

  return (
    <>
      <title>Free Companies House Lookup Tool | UK Business Intelligence</title>
      <meta name="description" content="Free Companies House lookup tool. Search any UK company by name and location to get company status, directors, registered address, and more. No signup required." />
      <meta name="keywords" content="companies house lookup, companies house search, UK company search, company check, companies house free" />
      <link rel="canonical" href="https://ukbusinessintel.com/tools/company-lookup" />

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
              <a href="/#demo" className="text-zinc-400 hover:text-white transition-colors">Demo</a>
              <a href="/#pricing" className="text-zinc-400 hover:text-white transition-colors">Pricing</a>
              <a href="/docs" className="text-zinc-400 hover:text-white transition-colors">Docs</a>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="pt-32 pb-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 text-xs font-medium px-3 py-1.5 rounded-full mb-6 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Free tool &mdash; no signup required
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Free Companies House
              <br />
              <span className="text-emerald-400">Lookup</span>
            </h1>

            <p className="text-lg text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Look up any UK company instantly. Get company status, registered address, directors,
              and filing history &mdash; powered by live Companies House data.
            </p>
          </div>
        </section>

        {/* Search Form */}
        <section className="px-6 pb-12">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label htmlFor="business-name" className="block text-sm text-zinc-400 mb-1.5">Business Name</label>
                  <input
                    id="business-name"
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Greggs"
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="location" className="block text-sm text-zinc-400 mb-1.5">Location</label>
                  <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Newcastle"
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={demoState === 'loading' || !businessName.trim() || !location.trim()}
                className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
              >
                {demoState === 'loading' ? 'Looking up...' : 'Look Up Company'}
              </button>
              <p className="text-zinc-500 text-xs">
                5 free lookups per day. No API key needed.
              </p>
            </form>
          </div>
        </section>

        {/* Results */}
        <section className="px-6 pb-20">
          <div className="max-w-4xl mx-auto">
            {demoState === 'loading' && (
              <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8">
                <div className="flex flex-col items-center justify-center min-h-[160px] gap-4">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <p className="text-zinc-400 text-sm">Searching Companies House records...</p>
                </div>
              </div>
            )}

            {demoState === 'error' && (
              <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8">
                <div className="flex items-center justify-center min-h-[160px]">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-900/30 mb-4">
                      <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <p className="text-red-400 text-sm">{errorMessage}</p>
                  </div>
                </div>
              </div>
            )}

            {demoState === 'success' && responseData && (
              <>
                <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
                  <div className="border-b border-zinc-800 px-4 sm:px-6 py-3">
                    <h2 className="text-sm font-semibold text-zinc-300">Company Lookup Result</h2>
                  </div>
                  <div className="p-3 sm:p-6 overflow-x-auto">
                    <pre className="text-xs sm:text-sm font-mono leading-relaxed whitespace-pre-wrap break-words">
                      <code
                        className="text-zinc-300"
                        dangerouslySetInnerHTML={{
                          __html: syntaxHighlight(JSON.stringify(responseData, null, 2)),
                        }}
                      />
                    </pre>
                  </div>
                </div>

                {/* Upsell CTA */}
                <div className="mt-8 bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6 sm:p-8 text-center">
                  <h3 className="text-xl font-bold mb-3">Get the Full Picture</h3>
                  <p className="text-zinc-400 text-sm mb-6 max-w-xl mx-auto leading-relaxed">
                    This free lookup shows Companies House data. The full API also returns
                    <span className="text-emerald-400"> Google reviews &amp; ratings</span>,
                    <span className="text-emerald-400"> SSL certificate status</span>,
                    <span className="text-emerald-400"> website health checks</span>, and
                    <span className="text-emerald-400"> social media links</span> &mdash; all in one API call.
                  </p>
                  <a
                    href="/#pricing"
                    className="inline-block bg-emerald-500 text-black font-semibold px-8 py-3 rounded-lg hover:bg-emerald-400 transition-colors text-sm"
                  >
                    Get Free API Key &mdash; 100 lookups/month
                  </a>
                </div>
              </>
            )}
          </div>
        </section>

        {/* SEO Content */}
        <section className="px-6 pb-20 border-t border-zinc-800/50 pt-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">About This Companies House Lookup Tool</h2>
            <div className="space-y-4 text-sm text-zinc-400 leading-relaxed">
              <p>
                This free Companies House lookup tool lets you search for any UK registered company
                by name and location. Results are pulled from live Companies House data, giving you
                up-to-date information about company status, registered address, and more.
              </p>
              <p>
                Unlike the official Companies House website, our lookup enriches the data with
                additional sources including Google Places ratings, website health checks, SSL
                certificate verification, and social media presence detection.
              </p>
              <h3 className="text-lg font-semibold text-white pt-4">What data do you get?</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>Company status (active, dissolved, liquidation)</li>
                <li>Registered office address</li>
                <li>Company number and incorporation date</li>
                <li>SIC codes and company type</li>
                <li>Director and officer information</li>
                <li>Recent filing history</li>
              </ul>
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
            <div className="flex items-center gap-6 text-sm text-zinc-500">
              <a href="/docs" className="hover:text-zinc-300 transition-colors">API Docs</a>
              <a href="/#pricing" className="hover:text-zinc-300 transition-colors">Pricing</a>
              <span>&copy; {new Date().getFullYear()}</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
