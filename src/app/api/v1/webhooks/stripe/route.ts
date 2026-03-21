import { NextRequest } from 'next/server';
import { getStripe } from '@/lib/config/stripe';
import { supabase } from '@/lib/supabase/client';
import { randomBytes, createHash } from 'crypto';
import Stripe from 'stripe';
import { sendApiKeyEmail } from '@/lib/services/email';

function hashApiKey(rawKey: string): string {
  const salt = process.env.API_KEY_SALT || '';
  return createHash('sha256').update(salt + rawKey).digest('hex');
}

function generateApiKey(): string {
  return 'ukb_' + randomBytes(16).toString('hex');
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return Response.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('[webhook] STRIPE_WEBHOOK_SECRET not configured');
    return Response.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('[webhook] Signature verification failed:', err);
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const email = session.metadata?.email || session.customer_details?.email;
        const plan = session.metadata?.plan || 'starter';
        const stripeCustomerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (!email) {
          console.error('[webhook] No email in checkout session');
          break;
        }

        // Upsert user with Stripe details
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('email', email)
          .maybeSingle();

        let userId: string;

        if (existingUser) {
          userId = existingUser.id;
          await supabase
            .from('users')
            .update({
              plan,
              stripe_customer_id: stripeCustomerId,
              stripe_subscription_id: subscriptionId,
              subscription_status: 'active',
            })
            .eq('id', userId);
        } else {
          const { data: newUser, error: userErr } = await supabase
            .from('users')
            .insert({
              email,
              plan,
              stripe_customer_id: stripeCustomerId,
              stripe_subscription_id: subscriptionId,
              subscription_status: 'active',
            })
            .select('id')
            .single();

          if (userErr || !newUser) {
            console.error('[webhook] Failed to create user:', userErr);
            break;
          }
          userId = newUser.id;
        }

        // Generate an API key for the new subscriber
        const rawKey = generateApiKey();
        const keyHash = hashApiKey(rawKey);
        const keyPrefix = rawKey.substring(0, 12) + '...';

        await supabase.from('api_keys').insert({
          user_id: userId,
          key_hash: keyHash,
          key_prefix: keyPrefix,
          label: `${plan}-auto`,
        });

        // Store the raw key temporarily so the success page can show it
        // Uses the checkout session ID as the lookup key, expires in 10 minutes
        await supabase.from('cache').upsert({
          cache_key: `checkout:${session.id}`,
          source: 'checkout',
          data: { api_key: rawKey, plan, email },
          expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString(),
        });

        // Send API key via email
        sendApiKeyEmail(email, rawKey, plan).catch(() => {});

        console.log(`[webhook] Checkout complete: ${email} → ${plan} plan`);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const status = subscription.status === 'active' ? 'active'
          : subscription.status === 'past_due' ? 'past_due'
          : subscription.status === 'canceled' ? 'canceled'
          : 'none';

        await supabase
          .from('users')
          .update({ subscription_status: status })
          .eq('stripe_customer_id', customerId);

        console.log(`[webhook] Subscription updated: ${customerId} → ${status}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        await supabase
          .from('users')
          .update({
            plan: 'free',
            subscription_status: 'canceled',
            stripe_subscription_id: null,
          })
          .eq('stripe_customer_id', customerId);

        console.log(`[webhook] Subscription canceled: ${customerId} → downgraded to free`);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        await supabase
          .from('users')
          .update({ subscription_status: 'past_due' })
          .eq('stripe_customer_id', customerId);

        console.log(`[webhook] Payment failed: ${customerId} → past_due`);
        break;
      }
    }

    return Response.json({ received: true });
  } catch (err) {
    // Return 200 to prevent Stripe from retrying on unrecoverable errors
    console.error('[webhook] Error processing event:', err);
    return Response.json({ received: true, error: 'Processing failed but acknowledged' });
  }
}
