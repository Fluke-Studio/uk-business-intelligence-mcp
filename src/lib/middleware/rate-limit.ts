import { supabase } from '@/lib/supabase/client';
import { getPlanConfig } from '@/lib/config/plans';

function truncateToMinute(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes());
}

export async function checkRateLimit(
  apiKeyId: string,
  plan: string
): Promise<{ allowed: boolean }> {
  const planConfig = getPlanConfig(plan);
  const windowStart = truncateToMinute(new Date()).toISOString();

  const { data, error } = await supabase.rpc('increment_rate_limit', {
    p_api_key_id: apiKeyId,
    p_window_start: windowStart,
  });

  if (error) {
    // Fail closed — block request if rate limit check is unavailable
    console.error('Rate limit check failed:', error);
    return { allowed: false };
  }

  const hitCount = Array.isArray(data) ? data[0]?.hit_count : data?.hit_count;
  return { allowed: (hitCount || 0) <= planConfig.ratePerMinute };
}
