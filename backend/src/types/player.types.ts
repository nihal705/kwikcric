export interface Player {
  id: string;
  uniqueIdentifier: string;
  fullName: string;
  firstName: string | null;
  lastName: string | null;
  commonName: string | null;
  country: string;
  countryCode: string | null;
  role: string | null;
  battingStyle: string | null;
  bowlingStyle: string | null;
  bowlingArm: string | null;
  imageUrl: string | null;
  thumbUrl: string | null;
  bio: string | null;
  dateOfBirth: Date | null;
  birthPlace: string | null;
  heightCm: number | null;
  nickname: string | null;
  debutOdi: Date | null;
  debutTest: Date | null;
  debutT20: Date | null;
  lastPlayed: Date | null;
  isActive: boolean;
  isLegend: boolean;
  iccRankingBatting: number | null;
  iccRankingBowling: number | null;
  iccRankingAllrounder: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlayerStats {
  id: string;
  playerId: string;
  format: string;
  matches: number;
  innings: number;
  notOut: number;
  runs: number;
  highestScore: number | null;
  highestScoreNotout: boolean;
  ballsFaced: number;
  hundreds: number;
  fifties: number;
  fours: number;
  sixes: number;
  battingAverage: number | null;
  strikeRate: number | null;
  ducks: number;
  wickets: number;
  ballsBowled: number;
  runsConceded: number;
  maidens: number;
  bestBowling: string | null;
  bestBowlingFigures: string | null;
  fiveWickets: number;
  tenWickets: number;
  bowlingAverage: number | null;
  economyRate: number | null;
  bowlingStrikeRate: number | null;
  catches: number;
  stumpings: number;
  runOuts: number;
  playerOfMatch: number;
  playerOfSeries: number;
  year: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlayerWithStats extends Player {
  stats: PlayerStats[];
  careerHighlights?: {
    bestBatting?: { runs: number; vs: string; venue: string; year: number };
    bestBowling?: { wickets: number; figures: string; vs: string; venue: string; year: number };
    achievements: string[];
  };
}

export type PlayerRole = 'Batsman' | 'Bowler' | 'All-rounder' | 'Wicket-keeper';
export type BattingStyle = 'Right-hand bat' | 'Left-hand bat';
export type BowlingStyle = 'Right-arm fast' | 'Right-arm medium' | 'Right-arm offbreak' | 'Right-arm legbreak' | 'Left-arm fast' | 'Left-arm medium' | 'Left-arm orthodox' | 'Left-arm wrist-spin';
export type CricketFormat = 'Test' | 'ODI' | 'T20I' | 'IPL' | 'BBL' | 'PSL' | 'CPL' | 'The Hundred';