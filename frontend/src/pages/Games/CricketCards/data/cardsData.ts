// frontend/src/pages/Games/CricketCards/data/cardsData.ts
import { Card, PlayerRole, Rarity } from '../types/cricketCards.types';
import { getCardArtUrl } from '../utils/avatarGenerator';

// Helper function to create card with generated art
const createCard = (
  id: number,
  playerName: string,
  role: PlayerRole,
  country: string,
  iplTeam: string,
  rarity: Rarity,
  stats: { batting: number; bowling: number; fielding: number; leadership: number; consistency: number; popularity: number },
  specialAbility: string,
  cardVersion: string,
  year: number,
  collectionSets: {
    worldCupWinner: boolean;
    iplCaptain: boolean;
    indianLegend: boolean;
    fastBowler: boolean;
    allRounder: boolean;
    goatEdition: boolean;
  }
): Card => ({
  id,
  playerName,
  role,
  country,
  iplTeam,
  rarity,
  stats,
  specialAbility,
  cardArtUrl: getCardArtUrl({ playerName, country, role, rarity }),
  cardVersion,
  year,
  isOwned: false,
  quantity: 0,
  isFavorite: false,
  collectionSets
});

export const cardsData: Card[] = [
  // ==================== LEGENDARY & MYTHIC CARDS ====================
  
  // India - Legendary Batsmen
  createCard(1, 'Virat Kohli', 'batsman', 'India', 'Royal Challengers Bangalore', 'legendary',
    { batting: 98, bowling: 25, fielding: 85, leadership: 95, consistency: 99, popularity: 100 },
    'King of Chase - +15 batting when chasing targets', 'Prime Kohli', 2016,
    { worldCupWinner: true, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: true }),
  
  createCard(2, 'Sachin Tendulkar', 'batsman', 'India', 'Mumbai Indians', 'mythic',
    { batting: 99, bowling: 30, fielding: 80, leadership: 90, consistency: 98, popularity: 100 },
    'Master Blaster - +20 batting in pressure situations', 'God of Cricket', 1998,
    { worldCupWinner: true, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: true }),
  
  createCard(3, 'MS Dhoni', 'wicketkeeper', 'India', 'Chennai Super Kings', 'legendary',
    { batting: 88, bowling: 10, fielding: 95, leadership: 98, consistency: 96, popularity: 100 },
    'Captain Cool - +15 leadership in finals', 'Thala', 2011,
    { worldCupWinner: true, iplCaptain: true, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: false }),
  
  createCard(4, 'Rohit Sharma', 'batsman', 'India', 'Mumbai Indians', 'legendary',
    { batting: 95, bowling: 20, fielding: 75, leadership: 88, consistency: 92, popularity: 98 },
    'Hitman - +10 batting in powerplay', 'Captain Hitman', 2019,
    { worldCupWinner: true, iplCaptain: true, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: false }),
  
  createCard(5, 'Jasprit Bumrah', 'bowler', 'India', 'Mumbai Indians', 'legendary',
    { batting: 20, bowling: 98, fielding: 85, leadership: 70, consistency: 95, popularity: 96 },
    'Yorker King - +20 bowling in death overs', 'Boom Boom', 2019,
    { worldCupWinner: true, iplCaptain: false, indianLegend: true, fastBowler: true, allRounder: false, goatEdition: false }),
  
  // International Mythic Players
  createCard(6, 'AB de Villiers', 'batsman', 'South Africa', 'Royal Challengers Bangalore', 'mythic',
    { batting: 97, bowling: 20, fielding: 92, leadership: 85, consistency: 95, popularity: 99 },
    'Mr 360 - +20 against all bowling types', 'ABD', 2016,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),
  
  createCard(7, 'Chris Gayle', 'batsman', 'West Indies', 'Kings XI Punjab', 'mythic',
    { batting: 96, bowling: 30, fielding: 70, leadership: 80, consistency: 85, popularity: 98 },
    'Universal Boss - +30 power hitting', 'Gayle Storm', 2013,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),
  
  createCard(8, 'Kumar Sangakkara', 'wicketkeeper', 'Sri Lanka', '', 'mythic',
    { batting: 95, bowling: 5, fielding: 90, leadership: 88, consistency: 96, popularity: 94 },
    'The Professor - +10 batting average', 'Sanga', 2011,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),
  
  // ==================== EPIC CARDS ====================
  
  createCard(9, 'Hardik Pandya', 'allrounder', 'India', 'Mumbai Indians', 'epic',
    { batting: 86, bowling: 82, fielding: 90, leadership: 85, consistency: 80, popularity: 90 },
    'Kung Fu Pandya - +10 all stats in death overs', 'HP', 2019,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),
  
  createCard(10, 'Ravindra Jadeja', 'allrounder', 'India', 'Chennai Super Kings', 'epic',
    { batting: 82, bowling: 88, fielding: 95, leadership: 80, consistency: 88, popularity: 89 },
    'Sir Jadeja - +15 fielding', 'Rockstar', 2018,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),
  
  createCard(11, 'KL Rahul', 'batsman', 'India', 'Lucknow Super Giants', 'epic',
    { batting: 86, bowling: 5, fielding: 85, leadership: 82, consistency: 84, popularity: 88 },
    'Elegant - +5 consistency', 'The Elegant', 2021,
    { worldCupWinner: false, iplCaptain: true, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),
  
  createCard(12, 'Shubman Gill', 'batsman', 'India', 'Gujarat Titans', 'epic',
    { batting: 88, bowling: 5, fielding: 82, leadership: 75, consistency: 85, popularity: 86 },
    'Future Star - +10 in ICC tournaments', 'The Prince', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),
  
  createCard(13, 'Suryakumar Yadav', 'batsman', 'India', 'Mumbai Indians', 'epic',
    { batting: 92, bowling: 10, fielding: 88, leadership: 70, consistency: 82, popularity: 89 },
    'Mr 360 - +15 against spin bowling', 'SKY', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),
  
  createCard(14, 'Mohammed Shami', 'bowler', 'India', 'Gujarat Titans', 'epic',
    { batting: 15, bowling: 94, fielding: 75, leadership: 65, consistency: 90, popularity: 88 },
    'Sultan of Swing - +15 with new ball', 'Shami', 2019,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),
  
  // International Epic Players
  createCard(15, 'David Warner', 'batsman', 'Australia', 'Delhi Capitals', 'legendary',
    { batting: 93, bowling: 10, fielding: 85, leadership: 88, consistency: 90, popularity: 94 },
    'Pocket Dynamite - +10 in powerplay', 'Warner', 2016,
    { worldCupWinner: true, iplCaptain: true, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),
  
  createCard(16, 'Steve Smith', 'batsman', 'Australia', '', 'legendary',
    { batting: 94, bowling: 15, fielding: 80, leadership: 85, consistency: 95, popularity: 92 },
    'The Scientist - +15 in pressure situations', 'Smudge', 2015,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),
  
  createCard(17, 'Pat Cummins', 'bowler', 'Australia', '', 'epic',
    { batting: 35, bowling: 96, fielding: 85, leadership: 92, consistency: 90, popularity: 88 },
    'Captain Leader - +10 bowling as captain', 'Cummins', 2021,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),
  
  createCard(18, 'Mitchell Starc', 'bowler', 'Australia', 'Kolkata Knight Riders', 'legendary',
    { batting: 30, bowling: 97, fielding: 75, leadership: 70, consistency: 85, popularity: 92 },
    'Yorker Specialist - +20 in death overs', 'Starc', 2015,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),
  
  createCard(19, 'Kane Williamson', 'batsman', 'New Zealand', '', 'legendary',
    { batting: 90, bowling: 25, fielding: 85, leadership: 90, consistency: 94, popularity: 90 },
    'The Nice Guy - +10 in run chases', 'Kane', 2018,
    { worldCupWinner: false, iplCaptain: true, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),
  
  createCard(20, 'Trent Boult', 'bowler', 'New Zealand', 'Mumbai Indians', 'epic',
    { batting: 20, bowling: 92, fielding: 80, leadership: 70, consistency: 88, popularity: 86 },
    'Swing Master - +15 with new ball', 'Boult', 2019,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),
  
  createCard(21, 'Joe Root', 'batsman', 'England', '', 'epic',
    { batting: 91, bowling: 30, fielding: 85, leadership: 88, consistency: 94, popularity: 88 },
    'The Root of England - +10 in Test matches', 'Root', 2015,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),
  
  createCard(22, 'Ben Stokes', 'allrounder', 'England', '', 'legendary',
    { batting: 88, bowling: 88, fielding: 90, leadership: 92, consistency: 92, popularity: 96 },
    'The Finisher - +15 in pressure situations', 'Stokes', 2019,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),
  
  createCard(23, 'Babar Azam', 'batsman', 'Pakistan', '', 'legendary',
    { batting: 94, bowling: 10, fielding: 85, leadership: 85, consistency: 92, popularity: 94 },
    'The Elegant - +10 against spin', 'Babar', 2021,
    { worldCupWinner: false, iplCaptain: true, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),
  
  createCard(24, 'Shaheen Afridi', 'bowler', 'Pakistan', '', 'epic',
    { batting: 15, bowling: 93, fielding: 75, leadership: 70, consistency: 85, popularity: 88 },
    'Lion of Lahore - +15 with new ball', 'Shaheen', 2021,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),
  
  createCard(25, 'Lasith Malinga', 'bowler', 'Sri Lanka', 'Mumbai Indians', 'legendary',
    { batting: 15, bowling: 96, fielding: 70, leadership: 85, consistency: 90, popularity: 95 },
    'Slinger - +20 yorker accuracy', 'Malinga', 2014,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),
  
  createCard(26, 'Dale Steyn', 'bowler', 'South Africa', '', 'legendary',
    { batting: 15, bowling: 97, fielding: 75, leadership: 85, consistency: 92, popularity: 94 },
    'Steyn Remover - +20 bowling in Test matches', 'Steyn', 2010,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),
  
  createCard(27, 'Andre Russell', 'allrounder', 'West Indies', 'Kolkata Knight Riders', 'legendary',
    { batting: 90, bowling: 90, fielding: 85, leadership: 75, consistency: 88, popularity: 95 },
    'Dre Russ - +25 power hitting in death overs', 'Russell', 2018,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),
  
  createCard(28, 'Shakib Al Hasan', 'allrounder', 'Bangladesh', '', 'epic',
    { batting: 85, bowling: 88, fielding: 85, leadership: 88, consistency: 90, popularity: 86 },
    'The Tiger - +10 all stats at home', 'Shakib', 2019,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),
  
  createCard(29, 'Rashid Khan', 'bowler', 'Afghanistan', 'Gujarat Titans', 'epic',
    { batting: 60, bowling: 94, fielding: 80, leadership: 75, consistency: 88, popularity: 90 },
    'Spin Wizard - +20 googly effectiveness', 'Rashid', 2018,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),
  
  // ==================== RARE CARDS ====================
  
  createCard(30, 'Bhuvneshwar Kumar', 'bowler', 'India', 'Sunrisers Hyderabad', 'rare',
    { batting: 25, bowling: 86, fielding: 80, leadership: 70, consistency: 88, popularity: 82 },
    'Swing King - +10 in powerplay', 'Bhuvi', 2016,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),
  
  createCard(31, 'Rishabh Pant', 'wicketkeeper', 'India', 'Delhi Capitals', 'rare',
    { batting: 84, bowling: 5, fielding: 82, leadership: 75, consistency: 78, popularity: 85 },
    'Explosive - +10 power hitting', 'Pant', 2018,
    { worldCupWinner: false, iplCaptain: true, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),
  
  createCard(32, 'Shreyas Iyer', 'batsman', 'India', 'Kolkata Knight Riders', 'rare',
    { batting: 82, bowling: 5, fielding: 80, leadership: 85, consistency: 80, popularity: 80 },
    'Reliable - +5 consistency', 'Iyer', 2019,
    { worldCupWinner: false, iplCaptain: true, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),
  
  createCard(33, 'Sanju Samson', 'wicketkeeper', 'India', 'Rajasthan Royals', 'rare',
    { batting: 80, bowling: 5, fielding: 85, leadership: 82, consistency: 75, popularity: 78 },
    'Talented - +5 in domestic matches', 'Samson', 2020,
    { worldCupWinner: false, iplCaptain: true, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),
  
  createCard(34, 'Yuzvendra Chahal', 'bowler', 'India', 'Rajasthan Royals', 'rare',
    { batting: 15, bowling: 85, fielding: 75, leadership: 65, consistency: 84, popularity: 82 },
    'Chahal TV - +10 googly', 'Chahal', 2017,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),
  
  createCard(35, 'Kuldeep Yadav', 'bowler', 'India', 'Delhi Capitals', 'rare',
    { batting: 15, bowling: 84, fielding: 75, leadership: 65, consistency: 82, popularity: 80 },
    'Chinaman - +15 left-arm wrist spin', 'Kuldeep', 2018,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),
  
  createCard(36, 'Mohammed Siraj', 'bowler', 'India', 'Royal Challengers Bangalore', 'rare',
    { batting: 12, bowling: 86, fielding: 70, leadership: 65, consistency: 80, popularity: 78 },
    'Miyan Magic - +10 in Test matches', 'Siraj', 2021,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),
  
  // ==================== COMMON CARDS ====================
  
  createCard(37, 'Ishan Kishan', 'wicketkeeper', 'India', 'Mumbai Indians', 'common',
    { batting: 78, bowling: 5, fielding: 80, leadership: 65, consistency: 70, popularity: 75 },
    'Aggressive Opener - +5 in powerplay', 'Kishan', 2020,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),
  
  createCard(38, 'Deepak Chahar', 'bowler', 'India', 'Chennai Super Kings', 'common',
    { batting: 28, bowling: 82, fielding: 75, leadership: 65, consistency: 80, popularity: 72 },
    'Swing Specialist - +10 in powerplay', 'Chahar', 2018,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),
  
  createCard(39, 'Shardul Thakur', 'allrounder', 'India', 'Chennai Super Kings', 'common',
    { batting: 65, bowling: 75, fielding: 70, leadership: 70, consistency: 68, popularity: 70 },
    'Lord Shardul - +5 in pressure situations', 'Thakur', 2019,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),
  
  createCard(40, 'Washington Sundar', 'allrounder', 'India', 'Sunrisers Hyderabad', 'common',
    { batting: 68, bowling: 72, fielding: 75, leadership: 65, consistency: 70, popularity: 68 },
    'Powerplay Specialist - +5 in powerplay', 'Sundar', 2017,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),
  
  createCard(41, 'Axar Patel', 'allrounder', 'India', 'Delhi Capitals', 'common',
    { batting: 75, bowling: 80, fielding: 78, leadership: 70, consistency: 78, popularity: 72 },
    'Left-arm Spin - +5 economy rate', 'Axar', 2018,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),
  
  createCard(42, 'Prithvi Shaw', 'batsman', 'India', 'Delhi Capitals', 'common',
    { batting: 76, bowling: 5, fielding: 70, leadership: 60, consistency: 65, popularity: 70 },
    'Aggressive Starter - +10 in first 10 balls', 'Shaw', 2020,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),
  
  createCard(43, 'Ruturaj Gaikwad', 'batsman', 'India', 'Chennai Super Kings', 'common',
    { batting: 77, bowling: 5, fielding: 75, leadership: 65, consistency: 78, popularity: 74 },
    'Orange Cap Winner - +5 against spin', 'Gaikwad', 2021,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),
  
  createCard(44, 'Devon Conway', 'batsman', 'New Zealand', 'Chennai Super Kings', 'rare',
    { batting: 82, bowling: 5, fielding: 80, leadership: 70, consistency: 85, popularity: 76 },
    'Mr Consistent - +5 in run chases', 'Conway', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),
  
  createCard(45, 'Faf du Plessis', 'batsman', 'South Africa', 'Royal Challengers Bangalore', 'rare',
    { batting: 84, bowling: 10, fielding: 85, leadership: 88, consistency: 86, popularity: 84 },
    'Captain Fantastic - +10 leadership', 'Faf', 2021,
    { worldCupWinner: false, iplCaptain: true, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),
  
  createCard(46, 'Quinton de Kock', 'wicketkeeper', 'South Africa', 'Lucknow Super Giants', 'rare',
    { batting: 83, bowling: 5, fielding: 82, leadership: 70, consistency: 80, popularity: 82 },
    'Powerplay Assault - +15 in first 6 overs', 'QDK', 2019,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),
  
  createCard(47, 'Jonny Bairstow', 'wicketkeeper', 'England', 'Punjab Kings', 'rare',
    { batting: 84, bowling: 5, fielding: 78, leadership: 75, consistency: 76, popularity: 80 },
    'Explosive - +10 power hitting', 'Bairstow', 2019,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),
  
  createCard(48, 'Jos Buttler', 'wicketkeeper', 'England', 'Rajasthan Royals', 'legendary',
    { batting: 92, bowling: 5, fielding: 88, leadership: 80, consistency: 88, popularity: 94 },
    'Buttler Storm - +15 in death overs', 'Buttler', 2022,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),
  
  createCard(49, 'Liam Livingstone', 'batsman', 'England', 'Punjab Kings', 'epic',
    { batting: 85, bowling: 75, fielding: 80, leadership: 70, consistency: 75, popularity: 85 },
    'Livingstone Experience - +20 power hitting', 'Livingstone', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),
  
  createCard(50, 'Sam Curran', 'allrounder', 'England', 'Punjab Kings', 'epic',
    { batting: 78, bowling: 82, fielding: 85, leadership: 75, consistency: 80, popularity: 83 },
    'Death Overs Specialist - +15 in last 4 overs', 'Curran', 2022,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),
  
  // Additional players to reach 100+
  createCard(51, 'Tim David', 'batsman', 'Australia', 'Mumbai Indians', 'rare',
    { batting: 82, bowling: 20, fielding: 70, leadership: 65, consistency: 70, popularity: 78 },
    'Finisher - +15 in death overs', 'David', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),
  
  createCard(52, 'Cameron Green', 'allrounder', 'Australia', 'Mumbai Indians', 'epic',
    { batting: 80, bowling: 85, fielding: 88, leadership: 70, consistency: 78, popularity: 84 },
    'Green Machine - +10 all stats', 'Green', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: false }),
  
  createCard(53, 'Marcus Stoinis', 'allrounder', 'Australia', 'Lucknow Super Giants', 'rare',
    { batting: 78, bowling: 80, fielding: 82, leadership: 75, consistency: 76, popularity: 80 },
    'Power Hitter - +10 power hitting', 'Stoinis', 2020,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),
  
  createCard(54, 'Glenn Maxwell', 'allrounder', 'Australia', 'Royal Challengers Bangalore', 'legendary',
    { batting: 88, bowling: 75, fielding: 85, leadership: 80, consistency: 82, popularity: 92 },
    'The Show - +20 against spin', 'Maxwell', 2021,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),
  
  createCard(55, 'Adam Zampa', 'bowler', 'Australia', 'Rajasthan Royals', 'rare',
    { batting: 20, bowling: 86, fielding: 75, leadership: 70, consistency: 84, popularity: 78 },
    'Legspin Wizard - +10 googly', 'Zampa', 2021,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),
  
  createCard(56, 'Josh Hazlewood', 'bowler', 'Australia', 'Royal Challengers Bangalore', 'epic',
    { batting: 15, bowling: 90, fielding: 80, leadership: 75, consistency: 90, popularity: 84 },
    'Line and Length - +10 accuracy', 'Hazlewood', 2021,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),
  
  createCard(57, 'Kagiso Rabada', 'bowler', 'South Africa', 'Punjab Kings', 'legendary',
    { batting: 25, bowling: 94, fielding: 80, leadership: 75, consistency: 88, popularity: 90 },
    'Speedster - +20 in death overs', 'Rabada', 2020,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),
  
  createCard(58, 'Anrich Nortje', 'bowler', 'South Africa', 'Delhi Capitals', 'epic',
    { batting: 15, bowling: 92, fielding: 75, leadership: 65, consistency: 85, popularity: 86 },
    'Raw Pace - +15 bowling speed', 'Nortje', 2020,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),
  
  createCard(59, 'David Miller', 'batsman', 'South Africa', 'Gujarat Titans', 'epic',
    { batting: 84, bowling: 10, fielding: 80, leadership: 75, consistency: 82, popularity: 86 },
    'Killer Miller - +15 in death overs', 'Miller', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),
  
  createCard(60, 'Heinrich Klaasen', 'wicketkeeper', 'South Africa', 'Sunrisers Hyderabad', 'rare',
    { batting: 82, bowling: 5, fielding: 85, leadership: 70, consistency: 78, popularity: 80 },
    'Spin Destroyer - +15 against spin', 'Klaasen', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),
  
  createCard(61, 'Marco Jansen', 'allrounder', 'South Africa', 'Sunrisers Hyderabad', 'rare',
    { batting: 65, bowling: 84, fielding: 78, leadership: 68, consistency: 76, popularity: 78 },
    'Tall Timber - +10 bounce', 'Jansen', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: false }),
  
  createCard(62, 'Daryl Mitchell', 'allrounder', 'New Zealand', 'Chennai Super Kings', 'rare',
    { batting: 80, bowling: 75, fielding: 82, leadership: 78, consistency: 84, popularity: 82 },
    'Clutch Player - +10 in pressure', 'Mitchell', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),
  
  createCard(63, 'Finn Allen', 'batsman', 'New Zealand', 'Royal Challengers Bangalore', 'common',
    { batting: 76, bowling: 5, fielding: 70, leadership: 60, consistency: 65, popularity: 72 },
    'Powerplay Hitter - +10 in first 6 overs', 'Allen', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),
  
  createCard(64, 'Lockie Ferguson', 'bowler', 'New Zealand', 'Kolkata Knight Riders', 'rare',
    { batting: 15, bowling: 86, fielding: 75, leadership: 70, consistency: 82, popularity: 80 },
    'Speed Gun - +15 bowling speed', 'Ferguson', 2020,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),
  
  createCard(65, 'Jimmy Neesham', 'allrounder', 'New Zealand', 'Rajasthan Royals', 'common',
    { batting: 72, bowling: 74, fielding: 80, leadership: 70, consistency: 72, popularity: 76 },
    'Death Over Specialist - +10 in last 3 overs', 'Neesham', 2021,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),
  
  createCard(66, 'Shadab Khan', 'allrounder', 'Pakistan', '', 'epic',
    { batting: 75, bowling: 86, fielding: 88, leadership: 85, consistency: 84, popularity: 86 },
    'Spin Captain - +15 bowling as captain', 'Shadab', 2021,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),
  
  createCard(67, 'Mohammad Rizwan', 'wicketkeeper', 'Pakistan', '', 'legendary',
    { batting: 88, bowling: 5, fielding: 90, leadership: 85, consistency: 92, popularity: 90 },
    'Mr Reliable - +10 consistency', 'Rizwan', 2021,
    { worldCupWinner: false, iplCaptain: true, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),
  
  createCard(68, 'Haris Rauf', 'bowler', 'Pakistan', '', 'epic',
    { batting: 15, bowling: 90, fielding: 75, leadership: 68, consistency: 82, popularity: 84 },
    'Raw Pace Express - +20 bowling speed', 'Rauf', 2021,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),
  
  createCard(69, 'Wanindu Hasaranga', 'allrounder', 'Sri Lanka', 'Royal Challengers Bangalore', 'epic',
    { batting: 72, bowling: 88, fielding: 85, leadership: 78, consistency: 84, popularity: 84 },
    'Legspin Wicket Taker - +15 googly', 'Hasaranga', 2021,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),
  
  createCard(70, 'Charith Asalanka', 'batsman', 'Sri Lanka', '', 'common',
    { batting: 76, bowling: 5, fielding: 75, leadership: 68, consistency: 74, popularity: 72 },
    'Middle Order Anchor - +5 in middle overs', 'Asalanka', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),
  
  createCard(71, 'Maheesh Theekshana', 'bowler', 'Sri Lanka', 'Chennai Super Kings', 'rare',
    { batting: 15, bowling: 84, fielding: 80, leadership: 70, consistency: 86, popularity: 78 },
    'Mystery Spinner - +15 carrom ball', 'Theekshana', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),
  
  createCard(72, 'Nicholas Pooran', 'wicketkeeper', 'West Indies', 'Lucknow Super Giants', 'epic',
    { batting: 85, bowling: 5, fielding: 82, leadership: 75, consistency: 78, popularity: 86 },
    'Power Hitter - +20 six hitting', 'Pooran', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),
  
  createCard(73, 'Shimron Hetmyer', 'batsman', 'West Indies', 'Rajasthan Royals', 'epic',
    { batting: 84, bowling: 5, fielding: 78, leadership: 70, consistency: 76, popularity: 84 },
    'Finisher - +15 in death overs', 'Hetmyer', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),
  
  createCard(74, 'Jason Holder', 'allrounder', 'West Indies', 'Rajasthan Royals', 'epic',
    { batting: 72, bowling: 86, fielding: 82, leadership: 88, consistency: 84, popularity: 86 },
    'Tall Allrounder - +10 bowling bounce', 'Holder', 2020,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: false }),
  
  createCard(75, 'Rovman Powell', 'batsman', 'West Indies', 'Delhi Capitals', 'rare',
    { batting: 80, bowling: 5, fielding: 75, leadership: 72, consistency: 72, popularity: 78 },
    'Power Hitter - +15 six hitting', 'Powell', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),
  
  createCard(76, 'Alzarri Joseph', 'bowler', 'West Indies', 'Gujarat Titans', 'rare',
    { batting: 15, bowling: 86, fielding: 75, leadership: 68, consistency: 80, popularity: 76 },
    'Raw Pace - +15 bowling speed', 'Joseph', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),
  
  createCard(77, 'Mustafizur Rahman', 'bowler', 'Bangladesh', 'Delhi Capitals', 'rare',
    { batting: 15, bowling: 85, fielding: 75, leadership: 68, consistency: 82, popularity: 78 },
    'Fizz Cutter - +15 cutters', 'Mustafizur', 2016,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),
  
  createCard(78, 'Mujeeb Ur Rahman', 'bowler', 'Afghanistan', 'Sunrisers Hyderabad', 'rare',
    { batting: 15, bowling: 86, fielding: 75, leadership: 70, consistency: 84, popularity: 80 },
    'Mystery Spin - +15 carrom ball', 'Mujeeb', 2018,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),
  
  createCard(79, 'Rahmanullah Gurbaz', 'wicketkeeper', 'Afghanistan', 'Kolkata Knight Riders', 'common',
    { batting: 76, bowling: 5, fielding: 78, leadership: 65, consistency: 70, popularity: 74 },
    'Aggressive Opener - +10 in powerplay', 'Gurbaz', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),
  
  createCard(80, 'Noor Ahmad', 'bowler', 'Afghanistan', 'Gujarat Titans', 'common',
    { batting: 15, bowling: 80, fielding: 70, leadership: 65, consistency: 78, popularity: 72 },
    'Young Legspinner - +10 googly', 'Noor', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),
  
  // Additional Indian Domestic Stars
  createCard(81, 'Venkatesh Iyer', 'allrounder', 'India', 'Kolkata Knight Riders', 'common',
    { batting: 78, bowling: 72, fielding: 80, leadership: 70, consistency: 76, popularity: 78 },
    'Tall Opener - +10 against pace', 'Venkatesh', 2021,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),
  
  createCard(82, 'Rahul Tripathi', 'batsman', 'India', 'Sunrisers Hyderabad', 'common',
    { batting: 77, bowling: 5, fielding: 75, leadership: 68, consistency: 74, popularity: 74 },
    'Middle Order Anchor - +5 consistency', 'Tripathi', 2021,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),
  
  createCard(83, 'Devdutt Padikkal', 'batsman', 'India', 'Rajasthan Royals', 'common',
    { batting: 76, bowling: 5, fielding: 70, leadership: 65, consistency: 72, popularity: 75 },
    'Elegant Leftie - +5 against spin', 'Padikkal', 2020,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),
  
  createCard(84, 'Abhishek Sharma', 'allrounder', 'India', 'Sunrisers Hyderabad', 'common',
    { batting: 74, bowling: 76, fielding: 78, leadership: 68, consistency: 70, popularity: 74 },
    'Left Arm Spin - +5 economy', 'Abhishek', 2021,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),
  
  createCard(85, 'Riyan Parag', 'allrounder', 'India', 'Rajasthan Royals', 'common',
    { batting: 70, bowling: 72, fielding: 80, leadership: 65, consistency: 68, popularity: 72 },
    'Young Talent - +5 in pressure', 'Parag', 2019,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),
  
  createCard(86, 'Tilak Varma', 'batsman', 'India', 'Mumbai Indians', 'common',
    { batting: 78, bowling: 5, fielding: 75, leadership: 65, consistency: 76, popularity: 76 },
    'Future Star - +5 against spin', 'Tilak', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),
  
  createCard(87, 'Dewald Brevis', 'batsman', 'South Africa', 'Mumbai Indians', 'rare',
    { batting: 80, bowling: 70, fielding: 78, leadership: 65, consistency: 72, popularity: 80 },
    'Baby AB - +10 against all bowling', 'Brevis', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),
  
  createCard(88, 'Tristan Stubbs', 'batsman', 'South Africa', 'Sunrisers Hyderabad', 'common',
    { batting: 75, bowling: 5, fielding: 80, leadership: 65, consistency: 70, popularity: 74 },
    'Power Hitter - +10 six hitting', 'Stubbs', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),
  
  createCard(89, 'Phil Salt', 'wicketkeeper', 'England', 'Delhi Capitals', 'common',
    { batting: 76, bowling: 5, fielding: 82, leadership: 68, consistency: 72, popularity: 76 },
    'Aggressive Opener - +10 in powerplay', 'Salt', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),
  
  createCard(90, 'Will Jacks', 'allrounder', 'England', 'Royal Challengers Bangalore', 'common',
    { batting: 74, bowling: 75, fielding: 78, leadership: 68, consistency: 72, popularity: 74 },
    'Spin Hitter - +10 against spin', 'Jacks', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),
  
  createCard(91, 'Reece Topley', 'bowler', 'England', 'Royal Challengers Bangalore', 'rare',
    { batting: 15, bowling: 84, fielding: 75, leadership: 68, consistency: 82, popularity: 76 },
    'Swing Bowler - +15 in powerplay', 'Topley', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),
  
  createCard(92, 'Gerald Coetzee', 'bowler', 'South Africa', 'Mumbai Indians', 'rare',
    { batting: 25, bowling: 86, fielding: 75, leadership: 68, consistency: 78, popularity: 80 },
    'Raw Pace - +20 bowling speed', 'Coetzee', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),
  
  createCard(93, 'Mitchell Marsh', 'allrounder', 'Australia', 'Delhi Capitals', 'epic',
    { batting: 84, bowling: 80, fielding: 85, leadership: 82, consistency: 82, popularity: 86 },
    'Power Allrounder - +10 all stats', 'Marsh', 2021,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: false }),
  
  createCard(94, 'Moeen Ali', 'allrounder', 'England', 'Chennai Super Kings', 'epic',
    { batting: 80, bowling: 82, fielding: 85, leadership: 88, consistency: 84, popularity: 88 },
    'Spin Allrounder - +15 against spin', 'Moeen', 2021,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),
  
  createCard(95, 'Rachin Ravindra', 'allrounder', 'New Zealand', 'Chennai Super Kings', 'rare',
    { batting: 82, bowling: 78, fielding: 85, leadership: 75, consistency: 84, popularity: 84 },
    'Young Talent - +10 in ICC tournaments', 'Ravindra', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),
  
  createCard(96, 'Matheesha Pathirana', 'bowler', 'Sri Lanka', 'Chennai Super Kings', 'rare',
    { batting: 15, bowling: 86, fielding: 75, leadership: 65, consistency: 80, popularity: 82 },
    'Baby Malinga - +20 yorker accuracy', 'Pathirana', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),
  
  createCard(97, 'Tushar Deshpande', 'bowler', 'India', 'Chennai Super Kings', 'common',
    { batting: 15, bowling: 78, fielding: 70, leadership: 65, consistency: 74, popularity: 70 },
    'Death Bowler - +10 in death overs', 'Deshpande', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),
  
  createCard(98, 'Akash Madhwal', 'bowler', 'India', 'Mumbai Indians', 'common',
    { batting: 15, bowling: 80, fielding: 75, leadership: 65, consistency: 78, popularity: 74 },
    'Discover - +10 in playoffs', 'Madhwal', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),
  
  createCard(99, 'Yashasvi Jaiswal', 'batsman', 'India', 'Rajasthan Royals', 'epic',
    { batting: 86, bowling: 5, fielding: 80, leadership: 70, consistency: 82, popularity: 86 },
    'Future Legend - +10 in run chases', 'Jaiswal', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),
  
  createCard(100, 'Rinku Singh', 'batsman', 'India', 'Kolkata Knight Riders', 'epic',
    { batting: 85, bowling: 5, fielding: 78, leadership: 72, consistency: 84, popularity: 88 },
    'Finisher King - +20 in death overs', 'Rinku', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

  createCard(101, 'Virat Kohli', 'batsman', 'India', 'Royal Challengers Bangalore', 'mythic',
    { batting: 99, bowling: 35, fielding: 90, leadership: 90, consistency: 99, popularity: 100 },
    'King of Chase - +15 batting when chasing targets', 'King Kohli', 2026,
    { worldCupWinner: true, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: true }),

  // ==================== IDs 102-199: FAMOUS PLAYERS, NEW STARS, YOUNGSTERS & GOATS ====================

    // Sir Don Bradman - The Greatest GOAT
    createCard(102, 'Don Bradman', 'batsman', 'Australia', '', 'mythic',
    { batting: 100, bowling: 20, fielding: 75, leadership: 90, consistency: 99, popularity: 100 },
    'The Don - +30 batting average in Tests', 'GOAT', 1930,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    createCard(103, 'Don Bradman', 'batsman', 'Australia', '', 'legendary',
    { batting: 99, bowling: 18, fielding: 72, leadership: 88, consistency: 98, popularity: 99 },
    '99.94 Average - +25 consistency', 'Bradman', 1948,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Shahid Afridi
    createCard(104, 'Shahid Afridi', 'allrounder', 'Pakistan', '', 'legendary',
    { batting: 88, bowling: 92, fielding: 85, leadership: 85, consistency: 75, popularity: 98 },
    'Boom Boom - +30 power hitting', 'Afridi', 2009,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: true }),

    createCard(105, 'Shahid Afridi', 'allrounder', 'Pakistan', '', 'epic',
    { batting: 86, bowling: 90, fielding: 82, leadership: 82, consistency: 72, popularity: 96 },
    '37 ball 100 - +20 fastest century', 'Lala', 1996,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

    // Lasith Malinga - Additional versions
    createCard(106, 'Lasith Malinga', 'bowler', 'Sri Lanka', 'Mumbai Indians', 'mythic',
    { batting: 15, bowling: 99, fielding: 72, leadership: 88, consistency: 92, popularity: 98 },
    'Slinga Malinga - +30 yorker accuracy', 'Malinga', 2011,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: true }),

    // Travis Head
    createCard(107, 'Travis Head', 'batsman', 'Australia', 'Sunrisers Hyderabad', 'legendary',
    { batting: 92, bowling: 40, fielding: 85, leadership: 80, consistency: 90, popularity: 92 },
    'WC Final Hero - +25 in finals', 'Head', 2023,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    createCard(108, 'Travis Head', 'batsman', 'Australia', '', 'epic',
    { batting: 89, bowling: 38, fielding: 82, leadership: 78, consistency: 88, popularity: 88 },
    'Aggressive Opener - +15 in powerplay', 'Head', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // David Warner - Additional version
    createCard(109, 'David Warner', 'batsman', 'Australia', 'Delhi Capitals', 'mythic',
    { batting: 97, bowling: 10, fielding: 88, leadership: 90, consistency: 93, popularity: 98 },
    'Pocket Rocket - +25 in powerplay', 'Warner', 2019,
    { worldCupWinner: true, iplCaptain: true, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // ==================== EMERGING YOUNGSTARS & NEW TALENTS ====================

    // Jake Fraser-McGurk
    createCard(110, 'Jake Fraser-McGurk', 'batsman', 'Australia', 'Delhi Capitals', 'epic',
    { batting: 86, bowling: 5, fielding: 78, leadership: 65, consistency: 72, popularity: 84 },
    'Next Big Thing - +20 power hitting', 'JFM', 2024,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Naseem Shah
    createCard(111, 'Naseem Shah', 'bowler', 'Pakistan', '', 'epic',
    { batting: 20, bowling: 90, fielding: 75, leadership: 70, consistency: 84, popularity: 88 },
    'Young Pace Sensation - +20 pace', 'Naseem', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // Shaheen Afridi - Additional version
    createCard(112, 'Shaheen Afridi', 'bowler', 'Pakistan', '', 'legendary',
    { batting: 20, bowling: 96, fielding: 78, leadership: 75, consistency: 90, popularity: 94 },
    'Lion of Lahore - +25 with new ball', 'Shaheen', 2021,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // Abdullah Shafique
    createCard(113, 'Abdullah Shafique', 'batsman', 'Pakistan', '', 'rare',
    { batting: 84, bowling: 5, fielding: 75, leadership: 68, consistency: 82, popularity: 80 },
    'Future Test Star - +15 in Tests', 'Shafique', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Saim Ayub
    createCard(114, 'Saim Ayub', 'batsman', 'Pakistan', '', 'rare',
    { batting: 82, bowling: 40, fielding: 74, leadership: 65, consistency: 70, popularity: 78 },
    'Young Allrounder - +10 powerplay', 'Ayub', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

    // Tanzid Hasan
    createCard(115, 'Tanzid Hasan', 'batsman', 'Bangladesh', '', 'common',
    { batting: 78, bowling: 5, fielding: 72, leadership: 60, consistency: 68, popularity: 72 },
    'Aggressive Opener - +10 in powerplay', 'Tanzid', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Towhid Hridoy
    createCard(116, 'Towhid Hridoy', 'batsman', 'Bangladesh', '', 'rare',
    { batting: 80, bowling: 5, fielding: 74, leadership: 62, consistency: 76, popularity: 74 },
    'Middle Order Anchor - +10 in chases', 'Hridoy', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // ==================== MORE INTERNATIONAL STARS ====================

    // Ross Taylor
    createCard(117, 'Ross Taylor', 'batsman', 'New Zealand', '', 'legendary',
    { batting: 93, bowling: 15, fielding: 80, leadership: 88, consistency: 94, popularity: 92 },
    'Most Runs for NZ - +20 in ODIs', 'Taylor', 2015,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Tim Southee
    createCard(118, 'Tim Southee', 'bowler', 'New Zealand', '', 'legendary',
    { batting: 35, bowling: 92, fielding: 80, leadership: 85, consistency: 90, popularity: 88 },
    'Swing King - +20 with new ball', 'Southee', 2019,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // Neil Wagner
    createCard(119, 'Neil Wagner', 'bowler', 'New Zealand', '', 'epic',
    { batting: 25, bowling: 90, fielding: 78, leadership: 82, consistency: 92, popularity: 84 },
    'Short Ball Specialist - +20 bouncer', 'Wagner', 2018,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // ==================== SOUTH AFRICA STARS ====================

    // Quinton de Kock - Additional version
    createCard(120, 'Quinton de Kock', 'wicketkeeper', 'South Africa', 'Lucknow Super Giants', 'legendary',
    { batting: 92, bowling: 5, fielding: 88, leadership: 75, consistency: 88, popularity: 92 },
    'QDK - +20 in powerplay', 'de Kock', 2019,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Rassie van der Dussen
    createCard(121, 'Rassie van der Dussen', 'batsman', 'South Africa', '', 'epic',
    { batting: 88, bowling: 5, fielding: 82, leadership: 72, consistency: 90, popularity: 84 },
    'Mr Consistent - +15 in chases', 'Rassie', 2021,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Aiden Markram
    createCard(122, 'Aiden Markram', 'allrounder', 'South Africa', 'Sunrisers Hyderabad', 'epic',
    { batting: 86, bowling: 78, fielding: 84, leadership: 85, consistency: 84, popularity: 86 },
    'Classy Opener - +15 in powerplay', 'Markram', 2021,
    { worldCupWinner: false, iplCaptain: true, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

    // ==================== ENGLAND STARS ====================

    // Ben Stokes - Additional version
    createCard(123, 'Ben Stokes', 'allrounder', 'England', '', 'mythic',
    { batting: 94, bowling: 92, fielding: 92, leadership: 96, consistency: 95, popularity: 100 },
    'The Ultimate Finisher - +30 in pressure', 'Stokes', 2019,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: true }),

    // Jos Buttler - Additional version
    createCard(124, 'Jos Buttler', 'wicketkeeper', 'England', 'Rajasthan Royals', 'mythic',
    { batting: 96, bowling: 5, fielding: 92, leadership: 85, consistency: 92, popularity: 98 },
    'Buttler Storm - +25 in death overs', 'Buttler', 2022,
    { worldCupWinner: true, iplCaptain: true, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // Jofra Archer
    createCard(125, 'Jofra Archer', 'bowler', 'England', 'Mumbai Indians', 'legendary',
    { batting: 35, bowling: 94, fielding: 85, leadership: 70, consistency: 82, popularity: 94 },
    'Express Pace - +25 in Super Overs', 'Archer', 2019,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // Mark Wood
    createCard(126, 'Mark Wood', 'bowler', 'England', '', 'epic',
    { batting: 25, bowling: 92, fielding: 75, leadership: 68, consistency: 80, popularity: 86 },
    'Raw Pace - +20 speed gun', 'Wood', 2021,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // Harry Brook - Another version
    createCard(127, 'Harry Brook', 'batsman', 'England', 'Sunrisers Hyderabad', 'legendary',
    { batting: 92, bowling: 10, fielding: 85, leadership: 72, consistency: 86, popularity: 92 },
    'Brook the Beast - +20 in Tests', 'Brook', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // ==================== WEST INDIES STARS ====================

    // Kieron Pollard
    createCard(128, 'Kieron Pollard', 'allrounder', 'West Indies', 'Mumbai Indians', 'legendary',
    { batting: 90, bowling: 86, fielding: 88, leadership: 88, consistency: 84, popularity: 94 },
    'Polly Power - +25 six hitting', 'Pollard', 2013,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

    // Dwayne Bravo
    createCard(129, 'Dwayne Bravo', 'allrounder', 'West Indies', 'Chennai Super Kings', 'legendary',
    { batting: 85, bowling: 90, fielding: 88, leadership: 86, consistency: 88, popularity: 94 },
    'Champion - +20 death bowling', 'Bravo', 2013,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

    // Sunil Narine
    createCard(130, 'Sunil Narine', 'bowler', 'West Indies', 'Kolkata Knight Riders', 'legendary',
    { batting: 60, bowling: 94, fielding: 80, leadership: 72, consistency: 90, popularity: 92 },
    'Mystery Spinner - +25 variations', 'Narine', 2012,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // ==================== SRI LANKA STARS ====================

    // Angelo Mathews
    createCard(131, 'Angelo Mathews', 'allrounder', 'Sri Lanka', '', 'legendary',
    { batting: 86, bowling: 88, fielding: 84, leadership: 92, consistency: 92, popularity: 88 },
    'Captain Cool - +20 in chases', 'Mathews', 2014,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

    // Dimuth Karunaratne
    createCard(132, 'Dimuth Karunaratne', 'batsman', 'Sri Lanka', '', 'epic',
    { batting: 88, bowling: 5, fielding: 78, leadership: 86, consistency: 94, popularity: 82 },
    'Test Specialist - +20 in Tests', 'Karunaratne', 2019,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // ==================== AFGHANISTAN STARS ====================

    // Mohammad Nabi
    createCard(133, 'Mohammad Nabi', 'allrounder', 'Afghanistan', '', 'epic',
    { batting: 80, bowling: 88, fielding: 82, leadership: 88, consistency: 88, popularity: 86 },
    'Afghan Legend - +15 in T20s', 'Nabi', 2018,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

    // Rahmanullah Gurbaz - Additional version
    createCard(134, 'Rahmanullah Gurbaz', 'wicketkeeper', 'Afghanistan', 'Kolkata Knight Riders', 'epic',
    { batting: 84, bowling: 5, fielding: 82, leadership: 68, consistency: 76, popularity: 82 },
    'Afghan Power - +15 in powerplay', 'Gurbaz', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Ibrahim Zadran
    createCard(135, 'Ibrahim Zadran', 'batsman', 'Afghanistan', '', 'rare',
    { batting: 82, bowling: 5, fielding: 75, leadership: 65, consistency: 82, popularity: 78 },
    'Future Captain - +10 in ODIs', 'Zadran', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // ==================== INDIAN EMERGING YOUNGSTARS ====================

    // Rajat Patidar
    createCard(136, 'Rajat Patidar', 'batsman', 'India', 'Royal Challengers Bangalore', 'rare',
    { batting: 80, bowling: 5, fielding: 74, leadership: 65, consistency: 78, popularity: 76 },
    'Playoff Hero - +15 in playoffs', 'Patidar', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Jitesh Sharma
    createCard(137, 'Jitesh Sharma', 'wicketkeeper', 'India', 'Punjab Kings', 'rare',
    { batting: 82, bowling: 5, fielding: 80, leadership: 68, consistency: 74, popularity: 78 },
    'Finisher - +15 in death overs', 'Jitesh', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Prabhsimran Singh
    createCard(138, 'Prabhsimran Singh', 'batsman', 'India', 'Punjab Kings', 'common',
    { batting: 76, bowling: 5, fielding: 72, leadership: 60, consistency: 68, popularity: 72 },
    'Young Opener - +10 powerplay', 'Prabhsimran', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Ayush Badoni
    createCard(139, 'Ayush Badoni', 'batsman', 'India', 'Lucknow Super Giants', 'common',
    { batting: 78, bowling: 35, fielding: 70, leadership: 62, consistency: 72, popularity: 74 },
    'Lord Badoni - +10 in chases', 'Badoni', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

    // Umran Malik
    createCard(140, 'Umran Malik', 'bowler', 'India', 'Sunrisers Hyderabad', 'epic',
    { batting: 15, bowling: 88, fielding: 70, leadership: 60, consistency: 70, popularity: 86 },
    'Raw Pace Express - +25 bowling 155+ kph', 'Umran', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // Arshdeep Singh
    createCard(141, 'Arshdeep Singh', 'bowler', 'India', 'Punjab Kings', 'epic',
    { batting: 20, bowling: 90, fielding: 75, leadership: 68, consistency: 84, popularity: 88 },
    'Death Over Specialist - +20 yorker', 'Arshdeep', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // Mukesh Kumar
    createCard(142, 'Mukesh Kumar', 'bowler', 'India', 'Delhi Capitals', 'common',
    { batting: 15, bowling: 80, fielding: 72, leadership: 62, consistency: 78, popularity: 72 },
    'Line & Length - +10 accuracy', 'Mukesh', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // ==================== INDIA SPECIAL CARDS (MORE LEGENDS) ====================

    // Gautam Gambhir
    createCard(143, 'Gautam Gambhir', 'batsman', 'India', 'Kolkata Knight Riders', 'legendary',
    { batting: 92, bowling: 5, fielding: 80, leadership: 94, consistency: 92, popularity: 94 },
    'IPL Winning Captain - +20 in finals', 'Gambhir', 2012,
    { worldCupWinner: true, iplCaptain: true, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: false }),

    // Virender Sehwag - Additional
    createCard(144, 'Virender Sehwag', 'batsman', 'India', '', 'mythic',
    { batting: 98, bowling: 25, fielding: 72, leadership: 78, consistency: 90, popularity: 99 },
    'Multan Sultan - +30 aggressive batting', 'Sehwag', 2004,
    { worldCupWinner: true, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: true }),

    // Irfan Pathan
    createCard(145, 'Irfan Pathan', 'allrounder', 'India', '', 'epic',
    { batting: 78, bowling: 86, fielding: 80, leadership: 75, consistency: 82, popularity: 88 },
    'Swing Allrounder - +15 with new ball', 'Pathan', 2004,
    { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: true, allRounder: true, goatEdition: false }),

    // Munaf Patel
    createCard(146, 'Munaf Patel', 'bowler', 'India', 'Mumbai Indians', 'rare',
    { batting: 15, bowling: 84, fielding: 70, leadership: 65, consistency: 78, popularity: 76 },
    '2011 WC Hero - +15 in World Cup', 'Munaf', 2011,
    { worldCupWinner: true, iplCaptain: false, indianLegend: true, fastBowler: true, allRounder: false, goatEdition: false }),

    // Praveen Kumar
    createCard(147, 'Praveen Kumar', 'bowler', 'India', '', 'rare',
    { batting: 25, bowling: 84, fielding: 72, leadership: 68, consistency: 82, popularity: 78 },
    'Swing King - +15 swing', 'Praveen', 2010,
    { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: true, allRounder: false, goatEdition: false }),

    // ==================== MORE INTERNATIONAL GOATS ====================

    // Joel Garner
    createCard(148, 'Joel Garner', 'bowler', 'West Indies', '', 'mythic',
    { batting: 20, bowling: 97, fielding: 78, leadership: 80, consistency: 96, popularity: 94 },
    'Big Bird - +25 bounce from height', 'Garner', 1984,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: true }),

    // Malcolm Marshall
    createCard(149, 'Malcolm Marshall', 'bowler', 'West Indies', '', 'mythic',
    { batting: 35, bowling: 98, fielding: 80, leadership: 82, consistency: 96, popularity: 96 },
    'Macko - +20 hostile pace', 'Marshall', 1984,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: true }),

    // Michael Holding
    createCard(150, 'Michael Holding', 'bowler', 'West Indies', '', 'legendary',
    { batting: 20, bowling: 96, fielding: 75, leadership: 78, consistency: 95, popularity: 94 },
    'Whispering Death - +20 silent pace', 'Holding', 1976,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // Clive Lloyd
    createCard(151, 'Clive Lloyd', 'batsman', 'West Indies', '', 'legendary',
    { batting: 92, bowling: 45, fielding: 85, leadership: 98, consistency: 92, popularity: 94 },
    'Super Captain - +25 leadership', 'Lloyd', 1975,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // ==================== AUSTRALIAN GOATS CONTINUED ====================

    // Dennis Lillee
    createCard(152, 'Dennis Lillee', 'bowler', 'Australia', '', 'mythic',
    { batting: 25, bowling: 97, fielding: 75, leadership: 85, consistency: 95, popularity: 96 },
    'Lillee the Killer - +25 fast bowling', 'Lillee', 1975,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: true }),

    // Jeff Thomson
    createCard(153, 'Jeff Thomson', 'bowler', 'Australia', '', 'legendary',
    { batting: 20, bowling: 96, fielding: 70, leadership: 72, consistency: 85, popularity: 94 },
    'Thommo - +30 express pace', 'Thomson', 1974,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // Allan Border
    createCard(154, 'Allan Border', 'batsman', 'Australia', '', 'legendary',
    { batting: 94, bowling: 55, fielding: 80, leadership: 96, consistency: 97, popularity: 94 },
    'AB - +20 rebuilding team', 'Border', 1989,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // Steve Waugh
    createCard(155, 'Steve Waugh', 'batsman', 'Australia', '', 'legendary',
    { batting: 92, bowling: 65, fielding: 85, leadership: 96, consistency: 96, popularity: 94 },
    'Tugga - +25 in pressure', 'Waugh', 1999,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // Mark Waugh
    createCard(156, 'Mark Waugh', 'batsman', 'Australia', '', 'epic',
    { batting: 90, bowling: 50, fielding: 90, leadership: 75, consistency: 88, popularity: 92 },
    'Junior - +15 elegance', 'Waugh', 1996,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // ==================== SOUTH AFRICAN GOATS ====================

    // Graeme Smith
    createCard(157, 'Graeme Smith', 'batsman', 'South Africa', '', 'legendary',
    { batting: 93, bowling: 20, fielding: 80, leadership: 96, consistency: 94, popularity: 94 },
    'Biff - +20 opening batting', 'Smith', 2008,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // AB de Villiers - Additional version
    createCard(158, 'AB de Villiers', 'batsman', 'South Africa', 'Royal Challengers Bangalore', 'mythic',
    { batting: 99, bowling: 25, fielding: 95, leadership: 88, consistency: 97, popularity: 100 },
    'Superman - +30 innovative shots', 'ABD', 2015,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // Dale Steyn - Additional version
    createCard(159, 'Dale Steyn', 'bowler', 'South Africa', '', 'mythic',
    { batting: 18, bowling: 99, fielding: 78, leadership: 88, consistency: 96, popularity: 98 },
    'Steyn Gun - +30 peak bowling', 'Steyn', 2010,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: true }),

    // Faf du Plessis - Additional version
    createCard(160, 'Faf du Plessis', 'batsman', 'South Africa', 'Royal Challengers Bangalore', 'legendary',
    { batting: 92, bowling: 15, fielding: 92, leadership: 94, consistency: 92, popularity: 92 },
    'Captain Fantastic - +20 fielding', 'Faf', 2022,
    { worldCupWinner: false, iplCaptain: true, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // ==================== ENGLAND GOATS ====================

    // Alastair Cook
    createCard(161, 'Alastair Cook', 'batsman', 'England', '', 'legendary',
    { batting: 94, bowling: 15, fielding: 80, leadership: 92, consistency: 98, popularity: 92 },
    'Chef - +25 in Tests', 'Cook', 2012,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // Joe Root - Additional version
    createCard(162, 'Joe Root', 'batsman', 'England', '', 'mythic',
    { batting: 96, bowling: 35, fielding: 88, leadership: 90, consistency: 98, popularity: 96 },
    'Root of all Runs - +25 consistency', 'Root', 2021,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // Stuart Broad
    createCard(163, 'Stuart Broad', 'bowler', 'England', '', 'legendary',
    { batting: 30, bowling: 94, fielding: 78, leadership: 82, consistency: 92, popularity: 92 },
    'Broadzilla - +20 Ashes bowling', 'Broad', 2015,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // ==================== NEW ZEALAND GOATS ====================

    // Kane Williamson - Additional version
    createCard(164, 'Kane Williamson', 'batsman', 'New Zealand', '', 'mythic',
    { batting: 96, bowling: 30, fielding: 88, leadership: 96, consistency: 98, popularity: 96 },
    'Steady Kane - +25 in chases', 'Williamson', 2019,
    { worldCupWinner: false, iplCaptain: true, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // Trent Boult - Additional version
    createCard(165, 'Trent Boult', 'bowler', 'New Zealand', 'Mumbai Indians', 'legendary',
    { batting: 20, bowling: 95, fielding: 82, leadership: 72, consistency: 92, popularity: 92 },
    'Left Arm Swing - +25 with new ball', 'Boult', 2019,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // ==================== PAKISTAN GOATS CONTINUED ====================

    // Saqlain Mushtaq
    createCard(166, 'Saqlain Mushtaq', 'bowler', 'Pakistan', '', 'legendary',
    { batting: 25, bowling: 94, fielding: 70, leadership: 75, consistency: 92, popularity: 90 },
    'Doosra Inventor - +20 doosra', 'Saqlain', 1999,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // Saeed Anwar
    createCard(167, 'Saeed Anwar', 'batsman', 'Pakistan', '', 'legendary',
    { batting: 93, bowling: 10, fielding: 75, leadership: 70, consistency: 90, popularity: 92 },
    '194 Masterclass - +25 in ODIs', 'Anwar', 1997,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Mohammad Yousuf
    createCard(168, 'Mohammad Yousuf', 'batsman', 'Pakistan', '', 'legendary',
    { batting: 94, bowling: 5, fielding: 70, leadership: 75, consistency: 96, popularity: 90 },
    'Run Machine - +20 consistency', 'Yousuf', 2006,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // ==================== SRI LANKA GOATS CONTINUED ====================

    // Mahela Jayawardene
    createCard(169, 'Mahela Jayawardene', 'batsman', 'Sri Lanka', '', 'legendary',
    { batting: 94, bowling: 25, fielding: 85, leadership: 92, consistency: 95, popularity: 94 },
    'Class Act - +20 in finals', 'Mahela', 2007,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // Kumar Sangakkara - Additional version
    createCard(170, 'Kumar Sangakkara', 'wicketkeeper', 'Sri Lanka', '', 'mythic',
    { batting: 97, bowling: 5, fielding: 92, leadership: 90, consistency: 98, popularity: 98 },
    'Sanga - +25 wicketkeeping', 'Sangakkara', 2014,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // ==================== ZIMBABWE / BANGLADESH / IRELAND STARS ====================

    // Andy Flower
    createCard(171, 'Andy Flower', 'wicketkeeper', 'Zimbabwe', '', 'legendary',
    { batting: 92, bowling: 5, fielding: 88, leadership: 85, consistency: 95, popularity: 90 },
    'Greatest Zimbabwean - +20 in Tests', 'Flower', 2001,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // Heath Streak
    createCard(172, 'Heath Streak', 'allrounder', 'Zimbabwe', '', 'epic',
    { batting: 70, bowling: 88, fielding: 78, leadership: 86, consistency: 88, popularity: 84 },
    'Zimbabwe Legend - +15 all-round', 'Streak', 2000,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: false }),

    // Shakib Al Hasan - Additional version
    createCard(173, 'Shakib Al Hasan', 'allrounder', 'Bangladesh', '', 'legendary',
    { batting: 90, bowling: 92, fielding: 88, leadership: 92, consistency: 94, popularity: 94 },
    'World\'s Best Allrounder - +25 both stats', 'Shakib', 2019,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: true }),

    // Mushfiqur Rahim
    createCard(174, 'Mushfiqur Rahim', 'wicketkeeper', 'Bangladesh', '', 'legendary',
    { batting: 88, bowling: 5, fielding: 86, leadership: 88, consistency: 92, popularity: 88 },
    'Mr Dependable - +20 in chases', 'Mushfiq', 2017,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Litton Das
    createCard(175, 'Litton Das', 'wicketkeeper', 'Bangladesh', '', 'epic',
    { batting: 86, bowling: 5, fielding: 82, leadership: 70, consistency: 84, popularity: 84 },
    'Aggressive Opener - +15 powerplay', 'Litton', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Paul Stirling
    createCard(176, 'Paul Stirling', 'batsman', 'Ireland', '', 'epic',
    { batting: 86, bowling: 35, fielding: 80, leadership: 78, consistency: 82, popularity: 82 },
    'Irish Power - +15 in T20s', 'Stirling', 2019,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // ==================== MORE CURRENT STARS ====================

    // Mitchell Marsh - Additional version
    createCard(177, 'Mitchell Marsh', 'allrounder', 'Australia', 'Delhi Capitals', 'legendary',
    { batting: 90, bowling: 86, fielding: 88, leadership: 85, consistency: 88, popularity: 92 },
    'Bison - +20 in finals', 'Marsh', 2023,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: false }),

    // Glenn Maxwell - Additional version
    createCard(178, 'Glenn Maxwell', 'allrounder', 'Australia', 'Royal Challengers Bangalore', 'mythic',
    { batting: 94, bowling: 82, fielding: 90, leadership: 85, consistency: 86, popularity: 98 },
    'The Big Show - +30 against spin', 'Maxwell', 2023,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: true }),

    // Marcus Stoinis - Additional version
    createCard(179, 'Marcus Stoinis', 'allrounder', 'Australia', 'Lucknow Super Giants', 'epic',
    { batting: 86, bowling: 84, fielding: 86, leadership: 80, consistency: 82, popularity: 86 },
    'Power Hitter - +20 in death overs', 'Stoinis', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

    // Moeen Ali - Additional version
    createCard(180, 'Moeen Ali', 'allrounder', 'England', 'Chennai Super Kings', 'legendary',
    { batting: 86, bowling: 88, fielding: 88, leadership: 90, consistency: 88, popularity: 92 },
    'Moeen Magic - +20 against spin', 'Moeen', 2021,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

    // ==================== YOUNG INDIAN TALENTS ====================

    // Sarfaraz Khan
    createCard(181, 'Sarfaraz Khan', 'batsman', 'India', '', 'rare',
    { batting: 85, bowling: 5, fielding: 70, leadership: 65, consistency: 86, popularity: 78 },
    'Domination in Domestic - +20 in Ranji', 'Sarfaraz', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Dhruv Jurel
    createCard(182, 'Dhruv Jurel', 'wicketkeeper', 'India', 'Rajasthan Royals', 'rare',
    { batting: 80, bowling: 5, fielding: 84, leadership: 68, consistency: 78, popularity: 76 },
    'Future Keeper - +10 in pressure', 'Jurel', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Nehal Wadhera
    createCard(183, 'Nehal Wadhera', 'batsman', 'India', 'Mumbai Indians', 'common',
    { batting: 78, bowling: 5, fielding: 72, leadership: 62, consistency: 74, popularity: 72 },
    'MI Youngster - +10 in chases', 'Wadhera', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Sai Sudharsan
    createCard(184, 'Sai Sudharsan', 'batsman', 'India', 'Gujarat Titans', 'rare',
    { batting: 82, bowling: 5, fielding: 78, leadership: 65, consistency: 80, popularity: 76 },
    'Elegant Leftie - +15 in IPL', 'Sudharsan', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // ==================== ADDITIONAL INTERNATIONAL YOUNGSTARS ====================

    // Will Jacks - Additional version
    createCard(185, 'Will Jacks', 'allrounder', 'England', 'Royal Challengers Bangalore', 'epic',
    { batting: 84, bowling: 82, fielding: 82, leadership: 72, consistency: 80, popularity: 82 },
    'Spin Basher - +20 against spin', 'Jacks', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

    // Sam Curran - Additional version
    createCard(186, 'Sam Curran', 'allrounder', 'England', 'Punjab Kings', 'legendary',
    { batting: 84, bowling: 88, fielding: 88, leadership: 80, consistency: 86, popularity: 90 },
    'Player of Tournament - +20 in T20 WC', 'Curran', 2022,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

    // Reece Topley - Additional version
    createCard(187, 'Reece Topley', 'bowler', 'England', 'Royal Challengers Bangalore', 'epic',
    { batting: 15, bowling: 88, fielding: 78, leadership: 68, consistency: 86, popularity: 80 },
    'Left Arm Swing - +20 in powerplay', 'Topley', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // Lungi Ngidi
    createCard(188, 'Lungi Ngidi', 'bowler', 'South Africa', '', 'epic',
    { batting: 15, bowling: 88, fielding: 72, leadership: 68, consistency: 84, popularity: 82 },
    'Young Pace - +15 in death overs', 'Ngidi', 2018,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // Tabraiz Shamsi
    createCard(189, 'Tabraiz Shamsi', 'bowler', 'South Africa', '', 'epic',
    { batting: 15, bowling: 90, fielding: 75, leadership: 68, consistency: 86, popularity: 84 },
    'Wrist Spin King - +20 googly', 'Shamsi', 2021,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // ==================== MAJOR MISSING LEGENDS ====================

    // Bob Willis
    createCard(190, 'Bob Willis', 'bowler', 'England', '', 'legendary',
    { batting: 15, bowling: 94, fielding: 70, leadership: 80, consistency: 90, popularity: 88 },
    'Ashes Hero 1981 - +25 in Ashes', 'Willis', 1981,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: true }),

    // Kapil Dev - Additional version (Young)
    createCard(191, 'Kapil Dev', 'allrounder', 'India', '', 'legendary',
    { batting: 86, bowling: 92, fielding: 80, leadership: 88, consistency: 92, popularity: 96 },
    'Young Haryana Hurricane - +20 pace', 'Kapil', 1980,
    { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: true, allRounder: true, goatEdition: false }),

    // Zaheer Abbas
    createCard(192, 'Zaheer Abbas', 'batsman', 'Pakistan', '', 'legendary',
    { batting: 93, bowling: 5, fielding: 70, leadership: 70, consistency: 90, popularity: 88 },
    'Asian Bradman - +20 in ODIs', 'Abbas', 1982,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // Javed Miandad
    createCard(193, 'Javed Miandad', 'batsman', 'Pakistan', '', 'legendary',
    { batting: 95, bowling: 15, fielding: 75, leadership: 94, consistency: 96, popularity: 94 },
    'Last Ball Six Hero - +25 in chases', 'Miandad', 1986,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // ==================== WILDCARD & SPECIAL CARDS ====================

    // Carlos Brathwaite
    createCard(194, 'Carlos Brathwaite', 'allrounder', 'West Indies', '', 'epic',
    { batting: 85, bowling: 84, fielding: 80, leadership: 75, consistency: 72, popularity: 88 },
    'Remember the Name - +25 in finals', 'Brathwaite', 2016,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

    // Thisara Perera
    createCard(195, 'Thisara Perera', 'allrounder', 'Sri Lanka', '', 'epic',
    { batting: 84, bowling: 85, fielding: 82, leadership: 78, consistency: 80, popularity: 86 },
    'Power Hitter - +20 in death overs', 'Perera', 2013,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

    // Colin de Grandhomme
    createCard(196, 'Colin de Grandhomme', 'allrounder', 'New Zealand', '', 'rare',
    { batting: 82, bowling: 80, fielding: 78, leadership: 72, consistency: 78, popularity: 80 },
    'Big Hitter - +15 in Tests', 'CDG', 2018,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

    // ==================== FINAL SPECIAL CARDS: YOUNG GUNS ====================

    // Azmatullah Omarzai
    createCard(197, 'Azmatullah Omarzai', 'allrounder', 'Afghanistan', '', 'rare',
    { batting: 78, bowling: 82, fielding: 75, leadership: 65, consistency: 76, popularity: 78 },
    'Afghan Allrounder - +15 in WC', 'Omarzai', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

    // Fazalhaq Farooqi
    createCard(198, 'Fazalhaq Farooqi', 'bowler', 'Afghanistan', '', 'rare',
    { batting: 15, bowling: 86, fielding: 72, leadership: 65, consistency: 80, popularity: 76 },
    'Left Arm Quick - +15 powerplay', 'Farooqi', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // Noor Ahmad - Additional version
    createCard(199, 'Noor Ahmad', 'bowler', 'Afghanistan', 'Gujarat Titans', 'epic',
    { batting: 15, bowling: 88, fielding: 74, leadership: 68, consistency: 84, popularity: 82 },
    'Young Mystery Spinner - +20 googly', 'Noor', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // ==================== NEW LEGENDARY & MYTHIC CARDS (INDIAN LEGENDS) ====================

    // Rahul Dravid
    createCard(200, 'Rahul Dravid', 'batsman', 'India', 'Rajasthan Royals', 'mythic',
    { batting: 96, bowling: 15, fielding: 85, leadership: 95, consistency: 99, popularity: 96 },
    'The Wall - +20 defense against top bowlers', 'The Wall', 2002,
    { worldCupWinner: false, iplCaptain: true, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: true }),

    createCard(201, 'Rahul Dravid', 'batsman', 'India', 'Royal Challengers Bangalore', 'legendary',
    { batting: 94, bowling: 10, fielding: 82, leadership: 92, consistency: 98, popularity: 94 },
    'Partnership Builder - +15 when batting with tail', 'Dravid 200+', 2004,
    { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: false }),

    // Virender Sehwag
    createCard(202, 'Virender Sehwag', 'batsman', 'India', 'Delhi Daredevils', 'mythic',
    { batting: 97, bowling: 20, fielding: 70, leadership: 75, consistency: 88, popularity: 98 },
    'Sultan of Multan - +25 power hitting in first session', 'Multan Sultan', 2004,
    { worldCupWinner: true, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: true }),

    createCard(203, 'Virender Sehwag', 'batsman', 'India', 'Kings XI Punjab', 'legendary',
    { batting: 95, bowling: 15, fielding: 68, leadership: 70, consistency: 85, popularity: 96 },
    'Najafgarh Express - +20 batting in powerplay', 'Viru', 2011,
    { worldCupWinner: true, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: false }),

    // Sourav Ganguly
    createCard(204, 'Sourav Ganguly', 'batsman', 'India', '', 'legendary',
    { batting: 92, bowling: 75, fielding: 70, leadership: 98, consistency: 90, popularity: 96 },
    'Prince of Kolkata - +15 leadership as captain', 'Dada', 2000,
    { worldCupWinner: false, iplCaptain: true, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: false }),

    createCard(205, 'Sourav Ganguly', 'batsman', 'India', '', 'mythic',
    { batting: 94, bowling: 70, fielding: 75, leadership: 99, consistency: 92, popularity: 98 },
    'God of Offside - +20 on drives through offside', 'God of Offside', 2002,
    { worldCupWinner: false, iplCaptain: true, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: true }),

    // Anil Kumble
    createCard(206, 'Anil Kumble', 'bowler', 'India', 'Royal Challengers Bangalore', 'mythic',
    { batting: 25, bowling: 98, fielding: 80, leadership: 92, consistency: 97, popularity: 94 },
    'Perfect 10 - +20 bowling in second innings', 'Jumbo', 1999,
    { worldCupWinner: false, iplCaptain: true, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: true }),

    createCard(207, 'Anil Kumble', 'bowler', 'India', '', 'legendary',
    { batting: 20, bowling: 96, fielding: 78, leadership: 90, consistency: 96, popularity: 92 },
    'Spin Wizard - +15 leg spin googly', 'Kumble', 2004,
    { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: false }),

    // Harbhajan Singh
    createCard(208, 'Harbhajan Singh', 'bowler', 'India', 'Chennai Super Kings', 'legendary',
    { batting: 45, bowling: 94, fielding: 75, leadership: 82, consistency: 90, popularity: 92 },
    'Hat-trick Hero - +15 doosra against Australia', 'Bhajji', 2001,
    { worldCupWinner: true, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: false }),

    createCard(209, 'Harbhajan Singh', 'bowler', 'India', 'Mumbai Indians', 'epic',
    { batting: 40, bowling: 88, fielding: 72, leadership: 78, consistency: 88, popularity: 88 },
    'Turbunator - +10 bowling in IPL', 'Bhajji', 2011,
    { worldCupWinner: true, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: false }),

    // Kapil Dev
    createCard(210, 'Kapil Dev', 'allrounder', 'India', '', 'mythic',
    { batting: 90, bowling: 94, fielding: 85, leadership: 98, consistency: 95, popularity: 100 },
    '1983 WC Captain - +20 all stats in World Cup finals', 'Haryana Hurricane', 1983,
    { worldCupWinner: true, iplCaptain: false, indianLegend: true, fastBowler: true, allRounder: true, goatEdition: true }),

    createCard(211, 'Kapil Dev', 'allrounder', 'India', '', 'legendary',
    { batting: 88, bowling: 92, fielding: 82, leadership: 95, consistency: 94, popularity: 98 },
    '175 Not Out - +25 batting when team in trouble', 'Kapil Paaji', 1983,
    { worldCupWinner: true, iplCaptain: false, indianLegend: true, fastBowler: true, allRounder: true, goatEdition: false }),

    // Zaheer Khan
    createCard(212, 'Zaheer Khan', 'bowler', 'India', 'Mumbai Indians', 'legendary',
    { batting: 30, bowling: 95, fielding: 75, leadership: 85, consistency: 92, popularity: 92 },
    '2011 WC Hero - +20 bowling in World Cup', 'Zak', 2011,
    { worldCupWinner: true, iplCaptain: false, indianLegend: true, fastBowler: true, allRounder: false, goatEdition: false }),

    createCard(213, 'Zaheer Khan', 'bowler', 'India', 'Royal Challengers Bangalore', 'epic',
    { batting: 28, bowling: 92, fielding: 72, leadership: 82, consistency: 90, popularity: 88 },
    'Yorker Specialist - +15 in death overs', 'Zak Attack', 2007,
    { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: true, allRounder: false, goatEdition: false }),

    // Sunil Gavaskar
    createCard(214, 'Sunil Gavaskar', 'batsman', 'India', '', 'mythic',
    { batting: 97, bowling: 10, fielding: 80, leadership: 88, consistency: 98, popularity: 96 },
    'Little Master - +20 against fast bowling', 'Sunny Gavaskar', 1975,
    { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: true }),

    createCard(215, 'Sunil Gavaskar', 'batsman', 'India', '', 'legendary',
    { batting: 95, bowling: 8, fielding: 78, leadership: 85, consistency: 97, popularity: 94 },
    '34 Test Centuries - +10 consistency', 'Sunny', 1983,
    { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: false }),

    // Yuvraj Singh
    createCard(216, 'Yuvraj Singh', 'allrounder', 'India', 'Kings XI Punjab', 'mythic',
    { batting: 96, bowling: 80, fielding: 95, leadership: 85, consistency: 90, popularity: 100 },
    '6 Sixes - +25 power hitting in over', 'Yuvi', 2007,
    { worldCupWinner: true, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: true, goatEdition: true }),

    createCard(217, 'Yuvraj Singh', 'allrounder', 'India', 'Mumbai Indians', 'legendary',
    { batting: 94, bowling: 78, fielding: 93, leadership: 82, consistency: 88, popularity: 98 },
    '2011 WC Hero - +15 in knockout matches', 'Player of Tournament', 2011,
    { worldCupWinner: true, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: true, goatEdition: false }),

    createCard(218, 'Yuvraj Singh', 'allrounder', 'India', 'Royal Challengers Bangalore', 'epic',
    { batting: 90, bowling: 75, fielding: 90, leadership: 78, consistency: 85, popularity: 94 },
    'Match Winner - +10 in pressure', 'Yuvi Paaji', 2008,
    { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: true, goatEdition: false }),

    // VVS Laxman
    createCard(219, 'VVS Laxman', 'batsman', 'India', '', 'legendary',
    { batting: 95, bowling: 10, fielding: 85, leadership: 80, consistency: 96, popularity: 92 },
    'Very Very Special - +20 against Australia', 'VVS', 2001,
    { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: true }),

    createCard(220, 'VVS Laxman', 'batsman', 'India', 'Kochi Tuskers Kerala', 'epic',
    { batting: 92, bowling: 8, fielding: 82, leadership: 75, consistency: 94, popularity: 88 },
    'Wristy Wonder - +15 on flicks and cuts', 'Laxman', 2003,
    { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: false }),

    // ==================== EXISTING PLAYERS - NEW EDITIONS ====================

    // MS Dhoni - New Editions
    createCard(221, 'MS Dhoni', 'wicketkeeper', 'India', '', 'rare',
    { batting: 82, bowling: 10, fielding: 90, leadership: 85, consistency: 88, popularity: 92 },
    'Young Mahi - +10 against pace', 'Young Dhoni', 2005,
    { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: false }),

    createCard(222, 'MS Dhoni', 'wicketkeeper', 'India', '', 'epic',
    { batting: 86, bowling: 10, fielding: 92, leadership: 95, consistency: 92, popularity: 98 },
    'T20 WC Hero - +15 in finals', 'Mahi', 2007,
    { worldCupWinner: true, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: false }),

    // Virat Kohli - New Editions
    createCard(223, 'Virat Kohli', 'batsman', 'India', 'Royal Challengers Bangalore', 'elite',
    { batting: 88, bowling: 20, fielding: 80, leadership: 75, consistency: 85, popularity: 90 },
    'Debut Prodigy - +10 in chases', 'Young Virat', 2008,
    { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: false }),

    createCard(224, 'Virat Kohli', 'batsman', 'India', 'Royal Challengers Bangalore', 'epic',
    { batting: 92, bowling: 22, fielding: 82, leadership: 82, consistency: 92, popularity: 94 },
    'Rising Star - +12 in ODI chases', 'Run Machine', 2012,
    { worldCupWinner: true, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: false }),

    // Rohit Sharma - New Editions
    createCard(225, 'Rohit Sharma', 'batsman', 'India', 'Deccan Chargers', 'rare',
    { batting: 80, bowling: 15, fielding: 70, leadership: 65, consistency: 70, popularity: 78 },
    'Teen Sensation - +8 in T20', 'Young Hitman', 2007,
    { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: false }),

    createCard(226, 'Rohit Sharma', 'batsman', 'India', 'Mumbai Indians', 'epic',
    { batting: 92, bowling: 18, fielding: 74, leadership: 75, consistency: 88, popularity: 94 },
    'First ODI Double - +20 in ODIs', 'Double Century', 2013,
    { worldCupWinner: false, iplCaptain: true, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: false }),

    createCard(227, 'Rohit Sharma', 'batsman', 'India', 'Mumbai Indians', 'mythic',
    { batting: 97, bowling: 20, fielding: 78, leadership: 90, consistency: 94, popularity: 100 },
    'Hitman 5x100 - +25 in World Cup', 'World Cup Hitman', 2019,
    { worldCupWinner: true, iplCaptain: true, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: true }),

    // Sachin Tendulkar - New Editions
    createCard(228, 'Sachin Tendulkar', 'batsman', 'India', '', 'legendary',
    { batting: 94, bowling: 28, fielding: 75, leadership: 80, consistency: 96, popularity: 98 },
    'Debut Youngster - +10 against pace', 'Young Sachin', 1989,
    { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: false }),

    createCard(229, 'Sachin Tendulkar', 'batsman', 'India', '', 'legendary',
    { batting: 98, bowling: 28, fielding: 82, leadership: 88, consistency: 98, popularity: 100 },
    'Desert Storm - +25 in Sharjah', 'Desert Storm', 1998,
    { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: true }),

    createCard(230, 'Sachin Tendulkar', 'batsman', 'India', 'Mumbai Indians', 'epic',
    { batting: 92, bowling: 25, fielding: 80, leadership: 85, consistency: 94, popularity: 98 },
    'World Cup Dream - +15 in World Cup', 'WC Winner', 2011,
    { worldCupWinner: true, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: false }),

    // Jasprit Bumrah - New Editions
    createCard(231, 'Jasprit Bumrah', 'bowler', 'India', 'Mumbai Indians', 'epic',
    { batting: 18, bowling: 92, fielding: 80, leadership: 65, consistency: 88, popularity: 88 },
    'Debut Sensation - +12 yorker accuracy', 'Young Boom', 2016,
    { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: true, allRounder: false, goatEdition: false }),

    // ==================== AUSTRALIAN LEGENDS ====================

    // Ricky Ponting
    createCard(232, 'Ricky Ponting', 'batsman', 'Australia', '', 'mythic',
    { batting: 97, bowling: 15, fielding: 92, leadership: 98, consistency: 95, popularity: 98 },
    'Punter Captain - +20 in World Cup finals', 'Punter', 2003,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    createCard(233, 'Ricky Ponting', 'batsman', 'Australia', 'Kolkata Knight Riders', 'legendary',
    { batting: 95, bowling: 12, fielding: 90, leadership: 96, consistency: 94, popularity: 96 },
    'Pull Shot King - +15 against short balls', 'Ponting', 2007,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Adam Gilchrist
    createCard(234, 'Adam Gilchrist', 'wicketkeeper', 'Australia', '', 'mythic',
    { batting: 96, bowling: 5, fielding: 94, leadership: 92, consistency: 94, popularity: 98 },
    'Gilly Attack - +25 power hitting in powerplay', 'Gilly', 2007,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    createCard(235, 'Adam Gilchrist', 'wicketkeeper', 'Australia', 'Kings XI Punjab', 'legendary',
    { batting: 94, bowling: 5, fielding: 92, leadership: 90, consistency: 92, popularity: 96 },
    'IPL Destroyer - +15 in IPL', 'Gilly', 2008,
    { worldCupWinner: false, iplCaptain: true, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Shane Warne
    createCard(236, 'Shane Warne', 'bowler', 'Australia', 'Rajasthan Royals', 'mythic',
    { batting: 40, bowling: 99, fielding: 80, leadership: 96, consistency: 97, popularity: 100 },
    'King of Spin - +25 leg spin variation', 'Warnie', 1999,
    { worldCupWinner: true, iplCaptain: true, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    createCard(237, 'Shane Warne', 'bowler', 'Australia', '', 'legendary',
    { batting: 35, bowling: 97, fielding: 78, leadership: 94, consistency: 96, popularity: 98 },
    'Ball of the Century - +20 against left-handers', 'Warne', 1993,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Brett Lee
    createCard(238, 'Brett Lee', 'bowler', 'Australia', 'Kings XI Punjab', 'legendary',
    { batting: 45, bowling: 96, fielding: 80, leadership: 75, consistency: 90, popularity: 96 },
    'Speedster - +25 bowling 160+ kph', 'Binga', 2003,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: true }),

    createCard(239, 'Brett Lee', 'bowler', 'Australia', 'Kolkata Knight Riders', 'epic',
    { batting: 40, bowling: 92, fielding: 78, leadership: 72, consistency: 88, popularity: 92 },
    'IPL Express - +15 pace in T20', 'Lee', 2008,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // Glenn McGrath
    createCard(240, 'Glenn McGrath', 'bowler', 'Australia', '', 'mythic',
    { batting: 15, bowling: 98, fielding: 85, leadership: 88, consistency: 99, popularity: 96 },
    'Mr Accurate - +20 line and length', 'Pigeon', 2003,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: true }),

    createCard(241, 'Glenn McGrath', 'bowler', 'Australia', '', 'legendary',
    { batting: 12, bowling: 96, fielding: 82, leadership: 85, consistency: 98, popularity: 94 },
    'World Cup Legend - +25 in World Cups', 'McGrath', 2007,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // Matthew Hayden
    createCard(242, 'Matthew Hayden', 'batsman', 'Australia', 'Chennai Super Kings', 'legendary',
    { batting: 95, bowling: 10, fielding: 75, leadership: 80, consistency: 92, popularity: 94 },
    'Haydos Power - +20 power hitting', 'Hayden', 2007,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    createCard(243, 'Matthew Hayden', 'batsman', 'Australia', 'Chennai Super Kings', 'epic',
    { batting: 92, bowling: 8, fielding: 72, leadership: 78, consistency: 90, popularity: 92 },
    'Orange Cap Winner - +15 in IPL', 'Haydos', 2008,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Michael Clarke
    createCard(244, 'Michael Clarke', 'batsman', 'Australia', '', 'epic',
    { batting: 90, bowling: 65, fielding: 88, leadership: 92, consistency: 94, popularity: 90 },
    'Pup - +15 in run chases', 'Clarke', 2010,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    createCard(245, 'Michael Clarke', 'batsman', 'Australia', '', 'legendary',
    { batting: 92, bowling: 68, fielding: 90, leadership: 95, consistency: 96, popularity: 92 },
    'Captain Marvel - +15 leadership', 'Clarke', 2013,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // ==================== WEST INDIES LEGENDS ====================

    // Brian Lara
    createCard(246, 'Brian Lara', 'batsman', 'West Indies', '', 'mythic',
    { batting: 99, bowling: 15, fielding: 80, leadership: 85, consistency: 96, popularity: 100 },
    'Prince of Port of Spain - +30 batting records', 'Lara', 2004,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    createCard(247, 'Brian Lara', 'batsman', 'West Indies', '', 'legendary',
    { batting: 97, bowling: 12, fielding: 78, leadership: 82, consistency: 95, popularity: 98 },
    '400 Not Out - +25 concentration', 'Prince', 2004,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Vivian Richards
    createCard(248, 'Vivian Richards', 'batsman', 'West Indies', '', 'mythic',
    { batting: 98, bowling: 75, fielding: 90, leadership: 95, consistency: 94, popularity: 100 },
    'King Viv - +25 domination against fast bowling', 'King Viv', 1983,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    createCard(249, 'Vivian Richards', 'batsman', 'West Indies', '', 'legendary',
    { batting: 96, bowling: 72, fielding: 88, leadership: 92, consistency: 92, popularity: 98 },
    'Strike Rate King - +20 run rate', 'Richards', 1985,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Curtly Ambrose
    createCard(250, 'Curtly Ambrose', 'bowler', 'West Indies', '', 'legendary',
    { batting: 15, bowling: 97, fielding: 75, leadership: 85, consistency: 96, popularity: 94 },
    'Tall Timbers - +20 bounce from height', 'Ambrose', 1993,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: true }),

    createCard(251, 'Curtly Ambrose', 'bowler', 'West Indies', '', 'epic',
    { batting: 12, bowling: 94, fielding: 72, leadership: 82, consistency: 95, popularity: 92 },
    '7/1 Masterclass - +15 in Test matches', 'Curtly', 1994,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // Courtney Walsh
    createCard(252, 'Courtney Walsh', 'bowler', 'West Indies', '', 'legendary',
    { batting: 15, bowling: 96, fielding: 74, leadership: 88, consistency: 97, popularity: 92 },
    'Wicket Machine - +15 bowling consistency', 'Walsh', 1996,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: true }),

    createCard(253, 'Courtney Walsh', 'bowler', 'West Indies', '', 'epic',
    { batting: 12, bowling: 93, fielding: 70, leadership: 85, consistency: 96, popularity: 90 },
    'Leading Wicket Taker - +10 in fourth innings', 'Walsh', 2000,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // ==================== PAKISTAN LEGENDS ====================

    // Wasim Akram
    createCard(254, 'Wasim Akram', 'bowler', 'Pakistan', 'Kolkata Knight Riders', 'mythic',
    { batting: 50, bowling: 99, fielding: 80, leadership: 92, consistency: 96, popularity: 98 },
    'Sultan of Swing - +25 swing bowling', 'Wasim', 1992,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: true }),

    createCard(255, 'Wasim Akram', 'bowler', 'Pakistan', '', 'legendary',
    { batting: 48, bowling: 97, fielding: 78, leadership: 90, consistency: 95, popularity: 96 },
    'World Cup Final Hero - +20 in finals', 'Akram', 1992,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // Waqar Younis
    createCard(256, 'Waqar Younis', 'bowler', 'Pakistan', '', 'mythic',
    { batting: 20, bowling: 99, fielding: 75, leadership: 85, consistency: 94, popularity: 96 },
    'The Destroyer - +25 yorker accuracy', 'Waqar', 1996,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: true }),

    createCard(257, 'Waqar Younis', 'bowler', 'Pakistan', '', 'legendary',
    { batting: 18, bowling: 96, fielding: 72, leadership: 82, consistency: 93, popularity: 94 },
    'Reverse Swing King - +20 reverse swing', 'Younis', 1993,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // Imran Khan
    createCard(258, 'Imran Khan', 'allrounder', 'Pakistan', '', 'mythic',
    { batting: 88, bowling: 96, fielding: 80, leadership: 99, consistency: 95, popularity: 98 },
    '1992 Captain - +25 all stats as captain', 'Imran', 1992,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: true }),

    createCard(259, 'Imran Khan', 'allrounder', 'Pakistan', '', 'legendary',
    { batting: 86, bowling: 94, fielding: 78, leadership: 97, consistency: 94, popularity: 96 },
    'Allrounder Great - +15 both batting & bowling', 'Imran', 1987,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: false }),

    // Shoaib Akhtar
    createCard(260, 'Shoaib Akhtar', 'bowler', 'Pakistan', 'Kolkata Knight Riders', 'legendary',
    { batting: 20, bowling: 97, fielding: 72, leadership: 70, consistency: 83, popularity: 96 },
    'Rawalpindi Express - +30 bowling speed 161+ kph', 'Shoaib', 1999,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: true }),

    createCard(261, 'Shoaib Akhtar', 'bowler', 'Pakistan', '', 'epic',
    { batting: 18, bowling: 94, fielding: 70, leadership: 68, consistency: 80, popularity: 94 },
    'Fastest Delivery - +20 intimidation', 'Akhtar', 2002,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // Inzamam-ul-Haq
    createCard(262, 'Inzamam-ul-Haq', 'batsman', 'Pakistan', '', 'legendary',
    { batting: 95, bowling: 10, fielding: 65, leadership: 88, consistency: 94, popularity: 94 },
    'Big Inzi - +20 against spin', 'Inzamam', 2003,
    { worldCupWinner: false, iplCaptain: true, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    createCard(263, 'Inzamam-ul-Haq', 'batsman', 'Pakistan', '', 'epic',
    { batting: 92, bowling: 8, fielding: 62, leadership: 85, consistency: 92, popularity: 92 },
    'Clutch Player - +15 in run chases', 'Inzi', 2000,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // ==================== SOUTH AFRICA LEGENDS ====================

    // Jacques Kallis
    createCard(264, 'Jacques Kallis', 'allrounder', 'South Africa', '', 'mythic',
    { batting: 96, bowling: 94, fielding: 90, leadership: 92, consistency: 99, popularity: 98 },
    'GOAT Allrounder - +20 all stats', 'Kallis', 2007,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: true }),

    createCard(265, 'Jacques Kallis', 'allrounder', 'South Africa', 'Kolkata Knight Riders', 'legendary',
    { batting: 94, bowling: 92, fielding: 88, leadership: 90, consistency: 98, popularity: 96 },
    'Mr Consistent - +15 batting & bowling', 'Kallis', 2010,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: false }),

    // Allan Donald
    createCard(266, 'Allan Donald', 'bowler', 'South Africa', '', 'legendary',
    { batting: 15, bowling: 97, fielding: 78, leadership: 82, consistency: 95, popularity: 94 },
    'White Lightning - +25 pace and aggression', 'Donald', 1998,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: true }),

    createCard(267, 'Allan Donald', 'bowler', 'South Africa', '', 'epic',
    { batting: 12, bowling: 94, fielding: 75, leadership: 80, consistency: 93, popularity: 92 },
    'Run Out Specialist - +15 direct hits', 'Donald', 1996,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // Herschelle Gibbs
    createCard(268, 'Herschelle Gibbs', 'batsman', 'South Africa', '', 'epic',
    { batting: 92, bowling: 10, fielding: 90, leadership: 70, consistency: 82, popularity: 92 },
    '6 Sixes - +25 power hitting', 'Gibbs', 2007,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    createCard(269, 'Herschelle Gibbs', 'batsman', 'South Africa', '', 'rare',
    { batting: 88, bowling: 8, fielding: 88, leadership: 68, consistency: 80, popularity: 88 },
    '438 Game Hero - +15 in high scoring matches', 'Gibbs', 2006,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Hashim Amla
    createCard(270, 'Hashim Amla', 'batsman', 'South Africa', 'Kings XI Punjab', 'legendary',
    { batting: 94, bowling: 5, fielding: 85, leadership: 88, consistency: 97, popularity: 94 },
    'The Professor - +20 consistency', 'Amla', 2012,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    createCard(271, 'Hashim Amla', 'batsman', 'South Africa', '', 'epic',
    { batting: 92, bowling: 5, fielding: 82, leadership: 85, consistency: 96, popularity: 92 },
    'Triple Centurion - +25 in Test matches', 'Amla', 2013,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // ==================== SRI LANKA LEGENDS ====================

    // Muttiah Muralitharan
    createCard(272, 'Muttiah Muralitharan', 'bowler', 'Sri Lanka', 'Chennai Super Kings', 'mythic',
    { batting: 25, bowling: 100, fielding: 75, leadership: 85, consistency: 98, popularity: 98 },
    'Highest Wicket Taker - +30 spin variations', 'Murali', 2007,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    createCard(273, 'Muttiah Muralitharan', 'bowler', 'Sri Lanka', '', 'legendary',
    { batting: 22, bowling: 98, fielding: 72, leadership: 82, consistency: 97, popularity: 96 },
    'Doosra Master - +25 doosra', 'Murali', 2003,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Sanath Jayasuriya
    createCard(274, 'Sanath Jayasuriya', 'allrounder', 'Sri Lanka', 'Mumbai Indians', 'mythic',
    { batting: 95, bowling: 88, fielding: 80, leadership: 92, consistency: 88, popularity: 98 },
    '1996 WC Hero - +25 powerplay batting', 'Jayasuriya', 1996,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: true }),

    createCard(275, 'Sanath Jayasuriya', 'allrounder', 'Sri Lanka', '', 'legendary',
    { batting: 93, bowling: 86, fielding: 78, leadership: 90, consistency: 86, popularity: 96 },
    'Matara Marauder - +20 in ODIs', 'Sanath', 1997,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

    // Chaminda Vaas
    createCard(276, 'Chaminda Vaas', 'bowler', 'Sri Lanka', '', 'legendary',
    { batting: 35, bowling: 95, fielding: 75, leadership: 82, consistency: 94, popularity: 92 },
    '8/19 Masterclass - +25 swing bowling', 'Vaas', 2001,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: true }),

    createCard(277, 'Chaminda Vaas', 'bowler', 'Sri Lanka', '', 'epic',
    { batting: 32, bowling: 92, fielding: 72, leadership: 80, consistency: 93, popularity: 90 },
    'Hat-trick First Ball - +15 in powerplay', 'Vaas', 2003,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // ==================== ENGLAND LEGENDS ====================

    // Ian Botham
    createCard(278, 'Ian Botham', 'allrounder', 'England', '', 'mythic',
    { batting: 90, bowling: 95, fielding: 85, leadership: 94, consistency: 92, popularity: 96 },
    'Beefy - +25 all stats in Ashes', 'Botham', 1981,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: true }),

    createCard(279, 'Ian Botham', 'allrounder', 'England', '', 'legendary',
    { batting: 88, bowling: 93, fielding: 82, leadership: 92, consistency: 90, popularity: 94 },
    'Botham\'s Ashes - +20 in pressure', 'Botham', 1981,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: false }),

    // Andrew Flintoff
    createCard(280, 'Andrew Flintoff', 'allrounder', 'England', 'Chennai Super Kings', 'legendary',
    { batting: 88, bowling: 94, fielding: 90, leadership: 88, consistency: 90, popularity: 96 },
    'Freddie - +20 in Ashes', 'Flintoff', 2005,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: true }),

    createCard(281, 'Andrew Flintoff', 'allrounder', 'England', '', 'epic',
    { batting: 86, bowling: 92, fielding: 88, leadership: 85, consistency: 88, popularity: 94 },
    'Celebration Run - +15 fast bowling energy', 'Freddie', 2005,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: false }),

    // James Anderson
    createCard(282, 'James Anderson', 'bowler', 'England', '', 'legendary',
    { batting: 15, bowling: 96, fielding: 80, leadership: 82, consistency: 95, popularity: 94 },
    'Swing King - +25 swing in England', 'Jimmy', 2010,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: true }),

    createCard(283, 'James Anderson', 'bowler', 'England', '', 'epic',
    { batting: 12, bowling: 94, fielding: 78, leadership: 80, consistency: 94, popularity: 92 },
    'Most Test Wickets Pacer - +15 consistency', 'Anderson', 2018,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // Kevin Pietersen
    createCard(284, 'Kevin Pietersen', 'batsman', 'England', 'Delhi Capitals', 'legendary',
    { batting: 94, bowling: 35, fielding: 80, leadership: 75, consistency: 88, popularity: 96 },
    'KP - +20 switch hit', 'Pietersen', 2008,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    createCard(285, 'Kevin Pietersen', 'batsman', 'England', '', 'epic',
    { batting: 92, bowling: 32, fielding: 78, leadership: 72, consistency: 86, popularity: 94 },
    'Ashes Hero - +18 against Australia', 'KP', 2005,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // ==================== NEW ZEALAND LEGENDS ====================

    // Richard Hadlee
    createCard(286, 'Richard Hadlee', 'bowler', 'New Zealand', '', 'mythic',
    { batting: 70, bowling: 98, fielding: 80, leadership: 88, consistency: 97, popularity: 94 },
    'Paddles - +25 bowling all conditions', 'Hadlee', 1985,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: true }),

    createCard(287, 'Richard Hadlee', 'bowler', 'New Zealand', '', 'legendary',
    { batting: 68, bowling: 96, fielding: 78, leadership: 85, consistency: 96, popularity: 92 },
    'First to 400 Wickets - +20 in Tests', 'Hadlee', 1988,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: false }),

    // Brendon McCullum
    createCard(288, 'Brendon McCullum', 'wicketkeeper', 'New Zealand', 'Kolkata Knight Riders', 'legendary',
    { batting: 94, bowling: 5, fielding: 92, leadership: 90, consistency: 88, popularity: 96 },
    'Bazball - +25 aggressive batting', 'Baz', 2014,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    createCard(289, 'Brendon McCullum', 'wicketkeeper', 'New Zealand', 'Chennai Super Kings', 'epic',
    { batting: 92, bowling: 5, fielding: 90, leadership: 88, consistency: 86, popularity: 94 },
    'IPL 158* - +20 T20 batting', 'McCullum', 2008,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Martin Crowe
    createCard(290, 'Martin Crowe', 'batsman', 'New Zealand', '', 'epic',
    { batting: 92, bowling: 50, fielding: 80, leadership: 88, consistency: 94, popularity: 88 },
    'The Original - +15 in World Cups', 'Crowe', 1992,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    createCard(291, 'Martin Crowe', 'batsman', 'New Zealand', '', 'rare',
    { batting: 89, bowling: 48, fielding: 78, leadership: 85, consistency: 92, popularity: 86 },
    '299 Masterclass - +15 against pace', 'Crowe', 1991,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // ==================== CURRENT STARS - UPGRADED VERSIONS ====================

    // Shubman Gill - Upgraded
    createCard(292, 'Shubman Gill', 'batsman', 'India', 'Gujarat Titans', 'legendary',
    { batting: 94, bowling: 5, fielding: 88, leadership: 80, consistency: 92, popularity: 94 },
    'Double Centurion - +25 in ODIs', 'Gill', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Suryakumar Yadav - Upgraded
    createCard(293, 'Suryakumar Yadav', 'batsman', 'India', 'Mumbai Indians', 'legendary',
    { batting: 95, bowling: 10, fielding: 92, leadership: 75, consistency: 88, popularity: 96 },
    'T20 No.1 - +20 in T20 Internationals', 'SKY', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Mohammed Siraj - Upgraded
    createCard(294, 'Mohammed Siraj', 'bowler', 'India', 'Royal Challengers Bangalore', 'epic',
    { batting: 15, bowling: 92, fielding: 78, leadership: 70, consistency: 88, popularity: 86 },
    'Asia Cup Hero - +20 in Asia Cup', 'Miyan', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // Ishan Kishan - Upgraded
    createCard(295, 'Ishan Kishan', 'wicketkeeper', 'India', 'Mumbai Indians', 'rare',
    { batting: 84, bowling: 5, fielding: 82, leadership: 68, consistency: 78, popularity: 82 },
    'Double 200 - +20 in ODIs', 'Kishan', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Ruturaj Gaikwad - Upgraded
    createCard(296, 'Ruturaj Gaikwad', 'batsman', 'India', 'Chennai Super Kings', 'epic',
    { batting: 86, bowling: 5, fielding: 80, leadership: 70, consistency: 86, popularity: 84 },
    'Orange Cap Winner - +15 in IPL', 'Gaikwad', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Harry Brook - New
    createCard(297, 'Harry Brook', 'batsman', 'England', 'Sunrisers Hyderabad', 'epic',
    { batting: 88, bowling: 10, fielding: 82, leadership: 70, consistency: 82, popularity: 88 },
    '100 in all formats - +15 in all formats', 'Brook', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Rachin Ravindra - Upgraded
    createCard(298, 'Rachin Ravindra', 'allrounder', 'New Zealand', 'Chennai Super Kings', 'legendary',
    { batting: 90, bowling: 85, fielding: 88, leadership: 80, consistency: 90, popularity: 92 },
    'WC 2023 Star - +20 in World Cups', 'Rachin', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

    // Rinku Singh - Already Epic, adding Legendary
    createCard(299, 'Rinku Singh', 'batsman', 'India', 'Kolkata Knight Riders', 'legendary',
    { batting: 92, bowling: 5, fielding: 80, leadership: 78, consistency: 90, popularity: 96 },
    'Finisher King - +25 in death overs', 'Rinku', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Tilak Varma - Upgrade
    createCard(300, 'Tilak Varma', 'batsman', 'India', 'Mumbai Indians', 'rare',
    { batting: 84, bowling: 5, fielding: 80, leadership: 70, consistency: 82, popularity: 84 },
    'Future Star - +15 against spin', 'Tilak', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Yashasvi Jaiswal - Upgrade
    createCard(301, 'Yashasvi Jaiswal', 'batsman', 'India', 'Rajasthan Royals', 'legendary',
    { batting: 92, bowling: 5, fielding: 84, leadership: 75, consistency: 88, popularity: 92 },
    'Future Legend - +20 in run chases', 'Jaiswal', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // ==================== ADDITIONAL CURRENT STARS ====================

    // Heinrich Klaasen - Upgrade
    createCard(302, 'Heinrich Klaasen', 'wicketkeeper', 'South Africa', 'Sunrisers Hyderabad', 'legendary',
    { batting: 92, bowling: 5, fielding: 88, leadership: 75, consistency: 88, popularity: 90 },
    'Spin Destroyer - +25 against spin', 'Klaasen', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Gerald Coetzee - Upgrade
    createCard(303, 'Gerald Coetzee', 'bowler', 'South Africa', 'Mumbai Indians', 'epic',
    { batting: 30, bowling: 92, fielding: 78, leadership: 70, consistency: 84, popularity: 86 },
    'Raw Pace - +25 bowling speed', 'Coetzee', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // Matheesha Pathirana - Upgrade
    createCard(304, 'Matheesha Pathirana', 'bowler', 'Sri Lanka', 'Chennai Super Kings', 'epic',
    { batting: 15, bowling: 92, fielding: 78, leadership: 68, consistency: 86, popularity: 88 },
    'Baby Malinga - +25 yorker accuracy', 'Pathirana', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // Will Jacks - Upgrade
    createCard(305, 'Will Jacks', 'allrounder', 'England', 'Royal Challengers Bangalore', 'rare',
    { batting: 82, bowling: 82, fielding: 80, leadership: 70, consistency: 78, popularity: 80 },
    'Spin Hitter - +20 against spin', 'Jacks', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

    // Phil Salt - Upgrade
    createCard(306, 'Phil Salt', 'wicketkeeper', 'England', 'Delhi Capitals', 'rare',
    { batting: 84, bowling: 5, fielding: 85, leadership: 70, consistency: 78, popularity: 82 },
    'Aggressive Opener - +15 in powerplay', 'Salt', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // ==================== WOMEN'S CRICKET CARDS (BONUS) ====================

    // Mithali Raj
    createCard(307, 'Mithali Raj', 'batsman', 'India', '', 'legendary',
    { batting: 95, bowling: 5, fielding: 80, leadership: 92, consistency: 97, popularity: 94 },
    'Lady Tendulkar - +20 in ODIs', 'Mithali', 2017,
    { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: true }),

    // Jhulan Goswami
    createCard(308, 'Jhulan Goswami', 'bowler', 'India', '', 'legendary',
    { batting: 35, bowling: 96, fielding: 75, leadership: 88, consistency: 96, popularity: 92 },
    'Leading Wicket Taker - +20 fast bowling', 'Jhulan', 2007,
    { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: true, allRounder: false, goatEdition: true }),

    // Harmanpreet Kaur
    createCard(309, 'Harmanpreet Kaur', 'batsman', 'India', '', 'epic',
    { batting: 90, bowling: 70, fielding: 85, leadership: 88, consistency: 86, popularity: 90 },
    'Women\'s World Cup Hero - +20 in knockouts', 'Harman', 2017,
    { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: true, goatEdition: false }),

    // Ellyse Perry
    createCard(310, 'Ellyse Perry', 'allrounder', 'Australia', '', 'mythic',
    { batting: 92, bowling: 94, fielding: 92, leadership: 90, consistency: 96, popularity: 96 },
    'GOAT Women\'s Allrounder - +25 all stats', 'Perry', 2019,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: true }),

    // Meg Lanning
    createCard(311, 'Meg Lanning', 'batsman', 'Australia', '', 'legendary',
    { batting: 96, bowling: 5, fielding: 85, leadership: 95, consistency: 94, popularity: 94 },
    'Most Centuries - +20 in World Cups', 'Lanning', 2022,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // Smriti Mandhana
    createCard(312, 'Smriti Mandhana', 'batsman', 'India', '', 'epic',
    { batting: 92, bowling: 5, fielding: 85, leadership: 75, consistency: 88, popularity: 92 },
    'Elegant Leftie - +15 in powerplay', 'Mandhana', 2018,
    { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: false }),

    // ==================== IDs 313-399: ADDITIONAL WORLD CUP STARS & MISSING LEGENDS ====================

    // Shane Watson
    createCard(313, 'Shane Watson', 'allrounder', 'Australia', 'Chennai Super Kings', 'legendary',
    { batting: 92, bowling: 88, fielding: 85, leadership: 82, consistency: 88, popularity: 96 },
    'Watson the Boss - +20 in IPL finals', 'Watson', 2018,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: false }),

    createCard(314, 'Shane Watson', 'allrounder', 'Australia', 'Royal Challengers Bangalore', 'mythic',
    { batting: 94, bowling: 90, fielding: 88, leadership: 85, consistency: 90, popularity: 98 },
    'Allrounder Supreme - +25 both batting & bowling', 'Watto', 2013,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: true }),

    // Shane Watson - Young version
    createCard(315, 'Shane Watson', 'allrounder', 'Australia', '', 'epic',
    { batting: 86, bowling: 88, fielding: 82, leadership: 75, consistency: 84, popularity: 88 },
    'Young Watto - +15 early career', 'Watson', 2006,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: false }),

    // Shaun Tait
    createCard(316, 'Shaun Tait', 'bowler', 'Australia', '', 'legendary',
    { batting: 15, bowling: 94, fielding: 70, leadership: 65, consistency: 75, popularity: 90 },
    'Wild Thing - +30 pace 160+ kph', 'Tait', 2007,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: true }),

    createCard(317, 'Shaun Tait', 'bowler', 'Australia', 'Rajasthan Royals', 'epic',
    { batting: 12, bowling: 90, fielding: 68, leadership: 62, consistency: 72, popularity: 86 },
    'Speed Express - +20 yorker', 'Tait', 2010,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // Tamim Iqbal
    createCard(318, 'Tamim Iqbal', 'batsman', 'Bangladesh', '', 'legendary',
    { batting: 92, bowling: 5, fielding: 80, leadership: 85, consistency: 90, popularity: 92 },
    'Bangladesh Tiger - +20 in World Cups', 'Tamim', 2015,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    createCard(319, 'Tamim Iqbal', 'batsman', 'Bangladesh', 'Peshawar Zalmi', 'epic',
    { batting: 88, bowling: 5, fielding: 78, leadership: 82, consistency: 88, popularity: 88 },
    'Aggressive Opener - +15 in powerplay', 'Tamim', 2011,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Mustafizur Rahman - Additional version
    createCard(320, 'Mustafizur Rahman', 'bowler', 'Bangladesh', 'Chennai Super Kings', 'legendary',
    { batting: 15, bowling: 92, fielding: 78, leadership: 70, consistency: 88, popularity: 90 },
    'Fizz - +25 cutters', 'Mustafizur', 2016,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // Shakib Al Hasan - Additional versions
    createCard(321, 'Shakib Al Hasan', 'allrounder', 'Bangladesh', 'Kolkata Knight Riders', 'mythic',
    { batting: 92, bowling: 94, fielding: 90, leadership: 94, consistency: 96, popularity: 96 },
    'World\'s Best - +30 allround performance', 'Shakib', 2019,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: true }),

    // Chris Gayle - Additional versions
    createCard(322, 'Chris Gayle', 'batsman', 'West Indies', 'Royal Challengers Bangalore', 'mythic',
    { batting: 98, bowling: 32, fielding: 72, leadership: 82, consistency: 88, popularity: 100 },
    'Gayle Storm - +35 power hitting', 'Gayle', 2013,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    createCard(323, 'Chris Gayle', 'batsman', 'West Indies', 'Kings XI Punjab', 'legendary',
    { batting: 95, bowling: 30, fielding: 70, leadership: 78, consistency: 85, popularity: 98 },
    'Universe Boss - +25 T20 batting', 'Gayle', 2018,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Quinton de Kock - Additional versions
    createCard(324, 'Quinton de Kock', 'wicketkeeper', 'South Africa', 'Mumbai Indians', 'mythic',
    { batting: 96, bowling: 5, fielding: 90, leadership: 78, consistency: 92, popularity: 96 },
    'QDK Magic - +25 in powerplay', 'de Kock', 2020,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // ==================== MORE AUSTRALIAN STARS ====================

    // Mitchell Starc - Additional version
    createCard(325, 'Mitchell Starc', 'bowler', 'Australia', 'Kolkata Knight Riders', 'mythic',
    { batting: 32, bowling: 99, fielding: 78, leadership: 75, consistency: 88, popularity: 96 },
    'Starc Thunder - +30 yorker in death', 'Starc', 2015,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: true }),

    // Josh Hazlewood - Additional version
    createCard(326, 'Josh Hazlewood', 'bowler', 'Australia', 'Royal Challengers Bangalore', 'legendary',
    { batting: 18, bowling: 94, fielding: 82, leadership: 78, consistency: 96, popularity: 88 },
    'Hazlewood Precision - +25 line & length', 'Hazlewood', 2021,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // Pat Cummins - Additional version
    createCard(327, 'Pat Cummins', 'bowler', 'Australia', 'Kolkata Knight Riders', 'mythic',
    { batting: 38, bowling: 98, fielding: 88, leadership: 96, consistency: 94, popularity: 94 },
    'Captain Cummins - +25 bowling as captain', 'Cummins', 2023,
    { worldCupWinner: true, iplCaptain: true, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: true }),

    // Mitchell Johnson
    createCard(328, 'Mitchell Johnson', 'bowler', 'Australia', 'Kings XI Punjab', 'legendary',
    { batting: 35, bowling: 96, fielding: 75, leadership: 80, consistency: 85, popularity: 94 },
    'Johnson Moustache - +25 aggressive bowling', 'Johnson', 2013,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: true }),

    createCard(329, 'Mitchell Johnson', 'bowler', 'Australia', '', 'epic',
    { batting: 32, bowling: 92, fielding: 72, leadership: 78, consistency: 82, popularity: 90 },
    'Ashes Destroyer - +20 in Ashes', 'Johnson', 2009,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // Nathan Lyon
    createCard(330, 'Nathan Lyon', 'bowler', 'Australia', '', 'legendary',
    { batting: 25, bowling: 94, fielding: 75, leadership: 80, consistency: 96, popularity: 88 },
    'GOAT Offspinner - +25 in Tests', 'Lyon', 2017,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // ==================== MORE ENGLISH STARS ====================

    // Andrew Flintoff - Additional version
    createCard(331, 'Andrew Flintoff', 'allrounder', 'England', 'Chennai Super Kings', 'mythic',
    { batting: 90, bowling: 96, fielding: 92, leadership: 90, consistency: 92, popularity: 98 },
    'Flintoff Power - +30 in Ashes', 'Flintoff', 2005,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: true }),

    // James Anderson - Record version
    createCard(332, 'James Anderson', 'bowler', 'England', '', 'mythic',
    { batting: 15, bowling: 98, fielding: 82, leadership: 85, consistency: 98, popularity: 96 },
    'Most Test Wickets Pacer - +30 swing', 'Anderson', 2020,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: true }),

    // Stuart Broad - Record version
    createCard(333, 'Stuart Broad', 'bowler', 'England', '', 'mythic',
    { batting: 28, bowling: 96, fielding: 80, leadership: 84, consistency: 94, popularity: 94 },
    'Broadzilla - +25 Ashes & 600 wickets', 'Broad', 2020,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: true }),

    // ==================== NEW ZEALAND ADDITIONS ====================

    // Tim Southee - Additional version
    createCard(334, 'Tim Southee', 'bowler', 'New Zealand', '', 'mythic',
    { batting: 38, bowling: 94, fielding: 82, leadership: 88, consistency: 92, popularity: 90 },
    'Southee Swing - +25 powerplay', 'Southee', 2019,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // Mitchell Santner
    createCard(335, 'Mitchell Santner', 'allrounder', 'New Zealand', 'Chennai Super Kings', 'epic',
    { batting: 75, bowling: 88, fielding: 90, leadership: 78, consistency: 88, popularity: 84 },
    'Santner Spin - +15 in middle overs', 'Santner', 2021,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

    // Jimmy Neesham - Additional version
    createCard(336, 'Jimmy Neesham', 'allrounder', 'New Zealand', 'Rajasthan Royals', 'epic',
    { batting: 82, bowling: 80, fielding: 84, leadership: 75, consistency: 78, popularity: 82 },
    'Neesham Finisher - +20 in death', 'Neesham', 2021,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

    // ==================== SOUTH AFRICA ADDITIONS ====================

    // Herschelle Gibbs - Additional version
    createCard(337, 'Herschelle Gibbs', 'batsman', 'South Africa', '', 'legendary',
    { batting: 94, bowling: 10, fielding: 92, leadership: 72, consistency: 85, popularity: 94 },
    'Gibbs 438 Game - +25 in run chases', 'Gibbs', 2006,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // Morne Morkel
    createCard(338, 'Morne Morkel', 'bowler', 'South Africa', '', 'legendary',
    { batting: 20, bowling: 94, fielding: 75, leadership: 72, consistency: 90, popularity: 88 },
    'Morkel Bounce - +20 bounce', 'Morkel', 2010,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // JP Duminy
    createCard(339, 'JP Duminy', 'allrounder', 'South Africa', '', 'epic',
    { batting: 86, bowling: 82, fielding: 85, leadership: 80, consistency: 86, popularity: 86 },
    'Duminy Magic - +15 in chases', 'Duminy', 2015,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

    // ==================== PAKISTAN ADDITIONS ====================

    // Mohammad Hafeez
    createCard(340, 'Mohammad Hafeez', 'allrounder', 'Pakistan', '', 'epic',
    { batting: 84, bowling: 86, fielding: 80, leadership: 85, consistency: 86, popularity: 88 },
    'Professor - +15 all-round', 'Hafeez', 2014,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

    // Umar Gul
    createCard(341, 'Umar Gul', 'bowler', 'Pakistan', 'Kolkata Knight Riders', 'legendary',
    { batting: 25, bowling: 92, fielding: 75, leadership: 70, consistency: 86, popularity: 90 },
    'Gul Doom - +25 yorker in T20', 'Gul', 2009,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: true }),

    // Saeed Ajmal
    createCard(342, 'Saeed Ajmal', 'bowler', 'Pakistan', '', 'legendary',
    { batting: 15, bowling: 94, fielding: 70, leadership: 72, consistency: 90, popularity: 92 },
    'Ajmal Doosra - +25 mystery spin', 'Ajmal', 2012,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // ==================== SRI LANKA ADDITIONS ====================

    // Tillakaratne Dilshan
    createCard(343, 'Tillakaratne Dilshan', 'allrounder', 'Sri Lanka', 'Royal Challengers Bangalore', 'legendary',
    { batting: 92, bowling: 75, fielding: 88, leadership: 85, consistency: 90, popularity: 94 },
    'Dilshan Scoop - +20 innovative shots', 'Dilshan', 2011,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: true }),

    // Nuwan Kulasekara
    createCard(344, 'Nuwan Kulasekara', 'bowler', 'Sri Lanka', '', 'epic',
    { batting: 35, bowling: 88, fielding: 75, leadership: 70, consistency: 88, popularity: 84 },
    'Kula Swing - +15 swing', 'Kulasekara', 2010,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // ==================== WEST INDIES ADDITIONS ====================

    // Marlon Samuels
    createCard(345, 'Marlon Samuels', 'batsman', 'West Indies', '', 'legendary',
    { batting: 90, bowling: 75, fielding: 80, leadership: 72, consistency: 84, popularity: 90 },
    'Samuels - +25 in T20 finals', 'Samuels', 2012,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // Darren Sammy
    createCard(346, 'Darren Sammy', 'allrounder', 'West Indies', '', 'legendary',
    { batting: 78, bowling: 84, fielding: 80, leadership: 96, consistency: 85, popularity: 92 },
    'Sammy Captain - +25 leadership', 'Sammy', 2012,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: true }),

    // ==================== INDIA ADDITIONS (MORE LEGENDS) ====================

    // Mohammad Kaif
    createCard(347, 'Mohammad Kaif', 'batsman', 'India', '', 'epic',
    { batting: 82, bowling: 5, fielding: 92, leadership: 75, consistency: 84, popularity: 86 },
    'Kaif Fielding - +25 fielding', 'Kaif', 2002,
    { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: false }),

    // Ajay Jadeja
    createCard(348, 'Ajay Jadeja', 'batsman', 'India', '', 'epic',
    { batting: 86, bowling: 45, fielding: 85, leadership: 70, consistency: 82, popularity: 88 },
    'Jadeja Finisher - +15 in death', 'Jadeja', 1996,
    { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: false }),

    // Robin Singh
    createCard(349, 'Robin Singh', 'allrounder', 'India', '', 'rare',
    { batting: 78, bowling: 80, fielding: 85, leadership: 75, consistency: 82, popularity: 82 },
    'Robin Allround - +10 in fielding', 'Robin', 1999,
    { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: true, goatEdition: false }),

    // ==================== CURRENT T20 STARS ====================

    // Andre Russell - Additional version
    createCard(350, 'Andre Russell', 'allrounder', 'West Indies', 'Kolkata Knight Riders', 'mythic',
    { batting: 94, bowling: 92, fielding: 88, leadership: 80, consistency: 86, popularity: 98 },
    'Russell Dominance - +35 in death overs', 'Russell', 2019,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: true }),

    // Sunil Narine - Additional version
    createCard(351, 'Sunil Narine', 'allrounder', 'West Indies', 'Kolkata Knight Riders', 'mythic',
    { batting: 70, bowling: 96, fielding: 82, leadership: 75, consistency: 92, popularity: 94 },
    'Narine Mystery - +25 economy rate', 'Narine', 2018,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: true }),

    // ==================== MORE WORLD CUP WINNERS ====================

    // Yuvraj Singh 2011 WC Special
    createCard(352, 'Yuvraj Singh', 'allrounder', 'India', '', 'mythic',
    { batting: 95, bowling: 85, fielding: 96, leadership: 88, consistency: 92, popularity: 100 },
    'Player of Tournament - +35 in World Cup', 'Yuvi', 2011,
    { worldCupWinner: true, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: true, goatEdition: true }),

    // Gautam Gambhir 2011 WC Final
    createCard(353, 'Gautam Gambhir', 'batsman', 'India', '', 'legendary',
    { batting: 94, bowling: 5, fielding: 82, leadership: 90, consistency: 94, popularity: 94 },
    'WC Final Hero - +30 in finals', 'Gambhir', 2011,
    { worldCupWinner: true, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: true }),

    // ==================== IPL SPECIALISTS ====================

    // Yusuf Pathan
    createCard(354, 'Yusuf Pathan', 'allrounder', 'India', 'Kolkata Knight Riders', 'epic',
    { batting: 86, bowling: 80, fielding: 75, leadership: 70, consistency: 78, popularity: 88 },
    'Pathan Power - +25 in IPL', 'Yusuf', 2011,
    { worldCupWinner: true, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: true, goatEdition: false }),

    // Manish Pandey
    createCard(355, 'Manish Pandey', 'batsman', 'India', 'Lucknow Super Giants', 'rare',
    { batting: 84, bowling: 5, fielding: 80, leadership: 72, consistency: 82, popularity: 80 },
    'First IPL Centurion - +15 in chases', 'Pandey', 2014,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Manoj Tiwary
    createCard(356, 'Manoj Tiwary', 'batsman', 'India', '', 'rare',
    { batting: 82, bowling: 35, fielding: 75, leadership: 70, consistency: 80, popularity: 78 },
    'Tiwary Power - +10 in domestic', 'Tiwary', 2012,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // ==================== ASSOCIATE NATIONS STARS ====================

    // Ryan ten Doeschate
    createCard(357, 'Ryan ten Doeschate', 'allrounder', 'Netherlands', '', 'epic',
    { batting: 86, bowling: 84, fielding: 80, leadership: 82, consistency: 88, popularity: 84 },
    'Netherlands Legend - +20 in World Cups', 'ten Doeschate', 2011,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: true }),

    // Kevin O'Brien
    createCard(358, 'Kevin O\'Brien', 'allrounder', 'Ireland', '', 'epic',
    { batting: 84, bowling: 82, fielding: 78, leadership: 80, consistency: 82, popularity: 86 },
    '2011 WC Hero - +30 fastest century', 'O\'Brien', 2011,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: true }),

    // ==================== MORE LEGENDS FROM 70s-90s ====================

    // Gordon Greenidge
    createCard(359, 'Gordon Greenidge', 'batsman', 'West Indies', '', 'legendary',
    { batting: 93, bowling: 15, fielding: 70, leadership: 72, consistency: 88, popularity: 90 },
    'Greenidge Power - +20 in ODIs', 'Greenidge', 1983,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // Desmond Haynes
    createCard(360, 'Desmond Haynes', 'batsman', 'West Indies', '', 'legendary',
    { batting: 92, bowling: 10, fielding: 75, leadership: 70, consistency: 90, popularity: 88 },
    'Haynes Class - +15 opening', 'Haynes', 1984,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // ==================== FINAL BATCH - MORE INTERNATIONAL STARS ====================

    // Colin Munro
    createCard(361, 'Colin Munro', 'batsman', 'New Zealand', '', 'epic',
    { batting: 86, bowling: 45, fielding: 80, leadership: 70, consistency: 78, popularity: 84 },
    'Munro Power - +20 in T20s', 'Munro', 2018,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Martin Guptill
    createCard(362, 'Martin Guptill', 'batsman', 'New Zealand', '', 'legendary',
    { batting: 92, bowling: 25, fielding: 85, leadership: 72, consistency: 86, popularity: 90 },
    'Guptill 237* - +25 in ODIs', 'Guptill', 2015,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // Aaron Finch
    createCard(363, 'Aaron Finch', 'batsman', 'Australia', '', 'legendary',
    { batting: 92, bowling: 25, fielding: 80, leadership: 88, consistency: 84, popularity: 92 },
    'Finch 172 - +20 in T20s', 'Finch', 2018,
    { worldCupWinner: true, iplCaptain: true, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Alex Hales
    createCard(364, 'Alex Hales', 'batsman', 'England', '', 'epic',
    { batting: 88, bowling: 15, fielding: 80, leadership: 68, consistency: 82, popularity: 86 },
    'Hales Power - +20 in powerplay', 'Hales', 2016,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Jason Roy
    createCard(365, 'Jason Roy', 'batsman', 'England', '', 'epic',
    { batting: 88, bowling: 15, fielding: 82, leadership: 70, consistency: 82, popularity: 88 },
    'Roy Aggression - +20 in World Cup', 'Roy', 2019,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Dawid Malan
    createCard(366, 'Dawid Malan', 'batsman', 'England', '', 'epic',
    { batting: 88, bowling: 10, fielding: 78, leadership: 70, consistency: 86, popularity: 84 },
    'Malan No.1 T20 - +15 in T20s', 'Malan', 2021,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Fakhar Zaman
    createCard(367, 'Fakhar Zaman', 'batsman', 'Pakistan', '', 'epic',
    { batting: 88, bowling: 10, fielding: 80, leadership: 68, consistency: 82, popularity: 88 },
    'Fakhar 210* - +25 in chases', 'Fakhar', 2017,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Imam-ul-Haq
    createCard(368, 'Imam-ul-Haq', 'batsman', 'Pakistan', '', 'rare',
    { batting: 84, bowling: 5, fielding: 75, leadership: 68, consistency: 86, popularity: 80 },
    'Imam Consistent - +15 in ODIs', 'Imam', 2019,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Kusal Mendis
    createCard(369, 'Kusal Mendis', 'batsman', 'Sri Lanka', '', 'epic',
    { batting: 84, bowling: 5, fielding: 80, leadership: 70, consistency: 82, popularity: 82 },
    'Mendis Class - +15 in Tests', 'Mendis', 2019,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Kusal Perera
    createCard(370, 'Kusal Perera', 'wicketkeeper', 'Sri Lanka', '', 'epic',
    { batting: 86, bowling: 5, fielding: 84, leadership: 68, consistency: 80, popularity: 84 },
    'Perera Power - +20 in chases', 'Perera', 2019,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // ==================== MORE INDIAN DOMESTIC STARS ====================

    // Ambati Rayudu
    createCard(371, 'Ambati Rayudu', 'batsman', 'India', 'Chennai Super Kings', 'rare',
    { batting: 84, bowling: 5, fielding: 78, leadership: 72, consistency: 84, popularity: 82 },
    'Rayudu Reliable - +15 in middle overs', 'Rayudu', 2018,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Dinesh Karthik
    createCard(372, 'Dinesh Karthik', 'wicketkeeper', 'India', 'Royal Challengers Bangalore', 'epic',
    { batting: 84, bowling: 5, fielding: 86, leadership: 82, consistency: 84, popularity: 86 },
    'DK Finisher - +20 in death overs', 'Karthik', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Krunal Pandya
    createCard(373, 'Krunal Pandya', 'allrounder', 'India', 'Lucknow Super Giants', 'rare',
    { batting: 78, bowling: 82, fielding: 80, leadership: 75, consistency: 80, popularity: 82 },
    'Krunal Spin - +15 in middle overs', 'Krunal', 2018,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

    // ==================== FINAL LEGENDS - THE COMPLETE SET ====================

    // Sir Garfield Sobers
    createCard(374, 'Garfield Sobers', 'allrounder', 'West Indies', '', 'mythic',
    { batting: 96, bowling: 94, fielding: 90, leadership: 92, consistency: 96, popularity: 98 },
    'Greatest Allrounder - +35 all stats', 'Sobers', 1968,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: true }),

    // Sir Jack Hobbs
    createCard(375, 'Jack Hobbs', 'batsman', 'England', '', 'legendary',
    { batting: 96, bowling: 10, fielding: 70, leadership: 75, consistency: 98, popularity: 92 },
    'Master Batsman - +25 in Tests', 'Hobbs', 1928,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // Sir Len Hutton
    createCard(376, 'Len Hutton', 'batsman', 'England', '', 'legendary',
    { batting: 94, bowling: 15, fielding: 72, leadership: 88, consistency: 96, popularity: 88 },
    'Hutton Record - +20 in Tests', 'Hutton', 1938,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // ==================== MORE CURRENT T20 SPECIALISTS ====================

    // Sikandar Raza
    createCard(377, 'Sikandar Raza', 'allrounder', 'Zimbabwe', '', 'epic',
    { batting: 86, bowling: 84, fielding: 82, leadership: 85, consistency: 88, popularity: 86 },
    'Raza Magic - +20 all-round', 'Raza', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

    // Blessing Muzarabani
    createCard(378, 'Blessing Muzarabani', 'bowler', 'Zimbabwe', '', 'rare',
    { batting: 15, bowling: 84, fielding: 72, leadership: 65, consistency: 82, popularity: 76 },
    'Tall Bounce - +15 height advantage', 'Muzarabani', 2021,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // ==================== ULTIMATE GOAT CARDS ====================

    // Sachin Tendulkar - Ultimate GOAT
    createCard(379, 'Sachin Tendulkar', 'batsman', 'India', '', 'mythic',
    { batting: 100, bowling: 35, fielding: 85, leadership: 92, consistency: 99, popularity: 100 },
    'God of Cricket - +40 all batting records', 'Sachin', 2010,
    { worldCupWinner: true, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: true }),

    // Don Bradman - Ultimate
    createCard(380, 'Don Bradman', 'batsman', 'Australia', '', 'mythic',
    { batting: 100, bowling: 25, fielding: 80, leadership: 92, consistency: 100, popularity: 100 },
    'The Greatest - +45 batting average', 'Bradman', 1934,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // MS Dhoni - Ultimate Finisher
    createCard(381, 'MS Dhoni', 'wicketkeeper', 'India', 'Chennai Super Kings', 'mythic',
    { batting: 94, bowling: 12, fielding: 96, leadership: 100, consistency: 98, popularity: 100 },
    'Captain Cool Ultimate - +35 in finals', 'Dhoni', 2011,
    { worldCupWinner: true, iplCaptain: true, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: true }),

    // Virat Kohli - Ultimate Chase Master
    createCard(382, 'Virat Kohli', 'batsman', 'India', 'Royal Challengers Bangalore', 'mythic',
    { batting: 99, bowling: 30, fielding: 92, leadership: 94, consistency: 100, popularity: 100 },
    'King of Chases Ultimate - +40 when chasing', 'Kohli', 2023,
    { worldCupWinner: true, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: true }),

    // ==================== FINAL BATCH - MORE WORLD CUP HEROES ====================

    // Aravinda de Silva
    createCard(383, 'Aravinda de Silva', 'batsman', 'Sri Lanka', '', 'legendary',
    { batting: 94, bowling: 65, fielding: 85, leadership: 82, consistency: 92, popularity: 94 },
    '1996 WC Final Hero - +30 in finals', 'de Silva', 1996,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // Arjuna Ranatunga
    createCard(384, 'Arjuna Ranatunga', 'batsman', 'Sri Lanka', '', 'legendary',
    { batting: 88, bowling: 40, fielding: 70, leadership: 96, consistency: 88, popularity: 92 },
    'Captain Cool 1996 - +25 leadership', 'Ranatunga', 1996,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // Imran Khan - Ultimate Captain
    createCard(385, 'Imran Khan', 'allrounder', 'Pakistan', '', 'mythic',
    { batting: 90, bowling: 98, fielding: 82, leadership: 100, consistency: 96, popularity: 98 },
    '1992 Captain Ultimate - +40 leadership', 'Imran', 1992,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: true }),

    // Wasim Akram - Sultan of Swing Ultimate
    createCard(386, 'Wasim Akram', 'bowler', 'Pakistan', 'Kolkata Knight Riders', 'mythic',
    { batting: 52, bowling: 100, fielding: 82, leadership: 94, consistency: 98, popularity: 100 },
    'Sultan of Swing Ultimate - +40 swing bowling', 'Wasim', 1992,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: true }),

    // Waqar Younis - Ultimate Destroyer
    createCard(387, 'Waqar Younis', 'bowler', 'Pakistan', '', 'mythic',
    { batting: 20, bowling: 99, fielding: 75, leadership: 85, consistency: 96, popularity: 98 },
    'Ultimate Destroyer - +40 yorker', 'Waqar', 1996,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: true }),

    // ==================== RASHID KHAN - ULTIMATE SPIN ====================
    createCard(388, 'Rashid Khan', 'bowler', 'Afghanistan', 'Gujarat Titans', 'mythic',
    { batting: 65, bowling: 98, fielding: 85, leadership: 82, consistency: 94, popularity: 96 },
    'Ultimate Legspin - +30 googly', 'Rashid', 2020,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // ==================== COMPLETING TO ID 399 ====================

    // Kane Williamson - Ultimate
    createCard(389, 'Kane Williamson', 'batsman', 'New Zealand', 'Sunrisers Hyderabad', 'mythic',
    { batting: 97, bowling: 32, fielding: 90, leadership: 98, consistency: 99, popularity: 96 },
    'Ultimate Nice Guy - +30 in chases', 'Williamson', 2018,
    { worldCupWinner: false, iplCaptain: true, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // Joe Root - Ultimate
    createCard(390, 'Joe Root', 'batsman', 'England', '', 'mythic',
    { batting: 98, bowling: 38, fielding: 88, leadership: 92, consistency: 99, popularity: 96 },
    'Ultimate Run Machine - +30 in Tests', 'Root', 2021,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // Ben Stokes - Ultimate
    createCard(391, 'Ben Stokes', 'allrounder', 'England', '', 'mythic',
    { batting: 96, bowling: 94, fielding: 94, leadership: 98, consistency: 96, popularity: 100 },
    'Ultimate Finisher - +40 in pressure', 'Stokes', 2019,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: true }),

    // Jasprit Bumrah - Ultimate
    createCard(392, 'Jasprit Bumrah', 'bowler', 'India', 'Mumbai Indians', 'mythic',
    { batting: 25, bowling: 100, fielding: 88, leadership: 78, consistency: 98, popularity: 98 },
    'Ultimate Yorker King - +35 in death', 'Bumrah', 2020,
    { worldCupWinner: true, iplCaptain: false, indianLegend: true, fastBowler: true, allRounder: false, goatEdition: true }),

    // Pat Cummins - Ultimate
    createCard(393, 'Pat Cummins', 'bowler', 'Australia', '', 'mythic',
    { batting: 42, bowling: 98, fielding: 90, leadership: 98, consistency: 96, popularity: 96 },
    'Ultimate Captain Leader - +30 as captain', 'Cummins', 2023,
    { worldCupWinner: true, iplCaptain: true, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: true }),

    // Travis Head - Ultimate
    createCard(394, 'Travis Head', 'batsman', 'Australia', '', 'mythic',
    { batting: 96, bowling: 45, fielding: 88, leadership: 85, consistency: 94, popularity: 96 },
    'Ultimate WC Hero - +35 in finals', 'Head', 2023,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // David Warner - Ultimate
    createCard(395, 'David Warner', 'batsman', 'Australia', '', 'mythic',
    { batting: 98, bowling: 12, fielding: 90, leadership: 92, consistency: 94, popularity: 100 },
    'Ultimate Pocket Rocket - +30 in powerplay', 'Warner', 2019,
    { worldCupWinner: true, iplCaptain: true, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // Glenn Maxwell - Ultimate
    createCard(396, 'Glenn Maxwell', 'allrounder', 'Australia', 'Royal Challengers Bangalore', 'mythic',
    { batting: 96, bowling: 85, fielding: 92, leadership: 88, consistency: 88, popularity: 100 },
    'Ultimate Show - +35 against spin', 'Maxwell', 2023,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: true }),

    // AB de Villiers - Ultimate
    createCard(397, 'AB de Villiers', 'batsman', 'South Africa', 'Royal Challengers Bangalore', 'mythic',
    { batting: 100, bowling: 28, fielding: 98, leadership: 90, consistency: 98, popularity: 100 },
    'Ultimate 360 - +40 innovative shots', 'ABD', 2015,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // Chris Gayle - Ultimate
    createCard(398, 'Chris Gayle', 'batsman', 'West Indies', '', 'mythic',
    { batting: 99, bowling: 35, fielding: 75, leadership: 85, consistency: 90, popularity: 100 },
    'Ultimate Universe Boss - +45 power hitting', 'Gayle', 2015,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // Shakib Al Hasan - Ultimate
    createCard(399, 'Shakib Al Hasan', 'allrounder', 'Bangladesh', '', 'mythic',
    { batting: 94, bowling: 96, fielding: 92, leadership: 96, consistency: 98, popularity: 98 },
    'Ultimate Allrounder - +35 both stats', 'Shakib', 2019,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: true }),

    // ==================== IDs 400-449: MAJOR MISSING INDIAN LEGENDS ====================

    // Suresh Raina - Mr IPL (Most Critical Missing)
    createCard(400, 'Suresh Raina', 'batsman', 'India', 'Chennai Super Kings', 'mythic',
    { batting: 94, bowling: 72, fielding: 95, leadership: 88, consistency: 90, popularity: 98 },
    'Mr IPL - +30 in IPL matches', 'Raina', 2014,
    { worldCupWinner: true, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: true, goatEdition: true }),

    createCard(401, 'Suresh Raina', 'batsman', 'India', 'Chennai Super Kings', 'legendary',
    { batting: 92, bowling: 70, fielding: 93, leadership: 85, consistency: 88, popularity: 96 },
    'Playoff Specialist - +25 in knockout matches', 'Raina', 2011,
    { worldCupWinner: true, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: true, goatEdition: false }),

    createCard(402, 'Suresh Raina', 'batsman', 'India', 'Chennai Super Kings', 'epic',
    { batting: 88, bowling: 68, fielding: 90, leadership: 80, consistency: 86, popularity: 92 },
    'First IPL Century - +20 in T20s', 'Raina', 2008,
    { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: true, goatEdition: false }),

    // Mohammad Azharuddin
    createCard(403, 'Mohammad Azharuddin', 'batsman', 'India', '', 'legendary',
    { batting: 94, bowling: 20, fielding: 92, leadership: 88, consistency: 92, popularity: 96 },
    'Wristy Wonder - +25 wrist work', 'Azhar', 1990,
    { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: true }),

    createCard(404, 'Mohammad Azharuddin', 'batsman', 'India', '', 'epic',
    { batting: 91, bowling: 18, fielding: 90, leadership: 85, consistency: 90, popularity: 94 },
    'Three Centuries in Three Tests - +20 against England', 'Azhar', 1984,
    { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: false }),

    // Vijay Hazare
    createCard(405, 'Vijay Hazare', 'batsman', 'India', '', 'legendary',
    { batting: 95, bowling: 75, fielding: 80, leadership: 85, consistency: 96, popularity: 90 },
    'First Indian Triple Centurion - +25 in Ranji', 'Hazare', 1950,
    { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: true, goatEdition: true }),

    // Polly Umrigar
    createCard(406, 'Polly Umrigar', 'batsman', 'India', '', 'legendary',
    { batting: 92, bowling: 70, fielding: 78, leadership: 88, consistency: 93, popularity: 88 },
    'Indian Batting Great - +20 in Tests', 'Umrigar', 1955,
    { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: true, goatEdition: true }),

    // Mansoor Ali Khan Pataudi - Tiger Pataudi
    createCard(407, 'Mansoor Pataudi', 'batsman', 'India', '', 'legendary',
    { batting: 90, bowling: 10, fielding: 85, leadership: 98, consistency: 88, popularity: 94 },
    'Tiger Pataudi - +30 leadership as captain', 'Pataudi', 1964,
    { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: true }),

    // Erapalli Prasanna - Spin Quartet
    createCard(408, 'Erapalli Prasanna', 'bowler', 'India', '', 'legendary',
    { batting: 25, bowling: 95, fielding: 70, leadership: 82, consistency: 94, popularity: 88 },
    'Spin Wizard - +25 off-spin variations', 'Prasanna', 1968,
    { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: true }),

    // Bhagwat Chandrasekhar
    createCard(409, 'Bhagwat Chandrasekhar', 'bowler', 'India', '', 'legendary',
    { batting: 15, bowling: 96, fielding: 68, leadership: 75, consistency: 90, popularity: 90 },
    'Leg Spin Genius - +30 googly', 'Chandra', 1971,
    { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: true }),

    // Srinivas Venkataraghavan
    createCard(410, 'Srinivas Venkataraghavan', 'bowler', 'India', '', 'epic',
    { batting: 25, bowling: 90, fielding: 75, leadership: 85, consistency: 92, popularity: 84 },
    'Spin Quartet Member - +15 off-spin', 'Venkat', 1969,
    { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: false }),

    // Farokh Engineer
    createCard(411, 'Farokh Engineer', 'wicketkeeper', 'India', '', 'legendary',
    { batting: 86, bowling: 5, fielding: 90, leadership: 75, consistency: 88, popularity: 88 },
    'Dashing Keeper - +20 aggressive batting', 'Engineer', 1967,
    { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: true }),

    // Syed Kirmani
    createCard(412, 'Syed Kirmani', 'wicketkeeper', 'India', '', 'legendary',
    { batting: 78, bowling: 5, fielding: 94, leadership: 80, consistency: 92, popularity: 88 },
    '1983 WC Hero - +25 wicketkeeping', 'Kirmani', 1983,
    { worldCupWinner: true, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: false }),

    // Roger Binny
    createCard(413, 'Roger Binny', 'allrounder', 'India', '', 'epic',
    { batting: 72, bowling: 88, fielding: 80, leadership: 75, consistency: 86, popularity: 86 },
    '1983 WC Most Wickets - +20 in World Cups', 'Binny', 1983,
    { worldCupWinner: true, iplCaptain: false, indianLegend: true, fastBowler: true, allRounder: true, goatEdition: false }),

    // Karsan Ghavri
    createCard(414, 'Karsan Ghavri', 'bowler', 'India', '', 'epic',
    { batting: 45, bowling: 86, fielding: 75, leadership: 70, consistency: 84, popularity: 82 },
    'Left Arm Pacer - +15 swing', 'Ghavri', 1978,
    { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: true, allRounder: true, goatEdition: false }),

    // Madan Lal
    createCard(415, 'Madan Lal', 'allrounder', 'India', '', 'epic',
    { batting: 65, bowling: 85, fielding: 78, leadership: 72, consistency: 84, popularity: 84 },
    '1983 WC Final Hero - +20 in finals', 'Madan Lal', 1983,
    { worldCupWinner: true, iplCaptain: false, indianLegend: true, fastBowler: true, allRounder: true, goatEdition: false }),

    // Balwinder Sandhu
    createCard(416, 'Balwinder Sandhu', 'bowler', 'India', '', 'rare',
    { batting: 20, bowling: 84, fielding: 70, leadership: 65, consistency: 80, popularity: 80 },
    '1983 WC Hero - +15 important wicket', 'Sandhu', 1983,
    { worldCupWinner: true, iplCaptain: false, indianLegend: true, fastBowler: true, allRounder: false, goatEdition: false }),

    // Salim Durani
    createCard(417, 'Salim Durani', 'allrounder', 'India', '', 'legendary',
    { batting: 86, bowling: 84, fielding: 80, leadership: 75, consistency: 88, popularity: 88 },
    'Handsome Allrounder - +20 six hitting', 'Durani', 1962,
    { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: true, goatEdition: true }),

    // ==================== IDs 450-479: SPIN QUARTET COMPLETE & MORE INDIANS ====================

    // Bishan Singh Bedi
    createCard(418, 'Bishan Singh Bedi', 'bowler', 'India', '', 'mythic',
    { batting: 25, bowling: 97, fielding: 75, leadership: 92, consistency: 96, popularity: 94 },
    'Spin Quartet Captain - +25 left-arm spin', 'Bedi', 1976,
    { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: true }),

    // Dilip Vengsarkar
    createCard(419, 'Dilip Vengsarkar', 'batsman', 'India', '', 'legendary',
    { batting: 93, bowling: 15, fielding: 75, leadership: 82, consistency: 94, popularity: 90 },
    'Three Hundreds at Lord\'s - +25 in England', 'Vengsarkar', 1986,
    { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: true }),

    // Gundappa Viswanath
    createCard(420, 'Gundappa Viswanath', 'batsman', 'India', '', 'legendary',
    { batting: 94, bowling: 15, fielding: 80, leadership: 75, consistency: 95, popularity: 92 },
    'Elegant Wrist Work - +20 against pace', 'Vishy', 1974,
    { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: true }),

    // Budhi Kunderan
    createCard(421, 'Budhi Kunderan', 'wicketkeeper', 'India', '', 'epic',
    { batting: 84, bowling: 5, fielding: 85, leadership: 68, consistency: 82, popularity: 82 },
    'Keeper Batsman Pioneer - +15 aggressive', 'Kunderan', 1963,
    { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: false }),

    // Nari Contractor
    createCard(422, 'Nari Contractor', 'batsman', 'India', '', 'epic',
    { batting: 88, bowling: 10, fielding: 75, leadership: 86, consistency: 90, popularity: 84 },
    'Brave Captain - +15 opening', 'Contractor', 1960,
    { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: false }),

    // Chandu Borde
    createCard(423, 'Chandu Borde', 'allrounder', 'India', '', 'epic',
    { batting: 84, bowling: 78, fielding: 75, leadership: 80, consistency: 86, popularity: 84 },
    'Versatile Allrounder - +15 both', 'Borde', 1965,
    { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: true, goatEdition: false }),

    // ==================== IDs 480-509: WEST INDIES 3Ws & PACE PIONEERS ====================

    // Frank Worrell
    createCard(424, 'Frank Worrell', 'batsman', 'West Indies', '', 'mythic',
    { batting: 94, bowling: 75, fielding: 85, leadership: 99, consistency: 96, popularity: 94 },
    'Legendary Captain - +30 leadership', 'Worrell', 1963,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: true }),

    // Clyde Walcott
    createCard(425, 'Clyde Walcott', 'batsman', 'West Indies', '', 'mythic',
    { batting: 96, bowling: 10, fielding: 85, leadership: 80, consistency: 95, popularity: 94 },
    '3Ws Legend - +25 batting average', 'Walcott', 1955,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // Everton Weekes
    createCard(426, 'Everton Weekes', 'batsman', 'West Indies', '', 'mythic',
    { batting: 96, bowling: 10, fielding: 82, leadership: 75, consistency: 96, popularity: 94 },
    'Five Consecutive Centuries - +30 consistency', 'Weekes', 1949,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // George Headley
    createCard(427, 'George Headley', 'batsman', 'West Indies', '', 'mythic',
    { batting: 97, bowling: 20, fielding: 78, leadership: 85, consistency: 97, popularity: 94 },
    'Black Bradman - +30 in Tests', 'Headley', 1939,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // Andy Roberts
    createCard(428, 'Andy Roberts', 'bowler', 'West Indies', '', 'legendary',
    { batting: 25, bowling: 96, fielding: 75, leadership: 82, consistency: 94, popularity: 92 },
    'Pace Pioneer - +25 fast bowling', 'Roberts', 1976,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: true }),

    // Colin Croft
    createCard(429, 'Colin Croft', 'bowler', 'West Indies', '', 'legendary',
    { batting: 15, bowling: 94, fielding: 72, leadership: 70, consistency: 92, popularity: 90 },
    'Hostile Pace - +20 bounce', 'Croft', 1978,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // Sylvester Clarke
    createCard(430, 'Sylvester Clarke', 'bowler', 'West Indies', '', 'legendary',
    { batting: 20, bowling: 95, fielding: 70, leadership: 68, consistency: 90, popularity: 88 },
    'Fearsome Pacer - +25 aggression', 'Clarke', 1980,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: true }),

    // Lance Gibbs
    createCard(431, 'Lance Gibbs', 'bowler', 'West Indies', '', 'legendary',
    { batting: 15, bowling: 94, fielding: 70, leadership: 75, consistency: 95, popularity: 88 },
    'Off-spin Pioneer - +20 spin', 'Gibbs', 1964,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // Rohan Kanhai
    createCard(432, 'Rohan Kanhai', 'batsman', 'West Indies', '', 'legendary',
    { batting: 93, bowling: 15, fielding: 85, leadership: 82, consistency: 90, popularity: 90 },
    'Inventive Batsman - +20 innovative shots', 'Kanhai', 1965,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // Alvin Kallicharran
    createCard(433, 'Alvin Kallicharran', 'batsman', 'West Indies', '', 'epic',
    { batting: 90, bowling: 45, fielding: 80, leadership: 70, consistency: 88, popularity: 86 },
    'Elegant Leftie - +15 against spin', 'Kallicharran', 1974,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Roy Fredericks
    createCard(434, 'Roy Fredericks', 'batsman', 'West Indies', '', 'epic',
    { batting: 89, bowling: 10, fielding: 78, leadership: 68, consistency: 84, popularity: 86 },
    'Attacking Opener - +20 in powerplay', 'Fredericks', 1975,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // ==================== IDs 510-539: AUSTRALIAN GOLDEN ERA LEGENDS ====================

    // Keith Miller
    createCard(435, 'Keith Miller', 'allrounder', 'Australia', '', 'mythic',
    { batting: 90, bowling: 94, fielding: 85, leadership: 92, consistency: 94, popularity: 96 },
    'Nugget - +30 both stats', 'Miller', 1950,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: true }),

    // Ray Lindwall
    createCard(436, 'Ray Lindwall', 'bowler', 'Australia', '', 'mythic',
    { batting: 45, bowling: 97, fielding: 78, leadership: 80, consistency: 95, popularity: 94 },
    'Pace Bowling Pioneer - +25 swing', 'Lindwall', 1948,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: true }),

    // Bill O'Reilly
    createCard(437, 'Bill O\'Reilly', 'bowler', 'Australia', '', 'mythic',
    { batting: 25, bowling: 98, fielding: 70, leadership: 82, consistency: 97, popularity: 92 },
    'Tiger O\'Reilly - +30 leg spin', 'O\'Reilly', 1936,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // Neil Harvey
    createCard(438, 'Neil Harvey', 'batsman', 'Australia', '', 'legendary',
    { batting: 95, bowling: 10, fielding: 85, leadership: 75, consistency: 94, popularity: 90 },
    'Left Hand Great - +20 in Tests', 'Harvey', 1955,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // Arthur Morris
    createCard(439, 'Arthur Morris', 'batsman', 'Australia', '', 'legendary',
    { batting: 93, bowling: 10, fielding: 80, leadership: 70, consistency: 94, popularity: 88 },
    'Opening Great - +20 in Ashes', 'Morris', 1948,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // Lindsay Hassett
    createCard(440, 'Lindsay Hassett', 'batsman', 'Australia', '', 'legendary',
    { batting: 92, bowling: 15, fielding: 82, leadership: 88, consistency: 93, popularity: 88 },
    'Elegant Batting - +15 in chases', 'Hassett', 1949,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Stan McCabe
    createCard(441, 'Stan McCabe', 'batsman', 'Australia', '', 'legendary',
    { batting: 94, bowling: 45, fielding: 80, leadership: 70, consistency: 92, popularity: 88 },
    'Depression Era Hero - +25 in pressure', 'McCabe', 1938,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: true }),

    // ==================== IDs 540-569: SOUTH AFRICA BANNED ERA GREATS ====================

    // Graeme Pollock
    createCard(442, 'Graeme Pollock', 'batsman', 'South Africa', '', 'mythic',
    { batting: 98, bowling: 45, fielding: 80, leadership: 75, consistency: 97, popularity: 94 },
    'Left Hand Genius - +35 batting average', 'Pollock', 1970,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: true }),

    // Barry Richards
    createCard(443, 'Barry Richards', 'batsman', 'South Africa', '', 'mythic',
    { batting: 97, bowling: 20, fielding: 85, leadership: 70, consistency: 96, popularity: 94 },
    'World Class Opener - +30 in all conditions', 'Richards', 1970,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // Mike Procter
    createCard(444, 'Mike Procter', 'allrounder', 'South Africa', '', 'mythic',
    { batting: 88, bowling: 96, fielding: 85, leadership: 82, consistency: 94, popularity: 94 },
    'Procter Express - +30 all-round', 'Procter', 1972,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: true }),

    // Clive Rice
    createCard(445, 'Clive Rice', 'allrounder', 'South Africa', '', 'legendary',
    { batting: 90, bowling: 88, fielding: 82, leadership: 94, consistency: 92, popularity: 92 },
    'Captain Fantastic - +25 leadership', 'Rice', 1980,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: true }),

    // Eddie Barlow
    createCard(446, 'Eddie Barlow', 'allrounder', 'South Africa', '', 'epic',
    { batting: 84, bowling: 86, fielding: 80, leadership: 85, consistency: 88, popularity: 86 },
    'Aggressive Allrounder - +15 both', 'Barlow', 1965,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: false }),

    // Peter Pollock
    createCard(447, 'Peter Pollock', 'bowler', 'South Africa', '', 'legendary',
    { batting: 35, bowling: 92, fielding: 75, leadership: 70, consistency: 90, popularity: 86 },
    'Fast Bowling Great - +20 pace', 'Pollock', 1965,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: true }),

    // ==================== IDs 570-599: ENGLAND LEGENDS MISSING ====================

    // Colin Cowdrey
    createCard(448, 'Colin Cowdrey', 'batsman', 'England', '', 'legendary',
    { batting: 94, bowling: 35, fielding: 80, leadership: 90, consistency: 94, popularity: 90 },
    'England Great - +20 in Ashes', 'Cowdrey', 1964,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // John Snow
    createCard(449, 'John Snow', 'bowler', 'England', '', 'legendary',
    { batting: 25, bowling: 94, fielding: 75, leadership: 70, consistency: 90, popularity: 88 },
    'Fiery Pacer - +25 hostile bowling', 'Snow', 1971,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: true }),

    // Hedley Verity
    createCard(450, 'Hedley Verity', 'bowler', 'England', '', 'legendary',
    { batting: 20, bowling: 95, fielding: 70, leadership: 75, consistency: 96, popularity: 88 },
    '8/43 Masterclass - +30 spin', 'Verity', 1934,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // Maurice Tate
    createCard(451, 'Maurice Tate', 'allrounder', 'England', '', 'legendary',
    { batting: 75, bowling: 92, fielding: 78, leadership: 72, consistency: 90, popularity: 86 },
    'Pioneer Allrounder - +20 both', 'Tate', 1925,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: true }),

    // Denis Compton
    createCard(452, 'Denis Compton', 'batsman', 'England', '', 'legendary',
    { batting: 94, bowling: 60, fielding: 85, leadership: 70, consistency: 90, popularity: 92 },
    'Swashbuckler - +25 style', 'Compton', 1947,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: true }),

    // Len Hutton - Already added, adding another version
    createCard(453, 'Len Hutton', 'batsman', 'England', '', 'mythic',
    { batting: 96, bowling: 15, fielding: 75, leadership: 88, consistency: 98, popularity: 92 },
    'First Professional Captain - +25 in Ashes', 'Hutton', 1954,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // ==================== IDs 600-629: CURRENT STARS UPGRADES (NEEDED HIGHER RARITY) ====================

    // Rishabh Pant - Upgraded to Legendary
    createCard(454, 'Rishabh Pant', 'wicketkeeper', 'India', 'Delhi Capitals', 'legendary',
    { batting: 90, bowling: 5, fielding: 88, leadership: 85, consistency: 86, popularity: 94 },
    'Match Winner - +25 in chases', 'Pant', 2022,
    { worldCupWinner: false, iplCaptain: true, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: false }),

    // Rishabh Pant - Mythic Ultimate
    createCard(455, 'Rishabh Pant', 'wicketkeeper', 'India', 'Delhi Capitals', 'mythic',
    { batting: 94, bowling: 5, fielding: 90, leadership: 88, consistency: 90, popularity: 98 },
    'Comeback King - +30 in pressure', 'Pant', 2024,
    { worldCupWinner: false, iplCaptain: true, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: true }),

    // Shubman Gill - Legendary
    createCard(456, 'Shubman Gill', 'batsman', 'India', 'Gujarat Titans', 'legendary',
    { batting: 95, bowling: 5, fielding: 90, leadership: 82, consistency: 94, popularity: 96 },
    'Prince of World Cricket - +25 in ODIs', 'Gill', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Shubman Gill - Mythic
    createCard(457, 'Shubman Gill', 'batsman', 'India', 'Gujarat Titans', 'mythic',
    { batting: 97, bowling: 5, fielding: 92, leadership: 85, consistency: 96, popularity: 98 },
    'Future GOAT - +30 in ICC tournaments', 'Gill', 2024,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // Suryakumar Yadav - Legendary
    createCard(458, 'Suryakumar Yadav', 'batsman', 'India', 'Mumbai Indians', 'legendary',
    { batting: 94, bowling: 12, fielding: 94, leadership: 80, consistency: 90, popularity: 96 },
    'SKY Master - +25 in T20s', 'SKY', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Suryakumar Yadav - Mythic
    createCard(459, 'Suryakumar Yadav', 'batsman', 'India', 'Mumbai Indians', 'mythic',
    { batting: 96, bowling: 15, fielding: 96, leadership: 82, consistency: 92, popularity: 100 },
    'World No.1 T20 - +30 360 shots', 'SKY', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // Hardik Pandya - Legendary
    createCard(460, 'Hardik Pandya', 'allrounder', 'India', 'Mumbai Indians', 'legendary',
    { batting: 90, bowling: 88, fielding: 92, leadership: 90, consistency: 86, popularity: 96 },
    'Pandya Power - +25 in death overs', 'Hardik', 2022,
    { worldCupWinner: true, iplCaptain: true, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: false }),

    // Hardik Pandya - Mythic
    createCard(461, 'Hardik Pandya', 'allrounder', 'India', 'Mumbai Indians', 'mythic',
    { batting: 92, bowling: 90, fielding: 94, leadership: 92, consistency: 90, popularity: 98 },
    'Captain Hardik - +30 as captain', 'Hardik', 2023,
    { worldCupWinner: true, iplCaptain: true, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: true }),

    // KL Rahul - Legendary
    createCard(462, 'KL Rahul', 'wicketkeeper', 'India', 'Lucknow Super Giants', 'legendary',
    { batting: 92, bowling: 5, fielding: 88, leadership: 86, consistency: 90, popularity: 92 },
    'Elegant Opener - +20 in ODIs', 'Rahul', 2019,
    { worldCupWinner: false, iplCaptain: true, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Ravindra Jadeja - Legendary
    createCard(463, 'Ravindra Jadeja', 'allrounder', 'India', 'Chennai Super Kings', 'legendary',
    { batting: 86, bowling: 92, fielding: 96, leadership: 85, consistency: 92, popularity: 94 },
    'Sir Jadeja Ultimate - +25 fielding', 'Jadeja', 2021,
    { worldCupWinner: true, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: true, goatEdition: false }),

    // Mohammed Siraj - Epic (upgraded from rare)
    createCard(464, 'Mohammed Siraj', 'bowler', 'India', 'Royal Challengers Bangalore', 'epic',
    { batting: 15, bowling: 92, fielding: 80, leadership: 72, consistency: 90, popularity: 88 },
    'Miyan Magic - +20 in Tests', 'Siraj', 2021,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // Mohammed Siraj - Legendary
    createCard(465, 'Mohammed Siraj', 'bowler', 'India', 'Royal Challengers Bangalore', 'legendary',
    { batting: 18, bowling: 94, fielding: 82, leadership: 75, consistency: 92, popularity: 92 },
    'Asia Cup Hero - +25 in ICC events', 'Siraj', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // Sanju Samson - Epic
    createCard(466, 'Sanju Samson', 'wicketkeeper', 'India', 'Rajasthan Royals', 'epic',
    { batting: 86, bowling: 5, fielding: 88, leadership: 85, consistency: 82, popularity: 86 },
    'Talent Unmatched - +15 in T20s', 'Samson', 2021,
    { worldCupWinner: false, iplCaptain: true, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Ishan Kishan - Rare (upgraded from common)
    createCard(467, 'Ishan Kishan', 'wicketkeeper', 'India', 'Mumbai Indians', 'rare',
    { batting: 84, bowling: 5, fielding: 84, leadership: 70, consistency: 78, popularity: 84 },
    'Powerplay Assault - +20 in powerplay', 'Kishan', 2021,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Ruturaj Gaikwad - Epic
    createCard(468, 'Ruturaj Gaikwad', 'batsman', 'India', 'Chennai Super Kings', 'epic',
    { batting: 86, bowling: 5, fielding: 82, leadership: 72, consistency: 86, popularity: 86 },
    'Orange Cap Winner - +20 in IPL', 'Gaikwad', 2021,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Tilak Varma - Rare
    createCard(469, 'Tilak Varma', 'batsman', 'India', 'Mumbai Indians', 'rare',
    { batting: 82, bowling: 5, fielding: 80, leadership: 68, consistency: 80, popularity: 82 },
    'Future Star - +15 in middle overs', 'Tilak', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // ==================== IDs 630-649: IPL SPECIALISTS MISSING ====================

    // Robin Uthappa
    createCard(470, 'Robin Uthappa', 'wicketkeeper', 'India', 'Kolkata Knight Riders', 'epic',
    { batting: 86, bowling: 5, fielding: 82, leadership: 70, consistency: 84, popularity: 88 },
    'IPL Legend - +20 in IPL', 'Uthappa', 2014,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Piyush Chawla
    createCard(471, 'Piyush Chawla', 'bowler', 'India', 'Kolkata Knight Riders', 'epic',
    { batting: 35, bowling: 86, fielding: 75, leadership: 70, consistency: 84, popularity: 84 },
    'IPL Leg-spinner - +15 wicket-taking', 'Chawla', 2014,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Amit Mishra
    createCard(472, 'Amit Mishra', 'bowler', 'India', 'Delhi Capitals', 'epic',
    { batting: 25, bowling: 88, fielding: 70, leadership: 68, consistency: 86, popularity: 86 },
    'Hat-trick Specialist - +20 googly', 'Mishra', 2013,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Pragyan Ojha
    createCard(473, 'Pragyan Ojha', 'bowler', 'India', 'Mumbai Indians', 'rare',
    { batting: 20, bowling: 84, fielding: 72, leadership: 65, consistency: 84, popularity: 80 },
    'Left-arm Spin - +15 in Tests', 'Ojha', 2010,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Iqbal Abdulla
    createCard(474, 'Iqbal Abdulla', 'allrounder', 'India', 'Kolkata Knight Riders', 'common',
    { batting: 55, bowling: 78, fielding: 70, leadership: 62, consistency: 78, popularity: 72 },
    'IPL Utility - +10 both', 'Abdulla', 2011,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

    // ==================== IDs 650-669: ASSOCIATE NATIONS STARS ====================

    // Steve Tikolo
    createCard(475, 'Steve Tikolo', 'batsman', 'Kenya', '', 'legendary',
    { batting: 88, bowling: 78, fielding: 80, leadership: 90, consistency: 88, popularity: 88 },
    'Kenyan Legend - +20 in World Cups', 'Tikolo', 2003,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: true }),

    // Collins Obuya
    createCard(476, 'Collins Obuya', 'allrounder', 'Kenya', '', 'epic',
    { batting: 76, bowling: 84, fielding: 75, leadership: 70, consistency: 82, popularity: 78 },
    '2003 WC Hero - +15 leg spin', 'Obuya', 2003,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

    // Thomas Odoyo
    createCard(477, 'Thomas Odoyo', 'allrounder', 'Kenya', '', 'epic',
    { batting: 72, bowling: 84, fielding: 78, leadership: 75, consistency: 82, popularity: 76 },
    'Kenyan Allrounder - +15 both', 'Odoyo', 2003,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: false }),

    // Bas de Leede
    createCard(478, 'Bas de Leede', 'allrounder', 'Netherlands', '', 'epic',
    { batting: 80, bowling: 80, fielding: 78, leadership: 72, consistency: 82, popularity: 80 },
    'Dutch Hero - +20 in World Cups', 'de Leede', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

    // Logan van Beek
    createCard(479, 'Logan van Beek', 'allrounder', 'Netherlands', '', 'rare',
    { batting: 72, bowling: 78, fielding: 75, leadership: 70, consistency: 78, popularity: 74 },
    'Super Over Hero - +15 in pressure', 'van Beek', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: false }),

    // Roelof van der Merwe
    createCard(480, 'Roelof van der Merwe', 'allrounder', 'Netherlands', '', 'epic',
    { batting: 65, bowling: 84, fielding: 78, leadership: 72, consistency: 82, popularity: 78 },
    'Experienced Spinner - +15 variations', 'Merwe', 2021,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

    // Kyle Coetzer
    createCard(481, 'Kyle Coetzer', 'batsman', 'Scotland', '', 'epic',
    { batting: 84, bowling: 10, fielding: 75, leadership: 85, consistency: 84, popularity: 80 },
    'Scottish Great - +15 in ODIs', 'Coetzer', 2018,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Richie Berrington
    createCard(482, 'Richie Berrington', 'allrounder', 'Scotland', '', 'epic',
    { batting: 82, bowling: 78, fielding: 80, leadership: 82, consistency: 82, popularity: 78 },
    'Scotland Star - +15 both', 'Berrington', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

    // Josh Davey
    createCard(483, 'Josh Davey', 'bowler', 'Scotland', '', 'rare',
    { batting: 35, bowling: 84, fielding: 72, leadership: 65, consistency: 80, popularity: 72 },
    'Swing Bowler - +15 in powerplay', 'Davey', 2015,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // ==================== IDs 670-699: MORE CURRENT INTERNATIONAL STARS ====================

    // Shakib Al Hasan - Ultimate Mythic
    createCard(484, 'Shakib Al Hasan', 'allrounder', 'Bangladesh', 'Kolkata Knight Riders', 'mythic',
    { batting: 96, bowling: 96, fielding: 94, leadership: 96, consistency: 98, popularity: 98 },
    'Ultimate Allrounder - +40 both stats', 'Shakib', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: true }),

    // Rashid Khan - Ultimate Mythic
    createCard(485, 'Rashid Khan', 'bowler', 'Afghanistan', 'Gujarat Titans', 'mythic',
    { batting: 68, bowling: 99, fielding: 88, leadership: 85, consistency: 96, popularity: 98 },
    'Ultimate Legspinner - +35 googly', 'Rashid', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // Mujeeb Ur Rahman - Legendary
    createCard(486, 'Mujeeb Ur Rahman', 'bowler', 'Afghanistan', 'Sunrisers Hyderabad', 'legendary',
    { batting: 20, bowling: 92, fielding: 78, leadership: 72, consistency: 88, popularity: 88 },
    'Mystery Spinner - +25 carrom ball', 'Mujeeb', 2018,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Mujeeb - Ultimate
    createCard(487, 'Mujeeb Ur Rahman', 'bowler', 'Afghanistan', '', 'mythic',
    { batting: 22, bowling: 95, fielding: 80, leadership: 75, consistency: 92, popularity: 92 },
    'Ultimate Mystery - +30 variations', 'Mujeeb', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // Rahmanullah Gurbaz - Legendary
    createCard(488, 'Rahmanullah Gurbaz', 'wicketkeeper', 'Afghanistan', 'Kolkata Knight Riders', 'legendary',
    { batting: 90, bowling: 5, fielding: 86, leadership: 72, consistency: 82, popularity: 90 },
    'Afghan Power - +25 in powerplay', 'Gurbaz', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Ibrahim Zadran - Epic
    createCard(489, 'Ibrahim Zadran', 'batsman', 'Afghanistan', '', 'epic',
    { batting: 86, bowling: 5, fielding: 78, leadership: 68, consistency: 86, popularity: 82 },
    'Consistent Afghan - +20 in ODIs', 'Zadran', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Mohammad Nabi - Legendary
    createCard(490, 'Mohammad Nabi', 'allrounder', 'Afghanistan', '', 'legendary',
    { batting: 84, bowling: 90, fielding: 84, leadership: 90, consistency: 90, popularity: 88 },
    'Afghan Legend - +20 in T20s', 'Nabi', 2019,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

    // Fazalhaq Farooqi - Epic
    createCard(491, 'Fazalhaq Farooqi', 'bowler', 'Afghanistan', '', 'epic',
    { batting: 15, bowling: 88, fielding: 74, leadership: 68, consistency: 84, popularity: 80 },
    'Left Arm Quick - +20 pace', 'Farooqi', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // ==================== IDs 700-729: MORE MISSING INTERNATIONAL GREATS ====================

    // Learie Constantine
    createCard(492, 'Learie Constantine', 'allrounder', 'West Indies', '', 'mythic',
    { batting: 86, bowling: 90, fielding: 88, leadership: 85, consistency: 88, popularity: 92 },
    'WI Pioneer - +25 all-round', 'Constantine', 1930,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: true }),

    // Jack Hobbs - Ultimate
    createCard(493, 'Jack Hobbs', 'batsman', 'England', '', 'mythic',
    { batting: 98, bowling: 15, fielding: 72, leadership: 80, consistency: 99, popularity: 94 },
    'Master Batsman Ultimate - +35 in Tests', 'Hobbs', 1926,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // Herbert Sutcliffe
    createCard(494, 'Herbert Sutcliffe', 'batsman', 'England', '', 'legendary',
    { batting: 95, bowling: 5, fielding: 70, leadership: 70, consistency: 97, popularity: 88 },
    'Opening Great - +20 partnership', 'Sutcliffe', 1928,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // Wally Hammond
    createCard(495, 'Wally Hammond', 'batsman', 'England', '', 'legendary',
    { batting: 94, bowling: 65, fielding: 85, leadership: 88, consistency: 94, popularity: 90 },
    'England Great - +20 in Ashes', 'Hammond', 1938,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: true }),

    // Fred Trueman
    createCard(496, 'Fred Trueman', 'bowler', 'England', '', 'legendary',
    { batting: 25, bowling: 96, fielding: 75, leadership: 72, consistency: 94, popularity: 92 },
    'Fiery Fred - +25 fast bowling', 'Trueman', 1964,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: true }),

    // Brian Statham
    createCard(497, 'Brian Statham', 'bowler', 'England', '', 'legendary',
    { batting: 20, bowling: 94, fielding: 70, leadership: 68, consistency: 96, popularity: 86 },
    'Accuracy King - +20 line & length', 'Statham', 1956,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: true }),

    // ==================== IDs 730-759: YOUNG EMERGING PLAYERS (2024-2025) ====================

    // Will Young - NZ
    createCard(498, 'Will Young', 'batsman', 'New Zealand', '', 'rare',
    { batting: 82, bowling: 5, fielding: 80, leadership: 68, consistency: 84, popularity: 78 },
    'Future NZ Star - +15 in Tests', 'Young', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Ben Duckett
    createCard(499, 'Ben Duckett', 'batsman', 'England', '', 'epic',
    { batting: 86, bowling: 5, fielding: 78, leadership: 68, consistency: 84, popularity: 84 },
    'Aggressive Opener - +20 in Bazball', 'Duckett', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Zak Crawley
    createCard(500, 'Zak Crawley', 'batsman', 'England', '', 'rare',
    { batting: 84, bowling: 5, fielding: 80, leadership: 70, consistency: 78, popularity: 82 },
    'Bazball Opener - +15 in Tests', 'Crawley', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Ollie Pope
    createCard(501, 'Ollie Pope', 'batsman', 'England', '', 'epic',
    { batting: 86, bowling: 5, fielding: 82, leadership: 72, consistency: 86, popularity: 84 },
    'Future England Captain - +20 in Tests', 'Pope', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Brydon Carse
    createCard(502, 'Brydon Carse', 'allrounder', 'England', '', 'rare',
    { batting: 65, bowling: 84, fielding: 78, leadership: 68, consistency: 80, popularity: 78 },
    'Pace Allrounder - +15 in ODIs', 'Carse', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: false }),

    // Gus Atkinson
    createCard(503, 'Gus Atkinson', 'bowler', 'England', '', 'epic',
    { batting: 35, bowling: 88, fielding: 75, leadership: 65, consistency: 82, popularity: 84 },
    'Pace Revelation - +20 in Tests', 'Atkinson', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // Shamar Joseph
    createCard(504, 'Shamar Joseph', 'bowler', 'West Indies', '', 'epic',
    { batting: 28, bowling: 88, fielding: 72, leadership: 65, consistency: 80, popularity: 86 },
    'WI Pace Sensation - +25 in Tests', 'Joseph', 2024,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // Jayden Seales
    createCard(505, 'Jayden Seales', 'bowler', 'West Indies', '', 'rare',
    { batting: 15, bowling: 84, fielding: 70, leadership: 62, consistency: 78, popularity: 76 },
    'Young Pacer - +15 in Tests', 'Seales', 2021,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // Akeal Hosein
    createCard(506, 'Akeal Hosein', 'bowler', 'West Indies', '', 'epic',
    { batting: 45, bowling: 86, fielding: 82, leadership: 72, consistency: 84, popularity: 80 },
    'Left-arm Spinner - +20 in T20s', 'Hosein', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

    // Brandon King
    createCard(507, 'Brandon King', 'batsman', 'West Indies', '', 'epic',
    { batting: 84, bowling: 5, fielding: 78, leadership: 68, consistency: 80, popularity: 82 },
    'WI Opener - +15 in T20s', 'King', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Johnson Charles
    createCard(508, 'Johnson Charles', 'batsman', 'West Indies', '', 'rare',
    { batting: 82, bowling: 5, fielding: 75, leadership: 65, consistency: 76, popularity: 80 },
    'Power Hitter - +20 six hitting', 'Charles', 2016,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Rovman Powell - Legendary upgrade
    createCard(509, 'Rovman Powell', 'batsman', 'West Indies', '', 'legendary',
    { batting: 88, bowling: 5, fielding: 82, leadership: 85, consistency: 82, popularity: 88 },
    'WI Captain - +25 in death overs', 'Powell', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // ==================== IDs 760-789: MORE EMERGING & UPGRADE PLAYERS ====================

    // Tristan Stubbs - Legendary
    createCard(510, 'Tristan Stubbs', 'batsman', 'South Africa', 'Sunrisers Hyderabad', 'legendary',
    { batting: 90, bowling: 5, fielding: 86, leadership: 70, consistency: 84, popularity: 90 },
    'Power Hitter Ultimate - +25 in T20s', 'Stubbs', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Donovan Ferreira
    createCard(511, 'Donovan Ferreira', 'wicketkeeper', 'South Africa', '', 'epic',
    { batting: 86, bowling: 5, fielding: 84, leadership: 68, consistency: 80, popularity: 82 },
    'Finisher - +20 in death', 'Ferreira', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Reeza Hendricks
    createCard(512, 'Reeza Hendricks', 'batsman', 'South Africa', '', 'epic',
    { batting: 86, bowling: 5, fielding: 82, leadership: 70, consistency: 86, popularity: 82 },
    'Consistent Opener - +15 in ODIs', 'Hendricks', 2021,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Tony de Zorzi
    createCard(513, 'Tony de Zorzi', 'batsman', 'South Africa', '', 'rare',
    { batting: 82, bowling: 5, fielding: 78, leadership: 68, consistency: 82, popularity: 76 },
    'Test Specialist - +15 in Tests', 'de Zorzi', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // David Bedingham
    createCard(514, 'David Bedingham', 'batsman', 'South Africa', '', 'rare',
    { batting: 84, bowling: 5, fielding: 76, leadership: 65, consistency: 84, popularity: 78 },
    'SA Test Hope - +15 in Tests', 'Bedingham', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Nandre Burger
    createCard(515, 'Nandre Burger', 'bowler', 'South Africa', '', 'epic',
    { batting: 25, bowling: 86, fielding: 74, leadership: 68, consistency: 82, popularity: 80 },
    'Left-arm Express - +20 pace', 'Burger', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // Beuran Hendricks
    createCard(516, 'Beuran Hendricks', 'bowler', 'South Africa', '', 'rare',
    { batting: 20, bowling: 82, fielding: 72, leadership: 65, consistency: 80, popularity: 74 },
    'Left-arm Swing - +15 in powerplay', 'Hendricks', 2019,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // Wiaan Mulder
    createCard(517, 'Wiaan Mulder', 'allrounder', 'South Africa', '', 'rare',
    { batting: 72, bowling: 78, fielding: 80, leadership: 70, consistency: 78, popularity: 76 },
    'Future Allrounder - +10 both', 'Mulder', 2021,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: false }),

    // Senuran Muthusamy
    createCard(518, 'Senuran Muthusamy', 'allrounder', 'South Africa', '', 'common',
    { batting: 65, bowling: 75, fielding: 72, leadership: 68, consistency: 78, popularity: 68 },
    'Spin Allrounder - +10 in subcontinent', 'Muthusamy', 2019,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

    // Temba Bavuma - Legendary Captain
    createCard(519, 'Temba Bavuma', 'batsman', 'South Africa', '', 'legendary',
    { batting: 86, bowling: 5, fielding: 88, leadership: 94, consistency: 88, popularity: 88 },
    'SA Captain - +20 leadership', 'Bavuma', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Marco Jansen - Legendary
    createCard(520, 'Marco Jansen', 'allrounder', 'South Africa', 'Sunrisers Hyderabad', 'legendary',
    { batting: 70, bowling: 90, fielding: 80, leadership: 72, consistency: 86, popularity: 88 },
    'Tall Timber Ultimate - +25 bounce', 'Jansen', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: false }),

    // Gerald Coetzee - Legendary
    createCard(521, 'Gerald Coetzee', 'bowler', 'South Africa', 'Mumbai Indians', 'legendary',
    { batting: 35, bowling: 94, fielding: 80, leadership: 72, consistency: 86, popularity: 90 },
    'Raw Express - +30 bowling speed', 'Coetzee', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // ==================== IDs 790-809: BANGLADESH & ZIMBABWE STARS ====================

    // Najmul Hossain Shanto
    createCard(522, 'Najmul Shanto', 'batsman', 'Bangladesh', '', 'epic',
    { batting: 86, bowling: 5, fielding: 82, leadership: 84, consistency: 86, popularity: 84 },
    'BD Captain - +20 in Tests', 'Shanto', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Mehidy Hasan Miraz
    createCard(523, 'Mehidy Miraz', 'allrounder', 'Bangladesh', '', 'epic',
    { batting: 78, bowling: 86, fielding: 80, leadership: 75, consistency: 88, popularity: 84 },
    'Spin Allrounder - +15 both', 'Miraz', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

    // Taskin Ahmed
    createCard(524, 'Taskin Ahmed', 'bowler', 'Bangladesh', '', 'epic',
    { batting: 25, bowling: 88, fielding: 75, leadership: 70, consistency: 84, popularity: 82 },
    'BD Pace Leader - +20 pace', 'Taskin', 2021,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // Shoriful Islam
    createCard(525, 'Shoriful Islam', 'bowler', 'Bangladesh', '', 'rare',
    { batting: 15, bowling: 84, fielding: 72, leadership: 65, consistency: 80, popularity: 78 },
    'Young Left-arm - +15 in powerplay', 'Shoriful', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // Hasan Mahmud
    createCard(526, 'Hasan Mahmud', 'bowler', 'Bangladesh', '', 'rare',
    { batting: 15, bowling: 82, fielding: 70, leadership: 62, consistency: 78, popularity: 74 },
    'Seam Bowler - +10 in ODIs', 'Mahmud', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // Mahedi Hasan
    createCard(527, 'Mahedi Hasan', 'allrounder', 'Bangladesh', '', 'rare',
    { batting: 65, bowling: 78, fielding: 74, leadership: 68, consistency: 76, popularity: 72 },
    'T20 Allrounder - +10 both', 'Mahedi', 2021,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

    // Afif Hossain
    createCard(528, 'Afif Hossain', 'batsman', 'Bangladesh', '', 'rare',
    { batting: 82, bowling: 35, fielding: 78, leadership: 68, consistency: 78, popularity: 78 },
    'Finisher - +15 in death', 'Afif', 2021,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

    // Mahmudullah Riyad - Legendary
    createCard(529, 'Mahmudullah Riyad', 'batsman', 'Bangladesh', '', 'legendary',
    { batting: 86, bowling: 75, fielding: 82, leadership: 86, consistency: 88, popularity: 88 },
    'Mr Dependable - +20 in World Cups', 'Mahmudullah', 2019,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

    // ==================== IDs 810-830: SRI LANKA, AFGHANISTAN COMPLETION ====================

    // Angelo Mathews - Legendary
    createCard(530, 'Angelo Mathews', 'allrounder', 'Sri Lanka', '', 'legendary',
    { batting: 88, bowling: 88, fielding: 86, leadership: 92, consistency: 92, popularity: 88 },
    'SL Legend - +20 all-round', 'Mathews', 2014,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

    // Dhananjaya de Silva
    createCard(531, 'Dhananjaya de Silva', 'allrounder', 'Sri Lanka', '', 'epic',
    { batting: 84, bowling: 80, fielding: 82, leadership: 88, consistency: 86, popularity: 82 },
    'SL Captain - +15 in Tests', 'Dhananjaya', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

    // Sadeera Samarawickrama
    createCard(532, 'Sadeera Samarawickrama', 'batsman', 'Sri Lanka', '', 'rare',
    { batting: 84, bowling: 5, fielding: 80, leadership: 68, consistency: 82, popularity: 80 },
    'Stylish Batsman - +15 in ODIs', 'Sadeera', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Pathum Nissanka - Epic upgrade
    createCard(533, 'Pathum Nissanka', 'batsman', 'Sri Lanka', '', 'epic',
    { batting: 86, bowling: 5, fielding: 78, leadership: 68, consistency: 86, popularity: 82 },
    'SL Opener - +20 in ODIs', 'Nissanka', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Charith Asalanka - Epic upgrade
    createCard(534, 'Charith Asalanka', 'batsman', 'Sri Lanka', '', 'epic',
    { batting: 84, bowling: 5, fielding: 80, leadership: 72, consistency: 82, popularity: 80 },
    'Middle Order Rock - +15 in chases', 'Asalanka', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

    // Dunith Wellalage
    createCard(535, 'Dunith Wellalage', 'allrounder', 'Sri Lanka', '', 'epic',
    { batting: 72, bowling: 84, fielding: 80, leadership: 70, consistency: 82, popularity: 78 },
    'Young Spin Allrounder - +15 both', 'Wellalage', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

    // Dilshan Madushanka
    createCard(536, 'Dilshan Madushanka', 'bowler', 'Sri Lanka', '', 'epic',
    { batting: 15, bowling: 86, fielding: 72, leadership: 65, consistency: 82, popularity: 80 },
    'Left-arm Express - +20 in powerplay', 'Madushanka', 2023,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // Lahiru Kumara
    createCard(537, 'Lahiru Kumara', 'bowler', 'Sri Lanka', '', 'rare',
    { batting: 15, bowling: 84, fielding: 70, leadership: 62, consistency: 78, popularity: 76 },
    'Raw Pace - +15 speed', 'Kumara', 2018,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // Kasun Rajitha
    createCard(538, 'Kasun Rajitha', 'bowler', 'Sri Lanka', '', 'rare',
    { batting: 20, bowling: 82, fielding: 72, leadership: 65, consistency: 80, popularity: 74 },
    'Seam Bowler - +10 in Tests', 'Rajitha', 2022,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

    // ==================== IDs 831-850: FINAL ULTIMATE GOAT CARDS ====================

    // Ultimate Sachin Tendulkar - God of Cricket
    createCard(539, 'Sachin Tendulkar', 'batsman', 'India', 'Mumbai Indians', 'mythic',
    { batting: 100, bowling: 40, fielding: 90, leadership: 95, consistency: 100, popularity: 100 },
    'GOD OF CRICKET - +50 all batting stats', 'Sachin Ultimate', 1998,
    { worldCupWinner: true, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: true }),

    // Ultimate Virat Kohli - Chase Master
    createCard(540, 'Virat Kohli', 'batsman', 'India', 'Royal Challengers Bangalore', 'mythic',
    { batting: 100, bowling: 35, fielding: 95, leadership: 96, consistency: 100, popularity: 100 },
    'ULTIMATE CHASE MASTER - +45 when chasing', 'Kohli Ultimate', 2023,
    { worldCupWinner: true, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: true }),

    // Ultimate MS Dhoni - Thala
    createCard(541, 'MS Dhoni', 'wicketkeeper', 'India', 'Chennai Super Kings', 'mythic',
    { batting: 95, bowling: 15, fielding: 98, leadership: 100, consistency: 99, popularity: 100 },
    'THALA ULTIMATE - +40 in finals', 'Dhoni Ultimate', 2011,
    { worldCupWinner: true, iplCaptain: true, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: true }),

    // Ultimate Rohit Sharma - Hitman
    createCard(542, 'Rohit Sharma', 'batsman', 'India', 'Mumbai Indians', 'mythic',
    { batting: 99, bowling: 25, fielding: 85, leadership: 95, consistency: 96, popularity: 100 },
    'ULTIMATE HITMAN - +40 in World Cups', 'Rohit Ultimate', 2019,
    { worldCupWinner: true, iplCaptain: true, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: true }),

    // Ultimate Brian Lara - Prince
    createCard(543, 'Brian Lara', 'batsman', 'West Indies', '', 'mythic',
    { batting: 100, bowling: 20, fielding: 85, leadership: 88, consistency: 98, popularity: 100 },
    'ULTIMATE PRINCE - +45 records', 'Lara Ultimate', 2004,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // Ultimate Vivian Richards - King Viv
    createCard(544, 'Vivian Richards', 'batsman', 'West Indies', '', 'mythic',
    { batting: 99, bowling: 80, fielding: 92, leadership: 98, consistency: 96, popularity: 100 },
    'ULTIMATE KING VIV - +50 domination', 'Richards Ultimate', 1983,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // Ultimate Jacques Kallis - GOAT Allrounder
    createCard(545, 'Jacques Kallis', 'allrounder', 'South Africa', '', 'mythic',
    { batting: 98, bowling: 96, fielding: 94, leadership: 94, consistency: 100, popularity: 98 },
    'ULTIMATE GOAT ALLROUNDER - +45 both stats', 'Kallis Ultimate', 2007,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: true }),

    // Ultimate Ricky Ponting
    createCard(546, 'Ricky Ponting', 'batsman', 'Australia', '', 'mythic',
    { batting: 98, bowling: 20, fielding: 94, leadership: 100, consistency: 96, popularity: 100 },
    'ULTIMATE PUNTER - +40 in World Cups', 'Ponting Ultimate', 2003,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // Ultimate Wasim Akram - Sultan
    createCard(547, 'Wasim Akram', 'bowler', 'Pakistan', '', 'mythic',
    { batting: 55, bowling: 100, fielding: 85, leadership: 96, consistency: 99, popularity: 100 },
    'ULTIMATE SULTAN OF SWING - +50 swing', 'Wasim Ultimate', 1992,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: true }),

    // Ultimate Shane Warne - King
    createCard(548, 'Shane Warne', 'bowler', 'Australia', 'Rajasthan Royals', 'mythic',
    { batting: 45, bowling: 100, fielding: 85, leadership: 98, consistency: 98, popularity: 100 },
    'ULTIMATE KING OF SPIN - +50 leg spin', 'Warne Ultimate', 1999,
    { worldCupWinner: true, iplCaptain: true, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // Ultimate Muttiah Muralitharan
    createCard(549, 'Muttiah Muralitharan', 'bowler', 'Sri Lanka', '', 'mythic',
    { batting: 28, bowling: 100, fielding: 78, leadership: 88, consistency: 100, popularity: 98 },
    'ULTIMATE WICKET TAKER - +45 spin variations', 'Murali Ultimate', 2007,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // Ultimate Ben Stokes
    createCard(550, 'Ben Stokes', 'allrounder', 'England', '', 'mythic',
    { batting: 98, bowling: 96, fielding: 96, leadership: 98, consistency: 98, popularity: 100 },
    'ULTIMATE FINISHER - +50 in pressure', 'Stokes Ultimate', 2019,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: true }),

    // Ultimate AB de Villiers
    createCard(551, 'AB de Villiers', 'batsman', 'South Africa', '', 'mythic',
    { batting: 100, bowling: 30, fielding: 100, leadership: 92, consistency: 99, popularity: 100 },
    'ULTIMATE 360 - +50 innovative shots', 'ABD Ultimate', 2015,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // Ultimate Chris Gayle
    createCard(552, 'Chris Gayle', 'batsman', 'West Indies', '', 'mythic',
    { batting: 100, bowling: 38, fielding: 78, leadership: 88, consistency: 92, popularity: 100 },
    'ULTIMATE UNIVERSE BOSS - +55 power hitting', 'Gayle Ultimate', 2013,
    { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

    // Ultimate Jasprit Bumrah
    createCard(553, 'Jasprit Bumrah', 'bowler', 'India', 'Mumbai Indians', 'mythic',
    { batting: 30, bowling: 100, fielding: 90, leadership: 82, consistency: 100, popularity: 100 },
    'ULTIMATE YORKER KING - +40 in death overs', 'Bumrah Ultimate', 2020,
    { worldCupWinner: true, iplCaptain: false, indianLegend: true, fastBowler: true, allRounder: false, goatEdition: true }),

    // Ultimate Kapil Dev
    createCard(554, 'Kapil Dev', 'allrounder', 'India', '', 'mythic',
    { batting: 92, bowling: 96, fielding: 88, leadership: 100, consistency: 96, popularity: 100 },
    'ULTIMATE 1983 HERO - +45 all-round', 'Kapil Ultimate', 1983,
    { worldCupWinner: true, iplCaptain: false, indianLegend: true, fastBowler: true, allRounder: true, goatEdition: true }),

    // Ultimate Imran Khan
    createCard(555, 'Imran Khan', 'allrounder', 'Pakistan', '', 'mythic',
    { batting: 90, bowling: 98, fielding: 85, leadership: 100, consistency: 98, popularity: 100 },
    'ULTIMATE 1992 CAPTAIN - +50 leadership', 'Imran Ultimate', 1992,
    { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: true }),

    // ==================== IDs 556-600: STANDARD RARITY CARDS ====================
// Standard rarity = Good domestic players, emerging talents, role players, consistent performers

// Indian Domestic & Emerging Standards
createCard(556, 'Abhimanyu Easwaran', 'batsman', 'India', '', 'standard',
  { batting: 78, bowling: 5, fielding: 75, leadership: 68, consistency: 82, popularity: 72 },
  'Domination in Ranji - +15 in domestic', 'Easwaran', 2021,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(557, 'Priyank Panchal', 'batsman', 'India', '', 'standard',
  { batting: 76, bowling: 5, fielding: 72, leadership: 70, consistency: 80, popularity: 68 },
  'Ranji Veteran - +10 in first class', 'Panchal', 2019,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(558, 'Hanuma Vihari', 'batsman', 'India', '', 'standard',
  { batting: 76, bowling: 65, fielding: 78, leadership: 72, consistency: 84, popularity: 74 },
  'Test Specialist - +15 in Tests', 'Vihari', 2019,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

createCard(559, 'Karun Nair', 'batsman', 'India', '', 'standard',
  { batting: 74, bowling: 5, fielding: 70, leadership: 65, consistency: 68, popularity: 76 },
  'Triple Centurion - +20 in Tests', 'Nair', 2016,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(560, 'Shivam Dube', 'allrounder', 'India', 'Chennai Super Kings', 'standard',
  { batting: 74, bowling: 72, fielding: 70, leadership: 65, consistency: 70, popularity: 78 },
  'Power Hitter - +15 six hitting', 'Dube', 2020,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

createCard(561, 'Vijay Shankar', 'allrounder', 'India', '', 'standard',
  { batting: 72, bowling: 70, fielding: 78, leadership: 68, consistency: 72, popularity: 72 },
  '3D Allrounder - +10 both', 'Shankar', 2019,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

createCard(562, 'Kedar Jadhav', 'allrounder', 'India', '', 'standard',
  { batting: 76, bowling: 70, fielding: 72, leadership: 68, consistency: 74, popularity: 80 },
  'Finisher - +15 in chases', 'Jadhav', 2017,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

createCard(563, 'Stuart Binny', 'allrounder', 'India', '', 'standard',
  { batting: 68, bowling: 72, fielding: 75, leadership: 65, consistency: 70, popularity: 72 },
  'Best ODI Figures - +20 bowling', 'Binny', 2014,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

createCard(564, 'Parthiv Patel', 'wicketkeeper', 'India', '', 'standard',
  { batting: 74, bowling: 5, fielding: 82, leadership: 70, consistency: 78, popularity: 76 },
  'Youngest Debut Keeper - +15 keeping', 'Parthiv', 2002,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(565, 'Wriddhiman Saha', 'wicketkeeper', 'India', '', 'standard',
  { batting: 70, bowling: 5, fielding: 88, leadership: 70, consistency: 82, popularity: 74 },
  'Best Gloves in India - +20 keeping', 'Saha', 2016,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(566, 'Mayank Agarwal', 'batsman', 'India', '', 'standard',
  { batting: 78, bowling: 5, fielding: 70, leadership: 68, consistency: 76, popularity: 78 },
  'Test Opener - +15 in Australia', 'Mayank', 2019,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(567, 'Prithvi Shaw', 'batsman', 'India', 'Delhi Capitals', 'standard',
  { batting: 76, bowling: 5, fielding: 70, leadership: 62, consistency: 65, popularity: 80 },
  'U19 WC Captain - +20 in powerplay', 'Shaw', 2018,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(568, 'Abhishek Sharma', 'allrounder', 'India', 'Sunrisers Hyderabad', 'standard',
  { batting: 70, bowling: 72, fielding: 74, leadership: 65, consistency: 68, popularity: 74 },
  'Left Arm Spin - +10 economy', 'Abhishek', 2021,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

createCard(569, 'Abdul Samad', 'batsman', 'India', 'Sunrisers Hyderabad', 'standard',
  { batting: 72, bowling: 5, fielding: 68, leadership: 60, consistency: 65, popularity: 72 },
  'Young Finisher - +15 in death', 'Samad', 2020,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(570, 'Shahbaz Ahmed', 'allrounder', 'India', 'Royal Challengers Bangalore', 'standard',
  { batting: 68, bowling: 74, fielding: 72, leadership: 65, consistency: 70, popularity: 68 },
  'Left Arm Spin - +10 in middle overs', 'Shahbaz', 2021,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

// Australian Domestic & Emerging Standards
createCard(571, 'Cameron Bancroft', 'batsman', 'Australia', '', 'standard',
  { batting: 74, bowling: 5, fielding: 80, leadership: 68, consistency: 76, popularity: 70 },
  'Test Opener - +15 in Australia', 'Bancroft', 2018,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(572, 'Matthew Renshaw', 'batsman', 'Australia', '', 'standard',
  { batting: 72, bowling: 5, fielding: 70, leadership: 65, consistency: 74, popularity: 68 },
  'Young Test Opener - +10 in Tests', 'Renshaw', 2017,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(573, 'Peter Handscomb', 'batsman', 'Australia', '', 'standard',
  { batting: 74, bowling: 5, fielding: 78, leadership: 70, consistency: 78, popularity: 72 },
  'Techincal Batsman - +15 in ODIs', 'Handscomb', 2017,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(574, 'Ashton Turner', 'allrounder', 'Australia', '', 'standard',
  { batting: 72, bowling: 68, fielding: 74, leadership: 68, consistency: 70, popularity: 72 },
  'Finisher - +20 in chases', 'Turner', 2019,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

createCard(575, 'Daniel Sams', 'allrounder', 'Australia', 'Lucknow Super Giants', 'standard',
  { batting: 65, bowling: 76, fielding: 72, leadership: 65, consistency: 70, popularity: 74 },
  'T20 Specialist - +15 in death', 'Sams', 2021,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: false }),

createCard(576, 'Riley Meredith', 'bowler', 'Australia', 'Mumbai Indians', 'standard',
  { batting: 12, bowling: 78, fielding: 68, leadership: 60, consistency: 68, popularity: 72 },
  'Raw Pace - +20 speed', 'Meredith', 2021,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

createCard(577, 'Jhye Richardson', 'bowler', 'Australia', '', 'standard',
  { batting: 28, bowling: 80, fielding: 74, leadership: 65, consistency: 72, popularity: 76 },
  'Young Pacer - +15 swing', 'Richardson', 2019,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

// English Domestic & Emerging Standards
createCard(578, 'Dan Lawrence', 'batsman', 'England', '', 'standard',
  { batting: 74, bowling: 65, fielding: 70, leadership: 65, consistency: 72, popularity: 70 },
  'Young Test Batsman - +15 in subcontinent', 'Lawrence', 2021,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

createCard(579, 'Tom Banton', 'wicketkeeper', 'England', '', 'standard',
  { batting: 74, bowling: 5, fielding: 78, leadership: 62, consistency: 65, popularity: 76 },
  'T20 Stylish - +15 powerplay', 'Banton', 2020,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(580, 'Phil Salt', 'wicketkeeper', 'England', 'Delhi Capitals', 'standard',
  { batting: 76, bowling: 5, fielding: 80, leadership: 65, consistency: 70, popularity: 74 },
  'Aggressive Opener - +15 powerplay', 'Salt', 2022,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(581, 'Liam Dawson', 'allrounder', 'England', '', 'standard',
  { batting: 65, bowling: 76, fielding: 72, leadership: 68, consistency: 74, popularity: 68 },
  'Left Arm Spin - +15 economy', 'Dawson', 2017,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

createCard(582, 'David Willey', 'allrounder', 'England', '', 'standard',
  { batting: 62, bowling: 76, fielding: 78, leadership: 70, consistency: 72, popularity: 74 },
  'Left Arm Swing - +15 powerplay', 'Willey', 2018,
  { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: false }),

createCard(583, 'Chris Jordan', 'allrounder', 'England', '', 'standard',
  { batting: 58, bowling: 78, fielding: 85, leadership: 70, consistency: 72, popularity: 78 },
  'Death Bowling Specialist - +20 yorker', 'Jordan', 2019,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: false }),

// South African Domestic & Emerging Standards
createCard(584, 'Janneman Malan', 'batsman', 'South Africa', '', 'standard',
  { batting: 78, bowling: 5, fielding: 72, leadership: 65, consistency: 80, popularity: 74 },
  'ODI Specialist - +20 in ODIs', 'Malan', 2020,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(585, 'Kyle Verreynne', 'wicketkeeper', 'South Africa', '', 'standard',
  { batting: 72, bowling: 5, fielding: 82, leadership: 68, consistency: 74, popularity: 70 },
  'Test Keeper - +15 keeping', 'Verreynne', 2021,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(586, 'Lizaad Williams', 'bowler', 'South Africa', '', 'standard',
  { batting: 15, bowling: 74, fielding: 68, leadership: 62, consistency: 70, popularity: 66 },
  'Medium Pacer - +10 accuracy', 'Williams', 2021,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

createCard(587, 'Sisanda Magala', 'bowler', 'South Africa', '', 'standard',
  { batting: 32, bowling: 76, fielding: 70, leadership: 65, consistency: 68, popularity: 68 },
  'Death Bowler - +15 in T20s', 'Magala', 2022,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

// New Zealand Domestic & Emerging Standards
createCard(588, 'Henry Nicholls', 'batsman', 'New Zealand', '', 'standard',
  { batting: 76, bowling: 5, fielding: 74, leadership: 70, consistency: 82, popularity: 74 },
  'Test Specialist - +20 in Tests', 'Nicholls', 2018,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(589, 'Tom Latham', 'wicketkeeper', 'New Zealand', '', 'standard',
  { batting: 78, bowling: 5, fielding: 85, leadership: 82, consistency: 84, popularity: 78 },
  'NZ Opener - +15 in ODIs', 'Latham', 2019,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(590, 'Doug Bracewell', 'allrounder', 'New Zealand', '', 'standard',
  { batting: 58, bowling: 74, fielding: 72, leadership: 68, consistency: 72, popularity: 68 },
  'Medium Pacer - +15 at home', 'Bracewell', 2016,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: false }),

createCard(591, 'Blair Tickner', 'bowler', 'New Zealand', '', 'standard',
  { batting: 15, bowling: 72, fielding: 68, leadership: 62, consistency: 70, popularity: 64 },
  'T20 Specialist - +10 in powerplay', 'Tickner', 2020,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

// West Indian Domestic & Emerging Standards
createCard(592, 'Keacy Carty', 'batsman', 'West Indies', '', 'standard',
  { batting: 72, bowling: 5, fielding: 70, leadership: 65, consistency: 70, popularity: 68 },
  'Young Batsman - +10 in ODIs', 'Carty', 2022,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(593, 'Odean Smith', 'allrounder', 'West Indies', '', 'standard',
  { batting: 68, bowling: 76, fielding: 72, leadership: 65, consistency: 65, popularity: 76 },
  'Power Hitter - +20 six hitting', 'Smith', 2022,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: false }),

createCard(594, 'Romario Shepherd', 'allrounder', 'West Indies', '', 'standard',
  { batting: 65, bowling: 74, fielding: 72, leadership: 68, consistency: 68, popularity: 72 },
  'Finisher - +15 in death', 'Shepherd', 2021,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: false }),

createCard(595, 'Hayden Walsh Jr.', 'bowler', 'West Indies', '', 'standard',
  { batting: 28, bowling: 74, fielding: 70, leadership: 65, consistency: 72, popularity: 68 },
  'Leg Spinner - +15 googly', 'Walsh', 2020,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

// Pakistani Domestic & Emerging Standards
createCard(596, 'Mohammad Wasim Jr.', 'bowler', 'Pakistan', '', 'standard',
  { batting: 25, bowling: 76, fielding: 70, leadership: 65, consistency: 72, popularity: 72 },
  'Young Pacer - +15 in T20s', 'Wasim', 2021,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

createCard(597, 'Usman Qadir', 'bowler', 'Pakistan', '', 'standard',
  { batting: 18, bowling: 74, fielding: 68, leadership: 62, consistency: 70, popularity: 70 },
  'Leg Spinner - +15 googly', 'Qadir', 2020,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(598, 'Saud Shakeel', 'batsman', 'Pakistan', '', 'standard',
  { batting: 76, bowling: 5, fielding: 72, leadership: 68, consistency: 78, popularity: 72 },
  'Test Specialist - +15 in Tests', 'Shakeel', 2022,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(599, 'Haider Ali', 'batsman', 'Pakistan', '', 'standard',
  { batting: 74, bowling: 5, fielding: 70, leadership: 62, consistency: 65, popularity: 76 },
  'Young Talent - +15 in T20s', 'Haider', 2020,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

// Sri Lankan Domestic & Emerging Standards
createCard(600, 'Oshada Fernando', 'batsman', 'Sri Lanka', '', 'standard',
  { batting: 74, bowling: 5, fielding: 70, leadership: 65, consistency: 74, popularity: 68 },
  'Test Opener - +15 in Tests', 'Fernando', 2019,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(601, 'Lahiru Thirimanne', 'batsman', 'Sri Lanka', '', 'standard',
  { batting: 76, bowling: 5, fielding: 72, leadership: 70, consistency: 76, popularity: 72 },
  'Consistent Opener - +15 in Tests', 'Thirimanne', 2018,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(602, 'Dushmantha Chameera', 'bowler', 'Sri Lanka', '', 'standard',
  { batting: 18, bowling: 78, fielding: 70, leadership: 65, consistency: 72, popularity: 74 },
  'Express Pace - +20 speed', 'Chameera', 2021,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

// Afghan Domestic & Emerging Standards
createCard(603, 'Azmatullah Omarzai', 'allrounder', 'Afghanistan', '', 'standard',
  { batting: 68, bowling: 74, fielding: 70, leadership: 65, consistency: 72, popularity: 70 },
  'Emerging Allrounder - +12 both', 'Omarzai', 2022,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

createCard(604, 'Naveen-ul-Haq', 'bowler', 'Afghanistan', '', 'standard',
  { batting: 15, bowling: 76, fielding: 68, leadership: 62, consistency: 70, popularity: 72 },
  'T20 Specialist - +15 variations', 'Naveen', 2021,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

createCard(605, 'Fareed Ahmad', 'bowler', 'Afghanistan', '', 'standard',
  { batting: 15, bowling: 72, fielding: 68, leadership: 60, consistency: 68, popularity: 66 },
  'Left Arm Pacer - +10 in powerplay', 'Fareed', 2022,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

// Bangladesh Domestic & Emerging Standards
createCard(606, 'Yasir Ali', 'batsman', 'Bangladesh', '', 'standard',
  { batting: 72, bowling: 5, fielding: 68, leadership: 65, consistency: 70, popularity: 68 },
  'Middle Order - +10 in ODIs', 'Yasir', 2021,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(607, 'Mossadek Hossain', 'allrounder', 'Bangladesh', '', 'standard',
  { batting: 68, bowling: 70, fielding: 72, leadership: 68, consistency: 72, popularity: 70 },
  'Spin Allrounder - +10 both', 'Mossadek', 2018,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

createCard(608, 'Ebadot Hossain', 'bowler', 'Bangladesh', '', 'standard',
  { batting: 12, bowling: 74, fielding: 65, leadership: 60, consistency: 68, popularity: 66 },
  'Fast Bowler - +15 in Tests', 'Ebadot', 2021,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

// Zimbabwe Domestic & Emerging Standards
createCard(609, 'Craig Ervine', 'batsman', 'Zimbabwe', '', 'standard',
  { batting: 76, bowling: 5, fielding: 72, leadership: 78, consistency: 78, popularity: 72 },
  'Zimbabwe Captain - +15 in ODIs', 'Ervine', 2022,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(610, 'Sean Williams', 'allrounder', 'Zimbabwe', '', 'standard',
  { batting: 74, bowling: 72, fielding: 74, leadership: 75, consistency: 76, popularity: 72 },
  'Senior Allrounder - +12 both', 'Williams', 2018,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

createCard(611, 'Ryan Burl', 'allrounder', 'Zimbabwe', '', 'standard',
  { batting: 68, bowling: 70, fielding: 72, leadership: 65, consistency: 70, popularity: 68 },
  'Spin Allrounder - +10 in T20s', 'Burl', 2021,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

// Ireland Domestic & Emerging Standards
createCard(612, 'Andy Balbirnie', 'batsman', 'Ireland', '', 'standard',
  { batting: 76, bowling: 5, fielding: 74, leadership: 80, consistency: 78, popularity: 74 },
  'Ireland Captain - +15 in ODIs', 'Balbirnie', 2022,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(613, 'George Dockrell', 'allrounder', 'Ireland', '', 'standard',
  { batting: 62, bowling: 74, fielding: 72, leadership: 70, consistency: 74, popularity: 68 },
  'Left Arm Spin - +15 in T20s', 'Dockrell', 2021,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

createCard(614, 'Mark Adair', 'allrounder', 'Ireland', '', 'standard',
  { batting: 58, bowling: 76, fielding: 72, leadership: 68, consistency: 72, popularity: 68 },
  'Pace Allrounder - +15 in T20s', 'Adair', 2021,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: false }),

// ==================== IDs 615-650: MORE STANDARD RARITY - LEGENDS LATER CAREER ====================
// These are older legends past their prime but still valuable

createCard(615, 'Adam Gilchrist', 'wicketkeeper', 'Australia', '', 'standard',
  { batting: 78, bowling: 5, fielding: 85, leadership: 75, consistency: 80, popularity: 90 },
  'Late Career - +10 keeping', 'Gilchrist', 2007,
  { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(616, 'Ricky Ponting', 'batsman', 'Australia', '', 'standard',
  { batting: 80, bowling: 15, fielding: 82, leadership: 88, consistency: 85, popularity: 92 },
  'Late Career Leader - +15 experience', 'Ponting', 2010,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(617, 'Sachin Tendulkar', 'batsman', 'India', 'Mumbai Indians', 'standard',
  { batting: 82, bowling: 25, fielding: 75, leadership: 80, consistency: 88, popularity: 96 },
  'IPL Phase - +10 experience', 'Sachin', 2011,
  { worldCupWinner: true, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(618, 'Jacques Kallis', 'allrounder', 'South Africa', 'Kolkata Knight Riders', 'standard',
  { batting: 80, bowling: 78, fielding: 80, leadership: 82, consistency: 88, popularity: 88 },
  'IPL Specialist - +15 experience', 'Kallis', 2012,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: false }),

createCard(619, 'Muttiah Muralitharan', 'bowler', 'Sri Lanka', 'Chennai Super Kings', 'standard',
  { batting: 20, bowling: 84, fielding: 70, leadership: 75, consistency: 88, popularity: 90 },
  'IPL Years - +15 variations', 'Murali', 2010,
  { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(620, 'Shane Warne', 'bowler', 'Australia', 'Rajasthan Royals', 'standard',
  { batting: 30, bowling: 82, fielding: 75, leadership: 88, consistency: 85, popularity: 94 },
  'IPL Captain - +15 experience', 'Warne', 2008,
  { worldCupWinner: false, iplCaptain: true, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(621, 'Brian Lara', 'batsman', 'West Indies', '', 'standard',
  { batting: 84, bowling: 15, fielding: 75, leadership: 78, consistency: 86, popularity: 92 },
  'Late Career - +15 experience', 'Lara', 2005,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(622, 'Wasim Akram', 'bowler', 'Pakistan', 'Kolkata Knight Riders', 'standard',
  { batting: 45, bowling: 84, fielding: 75, leadership: 85, consistency: 88, popularity: 92 },
  'IPL Comeback - +15 skills', 'Wasim', 2008,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

createCard(623, 'Waqar Younis', 'bowler', 'Pakistan', '', 'standard',
  { batting: 18, bowling: 82, fielding: 70, leadership: 78, consistency: 84, popularity: 88 },
  'Late Career Coach - +15 experience', 'Waqar', 2003,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

createCard(624, 'Courtney Walsh', 'bowler', 'West Indies', '', 'standard',
  { batting: 15, bowling: 84, fielding: 70, leadership: 80, consistency: 90, popularity: 86 },
  'Late Career - +15 consistency', 'Walsh', 1999,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

createCard(625, 'Curtly Ambrose', 'bowler', 'West Indies', '', 'standard',
  { batting: 12, bowling: 84, fielding: 72, leadership: 78, consistency: 88, popularity: 86 },
  'Late Career - +15 bounce', 'Ambrose', 1999,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

createCard(626, 'Glenn McGrath', 'bowler', 'Australia', '', 'standard',
  { batting: 12, bowling: 84, fielding: 75, leadership: 80, consistency: 92, popularity: 88 },
  'Late Career - +15 accuracy', 'McGrath', 2005,
  { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

createCard(627, 'Anil Kumble', 'bowler', 'India', '', 'standard',
  { batting: 20, bowling: 82, fielding: 72, leadership: 85, consistency: 88, popularity: 86 },
  'Late Career - +15 experience', 'Kumble', 2007,
  { worldCupWinner: false, iplCaptain: true, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(628, 'Shaun Pollock', 'allrounder', 'South Africa', '', 'standard',
  { batting: 65, bowling: 80, fielding: 78, leadership: 85, consistency: 88, popularity: 84 },
  'Late Career Allrounder - +15 experience', 'Pollock', 2006,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: false }),

createCard(629, 'Sanath Jayasuriya', 'allrounder', 'Sri Lanka', 'Mumbai Indians', 'standard',
  { batting: 78, bowling: 72, fielding: 70, leadership: 75, consistency: 75, popularity: 88 },
  'IPL Phase - +15 powerplay', 'Jayasuriya', 2008,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

createCard(630, 'Chris Gayle', 'batsman', 'West Indies', '', 'standard',
  { batting: 80, bowling: 25, fielding: 68, leadership: 75, consistency: 75, popularity: 92 },
  'Late Career - +15 experience', 'Gayle', 2019,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

// ==================== IDs 631-660: YOUNG U-19 & ACADEMY STARS ====================
// Future prospects

createCard(631, 'Musheer Khan', 'allrounder', 'India', '', 'standard',
  { batting: 72, bowling: 68, fielding: 70, leadership: 65, consistency: 68, popularity: 66 },
  'U19 Star - +10 potential', 'Musheer', 2024,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

createCard(632, 'Arshin Kulkarni', 'allrounder', 'India', '', 'standard',
  { batting: 70, bowling: 68, fielding: 68, leadership: 62, consistency: 65, popularity: 64 },
  'U19 Allrounder - +10 potential', 'Kulkarni', 2024,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

createCard(633, 'Adarsh Singh', 'batsman', 'India', '', 'standard',
  { batting: 72, bowling: 5, fielding: 68, leadership: 60, consistency: 66, popularity: 62 },
  'U19 Opener - +10 in youth', 'Adarsh', 2024,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(634, 'Saumy Pandey', 'bowler', 'India', '', 'standard',
  { batting: 15, bowling: 72, fielding: 68, leadership: 62, consistency: 68, popularity: 62 },
  'U19 Spinner - +12 left arm', 'Pandey', 2024,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(635, 'Rachin Ravindra', 'allrounder', 'New Zealand', 'Chennai Super Kings', 'standard',
  { batting: 74, bowling: 72, fielding: 75, leadership: 68, consistency: 76, popularity: 78 },
  'Young Talent - +15 potential', 'Rachin', 2022,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

createCard(636, 'Rehan Ahmed', 'bowler', 'England', '', 'standard',
  { batting: 35, bowling: 74, fielding: 70, leadership: 62, consistency: 68, popularity: 72 },
  'Young Legspinner - +15 googly', 'Rehan', 2022,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(637, 'Tom Hartley', 'bowler', 'England', '', 'standard',
  { batting: 32, bowling: 72, fielding: 68, leadership: 65, consistency: 70, popularity: 66 },
  'Left Arm Spinner - +10 in Tests', 'Hartley', 2024,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(638, 'Spencer Johnson', 'bowler', 'Australia', '', 'standard',
  { batting: 18, bowling: 76, fielding: 70, leadership: 62, consistency: 68, popularity: 70 },
  'Left Arm Express - +20 pace', 'Johnson', 2023,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

createCard(639, 'Tanveer Sangha', 'bowler', 'Australia', '', 'standard',
  { batting: 15, bowling: 74, fielding: 68, leadership: 62, consistency: 70, popularity: 68 },
  'Young Legspinner - +15 variations', 'Sangha', 2022,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(640, 'Noor Ahmad', 'bowler', 'Afghanistan', 'Gujarat Titans', 'standard',
  { batting: 15, bowling: 76, fielding: 70, leadership: 62, consistency: 72, popularity: 72 },
  'Young Mystery - +15 googly', 'Noor', 2022,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(641, 'Kyle Mayers', 'allrounder', 'West Indies', '', 'standard',
  { batting: 74, bowling: 70, fielding: 72, leadership: 68, consistency: 72, popularity: 74 },
  'Power Hitter - +15 in powerplay', 'Mayers', 2021,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

createCard(642, 'Josh Little', 'bowler', 'Ireland', '', 'standard',
  { batting: 18, bowling: 74, fielding: 68, leadership: 62, consistency: 70, popularity: 68 },
  'Left Arm Pacer - +15 in T20s', 'Little', 2022,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

// ==================== IDs 661-680: T20 LEAGUE SPECIALISTS ====================

createCard(643, 'Ravi Bopara', 'allrounder', 'England', '', 'standard',
  { batting: 74, bowling: 72, fielding: 75, leadership: 70, consistency: 76, popularity: 76 },
  'T20 Globetrotter - +15 experience', 'Bopara', 2015,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

createCard(644, 'Colin Ingram', 'batsman', 'South Africa', '', 'standard',
  { batting: 74, bowling: 5, fielding: 72, leadership: 68, consistency: 74, popularity: 72 },
  'T20 Specialist - +15 power hitting', 'Ingram', 2018,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(645, 'Rilee Rossouw', 'batsman', 'South Africa', '', 'standard',
  { batting: 78, bowling: 5, fielding: 72, leadership: 65, consistency: 74, popularity: 76 },
  'T360 Specialist - +20 power hitting', 'Rossouw', 2022,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(646, 'James Vince', 'batsman', 'England', '', 'standard',
  { batting: 76, bowling: 5, fielding: 74, leadership: 70, consistency: 76, popularity: 74 },
  'Elegant Batsman - +15 in T20s', 'Vince', 2021,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(647, 'Sam Billings', 'wicketkeeper', 'England', '', 'standard',
  { batting: 72, bowling: 5, fielding: 82, leadership: 75, consistency: 74, popularity: 74 },
  'T20 Keeper - +15 finishing', 'Billings', 2020,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(648, 'Alex Carey', 'wicketkeeper', 'Australia', '', 'standard',
  { batting: 74, bowling: 5, fielding: 84, leadership: 75, consistency: 78, popularity: 76 },
  'Test Keeper - +15 keeping', 'Carey', 2021,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(649, 'Ben McDermott', 'batsman', 'Australia', '', 'standard',
  { batting: 76, bowling: 5, fielding: 72, leadership: 65, consistency: 70, popularity: 72 },
  'T20 Opener - +15 powerplay', 'McDermott', 2022,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(650, 'Tim Seifert', 'wicketkeeper', 'New Zealand', '', 'standard',
  { batting: 74, bowling: 5, fielding: 80, leadership: 68, consistency: 72, popularity: 74 },
  'Aggressive Keeper - +15 in T20s', 'Seifert', 2020,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

// ==================== IDs 681-700: FINAL STANDARD RARITY - ROLE PLAYERS ====================

createCard(651, 'Cheteshwar Pujara', 'batsman', 'India', '', 'standard',
  { batting: 80, bowling: 5, fielding: 75, leadership: 78, consistency: 90, popularity: 80 },
  'Test Specialist Ultimate - +25 in Tests', 'Pujara', 2018,
  { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(652, 'Ajinkya Rahane', 'batsman', 'India', '', 'standard',
  { batting: 78, bowling: 5, fielding: 82, leadership: 85, consistency: 84, popularity: 82 },
  'Test Veteran - +20 in Tests', 'Rahane', 2021,
  { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(653, 'Umesh Yadav', 'bowler', 'India', '', 'standard',
  { batting: 22, bowling: 78, fielding: 70, leadership: 68, consistency: 72, popularity: 76 },
  'Indian Pacer - +15 at home', 'Umesh', 2018,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

createCard(654, 'Jaydev Unadkat', 'bowler', 'India', '', 'standard',
  { batting: 28, bowling: 76, fielding: 70, leadership: 68, consistency: 74, popularity: 72 },
  'Left Arm Pacer - +15 in IPL', 'Unadkat', 2017,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

createCard(655, 'Krunal Pandya', 'allrounder', 'India', 'Lucknow Super Giants', 'standard',
  { batting: 70, bowling: 74, fielding: 75, leadership: 72, consistency: 74, popularity: 78 },
  'IPL Allrounder - +12 both', 'Krunal', 2021,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

createCard(656, 'Deepak Hooda', 'batsman', 'India', '', 'standard',
  { batting: 74, bowling: 65, fielding: 70, leadership: 68, consistency: 72, popularity: 74 },
  'Utility Player - +12 all-round', 'Hooda', 2022,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

createCard(657, 'Venkatesh Iyer', 'allrounder', 'India', 'Kolkata Knight Riders', 'standard',
  { batting: 76, bowling: 70, fielding: 74, leadership: 68, consistency: 72, popularity: 78 },
  'Tall Opener - +15 against pace', 'Venkatesh', 2022,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

createCard(658, 'Rahul Tripathi', 'batsman', 'India', 'Sunrisers Hyderabad', 'standard',
  { batting: 76, bowling: 5, fielding: 74, leadership: 68, consistency: 74, popularity: 76 },
  'Consistent Middle Order - +15 in IPL', 'Tripathi', 2021,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(659, 'Devdutt Padikkal', 'batsman', 'India', 'Rajasthan Royals', 'standard',
  { batting: 74, bowling: 5, fielding: 70, leadership: 65, consistency: 70, popularity: 74 },
  'Elegant Opener - +12 against spin', 'Padikkal', 2021,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

createCard(660, 'Riyan Parag', 'allrounder', 'India', 'Rajasthan Royals', 'standard',
  { batting: 70, bowling: 68, fielding: 72, leadership: 65, consistency: 65, popularity: 72 },
  'Young Talent - +10 potential', 'Parag', 2022,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

// ==================== IDs 661-760: MOST CRITICAL MISSING BIG NAMES ====================

// Vinoo Mankad
createCard(661, 'Vinoo Mankad', 'allrounder', 'India', '', 'legendary',
  { batting: 84, bowling: 88, fielding: 75, leadership: 82, consistency: 90, popularity: 88 },
  'India\'s Greatest Allrounder - +25 both stats', 'Mankad', 1952,
  { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: true, goatEdition: true }),

// Lala Amarnath
createCard(662, 'Lala Amarnath', 'allrounder', 'India', '', 'legendary',
  { batting: 86, bowling: 82, fielding: 70, leadership: 92, consistency: 88, popularity: 86 },
  'First Indian Test Captain - +20 leadership', 'Amarnath', 1947,
  { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: true, goatEdition: true }),

// Mohinder Amarnath - 1983 WC Hero
createCard(663, 'Mohinder Amarnath', 'allrounder', 'India', '', 'legendary',
  { batting: 88, bowling: 84, fielding: 80, leadership: 85, consistency: 90, popularity: 92 },
  '1983 WC Hero - +25 in knockouts', 'Jimmy', 1983,
  { worldCupWinner: true, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: true, goatEdition: true }),

// Navjot Singh Sidhu
createCard(664, 'Navjot Sidhu', 'batsman', 'India', '', 'epic',
  { batting: 86, bowling: 5, fielding: 70, leadership: 68, consistency: 84, popularity: 88 },
  'Aggressive Opener - +20 in powerplay', 'Sidhu', 1993,
  { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: false }),

// Nayan Mongia
createCard(665, 'Nayan Mongia', 'wicketkeeper', 'India', '', 'epic',
  { batting: 72, bowling: 5, fielding: 90, leadership: 70, consistency: 84, popularity: 80 },
  'Best Gloves of 90s - +25 wicketkeeping', 'Mongia', 1995,
  { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: false }),

// Ashish Nehra
createCard(666, 'Ashish Nehra', 'bowler', 'India', 'Chennai Super Kings', 'epic',
  { batting: 18, bowling: 86, fielding: 65, leadership: 68, consistency: 70, popularity: 84 },
  '6/23 in WC 2003 - +25 in World Cups', 'Nehra', 2003,
  { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: true, allRounder: false, goatEdition: false }),

// Hanif Mohammad - Little Master of Pakistan
createCard(667, 'Hanif Mohammad', 'batsman', 'Pakistan', '', 'mythic',
  { batting: 94, bowling: 5, fielding: 70, leadership: 80, consistency: 96, popularity: 90 },
  'Little Master - +30 in Tests', 'Hanif', 1958,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

// Mushtaq Mohammad
createCard(668, 'Mushtaq Mohammad', 'allrounder', 'Pakistan', '', 'legendary',
  { batting: 86, bowling: 84, fielding: 78, leadership: 85, consistency: 88, popularity: 86 },
  'Pakistan Allrounder Great - +20 both', 'Mushtaq', 1973,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: true }),

// Sarfraz Nawaz - Reverse Swing Pioneer
createCard(669, 'Sarfraz Nawaz', 'bowler', 'Pakistan', '', 'legendary',
  { batting: 35, bowling: 92, fielding: 70, leadership: 75, consistency: 86, popularity: 86 },
  'Reverse Swing Inventor - +25 swing', 'Sarfraz', 1979,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: true }),

// Abdul Razzaq
createCard(670, 'Abdul Razzaq', 'allrounder', 'Pakistan', '', 'legendary',
  { batting: 86, bowling: 88, fielding: 80, leadership: 75, consistency: 84, popularity: 92 },
  'Pakistan Allrounder - +25 both', 'Razzaq', 2005,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: false }),

// Misbah-ul-Haq - Mr. Cool
createCard(671, 'Misbah-ul-Haq', 'batsman', 'Pakistan', '', 'legendary',
  { batting: 90, bowling: 5, fielding: 75, leadership: 94, consistency: 94, popularity: 92 },
  'Mr. Cool - +25 in chases', 'Misbah', 2014,
  { worldCupWinner: false, iplCaptain: true, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

// Younis Khan
createCard(672, 'Younis Khan', 'batsman', 'Pakistan', '', 'mythic',
  { batting: 94, bowling: 15, fielding: 80, leadership: 90, consistency: 96, popularity: 94 },
  'Pakistan Test Legend - +30 in Tests', 'Younis', 2015,
  { worldCupWinner: false, iplCaptain: true, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

// Roshan Mahanama
createCard(673, 'Roshan Mahanama', 'batsman', 'Sri Lanka', '', 'epic',
  { batting: 80, bowling: 5, fielding: 88, leadership: 70, consistency: 84, popularity: 80 },
  'Partnership Record 576 - +20 fielding', 'Mahanama', 1997,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

// Romesh Kaluwitharana
createCard(674, 'Romesh Kaluwitharana', 'wicketkeeper', 'Sri Lanka', '', 'epic',
  { batting: 82, bowling: 5, fielding: 84, leadership: 68, consistency: 76, popularity: 86 },
  '1996 WC Opener - +20 powerplay', 'Kalu', 1996,
  { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

// Upul Chandana
createCard(675, 'Upul Chandana', 'bowler', 'Sri Lanka', '', 'rare',
  { batting: 55, bowling: 82, fielding: 80, leadership: 65, consistency: 78, popularity: 74 },
  'Legspinner - +15 variations', 'Chandana', 2002,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

// Russel Arnold
createCard(676, 'Russel Arnold', 'batsman', 'Sri Lanka', '', 'rare',
  { batting: 78, bowling: 5, fielding: 75, leadership: 68, consistency: 82, popularity: 76 },
  'Utility Player - +15 finishing', 'Arnold', 2003,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

// Thilan Samaraweera
createCard(677, 'Thilan Samaraweera', 'batsman', 'Sri Lanka', '', 'epic',
  { batting: 84, bowling: 65, fielding: 70, leadership: 70, consistency: 90, popularity: 78 },
  'Underrated Test Batsman - +20 in Tests', 'Samaraweera', 2009,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

// Wes Hall
createCard(678, 'Wes Hall', 'bowler', 'West Indies', '', 'legendary',
  { batting: 25, bowling: 94, fielding: 70, leadership: 75, consistency: 88, popularity: 90 },
  'Whispering Death - +25 pace', 'Hall', 1960,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: true }),

// Shivnarine Chanderpaul - The Crab
createCard(679, 'Shivnarine Chanderpaul', 'batsman', 'West Indies', '', 'mythic',
  { batting: 95, bowling: 15, fielding: 70, leadership: 72, consistency: 98, popularity: 92 },
  'Mr. Dependable - +30 consistency', 'Chanderpaul', 2008,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

// Ramnaresh Sarwan
createCard(680, 'Ramnaresh Sarwan', 'batsman', 'West Indies', '', 'legendary',
  { batting: 90, bowling: 35, fielding: 78, leadership: 80, consistency: 88, popularity: 86 },
  'Elegant Batsman - +20 in Tests', 'Sarwan', 2004,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

// Carl Hooper
createCard(681, 'Carl Hooper', 'allrounder', 'West Indies', '', 'legendary',
  { batting: 88, bowling: 84, fielding: 85, leadership: 82, consistency: 86, popularity: 88 },
  'Elegant Allrounder - +20 both', 'Hooper', 1999,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

// Kemar Roach
createCard(682, 'Kemar Roach', 'bowler', 'West Indies', '', 'legendary',
  { batting: 22, bowling: 92, fielding: 70, leadership: 68, consistency: 88, popularity: 84 },
  'WI Pace Leader - +20 in Tests', 'Roach', 2019,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

// Richie Benaud
createCard(683, 'Richie Benaud', 'allrounder', 'Australia', '', 'mythic',
  { batting: 75, bowling: 92, fielding: 80, leadership: 96, consistency: 94, popularity: 98 },
  'Legendary Captain & Commentator - +25 leadership', 'Benaud', 1962,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: true }),

// Bill Ponsford
createCard(684, 'Bill Ponsford', 'batsman', 'Australia', '', 'legendary',
  { batting: 95, bowling: 5, fielding: 70, leadership: 68, consistency: 94, popularity: 86 },
  'Double Century King - +25 in Tests', 'Ponsford', 1930,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

// Victor Trumper
createCard(685, 'Victor Trumper', 'batsman', 'Australia', '', 'legendary',
  { batting: 94, bowling: 15, fielding: 75, leadership: 70, consistency: 88, popularity: 90 },
  'Elegance Personified - +20 in Ashes', 'Trumper', 1902,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

// Alan Davidson
createCard(686, 'Alan Davidson', 'allrounder', 'Australia', '', 'legendary',
  { batting: 75, bowling: 92, fielding: 88, leadership: 80, consistency: 90, popularity: 88 },
  'Great Allrounder - +20 both', 'Davidson', 1960,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: true }),

// Rod Marsh
createCard(687, 'Rod Marsh', 'wicketkeeper', 'Australia', '', 'legendary',
  { batting: 75, bowling: 5, fielding: 94, leadership: 85, consistency: 90, popularity: 92 },
  'Great Wicketkeeper - +25 keeping', 'Marsh', 1977,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

// Merv Hughes
createCard(688, 'Merv Hughes', 'bowler', 'Australia', '', 'legendary',
  { batting: 35, bowling: 92, fielding: 70, leadership: 75, consistency: 85, popularity: 92 },
  'Merv the Swerve - +20 aggressive bowling', 'Hughes', 1992,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: true }),

// Michael Bevan - Greatest ODI Finisher
createCard(689, 'Michael Bevan', 'batsman', 'Australia', '', 'mythic',
  { batting: 94, bowling: 40, fielding: 88, leadership: 75, consistency: 96, popularity: 96 },
  'Greatest ODI Finisher - +30 in chases', 'Bevan', 1999,
  { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: true }),

// Jason Gillespie
createCard(690, 'Jason Gillespie', 'bowler', 'Australia', '', 'legendary',
  { batting: 35, bowling: 92, fielding: 75, leadership: 70, consistency: 90, popularity: 88 },
  'Dizzy - +20 accuracy', 'Gillespie', 2004,
  { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

// Brad Haddin
createCard(691, 'Brad Haddin', 'wicketkeeper', 'Australia', '', 'legendary',
  { batting: 82, bowling: 5, fielding: 90, leadership: 82, consistency: 84, popularity: 88 },
  'Aggressive Keeper - +20 batting', 'Haddin', 2014,
  { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

// Scott Boland - 6/7 MCG
createCard(692, 'Scott Boland', 'bowler', 'Australia', '', 'legendary',
  { batting: 18, bowling: 90, fielding: 70, leadership: 65, consistency: 92, popularity: 84 },
  '6/7 at MCG - +25 in Ashes', 'Boland', 2021,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

// Gary Kirsten
createCard(693, 'Gary Kirsten', 'batsman', 'South Africa', '', 'legendary',
  { batting: 90, bowling: 5, fielding: 75, leadership: 82, consistency: 94, popularity: 88 },
  'Solid Opener - +20 in Tests', 'Kirsten', 1999,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

// Jonty Rhodes - Greatest Fielder
createCard(694, 'Jonty Rhodes', 'fielder', 'South Africa', '', 'mythic',
  { batting: 82, bowling: 5, fielding: 100, leadership: 80, consistency: 88, popularity: 98 },
  'Greatest Fielder Ever - +40 fielding', 'Jonty', 1996,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

// Brian McMillan
createCard(695, 'Brian McMillan', 'allrounder', 'South Africa', '', 'epic',
  { batting: 78, bowling: 84, fielding: 80, leadership: 75, consistency: 86, popularity: 84 },
  'Big Mac - +15 both', 'McMillan', 1996,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: false }),

// Makhaya Ntini
createCard(696, 'Makhaya Ntini', 'bowler', 'South Africa', '', 'legendary',
  { batting: 22, bowling: 90, fielding: 70, leadership: 75, consistency: 86, popularity: 88 },
  'First Black SA Pacer - +20 in Tests', 'Ntini', 2003,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: true }),

// Vernon Philander
createCard(697, 'Vernon Philander', 'bowler', 'South Africa', '', 'legendary',
  { batting: 35, bowling: 92, fielding: 78, leadership: 70, consistency: 95, popularity: 86 },
  'Swing Master - +25 in Tests', 'Philander', 2012,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

// WG Grace - Father of Cricket
createCard(698, 'WG Grace', 'allrounder', 'England', '', 'mythic',
  { batting: 96, bowling: 88, fielding: 75, leadership: 94, consistency: 92, popularity: 100 },
  'Father of Cricket - +35 all stats', 'Grace', 1890,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: true }),

// Ranjitsinhji - Inventor of Leg Glance
createCard(699, 'KS Ranjitsinhji', 'batsman', 'England', '', 'mythic',
  { batting: 94, bowling: 5, fielding: 70, leadership: 75, consistency: 90, popularity: 92 },
  'Leg Glance Inventor - +25 innovation', 'Ranji', 1896,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

// Geoffrey Boycott
createCard(700, 'Geoffrey Boycott', 'batsman', 'England', '', 'legendary',
  { batting: 92, bowling: 5, fielding: 65, leadership: 70, consistency: 96, popularity: 88 },
  'Boycs - +25 in Tests', 'Boycott', 1977,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

// David Gower
createCard(701, 'David Gower', 'batsman', 'England', '', 'legendary',
  { batting: 92, bowling: 5, fielding: 75, leadership: 70, consistency: 88, popularity: 90 },
  'Elegant Left-hander - +20 stylish', 'Gower', 1985,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

// Graham Gooch
createCard(702, 'Graham Gooch', 'batsman', 'England', '', 'legendary',
  { batting: 93, bowling: 65, fielding: 75, leadership: 88, consistency: 92, popularity: 90 },
  'Run Machine - +25 in Tests', 'Gooch', 1990,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: true }),

// Darren Gough
createCard(703, 'Darren Gough', 'bowler', 'England', '', 'legendary',
  { batting: 35, bowling: 90, fielding: 75, leadership: 70, consistency: 86, popularity: 88 },
  'Dazzler - +20 in ODIs', 'Gough', 1999,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

// Simon Jones - Reverse Swing Hero
createCard(704, 'Simon Jones', 'bowler', 'England', '', 'legendary',
  { batting: 22, bowling: 92, fielding: 70, leadership: 65, consistency: 78, popularity: 86 },
  '2005 Ashes Hero - +25 reverse swing', 'Jones', 2005,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: true }),

// Graeme Swann
createCard(705, 'Graeme Swann', 'bowler', 'England', '', 'legendary',
  { batting: 45, bowling: 92, fielding: 78, leadership: 80, consistency: 90, popularity: 90 },
  'Off-spin Great - +20 in Tests', 'Swann', 2010,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

// Chris Woakes
createCard(706, 'Chris Woakes', 'allrounder', 'England', '', 'legendary',
  { batting: 75, bowling: 88, fielding: 82, leadership: 75, consistency: 88, popularity: 84 },
  'Allrounder at Home - +20 in England', 'Woakes', 2019,
  { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: false }),

// Richard Hadlee - Ultimate Version
createCard(707, 'Richard Hadlee', 'bowler', 'New Zealand', '', 'mythic',
  { batting: 72, bowling: 98, fielding: 82, leadership: 88, consistency: 98, popularity: 94 },
  'Greatest NZ Cricketer - +35 bowling', 'Hadlee', 1988,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: true }),

// Martin Crowe - Ultimate
createCard(708, 'Martin Crowe', 'batsman', 'New Zealand', '', 'mythic',
  { batting: 96, bowling: 55, fielding: 85, leadership: 92, consistency: 94, popularity: 92 },
  'NZ Batting Genius - +25 in Tests', 'Crowe', 1992,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: true }),

// Chris Cairns
createCard(709, 'Chris Cairns', 'allrounder', 'New Zealand', '', 'legendary',
  { batting: 86, bowling: 88, fielding: 80, leadership: 75, consistency: 84, popularity: 88 },
  'NZ Allrounder Great - +20 both', 'Cairns', 2000,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: false }),

// Nathan Astle
createCard(710, 'Nathan Astle', 'batsman', 'New Zealand', '', 'epic',
  { batting: 86, bowling: 70, fielding: 80, leadership: 72, consistency: 82, popularity: 86 },
  'Fastest Double Century - +25 power hitting', 'Astle', 2002,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

// Kyle Jamieson
createCard(711, 'Kyle Jamieson', 'bowler', 'New Zealand', '', 'legendary',
  { batting: 45, bowling: 90, fielding: 78, leadership: 70, consistency: 86, popularity: 84 },
  'Tall Tower - +25 bounce', 'Jamieson', 2021,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

// Mashrafe Mortaza - BD Captain
createCard(712, 'Mashrafe Mortaza', 'bowler', 'Bangladesh', '', 'legendary',
  { batting: 55, bowling: 86, fielding: 72, leadership: 94, consistency: 82, popularity: 90 },
  'Narail Express - +25 leadership', 'Mashrafe', 2015,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: true }),

// Abdur Razzak
createCard(713, 'Abdur Razzak', 'bowler', 'Bangladesh', '', 'epic',
  { batting: 35, bowling: 84, fielding: 70, leadership: 72, consistency: 84, popularity: 78 },
  'Left-arm Spinner - +15 in ODIs', 'Razzak', 2007,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

// Andy Flower - Ultimate
createCard(714, 'Andy Flower', 'wicketkeeper', 'Zimbabwe', '', 'mythic',
  { batting: 96, bowling: 5, fielding: 92, leadership: 90, consistency: 96, popularity: 94 },
  'Greatest Zimbabwean - +30 batting', 'Flower', 2001,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

// Brendan Taylor
createCard(715, 'Brendan Taylor', 'wicketkeeper', 'Zimbabwe', '', 'legendary',
  { batting: 88, bowling: 5, fielding: 84, leadership: 85, consistency: 86, popularity: 86 },
  'Zimbabwe Legend - +20 in World Cups', 'Taylor', 2015,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

// Elton Chigumbura
createCard(716, 'Elton Chigumbura', 'allrounder', 'Zimbabwe', '', 'epic',
  { batting: 80, bowling: 78, fielding: 75, leadership: 85, consistency: 80, popularity: 80 },
  'Zimbabwe Captain - +15 both', 'Chigumbura', 2014,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

// Sikandar Raza - Legendary
createCard(717, 'Sikandar Raza', 'allrounder', 'Zimbabwe', '', 'legendary',
  { batting: 88, bowling: 84, fielding: 82, leadership: 82, consistency: 90, popularity: 86 },
  'Zimbabwe Star - +25 all-round', 'Raza', 2022,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

// Paul Stirling - Legendary
createCard(718, 'Paul Stirling', 'batsman', 'Ireland', '', 'legendary',
  { batting: 88, bowling: 40, fielding: 78, leadership: 82, consistency: 84, popularity: 84 },
  'Ireland\'s Greatest - +20 in T20s', 'Stirling', 2019,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

// Kevin O'Brien - Legendary
createCard(719, 'Kevin O\'Brien', 'allrounder', 'Ireland', '', 'legendary',
  { batting: 86, bowling: 80, fielding: 75, leadership: 78, consistency: 82, popularity: 86 },
  '2011 WC Hero - +25 fastest century', 'O\'Brien', 2011,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: true }),

// Bas de Leede - Legendary
createCard(720, 'Bas de Leede', 'allrounder', 'Netherlands', '', 'legendary',
  { batting: 84, bowling: 82, fielding: 80, leadership: 75, consistency: 84, popularity: 80 },
  'Dutch Hero - +25 in World Cups', 'de Leede', 2023,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

// Sandeep Lamichhane
createCard(721, 'Sandeep Lamichhane', 'bowler', 'Nepal', '', 'epic',
  { batting: 25, bowling: 86, fielding: 72, leadership: 68, consistency: 84, popularity: 82 },
  'Nepal\'s Finest - +20 leg spin', 'Lamichhane', 2018,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

// David Wiese
createCard(722, 'David Wiese', 'allrounder', 'Namibia', '', 'epic',
  { batting: 78, bowling: 80, fielding: 75, leadership: 72, consistency: 78, popularity: 78 },
  'Namibia Star - +20 in T20s', 'Wiese', 2021,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: false }),

// ==================== WOMEN'S CRICKET LEGENDS ====================

// Mithali Raj - Ultimate
createCard(723, 'Mithali Raj', 'batsman', 'India', '', 'mythic',
  { batting: 96, bowling: 5, fielding: 82, leadership: 94, consistency: 98, popularity: 96 },
  'Lady Tendulkar Ultimate - +30 in ODIs', 'Mithali', 2019,
  { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: true }),

// Jhulan Goswami - Ultimate
createCard(724, 'Jhulan Goswami', 'bowler', 'India', '', 'mythic',
  { batting: 35, bowling: 97, fielding: 78, leadership: 85, consistency: 96, popularity: 94 },
  'Leading Wicket Taker Ultimate - +30 pace', 'Jhulan', 2017,
  { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: true, allRounder: false, goatEdition: true }),

// Harmanpreet Kaur - Legendary
createCard(725, 'Harmanpreet Kaur', 'batsman', 'India', '', 'legendary',
  { batting: 92, bowling: 72, fielding: 86, leadership: 90, consistency: 88, popularity: 92 },
  '171* in WC Semi - +25 power hitting', 'Harman', 2017,
  { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: true, goatEdition: false }),

// Smriti Mandhana - Legendary
createCard(726, 'Smriti Mandhana', 'batsman', 'India', '', 'legendary',
  { batting: 94, bowling: 5, fielding: 88, leadership: 75, consistency: 90, popularity: 94 },
  'Elegant Leftie Ultimate - +20 in ODIs', 'Mandhana', 2018,
  { worldCupWinner: false, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: false }),

// Ellyse Perry - Ultimate
createCard(727, 'Ellyse Perry', 'allrounder', 'Australia', '', 'mythic',
  { batting: 96, bowling: 96, fielding: 95, leadership: 92, consistency: 98, popularity: 98 },
  'Ultimate Women\'s Allrounder - +40 both', 'Perry', 2019,
  { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: true }),

// Meg Lanning - Ultimate
createCard(728, 'Meg Lanning', 'batsman', 'Australia', '', 'mythic',
  { batting: 97, bowling: 5, fielding: 85, leadership: 96, consistency: 95, popularity: 96 },
  'Most Centuries Ultimate - +25 in World Cups', 'Lanning', 2022,
  { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

// Alyssa Healy
createCard(729, 'Alyssa Healy', 'wicketkeeper', 'Australia', '', 'legendary',
  { batting: 94, bowling: 5, fielding: 96, leadership: 80, consistency: 90, popularity: 94 },
  'Record 170 in WC Final - +30 in finals', 'Healy', 2020,
  { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: false }),

// Sophie Devine
createCard(730, 'Sophie Devine', 'allrounder', 'New Zealand', '', 'legendary',
  { batting: 92, bowling: 86, fielding: 88, leadership: 92, consistency: 88, popularity: 90 },
  'NZ Powerhouse - +20 both', 'Devine', 2020,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: false }),

// Suzie Bates
createCard(731, 'Suzie Bates', 'allrounder', 'New Zealand', '', 'legendary',
  { batting: 90, bowling: 82, fielding: 85, leadership: 88, consistency: 90, popularity: 88 },
  'NZ Legend - +20 in ODIs', 'Bates', 2016,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

// Stafanie Taylor
createCard(732, 'Stafanie Taylor', 'allrounder', 'West Indies', '', 'legendary',
  { batting: 92, bowling: 88, fielding: 85, leadership: 90, consistency: 92, popularity: 90 },
  'WI Legend - +20 both', 'Taylor', 2016,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

// Deandra Dottin
createCard(733, 'Deandra Dottin', 'batsman', 'West Indies', '', 'legendary',
  { batting: 94, bowling: 80, fielding: 82, leadership: 75, consistency: 82, popularity: 92 },
  'Power Hitter - +30 six hitting', 'Dottin', 2010,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

// Hayley Matthews
createCard(734, 'Hayley Matthews', 'allrounder', 'West Indies', '', 'legendary',
  { batting: 90, bowling: 88, fielding: 90, leadership: 85, consistency: 88, popularity: 88 },
  'WI Allrounder Star - +20 both', 'Matthews', 2022,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: false }),

// Sarah Taylor - Best Women's Keeper
createCard(735, 'Sarah Taylor', 'wicketkeeper', 'England', '', 'legendary',
  { batting: 86, bowling: 5, fielding: 98, leadership: 75, consistency: 90, popularity: 92 },
  'Best Women\'s Keeper - +35 keeping', 'Taylor', 2014,
  { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

// Charlotte Edwards
createCard(736, 'Charlotte Edwards', 'batsman', 'England', '', 'legendary',
  { batting: 92, bowling: 40, fielding: 80, leadership: 94, consistency: 94, popularity: 90 },
  'England Legend - +25 leadership', 'Edwards', 2014,
  { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: true }),

// Katherine Brunt
createCard(737, 'Katherine Brunt', 'bowler', 'England', '', 'legendary',
  { batting: 45, bowling: 92, fielding: 78, leadership: 80, consistency: 90, popularity: 86 },
  'England Pace Leader - +20 aggression', 'Brunt', 2017,
  { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: false }),

// Anya Shrubsole - 2017 WC Final Hero
createCard(738, 'Anya Shrubsole', 'bowler', 'England', '', 'legendary',
  { batting: 28, bowling: 92, fielding: 72, leadership: 75, consistency: 88, popularity: 90 },
  '2017 WC Final Hero - +30 in finals', 'Shrubsole', 2017,
  { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: true }),

// ==================== FINAL ULTIMATE GOAT CARDS FOR COMPLETION ====================

// Sir Donald Bradman - The Greatest of All Time (Ultimate)
createCard(739, 'Don Bradman', 'batsman', 'Australia', '', 'mythic',
  { batting: 100, bowling: 30, fielding: 80, leadership: 95, consistency: 100, popularity: 100 },
  'THE GREATEST OF ALL TIME - +50 batting average', 'The Don Ultimate', 1930,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

// Sachin Tendulkar - God of Cricket Final
createCard(740, 'Sachin Tendulkar', 'batsman', 'India', '', 'mythic',
  { batting: 100, bowling: 35, fielding: 88, leadership: 90, consistency: 100, popularity: 100 },
  'GOD OF CRICKET - +45 all time', 'Sachin GOAT', 1998,
  { worldCupWinner: true, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: true }),

// Virat Kohli - Modern Great Final
createCard(741, 'Virat Kohli', 'batsman', 'India', 'Royal Challengers Bangalore', 'mythic',
  { batting: 100, bowling: 35, fielding: 95, leadership: 96, consistency: 100, popularity: 100 },
  'MODERN GREAT ULTIMATE - +40 in chases', 'Kohli GOAT', 2023,
  { worldCupWinner: true, iplCaptain: false, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: true }),

// Garfield Sobers - Greatest Allrounder
createCard(742, 'Garfield Sobers', 'allrounder', 'West Indies', '', 'mythic',
  { batting: 98, bowling: 96, fielding: 95, leadership: 92, consistency: 98, popularity: 100 },
  'GREATEST ALLROUNDER - +45 both stats', 'Sobers GOAT', 1968,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: true }),

// Imran Khan - Ultimate Leader
createCard(743, 'Imran Khan', 'allrounder', 'Pakistan', '', 'mythic',
  { batting: 92, bowling: 96, fielding: 85, leadership: 100, consistency: 96, popularity: 100 },
  'ULTIMATE LEADER - +50 leadership', 'Imran GOAT', 1992,
  { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: true }),

// Shane Warne - King of Spin Final
createCard(744, 'Shane Warne', 'bowler', 'Australia', 'Rajasthan Royals', 'mythic',
  { batting: 45, bowling: 100, fielding: 85, leadership: 96, consistency: 98, popularity: 100 },
  'KING OF SPIN ULTIMATE - +50 leg spin', 'Warne GOAT', 1999,
  { worldCupWinner: true, iplCaptain: true, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

// Muttiah Muralitharan - Highest Wicket Taker Final
createCard(745, 'Muttiah Muralitharan', 'bowler', 'Sri Lanka', '', 'mythic',
  { batting: 25, bowling: 100, fielding: 75, leadership: 85, consistency: 100, popularity: 100 },
  'HIGHEST WICKET TAKER - +50 spin variations', 'Murali GOAT', 2007,
  { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

// Jacques Kallis - GOAT Allrounder Final
createCard(746, 'Jacques Kallis', 'allrounder', 'South Africa', '', 'mythic',
  { batting: 98, bowling: 96, fielding: 92, leadership: 90, consistency: 100, popularity: 98 },
  'GOAT ALLROUNDER ULTIMATE - +45 both', 'Kallis GOAT', 2007,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: true, goatEdition: true }),

// MS Dhoni - Captain Cool Final
createCard(747, 'MS Dhoni', 'wicketkeeper', 'India', 'Chennai Super Kings', 'mythic',
  { batting: 95, bowling: 15, fielding: 96, leadership: 100, consistency: 99, popularity: 100 },
  'CAPTAIN COOL ULTIMATE - +45 in finals', 'Dhoni GOAT', 2011,
  { worldCupWinner: true, iplCaptain: true, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: true }),

// Wasim Akram - Sultan Final
createCard(748, 'Wasim Akram', 'bowler', 'Pakistan', '', 'mythic',
  { batting: 52, bowling: 100, fielding: 82, leadership: 92, consistency: 98, popularity: 100 },
  'SULTAN OF SWING ULTIMATE - +50 swing', 'Wasim GOAT', 1992,
  { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: true }),

// Ricky Ponting - Winning Captain Final
createCard(749, 'Ricky Ponting', 'batsman', 'Australia', '', 'mythic',
  { batting: 98, bowling: 20, fielding: 94, leadership: 100, consistency: 96, popularity: 100 },
  'WINNING CAPTAIN ULTIMATE - +40 in World Cups', 'Ponting GOAT', 2003,
  { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

// Vivian Richards - King Final
createCard(750, 'Vivian Richards', 'batsman', 'West Indies', '', 'mythic',
  { batting: 99, bowling: 80, fielding: 92, leadership: 96, consistency: 96, popularity: 100 },
  'KING VIV ULTIMATE - +50 domination', 'Richards GOAT', 1983,
  { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: true }),

// AB de Villiers - 360 Final
createCard(751, 'AB de Villiers', 'batsman', 'South Africa', '', 'mythic',
  { batting: 100, bowling: 30, fielding: 100, leadership: 90, consistency: 98, popularity: 100 },
  'MR 360 ULTIMATE - +50 innovative shots', 'ABD GOAT', 2015,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

// Chris Gayle - Universe Boss Final
createCard(752, 'Chris Gayle', 'batsman', 'West Indies', '', 'mythic',
  { batting: 100, bowling: 35, fielding: 78, leadership: 85, consistency: 92, popularity: 100 },
  'UNIVERSE BOSS ULTIMATE - +55 power hitting', 'Gayle GOAT', 2013,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

// Kapil Dev - 1983 Hero Final
createCard(753, 'Kapil Dev', 'allrounder', 'India', '', 'mythic',
  { batting: 92, bowling: 96, fielding: 85, leadership: 98, consistency: 96, popularity: 100 },
  '1983 HERO ULTIMATE - +45 all-round', 'Kapil GOAT', 1983,
  { worldCupWinner: true, iplCaptain: false, indianLegend: true, fastBowler: true, allRounder: true, goatEdition: true }),

// Brian Lara - Prince Final
createCard(754, 'Brian Lara', 'batsman', 'West Indies', '', 'mythic',
  { batting: 100, bowling: 20, fielding: 85, leadership: 85, consistency: 98, popularity: 100 },
  'PRINCE OF PORT OF SPAIN ULTIMATE - +45 records', 'Lara GOAT', 2004,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true }),

// Rahul Dravid - The Wall Final
createCard(755, 'Rahul Dravid', 'batsman', 'India', '', 'mythic',
  { batting: 96, bowling: 15, fielding: 85, leadership: 98, consistency: 100, popularity: 96 },
  'THE WALL ULTIMATE - +40 defense', 'Dravid GOAT', 2002,
  { worldCupWinner: false, iplCaptain: true, indianLegend: true, fastBowler: false, allRounder: false, goatEdition: true }),

// Glenn McGrath - Mr. Accurate Final
createCard(756, 'Glenn McGrath', 'bowler', 'Australia', '', 'mythic',
  { batting: 15, bowling: 98, fielding: 85, leadership: 85, consistency: 100, popularity: 96 },
  'MR ACCURATE ULTIMATE - +40 line & length', 'McGrath GOAT', 2003,
  { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: true }),

// Dale Steyn - Steyn Gun Final
createCard(757, 'Dale Steyn', 'bowler', 'South Africa', '', 'mythic',
  { batting: 20, bowling: 98, fielding: 78, leadership: 85, consistency: 96, popularity: 96 },
  'STEYN GUN ULTIMATE - +40 pace & swing', 'Steyn GOAT', 2010,
  { worldCupWinner: false, iplCaptain: false, indianLegend: false, fastBowler: true, allRounder: false, goatEdition: true }),

// Jasprit Bumrah - Yorker King Final
createCard(758, 'Jasprit Bumrah', 'bowler', 'India', 'Mumbai Indians', 'mythic',
  { batting: 25, bowling: 100, fielding: 88, leadership: 78, consistency: 100, popularity: 98 },
  'YORKER KING ULTIMATE - +45 in death overs', 'Bumrah GOAT', 2020,
  { worldCupWinner: true, iplCaptain: false, indianLegend: true, fastBowler: true, allRounder: false, goatEdition: true }),

// Ben Stokes - Ultimate Finisher Final
createCard(759, 'Ben Stokes', 'allrounder', 'England', '', 'mythic',
  { batting: 98, bowling: 96, fielding: 96, leadership: 98, consistency: 96, popularity: 100 },
  'ULTIMATE FINISHER - +50 in pressure', 'Stokes GOAT', 2019,
  { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: true, goatEdition: true }),

// Joe Root - Run Machine Final
createCard(760, 'Joe Root', 'batsman', 'England', '', 'mythic',
  { batting: 98, bowling: 38, fielding: 88, leadership: 92, consistency: 100, popularity: 96 },
  'RUN MACHINE ULTIMATE - +40 in Tests', 'Root GOAT', 2021,
  { worldCupWinner: true, iplCaptain: false, indianLegend: false, fastBowler: false, allRounder: false, goatEdition: true })
    ];

// Temporary debug - add to cardsData.ts
console.log('Rarity counts:', {
  common: cardsData.filter(c => c.rarity === 'common').length,
  standard: cardsData.filter(c => c.rarity === 'standard').length,
  rare: cardsData.filter(c => c.rarity === 'rare').length,
  epic: cardsData.filter(c => c.rarity === 'epic').length,
  elite: cardsData.filter(c => c.rarity === 'elite').length,
  legendary: cardsData.filter(c => c.rarity === 'legendary').length,
  mythic: cardsData.filter(c => c.rarity === 'mythic').length,
});

export const getAllCards = (): Card[] => cardsData;

export const getCardById = (id: number): Card | undefined => cardsData.find(card => card.id === id);

export const getCardsByRarity = (rarity: Rarity): Card[] => cardsData.filter(card => card.rarity === rarity);

export const getCardsByCountry = (country: string): Card[] => cardsData.filter(card => card.country === country);

export const getCardsByRole = (role: PlayerRole): Card[] => cardsData.filter(card => card.role === role);