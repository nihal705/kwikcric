import { query, transaction } from '../../config/database/postgres';
import { cacheGet, cacheSet, cacheDelPattern } from '../../config/database/redis';
import { NotFoundError } from '../../middleware/errorHandler';
import { logger } from '../../utils/logger';

export interface TournamentCreateData {
  name: string;
  tournamentType: string;
  season: string;
  year: number;
  gender?: string;
  hostCountry?: string;
  startDate?: Date;
  endDate?: Date;
  totalMatches?: number;
  totalTeams?: number;
  format?: string;
}

export class TournamentService {
  
  async createTournament(data: TournamentCreateData): Promise<any> {
    const result = await query(
      `INSERT INTO tournaments (
        name, tournament_type, season, year, gender, host_country,
        start_date, end_date, total_matches, total_teams, format
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        data.name,
        data.tournamentType,
        data.season,
        data.year,
        data.gender || 'Men',
        data.hostCountry || null,
        data.startDate || null,
        data.endDate || null,
        data.totalMatches || null,
        data.totalTeams || null,
        data.format || null,
      ]
    );
    
    await cacheDelPattern('tournaments:*');
    return result.rows[0];
  }
  
  async getTournamentById(id: string, includeTeams: boolean = true): Promise<any> {
    const cacheKey = `tournament:${id}:teams:${includeTeams}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return cached;
    
    const result = await query(
      `SELECT t.*, 
              w.full_name as winner_name, r.full_name as runner_up_name,
              pot.full_name as player_of_tournament_name
       FROM tournaments t
       LEFT JOIN players w ON t.winner_id = w.id
       LEFT JOIN players r ON t.runner_up_id = r.id
       LEFT JOIN players pot ON t.player_of_tournament_id = pot.id
       WHERE t.id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      throw new NotFoundError('Tournament');
    }
    
    const tournament = result.rows[0];
    
    if (includeTeams) {
      const teams = await query(
        `SELECT tt.*, t.name as team_name, t.team_logo_url, t.primary_color
         FROM tournament_teams tt
         JOIN teams t ON tt.team_id = t.id
         WHERE tt.tournament_id = $1
         ORDER BY tt.position ASC`,
        [id]
      );
      tournament.teams = teams.rows;
    }
    
    await cacheSet(cacheKey, tournament, 3600);
    return tournament;
  }
  
  async getAllTournaments(filters: {
    page?: number;
    limit?: number;
    type?: string;
    year?: number;
    gender?: string;
    status?: string;
  }): Promise<any> {
    const page = filters.page || 1;
    const limit = Math.min(filters.limit || 20, 100);
    const offset = (page - 1) * limit;
    
    let queryText = `
      SELECT t.id, t.name, t.tournament_type, t.season, t.year, t.gender,
             t.host_country, t.start_date, t.end_date, t.status,
             t.winner_team_id, t.logo_url,
             tw.name as winner_team_name
      FROM tournaments t
      LEFT JOIN teams tw ON t.winner_team_id = tw.id
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramIndex = 1;
    
    if (filters.type) {
      queryText += ` AND t.tournament_type = $${paramIndex++}`;
      params.push(filters.type);
    }
    
    if (filters.year) {
      queryText += ` AND t.year = $${paramIndex++}`;
      params.push(filters.year);
    }
    
    if (filters.gender) {
      queryText += ` AND t.gender = $${paramIndex++}`;
      params.push(filters.gender);
    }
    
    if (filters.status) {
      queryText += ` AND t.status = $${paramIndex++}`;
      params.push(filters.status);
    }
    
    queryText += ` ORDER BY t.year DESC, t.start_date DESC`;
    queryText += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limit, offset);
    
    const result = await query(queryText, params);
    
    const countResult = await query(
      `SELECT COUNT(*) FROM tournaments WHERE 1=1`,
      []
    );
    
    const total = parseInt(countResult.rows[0].count);
    
    return {
      data: result.rows,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
  
  async updateTournamentWinner(id: string, winnerTeamId: string, runnerUpTeamId?: string): Promise<any> {
    const result = await query(
      `UPDATE tournaments 
       SET winner_team_id = $1, runner_up_team_id = $2, status = 'completed'
       WHERE id = $3
       RETURNING *`,
      [winnerTeamId, runnerUpTeamId || null, id]
    );
    
    if (result.rows.length === 0) {
      throw new NotFoundError('Tournament');
    }
    
    await cacheDelPattern(`tournament:*${id}*`);
    return result.rows[0];
  }
  
  async getPointsTable(tournamentId: string): Promise<any[]> {
    const result = await query(
      `SELECT tt.team_id, t.name as team_name, t.team_logo_url, t.primary_color,
              tt.matches_played, tt.matches_won, tt.matches_lost, tt.matches_tied,
              tt.matches_nr, tt.points, tt.net_run_rate, tt.position
       FROM tournament_teams tt
       JOIN teams t ON tt.team_id = t.id
       WHERE tt.tournament_id = $1
       ORDER BY tt.position ASC NULLS LAST, tt.points DESC, tt.net_run_rate DESC`,
      [tournamentId]
    );
    
    return result.rows;
  }
  
  async getIPLByYear(year: number): Promise<any> {
    const result = await query(
      `SELECT t.*, 
              tw.name as winner_name, tr.name as runner_up_name,
              oc.full_name as orange_cap_player, pc.full_name as purple_cap_player
       FROM tournaments t
       LEFT JOIN teams tw ON t.winner_team_id = tw.id
       LEFT JOIN teams tr ON t.runner_up_team_id = tr.id
       LEFT JOIN tournament_awards oa ON t.id = oa.tournament_id AND oa.award_type = 'Orange_Cap'
       LEFT JOIN players oc ON oa.player_id = oc.id
       LEFT JOIN tournament_awards pa ON t.id = pa.tournament_id AND pa.award_type = 'Purple_Cap'
       LEFT JOIN players pc ON pa.player_id = pc.id
       WHERE t.name = 'Indian Premier League' AND t.year = $1`,
      [year]
    );
    
    if (result.rows.length === 0) return null;
    
    const tournament = result.rows[0];
    tournament.pointsTable = await this.getPointsTable(tournament.id);
    tournament.matches = await this.getMatchesByTournament(tournament.id);
    
    return tournament;
  }
  
  async getWorldCupByYear(year: number): Promise<any> {
    const result = await query(
      `SELECT t.*, 
              tw.name as winner_name, tr.name as runner_up_name
       FROM tournaments t
       LEFT JOIN teams tw ON t.winner_team_id = tw.id
       LEFT JOIN teams tr ON t.runner_up_team_id = tr.id
       WHERE t.tournament_type = 'World Cup' AND t.year = $1`,
      [year]
    );
    
    if (result.rows.length === 0) return null;
    
    const tournament = result.rows[0];
    tournament.matches = await this.getMatchesByTournament(tournament.id);
    
    return tournament;
  }
  
  async getMatchesByTournament(tournamentId: string): Promise<any[]> {
    const result = await query(
      `SELECT m.*, 
              t1.name as team1_name, t1.team_logo_url as team1_logo,
              t2.name as team2_name, t2.team_logo_url as team2_logo,
              tw.name as winner_name,
              mom.full_name as man_of_match_name
       FROM matches m
       LEFT JOIN teams t1 ON m.team1_id = t1.id
       LEFT JOIN teams t2 ON m.team2_id = t2.id
       LEFT JOIN teams tw ON m.winner_team_id = tw.id
       LEFT JOIN players mom ON m.man_of_match_id = mom.id
       WHERE m.tournament_id = $1
       ORDER BY m.match_date ASC, m.match_number ASC`,
      [tournamentId]
    );
    
    return result.rows;
  }
  
  async getTournamentStats(tournamentId: string): Promise<any> {
    const matches = await this.getMatchesByTournament(tournamentId);
    
    const stats = {
      totalMatches: matches.length,
      completedMatches: matches.filter(m => m.status === 'completed').length,
      mostRuns: null as any,
      mostWickets: null as any,
      highestScore: null as any,
      bestBowling: null as any,
    };
    
    // Aggregate player stats from matches
    const playerRuns: Record<string, { name: string; runs: number; team: string }> = {};
    const playerWickets: Record<string, { name: string; wickets: number; team: string }> = {};
    
    for (const match of matches) {
      if (match.scorecard_json) {
        const scorecard = match.scorecard_json;
        for (const innings of scorecard.innings || []) {
          for (const batsman of innings.batsmen || []) {
            if (!playerRuns[batsman.id]) {
              playerRuns[batsman.id] = { name: batsman.name, runs: 0, team: innings.team };
            }
            playerRuns[batsman.id].runs += batsman.runs || 0;
          }
          for (const bowler of innings.bowlers || []) {
            if (!playerWickets[bowler.id]) {
              playerWickets[bowler.id] = { name: bowler.name, wickets: 0, team: innings.team };
            }
            playerWickets[bowler.id].wickets += bowler.wickets || 0;
          }
        }
      }
    }
    
    stats.mostRuns = Object.values(playerRuns).sort((a, b) => b.runs - a.runs)[0] || null;
    stats.mostWickets = Object.values(playerWickets).sort((a, b) => b.wickets - a.wickets)[0] || null;
    
    return stats;
  }
}

export const tournamentService = new TournamentService();