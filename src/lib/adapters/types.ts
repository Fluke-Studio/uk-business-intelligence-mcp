export interface AdapterInput {
  business_name: string;
  location: string;
  company_number?: string;
  domain?: string;
}

export interface AdapterResult<T> {
  success: boolean;
  data: T | null;
  source: string;
  cached: boolean;
  error?: string;
}

export interface DataSourceAdapter<T> {
  source: string;
  cacheTtlSeconds: number;
  getCacheKey(input: AdapterInput): string | null;
  /** Derive a cache key from fetch results (for adapters that discover IDs during fetch) */
  getResultCacheKey?(data: T): string | null;
  fetch(input: AdapterInput): Promise<AdapterResult<T>>;
}
