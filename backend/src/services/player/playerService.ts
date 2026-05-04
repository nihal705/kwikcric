import { query, transaction } from '../../config/database/postgres';
import { cacheGet, cacheSet, cacheDel } from '../../config/database/redis';
import { logger } from '../../utils/logger';
import { NotFoundError, ConflictError } from '../../middleware/errorHandler';
import { cricapiService } from '../external/cricapiService';

export interface PlayerCreateData {
  uniqueIdentifier: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  country: string;
  role?: string;
  battingStyle?: string;
  bowlingStyle?: string;
  imageUrl?: string;
  dateOfBirth?: Date;
  bio?: string;
  isActive?: boolean;
}

export interface PlayerUpdateData {
  fullName?: string;
  country?: string;
  role?: string;
  battingStyle?: string;
  bowlingStyle?: string;
  imageUrl?: string;
  bio?: string;
  isActive?: boolean;
}

export interface PlayerStatsData {
  format: string;
  matches: number;
  runs: number;
  wickets: number;
  hundreds: number;
  fifties: number;
  battingAverage: number;
  bowlingAverage: number;
  strikeRate: number;
  economyRate: number;
  year?: number;
}

// Helper function to clear cache by pattern using Redis SCAN
const clearCacheByPattern = async (pattern: string): Promise<void> => {
  try {
    const { getRedisClient } = await import('../../config/database/redis');
    const redis = getRedisClient();
    if (redis) {
      const keys = await redis.keys(pattern);
      if (keys && keys.length > 0) {
        await redis.del(keys);
      }
    }
  } catch (error) {
    logger.error(`Failed to clear cache pattern: ${pattern}`, error);
  }
};

export class PlayerService {
  
  async createPlayer(data: PlayerCreateData): Promise<any> {
    const existingPlayer = await query(
      'SELECT id FROM players WHERE unique_identifier = $1',
      [data.uniqueIdentifier]
    );
    
    if (existingPlayer.rows.length > 0) {
      throw new ConflictError('Player with this identifier already exists');
    }
    
    const result = await query(
      `INSERT INTO players (
        unique_identifier, full_name, first_name, last_name, country, role,
        batting_style, bowling_style, image_url, date_of_birth, bio, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        data.uniqueIdentifier,
        data.fullName,
        data.firstName || null,
        data.lastName || null,
        data.country,
        data.role || null,
        data.battingStyle || null,
        data.bowlingStyle || null,
        data.imageUrl || null,
        data.dateOfBirth || null,
        data.bio || null,
        data.isActive !== undefined ? data.isActive : true,
      ]
    );
    
    await clearCacheByPattern(`players:*`);
    return result.rows[0];
  }
  
  async getPlayerById(id: string, includeStats: boolean = true): Promise<any> {
    const cacheKey = `player:${id}:stats:${includeStats}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return cached;
    
    const result = await query(
      `SELECT * FROM players WHERE id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      const externalPlayer = await cricapiService.fetchPlayerById(id);
      if (externalPlayer) {
        await cacheSet(cacheKey, externalPlayer, 3600);
        return externalPlayer;
      }
      throw new NotFoundError('Player');
    }
    
    const player = result.rows[0];
    
    if (includeStats) {
      const stats = await this.getPlayerStats(id);
      player.stats = stats;
    }
    
    await cacheSet(cacheKey, player, 3600);
    return player;
  }
  
  async getPlayerBySlug(slug: string): Promise<any> {
    const result = await query(
      `SELECT * FROM players WHERE unique_identifier = $1`,
      [slug]
    );
    
    if (result.rows.length === 0) {
      throw new NotFoundError('Player');
    }
    
    return result.rows[0];
  }
  
  async getAllPlayers(filters: {
    page?: number;
    limit?: number;
    country?: string;
    role?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<{ data: any[]; total: number; page: number; totalPages: number }> {
    const page = filters.page || 1;
    const limit = Math.min(filters.limit || 20, 100);
    const offset = (page - 1) * limit;
    
    let queryText = `
      SELECT p.*, 
             COALESCE(odi.runs, 0) as odi_runs,
             COALESCE(test.runs, 0) as test_runs,
             COALESCE(t20.runs, 0) as t20_runs
      FROM players p
      LEFT JOIN player_stats odi ON p.id = odi.player_id AND odi.format = 'ODI' AND odi.year IS NULL
      LEFT JOIN player_stats test ON p.id = test.player_id AND test.format = 'Test' AND test.year IS NULL
      LEFT JOIN player_stats t20 ON p.id = t20.player_id AND t20.format = 'T20I' AND t20.year IS NULL
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramIndex = 1;
    
    if (filters.country) {
      queryText += ` AND p.country = $${paramIndex++}`;
      params.push(filters.country);
    }
    
    if (filters.role) {
      queryText += ` AND p.role = $${paramIndex++}`;
      params.push(filters.role);
    }
    
    if (filters.search) {
      queryText += ` AND p.full_name ILIKE $${paramIndex++}`;
      params.push(`%${filters.search}%`);
    }
    
    const sortBy = filters.sortBy || 'full_name';
    const sortOrder = filters.sortOrder || 'ASC';
    queryText += ` ORDER BY p.${sortBy} ${sortOrder}`;
    queryText += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limit, offset);
    
    const result = await query(queryText, params);
    
    const countResult = await query(
      `SELECT COUNT(*) FROM players WHERE 1=1 ${
        filters.country ? ' AND country = $1' : ''
      }`,
      filters.country ? [filters.country] : []
    );
    
    const total = parseInt(countResult.rows[0].count);
    
    return {
      data: result.rows,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
  
  async updatePlayer(id: string, data: PlayerUpdateData): Promise<any> {
    const allowedFields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;
    
    if (data.fullName !== undefined) {
      allowedFields.push(`full_name = $${paramIndex++}`);
      values.push(data.fullName);
    }
    if (data.country !== undefined) {
      allowedFields.push(`country = $${paramIndex++}`);
      values.push(data.country);
    }
    if (data.role !== undefined) {
      allowedFields.push(`role = $${paramIndex++}`);
      values.push(data.role);
    }
    if (data.battingStyle !== undefined) {
      allowedFields.push(`batting_style = $${paramIndex++}`);
      values.push(data.battingStyle);
    }
    if (data.bowlingStyle !== undefined) {
      allowedFields.push(`bowling_style = $${paramIndex++}`);
      values.push(data.bowlingStyle);
    }
    if (data.imageUrl !== undefined) {
      allowedFields.push(`image_url = $${paramIndex++}`);
      values.push(data.imageUrl);
    }
    if (data.bio !== undefined) {
      allowedFields.push(`bio = $${paramIndex++}`);
      values.push(data.bio);
    }
    if (data.isActive !== undefined) {
      allowedFields.push(`is_active = $${paramIndex++}`);
      values.push(data.isActive);
    }
    
    if (allowedFields.length === 0) {
      return this.getPlayerById(id, true);
    }
    
    values.push(id);
    const result = await query(
      `UPDATE players SET ${allowedFields.join(', ')} WHERE id = $${paramIndex}
       RETURNING *`,
      values
    );
    
    if (result.rows.length === 0) {
      throw new NotFoundError('Player');
    }
    
    // Clear specific cache keys instead of using pattern
    await cacheDel(`player:${id}:stats:true`);
    await cacheDel(`player:${id}:stats:false`);
    await clearCacheByPattern(`players:*`);
    
    return result.rows[0];
  }
  
  async deletePlayer(id: string): Promise<boolean> {
    const result = await query(
      'DELETE FROM players WHERE id = $1 RETURNING id',
      [id]
    );
    
    if (result.rows.length === 0) {
      throw new NotFoundError('Player');
    }
    
    // Clear specific cache keys
    await cacheDel(`player:${id}:stats:true`);
    await cacheDel(`player:${id}:stats:false`);
    await clearCacheByPattern(`players:*`);
    
    return true;
  }
  
  async getPlayerStats(playerId: string, format?: string, year?: number): Promise<any[]> {
    let queryText = `
      SELECT format, matches, innings, runs, highest_score, hundreds, fifties,
             fours, sixes, batting_average, strike_rate,
             wickets, best_bowling, five_wickets, bowling_average, economy_rate,
             catches, stumpings, year
      FROM player_stats
      WHERE player_id = $1
    `;
    const params: any[] = [playerId];
    let paramIndex = 2;
    
    if (format) {
      queryText += ` AND format = $${paramIndex++}`;
      params.push(format);
    }
    
    if (year) {
      queryText += ` AND year = $${paramIndex++}`;
      params.push(year);
    }
    
    queryText += ` ORDER BY year DESC NULLS LAST, format`;
    
    const result = await query(queryText, params);
    return result.rows;
  }
  
  async addPlayerStats(playerId: string, stats: PlayerStatsData): Promise<any> {
    const existing = await query(
      `SELECT id FROM player_stats 
       WHERE player_id = $1 AND format = $2 AND COALESCE(year, 0) = COALESCE($3, 0)`,
      [playerId, stats.format, stats.year || 0]
    );
    
    if (existing.rows.length > 0) {
      const result = await query(
        `UPDATE player_stats 
         SET matches = $1, runs = $2, wickets = $3, hundreds = $4, fifties = $5,
             batting_average = $6, bowling_average = $7, strike_rate = $8, economy_rate = $9,
             updated_at = NOW()
         WHERE player_id = $10 AND format = $11 AND COALESCE(year, 0) = COALESCE($12, 0)
         RETURNING *`,
        [
          stats.matches, stats.runs, stats.wickets, stats.hundreds, stats.fifties,
          stats.battingAverage, stats.bowlingAverage, stats.strikeRate, stats.economyRate,
          playerId, stats.format, stats.year || 0
        ]
      );
      return result.rows[0];
    }
    
    const result = await query(
      `INSERT INTO player_stats (
        player_id, format, matches, innings, runs, wickets, hundreds, fifties,
        batting_average, bowling_average, strike_rate, economy_rate, year
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [
        playerId, stats.format, stats.matches, stats.matches, stats.runs, stats.wickets,
        stats.hundreds, stats.fifties, stats.battingAverage, stats.bowlingAverage,
        stats.strikeRate, stats.economyRate, stats.year || null
      ]
    );
    
    await cacheDel(`player:${playerId}:stats:true`);
    await cacheDel(`player:${playerId}:stats:false`);
    
    return result.rows[0];
  }
  
  async comparePlayers(player1Id: string, player2Id: string): Promise<any> {
    const player1 = await this.getPlayerById(player1Id, true);
    const player2 = await this.getPlayerById(player2Id, true);
    
    const comparison = {
      player1: {
        id: player1.id,
        name: player1.full_name,
        country: player1.country,
        role: player1.role,
        imageUrl: player1.image_url,
        stats: player1.stats || [],
      },
      player2: {
        id: player2.id,
        name: player2.full_name,
        country: player2.country,
        role: player2.role,
        imageUrl: player2.image_url,
        stats: player2.stats || [],
      },
      comparison: {
        odi: this.compareStatsByFormat(player1.stats, player2.stats, 'ODI'),
        test: this.compareStatsByFormat(player1.stats, player2.stats, 'Test'),
        t20: this.compareStatsByFormat(player1.stats, player2.stats, 'T20I'),
      },
    };
    
    return comparison;
  }
  
  private compareStatsByFormat(stats1: any[], stats2: any[], format: string): any {
    const s1 = stats1?.find(s => s.format === format) || {};
    const s2 = stats2?.find(s => s.format === format) || {};
    
    return {
      runs: { player1: s1.runs || 0, player2: s2.runs || 0, difference: (s1.runs || 0) - (s2.runs || 0) },
      wickets: { player1: s1.wickets || 0, player2: s2.wickets || 0, difference: (s1.wickets || 0) - (s2.wickets || 0) },
      hundreds: { player1: s1.hundreds || 0, player2: s2.hundreds || 0, difference: (s1.hundreds || 0) - (s2.hundreds || 0) },
      battingAverage: { player1: s1.batting_average || 0, player2: s2.batting_average || 0 },
      bowlingAverage: { player1: s1.bowling_average || 0, player2: s2.bowling_average || 0 },
    };
  }
  
  async searchPlayers(queryStr: string, limit: number = 10): Promise<any[]> {
    const result = await query(
      `SELECT id, full_name, country, role, image_url
       FROM players
       WHERE full_name ILIKE $1 OR unique_identifier ILIKE $1
       LIMIT $2`,
      [`%${queryStr}%`, limit]
    );
    
    return result.rows;
  }
  
  async getTopPlayers(category: 'runs' | 'wickets', format: string, limit: number = 10): Promise<any[]> {
    const statField = category === 'runs' ? 'runs' : 'wickets';
    
    const result = await query(
      `SELECT p.id, p.full_name, p.country, p.image_url, ps.${statField}
       FROM players p
       JOIN player_stats ps ON p.id = ps.player_id
       WHERE ps.format = $1 AND ps.${statField} > 0
       ORDER BY ps.${statField} DESC
       LIMIT $2`,
      [format, limit]
    );
    
    return result.rows;
  }
  
  async getHeadToHead(player1Id: string, player2Id: string): Promise<any> {
    const result = await query(
      `SELECT 
         COUNT(*) as matches_played,
         COUNT(CASE WHEN player1_runs > player2_runs THEN 1 END) as player1_better,
         COUNT(CASE WHEN player2_runs > player1_runs THEN 1 END) as player2_better
       FROM (
         SELECT 
           mp1.runs as player1_runs,
           mp2.runs as player2_runs
         FROM match_players mp1
         JOIN match_players mp2 ON mp1.match_id = mp2.match_id
         WHERE mp1.player_id = $1 AND mp2.player_id = $2
       ) as head_to_head`,
      [player1Id, player2Id]
    );
    
    return result.rows[0];
  }
}

export const playerService = new PlayerService();