'use client';

import { useState } from 'react';

interface CheckoutModalProps {
  plan: string;
  price: string;
  annual: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ plan, price, annual, onClose }: CheckoutModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/v1/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, plan: plan.toLowerCase(), annual }),
      });

      const data = await res.json();

      if (data.success && data.data.url) {
        window.location.href = data.data.url;
      } else {
        setError(data.error || 'Failed to start checkout. Please try again.');
        setLoading(false);
      }
    } catch {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white text-lg"
          aria-label="Close"
        >
          &times;
        </button>

        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center">
            <svg aria-hidden="true" className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
          <h3 className="text-lg font-bold">{plan} Plan</h3>
        </div>

        <p className="text-zinc-400 text-sm mb-6">
          {annual
            ? `\u00a3${price}/year (billed annually)`
            : `\u00a3${price}/month`
          }
          {' \u2014 '}you&apos;ll be taken to Stripe&apos;s secure checkout.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="checkout-email" className="text-sm text-zinc-400 block mb-1">
            Email address
          </label>
          <input
            id="checkout-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 mb-4"
            autoFocus
          />

          {error && (
            <p className="text-red-400 text-xs mb-3">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 text-black font-semibold py-2.5 rounded-lg hover:bg-emerald-400 transition-colors text-sm disabled:opacity-50"
          >
            {loading ? 'Redirecting to Stripe...' : 'Continue to Payment'}
          </button>
        </form>

        <p className="text-zinc-600 text-xs text-center mt-4">
          Secure payment powered by Stripe. Cancel anytime.
        </p>
      </div>
    </div>
  );
}
