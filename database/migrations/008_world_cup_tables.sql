-- ============================================
-- WORLD CUP DATABASE TABLES
-- Migration: 008_world_cup_tables.sql
-- Description: Complete World Cup tournament data
-- ============================================

-- ============================================
-- 1. WORLD CUP TOURNAMENTS (Main table)
-- ============================================
DROP TABLE IF EXISTS world_cup_tournaments CASCADE;
CREATE TABLE world_cup_tournaments (
    id SERIAL PRIMARY KEY,
    tournament_type VARCHAR(20) NOT NULL CHECK (tournament_type IN ('odi', 't20', 'champions')),
    year INTEGER NOT NULL,
    edition INTEGER,
    host_country VARCHAR(100),
    host_countries TEXT[],
    winner_team_id INTEGER REFERENCES teams(id) ON DELETE SET NULL,
    runner_up_team_id INTEGER REFERENCES teams(id) ON DELETE SET NULL,
    winner_captain_id INTEGER REFERENCES players(id) ON DELETE SET NULL,
    runner_up_captain_id INTEGER REFERENCES players(id) ON DELETE SET NULL,
    player_of_tournament_id INTEGER REFERENCES players(id) ON DELETE SET NULL,
    best_batsman_id INTEGER REFERENCES players(id) ON DELETE SET NULL,
    best_bowler_id INTEGER REFERENCES players(id) ON DELETE SET NULL,
    best_keeper_id INTEGER REFERENCES players(id) ON DELETE SET NULL,
    final_match_winner_margin VARCHAR(100),
    final_match_venue VARCHAR(200),
    final_match_date DATE,
    total_matches INTEGER DEFAULT 0,
    total_teams INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tournament_type, year)
);

-- ============================================
-- 2. WORLD CUP MATCHES
-- ============================================
DROP TABLE IF EXISTS world_cup_matches CASCADE;
CREATE TABLE world_cup_matches (
    id SERIAL PRIMARY KEY,
    tournament_id INTEGER REFERENCES world_cup_tournaments(id) ON DELETE CASCADE,
    match_type VARCHAR(20) CHECK (match_type IN ('group', 'quarterfinal', 'semifinal', 'final', 'super_six')),
    stage VARCHAR(20) CHECK (stage IN ('group_stage', 'knockout', 'super_six')),
    group_name VARCHAR(10),
    match_number INTEGER,
    team1_id INTEGER REFERENCES teams(id) ON DELETE SET NULL,
    team2_id INTEGER REFERENCES teams(id) ON DELETE SET NULL,
    team1_score INTEGER,
    team2_score INTEGER,
    team1_wickets INTEGER,
    team2_wickets INTEGER,
    team1_overs DECIMAL(4,1),
    team2_overs DECIMAL(4,1),
    winner_team_id INTEGER REFERENCES teams(id) ON DELETE SET NULL,
    winner_margin INTEGER,
    margin_type VARCHAR(10) CHECK (margin_type IN ('runs', 'wickets')),
    venue VARCHAR(200),
    match_date DATE,
    man_of_match_id INTEGER REFERENCES players(id) ON DELETE SET NULL,
    toss_winner_id INTEGER REFERENCES teams(id) ON DELETE SET NULL,
    toss_decision VARCHAR(10) CHECK (toss_decision IN ('bat', 'field')),
    is_final BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. WORLD CUP POINTS TABLE (Group Stage)
-- ============================================
DROP TABLE IF EXISTS world_cup_points_table CASCADE;
CREATE TABLE world_cup_points_table (
    id SERIAL PRIMARY KEY,
    tournament_id INTEGER REFERENCES world_cup_tournaments(id) ON DELETE CASCADE,
    group_name VARCHAR(10),
    team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
    matches_played INTEGER DEFAULT 0,
    matches_won INTEGER DEFAULT 0,
    matches_lost INTEGER DEFAULT 0,
    matches_tied INTEGER DEFAULT 0,
    matches_nr INTEGER DEFAULT 0,
    points INTEGER DEFAULT 0,
    net_run_rate DECIMAL(10,3) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tournament_id, group_name, team_id)
);

-- ============================================
-- 4. WORLD CUP SQUADS
-- ============================================
DROP TABLE IF EXISTS world_cup_squads CASCADE;
CREATE TABLE world_cup_squads (
    id SERIAL PRIMARY KEY,
    tournament_id INTEGER REFERENCES world_cup_tournaments(id) ON DELETE CASCADE,
    team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
    player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
    jersey_number INTEGER,
    is_captain BOOLEAN DEFAULT FALSE,
    is_keeper BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tournament_id, team_id, player_id)
);

-- ============================================
-- 5. WORLD CUP TOURNAMENT STATS (Per Tournament)
-- ============================================
DROP TABLE IF EXISTS world_cup_tournament_stats CASCADE;
CREATE TABLE world_cup_tournament_stats (
    id SERIAL PRIMARY KEY,
    tournament_id INTEGER REFERENCES world_cup_tournaments(id) ON DELETE CASCADE,
    most_runs_player_id INTEGER REFERENCES players(id) ON DELETE SET NULL,
    most_runs_value INTEGER DEFAULT 0,
    most_wickets_player_id INTEGER REFERENCES players(id) ON DELETE SET NULL,
    most_wickets_value INTEGER DEFAULT 0,
    most_sixes_player_id INTEGER REFERENCES players(id) ON DELETE SET NULL,
    most_sixes_value INTEGER DEFAULT 0,
    most_hundreds_player_id INTEGER REFERENCES players(id) ON DELETE SET NULL,
    most_hundreds_value INTEGER DEFAULT 0,
    most_fifties_player_id INTEGER REFERENCES players(id) ON DELETE SET NULL,
    most_fifties_value INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 6. WORLD CUP ALL-TIME RECORDS
-- ============================================
DROP TABLE IF EXISTS world_cup_all_time_records CASCADE;
CREATE TABLE world_cup_all_time_records (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    player_id INTEGER REFERENCES players(id) ON DELETE SET NULL,
    value INTEGER DEFAULT 0,
    record_description TEXT,
    tournament_type VARCHAR(20) DEFAULT 'odi',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 7. WORLD CUP TEAM RANKINGS (All-time)
-- ============================================
DROP TABLE IF EXISTS world_cup_team_rankings CASCADE;
CREATE TABLE world_cup_team_rankings (
    id SERIAL PRIMARY KEY,
    tournament_type VARCHAR(20) NOT NULL,
    team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
    total_appearances INTEGER DEFAULT 0,
    titles_won INTEGER DEFAULT 0,
    runner_up_count INTEGER DEFAULT 0,
    semi_final_count INTEGER DEFAULT 0,
    matches_played INTEGER DEFAULT 0,
    matches_won INTEGER DEFAULT 0,
    matches_lost INTEGER DEFAULT 0,
    win_percentage DECIMAL(5,2) DEFAULT 0,
    rank_position INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tournament_type, team_id)
);

-- ============================================
-- 8. TOURNAMENT PLAYER STATS (Tournament-specific)
-- ============================================
DROP TABLE IF EXISTS tournament_player_batting CASCADE;
CREATE TABLE tournament_player_batting (
    id SERIAL PRIMARY KEY,
    tournament_id INTEGER REFERENCES world_cup_tournaments(id) ON DELETE CASCADE,
    player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
    team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
    matches INTEGER DEFAULT 0,
    innings INTEGER DEFAULT 0,
    runs INTEGER DEFAULT 0,
    highest_score INTEGER DEFAULT 0,
    average DECIMAL(8,2) DEFAULT 0,
    strike_rate DECIMAL(8,2) DEFAULT 0,
    centuries INTEGER DEFAULT 0,
    fifties INTEGER DEFAULT 0,
    fours INTEGER DEFAULT 0,
    sixes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tournament_id, player_id)
);

DROP TABLE IF EXISTS tournament_player_bowling CASCADE;
CREATE TABLE tournament_player_bowling (
    id SERIAL PRIMARY KEY,
    tournament_id INTEGER REFERENCES world_cup_tournaments(id) ON DELETE CASCADE,
    player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
    team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
    matches INTEGER DEFAULT 0,
    wickets INTEGER DEFAULT 0,
    runs_conceded INTEGER DEFAULT 0,
    balls_bowled INTEGER DEFAULT 0,
    average DECIMAL(8,2) DEFAULT 0,
    economy DECIMAL(8,2) DEFAULT 0,
    strike_rate DECIMAL(8,2) DEFAULT 0,
    four_wickets INTEGER DEFAULT 0,
    five_wickets INTEGER DEFAULT 0,
    best_bowling VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tournament_id, player_id)
);

-- ============================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_wc_tournaments_year ON world_cup_tournaments(year);
CREATE INDEX idx_wc_tournaments_type ON world_cup_tournaments(tournament_type);
CREATE INDEX idx_wc_matches_tournament ON world_cup_matches(tournament_id);
CREATE INDEX idx_wc_matches_date ON world_cup_matches(match_date);
CREATE INDEX idx_wc_points_tournament ON world_cup_points_table(tournament_id);
CREATE INDEX idx_wc_squads_tournament ON world_cup_squads(tournament_id);
CREATE INDEX idx_wc_squads_player ON world_cup_squads(player_id);
CREATE INDEX idx_wc_stats_tournament ON world_cup_tournament_stats(tournament_id);
CREATE INDEX idx_wc_rankings_type ON world_cup_team_rankings(tournament_type);
CREATE INDEX idx_tournament_batting ON tournament_player_batting(tournament_id, player_id);
CREATE INDEX idx_tournament_bowling ON tournament_player_bowling(tournament_id, player_id);

-- ============================================
-- CREATE VIEWS FOR EASY QUERYING
-- ============================================

-- View: Complete tournament summary
DROP VIEW IF EXISTS vw_tournament_summary;
CREATE VIEW vw_tournament_summary AS
SELECT 
    t.id,
    t.year,
    t.tournament_type,
    t.host_country,
    w.name as winner_name,
    r.name as runner_up_name,
    wc.name as winner_captain,
    rc.name as runner_up_captain,
    pot.name as player_of_tournament,
    t.final_match_venue,
    t.final_match_date,
    t.total_matches,
    t.total_teams
FROM world_cup_tournaments t
LEFT JOIN teams w ON t.winner_team_id = w.id
LEFT JOIN teams r ON t.runner_up_team_id = r.id
LEFT JOIN players wc ON t.winner_captain_id = wc.id
LEFT JOIN players rc ON t.runner_up_captain_id = rc.id
LEFT JOIN players pot ON t.player_of_tournament_id = pot.id;

-- View: All-time team rankings (fixed ambiguous column)
DROP VIEW IF EXISTS vw_all_time_team_rankings;
CREATE VIEW vw_all_time_team_rankings AS
SELECT 
    ROW_NUMBER() OVER (ORDER BY tr.titles_won DESC, tr.win_percentage DESC) as rank,
    t.name as team_name,
    tr.titles_won,
    tr.runner_up_count,
    tr.semi_final_count,
    tr.matches_played,
    tr.matches_won,
    tr.win_percentage
FROM world_cup_team_rankings tr
JOIN teams t ON tr.team_id = t.id
WHERE tr.tournament_type = 'odi'
ORDER BY tr.titles_won DESC, tr.win_percentage DESC;

-- View: Tournament matches with team names
DROP VIEW IF EXISTS vw_tournament_matches;
CREATE VIEW vw_tournament_matches AS
SELECT 
    m.id,
    m.match_type,
    m.stage,
    m.group_name,
    m.match_number,
    t1.name as team1_name,
    t2.name as team2_name,
    m.team1_score,
    m.team2_score,
    m.team1_wickets,
    m.team2_wickets,
    m.team1_overs,
    m.team2_overs,
    w.name as winner_name,
    m.winner_margin,
    m.margin_type,
    m.venue,
    m.match_date,
    mom.name as man_of_match_name,
    m.is_final,
    tc.year,
    tc.tournament_type
FROM world_cup_matches m
LEFT JOIN teams t1 ON m.team1_id = t1.id
LEFT JOIN teams t2 ON m.team2_id = t2.id
LEFT JOIN teams w ON m.winner_team_id = w.id
LEFT JOIN players mom ON m.man_of_match_id = mom.id
JOIN world_cup_tournaments tc ON m.tournament_id = tc.id;

-- View: Points table with team names
DROP VIEW IF EXISTS vw_points_table;
CREATE VIEW vw_points_table AS
SELECT 
    pt.tournament_id,
    pt.group_name,
    t.name as team_name,
    pt.matches_played,
    pt.matches_won,
    pt.matches_lost,
    pt.matches_tied,
    pt.matches_nr,
    pt.points,
    pt.net_run_rate,
    tc.year,
    tc.tournament_type
FROM world_cup_points_table pt
JOIN teams t ON pt.team_id = t.id
JOIN world_cup_tournaments tc ON pt.tournament_id = tc.id;

-- View: Tournament stats with player names
DROP VIEW IF EXISTS vw_tournament_stats;
CREATE VIEW vw_tournament_stats AS
SELECT 
    ts.tournament_id,
    tc.year,
    mr.name as most_runs_player,
    ts.most_runs_value,
    mw.name as most_wickets_player,
    ts.most_wickets_value,
    ms.name as most_sixes_player,
    ts.most_sixes_value,
    mh.name as most_hundreds_player,
    ts.most_hundreds_value,
    mf.name as most_fifties_player,
    ts.most_fifties_value
FROM world_cup_tournament_stats ts
JOIN world_cup_tournaments tc ON ts.tournament_id = tc.id
LEFT JOIN players mr ON ts.most_runs_player_id = mr.id
LEFT JOIN players mw ON ts.most_wickets_player_id = mw.id
LEFT JOIN players ms ON ts.most_sixes_player_id = ms.id
LEFT JOIN players mh ON ts.most_hundreds_player_id = mh.id
LEFT JOIN players mf ON ts.most_fifties_player_id = mf.id;

-- View: All-time records with player names
DROP VIEW IF EXISTS vw_all_time_records;
CREATE VIEW vw_all_time_records AS
SELECT 
    r.category,
    p.name as player_name,
    r.value,
    r.record_description,
    r.tournament_type
FROM world_cup_all_time_records r
JOIN players p ON r.player_id = p.id
ORDER BY r.category, r.value DESC;

-- ============================================
-- FUNCTION TO UPDATE TEAM RANKINGS
-- ============================================

CREATE OR REPLACE FUNCTION update_team_rankings()
RETURNS void AS $$
BEGIN
    -- Clear existing rankings
    TRUNCATE world_cup_team_rankings;
    
    -- Insert updated rankings
    INSERT INTO world_cup_team_rankings (
        tournament_type, team_id, titles_won, runner_up_count, 
        semi_final_count, matches_played, matches_won, win_percentage
    )
    SELECT 
        'odi' as tournament_type,
        t.id as team_id,
        COUNT(CASE WHEN wt.winner_team_id = t.id THEN 1 END) as titles_won,
        COUNT(CASE WHEN wt.runner_up_team_id = t.id THEN 1 END) as runner_up_count,
        0 as semi_final_count,
        COALESCE(SUM(wm.matches_played), 0) as matches_played,
        COALESCE(SUM(wm.matches_won), 0) as matches_won,
        CASE WHEN COALESCE(SUM(wm.matches_played), 0) > 0 
             THEN ROUND(COALESCE(SUM(wm.matches_won), 0)::numeric / COALESCE(SUM(wm.matches_played), 0) * 100, 2)
             ELSE 0 
        END as win_percentage
    FROM teams t
    LEFT JOIN world_cup_tournaments wt ON (wt.winner_team_id = t.id OR wt.runner_up_team_id = t.id)
    LEFT JOIN (
        SELECT winner_team_id, COUNT(*) as matches_played, COUNT(*) as matches_won
        FROM world_cup_matches
        WHERE winner_team_id IS NOT NULL
        GROUP BY winner_team_id
    ) wm ON wm.winner_team_id = t.id
    GROUP BY t.id
    ORDER BY titles_won DESC, win_percentage DESC;
    
    -- Update rank positions
    UPDATE world_cup_team_rankings 
    SET rank_position = sub.rank
    FROM (
        SELECT id, ROW_NUMBER() OVER (ORDER BY titles_won DESC, win_percentage DESC) as rank
        FROM world_cup_team_rankings
        WHERE tournament_type = 'odi'
    ) sub
    WHERE world_cup_team_rankings.id = sub.id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- INITIAL DATA INSERT (Optional - Basic seed)
-- ============================================

-- Insert some basic tournament data if needed
INSERT INTO world_cup_tournaments (tournament_type, year, edition, host_country, total_matches, total_teams)
VALUES 
    ('odi', 2023, 13, 'India', 48, 10),
    ('odi', 2019, 12, 'England & Wales', 48, 10),
    ('odi', 2015, 11, 'Australia & New Zealand', 49, 14),
    ('odi', 2011, 10, 'India, Sri Lanka, Bangladesh', 49, 14),
    ('odi', 2007, 9, 'West Indies', 51, 16),
    ('odi', 2003, 8, 'South Africa', 54, 14),
    ('odi', 1999, 7, 'England', 42, 12),
    ('odi', 1996, 6, 'India, Pakistan, Sri Lanka', 37, 12),
    ('odi', 1992, 5, 'Australia & New Zealand', 39, 9),
    ('odi', 1987, 4, 'India & Pakistan', 27, 8),
    ('odi', 1983, 3, 'England', 27, 8),
    ('odi', 1979, 2, 'England', 15, 8),
    ('odi', 1975, 1, 'England', 15, 8)
ON CONFLICT (tournament_type, year) DO NOTHING;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check tables created
DO $$
DECLARE
    table_count integer;
BEGIN
    SELECT COUNT(*) INTO table_count 
    FROM information_schema.tables 
    WHERE table_name LIKE 'world_cup_%' OR table_name LIKE 'tournament_%';
    
    RAISE NOTICE '✅ Created % World Cup tables', table_count;
END $$;