CREATE TABLE IF NOT EXISTS shops(domain TEXT PRIMARY KEY, host TEXT NOT NULL, name TEXT, mode TEXT NOT NULL DEFAULT 'page', active INTEGER NOT NULL DEFAULT 1, note TEXT, robots TEXT, robots_at INTEGER);
CREATE TABLE IF NOT EXISTS offers(id INTEGER PRIMARY KEY, racket_id TEXT NOT NULL, shop TEXT NOT NULL REFERENCES shops(domain), url TEXT NOT NULL UNIQUE, country TEXT, currency TEXT, last_checked INTEGER DEFAULT 0, last_error TEXT, fails INTEGER DEFAULT 0);
CREATE INDEX IF NOT EXISTS offers_due ON offers(shop,last_checked);
CREATE TABLE IF NOT EXISTS price_observations(offer_id INTEGER NOT NULL REFERENCES offers(id), ts INTEGER NOT NULL, price REAL NOT NULL, currency TEXT NOT NULL, in_stock INTEGER, method TEXT);
CREATE INDEX IF NOT EXISTS obs_offer ON price_observations(offer_id,ts);
CREATE TABLE IF NOT EXISTS price_changes(offer_id INTEGER NOT NULL, ts INTEGER NOT NULL, old_price REAL, new_price REAL, currency TEXT);
CREATE TABLE IF NOT EXISTS parse_failures(offer_id INTEGER, ts INTEGER, status INTEGER, error TEXT);
