import { query } from '../../config/database/postgres';
import { cacheGet, cacheSet } from '../../config/database/redis';
import { statsCalculator } from '../../utils/helpers/statsCalculator';
import { logger } from '../../utils/logger';

export class PlayerStatsService {
  
  async getCareerProgression(playerId: string, format: string): Promise<any> {
    const cacheKey = `player:${playerId}:progression:${format}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return cached;
    
    const result = await query(
      `SELECT year, matches, runs, hundreds, fifties, batting_average, strike_rate,
              wickets, five_wickets, bowling_average, economy_rate
       FROM player_stats
       WHERE player_id = $1 AND format = $2 AND year IS NOT NULL
       ORDER BY year ASC`,
      [playerId, format]
    );
    
    const progression = {
      format,
      yearlyData: result.rows,
      careerHighlights: this.calculateHighlights(result.rows),
      trend: this.calculateTrend(result.rows),
    };
    
    await cacheSet(cacheKey, progression, 3600);
    return progression;
  }
  
  private calculateHighlights(stats: any[]): any {
    if (stats.length === 0) return null;
    
    const bestYear = stats.reduce((best, current) => 
      current.runs > best.runs ? current : best, stats[0]);
    
    const bestBowlingYear = stats.reduce((best, current) => 
      current.wickets > best.wickets ? current : best, stats[0]);
    
    return {
      bestYear: {
        year: bestYear.year,
        runs: bestYear.runs,
        average: bestYear.batting_average,
      },
      bestBowlingYear: {
        year: bestBowlingYear.year,
        wickets: bestBowlingYear.wickets,
        average: bestBowlingYear.bowling_average,
      },
      totalYears: stats.length,
    };
  }
  
  private calculateTrend(stats: any[]): any {
    if (stats.length < 3) return { direction: 'stable', message: 'Insufficient data' };
    
    const recent = stats.slice(-3);
    const avgRecent = recent.reduce((sum, s) => sum + (s.runs || 0), 0) / 3;
    const avgPrevious = stats.slice(-6, -3).reduce((sum, s) => sum + (s.runs || 0), 0) / 3;
    
    if (avgRecent > avgPrevious * 1.1) {
      return { direction: 'improving', message: 'Player is in excellent form!' };
    } else if (avgRecent < avgPrevious * 0.9) {
      return { direction: 'declining', message: 'Recent form is concerning' };
    } else {
      return { direction: 'stable', message: 'Consistent performer' };
    }
  }
  
  async getMilestones(playerId: string, format: string): Promise<any> {
    const stats = await query(
      `SELECT runs, wickets, hundreds, five_wickets, catches
       FROM player_stats
       WHERE player_id = $1 AND format = $2 AND year IS NULL`,
      [playerId, format]
    );
    
    if (stats.rows.length === 0) return { milestones: [] };
    
    const data = stats.rows[0];
    const milestones = [];
    
    if (data.runs >= 10000) milestones.push({ type: 'runs', achievement: '10,000 Runs Club', value: data.runs });
    else if (data.runs >= 5000) milestones.push({ type: 'runs', achievement: '5,000 Runs Club', value: data.runs });
    
    if (data.wickets >= 500) milestones.push({ type: 'wickets', achievement: '500 Wickets Club', value: data.wickets });
    else if (data.wickets >= 250) milestones.push({ type: 'wickets', achievement: '250 Wickets Club', value: data.wickets });
    
    if (data.hundreds >= 50) milestones.push({ type: 'hundreds', achievement: '50+ Centuries', value: data.hundreds });
    else if (data.hundreds >= 30) milestones.push({ type: 'hundreds', achievement: '30+ Centuries', value: data.hundreds });
    
    if (data.five_wickets >= 10) milestones.push({ type: 'fiveWickets', achievement: '10+ Five-Wicket Hauls', value: data.five_wickets });
    
    return { milestones };
  }
  
  async getHeadToHead(player1Id: string, player2Id: string): Promise<any> {
    const result = await query(
      `SELECT 
         m.id, m.match_date, m.venue_name, m.tournament_id,
         mp1.runs as player1_runs, mp1.wickets as player1_wickets,
         mp2.runs as player2_runs, mp2.wickets as player2_wickets,
         m.winner_team_id
       FROM matches m
       JOIN match_players mp1 ON m.id = mp1.match_id AND mp1.player_id = $1
       JOIN match_players mp2 ON m.id = mp2.match_id AND mp2.player_id = $2
       ORDER BY m.match_date DESC
       LIMIT 20`,
      [player1Id, player2Id]
    );
    
    const summary = {
      matchesPlayed: result.rows.length,
      player1Better: result.rows.filter(r => r.player1_runs > r.player2_runs).length,
      player2Better: result.rows.filter(r => r.player2_runs > r.player1_runs).length,
      averageWhenFace: {
        player1: { runs: 0, wickets: 0 },
        player2: { runs: 0, wickets: 0 },
      },
    };
    
    if (result.rows.length > 0) {
      summary.averageWhenFace.player1.runs = result.rows.reduce((sum, r) => sum + (r.player1_runs || 0), 0) / result.rows.length;
      summary.averageWhenFace.player1.wickets = result.rows.reduce((sum, r) => sum + (r.player1_wickets || 0), 0) / result.rows.length;
      summary.averageWhenFace.player2.runs = result.rows.reduce((sum, r) => sum + (r.player2_runs || 0), 0) / result.rows.length;
      summary.averageWhenFace.player2.wickets = result.rows.reduce((sum, r) => sum + (r.player2_wickets || 0), 0) / result.rows.length;
    }
    
    return { matches: result.rows, summary };
  }
}

export const playerStatsService = new PlayerStatsService();