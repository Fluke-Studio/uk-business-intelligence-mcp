import { NextRequest } from 'next/server';
import { z } from 'zod';
import { enrichBusiness } from '@/lib/services/enrichment';

// --- In-memory IP rate limiter (5 requests per IP per day) ---

const DAILY_LIMIT = 5;
const DAY_MS = 24 * 60 * 60 * 1000;

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

function checkDemoRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  // No entry or expired — start fresh
  if (!entry || now >= entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + DAY_MS });
    return { allowed: true, remaining: DAILY_LIMIT - 1 };
  }

  if (entry.count >= DAILY_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: DAILY_LIMIT - entry.count };
}

// Periodically purge expired entries to avoid unbounded memory growth
setInterval(() => {
  const now = Date.now();
  rateLimitMap.forEach((entry, ip) => {
    if (now >= entry.resetAt) {
      rateLimitMap.delete(ip);
    }
  });
}, DAY_MS);

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

    // 2. IP-based rate limit (no auth required)
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip') ??
      'unknown';

    const rateCheck = checkDemoRateLimit(ip);
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
