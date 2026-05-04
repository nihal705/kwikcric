import { query, transaction } from '../../config/database/postgres';
import { cacheGet, cacheSet, cacheDel, cacheDelPattern } from '../../config/database/redis';
import { NotFoundError } from '../../middleware/errorHandler';
import { logger } from '../../utils/logger';
import { emitLiveScoreUpdate } from '../../sockets';

export interface MatchCreateData {
  tournamentId: string;
  matchDate: Date;
  venueName: string;
  team1Id: string;
  team2Id: string;
  matchNumber?: number;
  matchTime?: string;
  status?: string;
}

export interface LiveMatchUpdate {
  matchId: string;
  currentScore?: string;
  currentOvers?: string;
  currentRunRate?: number;
  requiredRunRate?: number;
  lastBall?: string;
  commentary?: string;
}

export interface MatchResult {
  winnerTeamId: string;
  winMargin: string;
  winMarginRuns?: number;
  winMarginWickets?: number;
  manOfMatchId?: string;
  scorecardJson?: any;
}

export class MatchService {
  
  async createMatch(data: MatchCreateData): Promise<any> {
    const result = await query(
      `INSERT INTO matches (
        tournament_id, match_date, match_time, venue_name, team1_id, team2_id, match_number, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        data.tournamentId,
        data.matchDate,
        data.matchTime || null,
        data.venueName,
        data.team1Id,
        data.team2Id,
        data.matchNumber || null,
        data.status || 'scheduled',
      ]
    );
    
    await cacheDelPattern(`matches:*`);
    return result.rows[0];
  }
  
  async getMatchById(id: string, includeScorecard: boolean = true): Promise<any> {
    const cacheKey = `match:${id}:scorecard:${includeScorecard}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return cached;
    
    const result = await query(
      `SELECT m.*, 
              t1.name as team1_name, t1.team_logo_url as team1_logo,
              t2.name as team2_name, t2.team_logo_url as team2_logo,
              tw.name as winner_name,
              mom.full_name as man_of_match_name,
              tou.name as tournament_name, tou.tournament_type
       FROM matches m
       LEFT JOIN teams t1 ON m.team1_id = t1.id
       LEFT JOIN teams t2 ON m.team2_id = t2.id
       LEFT JOIN teams tw ON m.winner_team_id = tw.id
       LEFT JOIN players mom ON m.man_of_match_id = mom.id
       LEFT JOIN tournaments tou ON m.tournament_id = tou.id
       WHERE m.id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      throw new NotFoundError('Match');
    }
    
    const match = result.rows[0];
    
    if (includeScorecard && match.scorecard_json) {
      match.scorecard = match.scorecard_json;
    }
    
    await cacheSet(cacheKey, match, 3600);
    return match;
  }
  
  async getLiveMatches(): Promise<any[]> {
    const cacheKey = 'matches:live';
    const cached = await cacheGet(cacheKey);
    if (cached) return cached;
    
    const result = await query(
      `SELECT m.id, m.match_date, m.venue_name, m.current_score, m.current_overs, m.status,
              t1.name as team1_name, t1.short_code as team1_code,
              t2.name as team2_name, t2.short_code as team2_code,
              tou.name as tournament_name
       FROM matches m
       JOIN teams t1 ON m.team1_id = t1.id
       JOIN teams t2 ON m.team2_id = t2.id
       LEFT JOIN tournaments tou ON m.tournament_id = tou.id
       WHERE m.status IN ('live', 'in_play')
       ORDER BY m.match_date ASC`,
      []
    );
    
    await cacheSet(cacheKey, result.rows, 30);
    return result.rows;
  }
  
  async updateLiveScore(matchId: string, scoreData: LiveMatchUpdate): Promise<void> {
    const updateFields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;
    
    if (scoreData.currentScore !== undefined) {
      updateFields.push(`current_score = $${paramIndex++}`);
      values.push(scoreData.currentScore);
    }
    if (scoreData.currentOvers !== undefined) {
      updateFields.push(`current_overs = $${paramIndex++}`);
      values.push(scoreData.currentOvers);
    }
    
    if (updateFields.length === 0) return;
    
    updateFields.push(`updated_at = NOW()`);
    values.push(matchId);
    
    await query(
      `UPDATE matches SET ${updateFields.join(', ')} WHERE id = $${paramIndex}`,
      values
    );
    
    await cacheDelPattern(`match:${matchId}*`);
    
    await emitLiveScoreUpdate(matchId, {
      matchId,
      score: scoreData.currentScore || '',
      overs: scoreData.currentOvers || '',
      wickets: 0,
      runs: 0,
      lastBall: scoreData.lastBall || '',
      commentary: scoreData.commentary || '',
    });
  }
  
  async updateMatchResult(matchId: string, result: MatchResult): Promise<void> {
    await query(
      `UPDATE matches 
       SET winner_team_id = $1, win_margin = $2, win_margin_runs = $3, 
           win_margin_wickets = $4, man_of_match_id = $5, scorecard_json = $6,
           status = 'completed', updated_at = NOW()
       WHERE id = $7`,
      [
        result.winnerTeamId,
        result.winMargin,
        result.winMarginRuns || null,
        result.winMarginWickets || null,
        result.manOfMatchId || null,
        result.scorecardJson || null,
        matchId,
      ]
    );
    
    await cacheDelPattern(`match:${matchId}*`);
  }
  
  async getUpcomingMatches(limit: number = 10): Promise<any[]> {
    const result = await query(
      `SELECT m.id, m.match_date, m.venue_name, m.match_time,
              t1.name as team1_name, t1.team_logo_url as team1_logo,
              t2.name as team2_name, t2.team_logo_url as team2_logo,
              tou.name as tournament_name, tou.tournament_type
       FROM matches m
       JOIN teams t1 ON m.team1_id = t1.id
       JOIN teams t2 ON m.team2_id = t2.id
       LEFT JOIN tournaments tou ON m.tournament_id = tou.id
       WHERE m.status = 'scheduled' AND m.match_date >= CURRENT_DATE
       ORDER BY m.match_date ASC
       LIMIT $1`,
      [limit]
    );
    
    return result.rows;
  }
  
  async getRecentResults(limit: number = 10): Promise<any[]> {
    const result = await query(
      `SELECT m.id, m.match_date, m.venue_name, m.win_margin,
              t1.name as team1_name,
              t2.name as team2_name,
              tw.name as winner_name,
              tou.name as tournament_name
       FROM matches m
       JOIN teams t1 ON m.team1_id = t1.id
       JOIN teams t2 ON m.team2_id = t2.id
       LEFT JOIN teams tw ON m.winner_team_id = tw.id
       LEFT JOIN tournaments tou ON m.tournament_id = tou.id
       WHERE m.status = 'completed'
       ORDER BY m.match_date DESC
       LIMIT $1`,
      [limit]
    );
    
    return result.rows;
  }
  
  async getHeadToHead(team1Id: string, team2Id: string): Promise<any> {
    const result = await query(
      `SELECT m.id, m.match_date, m.venue_name, m.win_margin,
              m.winner_team_id,
              tw.name as winner_name,
              tou.name as tournament_name
       FROM matches m
       JOIN teams tw ON m.winner_team_id = tw.id
       LEFT JOIN tournaments tou ON m.tournament_id = tou.id
       WHERE (m.team1_id = $1 AND m.team2_id = $2)
          OR (m.team1_id = $2 AND m.team2_id = $1)
       ORDER BY m.match_date DESC`,
      [team1Id, team2Id]
    );
    
    const totalMatches = result.rows.length;
    const team1Wins = result.rows.filter((m: any) => m.winner_team_id === team1Id).length;
    const team2Wins = result.rows.filter((m: any) => m.winner_team_id === team2Id).length;
    const noResults = totalMatches - team1Wins - team2Wins;
    
    return {
      totalMatches,
      team1Wins,
      team2Wins,
      noResults,
      matches: result.rows,
    };
  }
  
  async getMatchStats(matchId: string): Promise<any> {
    const match = await this.getMatchById(matchId, true);
    
    const stats: any = {
      matchInfo: {
        venue: match.venue_name,
        date: match.match_date,
        tournament: match.tournament_name,
        result: match.win_margin,
      },
      team1: {
        name: match.team1_name,
        runs: 0,
        wickets: 0,
        overs: 0,
      },
      team2: {
        name: match.team2_name,
        runs: 0,
        wickets: 0,
        overs: 0,
      },
      topPerformers: {
        batsman: null,
        bowler: null,
      },
    };
    
    if (match.scorecard_json) {
      const scorecard = match.scorecard_json;
      
      for (const innings of scorecard.innings || []) {
        const teamStat = innings.team === match.team1_name ? stats.team1 : stats.team2;
        teamStat.runs = innings.total_runs || 0;
        teamStat.wickets = innings.total_wickets || 0;
        teamStat.overs = innings.overs || 0;
        
        const topBatsman = innings.batsmen?.sort((a: any, b: any) => b.runs - a.runs)[0];
        if (topBatsman && (!stats.topPerformers.batsman || topBatsman.runs > stats.topPerformers.batsman.runs)) {
          stats.topPerformers.batsman = topBatsman;
        }
        
        const topBowler = innings.bowlers?.sort((a: any, b: any) => b.wickets - a.wickets)[0];
        if (topBowler && (!stats.topPerformers.bowler || topBowler.wickets > stats.topPerformers.bowler.wickets)) {
          stats.topPerformers.bowler = topBowler;
        }
      }
    }
    
    return stats;
  }
}

export const matchService = new MatchService();