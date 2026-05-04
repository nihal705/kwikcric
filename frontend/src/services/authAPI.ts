// frontend/src/services/authAPI.ts
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth';
const GAME_API_URL = 'http://localhost:3000/api/kwik-cricket';

const getToken = () => localStorage.getItem('kwik_cricket_token');

const api = axios.create({
    baseURL: API_URL,
});

const gameApi = axios.create({
    baseURL: GAME_API_URL,
});

// Add token to requests
gameApi.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Register user
export const registerUser = async (username: string, email: string, password: string) => {
    const response = await api.post('/register', { username, email, password });
    return response.data;
};

// Login user
export const loginUser = async (email: string, password: string) => {
    const response = await api.post('/login', { email, password });
    return response.data;
};

// Get guest session
export const getGuestSession = async (guestId?: string) => {
    const response = await api.post('/guest', { guestId });
    return response.data;
};

// Merge guest stats
export const mergeGuestStats = async (guestStats: any, guestHistory: any[], guestId: string) => {
    const response = await api.post('/merge-guest', { guestStats, guestHistory, guestId });
    return response.data;
};

// Get user stats
export const getUserStats = async () => {
    const response = await gameApi.get('/stats');
    return response.data;
};

// Get user match history
export const getUserHistory = async (limit: number = 10) => {
    const response = await gameApi.get(`/history?limit=${limit}`);
    return response.data;
};

// Save game state
export const saveGameState = async (gameState: any) => {
    const response = await gameApi.post('/save-game', { gameState });
    return response.data;
};

// Load game state
export const loadGameState = async () => {
    const response = await gameApi.get('/load-game');
    return response.data;
};

// Clear saved game
export const clearGameState = async () => {
    const response = await gameApi.delete('/clear-game');
    return response.data;
};

// Save match (with auth)
export const saveMatchAuth = async (matchData: any) => {
    const response = await gameApi.post('/save-match', matchData);
    return response.data;
};