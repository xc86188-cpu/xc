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

CREATE TABLE IF NOT EXISTS admin_users (
  email TEXT PRIMARY KEY,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(is_active);

CREATE TABLE IF NOT EXISTS admin_sessions (
  session_token TEXT PRIMARY KEY,
  admin_email TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  expires_at TEXT NOT NULL,
  FOREIGN KEY (admin_email) REFERENCES admin_users(email)
);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_email ON admin_sessions(admin_email);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);
