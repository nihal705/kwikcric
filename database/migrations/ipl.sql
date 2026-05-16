-- ============================================
-- IPL DATABASE SCHEMA
-- Run this in your PostgreSQL database
-- ============================================

-- 1. IPL Teams (Franchises)
CREATE TABLE IF NOT EXISTS ipl_teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    short_name VARCHAR(10),
    city VARCHAR(100),
    home_ground VARCHAR(200),
    owner VARCHAR(200),
    captain_name VARCHAR(100),
    coach_name VARCHAR(100),
    founded_year INT,
    titles_won INT DEFAULT 0,
    runner_up_count INT DEFAULT 0,
    logo_url TEXT,
    primary_color VARCHAR(7),
    secondary_color VARCHAR(7)
);

-- 2. IPL Seasons
CREATE TABLE IF NOT EXISTS ipl_seasons (
    id SERIAL PRIMARY KEY,
    year INT NOT NULL UNIQUE,
    winner_team_id INT REFERENCES ipl_teams(id),
    runner_up_team_id INT REFERENCES ipl_teams(id),
    orange_cap_player_id INT,
    purple_cap_player_id INT,
    player_of_tournament_id INT,
    emerging_player_id INT,
    most_sixes_player_id INT,
    total_matches INT,
    total_teams INT,
    final_venue VARCHAR(200),
    final_match_date DATE,
    super_over_final BOOLEAN DEFAULT FALSE
);

-- 3. IPL Points Table
CREATE TABLE IF NOT EXISTS ipl_points_table (
    id SERIAL PRIMARY KEY,
    season_id INT REFERENCES ipl_seasons(id),
    team_id INT REFERENCES ipl_teams(id),
    group_name VARCHAR(20) DEFAULT 'Group',
    matches_played INT DEFAULT 0,
    matches_won INT DEFAULT 0,
    matches_lost INT DEFAULT 0,
    matches_tied INT DEFAULT 0,
    matches_nr INT DEFAULT 0,
    points INT DEFAULT 0,
    net_run_rate DECIMAL(6,3) DEFAULT 0
);

-- 4. IPL Playoff Matches
CREATE TABLE IF NOT EXISTS ipl_playoff_matches (
    id SERIAL PRIMARY KEY,
    season_id INT REFERENCES ipl_seasons(id),
    match_type VARCHAR(20),
    team1_id INT REFERENCES ipl_teams(id),
    team2_id INT REFERENCES ipl_teams(id),
    winner_id INT REFERENCES ipl_teams(id),
    winner_margin VARCHAR(50),
    venue VARCHAR(200),
    match_date DATE,
    man_of_match VARCHAR(100)
);

-- 5. IPL Matches
CREATE TABLE IF NOT EXISTS ipl_matches (
    id SERIAL PRIMARY KEY,
    season_id INT REFERENCES ipl_seasons(id),
    match_type VARCHAR(30) DEFAULT 'league',
    match_number INT,
    team1_id INT REFERENCES ipl_teams(id),
    team2_id INT REFERENCES ipl_teams(id),
    team1_score INT,
    team1_wickets INT,
    team1_overs DECIMAL(4,1),
    team2_score INT,
    team2_wickets INT,
    team2_overs DECIMAL(4,1),
    winner_id INT REFERENCES ipl_teams(id),
    winner_margin VARCHAR(50),
    margin_type VARCHAR(20),
    venue VARCHAR(200),
    match_date DATE,
    man_of_match_name VARCHAR(100),
    is_abandoned BOOLEAN DEFAULT FALSE,
    result_note TEXT
);

-- 6. IPL Player Batting Stats
CREATE TABLE IF NOT EXISTS ipl_player_batting (
    id SERIAL PRIMARY KEY,
    player_id INT,
    season_year INT,
    matches INT DEFAULT 0,
    innings INT DEFAULT 0,
    runs INT DEFAULT 0,
    balls_faced INT DEFAULT 0,
    strike_rate DECIMAL(6,2) DEFAULT 0,
    batting_average DECIMAL(6,2) DEFAULT 0,
    highest_score INT DEFAULT 0,
    not_out_count INT DEFAULT 0,
    fours INT DEFAULT 0,
    sixes INT DEFAULT 0,
    fifties INT DEFAULT 0,
    centuries INT DEFAULT 0,
    ducks INT DEFAULT 0,
    team_name VARCHAR(100)
);

-- 7. IPL Player Bowling Stats
CREATE TABLE IF NOT EXISTS ipl_player_bowling (
    id SERIAL PRIMARY KEY,
    player_id INT,
    season_year INT,
    matches INT DEFAULT 0,
    innings INT DEFAULT 0,
    wickets INT DEFAULT 0,
    runs_conceded INT DEFAULT 0,
    balls_bowled INT DEFAULT 0,
    economy DECIMAL(5,2) DEFAULT 0,
    bowling_average DECIMAL(6,2) DEFAULT 0,
    best_bowling VARCHAR(10),
    four_wickets INT DEFAULT 0,
    five_wickets INT DEFAULT 0,
    team_name VARCHAR(100)
);

-- 8. IPL All-Time Records
CREATE TABLE IF NOT EXISTS ipl_all_time_records (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50),
    player_name VARCHAR(100),
    value INT,
    matches_played INT,
    seasons_played INT,
    team_name VARCHAR(100)
);

-- 9. IPL Greatest Matches
CREATE TABLE IF NOT EXISTS ipl_greatest_matches (
    id SERIAL PRIMARY KEY,
    season_year INT,
    match_type VARCHAR(50),
    title VARCHAR(200),
    description TEXT,
    team1_name VARCHAR(100),
    team2_name VARCHAR(100),
    team1_score INT,
    team1_wickets INT,
    team1_overs DECIMAL(4,1),
    team2_score INT,
    team2_wickets INT,
    team2_overs DECIMAL(4,1),
    winner_name VARCHAR(100),
    winner_margin VARCHAR(50),
    venue VARCHAR(200),
    match_date DATE,
    man_of_match VARCHAR(100),
    is_featured BOOLEAN DEFAULT FALSE
);

-- 10. IPL Winning Squads
CREATE TABLE IF NOT EXISTS ipl_winning_squads (
    id SERIAL PRIMARY KEY,
    season_id INT REFERENCES ipl_seasons(id),
    player_name VARCHAR(100),
    is_captain BOOLEAN DEFAULT FALSE,
    is_wicket_keeper BOOLEAN DEFAULT FALSE,
    role VARCHAR(50)
);

-- ============================================
-- INSERT IPL TEAMS DATA
-- ============================================

INSERT INTO ipl_teams (name, short_name, city, home_ground, founded_year, titles_won, runner_up_count, primary_color, secondary_color) VALUES
('Mumbai Indians', 'MI', 'Mumbai', 'Wankhede Stadium', 2008, 5, 1, '#004BA0', '#D1AB3E'),
('Chennai Super Kings', 'CSK', 'Chennai', 'M. A. Chidambaram Stadium', 2008, 5, 5, '#FFFF00', '#0033A0'),
('Kolkata Knight Riders', 'KKR', 'Kolkata', 'Eden Gardens', 2008, 2, 1, '#2E0854', '#B89B4A'),
('Sunrisers Hyderabad', 'SRH', 'Hyderabad', 'Rajiv Gandhi International Stadium', 2013, 1, 1, '#F26522', '#000000'),
('Rajasthan Royals', 'RR', 'Jaipur', 'Sawai Mansingh Stadium', 2008, 1, 1, '#2D52A0', '#FFD700'),
('Gujarat Titans', 'GT', 'Ahmedabad', 'Narendra Modi Stadium', 2022, 1, 1, '#1A2B4C', '#FFD700'),
('Royal Challengers Bangalore', 'RCB', 'Bengaluru', 'M. Chinnaswamy Stadium', 2008, 0, 3, '#E31E24', '#000000'),
('Delhi Capitals', 'DC', 'Delhi', 'Arun Jaitley Stadium', 2008, 0, 1, '#0078BC', '#EF1923'),
('Lucknow Super Giants', 'LSG', 'Lucknow', 'BRSABV Ekana Cricket Stadium', 2022, 0, 0, '#00BBFF', '#FFD700'),
('Punjab Kings', 'PBKS', 'Mohali', 'Punjab Cricket Association Stadium', 2008, 0, 0, '#ED1B24', '#A5C9E0'),
('Deccan Chargers', 'DC', 'Hyderabad', 'Rajiv Gandhi International Stadium', 2008, 1, 0, '#FF4F00', '#000000'),
('Gujarat Lions', 'GL', 'Rajkot', 'Saurashtra Cricket Association Stadium', 2016, 0, 1, '#E13C32', '#F9A823'),
('Rising Pune Supergiant', 'RPS', 'Pune', 'Maharashtra Cricket Association Stadium', 2016, 0, 1, '#440099', '#FFFFFF'),
('Pune Warriors India', 'PWI', 'Pune', 'Subrata Roy Sahara Stadium', 2011, 0, 0, '#80C71F', '#000000'),
('Kochi Tuskers Kerala', 'KTK', 'Kochi', 'Jawaharlal Nehru Stadium', 2011, 0, 0, '#FCD116', '#004C99');

-- ============================================
-- INSERT IPL SEASONS DATA
-- ============================================

-- Note: Replace player_id values with actual IDs from your players table
-- For now, using NULL - you can update later

INSERT INTO ipl_seasons (year, winner_team_id, runner_up_team_id, orange_cap_player_id, purple_cap_player_id, player_of_tournament_id, total_matches, total_teams, final_venue, final_match_date) VALUES
(2024, (SELECT id FROM ipl_teams WHERE name = 'Kolkata Knight Riders'), (SELECT id FROM ipl_teams WHERE name = 'Sunrisers Hyderabad'), NULL, NULL, NULL, 74, 10, 'M. A. Chidambaram Stadium, Chennai', '2024-05-26'),
(2023, (SELECT id FROM ipl_teams WHERE name = 'Chennai Super Kings'), (SELECT id FROM ipl_teams WHERE name = 'Gujarat Titans'), NULL, NULL, NULL, 74, 10, 'Narendra Modi Stadium, Ahmedabad', '2023-05-29'),
(2022, (SELECT id FROM ipl_teams WHERE name = 'Gujarat Titans'), (SELECT id FROM ipl_teams WHERE name = 'Rajasthan Royals'), NULL, NULL, NULL, 74, 10, 'Narendra Modi Stadium, Ahmedabad', '2022-05-29'),
(2021, (SELECT id FROM ipl_teams WHERE name = 'Chennai Super Kings'), (SELECT id FROM ipl_teams WHERE name = 'Kolkata Knight Riders'), NULL, NULL, NULL, 60, 8, 'Dubai International Cricket Stadium', '2021-10-15'),
(2020, (SELECT id FROM ipl_teams WHERE name = 'Mumbai Indians'), (SELECT id FROM ipl_teams WHERE name = 'Delhi Capitals'), NULL, NULL, NULL, 60, 8, 'Dubai International Cricket Stadium', '2020-11-10'),
(2019, (SELECT id FROM ipl_teams WHERE name = 'Mumbai Indians'), (SELECT id FROM ipl_teams WHERE name = 'Chennai Super Kings'), NULL, NULL, NULL, 60, 8, 'Rajiv Gandhi International Stadium, Hyderabad', '2019-05-12'),
(2018, (SELECT id FROM ipl_teams WHERE name = 'Chennai Super Kings'), (SELECT id FROM ipl_teams WHERE name = 'Sunrisers Hyderabad'), NULL, NULL, NULL, 60, 8, 'Wankhede Stadium, Mumbai', '2018-05-27'),
(2017, (SELECT id FROM ipl_teams WHERE name = 'Mumbai Indians'), (SELECT id FROM ipl_teams WHERE name = 'Rising Pune Supergiant'), NULL, NULL, NULL, 60, 8, 'Rajiv Gandhi International Stadium, Hyderabad', '2017-05-21'),
(2016, (SELECT id FROM ipl_teams WHERE name = 'Sunrisers Hyderabad'), (SELECT id FROM ipl_teams WHERE name = 'Royal Challengers Bangalore'), NULL, NULL, NULL, 60, 8, 'M. Chinnaswamy Stadium, Bengaluru', '2016-05-29'),
(2015, (SELECT id FROM ipl_teams WHERE name = 'Mumbai Indians'), (SELECT id FROM ipl_teams WHERE name = 'Chennai Super Kings'), NULL, NULL, NULL, 60, 8, 'Eden Gardens, Kolkata', '2015-05-24'),
(2014, (SELECT id FROM ipl_teams WHERE name = 'Kolkata Knight Riders'), (SELECT id FROM ipl_teams WHERE name = 'Punjab Kings'), NULL, NULL, NULL, 60, 8, 'M. Chinnaswamy Stadium, Bengaluru', '2014-06-01'),
(2013, (SELECT id FROM ipl_teams WHERE name = 'Mumbai Indians'), (SELECT id FROM ipl_teams WHERE name = 'Chennai Super Kings'), NULL, NULL, NULL, 76, 9, 'Eden Gardens, Kolkata', '2013-05-26'),
(2012, (SELECT id FROM ipl_teams WHERE name = 'Kolkata Knight Riders'), (SELECT id FROM ipl_teams WHERE name = 'Chennai Super Kings'), NULL, NULL, NULL, 76, 9, 'M. A. Chidambaram Stadium, Chennai', '2012-05-27'),
(2011, (SELECT id FROM ipl_teams WHERE name = 'Chennai Super Kings'), (SELECT id FROM ipl_teams WHERE name = 'Royal Challengers Bangalore'), NULL, NULL, NULL, 74, 10, 'M. A. Chidambaram Stadium, Chennai', '2011-05-28'),
(2010, (SELECT id FROM ipl_teams WHERE name = 'Chennai Super Kings'), (SELECT id FROM ipl_teams WHERE name = 'Mumbai Indians'), NULL, NULL, NULL, 60, 8, 'DY Patil Stadium, Navi Mumbai', '2010-04-25'),
(2009, (SELECT id FROM ipl_teams WHERE name = 'Deccan Chargers'), (SELECT id FROM ipl_teams WHERE name = 'Royal Challengers Bangalore'), NULL, NULL, NULL, 59, 8, 'Wanderers Stadium, Johannesburg', '2009-05-24'),
(2008, (SELECT id FROM ipl_teams WHERE name = 'Rajasthan Royals'), (SELECT id FROM ipl_teams WHERE name = 'Chennai Super Kings'), NULL, NULL, NULL, 59, 8, 'DY Patil Stadium, Navi Mumbai', '2008-06-01');

-- ============================================
-- INSERT ALL-TIME RECORDS
-- ============================================

-- Most Runs in IPL History
INSERT INTO ipl_all_time_records (category, player_name, value, matches_played, seasons_played, team_name) VALUES
('most_runs', 'Virat Kohli', 8004, 237, 16, 'Royal Challengers Bangalore'),
('most_runs', 'Shikhar Dhawan', 6769, 222, 15, 'Punjab Kings'),
('most_runs', 'Rohit Sharma', 6628, 257, 15, 'Mumbai Indians'),
('most_runs', 'David Warner', 6397, 176, 14, 'Sunrisers Hyderabad'),
('most_runs', 'Suresh Raina', 5528, 205, 13, 'Chennai Super Kings');

-- Most Wickets in IPL History
INSERT INTO ipl_all_time_records (category, player_name, value, matches_played, seasons_played, team_name) VALUES
('most_wickets', 'Yuzvendra Chahal', 187, 145, 12, 'Rajasthan Royals'),
('most_wickets', 'Dwayne Bravo', 183, 161, 12, 'Chennai Super Kings'),
('most_wickets', 'Piyush Chawla', 179, 165, 13, 'Mumbai Indians'),
('most_wickets', 'Amit Mishra', 174, 161, 13, 'Lucknow Super Giants'),
('most_wickets', 'Sunil Narine', 163, 157, 12, 'Kolkata Knight Riders');

-- Most Sixes
INSERT INTO ipl_all_time_records (category, player_name, value, matches_played, seasons_played, team_name) VALUES
('most_sixes', 'Chris Gayle', 357, 142, 11, 'Punjab Kings'),
('most_sixes', 'Rohit Sharma', 267, 257, 15, 'Mumbai Indians'),
('most_sixes', 'Virat Kohli', 259, 237, 16, 'Royal Challengers Bangalore'),
('most_sixes', 'MS Dhoni', 239, 250, 16, 'Chennai Super Kings'),
('most_sixes', 'Kieron Pollard', 223, 189, 13, 'Mumbai Indians');

-- Most Centuries
INSERT INTO ipl_all_time_records (category, player_name, value, matches_played, seasons_played, team_name) VALUES
('most_hundreds', 'Virat Kohli', 8, 237, 16, 'Royal Challengers Bangalore'),
('most_hundreds', 'Chris Gayle', 6, 142, 11, 'Punjab Kings'),
('most_hundreds', 'Jos Buttler', 6, 98, 8, 'Rajasthan Royals'),
('most_hundreds', 'David Warner', 4, 176, 14, 'Sunrisers Hyderabad'),
('most_hundreds', 'Shikhar Dhawan', 4, 222, 15, 'Punjab Kings');

-- ============================================
-- INSERT GREATEST MATCHES
-- ============================================

INSERT INTO ipl_greatest_matches (season_year, match_type, title, description, team1_name, team2_name, team1_score, team1_wickets, team1_overs, team2_score, team2_wickets, team2_overs, winner_name, winner_margin, venue, match_date, man_of_match, is_featured) VALUES
(2023, 'final', 'CSK vs GT - Rain-affected thriller', 'Chennai Super Kings chased down 171 in a rain-reduced final to win their 5th IPL title. Ravindra Jadeja hit a six and four off the last two balls.', 'Chennai Super Kings', 'Gujarat Titans', 171, 5, 15.0, 169, 5, 20.0, 'Chennai Super Kings', '5 wickets (DLS)', 'Narendra Modi Stadium, Ahmedabad', '2023-05-29', 'Ravindra Jadeja', true),
(2019, 'final', 'MI vs CSK - One-run thriller', 'Mumbai Indians defended 149 against Chennai Super Kings in a tense final. Lasith Malinga bowled a brilliant final over.', 'Mumbai Indians', 'Chennai Super Kings', 149, 8, 20.0, 148, 7, 20.0, 'Mumbai Indians', '1 run', 'Rajiv Gandhi International Stadium, Hyderabad', '2019-05-12', 'Jasprit Bumrah', true),
(2014, 'final', 'KKR vs KXIP - Record chase', 'Kolkata Knight Riders chased down 200 in the final against Punjab Kings. Manish Pandey and Piyush Chawla starred.', 'Kolkata Knight Riders', 'Punjab Kings', 200, 7, 19.3, 199, 4, 20.0, 'Kolkata Knight Riders', '3 wickets', 'M. Chinnaswamy Stadium, Bengaluru', '2014-06-01', 'Manish Pandey', true),
(2008, 'final', 'RR vs CSK - Underdog victory', 'Rajasthan Royals, the underdogs, defeated Chennai Super Kings to win the inaugural IPL.', 'Rajasthan Royals', 'Chennai Super Kings', 164, 7, 20.0, 163, 5, 20.0, 'Rajasthan Royals', '3 wickets', 'DY Patil Stadium, Navi Mumbai', '2008-06-01', 'Yusuf Pathan', true),
(2024, 'final', 'KKR vs SRH - Dominant performance', 'Kolkata Knight Riders put up a massive total and bowled out Sunrisers Hyderabad cheaply.', 'Kolkata Knight Riders', 'Sunrisers Hyderabad', 208, 5, 20.0, 113, 10, 16.0, 'Kolkata Knight Riders', '95 runs', 'M. A. Chidambaram Stadium, Chennai', '2024-05-26', 'Andre Russell', true);

-- ============================================
-- INSERT SOME PLAYER IPL STATS (Sample)
-- Note: Replace player_id with actual IDs from your players table
-- ============================================

-- For now, using placeholders - update with actual player_id values
-- You can run UPDATE queries later to link correct player_id

INSERT INTO ipl_player_batting (player_id, season_year, matches, innings, runs, balls_faced, strike_rate, batting_average, highest_score, fours, sixes, fifties, centuries, team_name) VALUES
(1, 2024, 15, 15, 741, 525, 141.14, 61.75, 113, 67, 31, 4, 1, 'Royal Challengers Bangalore'),
(1, 2023, 14, 14, 639, 456, 140.13, 53.25, 101, 55, 26, 3, 1, 'Royal Challengers Bangalore'),
(1, 2022, 16, 16, 526, 397, 132.49, 37.57, 73, 49, 22, 3, 0, 'Royal Challengers Bangalore');

-- ============================================
-- INSERT PLAYOFF MATCHES FOR RECENT SEASONS
-- ============================================

-- 2024 Playoffs
INSERT INTO ipl_playoff_matches (season_id, match_type, team1_id, team2_id, winner_id, winner_margin, venue, match_date, man_of_match) VALUES
((SELECT id FROM ipl_seasons WHERE year=2024), 'qualifier1', (SELECT id FROM ipl_teams WHERE name='Kolkata Knight Riders'), (SELECT id FROM ipl_teams WHERE name='Sunrisers Hyderabad'), (SELECT id FROM ipl_teams WHERE name='Kolkata Knight Riders'), '8 wickets', 'Narendra Modi Stadium, Ahmedabad', '2024-05-21', 'Mitchell Starc'),
((SELECT id FROM ipl_seasons WHERE year=2024), 'eliminator', (SELECT id FROM ipl_teams WHERE name='Rajasthan Royals'), (SELECT id FROM ipl_teams WHERE name='Royal Challengers Bangalore'), (SELECT id FROM ipl_teams WHERE name='Rajasthan Royals'), '4 wickets', 'Narendra Modi Stadium, Ahmedabad', '2024-05-22', 'Yashasvi Jaiswal'),
((SELECT id FROM ipl_seasons WHERE year=2024), 'qualifier2', (SELECT id FROM ipl_teams WHERE name='Sunrisers Hyderabad'), (SELECT id FROM ipl_teams WHERE name='Rajasthan Royals'), (SELECT id FROM ipl_teams WHERE name='Sunrisers Hyderabad'), '36 runs', 'M. A. Chidambaram Stadium, Chennai', '2024-05-24', 'Travis Head');

-- 2023 Playoffs
INSERT INTO ipl_playoff_matches (season_id, match_type, team1_id, team2_id, winner_id, winner_margin, venue, match_date, man_of_match) VALUES
((SELECT id FROM ipl_seasons WHERE year=2023), 'qualifier1', (SELECT id FROM ipl_teams WHERE name='Gujarat Titans'), (SELECT id FROM ipl_teams WHERE name='Chennai Super Kings'), (SELECT id FROM ipl_teams WHERE name='Gujarat Titans'), '5 wickets', 'M. A. Chidambaram Stadium, Chennai', '2023-05-23', 'Rashid Khan'),
((SELECT id FROM ipl_seasons WHERE year=2023), 'eliminator', (SELECT id FROM ipl_teams WHERE name='Lucknow Super Giants'), (SELECT id FROM ipl_teams WHERE name='Mumbai Indians'), (SELECT id FROM ipl_teams WHERE name='Mumbai Indians'), '81 runs', 'M. A. Chidambaram Stadium, Chennai', '2023-05-24', 'Akash Madhwal'),
((SELECT id FROM ipl_seasons WHERE year=2023), 'qualifier2', (SELECT id FROM ipl_teams WHERE name='Chennai Super Kings'), (SELECT id FROM ipl_teams WHERE name='Mumbai Indians'), (SELECT id FROM ipl_teams WHERE name='Chennai Super Kings'), '15 runs', 'Narendra Modi Stadium, Ahmedabad', '2023-05-26', 'Ruturaj Gaikwad');

-- ============================================
-- INSERT POINTS TABLE FOR 2024 SEASON
-- ============================================

INSERT INTO ipl_points_table (season_id, team_id, group_name, matches_played, matches_won, matches_lost, points, net_run_rate) VALUES
((SELECT id FROM ipl_seasons WHERE year=2024), (SELECT id FROM ipl_teams WHERE name='Kolkata Knight Riders'), 'Group', 14, 12, 2, 24, 1.428),
((SELECT id FROM ipl_seasons WHERE year=2024), (SELECT id FROM ipl_teams WHERE name='Sunrisers Hyderabad'), 'Group', 14, 9, 5, 18, 0.414),
((SELECT id FROM ipl_seasons WHERE year=2024), (SELECT id FROM ipl_teams WHERE name='Rajasthan Royals'), 'Group', 14, 9, 5, 18, 0.273),
((SELECT id FROM ipl_seasons WHERE year=2024), (SELECT id FROM ipl_teams WHERE name='Royal Challengers Bangalore'), 'Group', 14, 7, 7, 14, 0.459),
((SELECT id FROM ipl_seasons WHERE year=2024), (SELECT id FROM ipl_teams WHERE name='Chennai Super Kings'), 'Group', 14, 7, 7, 14, 0.392),
((SELECT id FROM ipl_seasons WHERE year=2024), (SELECT id FROM ipl_teams WHERE name='Delhi Capitals'), 'Group', 14, 7, 7, 14, -0.377),
((SELECT id FROM ipl_seasons WHERE year=2024), (SELECT id FROM ipl_teams WHERE name='Lucknow Super Giants'), 'Group', 14, 7, 7, 14, -0.667),
((SELECT id FROM ipl_seasons WHERE year=2024), (SELECT id FROM ipl_teams WHERE name='Gujarat Titans'), 'Group', 14, 5, 9, 10, -1.063),
((SELECT id FROM ipl_seasons WHERE year=2024), (SELECT id FROM ipl_teams WHERE name='Punjab Kings'), 'Group', 14, 5, 9, 10, -0.353),
((SELECT id FROM ipl_seasons WHERE year=2024), (SELECT id FROM ipl_teams WHERE name='Mumbai Indians'), 'Group', 14, 4, 10, 8, -0.318);

-- ============================================
-- FIX 1: Update Royal Challengers Bengaluru to show 1 title (2025 winner)
-- ============================================

UPDATE ipl_teams 
SET titles_won = 1 
WHERE name = 'Royal Challengers Bengaluru' OR id = 7;

-- Verify the update
SELECT id, name, titles_won FROM ipl_teams WHERE name LIKE '%Royal%';

-- ============================================
-- FIX 2: Fix the team_id references in ipl_team_rankings
-- ============================================

-- First, check what team_id values exist in ipl_team_rankings
SELECT DISTINCT team_id FROM ipl_team_rankings ORDER BY team_id;

-- Check what team_id values exist in ipl_teams
SELECT id, name FROM ipl_teams ORDER BY id;

-- Clear the existing rankings
TRUNCATE ipl_team_rankings;

-- Re-insert with correct team_id references
INSERT INTO ipl_team_rankings (team_id, titles_won, runner_up_count, matches_played, matches_won, win_percentage, rank_position) VALUES
((SELECT id FROM ipl_teams WHERE name = 'Mumbai Indians'), 5, 1, 257, 140, 54.47, 1),
((SELECT id FROM ipl_teams WHERE name = 'Chennai Super Kings'), 5, 5, 244, 138, 56.56, 2),
((SELECT id FROM ipl_teams WHERE name = 'Kolkata Knight Riders'), 3, 1, 240, 118, 49.17, 3),
((SELECT id FROM ipl_teams WHERE name = 'Royal Challengers Bengaluru'), 1, 3, 242, 123, 50.83, 4),
((SELECT id FROM ipl_teams WHERE name = 'Sunrisers Hyderabad'), 1, 2, 176, 87, 49.43, 5),
((SELECT id FROM ipl_teams WHERE name = 'Rajasthan Royals'), 1, 1, 199, 93, 46.73, 6),
((SELECT id FROM ipl_teams WHERE name = 'Gujarat Titans'), 1, 1, 44, 27, 61.36, 7),
((SELECT id FROM ipl_teams WHERE name = 'Deccan Chargers'), 1, 0, 75, 35, 46.67, 8),
((SELECT id FROM ipl_teams WHERE name = 'Delhi Capitals'), 0, 1, 205, 97, 47.32, 9),
((SELECT id FROM ipl_teams WHERE name = 'Lucknow Super Giants'), 0, 0, 44, 24, 54.55, 10),
((SELECT id FROM ipl_teams WHERE name = 'Punjab Kings'), 0, 1, 212, 99, 46.70, 11);

-- ============================================
-- FIX 3: Verify the data is correct now
-- ============================================

-- Check teams with correct titles
SELECT id, name, titles_won FROM ipl_teams WHERE titles_won > 0 ORDER BY titles_won DESC;

-- Check rankings with correct team names
SELECT 
    t.name,
    r.titles_won,
    r.runner_up_count,
    r.win_percentage,
    r.rank_position
FROM ipl_team_rankings r
JOIN ipl_teams t ON r.team_id = t.id
ORDER BY r.rank_position;

-- ============================================
-- FIX 4: Also update the 2025 season to ensure winner is correct
-- ============================================

UPDATE ipl_seasons 
SET winner_team_id = (SELECT id FROM ipl_teams WHERE name = 'Royal Challengers Bengaluru')
WHERE year = 2025;

-- Verify 2025 season
SELECT 
    s.year,
    w.name as winner,
    r.name as runner_up
FROM ipl_seasons s
JOIN ipl_teams w ON s.winner_team_id = w.id
JOIN ipl_teams r ON s.runner_up_team_id = r.id
WHERE s.year = 2025;

-- ============================================
-- INSERT ALL IPL SEASONS (2008-2025)
-- ============================================

-- First, clear existing seasons
TRUNCATE ipl_seasons RESTART IDENTITY CASCADE;

-- Insert all seasons
INSERT INTO ipl_seasons (year, winner_team_id, runner_up_team_id, total_matches, total_teams, final_venue, final_match_date) VALUES
-- 2025
(2025, 
 (SELECT id FROM ipl_teams WHERE name = 'Royal Challengers Bengaluru'),
 (SELECT id FROM ipl_teams WHERE name = 'Chennai Super Kings'),
 74, 10, 'M. Chinnaswamy Stadium, Bengaluru', '2025-05-25'),

-- 2024
(2024, 
 (SELECT id FROM ipl_teams WHERE name = 'Kolkata Knight Riders'),
 (SELECT id FROM ipl_teams WHERE name = 'Sunrisers Hyderabad'),
 74, 10, 'M. A. Chidambaram Stadium, Chennai', '2024-05-26'),

-- 2023
(2023, 
 (SELECT id FROM ipl_teams WHERE name = 'Chennai Super Kings'),
 (SELECT id FROM ipl_teams WHERE name = 'Gujarat Titans'),
 74, 10, 'Narendra Modi Stadium, Ahmedabad', '2023-05-29'),

-- 2022
(2022, 
 (SELECT id FROM ipl_teams WHERE name = 'Gujarat Titans'),
 (SELECT id FROM ipl_teams WHERE name = 'Rajasthan Royals'),
 74, 10, 'Narendra Modi Stadium, Ahmedabad', '2022-05-29'),

-- 2021
(2021, 
 (SELECT id FROM ipl_teams WHERE name = 'Chennai Super Kings'),
 (SELECT id FROM ipl_teams WHERE name = 'Kolkata Knight Riders'),
 60, 8, 'Dubai International Cricket Stadium', '2021-10-15'),

-- 2020
(2020, 
 (SELECT id FROM ipl_teams WHERE name = 'Mumbai Indians'),
 (SELECT id FROM ipl_teams WHERE name = 'Delhi Capitals'),
 60, 8, 'Dubai International Cricket Stadium', '2020-11-10'),

-- 2019
(2019, 
 (SELECT id FROM ipl_teams WHERE name = 'Mumbai Indians'),
 (SELECT id FROM ipl_teams WHERE name = 'Chennai Super Kings'),
 60, 8, 'Rajiv Gandhi International Stadium, Hyderabad', '2019-05-12'),

-- 2018
(2018, 
 (SELECT id FROM ipl_teams WHERE name = 'Chennai Super Kings'),
 (SELECT id FROM ipl_teams WHERE name = 'Sunrisers Hyderabad'),
 60, 8, 'Wankhede Stadium, Mumbai', '2018-05-27'),

-- 2017
(2017, 
 (SELECT id FROM ipl_teams WHERE name = 'Mumbai Indians'),
 (SELECT id FROM ipl_teams WHERE name = 'Rising Pune Supergiant'),
 60, 8, 'Rajiv Gandhi International Stadium, Hyderabad', '2017-05-21'),

-- 2016
(2016, 
 (SELECT id FROM ipl_teams WHERE name = 'Sunrisers Hyderabad'),
 (SELECT id FROM ipl_teams WHERE name = 'Royal Challengers Bengaluru'),
 60, 8, 'M. Chinnaswamy Stadium, Bengaluru', '2016-05-29'),

-- 2015
(2015, 
 (SELECT id FROM ipl_teams WHERE name = 'Mumbai Indians'),
 (SELECT id FROM ipl_teams WHERE name = 'Chennai Super Kings'),
 60, 8, 'Eden Gardens, Kolkata', '2015-05-24'),

-- 2014
(2014, 
 (SELECT id FROM ipl_teams WHERE name = 'Kolkata Knight Riders'),
 (SELECT id FROM ipl_teams WHERE name = 'Punjab Kings'),
 60, 8, 'M. Chinnaswamy Stadium, Bengaluru', '2014-06-01'),

-- 2013
(2013, 
 (SELECT id FROM ipl_teams WHERE name = 'Mumbai Indians'),
 (SELECT id FROM ipl_teams WHERE name = 'Chennai Super Kings'),
 76, 9, 'Eden Gardens, Kolkata', '2013-05-26'),

-- 2012
(2012, 
 (SELECT id FROM ipl_teams WHERE name = 'Kolkata Knight Riders'),
 (SELECT id FROM ipl_teams WHERE name = 'Chennai Super Kings'),
 76, 9, 'M. A. Chidambaram Stadium, Chennai', '2012-05-27'),

-- 2011
(2011, 
 (SELECT id FROM ipl_teams WHERE name = 'Chennai Super Kings'),
 (SELECT id FROM ipl_teams WHERE name = 'Royal Challengers Bengaluru'),
 74, 10, 'M. A. Chidambaram Stadium, Chennai', '2011-05-28'),

-- 2010
(2010, 
 (SELECT id FROM ipl_teams WHERE name = 'Chennai Super Kings'),
 (SELECT id FROM ipl_teams WHERE name = 'Mumbai Indians'),
 60, 8, 'DY Patil Stadium, Navi Mumbai', '2010-04-25'),

-- 2009
(2009, 
 (SELECT id FROM ipl_teams WHERE name = 'Deccan Chargers'),
 (SELECT id FROM ipl_teams WHERE name = 'Royal Challengers Bengaluru'),
 59, 8, 'Wanderers Stadium, Johannesburg', '2009-05-24'),

-- 2008
(2008, 
 (SELECT id FROM ipl_teams WHERE name = 'Rajasthan Royals'),
 (SELECT id FROM ipl_teams WHERE name = 'Chennai Super Kings'),
 59, 8, 'DY Patil Stadium, Navi Mumbai', '2008-06-01');

-- ============================================
-- VERIFY ALL SEASONS
-- ============================================

SELECT 
    s.year,
    w.name as winner,
    r.name as runner_up,
    s.final_venue
FROM ipl_seasons s
JOIN ipl_teams w ON s.winner_team_id = w.id
JOIN ipl_teams r ON s.runner_up_team_id = r.id
ORDER BY s.year DESC;

-- ============================================
-- IPL ALL-TIME RECORDS
-- ============================================

-- Most Runs in IPL History
INSERT INTO ipl_all_time_records (category, player_name, value, matches_played, seasons_played, team_name) VALUES
('most_runs', 'Virat Kohli', 8004, 240, 17, 'Royal Challengers Bengaluru'),
('most_runs', 'Shikhar Dhawan', 6769, 222, 16, 'Punjab Kings'),
('most_runs', 'Rohit Sharma', 6628, 257, 17, 'Mumbai Indians'),
('most_runs', 'David Warner', 6397, 176, 14, 'Sunrisers Hyderabad'),
('most_runs', 'Suresh Raina', 5528, 205, 13, 'Chennai Super Kings'),
('most_runs', 'MS Dhoni', 5243, 250, 16, 'Chennai Super Kings'),
('most_runs', 'AB de Villiers', 5162, 184, 14, 'Royal Challengers Bengaluru'),
('most_runs', 'Chris Gayle', 4965, 142, 11, 'Punjab Kings'),
('most_runs', 'Robin Uthappa', 4952, 205, 14, 'Chennai Super Kings'),
('most_runs', 'Gautam Gambhir', 4217, 154, 11, 'Kolkata Knight Riders');

-- Most Wickets in IPL History
INSERT INTO ipl_all_time_records (category, player_name, value, matches_played, seasons_played, team_name) VALUES
('most_wickets', 'Yuzvendra Chahal', 187, 145, 12, 'Rajasthan Royals'),
('most_wickets', 'Dwayne Bravo', 183, 161, 12, 'Chennai Super Kings'),
('most_wickets', 'Piyush Chawla', 179, 165, 13, 'Mumbai Indians'),
('most_wickets', 'Amit Mishra', 174, 161, 13, 'Lucknow Super Giants'),
('most_wickets', 'Sunil Narine', 163, 157, 12, 'Kolkata Knight Riders'),
('most_wickets', 'Bhuvneshwar Kumar', 160, 160, 13, 'Sunrisers Hyderabad'),
('most_wickets', 'Lasith Malinga', 170, 122, 10, 'Mumbai Indians'),
('most_wickets', 'Ravichandran Ashwin', 157, 184, 14, 'Rajasthan Royals'),
('most_wickets', 'Jasprit Bumrah', 145, 120, 10, 'Mumbai Indians'),
('most_wickets', 'Kagiso Rabada', 115, 80, 7, 'Punjab Kings');

-- Most Sixes in IPL History
INSERT INTO ipl_all_time_records (category, player_name, value, matches_played, seasons_played, team_name) VALUES
('most_sixes', 'Chris Gayle', 357, 142, 11, 'Punjab Kings'),
('most_sixes', 'Rohit Sharma', 267, 257, 17, 'Mumbai Indians'),
('most_sixes', 'Virat Kohli', 259, 240, 17, 'Royal Challengers Bengaluru'),
('most_sixes', 'MS Dhoni', 239, 250, 16, 'Chennai Super Kings'),
('most_sixes', 'Kieron Pollard', 223, 189, 13, 'Mumbai Indians'),
('most_sixes', 'AB de Villiers', 221, 184, 14, 'Royal Challengers Bengaluru'),
('most_sixes', 'David Warner', 215, 176, 14, 'Sunrisers Hyderabad'),
('most_sixes', 'Shane Watson', 190, 145, 11, 'Chennai Super Kings'),
('most_sixes', 'Suresh Raina', 203, 205, 13, 'Chennai Super Kings'),
('most_sixes', 'Andre Russell', 190, 110, 9, 'Kolkata Knight Riders');

-- Most Hundreds in IPL History
INSERT INTO ipl_all_time_records (category, player_name, value, matches_played, seasons_played, team_name) VALUES
('most_hundreds', 'Virat Kohli', 8, 240, 17, 'Royal Challengers Bengaluru'),
('most_hundreds', 'Chris Gayle', 6, 142, 11, 'Punjab Kings'),
('most_hundreds', 'Jos Buttler', 6, 98, 8, 'Rajasthan Royals'),
('most_hundreds', 'David Warner', 4, 176, 14, 'Sunrisers Hyderabad'),
('most_hundreds', 'Shikhar Dhawan', 4, 222, 16, 'Punjab Kings'),
('most_hundreds', 'AB de Villiers', 3, 184, 14, 'Royal Challengers Bengaluru'),
('most_hundreds', 'Shane Watson', 4, 145, 11, 'Chennai Super Kings'),
('most_hundreds', 'KL Rahul', 4, 118, 9, 'Lucknow Super Giants'),
('most_hundreds', 'Sanju Samson', 3, 152, 12, 'Rajasthan Royals'),
('most_hundreds', 'Brendon McCullum', 2, 109, 8, 'Kolkata Knight Riders');

-- Most Fifties in IPL History
INSERT INTO ipl_all_time_records (category, player_name, value, matches_played, seasons_played, team_name) VALUES
('most_fifties', 'David Warner', 62, 176, 14, 'Sunrisers Hyderabad'),
('most_fifties', 'Virat Kohli', 55, 240, 17, 'Royal Challengers Bengaluru'),
('most_fifties', 'Rohit Sharma', 45, 257, 17, 'Mumbai Indians'),
('most_fifties', 'Shikhar Dhawan', 47, 222, 16, 'Punjab Kings'),
('most_fifties', 'Suresh Raina', 39, 205, 13, 'Chennai Super Kings'),
('most_fifties', 'AB de Villiers', 40, 184, 14, 'Royal Challengers Bengaluru'),
('most_fifties', 'MS Dhoni', 28, 250, 16, 'Chennai Super Kings'),
('most_fifties', 'Gautam Gambhir', 36, 154, 11, 'Kolkata Knight Riders'),
('most_fifties', 'Robin Uthappa', 27, 205, 14, 'Chennai Super Kings'),
('most_fifties', 'Ajinkya Rahane', 31, 165, 12, 'Chennai Super Kings');

-- Best Batting Average (Min 1000 runs)
INSERT INTO ipl_all_time_records (category, player_name, value, matches_played, seasons_played, team_name) VALUES
('best_average', 'Ruturaj Gaikwad', 39.85, 65, 5, 'Chennai Super Kings'),
('best_average', 'KL Rahul', 46.15, 118, 9, 'Lucknow Super Giants'),
('best_average', 'David Warner', 41.29, 176, 14, 'Sunrisers Hyderabad'),
('best_average', 'Virat Kohli', 37.32, 240, 17, 'Royal Challengers Bengaluru'),
('best_average', 'Jos Buttler', 37.82, 98, 8, 'Rajasthan Royals');

-- Best Strike Rate (Min 500 runs)
INSERT INTO ipl_all_time_records (category, player_name, value, matches_played, seasons_played, team_name) VALUES
('best_strike_rate', 'Andre Russell', 174.50, 110, 9, 'Kolkata Knight Riders'),
('best_strike_rate', 'Glenn Maxwell', 150.50, 124, 10, 'Royal Challengers Bengaluru'),
('best_strike_rate', 'Nicholas Pooran', 160.20, 85, 7, 'Lucknow Super Giants'),
('best_strike_rate', 'Sunil Narine', 162.30, 157, 12, 'Kolkata Knight Riders'),
('best_strike_rate', 'Kieron Pollard', 147.80, 189, 13, 'Mumbai Indians');

-- ============================================
-- IPL GREATEST MATCHES
-- ============================================

INSERT INTO ipl_greatest_matches (season_year, match_type, title, description, team1_name, team2_name, team1_score, team1_wickets, team1_overs, team2_score, team2_wickets, team2_overs, winner_name, winner_margin, venue, match_date, man_of_match, is_featured) VALUES
-- 2023 Final
(2023, 'final', 'CSK vs GT - Rain-affected thriller', 'Chennai Super Kings chased down 171 in a rain-reduced final to win their 5th IPL title. Ravindra Jadeja hit a six and four off the last two balls.', 
 'Chennai Super Kings', 'Gujarat Titans', 171, 5, 15.0, 169, 5, 20.0, 'Chennai Super Kings', '5 wickets (DLS)', 'Narendra Modi Stadium, Ahmedabad', '2023-05-29', 'Ravindra Jadeja', true),

-- 2019 Final
(2019, 'final', 'MI vs CSK - One-run thriller', 'Mumbai Indians defended 149 against Chennai Super Kings in a tense final. Lasith Malinga bowled a brilliant final over.', 
 'Mumbai Indians', 'Chennai Super Kings', 149, 8, 20.0, 148, 7, 20.0, 'Mumbai Indians', '1 run', 'Rajiv Gandhi International Stadium, Hyderabad', '2019-05-12', 'Jasprit Bumrah', true),

-- 2014 Final
(2014, 'final', 'KKR vs KXIP - Record chase', 'Kolkata Knight Riders chased down 200 in the final against Punjab Kings. Manish Pandey and Piyush Chawla starred.', 
 'Kolkata Knight Riders', 'Punjab Kings', 200, 7, 19.3, 199, 4, 20.0, 'Kolkata Knight Riders', '3 wickets', 'M. Chinnaswamy Stadium, Bengaluru', '2014-06-01', 'Manish Pandey', true),

-- 2008 Final
(2008, 'final', 'RR vs CSK - Underdog victory', 'Rajasthan Royals, the underdogs, defeated Chennai Super Kings to win the inaugural IPL.', 
 'Rajasthan Royals', 'Chennai Super Kings', 164, 7, 20.0, 163, 5, 20.0, 'Rajasthan Royals', '3 wickets', 'DY Patil Stadium, Navi Mumbai', '2008-06-01', 'Yusuf Pathan', true),

-- 2024 Final
(2024, 'final', 'KKR vs SRH - Dominant performance', 'Kolkata Knight Riders put up a massive total and bowled out Sunrisers Hyderabad cheaply to win their third title.', 
 'Kolkata Knight Riders', 'Sunrisers Hyderabad', 208, 5, 20.0, 113, 10, 16.0, 'Kolkata Knight Riders', '95 runs', 'M. A. Chidambaram Stadium, Chennai', '2024-05-26', 'Andre Russell', true),

-- 2025 Final - RCB's Historic Win
(2025, 'final', 'RCB - The Wait is Over!', 'Royal Challengers Bengaluru finally clinched their maiden IPL title after 17 years, defeating Chennai Super Kings in a thrilling final at home. Virat Kohli scored a magnificent century to lead his team to victory.', 
 'Royal Challengers Bengaluru', 'Chennai Super Kings', 198, 4, 20.0, 195, 7, 20.0, 'Royal Challengers Bengaluru', '3 runs', 'M. Chinnaswamy Stadium, Bengaluru', '2025-05-25', 'Virat Kohli', true),

-- 2016 Final - RCB vs SRH
(2016, 'final', 'SRH vs RCB - Warner leads Hyderabad to title', 'Sunrisers Hyderabad defeated Royal Challengers Bangalore to win their first IPL title. David Warner led from the front.', 
 'Sunrisers Hyderabad', 'Royal Challengers Bengaluru', 208, 7, 20.0, 200, 7, 20.0, 'Sunrisers Hyderabad', '8 runs', 'M. Chinnaswamy Stadium, Bengaluru', '2016-05-29', 'Ben Cutting', true),

-- 2017 Final - MI vs RPS
(2017, 'final', 'MI vs RPS - Last-ball thriller', 'Mumbai Indians defeated Rising Pune Supergiant in a last-ball thriller to win their third title.', 
 'Mumbai Indians', 'Rising Pune Supergiant', 129, 8, 20.0, 128, 6, 20.0, 'Mumbai Indians', '1 run', 'Rajiv Gandhi International Stadium, Hyderabad', '2017-05-21', 'Krunal Pandya', true),

-- RCB vs GL - Gayle's 175*
(2013, 'league', 'RCB vs GL - Gayle Storm', 'Chris Gayle smashed 175* off 66 balls, the highest individual score in IPL history, as RCB posted 263/5.', 
 'Royal Challengers Bengaluru', 'Gujarat Lions', 263, 5, 20.0, 171, 10, 17.0, 'Royal Challengers Bengaluru', '92 runs', 'M. Chinnaswamy Stadium, Bengaluru', '2013-04-23', 'Chris Gayle', true),

-- KKR vs RCB - 49 all out
(2017, 'league', 'KKR vs RCB - The 49 all out', 'Kolkata Knight Riders bowled out Royal Challengers Bangalore for just 49 runs, the lowest total in IPL history.', 
 'Kolkata Knight Riders', 'Royal Challengers Bengaluru', 131, 4, 13.3, 49, 10, 9.4, 'Kolkata Knight Riders', '82 runs', 'Eden Gardens, Kolkata', '2017-04-23', 'Nathan Coulter-Nile', true),

-- MI vs CSK - 2018 First Match Return
(2018, 'league', 'CSK vs MI - The Return', 'Chennai Super Kings made a triumphant return to IPL after 2-year ban, beating Mumbai Indians in a thrilling finish.', 
 'Chennai Super Kings', 'Mumbai Indians', 169, 5, 19.5, 165, 9, 20.0, 'Chennai Super Kings', '1 wicket', 'Wankhede Stadium, Mumbai', '2018-04-07', 'Dwayne Bravo', false),

-- KKR vs KXIP - 2014 Qualifier 1
(2014, 'playoff', 'KKR vs KXIP - Qualifier 1 thriller', 'Kolkata Knight Riders chased down 200+ to qualify for the final in a high-scoring thriller.', 
 'Kolkata Knight Riders', 'Punjab Kings', 200, 7, 19.3, 199, 4, 20.0, 'Kolkata Knight Riders', '3 wickets', 'Eden Gardens, Kolkata', '2014-05-28', 'Robin Uthappa', false),

-- GT vs RR - 2022 Qualifier 1
(2022, 'playoff', 'GT vs RR - Miller Magic', 'David Miller hit a last-ball six to guide Gujarat Titans to the final in their debut season.', 
 'Gujarat Titans', 'Rajasthan Royals', 191, 5, 19.4, 188, 6, 20.0, 'Gujarat Titans', '4 wickets', 'Eden Gardens, Kolkata', '2022-05-24', 'David Miller', false);

 -- Drop existing table if it exists with wrong structure
DROP TABLE IF EXISTS ipl_all_time_records;

-- Create table with correct columns
CREATE TABLE ipl_all_time_records (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    player_name VARCHAR(100) NOT NULL,
    value INTEGER NOT NULL,
    matches_played INTEGER,
    seasons_played INTEGER,
    team_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert IPL All-Time Records
INSERT INTO ipl_all_time_records (category, player_name, value, matches_played, seasons_played, team_name) VALUES
-- Most Runs
('most_runs', 'Virat Kohli', 8004, 240, 17, 'Royal Challengers Bengaluru'),
('most_runs', 'Shikhar Dhawan', 6769, 222, 16, 'Punjab Kings'),
('most_runs', 'Rohit Sharma', 6628, 257, 17, 'Mumbai Indians'),
('most_runs', 'David Warner', 6397, 176, 14, 'Sunrisers Hyderabad'),
('most_runs', 'Suresh Raina', 5528, 205, 13, 'Chennai Super Kings'),
('most_runs', 'MS Dhoni', 5243, 250, 16, 'Chennai Super Kings'),
('most_runs', 'AB de Villiers', 5162, 184, 14, 'Royal Challengers Bengaluru'),
('most_runs', 'Chris Gayle', 4965, 142, 11, 'Punjab Kings'),
('most_runs', 'Robin Uthappa', 4952, 205, 14, 'Chennai Super Kings'),
('most_runs', 'Gautam Gambhir', 4217, 154, 11, 'Kolkata Knight Riders'),

-- Most Wickets
('most_wickets', 'Yuzvendra Chahal', 187, 145, 12, 'Rajasthan Royals'),
('most_wickets', 'Dwayne Bravo', 183, 161, 12, 'Chennai Super Kings'),
('most_wickets', 'Piyush Chawla', 179, 165, 13, 'Mumbai Indians'),
('most_wickets', 'Amit Mishra', 174, 161, 13, 'Lucknow Super Giants'),
('most_wickets', 'Sunil Narine', 163, 157, 12, 'Kolkata Knight Riders'),
('most_wickets', 'Bhuvneshwar Kumar', 160, 160, 13, 'Sunrisers Hyderabad'),
('most_wickets', 'Lasith Malinga', 170, 122, 10, 'Mumbai Indians'),
('most_wickets', 'Ravichandran Ashwin', 157, 184, 14, 'Rajasthan Royals'),
('most_wickets', 'Jasprit Bumrah', 145, 120, 10, 'Mumbai Indians'),
('most_wickets', 'Kagiso Rabada', 115, 80, 7, 'Punjab Kings'),

-- Most Sixes
('most_sixes', 'Chris Gayle', 357, 142, 11, 'Punjab Kings'),
('most_sixes', 'Rohit Sharma', 267, 257, 17, 'Mumbai Indians'),
('most_sixes', 'Virat Kohli', 259, 240, 17, 'Royal Challengers Bengaluru'),
('most_sixes', 'MS Dhoni', 239, 250, 16, 'Chennai Super Kings'),
('most_sixes', 'Kieron Pollard', 223, 189, 13, 'Mumbai Indians'),
('most_sixes', 'AB de Villiers', 221, 184, 14, 'Royal Challengers Bengaluru'),
('most_sixes', 'David Warner', 215, 176, 14, 'Sunrisers Hyderabad'),
('most_sixes', 'Shane Watson', 190, 145, 11, 'Chennai Super Kings'),
('most_sixes', 'Suresh Raina', 203, 205, 13, 'Chennai Super Kings'),
('most_sixes', 'Andre Russell', 190, 110, 9, 'Kolkata Knight Riders'),

-- Most Hundreds
('most_hundreds', 'Virat Kohli', 8, 240, 17, 'Royal Challengers Bengaluru'),
('most_hundreds', 'Chris Gayle', 6, 142, 11, 'Punjab Kings'),
('most_hundreds', 'Jos Buttler', 6, 98, 8, 'Rajasthan Royals'),
('most_hundreds', 'David Warner', 4, 176, 14, 'Sunrisers Hyderabad'),
('most_hundreds', 'Shikhar Dhawan', 4, 222, 16, 'Punjab Kings'),
('most_hundreds', 'AB de Villiers', 3, 184, 14, 'Royal Challengers Bengaluru'),
('most_hundreds', 'Shane Watson', 4, 145, 11, 'Chennai Super Kings'),
('most_hundreds', 'KL Rahul', 4, 118, 9, 'Lucknow Super Giants'),
('most_hundreds', 'Sanju Samson', 3, 152, 12, 'Rajasthan Royals'),
('most_hundreds', 'Brendon McCullum', 2, 109, 8, 'Kolkata Knight Riders');

-- Create table for cap winners if not exists
CREATE TABLE IF NOT EXISTS ipl_cap_winners (
    id SERIAL PRIMARY KEY,
    year INTEGER NOT NULL UNIQUE,
    orange_cap_player VARCHAR(100) NOT NULL,
    orange_cap_runs INTEGER NOT NULL,
    orange_cap_team VARCHAR(100),
    purple_cap_player VARCHAR(100) NOT NULL,
    purple_cap_wickets INTEGER NOT NULL,
    purple_cap_team VARCHAR(100)
);

-- Insert all Orange Cap and Purple Cap winners from 2008 to 2025
INSERT INTO ipl_cap_winners (year, orange_cap_player, orange_cap_runs, orange_cap_team, purple_cap_player, purple_cap_wickets, purple_cap_team) VALUES
(2025, 'Sai Sudharshan', 759, 'Gujarat Titans', 'Prasidh Krishna', 25, 'Gujarat Titans'),
(2024, 'Virat Kohli', 741, 'Royal Challengers Bengaluru', 'Harshal Patel', 24, 'Punjab Kings'),
(2023, 'Shubman Gill', 890, 'Gujarat Titans', 'Mohammed Shami', 28, 'Gujarat Titans'),
(2022, 'Jos Buttler', 863, 'Rajasthan Royals', 'Yuzvendra Chahal', 27, 'Rajasthan Royals'),
(2021, 'Ruturaj Gaikwad', 635, 'Chennai Super Kings', 'Harshal Patel', 32, 'Royal Challengers Bengaluru'),
(2020, 'KL Rahul', 670, 'Punjab Kings', 'Kagiso Rabada', 30, 'Delhi Capitals'),
(2019, 'David Warner', 692, 'Sunrisers Hyderabad', 'Imran Tahir', 26, 'Chennai Super Kings'),
(2018, 'Kane Williamson', 735, 'Sunrisers Hyderabad', 'Andrew Tye', 24, 'Punjab Kings'),
(2017, 'David Warner', 641, 'Sunrisers Hyderabad', 'Bhuvneshwar Kumar', 26, 'Sunrisers Hyderabad'),
(2016, 'Virat Kohli', 973, 'Royal Challengers Bengaluru', 'Bhuvneshwar Kumar', 23, 'Sunrisers Hyderabad'),
(2015, 'David Warner', 562, 'Sunrisers Hyderabad', 'Dwayne Bravo', 26, 'Chennai Super Kings'),
(2014, 'Robin Uthappa', 660, 'Kolkata Knight Riders', 'Mohit Sharma', 23, 'Chennai Super Kings'),
(2013, 'Michael Hussey', 733, 'Chennai Super Kings', 'Dwayne Bravo', 32, 'Chennai Super Kings'),
(2012, 'Chris Gayle', 733, 'Royal Challengers Bengaluru', 'Morne Morkel', 25, 'Delhi Capitals'),
(2011, 'Chris Gayle', 608, 'Royal Challengers Bengaluru', 'Lasith Malinga', 28, 'Mumbai Indians'),
(2010, 'Sachin Tendulkar', 618, 'Mumbai Indians', 'Pragyan Ojha', 21, 'Deccan Chargers'),
(2009, 'Matthew Hayden', 572, 'Chennai Super Kings', 'RP Singh', 23, 'Deccan Chargers'),
(2008, 'Shaun Marsh', 616, 'Punjab Kings', 'Sohail Tanvir', 22, 'Rajasthan Royals');