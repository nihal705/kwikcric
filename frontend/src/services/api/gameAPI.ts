import axios from 'axios';
import { API_BASE_URL } from './config';

export const gameAPI = {
  // Quick Cricket
  startQuickCricket: async (mode?: 'classic' | 'chase' | 'timed') => {
    const response = await axios.post(`${API_BASE_URL}/games/quick-cricket/start`, { mode });
    return response.data;
  },

  playQuickCricketShot: async (gameId: string, shotType: 'aggressive' | 'normal' | 'defensive') => {
    const response = await axios.post(`${API_BASE_URL}/games/quick-cricket/play`, { gameId, shotType });
    return response.data;
  },

  getQuickCricketState: async (gameId: string) => {
    const response = await axios.get(`${API_BASE_URL}/games/quick-cricket/${gameId}`);
    return response.data;
  },

  // Guess Player
  startGuessPlayer: async (difficulty?: 'easy' | 'medium' | 'hard') => {
    const response = await axios.post(`${API_BASE_URL}/games/guess-player/start`, { difficulty });
    return response.data;
  },

  makeGuess: async (gameId: string, guess: string) => {
    const response = await axios.post(`${API_BASE_URL}/games/guess-player/guess`, { gameId, guess });
    return response.data;
  },

  revealHint: async (gameId: string) => {
    const response = await axios.post(`${API_BASE_URL}/games/guess-player/hint`, { gameId });
    return response.data;
  },

  reduceBlur: async (gameId: string) => {
    const response = await axios.post(`${API_BASE_URL}/games/guess-player/unblur`, { gameId });
    return response.data;
  },

  getGuessPlayerState: async (gameId: string) => {
    const response = await axios.get(`${API_BASE_URL}/games/guess-player/${gameId}`);
    return response.data;
  },

  // Quiz
  startQuiz: async (category?: string, difficulty?: string, questionCount?: number) => {
    const response = await axios.post(`${API_BASE_URL}/games/quiz/start`, {
      category,
      difficulty,
      questionCount,
    });
    return response.data;
  },

  submitAnswer: async (sessionId: string, answer: string, timeTaken?: number) => {
    const response = await axios.post(`${API_BASE_URL}/games/quiz/answer`, {
      sessionId,
      answer,
      timeTaken,
    });
    return response.data;
  },

  useLifeline: async (sessionId: string, lifeline: 'fiftyFifty' | 'audiencePoll' | 'skipQuestion') => {
    const response = await axios.post(`${API_BASE_URL}/games/quiz/lifeline`, { sessionId, lifeline });
    return response.data;
  },

  getQuizSession: async (sessionId: string) => {
    const response = await axios.get(`${API_BASE_URL}/games/quiz/${sessionId}`);
    return response.data;
  },

  getQuizStats: async () => {
    const response = await axios.get(`${API_BASE_URL}/games/quiz/stats/me`);
    return response.data;
  },

  // Leaderboard
  getLeaderboard: async (gameType: string, period: 'daily' | 'weekly' | 'monthly' | 'all_time', limit?: number) => {
    const response = await axios.get(`${API_BASE_URL}/games/leaderboard/${gameType}`, {
      params: { period, limit },
    });
    return response.data;
  },

  getUserRank: async (gameType: string, period: 'daily' | 'weekly' | 'monthly' | 'all_time') => {
    const response = await axios.get(`${API_BASE_URL}/games/leaderboard/rank/${gameType}`, {
      params: { period },
    });
    return response.data;
  },

  getTopCountries: async (gameType: string, period: 'daily' | 'weekly' | 'monthly' | 'all_time', limit?: number) => {
    const response = await axios.get(`${API_BASE_URL}/games/leaderboard/countries/${gameType}`, {
      params: { period, limit },
    });
    return response.data;
  },

  getRecentWinners: async (gameType: string, limit?: number) => {
    const response = await axios.get(`${API_BASE_URL}/games/leaderboard/winners/${gameType}`, {
      params: { limit },
    });
    return response.data;
  },
};