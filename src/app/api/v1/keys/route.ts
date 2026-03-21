import { NextRequest } from 'next/server';
import { randomBytes, createHash } from 'crypto';
import { supabase } from '@/lib/supabase/client';
import { createKeyRequestSchema } from '@/lib/schemas/request';
import { authenticate } from '@/lib/middleware/authenticate';

function hashApiKey(rawKey: string): string {
  const salt = process.env.API_KEY_SALT || '';
  return createHash('sha256').update(salt + rawKey).digest('hex');
}

function generateApiKey(): string {
  return 'ukb_' + randomBytes(16).toString('hex');
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
