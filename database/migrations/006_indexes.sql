

-- ============================================================================
-- MIGRATION 006: Additional Performance Indexes
-- ============================================================================

BEGIN;

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_players_search ON players USING GIN(
    to_tsvector('english', 
        COALESCE(full_name, '') || ' ' || 
        COALESCE(country, '') || ' ' || 
        COALESCE(role, '')
    )
);

-- Partial indexes for active data
CREATE INDEX IF NOT EXISTS idx_active_players ON players(id) WHERE is_active = true;

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_players_country_role ON players(country, role);
CREATE INDEX IF NOT EXISTS idx_player_stats_player_format ON player_stats(player_id, format);
CREATE INDEX IF NOT EXISTS idx_matches_tournament_status ON matches(tournament_id, status);
CREATE INDEX IF NOT EXISTS idx_auctions_tournament_year ON auctions(tournament_id, season_year);

-- Time-based indexes
CREATE INDEX IF NOT EXISTS idx_matches_date_status ON matches(match_date, status);
CREATE INDEX IF NOT EXISTS idx_created_at_users ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_created_at_players ON players(created_at);

-- JSONB indexes
CREATE INDEX IF NOT EXISTS idx_users_preferences ON users USING GIN(preferences);
CREATE INDEX IF NOT EXISTS idx_matches_scorecard ON matches USING GIN(scorecard_json);

-- Create materialized views
CREATE MATERIALIZED VIEW IF NOT EXISTS player_rankings AS
SELECT 
    p.id,
    p.full_name,
    p.country,
    p.image_url,
    COALESCE(odi.runs, 0) as odi_runs,
    COALESCE(test.runs, 0) as test_runs,
    COALESCE(t20.runs, 0) as t20_runs,
    RANK() OVER (ORDER BY COALESCE(odi.runs, 0) DESC) as odi_batting_rank
FROM players p
LEFT JOIN player_stats odi ON p.id = odi.player_id AND odi.format = 'ODI' AND odi.year IS NULL
LEFT JOIN player_stats test ON p.id = test.player_id AND test.format = 'Test' AND test.year IS NULL
LEFT JOIN player_stats t20 ON p.id = t20.player_id AND t20.format = 'T20I' AND t20.year IS NULL;

-- Create refresh function
CREATE OR REPLACE FUNCTION refresh_player_rankings()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY player_rankings;
END;
$$ LANGUAGE plpgsql;

COMMIT;