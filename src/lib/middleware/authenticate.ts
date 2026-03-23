import { supabase } from '@/lib/supabase/client';
import { hashApiKey } from '@/lib/security/hash';
import { ApiKeyRecord, UserRecord } from '@/types';

type AuthSuccess = { success: true; apiKeyRecord: ApiKeyRecord; user: UserRecord };
type AuthFailure = { success: false; error: string };
export type AuthResult = AuthSuccess | AuthFailure;

export async function authenticate(apiKey: string | null): Promise<AuthResult> {
  if (!apiKey) {
    return { success: false, error: 'Missing x-api-key header' };
  }

  if (!apiKey.startsWith('ukb_')) {
    return { success: false, error: 'Invalid API key format' };
  }

  const keyHash = hashApiKey(apiKey);

  const { data: keyRecord, error: keyError } = await supabase
    .from('api_keys')
    .select('id, user_id, key_hash, key_prefix, is_active')
    .eq('key_hash', keyHash)
    .maybeSingle();

  if (keyError || !keyRecord) {
    return { success: false, error: 'Invalid API key' };
  }

  if (!keyRecord.is_active) {
    return { success: false, error: 'API key has been revoked' };
  }

  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, email, plan')
    .eq('id', keyRecord.user_id)
    .single();

  if (userError || !user) {
    return { success: false, error: 'User not found' };
  }

  return {
    success: true,
    apiKeyRecord: keyRecord as ApiKeyRecord,
    user: user as UserRecord,
  };
}
