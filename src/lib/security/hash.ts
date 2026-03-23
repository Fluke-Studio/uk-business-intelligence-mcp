import { createHash, randomBytes } from 'crypto';
import { requireEnv } from '@/lib/config/env';

export function hashApiKey(rawKey: string): string {
  const salt = requireEnv('API_KEY_SALT');
  return createHash('sha256').update(salt + rawKey).digest('hex');
}

export function generateApiKey(): string {
  return 'ukb_' + randomBytes(16).toString('hex');
}
