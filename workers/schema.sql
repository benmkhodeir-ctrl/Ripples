CREATE TABLE IF NOT EXISTS submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  type TEXT NOT NULL CHECK(type IN ('join','contact')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  location TEXT,
  can_help TEXT,
  asked_about TEXT,
  curious TEXT,
  learning TEXT,
  need_help TEXT,
  meet TEXT,
  happy_to TEXT,
  work_context TEXT,
  links TEXT,
  message TEXT,
  consent INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'new',
  request_key TEXT
);

CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_request_key ON submissions(request_key);
