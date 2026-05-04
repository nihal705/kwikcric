export interface Tournament {
  id: string;
  name: string;
  shortName: string | null;
  tournamentType: string;
  gender: string;
  season: string;
  year: number;
  hostCountry: string | null;
  hostCities: string[] | null;
  startDate: Date | null;
  endDate: Date | null;
  totalMatches: number | null;
  totalTeams: number | null;
  winnerId: string | null;
  winnerTeamId: string | null;
  runnerUpId: string | null;
  runnerUpTeamId: string | null;
  playerOfTournamentId: string | null;
  mostRunsPlayerId: string | null;
  mostRunsValue: number | null;
  mostWicketsPlayerId: string | null;
  mostWicketsValue: number | null;
  prizePoolUsd: number | null;
  winningPrizeUsd: number | null;
  logoUrl: string | null;
  status: 'upcoming' | 'ongoing' | 'completed';
  format: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Team {
  id: string;
  name: string;
  shortCode: string | null;
  fullName: string | null;
  country: string | null;
  countryCode: string | null;
  city: string | null;
  homeGround: string | null;
  coach: string | null;
  captainId: string | null;
  viceCaptainId: string | null;
  teamLogoUrl: string | null;
  jerseyImageUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  foundedYear: number | null;
  championships: number;
  teamType: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Match {
  id: string;
  tournamentId: string;
  matchNumber: number | null;
  matchDate: Date;
  matchTime: string | null;
  venueName: string;
  venueCity: string | null;
  venueCountry: string | null;
  team1Id: string;
  team2Id: string;
  tossWinnerId: string | null;
  tossDecision: string | null;
  winnerTeamId: string | null;
  winMargin: string | null;
  winMarginRuns: number | null;
  winMarginWickets: number | null;
  manOfMatchId: string | null;
  playerOfMatchId: string | null;
  umpire1: string | null;
  umpire2: string | null;
  thirdUmpire: string | null;
  matchReferee: string | null;
  status: 'scheduled' | 'live' | 'completed' | 'abandoned';
  currentScore: string | null;
  currentOvers: string | null;
  scorecardJson: any | null;
  commentaryJson: any | null;
  highlightsUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PointsTableEntry {
  teamId: string;
  teamName: string;
  teamLogo: string | null;
  matchesPlayed: number;
  matchesWon: number;
  matchesLost: number;
  matchesTied: number;
  matchesNr: number;
  points: number;
  netRunRate: number;
  position: number;
  forRuns: number;
  forWickets: number;
  againstRuns: number;
  againstWickets: number;
}

export type TournamentType = 'World Cup' | 'T20 World Cup' | 'Champions Trophy' | 'IPL' | 'BBL' | 'PSL' | 'CPL' | 'The Hundred' | 'Test Series' | 'ODI Series' | 'T20I Series';
export type MatchStatus = 'scheduled' | 'live' | 'completed' | 'abandoned';
export type TossDecision = 'bat' | 'field';