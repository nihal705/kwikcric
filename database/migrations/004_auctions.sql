-- ============================================================================
-- MIGRATION 004: Auctions & Awards
-- ============================================================================

BEGIN;

-- Create auctions table
CREATE TABLE IF NOT EXISTS auctions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    season_year INT NOT NULL,
    auction_date DATE,
    auction_venue VARCHAR(200),
    player_id UUID NOT NULL REFERENCES players(id),
    team_id UUID REFERENCES teams(id),
    base_price_usd DECIMAL(12,2),
    base_price_inr DECIMAL(12,2),
    sold_price_usd DECIMAL(12,2),
    sold_price_inr DECIMAL(12,2),
    sold_status VARCHAR(20),
    sold_to_team_id UUID REFERENCES teams(id),
    auction_round INT,
    bidding_war BOOLEAN DEFAULT FALSE,
    final_bid_team_id UUID REFERENCES teams(id),
    final_bid_amount DECIMAL(12,2),
    retention_type VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tournament_id, season_year, player_id)
);

-- Create tournament_awards table
CREATE TABLE IF NOT EXISTS tournament_awards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    award_type VARCHAR(30) NOT NULL,
    player_id UUID NOT NULL REFERENCES players(id),
    team_id UUID REFERENCES teams(id),
    value VARCHAR(50),
    numeric_value INT,
    season_year INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tournament_id, award_type)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_auctions_tournament ON auctions(tournament_id);
CREATE INDEX IF NOT EXISTS idx_auctions_player ON auctions(player_id);
CREATE INDEX IF NOT EXISTS idx_auctions_year ON auctions(season_year);
CREATE INDEX IF NOT EXISTS idx_tournament_awards_tournament ON tournament_awards(tournament_id);
CREATE INDEX IF NOT EXISTS idx_tournament_awards_player ON tournament_awards(player_id);

COMMIT;