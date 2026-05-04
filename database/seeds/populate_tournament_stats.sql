-- ============================================
-- POPULATE TOURNAMENT PLAYER STATS FOR ALL YEARS
-- ============================================

-- ============================================
-- 2023 WORLD CUP - Batting Stats (Top 10)
-- ============================================
INSERT INTO tournament_player_batting (tournament_id, player_id, team_id, matches, runs, highest_score, average, strike_rate, centuries, fifties, fours, sixes) VALUES
((SELECT id FROM world_cup_tournaments WHERE year = 2023), (SELECT id FROM players WHERE name = 'Virat Kohli'), (SELECT id FROM teams WHERE name = 'India'), 11, 765, 117, 95.62, 90.31, 2, 6, 68, 9),
((SELECT id FROM world_cup_tournaments WHERE year = 2023), (SELECT id FROM players WHERE name = 'Rohit Sharma'), (SELECT id FROM teams WHERE name = 'India'), 11, 597, 131, 54.27, 125.94, 1, 3, 66, 31),
((SELECT id FROM world_cup_tournaments WHERE year = 2023), (SELECT id FROM players WHERE name = 'Quinton de Kock'), (SELECT id FROM teams WHERE name = 'South Africa'), 10, 594, 174, 59.40, 107.20, 4, 0, 57, 21),
((SELECT id FROM world_cup_tournaments WHERE year = 2023), (SELECT id FROM players WHERE name = 'Rachin Ravindra'), (SELECT id FROM teams WHERE name = 'New Zealand'), 10, 578, 123, 64.22, 106.44, 3, 2, 55, 14),
((SELECT id FROM world_cup_tournaments WHERE year = 2023), (SELECT id FROM players WHERE name = 'Daryl Mitchell'), (SELECT id FROM teams WHERE name = 'New Zealand'), 10, 552, 134, 69.00, 111.11, 2, 2, 48, 20),
((SELECT id FROM world_cup_tournaments WHERE year = 2023), (SELECT id FROM players WHERE name = 'David Warner'), (SELECT id FROM teams WHERE name = 'Australia'), 11, 535, 163, 48.63, 106.15, 2, 2, 54, 17),
((SELECT id FROM world_cup_tournaments WHERE year = 2023), (SELECT id FROM players WHERE name = 'Shreyas Iyer'), (SELECT id FROM teams WHERE name = 'India'), 11, 530, 128, 66.25, 113.24, 2, 3, 45, 24),
((SELECT id FROM world_cup_tournaments WHERE year = 2023), (SELECT id FROM players WHERE name = 'Glenn Maxwell'), (SELECT id FROM teams WHERE name = 'Australia'), 9, 400, 201, 57.14, 150.45, 1, 0, 40, 22),
((SELECT id FROM world_cup_tournaments WHERE year = 2023), (SELECT id FROM players WHERE name = 'Mitchell Marsh'), (SELECT id FROM teams WHERE name = 'Australia'), 10, 441, 177, 49.00, 107.56, 1, 2, 41, 19),
((SELECT id FROM world_cup_tournaments WHERE year = 2023), (SELECT id FROM players WHERE name = 'Kusal Mendis'), (SELECT id FROM teams WHERE name = 'Sri Lanka'), 9, 294, 122, 32.66, 85.96, 1, 0, 30, 6);

-- ============================================
-- 2023 WORLD CUP - Bowling Stats (Top 10)
-- ============================================
INSERT INTO tournament_player_bowling (tournament_id, player_id, team_id, matches, wickets, average, economy, strike_rate, four_wickets, five_wickets, best_bowling) VALUES
((SELECT id FROM world_cup_tournaments WHERE year = 2023), (SELECT id FROM players WHERE name = 'Mohammed Shami'), (SELECT id FROM teams WHERE name = 'India'), 7, 24, 10.70, 5.26, 12.20, 0, 3, '7/57'),
((SELECT id FROM world_cup_tournaments WHERE year = 2023), (SELECT id FROM players WHERE name = 'Adam Zampa'), (SELECT id FROM teams WHERE name = 'Australia'), 11, 23, 22.39, 5.36, 25.00, 1, 0, '4/8'),
((SELECT id FROM world_cup_tournaments WHERE year = 2023), (SELECT id FROM players WHERE name = 'Dilshan Madushanka'), (SELECT id FROM teams WHERE name = 'Sri Lanka'), 9, 21, 25.00, 6.70, 22.30, 1, 0, '5/80'),
((SELECT id FROM world_cup_tournaments WHERE year = 2023), (SELECT id FROM players WHERE name = 'Gerald Coetzee'), (SELECT id FROM teams WHERE name = 'South Africa'), 8, 20, 19.80, 6.23, 19.00, 0, 0, '4/44'),
((SELECT id FROM world_cup_tournaments WHERE year = 2023), (SELECT id FROM players WHERE name = 'Mitchell Santner'), (SELECT id FROM teams WHERE name = 'New Zealand'), 10, 17, 25.29, 4.77, 31.70, 0, 0, '3/37'),
((SELECT id FROM world_cup_tournaments WHERE year = 2023), (SELECT id FROM players WHERE name = 'Jasprit Bumrah'), (SELECT id FROM teams WHERE name = 'India'), 11, 18, 18.66, 4.06, 27.50, 0, 0, '4/39'),
((SELECT id FROM world_cup_tournaments WHERE year = 2023), (SELECT id FROM players WHERE name = 'Shaheen Afridi'), (SELECT id FROM teams WHERE name = 'Pakistan'), 9, 18, 26.94, 5.72, 28.20, 1, 0, '5/54'),
((SELECT id FROM world_cup_tournaments WHERE year = 2023), (SELECT id FROM players WHERE name = 'Ravindra Jadeja'), (SELECT id FROM teams WHERE name = 'India'), 11, 16, 24.75, 4.43, 33.50, 0, 0, '3/28');

-- ============================================
-- 2019 WORLD CUP - Batting Stats (Top 10)
-- ============================================
INSERT INTO tournament_player_batting (tournament_id, player_id, team_id, matches, runs, highest_score, average, strike_rate, centuries, fifties, fours, sixes) VALUES
((SELECT id FROM world_cup_tournaments WHERE year = 2019), (SELECT id FROM players WHERE name = 'Rohit Sharma'), (SELECT id FROM teams WHERE name = 'India'), 9, 648, 140, 81.00, 98.48, 5, 1, 67, 14),
((SELECT id FROM world_cup_tournaments WHERE year = 2019), (SELECT id FROM players WHERE name = 'David Warner'), (SELECT id FROM teams WHERE name = 'Australia'), 10, 647, 166, 71.88, 89.42, 3, 3, 66, 8),
((SELECT id FROM world_cup_tournaments WHERE year = 2019), (SELECT id FROM players WHERE name = 'Shakib Al Hasan'), (SELECT id FROM teams WHERE name = 'Bangladesh'), 8, 606, 124, 86.57, 86.95, 2, 5, 60, 2),
((SELECT id FROM world_cup_tournaments WHERE year = 2019), (SELECT id FROM players WHERE name = 'Kane Williamson'), (SELECT id FROM teams WHERE name = 'New Zealand'), 10, 578, 148, 82.57, 74.48, 2, 2, 50, 3),
((SELECT id FROM world_cup_tournaments WHERE year = 2019), (SELECT id FROM players WHERE name = 'Joe Root'), (SELECT id FROM teams WHERE name = 'England'), 11, 556, 107, 61.77, 89.53, 2, 3, 48, 2);

-- ============================================
-- 2019 WORLD CUP - Bowling Stats (Top 10)
-- ============================================
INSERT INTO tournament_player_bowling (tournament_id, player_id, team_id, matches, wickets, average, economy, strike_rate, four_wickets, five_wickets, best_bowling) VALUES
((SELECT id FROM world_cup_tournaments WHERE year = 2019), (SELECT id FROM players WHERE name = 'Mitchell Starc'), (SELECT id FROM teams WHERE name = 'Australia'), 10, 27, 18.59, 5.43, 20.50, 0, 2, '5/26'),
((SELECT id FROM world_cup_tournaments WHERE year = 2019), (SELECT id FROM players WHERE name = 'Lockie Ferguson'), (SELECT id FROM teams WHERE name = 'New Zealand'), 9, 21, 19.47, 4.88, 23.90, 1, 0, '4/37'),
((SELECT id FROM world_cup_tournaments WHERE year = 2019), (SELECT id FROM players WHERE name = 'Jofra Archer'), (SELECT id FROM teams WHERE name = 'England'), 11, 20, 23.05, 4.57, 30.20, 2, 0, '3/27'),
((SELECT id FROM world_cup_tournaments WHERE year = 2019), (SELECT id FROM players WHERE name = 'Mustafizur Rahman'), (SELECT id FROM teams WHERE name = 'Bangladesh'), 8, 20, 24.35, 6.08, 24.00, 3, 0, '5/59'),
((SELECT id FROM world_cup_tournaments WHERE year = 2019), (SELECT id FROM players WHERE name = 'Mohammed Shami'), (SELECT id FROM teams WHERE name = 'India'), 4, 14, 17.14, 5.16, 19.90, 0, 1, '4/16');