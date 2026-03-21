const REQUIRED_VARS = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'COMPANIES_HOUSE_API_KEY',
  'GOOGLE_PLACES_API_KEY',
  'API_KEY_SALT',
] as const;

interface EnvValidationResult {
  valid: boolean;
  missing: string[];
  warnings: string[];
}

export function validateEnv(): EnvValidationResult {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);
  const warnings: string[] = [];

  if (missing.length > 0) {
    console.warn(
      `[uk-business-intel] Missing environment variables: ${missing.join(', ')}. ` +
        'Some features will not work until these are configured.'
    );
  }

  // Check API_KEY_SALT is not the default placeholder
  const salt = process.env.API_KEY_SALT;
  if (salt && (salt === 'change-me-to-a-random-string-32ch' || salt.length < 32)) {
    const msg = salt.length < 32
      ? `API_KEY_SALT is only ${salt.length} characters. Use at least 32 for security.`
      : 'API_KEY_SALT is using the default placeholder. Generate a random string: openssl rand -hex 32';
    warnings.push(msg);
    console.warn(`[uk-business-intel] ${msg}`);
  }

  // Check Supabase URL format
  const supabaseUrl = process.env.SUPABASE_URL;
  if (supabaseUrl && !supabaseUrl.includes('.supabase.co')) {
    warnings.push('SUPABASE_URL does not look like a Supabase URL. Expected: https://your-project.supabase.co');
  }

  return { valid: missing.length === 0, missing, warnings };
}

export function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}
