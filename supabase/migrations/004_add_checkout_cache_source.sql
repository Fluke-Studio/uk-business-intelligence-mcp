-- ============================================================
-- Migration 004: Allow 'checkout' as a cache source
-- ============================================================

ALTER TABLE cache DROP CONSTRAINT IF EXISTS cache_source_check;
ALTER TABLE cache ADD CONSTRAINT cache_source_check
  CHECK (source IN ('companies_house', 'google_places', 'dns', 'scrape', 'checkout'));
