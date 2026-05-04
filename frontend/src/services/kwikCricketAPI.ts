// frontend/src/services/kwikCricketAPI.ts
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/kwik-cricket';

export const saveMatch = async (matchData: {
    sessionId?: string;
    userTeam: string;
    opponentTeam: string;
    overs: number;
    userScore: number;
    userWickets: number;
    opponentScore: number;
    opponentWickets: number;
    result: string;
}) => {
    try {
        const response = await axios.post(`${API_URL}/save-match`, matchData);
        return response.data;
    } catch (error: any) {
        console.error('Error saving match:', error);
        console.error('Response data:', error.response?.data);
        console.error('Status:', error.response?.status);
        // Return mock response to prevent game crash
        return { success: true, sessionId: matchData.sessionId || 'mock-session-' + Date.now() };
    }
};

export const getStats = async (sessionId: string) => {
    try {
        const response = await axios.get(`${API_URL}/stats/${sessionId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching stats:', error);
        return { success: true, data: null };
    }
};

export const getMatchHistory = async (sessionId: string) => {
    try {
        const response = await axios.get(`${API_URL}/history/${sessionId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching history:', error);
        return { success: true, data: [] };
    }
};