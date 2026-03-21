import { NextRequest } from 'next/server';
import { authenticate } from '@/lib/middleware/authenticate';
import { getPlanConfig } from '@/lib/config/plans';
import { supabase } from '@/lib/supabase/client';

function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}

export async function GET(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key');
    const auth = await authenticate(apiKey);
    if (!auth.success) {
      return Response.json({ success: false, error: auth.error }, { status: 401 });
    }

    const month = getCurrentMonth();
    const planConfig = getPlanConfig(auth.user.plan);

    const { data: usageData } = await supabase
      .from('usage')
      .select('lookup_count, overage_count')
      .eq('api_key_id', auth.apiKeyRecord.id)
      .eq('month', month)
      .maybeSingle();

    const lookupCount = usageData?.lookup_count ?? 0;
    const overageCount = usageData?.overage_count ?? 0;

    return Response.json({
      success: true,
      data: {
        plan: auth.user.plan,
        month,
        lookups_used: lookupCount,
        lookups_limit: planConfig.monthlyLimit,
        lookups_remaining: Math.max(0, planConfig.monthlyLimit - lookupCount),
        overage_count: overageCount,
        rate_limit_per_minute: planConfig.ratePerMinute,
      },
    });
  } catch (err) {
    console.error('Unhandled error in /api/v1/usage:', err);
    return Response.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
