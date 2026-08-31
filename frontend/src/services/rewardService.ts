// frontend/src/services/rewardService.ts
import { API_BASE_URL } from './api/config';

export interface Reward {
  coins: number;
  gems: number;
  achievement: string;
  game: string;
  claimCount?: number;
  isDaily?: boolean;
}

export interface RewardResponse {
  success: boolean;
  reward?: Reward;
  error?: string;
}

const API_URL = API_BASE_URL;

class RewardService {
  private getToken(): string | null {
    // Use the same token key as your AuthContext
    const token = localStorage.getItem('kwik_cricket_token');
    return token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    
    // Create headers object properly
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Merge with existing headers from options
    if (options.headers) {
      const existingHeaders = options.headers as Record<string, string>;
      Object.assign(headers, existingHeaders);
    }
    
    if (!token && options.method === 'POST') {
      throw new Error('Guest users cannot claim rewards');
    }
    
    const response = await fetch(`${API_URL}/rewards${endpoint}`, {
      ...options,
      headers,
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      console.error('Request failed:', response.status, error);
      throw new Error(error.error || 'Request failed');
    }
    
    return response.json();
  }

  async claimRepeatableReward(
    game: string,
    achievement: string,
    progress: number = 1
  ): Promise<Reward | null> {
    // Skip for guest users
    if (!this.getToken()) {
      return null;
    }
    
    try {
      const response = await this.request<RewardResponse>('/claim/repeatable', {
        method: 'POST',
        body: JSON.stringify({ game, achievement, progress }),
      });
      
      if (response.success && response.reward) {
        return response.reward;
      }
      return null;
    } catch (error) {
      console.error('Error claiming reward:', error);
      return null;
    }
  }

  async claimDailyReward(game: string, achievement: string): Promise<Reward | null> {
    // Skip for guest users
    if (!this.getToken()) {
      return null;
    }
    
    try {
      const response = await this.request<RewardResponse>('/claim/daily', {
        method: 'POST',
        body: JSON.stringify({ game, achievement }),
      });
      
      if (response.success && response.reward) {
        return response.reward;
      }
      return null;
    } catch (error) {
      console.error('Error claiming daily reward:', error);
      return null;
    }
  }

  async getUserCurrency(): Promise<{ gems: number; coins: number }> {
    try {
      // For guest users, return default
      if (!this.getToken()) {
        return { gems: 100, coins: 500 };
      }
      return await this.request('/currency');
    } catch (error) {
      console.error('Error getting currency:', error);
      return { gems: 100, coins: 500 };
    }
  }

  async getRewardSummary(): Promise<{
    total_coins: number;
    total_gems: number;
    total_achievements: number;
    todayRewards: any[];
  }> {
    try {
      // For guest users, return empty
      if (!this.getToken()) {
        return { total_coins: 0, total_gems: 0, total_achievements: 0, todayRewards: [] };
      }
      return await this.request('/summary');
    } catch (error) {
      console.error('Error getting reward summary:', error);
      return { total_coins: 0, total_gems: 0, total_achievements: 0, todayRewards: [] };
    }
  }
}

export const rewardService = new RewardService();