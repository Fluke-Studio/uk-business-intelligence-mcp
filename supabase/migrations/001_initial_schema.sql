-- ============================================================
-- Local Business Intelligence API — Initial Schema
-- ============================================================

-- Users table
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  company_name  TEXT,
  plan          TEXT NOT NULL DEFAULT 'free'
                CHECK (plan IN ('free', 'starter', 'growth', 'scale')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- API keys table (stores SHA-256 hashes, never raw keys)
CREATE TABLE api_keys (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  key_hash      TEXT UNIQUE NOT NULL,
  key_prefix    TEXT NOT NULL,
  label         TEXT DEFAULT 'default',
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_at    TIMESTAMPTZ
);
CREATE INDEX idx_api_keys_hash ON api_keys(key_hash);

-- Monthly usage tracking
CREATE TABLE usage (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id    UUID NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
  month         TEXT NOT NULL,
  lookup_count  INTEGER NOT NULL DEFAULT 0,
  overage_count INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(api_key_id, month)
);
CREATE INDEX idx_usage_key_month ON usage(api_key_id, month);

-- Rate limit tracking (fixed-window per-minute counters)
CREATE TABLE rate_limit_hits (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id    UUID NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
  window_start  TIMESTAMPTZ NOT NULL,
  hit_count     INTEGER NOT NULL DEFAULT 1,
  UNIQUE(api_key_id, window_start)
);
CREATE INDEX idx_rate_limit ON rate_limit_hits(api_key_id, window_start);

-- Unified cache table
CREATE TABLE cache (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key     TEXT UNIQUE NOT NULL,
  source        TEXT NOT NULL
                CHECK (source IN ('companies_house', 'google_places', 'dns', 'scrape')),
  data          JSONB NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at    TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_cache_key ON cache(cache_key);
CREATE INDEX idx_cache_expires ON cache(expires_at);

-- Request log (debugging and analytics)
CREATE TABLE request_log (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id    UUID NOT NULL REFERENCES api_keys(id),
  request_body  JSONB NOT NULL,
  response_sources TEXT[] NOT NULL DEFAULT '{}',
  duration_ms   INTEGER,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_request_log_key ON request_log(api_key_id, created_at DESC);

-- ============================================================
-- RPC Functions (atomic operations)
-- ============================================================

-- Atomic rate limit increment
CREATE OR REPLACE FUNCTION increment_rate_limit(
  p_api_key_id UUID,
  p_window_start TIMESTAMPTZ
)
RETURNS TABLE(hit_count INTEGER) AS $$
BEGIN
  RETURN QUERY
  INSERT INTO rate_limit_hits (api_key_id, window_start, hit_count)
  VALUES (p_api_key_id, p_window_start, 1)
  ON CONFLICT (api_key_id, window_start)
  DO UPDATE SET hit_count = rate_limit_hits.hit_count + 1
  RETURNING rate_limit_hits.hit_count;
END;
$$ LANGUAGE plpgsql;

-- Atomic usage increment (returns new count)
CREATE OR REPLACE FUNCTION increment_usage(
  p_api_key_id UUID,
  p_month TEXT
)
RETURNS TABLE(lookup_count INTEGER) AS $$
BEGIN
  RETURN QUERY
  INSERT INTO usage (api_key_id, month, lookup_count)
  VALUES (p_api_key_id, p_month, 1)
  ON CONFLICT (api_key_id, month)
  DO UPDATE SET lookup_count = usage.lookup_count + 1
  RETURNING usage.lookup_count;
END;
$$ LANGUAGE plpgsql;

-- Atomic overage increment
CREATE OR REPLACE FUNCTION increment_overage(
  p_api_key_id UUID,
  p_month TEXT
)
RETURNS void AS $$
BEGIN
  UPDATE usage
  SET overage_count = overage_count + 1
  WHERE api_key_id = p_api_key_id AND month = p_month;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- Cleanup Functions
-- ============================================================

-- Delete expired cache entries
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM cache WHERE expires_at < now();
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Delete rate limit hits older than 1 hour
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM rate_limit_hits WHERE window_start < now() - INTERVAL '1 hour';
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Combined cleanup (call this from pg_cron or manually)
-- To schedule hourly in Supabase: enable pg_cron extension, then run:
--   SELECT cron.schedule('cleanup-expired-data', '0 * * * *',
--     $$ SELECT cleanup_expired_cache(); SELECT cleanup_old_rate_limits(); $$
--   );
CREATE OR REPLACE FUNCTION cleanup_all()
RETURNS TABLE(cache_deleted INTEGER, rate_limits_deleted INTEGER) AS $$
BEGIN
  cache_deleted := cleanup_expired_cache();
  rate_limits_deleted := cleanup_old_rate_limits();
  RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- Auto-update updated_at timestamp
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
