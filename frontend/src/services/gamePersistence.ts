// frontend/src/services/gamePersistence.ts
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/games';

interface SavedGameState {
    gameType: string;
    gameMode: string;
    state: any;
    score: number;
    timestamp: number;
}

interface GameHistoryEntry {
    id?: number;
    gameType: string;
    gameMode: string;
    score: number;
    accuracy?: number;
    result?: string;
    details?: any;
    played_at?: string;
}

class GamePersistenceService {
    private isAuthenticated: boolean = false;
    private currentUserId: number | null = null;

    setAuthStatus(authenticated: boolean, userId?: number) {
        this.isAuthenticated = authenticated;
        if (userId) this.currentUserId = userId;
    }

    private getAuthHeaders() {
        const token = localStorage.getItem('kwik_cricket_token');
        return {
            headers: { Authorization: `Bearer ${token}` }
        };
    }

    async saveGameState(gameType: string, gameMode: string, state: any, score: number): Promise<void> {
        const gameState: SavedGameState = {
            gameType,
            gameMode,
            state,
            score,
            timestamp: Date.now()
        };
        
        if (this.isAuthenticated && this.currentUserId) {
            try {
                await axios.post(`${API_URL}/save-session`, gameState, this.getAuthHeaders());
            } catch (error) {
                console.error('Failed to save to backend, falling back to localStorage:', error);
                this.saveToLocalStorage(gameState);
            }
        } else {
            this.saveToLocalStorage(gameState);
        }
    }
    
    private saveToLocalStorage(gameState: SavedGameState) {
        const key = `${gameState.gameType}_${gameState.gameMode}_saved`;
        localStorage.setItem(key, JSON.stringify(gameState));
    }
    
    async loadGameState(gameType: string, gameMode: string): Promise<SavedGameState | null> {
        if (this.isAuthenticated && this.currentUserId) {
            try {
                const response = await axios.get(`${API_URL}/load-session/${gameType}/${gameMode}`, this.getAuthHeaders());
                if (response.data && response.data.state) {
                    return response.data;
                }
            } catch (error) {
                console.error('Failed to load from backend:', error);
            }
        }
        
        const key = `${gameType}_${gameMode}_saved`;
        const saved = localStorage.getItem(key);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Date.now() - parsed.timestamp < 86400000) {
                return parsed;
            }
            localStorage.removeItem(key);
        }
        return null;
    }
    
    async clearGameState(gameType: string, gameMode: string): Promise<void> {
        if (this.isAuthenticated && this.currentUserId) {
            try {
                await axios.delete(`${API_URL}/clear-session/${gameType}/${gameMode}`, this.getAuthHeaders());
            } catch (error) {
                console.error('Failed to clear from backend:', error);
            }
        }
        localStorage.removeItem(`${gameType}_${gameMode}_saved`);
    }
    
    async saveGameHistory(entry: GameHistoryEntry): Promise<void> {
        if (this.isAuthenticated && this.currentUserId) {
            try {
                await axios.post(`${API_URL}/history`, entry, this.getAuthHeaders());
            } catch (error) {
                console.error('Failed to save history:', error);
                this.saveHistoryToLocalStorage(entry);
            }
        } else {
            this.saveHistoryToLocalStorage(entry);
        }
    }
    
    private saveHistoryToLocalStorage(entry: GameHistoryEntry) {
        const key = `${entry.gameType}_history`;
        const existing = localStorage.getItem(key);
        const history = existing ? JSON.parse(existing) : [];
        history.unshift({ ...entry, played_at: new Date().toISOString() });
        localStorage.setItem(key, JSON.stringify(history.slice(0, 50)));
    }
    
    async loadGameHistory(gameType: string): Promise<any[]> {
        if (this.isAuthenticated && this.currentUserId) {
            try {
                const response = await axios.get(`${API_URL}/history/${gameType}`, this.getAuthHeaders());
                if (response.data) {
                    return response.data;
                }
            } catch (error) {
                console.error('Failed to load history:', error);
            }
        }
        
        const key = `${gameType}_history`;
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : [];
    }
    
    async getOverallStats(): Promise<any> {
        if (this.isAuthenticated && this.currentUserId) {
            try {
                const response = await axios.get(`${API_URL}/stats`, this.getAuthHeaders());
                return response.data;
            } catch (error) {
                console.error('Failed to load stats:', error);
            }
        }
        
        const games = ['kwik_cricket', 'quiz', 'imposter', 'guess_legend', 'cards'];
        const stats: any = {};
        
        for (const game of games) {
            const history = await this.loadGameHistory(game);
            stats[game] = {
                totalGames: history.length,
                totalScore: history.reduce((sum: number, h: any) => sum + (h.score || 0), 0),
                winRate: history.length > 0 ? Math.round((history.filter((h: any) => h.result === 'win').length / history.length) * 100) : 0,
                accuracy: history.length > 0 ? Math.round(history.reduce((sum: number, h: any) => sum + (h.accuracy || 0), 0) / history.length) : 0
            };
        }
        
        return stats;
    }
}

export const gamePersistence = new GamePersistenceService();