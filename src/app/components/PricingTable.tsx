'use client';

import { useState } from 'react';
import FreeSignup from './FreeSignup';
import CheckoutModal from './CheckoutModal';

const plans = [
  {
    name: 'Free',
    slug: 'free',
    price: '0',
    period: 'forever',
    lookups: '100',
    rate: '10/min',
    overage: 'Hard limit',
    features: ['All 4 data sources', 'Full JSON response', 'API key access', 'Community support'],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Starter',
    slug: 'starter',
    price: '29',
    period: '/month',
    lookups: '1,000',
    rate: '60/min',
    overage: '\u00a30.03/extra',
    features: ['Everything in Free', '6x higher rate limit', 'Overage billing', 'Email support'],
    cta: 'Start Building',
    highlighted: false,
  },
  {
    name: 'Growth',
    slug: 'growth',
    price: '79',
    period: '/month',
    lookups: '5,000',
    rate: '120/min',
    overage: '\u00a30.03/extra',
    features: ['Everything in Starter', '12x higher rate limit', 'Priority support', 'Usage dashboard'],
    cta: 'Scale Up',
    highlighted: true,
  },
  {
    name: 'Scale',
    slug: 'scale',
    price: '199',
    period: '/month',
    lookups: '20,000',
    rate: '120/min',
    overage: '\u00a30.03/extra',
    features: ['Everything in Growth', 'Volume pricing', 'Dedicated support', 'Custom integrations'],
    cta: 'Contact Us',
    highlighted: false,
  },
];

export default function PricingTable() {
  const [annual, setAnnual] = useState(false);
  const [showFreeSignup, setShowFreeSignup] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<typeof plans[number] | null>(null);

  const handlePlanClick = (plan: typeof plans[number]) => {
    if (plan.slug === 'free') {
      setShowFreeSignup(true);
    } else {
      setCheckoutPlan(plan);
    }
  };

  return (
    <>
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Simple, Transparent Pricing</h2>
          <p className="text-zinc-400 text-center mb-8 max-w-2xl mx-auto">
            Start free. Scale when you need to. Every plan includes all 4 data sources.
          </p>

          <div className="flex items-center justify-center gap-3 mb-12">
            <span className={`text-sm ${!annual ? 'text-white' : 'text-zinc-500'}`}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative w-12 h-6 rounded-full transition-colors ${annual ? 'bg-emerald-500' : 'bg-zinc-700'}`}
              aria-label="Toggle annual billing"
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${annual ? 'translate-x-6' : ''}`}
              />
            </button>
            <span className={`text-sm ${annual ? 'text-white' : 'text-zinc-500'}`}>
              Annual <span className="text-emerald-400 text-xs ml-1">Save 20%</span>
            </span>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {plans.map((plan) => {
              const displayPrice =
                plan.price === '0' ? '0' : annual ? Math.round(Number(plan.price) * 0.8).toString() : plan.price;

              return (
                <div
                  key={plan.name}
                  className={`rounded-xl p-6 flex flex-col ${
                    plan.highlighted
                      ? 'bg-emerald-500/10 border-2 border-emerald-500 relative'
                      : 'bg-zinc-900 border border-zinc-800'
                  }`}
                >
                  {plan.highlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                      POPULAR
                    </span>
                  )}

                  <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>

                  <div className="mb-4">
                    <span className="text-4xl font-bold">
                      {plan.price === '0' ? 'Free' : `\u00a3${displayPrice}`}
                    </span>
                    {plan.price !== '0' && (
                      <span className="text-zinc-400 text-sm">{plan.period}</span>
                    )}
                  </div>

                  <div className="space-y-2 mb-6 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Lookups</span>
                      <span className="font-mono">{plan.lookups}/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Rate limit</span>
                      <span className="font-mono">{plan.rate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Overage</span>
                      <span className="font-mono">{plan.overage}</span>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="text-sm text-zinc-300 flex items-start gap-2">
                        <svg aria-hidden="true" className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handlePlanClick(plan)}
                    className={`w-full py-2.5 rounded-lg font-medium text-sm transition-colors ${
                      plan.highlighted
                        ? 'bg-emerald-500 text-black hover:bg-emerald-400'
                        : 'bg-zinc-800 text-white hover:bg-zinc-700'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {showFreeSignup && <FreeSignup onClose={() => setShowFreeSignup(false)} />}

      {checkoutPlan && (
        <CheckoutModal
          plan={checkoutPlan.name}
          price={annual ? Math.round(Number(checkoutPlan.price) * 0.8 * 12).toString() : checkoutPlan.price}
          annual={annual}
          onClose={() => setCheckoutPlan(null)}
        />
      )}
    </>
  );
}
