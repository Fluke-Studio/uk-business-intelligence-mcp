import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { createKeyRequestSchema } from '@/lib/schemas/request';
import { authenticate } from '@/lib/middleware/authenticate';
import { sendApiKeyEmail } from '@/lib/services/email';
import { hashApiKey, generateApiKey } from '@/lib/security/hash';
import { DISPOSABLE_EMAIL_DOMAINS } from '@/lib/security/disposable-domains';

const KEY_CREATION_LIMIT_PER_HOUR = 5;

function truncateToHour(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours());
}

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createKeyRequestSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { success: false, error: 'Invalid request', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, plan } = parsed.data;

    // Block disposable email domains
    const emailDomain = email.split('@')[1]?.toLowerCase();
    if (emailDomain && DISPOSABLE_EMAIL_DOMAINS.has(emailDomain)) {
      return Response.json(
        { success: false, error: 'Please use a non-disposable email address' },
        { status: 400 }
      );
    }

    // IP-based rate limit on key creation (5 per hour)
    const ip = request.headers.get('x-real-ip') ?? request.ip ?? 'unknown';
    const windowStart = truncateToHour(new Date()).toISOString();

    const { data: rlData, error: rlError } = await supabase.rpc('increment_rate_limit', {
      p_api_key_id: `keycreate:${ip}`,
      p_window_start: windowStart,
    });

    if (rlError) {
      // Fail closed
      console.error('Key creation rate limit check failed:', rlError);
      return Response.json(
        { success: false, error: 'Rate limit check failed. Try again later.' },
        { status: 429 }
      );
    }

    const hitCount = Array.isArray(rlData) ? rlData[0]?.hit_count : rlData?.hit_count;
    if ((hitCount || 0) > KEY_CREATION_LIMIT_PER_HOUR) {
      return Response.json(
        { success: false, error: 'Too many key creation requests. Try again later.' },
        { status: 429, headers: { 'Retry-After': '3600' } }
      );
    }

    // Paid plans require an active Stripe subscription
    if (plan !== 'free') {
      const { data: user } = await supabase
        .from('users')
        .select('subscription_status, plan')
        .eq('email', email)
        .maybeSingle();

      if (!user || user.subscription_status !== 'active' || user.plan !== plan) {
        return Response.json(
          { success: false, error: `Active subscription required for the ${plan} plan. Please subscribe first.` },
          { status: 403 }
        );
      }
    }

    // Rate limit: max 3 keys per email (prevents abuse)
    const { data: existingKeys, error: countErr } = await supabase
      .from('api_keys')
      .select('id', { count: 'exact' })
      .eq('is_active', true)
      .in(
        'user_id',
        (await supabase.from('users').select('id').eq('email', email)).data?.map((u) => u.id) || []
      );

    if (!countErr && existingKeys && existingKeys.length >= 3) {
      return Response.json(
        { success: false, error: 'Maximum 3 active API keys per account. Revoke an existing key first.' },
        { status: 429 }
      );
    }

    // Upsert user by email
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, email, plan')
      .eq('email', email)
      .maybeSingle();

    let userId: string;

    if (existingUser) {
      userId = existingUser.id;
    } else {
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({ email, plan })
        .select('id')
        .single();

      if (userError || !newUser) {
        return Response.json(
          { success: false, error: 'Failed to create user' },
          { status: 500 }
        );
      }
      userId = newUser.id;
    }

    // Generate API key
    const rawKey = generateApiKey();
    const keyHash = hashApiKey(rawKey);
    const keyPrefix = rawKey.substring(0, 12) + '...';

    const { error: keyError } = await supabase
      .from('api_keys')
      .insert({
        user_id: userId,
        key_hash: keyHash,
        key_prefix: keyPrefix,
      });

    if (keyError) {
      return Response.json(
        { success: false, error: 'Failed to create API key' },
        { status: 500 }
      );
    }

    // Send API key via email (fire-and-forget — don't block the response)
    sendApiKeyEmail(email, rawKey, plan).catch(() => {});

    return Response.json(
      {
        success: true,
        data: {
          api_key: rawKey,
          key_prefix: keyPrefix,
          plan,
          message: 'Store this API key securely. It will not be shown again.',
        },
      },
      { status: 201 }
    );
  } catch {
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Authenticate with the key being revoked
    const apiKey = request.headers.get('x-api-key');
    const auth = await authenticate(apiKey);
    if (!auth.success) {
      return Response.json({ success: false, error: auth.error }, { status: 401 });
    }

    // Revoke the key
    const { error } = await supabase
      .from('api_keys')
      .update({ is_active: false, revoked_at: new Date().toISOString() })
      .eq('id', auth.apiKeyRecord.id);

    if (error) {
      return Response.json({ success: false, error: 'Failed to revoke key' }, { status: 500 });
    }

    return Response.json({
      success: true,
      data: {
        key_prefix: auth.apiKeyRecord.key_prefix,
        message: 'API key has been revoked and can no longer be used.',
      },
    });
  } catch {
    return Response.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
