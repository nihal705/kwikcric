// World Cup Types
export interface Tournament {
  id: number;
  year: number;
  tournament_type: string;
  host_country: string;
  winner_name: string;
  runner_up_name: string;
  winner_captain: string;
  player_of_tournament: string;
  total_matches: number;
  total_teams: number;
  final_match_venue: string;
  final_match_date: string;
  total_sixes: number;   
  total_centuries: number; 
  result_note?: string;
}

export interface TeamRanking {
  rank: number;
  team_name: string;
  titles_won: number;
  runner_up_count: number;
  semi_final_count: number;
  matches_played: number;
  matches_won: number;
  win_percentage: number;
}

export interface Match {
  id: number;
  match_type: string;
  stage: string;
  match_number: number;
  team1_name: string;
  team2_name: string;
  team1_score: number | null;
  team2_score: number | null;
  team1_wickets: number | null;
  team2_wickets: number | null;
  team1_overs: number | null;
  team2_overs: number | null;
  winner_name: string;
  winner_margin: number | null;
  margin_type: string;
  venue: string;
  match_date: string;
  man_of_match_name: string;
  is_final: boolean;
  // New fields for abandoned matches
  is_abandoned?: boolean;
  abandonment_reason?: string;
  result_note?: string;
}

export interface PointsTableEntry {
  group_name: string;
  team_name: string;
  matches_played: number;
  matches_won: number;
  matches_lost: number;
  matches_tied: number;
  matches_nr: number;
  points: number;
  net_run_rate: number;
}

export interface TournamentStats {
  most_runs_player: string;
  most_runs_value: number;
  most_wickets_player: string;
  most_wickets_value: number;
  most_sixes_player: string;
  most_sixes_value: number;
  most_hundreds_player: string;
  most_hundreds_value: number;
}

export interface FullTournamentDetails {
  tournament: Tournament;
  matches: Match[];
  pointsTable: PointsTableEntry[];
  stats: TournamentStats;
  teamRankings: TeamRanking[];
}

// Add to existing types.ts

export interface TournamentLeader {
  player_name: string;
  runs?: number;
  wickets?: number;
  sixes?: number;
  hundreds?: number;
}

export interface TournamentStatsData {
  mostRuns: TournamentLeader[];
  mostWickets: TournamentLeader[];
  mostSixes: TournamentLeader[];
  mostHundreds: TournamentLeader[];
  playerOfTournament?: { player_name: string };
}

export interface AllTimeRecord {
  player_name: string;
  runs?: number;
  wickets?: number;
  sixes?: number;
  hundreds?: number;
  matches_played?: number;
}

export interface AllTimeRecordsData {
  mostRuns: AllTimeRecord[];
  mostWickets: AllTimeRecord[];
  mostSixes: AllTimeRecord[];
  mostHundreds: AllTimeRecord[];
}

export interface GreatestMatch {
  year: number;
  team1_name: string;
  team1_score: number;
  team1_wickets: number;
  team2_name: string;
  team2_score: number;
  team2_wickets: number;
  total_runs?: number;
  winner_name: string;
  winner_margin: number;
  margin_type: string;
  venue: string;
}