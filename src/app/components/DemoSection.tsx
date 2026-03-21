'use client';

import { useState } from 'react';

const MCP_CONFIG = `{
  "mcpServers": {
    "uk-business-intel": {
      "command": "npx",
      "args": ["-y", "uk-business-intelligence-mcp"]
    }
  }
}`;

type DemoState = 'idle' | 'loading' | 'success' | 'error';

function syntaxHighlight(json: string): string {
  return json
    .replace(/("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*")\s*:/g, '<span class="text-emerald-400">$1</span>:')
    .replace(/:\s*("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*")/g, ': <span class="text-amber-300">$1</span>')
    .replace(/:\s*(true|false)/g, ': <span class="text-sky-400">$1</span>')
    .replace(/:\s*(null)/g, ': <span class="text-zinc-500">$1</span>')
    .replace(/:\s*(\d+\.?\d*)/g, ': <span class="text-violet-400">$1</span>');
}

function buildCurlCommand(businessName: string, location: string): string {
  return `curl -X POST https://ukbusinessintel.com/api/v1/enrich \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ukb_your_api_key_here" \\
  -d '{
    "business_name": "${businessName}",
    "location": "${location}"
  }'`;
}

export default function DemoSection() {
  const [businessName, setBusinessName] = useState('Greggs');
  const [location, setLocation] = useState('Newcastle');
  const [activeTab, setActiveTab] = useState<'response' | 'request' | 'mcp'>('response');
  const [demoState, setDemoState] = useState<DemoState>('idle');
  const [responseData, setResponseData] = useState<object | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !location.trim()) return;

    setDemoState('loading');
    setResponseData(null);
    setErrorMessage('');
    setActiveTab('response');

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

  const tabs = [
    { id: 'response' as const, label: 'Live Response' },
    { id: 'request' as const, label: 'API Request' },
    { id: 'mcp' as const, label: 'MCP Setup' },
  ];

  return (
    <section id="demo" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">See It in Action</h2>
        <p className="text-zinc-400 text-center mb-10 max-w-xl mx-auto">
          Send a business name. Get back everything.
        </p>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <div className="flex-1">
              <label htmlFor="demo-business" className="sr-only">Business name</label>
              <input
                id="demo-business"
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Business name"
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="demo-location" className="sr-only">Location</label>
              <input
                id="demo-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={demoState === 'loading' || !businessName.trim() || !location.trim()}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors whitespace-nowrap"
            >
              {demoState === 'loading' ? 'Searching...' : 'Try It Free'}
            </button>
          </div>
          <p className="text-zinc-500 text-xs text-center mt-3">
            No signup required. 5 free lookups per day.
          </p>
        </form>

        {/* Results Area */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
          <div className="flex border-b border-zinc-800 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-emerald-400 border-b-2 border-emerald-400 bg-zinc-800/50'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-3 sm:p-6 overflow-x-auto min-h-[200px]">
            {/* Live Response Tab */}
            {activeTab === 'response' && (
              <>
                {demoState === 'idle' && (
                  <div className="flex items-center justify-center min-h-[160px]">
                    <p className="text-zinc-500 text-sm text-center">
                      Enter a business name and click <span className="text-emerald-400">Try It Free</span> to see real data.
                    </p>
                  </div>
                )}

                {demoState === 'loading' && (
                  <div className="flex flex-col items-center justify-center min-h-[160px] gap-4">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <p className="text-zinc-400 text-sm">Enriching business data from live sources...</p>
                  </div>
                )}

                {demoState === 'success' && responseData && (
                  <pre className="text-xs sm:text-sm font-mono leading-relaxed whitespace-pre-wrap break-words">
                    <code
                      className="text-zinc-300"
                      dangerouslySetInnerHTML={{
                        __html: syntaxHighlight(JSON.stringify(responseData, null, 2)),
                      }}
                    />
                  </pre>
                )}

                {demoState === 'error' && (
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
                )}
              </>
            )}

            {/* API Request Tab */}
            {activeTab === 'request' && (
              <pre className="text-xs sm:text-sm font-mono leading-relaxed whitespace-pre-wrap break-words">
                <code className="text-zinc-300">
                  {buildCurlCommand(businessName, location)}
                </code>
              </pre>
            )}

            {/* MCP Setup Tab */}
            {activeTab === 'mcp' && (
              <>
                <pre className="text-xs sm:text-sm font-mono leading-relaxed whitespace-pre-wrap break-words">
                  <code
                    className="text-zinc-300"
                    dangerouslySetInnerHTML={{
                      __html: syntaxHighlight(MCP_CONFIG),
                    }}
                  />
                </pre>
                <p className="text-zinc-500 text-xs mt-4">
                  Add this to your Claude Desktop config. That&apos;s it &mdash; Claude can now look up any UK business.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Post-success CTA */}
        {demoState === 'success' && (
          <div className="mt-6 text-center">
            <p className="text-zinc-300 text-sm mb-2">
              Want unlimited access?
            </p>
            <a
              href="#pricing"
              className="inline-block px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors text-sm"
            >
              Get your API key &mdash; 100 lookups/month, free
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
