-- ============================================
-- WORLD CUP STATS TABLES
-- Migration: 009_world_cup_stats.sql
-- ============================================

-- 1. Tournament Leaders (Most runs, wickets, etc. per tournament)
DROP TABLE IF EXISTS world_cup_tournament_stats CASCADE;
CREATE TABLE world_cup_tournament_stats (
    id SERIAL PRIMARY KEY,
    tournament_id INTEGER REFERENCES world_cup_tournaments(id) ON DELETE CASCADE,
    category VARCHAR(30) NOT NULL, -- 'most_runs', 'most_wickets', 'most_sixes', 'most_hundreds', 'most_fifties', 'best_bowling'
    player_id INTEGER REFERENCES players(id) ON DELETE SET NULL,
    value INTEGER,
    rank INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tournament_id, category, rank)
);

-- 2. All-Time World Cup Records
DROP TABLE IF EXISTS world_cup_all_time_records CASCADE;
CREATE TABLE world_cup_all_time_records (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL, -- 'most_runs_all_time', 'most_wickets_all_time', etc.
    player_id INTEGER REFERENCES players(id) ON DELETE SET NULL,
    value INTEGER,
    matches_played INTEGER,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create indexes
CREATE INDEX idx_wc_stats_tournament ON world_cup_tournament_stats(tournament_id);
CREATE INDEX idx_wc_stats_category ON world_cup_tournament_stats(category);
CREATE INDEX idx_wc_records_category ON world_cup_all_time_records(category);


-- ============================================
-- SEED ALL-TIME WORLD CUP RECORDS
-- ============================================

-- Most Runs All-Time
INSERT INTO world_cup_all_time_records (category, player_id, value, matches_played, description) VALUES
('most_runs_all_time', (SELECT id FROM players WHERE name = 'Sachin Tendulkar'), 2278, 45, 'Most runs in World Cup history'),
('most_runs_all_time', (SELECT id FROM players WHERE name = 'Ricky Ponting'), 1743, 46, 'Second most runs'),
('most_runs_all_time', (SELECT id FROM players WHERE name = 'Virat Kohli'), 1230, 26, 'Third most runs'),
('most_runs_all_time', (SELECT id FROM players WHERE name = 'Kumar Sangakkara'), 1532, 37, 'Fourth most runs'),
('most_runs_all_time', (SELECT id FROM players WHERE name = 'Brian Lara'), 1225, 34, 'Fifth most runs');

-- Most Wickets All-Time
INSERT INTO world_cup_all_time_records (category, player_id, value, matches_played, description) VALUES
('most_wickets_all_time', (SELECT id FROM players WHERE name = 'Glenn McGrath'), 71, 39, 'Most wickets in World Cup history'),
('most_wickets_all_time', (SELECT id FROM players WHERE name = 'Muttiah Muralitharan'), 68, 40, 'Second most wickets'),
('most_wickets_all_time', (SELECT id FROM players WHERE name = 'Wasim Akram'), 55, 38, 'Third most wickets');

-- Most Sixes All-Time
INSERT INTO world_cup_all_time_records (category, player_id, value, matches_played, description) VALUES
('most_sixes_all_time', (SELECT id FROM players WHERE name = 'Chris Gayle'), 49, 35, 'Most sixes in World Cup history'),
('most_sixes_all_time', (SELECT id FROM players WHERE name = 'AB de Villiers'), 37, 23, 'Second most sixes'),
('most_sixes_all_time', (SELECT id FROM players WHERE name = 'Rohit Sharma'), 32, 28, 'Third most sixes');

-- Most Hundreds All-Time
INSERT INTO world_cup_all_time_records (category, player_id, value, matches_played, description) VALUES
('most_hundreds_all_time', (SELECT id FROM players WHERE name = 'Rohit Sharma'), 7, 28, 'Most centuries in World Cup history'),
('most_hundreds_all_time', (SELECT id FROM players WHERE name = 'Sachin Tendulkar'), 6, 45, 'Second most centuries'),
('most_hundreds_all_time', (SELECT id FROM players WHERE name = 'Ricky Ponting'), 5, 46, 'Third most centuries');