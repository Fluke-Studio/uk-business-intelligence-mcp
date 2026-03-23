import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getStripe, getStripePriceId } from '@/lib/config/stripe';
import { supabase } from '@/lib/supabase/client';

const checkoutSchema = z.object({
  email: z.string().email('Valid email is required'),
  plan: z.enum(['starter', 'growth', 'scale']),
  annual: z.boolean().optional().default(false),
});

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { success: false, error: 'Invalid request', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, plan, annual } = parsed.data;
    const stripe = getStripe();

    // Get the correct Stripe Price ID
    const priceId = getStripePriceId(plan, annual);
    if (!priceId) {
      return Response.json(
        { success: false, error: 'Price not configured for this plan. Please contact support.' },
        { status: 400 }
      );
    }

    // Find or create Stripe Customer
    let stripeCustomerId: string | undefined;

    const { data: existingUser } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('email', email)
      .maybeSingle();

    if (existingUser?.stripe_customer_id) {
      stripeCustomerId = existingUser.stripe_customer_id;
    } else {
      // Check if customer already exists in Stripe
      const existingCustomers = await stripe.customers.list({ email, limit: 1 });
      if (existingCustomers.data.length > 0) {
        stripeCustomerId = existingCustomers.data[0].id;
      } else {
        const customer = await stripe.customers.create({ email });
        stripeCustomerId = customer.id;
      }
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { plan, email },
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}&email=${encodeURIComponent(email)}`,
      cancel_url: `${appUrl}/#pricing`,
      allow_promotion_codes: true,
    });

    return Response.json({
      success: true,
      data: { url: session.url },
    });
  } catch (err) {
    console.error('Checkout error:', err);
    return Response.json(
      { success: false, error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
