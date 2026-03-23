'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface KeyData {
  api_key: string;
  plan: string;
  email: string;
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const email = searchParams.get('email');
  const [keyData, setKeyData] = useState<KeyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID found. Please try again from the pricing page.');
      setLoading(false);
      return;
    }

    // Poll for the API key (webhook might take a moment to process)
    let attempts = 0;
    const maxAttempts = 10;

    const poll = async () => {
      try {
        const res = await fetch(`/api/v1/checkout/status?session_id=${sessionId}&email=${encodeURIComponent(email || '')}`);
        const data = await res.json();

        if (data.success && data.data?.api_key) {
          setKeyData(data.data);
          setLoading(false);
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 2000);
        } else {
          setError('Your payment was successful! Your API key is being generated \u2014 this can take up to a minute. Please refresh this page shortly, or contact support if the issue persists.');
          setLoading(false);
        }
      } catch {
        setError('Failed to retrieve your API key. Please contact support.');
        setLoading(false);
      }
    };

    poll();
  }, [sessionId, email]);

  const copyKey = () => {
    if (keyData?.api_key) {
      navigator.clipboard.writeText(keyData.api_key);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6">
      <div className="max-w-lg w-full">
        {loading ? (
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-2">Processing your payment...</h1>
            <p className="text-zinc-400">This usually takes a few seconds.</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-yellow-400 text-3xl">!</span>
            </div>
            <h1 className="text-2xl font-bold mb-4">Almost there</h1>
            <p className="text-zinc-400 mb-6">{error}</p>
            <a href="/#pricing" className="text-emerald-400 hover:underline">Back to pricing</a>
          </div>
        ) : keyData ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold mb-2">You&apos;re all set!</h1>
            <p className="text-zinc-400 mb-8">
              Welcome to the <span className="text-emerald-400 font-semibold capitalize">{keyData.plan}</span> plan.
            </p>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6 text-left">
              <p className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Your API Key</p>
              <div className="flex items-center gap-3">
                <code className="text-sm font-mono text-emerald-400 flex-1 break-all">{keyData.api_key}</code>
                <button
                  onClick={copyKey}
                  className="shrink-0 bg-zinc-800 hover:bg-zinc-700 text-white text-xs px-3 py-1.5 rounded transition-colors"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 mb-8 text-left">
              <p className="text-red-400 text-sm font-medium mb-1">Save this key now</p>
              <p className="text-zinc-400 text-xs">
                This key will not be shown again. Store it securely in your environment variables.
                We&apos;ve also emailed it to you (check spam if you don&apos;t see it).
              </p>
            </div>

            <div className="space-y-3">
              <a
                href="/#docs"
                className="block w-full bg-emerald-500 text-black font-semibold py-2.5 rounded-lg hover:bg-emerald-400 transition-colors text-sm"
              >
                View API Documentation
              </a>
              <a
                href="/"
                className="block w-full border border-zinc-700 text-zinc-300 font-medium py-2.5 rounded-lg hover:bg-zinc-800 transition-colors text-sm"
              >
                Back to Home
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
