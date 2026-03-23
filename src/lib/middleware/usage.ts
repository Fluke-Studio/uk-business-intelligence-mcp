import { supabase } from '@/lib/supabase/client';
import { getPlanConfig } from '@/lib/config/plans';

function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export async function checkAndIncrementUsage(
  apiKeyId: string,
  plan: string
): Promise<{ allowed: boolean; currentCount: number; limit: number }> {
  const planConfig = getPlanConfig(plan);
  const month = getCurrentMonth();

  const { data, error } = await supabase.rpc('check_and_increment_usage', {
    p_api_key_id: apiKeyId,
    p_month: month,
    p_limit: planConfig.monthlyLimit,
    p_allow_overage: planConfig.allowOverage,
  });

  if (error) {
    console.error('Usage check failed:', error);
    // Fail closed — block request if usage check is unavailable
    return { allowed: false, currentCount: planConfig.monthlyLimit, limit: planConfig.monthlyLimit };
  }

  const row = Array.isArray(data) ? data[0] : data;
  const currentCount = row?.lookup_count ?? 0;
  const allowed = row?.allowed ?? true;

  return { allowed, currentCount, limit: planConfig.monthlyLimit };
}
