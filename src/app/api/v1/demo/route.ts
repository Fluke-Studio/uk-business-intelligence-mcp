import { NextRequest } from 'next/server';
import { z } from 'zod';
import { enrichBusiness } from '@/lib/services/enrichment';
import { supabase } from '@/lib/supabase/client';

// --- DB-backed IP rate limiter (5 requests per IP per day) ---

const DAILY_LIMIT = 5;

function truncateToDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

async function checkDemoRateLimit(ip: string): Promise<{ allowed: boolean; remaining: number }> {
  const windowStart = truncateToDay(new Date()).toISOString();

  // Reuse the existing increment_rate_limit RPC with a synthetic key
  const { data, error } = await supabase.rpc('increment_rate_limit', {
    p_api_key_id: `demo:${ip}`,
    p_window_start: windowStart,
  });

  if (error) {
    // Fail closed — block request if rate limit check is unavailable
    console.error('Demo rate limit check failed:', error);
    return { allowed: false, remaining: 0 };
  }

  const hitCount = Array.isArray(data) ? data[0]?.hit_count : data?.hit_count;
  const count = hitCount || 0;
  return { allowed: count <= DAILY_LIMIT, remaining: Math.max(0, DAILY_LIMIT - count) };
}

// --- Validation schema (inline, minimal) ---

const demoRequestSchema = z.object({
  business_name: z.string().min(1).max(200),
  location: z.string().min(1).max(200),
});

// --- Route handlers ---

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

    const parsed = demoRequestSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { success: false, error: 'Invalid request', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // 2. IP-based rate limit — use x-real-ip (set by Vercel, not spoofable)
    const ip = request.headers.get('x-real-ip') ?? request.ip ?? 'unknown';

    const rateCheck = await checkDemoRateLimit(ip);
    if (!rateCheck.allowed) {
      return Response.json(
        { success: false, error: 'Demo rate limit exceeded. Maximum 5 requests per day.' },
        { status: 429, headers: { 'Retry-After': '86400' } }
      );
    }

    // 3. Orchestrate enrichment
    const result = await enrichBusiness(parsed.data);

    // 4. Return response
    return Response.json(
      { success: true, data: result },
      {
        status: 200,
        headers: { 'X-Demo-Remaining': String(rateCheck.remaining) },
      }
    );
  } catch (err) {
    console.error('Unhandled error in /api/v1/demo:', err);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
