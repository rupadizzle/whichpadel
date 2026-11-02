-- whichpadel-accounts (D1). Apply once. The Pages functions also create these tables if they are missing.
-- Newsletter and finder alerts are stored only. Nothing here sends them.

CREATE TABLE IF NOT EXISTS users(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  created TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions(
  hash TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  expires TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS login_tokens(
  hash TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  expires TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS saved(
  user_id INTEGER NOT NULL,
  kind TEXT NOT NULL,
  slug TEXT NOT NULL,
  created TEXT NOT NULL,
  alert INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY(user_id, kind, slug)
);

CREATE TABLE IF NOT EXISTS newsletter(
  email TEXT PRIMARY KEY,
  source TEXT,
  page TEXT,
  lang TEXT,
  country TEXT,
  consent INTEGER NOT NULL,
  consent_at TEXT NOT NULL,
  confirmed INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS finder_alerts(
  email TEXT NOT NULL,
  racket TEXT NOT NULL,
  lang TEXT,
  country TEXT,
  price INTEGER,
  cur TEXT,
  answers TEXT,
  consent_at TEXT NOT NULL,
  confirmed INTEGER NOT NULL DEFAULT 0,
  created TEXT NOT NULL,
  PRIMARY KEY(email, racket)
);
