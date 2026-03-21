'use client';

import { useState } from 'react';

interface FreeSignupProps {
  onClose: () => void;
}

export default function FreeSignup({ onClose }: FreeSignupProps) {
  const [email, setEmail] = useState('');
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [copiedMcp, setCopiedMcp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/v1/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, plan: 'free' }),
      });

      const data = await res.json();

      if (data.success) {
        setApiKey(data.data.api_key);
      } else {
        setError(data.error || 'Failed to create API key');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyKey = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const curlCommand = `curl -X POST https://ukbusinessintel.com/api/v1/enrich \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ${apiKey}" \\
  -d '{"business_name": "Greggs", "location": "Newcastle"}'`;

  const copyCurl = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 3000);
  };

  const mcpConfig = `{
  "mcpServers": {
    "uk-business-intel": {
      "command": "npx",
      "args": ["-y", "uk-business-intelligence-mcp"]
    }
  }
}`;

  const copyMcp = () => {
    navigator.clipboard.writeText(mcpConfig);
    setCopiedMcp(true);
    setTimeout(() => setCopiedMcp(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white text-lg"
          aria-label="Close"
        >
          &times;
        </button>

        {!apiKey ? (
          <>
            <h3 className="text-lg font-bold mb-1">Get Your Free API Key</h3>
            <p className="text-zinc-400 text-sm mb-6">100 lookups/month, no credit card needed.</p>

            <form onSubmit={handleSubmit}>
              <label htmlFor="signup-email" className="text-sm text-zinc-400 block mb-1">
                Email address
              </label>
              <input
                id="signup-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 mb-4"
              />

              {error && (
                <p className="text-red-400 text-xs mb-3">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 text-black font-semibold py-2.5 rounded-lg hover:bg-emerald-400 transition-colors text-sm disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Get Free API Key'}
              </button>
            </form>
          </>
        ) : (
          <>
            <h3 className="text-lg font-bold mb-4 text-emerald-400">Your API Key</h3>

            <div className="bg-zinc-800 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3">
                <code className="text-sm font-mono text-emerald-400 flex-1 break-all">{apiKey}</code>
                <button
                  onClick={copyKey}
                  className="shrink-0 bg-zinc-700 hover:bg-zinc-600 text-white text-xs px-3 py-1.5 rounded transition-colors"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3 mb-6">
              <p className="text-red-400 text-xs font-medium">
                Save this key now — it won&apos;t be shown again.
              </p>
              <p className="text-zinc-500 text-xs mt-1">
                We&apos;ve also emailed it to you (check spam if you don&apos;t see it).
              </p>
            </div>

            {/* Getting Started Section */}
            <div className="border-t border-zinc-800 pt-5 mb-5">
              <h4 className="text-sm font-bold text-white mb-3">Try your first lookup</h4>
              <div className="bg-zinc-800 rounded-lg p-3 mb-2 relative">
                <pre className="text-xs font-mono text-zinc-300 whitespace-pre-wrap break-all leading-relaxed">
                  {curlCommand}
                </pre>
                <button
                  onClick={copyCurl}
                  className="absolute top-2 right-2 bg-zinc-700 hover:bg-zinc-600 text-white text-xs px-2.5 py-1 rounded transition-colors"
                >
                  {copiedCurl ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-zinc-500 text-xs mb-5">
                Paste this into your terminal to see the full enriched response.
              </p>

              <h4 className="text-sm font-bold text-white mb-3">Claude Desktop Setup</h4>
              <p className="text-zinc-400 text-xs mb-2">
                Add this to your <code className="text-emerald-400 bg-zinc-800 px-1 py-0.5 rounded text-xs">claude_desktop_config.json</code> to use with Claude:
              </p>
              <div className="bg-zinc-800 rounded-lg p-3 relative">
                <pre className="text-xs font-mono text-zinc-300 whitespace-pre-wrap break-all leading-relaxed">
                  {mcpConfig}
                </pre>
                <button
                  onClick={copyMcp}
                  className="absolute top-2 right-2 bg-zinc-700 hover:bg-zinc-600 text-white text-xs px-2.5 py-1 rounded transition-colors"
                >
                  {copiedMcp ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full border border-zinc-700 text-zinc-300 font-medium py-2.5 rounded-lg hover:bg-zinc-800 transition-colors text-sm"
            >
              Done
            </button>
          </>
        )}
      </div>
    </div>
  );
}
