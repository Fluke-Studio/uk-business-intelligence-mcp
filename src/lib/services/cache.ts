import { supabase } from '@/lib/supabase/client';
import { DataSourceAdapter, AdapterInput, AdapterResult } from '@/lib/adapters/types';

export async function cachedFetch<T>(
  adapter: DataSourceAdapter<T>,
  input: AdapterInput
): Promise<AdapterResult<T>> {
  const cacheKey = adapter.getCacheKey(input);

  // Check cache first (only if we can compute a key before fetching)
  if (cacheKey) {
    const { data: cached } = await supabase
      .from('cache')
      .select('data')
      .eq('cache_key', cacheKey)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (cached) {
      return {
        success: true,
        data: cached.data as T,
        source: adapter.source,
        cached: true,
      };
    }
  }

  // Fetch fresh data
  const result = await adapter.fetch(input);

  // Write to cache
  if (result.success && result.data) {
    // Use pre-computed key, or derive from result (e.g. Google Places discovers place_id during fetch)
    const writeCacheKey =
      cacheKey ||
      (adapter.getResultCacheKey ? adapter.getResultCacheKey(result.data) : null);

    if (writeCacheKey) {
      const expiresAt = new Date(Date.now() + adapter.cacheTtlSeconds * 1000).toISOString();
      Promise.resolve(
        supabase
          .from('cache')
          .upsert({
            cache_key: writeCacheKey,
            source: adapter.source,
            data: result.data,
            expires_at: expiresAt,
            created_at: new Date().toISOString(),
          })
      )
        .then(({ error }) => {
          if (error) console.error(`[cache] Failed to write ${adapter.source}:`, error.message);
        })
        .catch((err: unknown) => console.error(`[cache] Unexpected error writing ${adapter.source}:`, err));
    }
  }

  return result;
}
