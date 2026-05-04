// frontend/src/services/api/rankingsAPI.ts
import { apiClient } from './client';

export interface Ranking {
  rank: number;
  player_id: number;
  player_name: string;
  runs?: number;
  wickets?: number;
  batting_average?: number;
  bowling_average?: number;
  centuries?: number;
  fifties?: number;
  five_wickets?: number;
  rating: number;
}

export const rankingsAPI = {
  // Get ODI rankings
  getODIBatting: async (limit: number = 100) => {
    const response = await apiClient.get('/rankings/odi/batting', { params: { limit } });
    return response.data;
  },

  getODIBowling: async (limit: number = 100) => {
    const response = await apiClient.get('/rankings/odi/bowling', { params: { limit } });
    return response.data;
  },

  getODIAllrounder: async (limit: number = 100) => {
    const response = await apiClient.get('/rankings/odi/allrounder', { params: { limit } });
    return response.data;
  },

  // Get Test rankings
  getTestBatting: async (limit: number = 100) => {
    const response = await apiClient.get('/rankings/test/batting', { params: { limit } });
    return response.data;
  },

  getTestBowling: async (limit: number = 100) => {
    const response = await apiClient.get('/rankings/test/bowling', { params: { limit } });
    return response.data;
  },

  // Get T20I rankings
  getT20IBatting: async (limit: number = 100) => {
    const response = await apiClient.get('/rankings/t20i/batting', { params: { limit } });
    return response.data;
  },

  getT20IBowling: async (limit: number = 100) => {
    const response = await apiClient.get('/rankings/t20i/bowling', { params: { limit } });
    return response.data;
  },

  // Get IPL rankings
  getIPLBatting: async (limit: number = 100) => {
    const response = await apiClient.get('/rankings/ipl/batting', { params: { limit } });
    return response.data;
  },

  getIPLBowling: async (limit: number = 100) => {
    const response = await apiClient.get('/rankings/ipl/bowling', { params: { limit } });
    return response.data;
  },

  // Get overall rankings
  getOverallBatsmen: async (limit: number = 100) => {
    const response = await apiClient.get('/rankings/overall/batsmen', { params: { limit } });
    return response.data;
  },

  getOverallBowlers: async (limit: number = 100) => {
    const response = await apiClient.get('/rankings/overall/bowlers', { params: { limit } });
    return response.data;
  },

  getOverallAllrounders: async (limit: number = 100) => {
    const response = await apiClient.get('/rankings/overall/allrounders', { params: { limit } });
    return response.data;
  },
};