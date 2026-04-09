CREATE TABLE IF NOT EXISTS responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  client_id TEXT,
  source TEXT NOT NULL DEFAULT 'web',
  scene TEXT NOT NULL DEFAULT '[]',
  level TEXT,
  shape0 TEXT,
  toe TEXT,
  instep TEXT,
  arch TEXT,
  heel TEXT,
  street_size REAL,
  feel TEXT,
  recommended_brand TEXT,
  recommended_model TEXT,
  recommended_size REAL,
  alternative_models TEXT NOT NULL DEFAULT '[]',
  matched_count INTEGER NOT NULL DEFAULT 0,
  answers TEXT NOT NULL DEFAULT '{}',
  recommendation TEXT NOT NULL DEFAULT '{}',
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_responses_created_at ON responses(created_at DESC);
