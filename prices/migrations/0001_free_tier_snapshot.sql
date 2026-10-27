-- Free-tier price redesign (27 Oct 2026):
-- 1) Prebuilt JSON export chunks so page views never full-scan price_observations.
-- 2) Indexes already partially present in schema.sql; re-assert for older DBs.
-- 3) Keep 90-day history; prune is done by the worker, not here.

CREATE TABLE IF NOT EXISTS price_exports(
  key TEXT PRIMARY KEY,
  built_at INTEGER NOT NULL,
  body TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS offers_due ON offers(shop, last_checked);
CREATE INDEX IF NOT EXISTS offers_checked ON offers(last_checked);
CREATE INDEX IF NOT EXISTS obs_offer ON price_observations(offer_id, ts);
CREATE INDEX IF NOT EXISTS obs_ts ON price_observations(ts);
