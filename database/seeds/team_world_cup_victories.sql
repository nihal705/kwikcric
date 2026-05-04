-- ============================================
-- TEAM WORLD CUP VICTORIES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS team_world_cup_victories (
    id SERIAL PRIMARY KEY,
    team_id INTEGER REFERENCES teams(id),
    year INTEGER NOT NULL,
    tournament_id INTEGER REFERENCES world_cup_tournaments(id),
    captain_id INTEGER REFERENCES players(id),
    player_of_tournament_id INTEGER REFERENCES players(id),
    image_url VARCHAR(500),
    match_id INTEGER REFERENCES world_cup_matches(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(team_id, year)
);

-- Team Winning Squads
CREATE TABLE IF NOT EXISTS team_winning_squads (
    id SERIAL PRIMARY KEY,
    victory_id INTEGER REFERENCES team_world_cup_victories(id) ON DELETE CASCADE,
    player_id INTEGER REFERENCES players(id),
    role VARCHAR(50),
    matches_played INTEGER DEFAULT 0,
    runs INTEGER DEFAULT 0,
    wickets INTEGER DEFAULT 0,
    is_captain BOOLEAN DEFAULT FALSE,
    is_wicket_keeper BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INSERT VICTORY DATA FOR ALL WINNING TEAMS
-- ============================================

-- West Indies 1975
INSERT INTO team_world_cup_victories (team_id, year, tournament_id, captain_id, player_of_tournament_id, match_id)
SELECT 
    (SELECT id FROM teams WHERE name = 'West Indies'),
    1975,
    (SELECT id FROM world_cup_tournaments WHERE year = 1975),
    (SELECT id FROM players WHERE name = 'Clive Lloyd'),
    (SELECT id FROM players WHERE name = 'Clive Lloyd'),
    (SELECT id FROM world_cup_matches WHERE tournament_id = (SELECT id FROM world_cup_tournaments WHERE year = 1975) AND match_type = 'final')
WHERE NOT EXISTS (SELECT 1 FROM team_world_cup_victories WHERE team_id = (SELECT id FROM teams WHERE name = 'West Indies') AND year = 1975);

-- West Indies 1979
INSERT INTO team_world_cup_victories (team_id, year, tournament_id, captain_id, player_of_tournament_id, match_id)
SELECT 
    (SELECT id FROM teams WHERE name = 'West Indies'),
    1979,
    (SELECT id FROM world_cup_tournaments WHERE year = 1979),
    (SELECT id FROM players WHERE name = 'Clive Lloyd'),
    (SELECT id FROM players WHERE name = 'Clive Lloyd'),
    (SELECT id FROM world_cup_matches WHERE tournament_id = (SELECT id FROM world_cup_tournaments WHERE year = 1979) AND match_type = 'final')
WHERE NOT EXISTS (SELECT 1 FROM team_world_cup_victories WHERE team_id = (SELECT id FROM teams WHERE name = 'West Indies') AND year = 1979);

-- India 1983
INSERT INTO team_world_cup_victories (team_id, year, tournament_id, captain_id, player_of_tournament_id, match_id)
SELECT 
    (SELECT id FROM teams WHERE name = 'India'),
    1983,
    (SELECT id FROM world_cup_tournaments WHERE year = 1983),
    (SELECT id FROM players WHERE name = 'Kapil Dev'),
    (SELECT id FROM players WHERE name = 'Kapil Dev'),
    (SELECT id FROM world_cup_matches WHERE tournament_id = (SELECT id FROM world_cup_tournaments WHERE year = 1983) AND match_type = 'final')
WHERE NOT EXISTS (SELECT 1 FROM team_world_cup_victories WHERE team_id = (SELECT id FROM teams WHERE name = 'India') AND year = 1983);

-- Australia 1987
INSERT INTO team_world_cup_victories (team_id, year, tournament_id, captain_id, player_of_tournament_id, match_id)
SELECT 
    (SELECT id FROM teams WHERE name = 'Australia'),
    1987,
    (SELECT id FROM world_cup_tournaments WHERE year = 1987),
    (SELECT id FROM players WHERE name = 'Allan Border'),
    (SELECT id FROM players WHERE name = 'David Boon'),
    (SELECT id FROM world_cup_matches WHERE tournament_id = (SELECT id FROM world_cup_tournaments WHERE year = 1987) AND match_type = 'final')
WHERE NOT EXISTS (SELECT 1 FROM team_world_cup_victories WHERE team_id = (SELECT id FROM teams WHERE name = 'Australia') AND year = 1987);

-- Pakistan 1992
INSERT INTO team_world_cup_victories (team_id, year, tournament_id, captain_id, player_of_tournament_id, match_id)
SELECT 
    (SELECT id FROM teams WHERE name = 'Pakistan'),
    1992,
    (SELECT id FROM world_cup_tournaments WHERE year = 1992),
    (SELECT id FROM players WHERE name = 'Imran Khan'),
    (SELECT id FROM players WHERE name = 'Martin Crowe'),
    (SELECT id FROM world_cup_matches WHERE tournament_id = (SELECT id FROM world_cup_tournaments WHERE year = 1992) AND match_type = 'final')
WHERE NOT EXISTS (SELECT 1 FROM team_world_cup_victories WHERE team_id = (SELECT id FROM teams WHERE name = 'Pakistan') AND year = 1992);

-- Sri Lanka 1996
INSERT INTO team_world_cup_victories (team_id, year, tournament_id, captain_id, player_of_tournament_id, match_id)
SELECT 
    (SELECT id FROM teams WHERE name = 'Sri Lanka'),
    1996,
    (SELECT id FROM world_cup_tournaments WHERE year = 1996),
    (SELECT id FROM players WHERE name = 'Arjuna Ranatunga'),
    (SELECT id FROM players WHERE name = 'Sanath Jayasuriya'),
    (SELECT id FROM world_cup_matches WHERE tournament_id = (SELECT id FROM world_cup_tournaments WHERE year = 1996) AND match_type = 'final')
WHERE NOT EXISTS (SELECT 1 FROM team_world_cup_victories WHERE team_id = (SELECT id FROM teams WHERE name = 'Sri Lanka') AND year = 1996);

-- Australia 1999
INSERT INTO team_world_cup_victories (team_id, year, tournament_id, captain_id, player_of_tournament_id, match_id)
SELECT 
    (SELECT id FROM teams WHERE name = 'Australia'),
    1999,
    (SELECT id FROM world_cup_tournaments WHERE year = 1999),
    (SELECT id FROM players WHERE name = 'Steve Waugh'),
    (SELECT id FROM players WHERE name = 'Lance Klusener'),
    (SELECT id FROM world_cup_matches WHERE tournament_id = (SELECT id FROM world_cup_tournaments WHERE year = 1999) AND match_type = 'final')
WHERE NOT EXISTS (SELECT 1 FROM team_world_cup_victories WHERE team_id = (SELECT id FROM teams WHERE name = 'Australia') AND year = 1999);

-- Australia 2003
INSERT INTO team_world_cup_victories (team_id, year, tournament_id, captain_id, player_of_tournament_id, match_id)
SELECT 
    (SELECT id FROM teams WHERE name = 'Australia'),
    2003,
    (SELECT id FROM world_cup_tournaments WHERE year = 2003),
    (SELECT id FROM players WHERE name = 'Ricky Ponting'),
    (SELECT id FROM players WHERE name = 'Sachin Tendulkar'),
    (SELECT id FROM world_cup_matches WHERE tournament_id = (SELECT id FROM world_cup_tournaments WHERE year = 2003) AND match_type = 'final')
WHERE NOT EXISTS (SELECT 1 FROM team_world_cup_victories WHERE team_id = (SELECT id FROM teams WHERE name = 'Australia') AND year = 2003);

-- Australia 2007
INSERT INTO team_world_cup_victories (team_id, year, tournament_id, captain_id, player_of_tournament_id, match_id)
SELECT 
    (SELECT id FROM teams WHERE name = 'Australia'),
    2007,
    (SELECT id FROM world_cup_tournaments WHERE year = 2007),
    (SELECT id FROM players WHERE name = 'Ricky Ponting'),
    (SELECT id FROM players WHERE name = 'Glenn McGrath'),
    (SELECT id FROM world_cup_matches WHERE tournament_id = (SELECT id FROM world_cup_tournaments WHERE year = 2007) AND match_type = 'final')
WHERE NOT EXISTS (SELECT 1 FROM team_world_cup_victories WHERE team_id = (SELECT id FROM teams WHERE name = 'Australia') AND year = 2007);

-- India 2011
INSERT INTO team_world_cup_victories (team_id, year, tournament_id, captain_id, player_of_tournament_id, match_id)
SELECT 
    (SELECT id FROM teams WHERE name = 'India'),
    2011,
    (SELECT id FROM world_cup_tournaments WHERE year = 2011),
    (SELECT id FROM players WHERE name = 'MS Dhoni'),
    (SELECT id FROM players WHERE name = 'Yuvraj Singh'),
    (SELECT id FROM world_cup_matches WHERE tournament_id = (SELECT id FROM world_cup_tournaments WHERE year = 2011) AND match_type = 'final')
WHERE NOT EXISTS (SELECT 1 FROM team_world_cup_victories WHERE team_id = (SELECT id FROM teams WHERE name = 'India') AND year = 2011);

-- Australia 2015
INSERT INTO team_world_cup_victories (team_id, year, tournament_id, captain_id, player_of_tournament_id, match_id)
SELECT 
    (SELECT id FROM teams WHERE name = 'Australia'),
    2015,
    (SELECT id FROM world_cup_tournaments WHERE year = 2015),
    (SELECT id FROM players WHERE name = 'Michael Clarke'),
    (SELECT id FROM players WHERE name = 'Mitchell Starc'),
    (SELECT id FROM world_cup_matches WHERE tournament_id = (SELECT id FROM world_cup_tournaments WHERE year = 2015) AND match_type = 'final')
WHERE NOT EXISTS (SELECT 1 FROM team_world_cup_victories WHERE team_id = (SELECT id FROM teams WHERE name = 'Australia') AND year = 2015);

-- England 2019
INSERT INTO team_world_cup_victories (team_id, year, tournament_id, captain_id, player_of_tournament_id, match_id)
SELECT 
    (SELECT id FROM teams WHERE name = 'England'),
    2019,
    (SELECT id FROM world_cup_tournaments WHERE year = 2019),
    (SELECT id FROM players WHERE name = 'Eoin Morgan'),
    (SELECT id FROM players WHERE name = 'Kane Williamson'),
    (SELECT id FROM world_cup_matches WHERE tournament_id = (SELECT id FROM world_cup_tournaments WHERE year = 2019) AND match_type = 'final')
WHERE NOT EXISTS (SELECT 1 FROM team_world_cup_victories WHERE team_id = (SELECT id FROM teams WHERE name = 'England') AND year = 2019);

-- Australia 2023
INSERT INTO team_world_cup_victories (team_id, year, tournament_id, captain_id, player_of_tournament_id, match_id)
SELECT 
    (SELECT id FROM teams WHERE name = 'Australia'),
    2023,
    (SELECT id FROM world_cup_tournaments WHERE year = 2023),
    (SELECT id FROM players WHERE name = 'Pat Cummins'),
    (SELECT id FROM players WHERE name = 'Virat Kohli'),
    (SELECT id FROM world_cup_matches WHERE tournament_id = (SELECT id FROM world_cup_tournaments WHERE year = 2023) AND match_type = 'final')
WHERE NOT EXISTS (SELECT 1 FROM team_world_cup_victories WHERE team_id = (SELECT id FROM teams WHERE name = 'Australia') AND year = 2023);