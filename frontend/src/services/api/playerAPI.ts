// frontend/src/services/api/playerAPI.ts
import { apiClient } from './client';

export interface Player {
  id: number;
  name: string;
  full_name: string;
  country: string;
  batting_style: string;
  bowling_style: string;
  runs?: number;
  wickets?: number;
  role?: string;
}

export interface BattingStats {
  format: string;
  matches: number;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strike_rate: number;
  centuries?: number;
  fifties?: number;
  highest_score?: number;
}

export interface BowlingStats {
  format: string;
  matches: number;
  wickets: number;
  runs_given: number;
  balls: number;
  economy: number;
  average: number;
  five_wickets?: number;
  best_figures?: string;
}

export interface PlayerBio {
  full_name: string;
  birth_date: string;
  birth_place: string;
  major_teams: string;
  playing_role: string;
  height: string;
  description: string;
  awards: string;
  image_url: string;
}

export interface PlayerDetail extends Player {
  bio: PlayerBio;
  batting_stats: BattingStats[];
  bowling_stats: BowlingStats[];
  rankings?: Array<{
    format: string;
    category: string;
    rank: number;
    rating: number;
  }>;
}

export const playerAPI = {
  // Get all players with pagination
  getPlayers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    country?: string;
    role?: string;
    sortBy?: string;
  }) => {
    // Remove /api prefix - just /players
    const response = await apiClient.get('/players', { params });
    return response.data;
  },

  // Search players
  searchPlayers: async (query: string) => {
    // Remove /api prefix
    const response = await apiClient.get('/players/search', { params: { q: query } });
    return response.data;
  },

  // Get player details with stats and bio
  getPlayerDetails: async (id: number) => {
    // Remove /api prefix - was /api/players/:id/complete, now /players/:id/complete
    const response = await apiClient.get(`/players/${id}/complete`);
    return response.data;
  },

  // Get player rankings
  getPlayerRankings: async (playerId: number) => {
    const response = await apiClient.get(`/rankings/player/${playerId}`);
    return response.data;
  },

  // Get top players
  getTopPlayers: async (limit: number = 10) => {
    const response = await apiClient.get('/players/top', { params: { limit } });
    return response.data;
  },
};