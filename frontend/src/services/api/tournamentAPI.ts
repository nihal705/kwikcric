import { apiClient } from './client';

export interface Tournament {
  id: number;
  name: string;
  format: string;
  year: number;
  host_country: string;
  winner: string;
  runner_up: string;
  player_of_tournament?: string;
  top_run_scorer?: string;
  top_wicket_taker?: string;
  matches_played?: number;
}

export interface Match {
  id: number;
  match_id: string;
  format: string;
  season: string;
  venue: string;
  team1: string;
  team2: string;
  winner: string;
  player_of_match: string;
  match_date: string;
}

export const tournamentAPI = {
  // Get all tournaments
  getAllTournaments: async () => {
    const response = await apiClient.get('/api/tournaments/all');
    return response.data;
  },

  // Get tournament by ID
  getTournamentById: async (id: number) => {
    const response = await apiClient.get(`/api/tournaments/${id}`);
    return response.data;
  },

  // Get tournaments by format
  getTournamentsByFormat: async (format: string) => {
    const response = await apiClient.get(`/api/tournaments/format/${format}`);
    return response.data;
  },

  // Get World Cup by year
  getWorldCup: async (year: number) => {
    const response = await apiClient.get(`/api/tournaments/world-cup/${year}`);
    return response.data;
  },

  // Get IPL by year
  getIPL: async (year: number) => {
    const response = await apiClient.get(`/api/tournaments/ipl/${year}`);
    return response.data;
  },

  // Get matches
  getMatches: async (params?: { format?: string; season?: string; limit?: number }) => {
    const response = await apiClient.get('/api/matches', { params });
    return response.data;
  },

  // Get match by ID
  getMatchById: async (id: number) => {
    const response = await apiClient.get(`/api/matches/${id}`);
    return response.data;
  },
};