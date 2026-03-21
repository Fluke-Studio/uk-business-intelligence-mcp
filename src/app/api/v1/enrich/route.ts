import { NextRequest } from 'next/server';
import { enrichRequestSchema } from '@/lib/schemas/request';
import { authenticate } from '@/lib/middleware/authenticate';
import { checkRateLimit } from '@/lib/middleware/rate-limit';
import { checkAndIncrementUsage } from '@/lib/middleware/usage';
import { enrichBusiness } from '@/lib/services/enrichment';
import { supabase } from '@/lib/supabase/client';

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}

export async function POST(request: NextRequest) {
  try {
    // 1. Parse and validate body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return Response.json(
        { success: false, error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const parsed = enrichRequestSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { success: false, error: 'Invalid request', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // 2. Authenticate
    const apiKey = request.headers.get('x-api-key');
    const auth = await authenticate(apiKey);
    if (!auth.success) {
      return Response.json(
        { success: false, error: auth.error },
        { status: 401 }
      );
    }

    // 3. Rate limit check
    const rateCheck = await checkRateLimit(auth.apiKeyRecord.id, auth.user.plan);
    if (!rateCheck.allowed) {
      return Response.json(
        { success: false, error: 'Rate limit exceeded. Try again in 60 seconds.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

    // 4. Quota check + increment
    const usageCheck = await checkAndIncrementUsage(auth.apiKeyRecord.id, auth.user.plan);
    if (!usageCheck.allowed) {
      return Response.json(
        { success: false, error: 'Monthly quota exceeded', limit: usageCheck.limit, current: usageCheck.currentCount },
        { status: 403 }
      );
    }

    // 5. Orchestrate enrichment
    const result = await enrichBusiness(parsed.data);

    // 6. Log request (fire-and-forget)
    Promise.resolve(
      supabase
        .from('request_log')
        .insert({
          api_key_id: auth.apiKeyRecord.id,
          request_body: parsed.data,
          response_sources: result.meta.sources_successful,
          duration_ms: result.meta.duration_ms,
        })
    )
      .then(({ error: logErr }) => {
        if (logErr) console.error('[request_log] Failed to log request:', logErr.message);
      })
      .catch((err: unknown) => console.error('[request_log] Unexpected error:', err));

    // 7. Return response
    return Response.json({ success: true, data: result }, { status: 200 });
  } catch (err) {
    console.error('Unhandled error in /api/v1/enrich:', err);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
