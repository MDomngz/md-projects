const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'fantasy.db'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin')),
    team_name TEXT,
    budget REAL DEFAULT 100.0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    team TEXT NOT NULL,
    position TEXT NOT NULL CHECK(position IN ('G', 'F', 'C')),
    number INTEGER,
    height TEXT,
    price REAL DEFAULT 10.0,
    ppg REAL DEFAULT 0,
    rpg REAL DEFAULT 0,
    apg REAL DEFAULT 0,
    spg REAL DEFAULT 0,
    bpg REAL DEFAULT 0,
    fpg REAL DEFAULT 0,
    headshot_url TEXT,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS rosters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    player_id INTEGER NOT NULL,
    slot TEXT NOT NULL CHECK(slot IN ('G1', 'G2', 'F1', 'F2', 'C', 'UTIL1', 'UTIL2', 'BENCH1', 'BENCH2', 'BENCH3')),
    acquired_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (player_id) REFERENCES players(id),
    UNIQUE(user_id, slot),
    UNIQUE(user_id, player_id)
  );

  CREATE TABLE IF NOT EXISTS scoring_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER NOT NULL,
    game_date TEXT NOT NULL,
    points INTEGER DEFAULT 0,
    rebounds INTEGER DEFAULT 0,
    assists INTEGER DEFAULT 0,
    steals INTEGER DEFAULT 0,
    blocks INTEGER DEFAULT 0,
    turnovers INTEGER DEFAULT 0,
    fantasy_points REAL DEFAULT 0,
    FOREIGN KEY (player_id) REFERENCES players(id)
  );

  CREATE TABLE IF NOT EXISTS league_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    home_team TEXT NOT NULL,
    away_team TEXT NOT NULL,
    game_date TEXT NOT NULL,
    game_time TEXT NOT NULL,
    home_score INTEGER,
    away_score INTEGER,
    status TEXT DEFAULT 'scheduled' CHECK(status IN ('scheduled', 'live', 'final')),
    venue TEXT,
    broadcast TEXT
  );
`);

module.exports = db;
