import { supabase } from '@/lib/supabase/client';

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}

export async function GET() {
  const startTime = Date.now();

  try {
    const { error } = await supabase.from('users').select('id').limit(1);
    const dbHealthy = !error;
    const latencyMs = Date.now() - startTime;

    if (dbHealthy) {
      return Response.json({
        success: true,
        data: {
          status: 'healthy',
          version: 'v1',
          timestamp: new Date().toISOString(),
          checks: { database: 'connected' },
          latency_ms: latencyMs,
        },
      });
    }

    return Response.json(
      {
        success: false,
        error: 'Service degraded',
        data: {
          status: 'degraded',
          version: 'v1',
          timestamp: new Date().toISOString(),
          checks: { database: `error: ${error.message}` },
          latency_ms: latencyMs,
        },
      },
      { status: 503 }
    );
  } catch (err) {
    return Response.json(
      {
        success: false,
        error: 'Service unhealthy',
        data: {
          status: 'unhealthy',
          version: 'v1',
          timestamp: new Date().toISOString(),
          checks: { database: `error: ${err instanceof Error ? err.message : 'Unknown'}` },
          latency_ms: Date.now() - startTime,
        },
      },
      { status: 503 }
    );
  }
}
