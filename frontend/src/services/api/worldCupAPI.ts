import axios from 'axios';
import { Tournament, TeamRanking, Match, PointsTableEntry, FullTournamentDetails } from './types';
import { API_BASE_URL } from './config';

// Add these types for stats
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
  rank: number;
  title: string;
  description: string;
  year: number;
  team1_name: string;
  team2_name: string;
  team1_score: number;
  team1_wickets: number;
  team1_overs: number;
  team2_score: number;
  team2_wickets: number;
  team2_overs: number;
  total_runs?: number;
  winner_name: string;
  winner_margin: number;
  margin_type: string;
  venue: string;
}

class WorldCupAPI {
  private baseUrl = `${API_BASE_URL}/world-cup`;

  async getAllTournaments(type: string = 'odi'): Promise<{ success: boolean; data: Tournament[] }> {
    const response = await axios.get(`${this.baseUrl}/tournaments`, { params: { type } });
    return response.data;
  }

  async getTournamentById(id: number): Promise<{ success: boolean; data: Tournament }> {
    const response = await axios.get(`${this.baseUrl}/tournaments/${id}`);
    return response.data;
  }

  async getTournamentByYear(year: number, type: string = 'odi'): Promise<{ success: boolean; data: Tournament }> {
    const response = await axios.get(`${this.baseUrl}/tournaments/year/${year}`, { params: { type } });
    return response.data;
  }

  async getTeamRankings(type: string = 'odi'): Promise<{ success: boolean; data: TeamRanking[] }> {
    const response = await axios.get(`${this.baseUrl}/team-rankings`, { params: { type } });
    return response.data;
  }

  async getTournamentMatches(tournamentId: number): Promise<{ success: boolean; data: Match[] }> {
    const response = await axios.get(`${this.baseUrl}/tournaments/${tournamentId}/matches`);
    return response.data;
  }

  async getPointsTable(tournamentId: number): Promise<{ success: boolean; data: PointsTableEntry[] }> {
    const response = await axios.get(`${this.baseUrl}/tournaments/${tournamentId}/points-table`);
    return response.data;
  }

  async getTournamentStats(tournamentId: number): Promise<{ success: boolean; data: TournamentStatsData }> {
    const response = await axios.get(`${this.baseUrl}/tournaments/${tournamentId}/stats`);
    return response.data;
  }

  // FIXED: Handle IPL separately - use IPL API endpoint
  async getAllTimeRecords(type: string = 'odi'): Promise<{ success: boolean; data: AllTimeRecordsData }> {
    // If type is 'ipl', use IPL API endpoint
    if (type === 'ipl') {
      const response = await axios.get(`${API_BASE_URL}/ipl/all-time-records`);
      return response.data;
    }
    // Otherwise use World Cup API
    const response = await axios.get(`${this.baseUrl}/all-time-records`, { params: { type } });
    return response.data;
  }

  // FIXED: Handle IPL separately - use IPL API endpoint
  async getGreatestMatches(type: string = 'odi'): Promise<{ success: boolean; data: { highestScoring: GreatestMatch[]; closestFinishes: GreatestMatch[] } }> {
    // If type is 'ipl', use IPL API endpoint
    if (type === 'ipl') {
      const response = await axios.get(`${API_BASE_URL}/ipl/greatest-matches`);
      return response.data;
    }
    // Otherwise use World Cup API
    const response = await axios.get(`${this.baseUrl}/greatest-matches`, { params: { type } });
    return response.data;
  }

  async getFullTournamentDetails(year: number, type: string = 'odi'): Promise<FullTournamentDetails> {
    const response = await axios.get(`${this.baseUrl}/${year}/full-details`, { params: { type } });
    return response.data.data;
  }

  async getTeamDetails(teamName: string, type: string = 'odi'): Promise<any> {
    const response = await axios.get(`${this.baseUrl}/team/${encodeURIComponent(teamName)}`, { 
        params: { type }
    });
    return response.data;
  }
}

export interface TournamentStatsData {
  topRuns: Array<{ player_name: string; runs: number; average: number; strike_rate: number }>;
  topWickets: Array<{ player_name: string; wickets: number; average: number; economy: number }>;
  topAllrounders: Array<{ player_name: string; runs: number; wickets: number; batting_avg: number; bowling_avg: number }>;
  teamStats: {
    totalSixes: number;
    totalCenturies: number;
    highestTeamScore: number;
    highestTeamScorePlayer: string;
    mostSixes: number;
    mostSixesPlayer: string;
    mostCenturies: number;
    mostCenturiesPlayer: string;
    highestScore: number;
    highestScorePlayer: string;
    bestBowling: string;
    bestBowlingPlayer: string;
  };
  achievements: Array<{
    achievement_type: string;
    title: string;
    description: string;
    is_featured: boolean;
    players: string[];
  }>;
}

export const worldCupAPI = new WorldCupAPI();
export type { Tournament, TeamRanking, Match, PointsTableEntry, FullTournamentDetails };