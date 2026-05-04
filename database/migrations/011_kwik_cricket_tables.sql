-- backend/src/db/migrations/011_kwik_cricket_tables.sql

-- Create Kwik Cricket stats table
CREATE TABLE IF NOT EXISTS kwik_cricket_stats (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    session_id VARCHAR(100),
    matches_played INTEGER DEFAULT 0,
    matches_won INTEGER DEFAULT 0,
    total_runs INTEGER DEFAULT 0,
    total_wickets INTEGER DEFAULT 0,
    highest_score INTEGER DEFAULT 0,
    best_bowling VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create match history table
CREATE TABLE IF NOT EXISTS kwik_cricket_matches (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(100),
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

-- Create tournament stats table
CREATE TABLE IF NOT EXISTS kwik_cricket_tournaments (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(100),
    tournament_name VARCHAR(50),
    tournament_type VARCHAR(20),
    matches_played INTEGER DEFAULT 0,
    matches_won INTEGER DEFAULT 0,
    points INTEGER DEFAULT 0,
    nrr DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);