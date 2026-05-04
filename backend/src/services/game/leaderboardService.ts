import { cacheGet, cacheSet, cacheIncrement, getRedisClient } from '../../config/database/redis';
import { query } from '../../config/database/postgres';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatarUrl: string | null;
  score: number;
  country?: string;
}

export class LeaderboardService {
  
  async updateScore(userId: string, gameType: string, score: number): Promise<void> {
    const redis = getRedisClient();
    if (!redis) return;
    
    // Update daily leaderboard
    const today = new Date().toISOString().split('T')[0];
    const dailyKey = `lb:daily:${gameType}:${today}`;
    await redis.zIncrBy(dailyKey, score, userId);
    await redis.expire(dailyKey, 86400 * 2);
    
    // Update weekly leaderboard
    const weekKey = this.getWeekKey();
    const weeklyKey = `lb:weekly:${gameType}:${weekKey}`;
    await redis.zIncrBy(weeklyKey, score, userId);
    await redis.expire(weeklyKey, 86400 * 14);
    
    // Update monthly leaderboard
    const monthKey = new Date().toISOString().slice(0, 7);
    const monthlyKey = `lb:monthly:${gameType}:${monthKey}`;
    await redis.zIncrBy(monthlyKey, score, userId);
    await redis.expire(monthlyKey, 86400 * 35);
    
    // Update all-time leaderboard
    const allTimeKey = `lb:alltime:${gameType}`;
    await redis.zIncrBy(allTimeKey, score, userId);
  }
  
  async getLeaderboard(
    gameType: string,
    period: 'daily' | 'weekly' | 'monthly' | 'all_time',
    limit: number = 10,
    offset: number = 0
  ): Promise<LeaderboardEntry[]> {
    const redis = getRedisClient();
    if (!redis) return [];
    
    let key: string;
    
    switch (period) {
      case 'daily':
        const today = new Date().toISOString().split('T')[0];
        key = `lb:daily:${gameType}:${today}`;
        break;
      case 'weekly':
        key = `lb:weekly:${gameType}:${this.getWeekKey()}`;
        break;
      case 'monthly':
        const monthKey = new Date().toISOString().slice(0, 7);
        key = `lb:monthly:${gameType}:${monthKey}`;
        break;
      default:
        key = `lb:alltime:${gameType}`;
    }
    
    const results = await redis.zRevRangeWithScores(key, offset, offset + limit - 1);
    
    if (results.length === 0) {
      return [];
    }
    
    const leaderboard: LeaderboardEntry[] = [];
    let rank = offset + 1;
    
    for (const result of results) {
      const userResult = await query(
        'SELECT id, username, avatar_url, country_code FROM users WHERE id = $1',
        [result.value]
      );
      
      if (userResult.rows.length > 0) {
        leaderboard.push({
          rank: rank++,
          userId: userResult.rows[0].id,
          username: userResult.rows[0].username,
          avatarUrl: userResult.rows[0].avatar_url,
          score: Math.floor(Number(result.score)),
          country: userResult.rows[0].country_code,
        });
      }
    }
    
    return leaderboard;
  }
  
  async getUserRank(userId: string, gameType: string, period: 'daily' | 'weekly' | 'monthly' | 'all_time'): Promise<{
    rank: number;
    score: number;
    totalPlayers: number;
  }> {
    const redis = getRedisClient();
    if (!redis) {
      return { rank: 0, score: 0, totalPlayers: 0 };
    }
    
    let key: string;
    
    switch (period) {
      case 'daily':
        const today = new Date().toISOString().split('T')[0];
        key = `lb:daily:${gameType}:${today}`;
        break;
      case 'weekly':
        key = `lb:weekly:${gameType}:${this.getWeekKey()}`;
        break;
      case 'monthly':
        const monthKey = new Date().toISOString().slice(0, 7);
        key = `lb:monthly:${gameType}:${monthKey}`;
        break;
      default:
        key = `lb:alltime:${gameType}`;
    }
    
    const rank = await redis.zRevRank(key, userId);
    const score = await redis.zScore(key, userId);
    const totalPlayers = await redis.zCard(key);
    
    return {
      rank: rank !== null ? rank + 1 : 0,
      score: score !== null ? Math.floor(Number(score)) : 0,
      totalPlayers: totalPlayers || 0,
    };
  }
  
  async getTopCountries(gameType: string, period: 'daily' | 'weekly' | 'monthly' | 'all_time', limit: number = 5): Promise<any[]> {
    const leaderboard = await this.getLeaderboard(gameType, period, 100);
    
    const countryScores: Record<string, { total: number; count: number }> = {};
    
    for (const entry of leaderboard) {
      if (entry.country) {
        if (!countryScores[entry.country]) {
          countryScores[entry.country] = { total: 0, count: 0 };
        }
        countryScores[entry.country].total += entry.score;
        countryScores[entry.country].count++;
      }
    }
    
    const sorted = Object.entries(countryScores)
      .map(([country, data]) => ({
        country,
        totalScore: data.total,
        averageScore: data.total / data.count,
        playerCount: data.count,
      }))
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, limit);
    
    return sorted;
  }
  
  async resetLeaderboard(gameType: string, period: 'daily' | 'weekly' | 'monthly'): Promise<void> {
    const redis = getRedisClient();
    if (!redis) return;
    
    let pattern: string;
    
    switch (period) {
      case 'daily':
        pattern = `lb:daily:${gameType}:*`;
        break;
      case 'weekly':
        pattern = `lb:weekly:${gameType}:*`;
        break;
      default:
        pattern = `lb:monthly:${gameType}:*`;
    }
    
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(keys);
    }
  }
  
  private getWeekKey(): string {
    const now = new Date();
    const year = now.getFullYear();
    const firstDayOfYear = new Date(year, 0, 1);
    const pastDaysOfYear = (now.getTime() - firstDayOfYear.getTime()) / 86400000;
    const week = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    return `${year}-W${week.toString().padStart(2, '0')}`;
  }
  
  async getRecentWinners(gameType: string, limit: number = 5): Promise<any[]> {
    const redis = getRedisClient();
    if (!redis) return [];
    
    const keys = await redis.keys(`lb:daily:${gameType}:*`);
    keys.sort().reverse();
    
    const winners = [];
    for (const key of keys.slice(0, limit)) {
      const topScore = await redis.zRevRangeWithScores(key, 0, 0);
      if (topScore.length > 0) {
        const userResult = await query(
          'SELECT id, username, avatar_url FROM users WHERE id = $1',
          [topScore[0].value]
        );
        
        if (userResult.rows.length > 0) {
          winners.push({
            date: key.split(':')[3],
            winner: userResult.rows[0].username,
            score: Math.floor(Number(topScore[0].score)),
          });
        }
      }
    }
    
    return winners;
  }
}

export const leaderboardService = new LeaderboardService();