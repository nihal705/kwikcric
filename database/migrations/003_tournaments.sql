-- ============================================================================
-- MIGRATION 003: Tournaments, Teams & Matches
-- ============================================================================

BEGIN;

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    short_code VARCHAR(10),
    full_name VARCHAR(150),
    country VARCHAR(50),
    country_code VARCHAR(5),
    city VARCHAR(100),
    home_ground VARCHAR(200),
    coach VARCHAR(100),
    captain_id UUID REFERENCES players(id),
    vice_captain_id UUID REFERENCES players(id),
    team_logo_url TEXT,
    jersey_image_url TEXT,
    primary_color VARCHAR(7),
    secondary_color VARCHAR(7),
    founded_year INT,
    championships INT DEFAULT 0,
    team_type VARCHAR(30),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create tournaments table
CREATE TABLE IF NOT EXISTS tournaments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    short_name VARCHAR(20),
    tournament_type VARCHAR(50) NOT NULL,
    gender VARCHAR(10) DEFAULT 'Men',
    season VARCHAR(20) NOT NULL,
    year INT NOT NULL,
    host_country VARCHAR(100),
    host_cities TEXT[],
    start_date DATE,
    end_date DATE,
    total_matches INT,
    total_teams INT,
    winner_id UUID REFERENCES players(id),
    winner_team_id UUID REFERENCES teams(id),
    runner_up_id UUID REFERENCES players(id),
    runner_up_team_id UUID REFERENCES teams(id),
    player_of_tournament_id UUID REFERENCES players(id),
    most_runs_player_id UUID REFERENCES players(id),
    most_runs_value INT,
    most_wickets_player_id UUID REFERENCES players(id),
    most_wickets_value INT,
    prize_pool_usd DECIMAL(12,2),
    winning_prize_usd DECIMAL(12,2),
    logo_url TEXT,
    status VARCHAR(20) DEFAULT 'upcoming',
    format VARCHAR(20),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, season)
);

-- Create tournament_teams table
CREATE TABLE IF NOT EXISTS tournament_teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    captain_id UUID REFERENCES players(id),
    vice_captain_id UUID REFERENCES players(id),
    coach VARCHAR(100),
    squad JSONB,
    points INT DEFAULT 0,
    matches_played INT DEFAULT 0,
    matches_won INT DEFAULT 0,
    matches_lost INT DEFAULT 0,
    matches_tied INT DEFAULT 0,
    matches_nr INT DEFAULT 0,
    net_run_rate DECIMAL(6,3),
    for_runs INT DEFAULT 0,
    for_wickets INT DEFAULT 0,
    against_runs INT DEFAULT 0,
    against_wickets INT DEFAULT 0,
    position INT,
    qualified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tournament_id, team_id)
);

-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
    match_number INT,
    match_date DATE NOT NULL,
    match_time TIME,
    venue_name VARCHAR(200),
    venue_city VARCHAR(100),
    venue_country VARCHAR(50),
    team1_id UUID REFERENCES teams(id),
    team2_id UUID REFERENCES teams(id),
    toss_winner_id UUID REFERENCES teams(id),
    toss_decision VARCHAR(10),
    winner_team_id UUID REFERENCES teams(id),
    win_margin VARCHAR(50),
    win_margin_runs INT,
    win_margin_wickets INT,
    man_of_match_id UUID REFERENCES players(id),
    player_of_match_id UUID REFERENCES players(id),
    umpire1 VARCHAR(100),
    umpire2 VARCHAR(100),
    third_umpire VARCHAR(100),
    match_referee VARCHAR(100),
    status VARCHAR(20) DEFAULT 'scheduled',
    current_score VARCHAR(100),
    current_overs VARCHAR(20),
    scorecard_json JSONB,
    commentary_json JSONB,
    highlights_url TEXT,
    match_summary TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tournaments_year ON tournaments(year);
CREATE INDEX IF NOT EXISTS idx_tournaments_type ON tournaments(tournament_type);
CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(match_date);
CREATE INDEX IF NOT EXISTS idx_matches_tournament ON matches(tournament_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);

COMMIT;