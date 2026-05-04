-- backend/src/db/migrations/012_auth_tables.sql

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255),
    google_id VARCHAR(100) UNIQUE,
    avatar_url TEXT,
    is_guest BOOLEAN DEFAULT false,
    guest_id VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- User game stats for Kwik Cricket
CREATE TABLE IF NOT EXISTS kwik_cricket_user_stats (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    matches_played INTEGER DEFAULT 0,
    matches_won INTEGER DEFAULT 0,
    total_runs INTEGER DEFAULT 0,
    total_wickets INTEGER DEFAULT 0,
    highest_score INTEGER DEFAULT 0,
    best_bowling VARCHAR(20),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Match history
CREATE TABLE IF NOT EXISTS kwik_cricket_match_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    user_team VARCHAR(50),
    opponent_team VARCHAR(50),
    overs INTEGER,
    user_score INTEGER,
    user_wickets INTEGER,
    opponent_score INTEGER,
    opponent_wickets INTEGER,
    result VARCHAR(20),
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Saved game state (for continue feature)
CREATE TABLE IF NOT EXISTS kwik_cricket_saved_games (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    game_state JSONB,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_guest_id ON users(guest_id);
CREATE INDEX IF NOT EXISTS idx_match_history_user_id ON kwik_cricket_match_history(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_games_user_id ON kwik_cricket_saved_games(user_id);