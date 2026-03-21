'use client';

import { useState, useEffect, useCallback } from 'react';

interface UsageData {
  plan: string;
  month: string;
  lookups_used: number;
  lookups_limit: number;
  lookups_remaining: number;
  overage_count: number;
  rate_limit_per_minute: number;
}

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: UsageData };

const STORAGE_KEY = 'ukbi_api_key';

const planColors: Record<string, string> = {
  free: 'bg-zinc-700 text-zinc-200',
  starter: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  growth: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  scale: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
};

function getProgressColor(pct: number) {
  if (pct >= 90) return 'bg-red-500';
  if (pct >= 60) return 'bg-amber-500';
  return 'bg-emerald-500';
}

export default function DashboardPage() {
  const [apiKey, setApiKey] = useState('');
  const [inputKey, setInputKey] = useState('');
  const [state, setState] = useState<State>({ status: 'idle' });

  const fetchUsage = useCallback(async (key: string) => {
    setState({ status: 'loading' });
    try {
      const res = await fetch('/api/v1/usage', {
        headers: { 'x-api-key': key },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || `Invalid API key or request failed (${res.status})`);
      }
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Unknown error');
      setState({ status: 'success', data: json.data });
    } catch (err) {
      setState({ status: 'error', message: err instanceof Error ? err.message : 'Something went wrong' });
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setApiKey(saved);
      fetchUsage(saved);
    }
  }, [fetchUsage]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = inputKey.trim();
    if (!trimmed) return;
    localStorage.setItem(STORAGE_KEY, trimmed);
    setApiKey(trimmed);
    fetchUsage(trimmed);
  }

  function handleClearKey() {
    localStorage.removeItem(STORAGE_KEY);
    setApiKey('');
    setInputKey('');
    setState({ status: 'idle' });
  }

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
            <a href="/#demo" className="text-zinc-400 hover:text-white transition-colors">Demo</a>
            <a href="/#pricing" className="text-zinc-400 hover:text-white transition-colors">Pricing</a>
            <a href="/docs" className="text-zinc-400 hover:text-white transition-colors">Docs</a>
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">API Usage Dashboard</h1>
          <p className="text-zinc-400 text-sm mb-8">Monitor your API usage and plan limits.</p>

          {/* No key saved — show input form */}
          {!apiKey && state.status !== 'loading' && (
            <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <label htmlFor="api-key-input" className="block text-sm font-medium mb-2">
                Enter your API key
              </label>
              <p className="text-xs text-zinc-500 mb-4">
                Your key will be saved in your browser&apos;s local storage for convenience.
              </p>
              <div className="flex gap-3">
                <input
                  id="api-key-input"
                  type="text"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="ukbi_live_..."
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm font-mono placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <button
                  type="submit"
                  className="bg-emerald-500 text-black font-semibold px-6 py-2.5 rounded-lg hover:bg-emerald-400 transition-colors text-sm shrink-0"
                >
                  Check Usage
                </button>
              </div>
            </form>
          )}

          {/* Loading */}
          {state.status === 'loading' && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-zinc-400">Loading your usage data...</p>
            </div>
          )}

          {/* Error */}
          {state.status === 'error' && (
            <div className="bg-zinc-900 border border-red-500/30 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-red-400 mb-1">Failed to load usage</h3>
                  <p className="text-sm text-zinc-400 mb-4">{state.message}</p>
                  <button
                    onClick={handleClearKey}
                    className="text-sm text-zinc-400 hover:text-white underline transition-colors"
                  >
                    Try a different key
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Success */}
          {state.status === 'success' && (() => {
            const d = state.data;
            const pct = d.lookups_limit > 0 ? (d.lookups_used / d.lookups_limit) * 100 : 0;
            const monthLabel = new Date(d.month + '-01').toLocaleDateString('en-GB', {
              month: 'long',
              year: 'numeric',
            });

            return (
              <div className="space-y-4">
                {/* Warning banners */}
                {pct >= 90 && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-red-400 text-lg">!</span>
                      <p className="text-sm text-red-300">
                        <span className="font-semibold">Almost at limit.</span> You&apos;ve used {Math.round(pct)}% of your monthly lookups.
                      </p>
                    </div>
                    <a
                      href="/#pricing"
                      className="bg-red-500 text-white font-semibold px-4 py-1.5 rounded-lg hover:bg-red-400 transition-colors text-xs shrink-0"
                    >
                      Upgrade Plan
                    </a>
                  </div>
                )}
                {pct >= 60 && pct < 90 && (
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-amber-400 text-lg">!</span>
                      <p className="text-sm text-amber-300">
                        <span className="font-semibold">Running low.</span> You&apos;ve used {Math.round(pct)}% of your monthly lookups.
                      </p>
                    </div>
                    <a
                      href="/#pricing"
                      className="bg-amber-500 text-black font-semibold px-4 py-1.5 rounded-lg hover:bg-amber-400 transition-colors text-xs shrink-0"
                    >
                      Upgrade Plan
                    </a>
                  </div>
                )}

                {/* Main card */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                  {/* Plan + Month */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${planColors[d.plan] || planColors.free}`}>
                        {d.plan}
                      </span>
                      <span className="text-sm text-zinc-500">{monthLabel}</span>
                    </div>
                    <span className="text-xs text-zinc-500 bg-zinc-800 px-3 py-1 rounded-full">
                      {d.rate_limit_per_minute} req/min
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-zinc-300 font-medium">
                        {d.lookups_used.toLocaleString()} / {d.lookups_limit.toLocaleString()} lookups used
                      </span>
                      <span className="text-zinc-500">{Math.round(pct)}%</span>
                    </div>
                    <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${getProgressColor(pct)}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Remaining */}
                  <p className="text-sm text-zinc-400 mt-3">
                    <span className="text-white font-medium">{d.lookups_remaining.toLocaleString()}</span> lookups remaining this month
                  </p>

                  {/* Overage */}
                  {d.overage_count > 0 && (
                    <p className="text-sm text-amber-400 mt-2">
                      {d.overage_count.toLocaleString()} overage requests this month
                    </p>
                  )}
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-white">{d.lookups_used.toLocaleString()}</p>
                    <p className="text-xs text-zinc-500 mt-1">Used</p>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-white">{d.lookups_remaining.toLocaleString()}</p>
                    <p className="text-xs text-zinc-500 mt-1">Remaining</p>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center col-span-2 sm:col-span-1">
                    <p className="text-2xl font-bold text-white">{d.rate_limit_per_minute}</p>
                    <p className="text-xs text-zinc-500 mt-1">Requests / min</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <a
                    href="/#pricing"
                    className="bg-emerald-500 text-black font-semibold px-6 py-2.5 rounded-lg hover:bg-emerald-400 transition-colors text-sm text-center"
                  >
                    Upgrade Plan
                  </a>
                  <button
                    onClick={() => fetchUsage(apiKey)}
                    className="border border-zinc-700 text-zinc-300 font-medium px-6 py-2.5 rounded-lg hover:bg-zinc-800 transition-colors text-sm"
                  >
                    Refresh
                  </button>
                  <button
                    onClick={handleClearKey}
                    className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors px-6 py-2.5"
                  >
                    Clear saved key
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </main>

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
            <a href="/#pricing" className="hover:text-zinc-300 transition-colors">Pricing</a>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
