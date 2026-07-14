// src/services/api/iplAPI.ts
import axios from 'axios';
import { API_BASE_URL } from './config';

export interface IPLTeam {
  id: number;
  name: string;
  short_name: string;
  city: string;
  home_ground: string;
  titles_won: number;
  runner_up_count: number;
  primary_color: string;
  secondary_color: string;
  logo_url: string | null;
  rank?: number;
}

export interface IPLSeason {
  id: number;
  year: number;
  winner_name: string;
  runner_up_name: string;
  winner_color: string;
  total_matches: number;
  total_teams: number;
  final_venue: string;
  final_match_date: string;
}

export interface IPLSeasonDetail {
  season: {
    id: number;
    year: number;
    total_matches: number;
    total_teams: number;
    final_venue: string;
    final_match_date: string;
    super_over_final: boolean;
    winner_id: number;
    winner_name: string;
    winner_color: string;
    runner_up_id: number;
    runner_up_name: string;
    orange_cap_player: string;
    purple_cap_player: string;
    player_of_tournament: string;
  };
  pointsTable: IPLPointsTableEntry[];
  playoffs: IPLPlayoffMatch[];
  matches: IPLMatch[];
}

export interface IPLPointsTableEntry {
  id: number;
  team_id: number;
  team_name: string;
  short_name: string;
  primary_color: string;
  matches_played: number;
  matches_won: number;
  matches_lost: number;
  points: number;
  net_run_rate: number;
}

export interface IPLPlayoffMatch {
  id: number;
  match_type: string;
  team1_name: string;
  team2_name: string;
  winner_name: string;
  winner_margin: string;
  venue: string;
  match_date: string;
  man_of_match: string;
  team1_color: string;
  team2_color: string;
}

export interface IPLMatch {
  id: number;
  match_type: string;
  match_number: number;
  team1_name: string;
  team2_name: string;
  team1_score: number;
  team1_wickets: number;
  team1_overs: number;
  team2_score: number;
  team2_wickets: number;
  team2_overs: number;
  winner_name: string;
  winner_margin: string;
  margin_type: string;
  venue: string;
  match_date: string;
  man_of_match_name: string;
  team1_color: string;
  team2_color: string;
}

export interface IPLRecord {
  player_name: string;
  value: number;
  matches_played: number;
  seasons_played: number;
  team_name: string;
}

export interface IPLGreatestMatch {
  rank: number;
  season_year: number;
  match_type: string;
  title: string;
  description: string;
  team1_name: string;
  team2_name: string;
  team1_score: number;
  team1_wickets: number;
  team1_overs: number;
  team2_score: number;
  team2_wickets: number;
  team2_overs: number;
  winner_name: string;
  winner_margin: string;
  venue: string;
  match_date: string;
  man_of_match: string;
  is_featured: boolean;
}

export interface IPLPlayerStats {
  batting: IPLPlayerBattingStat[];
  bowling: IPLPlayerBowlingStat[];
  career: {
    totalRuns: number;
    totalMatches: number;
    totalWickets: number;
  };
}

export interface IPLPlayerBattingStat {
  season_year: number;
  team_name: string;
  matches: number;
  innings: number;
  runs: number;
  highest_score: number;
  strike_rate: number;
  batting_average: number;
  fours: number;
  sixes: number;
  fifties: number;
  centuries: number;
}

export interface IPLPlayerBowlingStat {
  season_year: number;
  team_name: string;
  matches: number;
  innings: number;
  wickets: number;
  runs_conceded: number;
  economy: number;
  bowling_average: number;
  best_bowling: string;
  four_wickets: number;
  five_wickets: number;
}

export const iplAPI = {
  // Get all IPL seasons
  getAllSeasons: () => axios.get<{ success: boolean; data: IPLSeason[] }>(`${API_BASE_URL}/ipl/seasons`),
  
  // Get IPL season by year
  getSeasonByYear: (year: number) => axios.get<{ success: boolean; data: IPLSeasonDetail }>(`${API_BASE_URL}/ipl/seasons/${year}`),
  
  // Get IPL team rankings
  getTeamRankings: () => axios.get<{ success: boolean; data: IPLTeam[] }>(`${API_BASE_URL}/ipl/team-rankings`),
  
  // Get IPL team details
  getTeamDetails: (teamName: string) => axios.get<{ success: boolean; data: any }>(`${API_BASE_URL}/ipl/team/${encodeURIComponent(teamName)}`),
  
  // Get IPL all-time records
  getAllTimeRecords: () => axios.get<{ success: boolean; data: { mostRuns: IPLRecord[]; mostWickets: IPLRecord[]; mostSixes: IPLRecord[]; mostHundreds: IPLRecord[] } }>(`${API_BASE_URL}/ipl/all-time-records`),
  
  // Get IPL greatest matches
  getGreatestMatches: () => axios.get<{ success: boolean; data: IPLGreatestMatch[] }>(`${API_BASE_URL}/ipl/greatest-matches`),
  
  // Get IPL player stats
  getPlayerStats: (playerId: number) => axios.get<{ success: boolean; data: IPLPlayerStats }>(`${API_BASE_URL}/ipl/players/${playerId}/stats`),
  
  // Get IPL season stats (top performers)
  getSeasonStats: (year: number) => axios.get<{ success: boolean; data: any }>(`${API_BASE_URL}/ipl/seasons/${year}/stats`),

  getCapWinners: () => axios.get(`${API_BASE_URL}/ipl/cap-winners`),
};