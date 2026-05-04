import { apiClient } from './client';

export const statsAPI = {
  // Get all-time records
  getAllTimeRecords: async () => {
    const response = await apiClient.get('/api/stats/records');
    return response.data;
  },

  // Get most runs
  getMostRuns: async (format: string = 'ODI', limit: number = 10) => {
    const response = await apiClient.get(`/api/stats/most-runs/${format}`, { params: { limit } });
    return response.data;
  },

  // Get most wickets
  getMostWickets: async (format: string = 'ODI', limit: number = 10) => {
    const response = await apiClient.get(`/api/stats/most-wickets/${format}`, { params: { limit } });
    return response.data;
  },

  // Get highest scores
  getHighestScores: async (format: string = 'ODI', limit: number = 10) => {
    const response = await apiClient.get(`/api/stats/highest-scores/${format}`, { params: { limit } });
    return response.data;
  },

  // Get best bowling figures
  getBestBowling: async (format: string = 'ODI', limit: number = 10) => {
    const response = await apiClient.get(`/api/stats/best-bowling/${format}`, { params: { limit } });
    return response.data;
  },
};