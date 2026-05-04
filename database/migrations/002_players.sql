-- ============================================================================
-- MIGRATION 002: Players & Statistics Tables
-- ============================================================================

BEGIN;

-- Create players table
CREATE TABLE IF NOT EXISTS players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unique_identifier VARCHAR(255) UNIQUE NOT NULL,
    cricapi_id VARCHAR(50),
    espn_id VARCHAR(50),
    full_name VARCHAR(100) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    common_name VARCHAR(100),
    country VARCHAR(50) NOT NULL,
    country_code VARCHAR(5),
    role VARCHAR(50),
    batting_style VARCHAR(50),
    bowling_style VARCHAR(50),
    bowling_arm VARCHAR(20),
    image_url TEXT,
    thumb_url TEXT,
    bio TEXT,
    date_of_birth DATE,
    birth_place VARCHAR(200),
    height_cm INT,
    nickname VARCHAR(100),
    debut_odi DATE,
    debut_test DATE,
    debut_t20 DATE,
    last_played DATE,
    is_active BOOLEAN DEFAULT TRUE,
    is_legend BOOLEAN DEFAULT FALSE,
    icc_ranking_batting INT,
    icc_ranking_bowling INT,
    icc_ranking_allrounder INT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create player_stats table
CREATE TABLE IF NOT EXISTS player_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    format VARCHAR(20) NOT NULL,
    matches INT DEFAULT 0,
    innings INT DEFAULT 0,
    not_out INT DEFAULT 0,
    runs INT DEFAULT 0,
    highest_score INT,
    highest_score_notout BOOLEAN DEFAULT FALSE,
    balls_faced INT DEFAULT 0,
    hundreds INT DEFAULT 0,
    fifties INT DEFAULT 0,
    fours INT DEFAULT 0,
    sixes INT DEFAULT 0,
    batting_average DECIMAL(8,2),
    strike_rate DECIMAL(8,2),
    ducks INT DEFAULT 0,
    wickets INT DEFAULT 0,
    balls_bowled INT DEFAULT 0,
    runs_conceded INT DEFAULT 0,
    maidens INT DEFAULT 0,
    best_bowling VARCHAR(20),
    best_bowling_figures VARCHAR(20),
    five_wickets INT DEFAULT 0,
    ten_wickets INT DEFAULT 0,
    bowling_average DECIMAL(8,2),
    economy_rate DECIMAL(8,2),
    bowling_strike_rate DECIMAL(8,2),
    catches INT DEFAULT 0,
    stumpings INT DEFAULT 0,
    run_outs INT DEFAULT 0,
    player_of_match INT DEFAULT 0,
    player_of_series INT DEFAULT 0,
    year INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id, format, year)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_players_country ON players(country);
CREATE INDEX IF NOT EXISTS idx_players_role ON players(role);
CREATE INDEX IF NOT EXISTS idx_players_name ON players(full_name);
CREATE INDEX IF NOT EXISTS idx_players_cricapi ON players(cricapi_id);
CREATE INDEX IF NOT EXISTS idx_player_stats_player ON player_stats(player_id);
CREATE INDEX IF NOT EXISTS idx_player_stats_format ON player_stats(format);

COMMIT;