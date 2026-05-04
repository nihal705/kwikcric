-- ============================================
-- T20I WORLD CUP TOURNAMENTS DATA
-- ============================================

-- Insert T20I World Cup tournaments
INSERT INTO world_cup_tournaments (tournament_type, year, edition, host_country, winner_team_id, runner_up_team_id, winner_captain_id, player_of_tournament_id, total_matches, total_teams, final_match_venue, final_match_date) VALUES
('t20', 2007, 1, 'South Africa', 
 (SELECT id FROM teams WHERE name = 'India'),
 (SELECT id FROM teams WHERE name = 'Pakistan'),
 (SELECT id FROM players WHERE name = 'MS Dhoni'),
 (SELECT id FROM players WHERE name = 'Shahid Afridi'),
 27, 12, 'Wanderers Stadium, Johannesburg', '2007-09-24'),
 
('t20', 2009, 2, 'England',
 (SELECT id FROM teams WHERE name = 'Pakistan'),
 (SELECT id FROM teams WHERE name = 'Sri Lanka'),
 (SELECT id FROM players WHERE name = 'Younis Khan'),
 (SELECT id FROM players WHERE name = 'Tillakaratne Dilshan'),
 27, 12, 'Lord''s, London', '2009-06-21'),
 
('t20', 2010, 3, 'West Indies',
 (SELECT id FROM teams WHERE name = 'England'),
 (SELECT id FROM teams WHERE name = 'Australia'),
 (SELECT id FROM players WHERE name = 'Paul Collingwood'),
 (SELECT id FROM players WHERE name = 'Kevin Pietersen'),
 27, 12, 'Kensington Oval, Barbados', '2010-05-16'),
 
('t20', 2012, 4, 'Sri Lanka',
 (SELECT id FROM teams WHERE name = 'West Indies'),
 (SELECT id FROM teams WHERE name = 'Sri Lanka'),
 (SELECT id FROM players WHERE name = 'Darren Sammy'),
 (SELECT id FROM players WHERE name = 'Shane Watson'),
 27, 12, 'R Premadasa Stadium, Colombo', '2012-10-07'),
 
('t20', 2014, 5, 'Bangladesh',
 (SELECT id FROM teams WHERE name = 'Sri Lanka'),
 (SELECT id FROM teams WHERE name = 'India'),
 (SELECT id FROM players WHERE name = 'Lasith Malinga'),
 (SELECT id FROM players WHERE name = 'Virat Kohli'),
 35, 16, 'Shere Bangla National Stadium, Dhaka', '2014-04-06'),
 
('t20', 2016, 6, 'India',
 (SELECT id FROM teams WHERE name = 'West Indies'),
 (SELECT id FROM teams WHERE name = 'England'),
 (SELECT id FROM players WHERE name = 'Darren Sammy'),
 (SELECT id FROM players WHERE name = 'Virat Kohli'),
 35, 16, 'Eden Gardens, Kolkata', '2016-04-03'),
 
('t20', 2021, 7, 'UAE & Oman',
 (SELECT id FROM teams WHERE name = 'Australia'),
 (SELECT id FROM teams WHERE name = 'New Zealand'),
 (SELECT id FROM players WHERE name = 'Aaron Finch'),
 (SELECT id FROM players WHERE name = 'David Warner'),
 45, 16, 'Dubai International Cricket Stadium', '2021-11-14'),
 
('t20', 2022, 8, 'Australia',
 (SELECT id FROM teams WHERE name = 'England'),
 (SELECT id FROM teams WHERE name = 'Pakistan'),
 (SELECT id FROM players WHERE name = 'Jos Buttler'),
 (SELECT id FROM players WHERE name = 'Sam Curran'),
 45, 16, 'Melbourne Cricket Ground', '2022-11-13'),
 
('t20', 2024, 9, 'USA & West Indies',
 (SELECT id FROM teams WHERE name = 'India'),
 (SELECT id FROM teams WHERE name = 'South Africa'),
 (SELECT id FROM players WHERE name = 'Rohit Sharma'),
 (SELECT id FROM players WHERE name = 'Jasprit Bumrah'),
 55, 20, 'Kensington Oval, Barbados', '2024-06-29');

-- Verify insertion
SELECT year, host_country, w.name as winner, r.name as runner_up
FROM world_cup_tournaments wc
JOIN teams w ON wc.winner_team_id = w.id
JOIN teams r ON wc.runner_up_team_id = r.id
WHERE tournament_type = 't20'
ORDER BY year;

-- ============================================
-- T20I WORLD CUP ACHIEVEMENTS
-- ============================================

INSERT INTO tournament_achievements (tournament_id, achievement_type, title, description, related_players, is_featured) VALUES

-- 2007
((SELECT id FROM world_cup_tournaments WHERE year = 2007 AND tournament_type = 't20'),
 'historic_moment',
 'India wins inaugural T20 World Cup',
 'India defeated Pakistan in a thrilling final. MS Dhoni became the first captain to lift the T20 World Cup trophy. The tournament introduced the world to T20 cricket.',
 ARRAY[(SELECT id FROM players WHERE name = 'MS Dhoni'), (SELECT id FROM players WHERE name = 'Yuvraj Singh')],
 TRUE),

-- 2007: Yuvraj's 6 sixes
((SELECT id FROM world_cup_tournaments WHERE year = 2007 AND tournament_type = 't20'),
 'record_break',
 'Yuvraj Singh - 6 sixes in an over',
 'Yuvraj Singh hit 6 sixes off Stuart Broad''s over, becoming the first player to do so in T20Is. He scored 50 off 12 balls, the fastest in T20I history at that time.',
 ARRAY[(SELECT id FROM players WHERE name = 'Yuvraj Singh')],
 FALSE),

-- 2012
((SELECT id FROM world_cup_tournaments WHERE year = 2012 AND tournament_type = 't20'),
 'upset',
 'West Indies win first T20 World Cup',
 'West Indies defeated hosts Sri Lanka in the final. Marlon Samuels scored 78, and Sunil Narine was named Player of the Tournament.',
 ARRAY[(SELECT id FROM players WHERE name = 'Darren Sammy'), (SELECT id FROM players WHERE name = 'Marlon Samuels')],
 TRUE),

-- 2014
((SELECT id FROM world_cup_tournaments WHERE year = 2014 AND tournament_type = 't20'),
 'comeback',
 'Sri Lanka''s redemption',
 'Sri Lanka won their first T20 World Cup after losing 2 previous finals. Virat Kohli was Player of the Tournament with 319 runs.',
 ARRAY[(SELECT id FROM players WHERE name = 'Lasith Malinga'), (SELECT id FROM players WHERE name = 'Virat Kohli')],
 TRUE),

-- 2016: Brathwaite's 4 sixes
((SELECT id FROM world_cup_tournaments WHERE year = 2016 AND tournament_type = 't20'),
 'historic_moment',
 'Carlos Brathwaite - Remember the name!',
 'Carlos Brathwaite hit 4 consecutive sixes off Ben Stokes in the final over to win the World Cup for West Indies. "Remember the name!" became iconic.',
 ARRAY[(SELECT id FROM players WHERE name = 'Carlos Brathwaite'), (SELECT id FROM players WHERE name = 'Ben Stokes')],
 TRUE),

-- 2021
((SELECT id FROM world_cup_tournaments WHERE year = 2021 AND tournament_type = 't20'),
 'comeback',
 'Australia''s first T20 World Cup',
 'Australia defeated New Zealand in the final to win their first T20 World Cup. David Warner was Player of the Tournament.',
 ARRAY[(SELECT id FROM players WHERE name = 'Aaron Finch'), (SELECT id FROM players WHERE name = 'David Warner')],
 TRUE),

-- 2022
((SELECT id FROM world_cup_tournaments WHERE year = 2022 AND tournament_type = 't20'),
 'historic_moment',
 'England wins second T20 World Cup',
 'England defeated Pakistan in the final. Sam Curran was named Player of the Tournament for his brilliant bowling.',
 ARRAY[(SELECT id FROM players WHERE name = 'Jos Buttler'), (SELECT id FROM players WHERE name = 'Sam Curran')],
 TRUE),

-- 2022: India vs Pakistan classic
((SELECT id FROM world_cup_tournaments WHERE year = 2022 AND tournament_type = 't20'),
 'classic_match',
 'India vs Pakistan - Last ball thriller',
 'Virat Kohli played one of the greatest T20 innings, scoring 82* off 53 balls as India chased 160 against Pakistan in a last-ball thriller at MCG.',
 ARRAY[(SELECT id FROM players WHERE name = 'Virat Kohli')],
 FALSE),

-- 2024
((SELECT id FROM world_cup_tournaments WHERE year = 2024 AND tournament_type = 't20'),
 'historic_moment',
 'India ends drought, wins T20 World Cup',
 'India defeated South Africa in a thrilling final to end their 11-year ICC trophy drought. Rohit Sharma announced retirement from T20Is after the win.',
 ARRAY[(SELECT id FROM players WHERE name = 'Rohit Sharma'), (SELECT id FROM players WHERE name = 'Jasprit Bumrah')],
 TRUE),

-- 2024: Bumrah brilliance
((SELECT id FROM world_cup_tournaments WHERE year = 2024 AND tournament_type = 't20'),
 'record_break',
 'Jasprit Bumrah - Player of Tournament',
 'Bumrah took 15 wickets at an economy of 4.17, leading India to victory. Named Player of the Tournament for his exceptional bowling.',
 ARRAY[(SELECT id FROM players WHERE name = 'Jasprit Bumrah')],
 FALSE);

 -- ============================================
-- T20I WORLD CUP ACHIEVEMENTS (FIXED)
-- ============================================

-- First, ensure we have players in database
-- Insert missing players if needed
INSERT INTO players (name, country) VALUES 
('Yuvraj Singh', 'India'),
('Carlos Brathwaite', 'West Indies'),
('Sam Curran', 'England'),
('Varun Chakravarthy', 'India')
ON CONFLICT (name) DO NOTHING;

-- Now insert achievements with correct player_id arrays
INSERT INTO tournament_achievements (tournament_id, achievement_type, title, description, related_players, is_featured) VALUES

-- 2007
((SELECT id FROM world_cup_tournaments WHERE year = 2007 AND tournament_type = 't20'),
 'historic_moment',
 'India wins inaugural T20 World Cup',
 'India defeated Pakistan in a thrilling final. MS Dhoni became the first captain to lift the T20 World Cup trophy. The tournament introduced the world to T20 cricket.',
 ARRAY[(SELECT id FROM players WHERE name = 'MS Dhoni')],
 TRUE),

-- 2007: Yuvraj's 6 sixes
((SELECT id FROM world_cup_tournaments WHERE year = 2007 AND tournament_type = 't20'),
 'record_break',
 'Yuvraj Singh - 6 sixes in an over',
 'Yuvraj Singh hit 6 sixes off Stuart Broad''s over, becoming the first player to do so in T20Is. He scored 50 off 12 balls, the fastest in T20I history at that time.',
 ARRAY[(SELECT id FROM players WHERE name = 'Yuvraj Singh')],
 FALSE),

-- 2012
((SELECT id FROM world_cup_tournaments WHERE year = 2012 AND tournament_type = 't20'),
 'upset',
 'West Indies win first T20 World Cup',
 'West Indies defeated hosts Sri Lanka in the final. Marlon Samuels scored 78, and Sunil Narine was named Player of the Tournament.',
 ARRAY[(SELECT id FROM players WHERE name = 'Darren Sammy')],
 TRUE),

-- 2014
((SELECT id FROM world_cup_tournaments WHERE year = 2014 AND tournament_type = 't20'),
 'comeback',
 'Sri Lanka''s redemption',
 'Sri Lanka won their first T20 World Cup after losing 2 previous finals. Virat Kohli was Player of the Tournament with 319 runs.',
 ARRAY[(SELECT id FROM players WHERE name = 'Lasith Malinga'), (SELECT id FROM players WHERE name = 'Virat Kohli')],
 TRUE),

-- 2016: Brathwaite's 4 sixes
((SELECT id FROM world_cup_tournaments WHERE year = 2016 AND tournament_type = 't20'),
 'historic_moment',
 'Carlos Brathwaite - Remember the name!',
 'Carlos Brathwaite hit 4 consecutive sixes off Ben Stokes in the final over to win the World Cup for West Indies. "Remember the name!" became iconic.',
 ARRAY[(SELECT id FROM players WHERE name = 'Carlos Brathwaite'), (SELECT id FROM players WHERE name = 'Ben Stokes')],
 TRUE),

-- 2021
((SELECT id FROM world_cup_tournaments WHERE year = 2021 AND tournament_type = 't20'),
 'comeback',
 'Australia''s first T20 World Cup',
 'Australia defeated New Zealand in the final to win their first T20 World Cup. David Warner was Player of the Tournament.',
 ARRAY[(SELECT id FROM players WHERE name = 'Aaron Finch'), (SELECT id FROM players WHERE name = 'David Warner')],
 TRUE),

-- 2022
((SELECT id FROM world_cup_tournaments WHERE year = 2022 AND tournament_type = 't20'),
 'historic_moment',
 'England wins second T20 World Cup',
 'England defeated Pakistan in the final. Sam Curran was named Player of the Tournament for his brilliant bowling.',
 ARRAY[(SELECT id FROM players WHERE name = 'Jos Buttler'), (SELECT id FROM players WHERE name = 'Sam Curran')],
 TRUE),

-- 2024
((SELECT id FROM world_cup_tournaments WHERE year = 2024 AND tournament_type = 't20'),
 'historic_moment',
 'India ends drought, wins T20 World Cup',
 'India defeated South Africa in a thrilling final to end their 11-year ICC trophy drought. Rohit Sharma announced retirement from T20Is after the win.',
 ARRAY[(SELECT id FROM players WHERE name = 'Rohit Sharma'), (SELECT id FROM players WHERE name = 'Jasprit Bumrah')],
 TRUE),

-- 2026: India wins back-to-back
((SELECT id FROM world_cup_tournaments WHERE year = 2026 AND tournament_type = 't20'),
 'historic_moment',
 'India becomes first to win back-to-back T20 World Cups',
 'India defeated New Zealand by 96 runs in the final at Ahmedabad. Suryakumar Yadav led India to their third T20 World Cup title, becoming the first team to win consecutive T20 World Cups and first host nation to win the tournament.',
 ARRAY[(SELECT id FROM players WHERE name = 'Suryakumar Yadav'), (SELECT id FROM players WHERE name = 'Jasprit Bumrah'), (SELECT id FROM players WHERE name = 'Sanju Samson')],
 TRUE),

-- 2026: Bumrah Player of Tournament
((SELECT id FROM world_cup_tournaments WHERE year = 2026 AND tournament_type = 't20'),
 'record_break',
 'Jasprit Bumrah - Joint highest wicket-taker',
 'Bumrah took 14 wickets in the tournament, finishing as joint leading wicket-taker along with Varun Chakravarthy. Named Player of the Match in the final with 4 wickets.',
 ARRAY[(SELECT id FROM players WHERE name = 'Jasprit Bumrah'), (SELECT id FROM players WHERE name = 'Varun Chakravarthy')],
 FALSE);

 -- Insert 2026 T20 World Cup
INSERT INTO world_cup_tournaments (tournament_type, year, edition, host_country, winner_team_id, runner_up_team_id, winner_captain_id, player_of_tournament_id, total_matches, total_teams, final_match_venue, final_match_date) VALUES
('t20', 2026, 10, 'India',
 (SELECT id FROM teams WHERE name = 'India'),
 (SELECT id FROM teams WHERE name = 'New Zealand'),
 (SELECT id FROM players WHERE name = 'Suryakumar Yadav'),
 (SELECT id FROM players WHERE name = 'Sanju Samson'),
 55, 20, 'Narendra Modi Stadium, Ahmedabad', '2026-03-08')
ON CONFLICT (tournament_type, year) DO UPDATE SET
    winner_team_id = EXCLUDED.winner_team_id,
    runner_up_team_id = EXCLUDED.runner_up_team_id,
    winner_captain_id = EXCLUDED.winner_captain_id,
    player_of_tournament_id = EXCLUDED.player_of_tournament_id,
    final_match_venue = EXCLUDED.final_match_venue,
    final_match_date = EXCLUDED.final_match_date;

-- Get the tournament ID for 2026 T20 WC
DO $$
DECLARE
    t2026_id INTEGER;
    ind_id INTEGER;
    nz_id INTEGER;
BEGIN
    SELECT id INTO t2026_id FROM world_cup_tournaments WHERE year = 2026 AND tournament_type = 't20';
    SELECT id INTO ind_id FROM teams WHERE name = 'India';
    SELECT id INTO nz_id FROM teams WHERE name = 'New Zealand';
    
    -- Insert the final match
    INSERT INTO world_cup_matches (tournament_id, match_type, stage, match_number, team1_id, team2_id, team1_score, team1_wickets, team1_overs, team2_score, team2_wickets, team2_overs, winner_team_id, winner_margin, margin_type, venue, match_date, man_of_match_id) VALUES
    (t2026_id, 'final', 'knockout', 55, ind_id, nz_id, 255, 5, 20.0, 159, 10, 19.0, ind_id, 96, 'runs', 'Narendra Modi Stadium, Ahmedabad', '2026-03-08', (SELECT id FROM players WHERE name = 'Jasprit Bumrah'))
    ON CONFLICT DO NOTHING;
END $$;

-- Update T20 World Cup team rankings with correct data
DELETE FROM world_cup_team_rankings WHERE tournament_type = 't20';

INSERT INTO world_cup_team_rankings (tournament_type, team_id, titles_won, runner_up_count, semi_final_count, matches_played, matches_won, win_percentage, rank_position) VALUES
('t20', (SELECT id FROM teams WHERE name = 'India'), 3, 1, 5, 45, 32, 71.11, 1),
('t20', (SELECT id FROM teams WHERE name = 'West Indies'), 2, 0, 3, 38, 24, 63.16, 2),
('t20', (SELECT id FROM teams WHERE name = 'England'), 2, 1, 4, 42, 28, 66.67, 3),
('t20', (SELECT id FROM teams WHERE name = 'Australia'), 1, 1, 4, 40, 26, 65.00, 4),
('t20', (SELECT id FROM teams WHERE name = 'Sri Lanka'), 1, 2, 3, 36, 22, 61.11, 5),
('t20', (SELECT id FROM teams WHERE name = 'Pakistan'), 1, 3, 5, 46, 28, 60.87, 6),
('t20', (SELECT id FROM teams WHERE name = 'New Zealand'), 0, 2, 4, 38, 24, 63.16, 7),
('t20', (SELECT id FROM teams WHERE name = 'South Africa'), 0, 2, 5, 40, 24, 60.00, 8);

-- Update rank positions
UPDATE world_cup_team_rankings wtr
SET rank_position = sub.rank
FROM (
    SELECT id, ROW_NUMBER() OVER (ORDER BY titles_won DESC, runner_up_count ASC, win_percentage DESC) as rank
    FROM world_cup_team_rankings
    WHERE tournament_type = 't20'
) sub
WHERE wtr.id = sub.id;

-- Insert tournament stats for 2026 T20 World Cup
INSERT INTO world_cup_tournament_stats (tournament_id, most_runs_player_id, most_runs_value, most_wickets_player_id, most_wickets_value, most_sixes_player_id, most_sixes_value, most_hundreds_player_id, most_hundreds_value) VALUES
((SELECT id FROM world_cup_tournaments WHERE year = 2026 AND tournament_type = 't20'),
 (SELECT id FROM players WHERE name = 'Sahibzada Farhan'), 383,
 (SELECT id FROM players WHERE name = 'Jasprit Bumrah'), 14,
 (SELECT id FROM players WHERE name = 'Sanju Samson'), 12,
 (SELECT id FROM players WHERE name = 'Sanju Samson'), 1)
ON CONFLICT (tournament_id) DO UPDATE SET
    most_runs_player_id = EXCLUDED.most_runs_player_id,
    most_runs_value = EXCLUDED.most_runs_value,
    most_wickets_player_id = EXCLUDED.most_wickets_player_id,
    most_wickets_value = EXCLUDED.most_wickets_value;

-- First, delete existing entry for 2026 if any
DELETE FROM world_cup_tournament_stats 
WHERE tournament_id = (SELECT id FROM world_cup_tournaments WHERE year = 2026 AND tournament_type = 't20');

-- Then insert
INSERT INTO world_cup_tournament_stats (tournament_id, most_runs_player_id, most_runs_value, most_wickets_player_id, most_wickets_value, most_sixes_player_id, most_sixes_value, most_hundreds_player_id, most_hundreds_value) VALUES
((SELECT id FROM world_cup_tournaments WHERE year = 2026 AND tournament_type = 't20'),
 (SELECT id FROM players WHERE name = 'Sahibzada Farhan'), 383,
 (SELECT id FROM players WHERE name = 'Jasprit Bumrah'), 14,
 (SELECT id FROM players WHERE name = 'Sanju Samson'), 12,
 (SELECT id FROM players WHERE name = 'Sanju Samson'), 1);

-- Insert stats for other T20 World Cups
-- 2024
DELETE FROM world_cup_tournament_stats 
WHERE tournament_id = (SELECT id FROM world_cup_tournaments WHERE year = 2024 AND tournament_type = 't20');

INSERT INTO world_cup_tournament_stats (tournament_id, most_runs_player_id, most_runs_value, most_wickets_player_id, most_wickets_value, most_sixes_player_id, most_sixes_value, most_hundreds_player_id, most_hundreds_value) VALUES
((SELECT id FROM world_cup_tournaments WHERE year = 2024 AND tournament_type = 't20'),
 (SELECT id FROM players WHERE name = 'Rohit Sharma'), 257,
 (SELECT id FROM players WHERE name = 'Jasprit Bumrah'), 15,
 (SELECT id FROM players WHERE name = 'Rohit Sharma'), 10,
 (SELECT id FROM players WHERE name = 'Rohit Sharma'), 1);

-- 2022
DELETE FROM world_cup_tournament_stats 
WHERE tournament_id = (SELECT id FROM world_cup_tournaments WHERE year = 2022 AND tournament_type = 't20');

INSERT INTO world_cup_tournament_stats (tournament_id, most_runs_player_id, most_runs_value, most_wickets_player_id, most_wickets_value, most_sixes_player_id, most_sixes_value, most_hundreds_player_id, most_hundreds_value) VALUES
((SELECT id FROM world_cup_tournaments WHERE year = 2022 AND tournament_type = 't20'),
 (SELECT id FROM players WHERE name = 'Virat Kohli'), 296,
 (SELECT id FROM players WHERE name = 'Sam Curran'), 13,
 (SELECT id FROM players WHERE name = 'Jos Buttler'), 12,
 (SELECT id FROM players WHERE name = 'Jos Buttler'), 1);

-- 2021
DELETE FROM world_cup_tournament_stats 
WHERE tournament_id = (SELECT id FROM world_cup_tournaments WHERE year = 2021 AND tournament_type = 't20');

INSERT INTO world_cup_tournament_stats (tournament_id, most_runs_player_id, most_runs_value, most_wickets_player_id, most_wickets_value, most_sixes_player_id, most_sixes_value, most_hundreds_player_id, most_hundreds_value) VALUES
((SELECT id FROM world_cup_tournaments WHERE year = 2021 AND tournament_type = 't20'),
 (SELECT id FROM players WHERE name = 'David Warner'), 289,
 (SELECT id FROM players WHERE name = 'Trent Boult'), 13,
 (SELECT id FROM players WHERE name = 'Glenn Phillips'), 9,
 (SELECT id FROM players WHERE name = 'David Warner'), 1);

-- 2016
DELETE FROM world_cup_tournament_stats 
WHERE tournament_id = (SELECT id FROM world_cup_tournaments WHERE year = 2016 AND tournament_type = 't20');

INSERT INTO world_cup_tournament_stats (tournament_id, most_runs_player_id, most_runs_value, most_wickets_player_id, most_wickets_value, most_sixes_player_id, most_sixes_value, most_hundreds_player_id, most_hundreds_value) VALUES
((SELECT id FROM world_cup_tournaments WHERE year = 2016 AND tournament_type = 't20'),
 (SELECT id FROM players WHERE name = 'Virat Kohli'), 273,
 (SELECT id FROM players WHERE name = 'Mohammad Nabi'), 12,
 (SELECT id FROM players WHERE name = 'Chris Gayle'), 11,
 (SELECT id FROM players WHERE name = 'Virat Kohli'), 1);

-- 2014
DELETE FROM world_cup_tournament_stats 
WHERE tournament_id = (SELECT id FROM world_cup_tournaments WHERE year = 2014 AND tournament_type = 't20');

INSERT INTO world_cup_tournament_stats (tournament_id, most_runs_player_id, most_runs_value, most_wickets_player_id, most_wickets_value, most_sixes_player_id, most_sixes_value, most_hundreds_player_id, most_hundreds_value) VALUES
((SELECT id FROM world_cup_tournaments WHERE year = 2014 AND tournament_type = 't20'),
 (SELECT id FROM players WHERE name = 'Virat Kohli'), 319,
 (SELECT id FROM players WHERE name = 'Imran Tahir'), 12,
 (SELECT id FROM players WHERE name = 'Rohit Sharma'), 7,
 (SELECT id FROM players WHERE name = 'Tillakaratne Dilshan'), 1);

-- 2012
DELETE FROM world_cup_tournament_stats 
WHERE tournament_id = (SELECT id FROM world_cup_tournaments WHERE year = 2012 AND tournament_type = 't20');

INSERT INTO world_cup_tournament_stats (tournament_id, most_runs_player_id, most_runs_value, most_wickets_player_id, most_wickets_value, most_sixes_player_id, most_sixes_value, most_hundreds_player_id, most_hundreds_value) VALUES
((SELECT id FROM world_cup_tournaments WHERE year = 2012 AND tournament_type = 't20'),
 (SELECT id FROM players WHERE name = 'Shane Watson'), 249,
 (SELECT id FROM players WHERE name = 'Ajantha Mendis'), 15,
 (SELECT id FROM players WHERE name = 'Shane Watson'), 6,
 (SELECT id FROM players WHERE name = 'Shane Watson'), 1);

-- 2010
DELETE FROM world_cup_tournament_stats 
WHERE tournament_id = (SELECT id FROM world_cup_tournaments WHERE year = 2010 AND tournament_type = 't20');

INSERT INTO world_cup_tournament_stats (tournament_id, most_runs_player_id, most_runs_value, most_wickets_player_id, most_wickets_value, most_sixes_player_id, most_sixes_value, most_hundreds_player_id, most_hundreds_value) VALUES
((SELECT id FROM world_cup_tournaments WHERE year = 2010 AND tournament_type = 't20'),
 (SELECT id FROM players WHERE name = 'Mahela Jayawardene'), 302,
 (SELECT id FROM players WHERE name = 'Dirk Nannes'), 14,
 (SELECT id FROM players WHERE name = 'Kevin Pietersen'), 8,
 (SELECT id FROM players WHERE name = 'Mahela Jayawardene'), 1);

-- 2009
DELETE FROM world_cup_tournament_stats 
WHERE tournament_id = (SELECT id FROM world_cup_tournaments WHERE year = 2009 AND tournament_type = 't20');

INSERT INTO world_cup_tournament_stats (tournament_id, most_runs_player_id, most_runs_value, most_wickets_player_id, most_wickets_value, most_sixes_player_id, most_sixes_value, most_hundreds_player_id, most_hundreds_value) VALUES
((SELECT id FROM world_cup_tournaments WHERE year = 2009 AND tournament_type = 't20'),
 (SELECT id FROM players WHERE name = 'Tillakaratne Dilshan'), 317,
 (SELECT id FROM players WHERE name = 'Umar Gul'), 13,
 (SELECT id FROM players WHERE name = 'Chris Gayle'), 8,
 (SELECT id FROM players WHERE name = 'Tillakaratne Dilshan'), 1);

-- 2007
DELETE FROM world_cup_tournament_stats 
WHERE tournament_id = (SELECT id FROM world_cup_tournaments WHERE year = 2007 AND tournament_type = 't20');

INSERT INTO world_cup_tournament_stats (tournament_id, most_runs_player_id, most_runs_value, most_wickets_player_id, most_wickets_value, most_sixes_player_id, most_sixes_value, most_hundreds_player_id, most_hundreds_value) VALUES
((SELECT id FROM world_cup_tournaments WHERE year = 2007 AND tournament_type = 't20'),
 (SELECT id FROM players WHERE name = 'Matthew Hayden'), 265,
 (SELECT id FROM players WHERE name = 'Umar Gul'), 13,
 (SELECT id FROM players WHERE name = 'Chris Gayle'), 9,
 (SELECT id FROM players WHERE name = 'Matthew Hayden'), 1);

-- Verify all inserted
SELECT 
    t.year,
    pr.name as most_runs,
    ts.most_runs_value,
    pw.name as most_wickets,
    ts.most_wickets_value
FROM world_cup_tournament_stats ts
JOIN world_cup_tournaments t ON ts.tournament_id = t.id
LEFT JOIN players pr ON ts.most_runs_player_id = pr.id
LEFT JOIN players pw ON ts.most_wickets_player_id = pw.id
WHERE t.tournament_type = 't20'
ORDER BY t.year;

