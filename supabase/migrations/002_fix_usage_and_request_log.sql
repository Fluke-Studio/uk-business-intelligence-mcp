-- ============================================================
-- Migration 002: Fix usage check + request_log cascade
-- ============================================================

-- Atomic check-and-increment: only increments if under limit
-- Returns the NEW count and whether the request was allowed
CREATE OR REPLACE FUNCTION check_and_increment_usage(
  p_api_key_id UUID,
  p_month TEXT,
  p_limit INTEGER,
  p_allow_overage BOOLEAN
)
RETURNS TABLE(lookup_count INTEGER, allowed BOOLEAN) AS $$
DECLARE
  current_count INTEGER;
BEGIN
  -- Upsert to ensure row exists, get current count
  INSERT INTO usage (api_key_id, month, lookup_count)
  VALUES (p_api_key_id, p_month, 0)
  ON CONFLICT (api_key_id, month) DO NOTHING;

  SELECT u.lookup_count INTO current_count
  FROM usage u
  WHERE u.api_key_id = p_api_key_id AND u.month = p_month
  FOR UPDATE;  -- Lock the row to prevent race conditions

  -- Check if allowed
  IF NOT p_allow_overage AND current_count >= p_limit THEN
    -- Free tier at limit: block without incrementing
    RETURN QUERY SELECT current_count, false;
    RETURN;
  END IF;

  -- Allowed: increment
  UPDATE usage u
  SET lookup_count = u.lookup_count + 1
  WHERE u.api_key_id = p_api_key_id AND u.month = p_month
  RETURNING u.lookup_count INTO current_count;

  -- Track overage for paid tiers
  IF p_allow_overage AND current_count > p_limit THEN
    UPDATE usage u
    SET overage_count = u.overage_count + 1
    WHERE u.api_key_id = p_api_key_id AND u.month = p_month;
  END IF;

  RETURN QUERY SELECT current_count, true;
END;
$$ LANGUAGE plpgsql;

-- Fix request_log foreign key: add ON DELETE CASCADE
ALTER TABLE request_log
  DROP CONSTRAINT IF EXISTS request_log_api_key_id_fkey,
  ADD CONSTRAINT request_log_api_key_id_fkey
    FOREIGN KEY (api_key_id) REFERENCES api_keys(id) ON DELETE CASCADE;
