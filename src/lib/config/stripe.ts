import Stripe from 'stripe';

// Singleton Stripe client
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('Missing STRIPE_SECRET_KEY environment variable');
  }

  _stripe = new Stripe(key);
  return _stripe;
}

// Map plan names to Stripe Price IDs
// Replace these with your actual Stripe Price IDs after creating products
export const STRIPE_PRICES: Record<string, { monthly: string; annual: string }> = {
  starter: {
    monthly: process.env.STRIPE_PRICE_STARTER_MONTHLY || '',
    annual: process.env.STRIPE_PRICE_STARTER_ANNUAL || '',
  },
  growth: {
    monthly: process.env.STRIPE_PRICE_GROWTH_MONTHLY || '',
    annual: process.env.STRIPE_PRICE_GROWTH_ANNUAL || '',
  },
  scale: {
    monthly: process.env.STRIPE_PRICE_SCALE_MONTHLY || '',
    annual: process.env.STRIPE_PRICE_SCALE_ANNUAL || '',
  },
};

export function getStripePriceId(plan: string, annual: boolean): string | null {
  const prices = STRIPE_PRICES[plan];
  if (!prices) return null;
  const priceId = annual ? prices.annual : prices.monthly;
  return priceId || null;
}
