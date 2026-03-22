'use client';

import { useState } from 'react';

type DemoState = 'idle' | 'loading' | 'success' | 'error';

interface ResponseData {
  companies_house?: {
    company_name?: string;
    company_status?: string;
    company_number?: string;
    registered_address?: string;
    date_of_creation?: string;
    [key: string]: unknown;
  };
  google_places?: {
    rating?: number;
    user_ratings_total?: number;
    formatted_phone_number?: string;
    [key: string]: unknown;
  };
  website?: {
    is_live?: boolean;
    status_code?: number;
    [key: string]: unknown;
  };
  ssl?: {
    valid?: boolean;
    issuer?: string;
    expires?: string;
    [key: string]: unknown;
  };
  social_media?: {
    facebook?: string | null;
    instagram?: string | null;
    linkedin?: string | null;
    twitter?: string | null;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

function syntaxHighlight(json: string): string {
  return json
    .replace(/("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*")\s*:/g, '<span class="text-emerald-400">$1</span>:')
    .replace(/:\s*("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*")/g, ': <span class="text-amber-300">$1</span>')
    .replace(/:\s*(true|false)/g, ': <span class="text-sky-400">$1</span>')
    .replace(/:\s*(null)/g, ': <span class="text-zinc-500">$1</span>')
    .replace(/:\s*(\d+\.?\d*)/g, ': <span class="text-violet-400">$1</span>');
}

function TrustIndicator({ label, value, status }: { label: string; value: string; status: 'green' | 'red' | 'yellow' | 'neutral' }) {
  const colors = {
    green: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    red: 'bg-red-500/10 border-red-500/30 text-red-400',
    yellow: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    neutral: 'bg-zinc-800 border-zinc-700 text-zinc-400',
  };
  const dots = {
    green: 'bg-emerald-400',
    red: 'bg-red-400',
    yellow: 'bg-amber-400',
    neutral: 'bg-zinc-500',
  };

  return (
    <div className={`rounded-lg border p-4 ${colors[status]}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className={`w-2 h-2 rounded-full ${dots[status]}`} />
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(<span key={i} className="text-amber-400">&#9733;</span>);
    } else if (i - rating < 1) {
      stars.push(<span key={i} className="text-amber-400/50">&#9733;</span>);
    } else {
      stars.push(<span key={i} className="text-zinc-600">&#9733;</span>);
    }
  }
  return <span className="text-lg">{stars}</span>;
}

export default function BusinessCheckerPage() {
  const [businessName, setBusinessName] = useState('');
  const [location, setLocation] = useState('');
  const [demoState, setDemoState] = useState<DemoState>('idle');
  const [responseData, setResponseData] = useState<ResponseData | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showRawData, setShowRawData] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !location.trim()) return;

    setDemoState('loading');
    setResponseData(null);
    setErrorMessage('');
    setShowRawData(false);

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

  const getCompanyStatus = (): { value: string; status: 'green' | 'red' | 'yellow' | 'neutral' } => {
    const s = responseData?.companies_house?.company_status?.toLowerCase();
    if (!s) return { value: 'Unknown', status: 'neutral' };
    if (s === 'active') return { value: 'Active', status: 'green' };
    if (s === 'dissolved') return { value: 'Dissolved', status: 'red' };
    return { value: s.charAt(0).toUpperCase() + s.slice(1), status: 'yellow' };
  };

  const getGoogleRating = (): { value: string; status: 'green' | 'red' | 'yellow' | 'neutral' } => {
    const rating = responseData?.google_places?.rating;
    const count = responseData?.google_places?.user_ratings_total;
    if (!rating) return { value: 'No ratings found', status: 'neutral' };
    const status = rating >= 4 ? 'green' : rating >= 3 ? 'yellow' : 'red';
    return { value: `${rating}/5 (${count ?? 0} reviews)`, status };
  };

  const getWebsiteStatus = (): { value: string; status: 'green' | 'red' | 'neutral' } => {
    if (!responseData?.website) return { value: 'Not checked', status: 'neutral' };
    return responseData.website.is_live
      ? { value: 'Website is live', status: 'green' }
      : { value: 'Website is down', status: 'red' };
  };

  const getSslStatus = (): { value: string; status: 'green' | 'red' | 'neutral' } => {
    if (!responseData?.ssl) return { value: 'Not checked', status: 'neutral' };
    return responseData.ssl.valid
      ? { value: 'Valid SSL certificate', status: 'green' }
      : { value: 'Invalid or missing SSL', status: 'red' };
  };

  const getSocialCount = (): { value: string; status: 'green' | 'yellow' | 'neutral' } => {
    if (!responseData?.social_media) return { value: 'Not checked', status: 'neutral' };
    const sm = responseData.social_media;
    const count = [sm.facebook, sm.instagram, sm.linkedin, sm.twitter].filter(Boolean).length;
    if (count === 0) return { value: 'No profiles found', status: 'neutral' };
    return { value: `${count} profile${count > 1 ? 's' : ''} found`, status: count >= 2 ? 'green' : 'yellow' };
  };

  return (
    <>
      <title>Is This UK Business Legit? Free Business Checker</title>
      <meta name="description" content="Check if a UK business is legitimate. Verify company status, Google reviews, website health, SSL certificate, and social media presence. Free business checker tool." />
      <meta name="keywords" content="check if UK business is legitimate, is this business legit, verify UK company, business checker, company verification" />
      <link rel="canonical" href="https://ukbusinessintel.com/tools/business-checker" />

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
              Is This UK Business
              <br />
              <span className="text-emerald-400">Legit?</span>
            </h1>

            <p className="text-lg text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Verify any UK business in seconds. Check company registration status, customer reviews,
              website health, and social media presence &mdash; all from one search.
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
                {demoState === 'loading' ? 'Checking...' : 'Check Business'}
              </button>
              <p className="text-zinc-500 text-xs">
                5 free checks per day. No API key needed.
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
                  <p className="text-zinc-400 text-sm">Verifying business across multiple sources...</p>
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
                {/* Trust Score Summary */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4">
                    Trust Summary for <span className="text-emerald-400">{responseData.companies_house?.company_name || businessName}</span>
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    <TrustIndicator
                      label="Company Status"
                      {...getCompanyStatus()}
                    />
                    <TrustIndicator
                      label="Google Rating"
                      {...getGoogleRating()}
                    />
                    <TrustIndicator
                      label="Website"
                      {...getWebsiteStatus()}
                    />
                    <TrustIndicator
                      label="SSL Certificate"
                      {...getSslStatus()}
                    />
                    <TrustIndicator
                      label="Social Media"
                      {...getSocialCount()}
                    />
                  </div>
                </div>

                {/* Google Rating Stars */}
                {responseData.google_places?.rating && (
                  <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 mb-6">
                    <div className="flex items-center gap-4">
                      <StarRating rating={responseData.google_places.rating} />
                      <div>
                        <p className="text-white font-semibold">{responseData.google_places.rating} out of 5</p>
                        <p className="text-zinc-400 text-sm">Based on {responseData.google_places.user_ratings_total ?? 0} Google reviews</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Raw Data Collapsible */}
                <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
                  <button
                    onClick={() => setShowRawData(!showRawData)}
                    className="w-full px-4 sm:px-6 py-4 flex items-center justify-between text-left hover:bg-zinc-800/50 transition-colors"
                  >
                    <span className="text-sm font-semibold text-zinc-300">Raw Data</span>
                    <svg
                      className={`w-5 h-5 text-zinc-400 transition-transform ${showRawData ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {showRawData && (
                    <div className="p-3 sm:p-6 border-t border-zinc-800 overflow-x-auto">
                      <pre className="text-xs sm:text-sm font-mono leading-relaxed whitespace-pre-wrap break-words">
                        <code
                          className="text-zinc-300"
                          dangerouslySetInnerHTML={{
                            __html: syntaxHighlight(JSON.stringify(responseData, null, 2)),
                          }}
                        />
                      </pre>
                    </div>
                  )}
                </div>

                {/* Upsell CTA */}
                <div className="mt-8 bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6 sm:p-8 text-center">
                  <h3 className="text-xl font-bold mb-3">Need to Verify Businesses at Scale?</h3>
                  <p className="text-zinc-400 text-sm mb-6 max-w-xl mx-auto leading-relaxed">
                    Integrate this trust check into your own platform with our API.
                    Verify companies programmatically &mdash; perfect for onboarding flows,
                    supplier vetting, and lead qualification.
                  </p>
                  <a
                    href="/#pricing"
                    className="inline-block bg-emerald-500 text-black font-semibold px-8 py-3 rounded-lg hover:bg-emerald-400 transition-colors text-sm"
                  >
                    Get an API Key &mdash; 100 free lookups/month
                  </a>
                </div>
              </>
            )}
          </div>
        </section>

        {/* SEO Content */}
        <section className="px-6 pb-20 border-t border-zinc-800/50 pt-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">How to Check if a UK Business is Legitimate</h2>
            <div className="space-y-4 text-sm text-zinc-400 leading-relaxed">
              <p>
                Our free business checker verifies UK companies across multiple data sources to help
                you determine if a business is legitimate. We check five key trust signals:
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li><strong className="text-zinc-300">Companies House registration</strong> &mdash; Is the company actively registered with Companies House, or has it been dissolved?</li>
                <li><strong className="text-zinc-300">Google reviews</strong> &mdash; What do real customers say? High ratings from many reviewers is a strong trust signal.</li>
                <li><strong className="text-zinc-300">Website status</strong> &mdash; Is their website actually live and responding? Dead websites are a red flag.</li>
                <li><strong className="text-zinc-300">SSL certificate</strong> &mdash; Does their website use HTTPS with a valid certificate? Essential for any legitimate business.</li>
                <li><strong className="text-zinc-300">Social media presence</strong> &mdash; Active profiles on Facebook, Instagram, LinkedIn, or Twitter/X add credibility.</li>
              </ul>
              <p>
                No single signal tells the whole story, but together they give you a reliable picture
                of whether a UK business is trustworthy.
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
