import { query, transaction } from '../../config/database/postgres';
import { cacheGet, cacheSet, cacheDel } from '../../config/database/redis';

export interface FantasyTeam {
  id: string;
  userId: string;
  tournamentId: string;
  teamName: string;
  players: FantasyPlayer[];
  totalPoints: number;
  transfersLeft: number;
  captainId: string;
  viceCaptainId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FantasyPlayer {
  playerId: string;
  playerName: string;
  role: string;
  points: number;
  isPlaying: boolean;
  price: number;
}

export interface FantasyStats {
  playerId: string;
  matchId: string;
  runs: number;
  wickets: number;
  catches: number;
  runouts: number;
  bonusPoints: number;
}

// Helper function to delete cache by pattern
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
    console.error('Error deleting cache pattern:', error);
  }
};

export class FantasyService {
  
  async createTeam(userId: string, tournamentId: string, teamName: string, playerIds: string[], captainId: string, viceCaptainId: string): Promise<FantasyTeam> {
    // Validate player count (typically 11 players)
    if (playerIds.length !== 11) {
      throw new Error('Team must have exactly 11 players');
    }
    
    // Validate budget
    const totalBudget = await this.calculateTeamBudget(playerIds);
    if (totalBudget > 100) {
      throw new Error('Team exceeds budget limit of 100 credits');
    }
    
    // Validate player roles
    const roleCounts = await this.validateRoleConstraints(playerIds);
    if (roleCounts.batsmen < 3 || roleCounts.batsmen > 6) {
      throw new Error('Team must have between 3-6 batsmen');
    }
    if (roleCounts.bowlers < 3 || roleCounts.bowlers > 6) {
      throw new Error('Team must have between 3-6 bowlers');
    }
    if (roleCounts.allrounders < 1 || roleCounts.allrounders > 4) {
      throw new Error('Team must have between 1-4 all-rounders');
    }
    if (roleCounts.wicketkeepers < 1 || roleCounts.wicketkeepers > 2) {
      throw new Error('Team must have 1-2 wicket-keepers');
    }
    
    // Validate captain/vice-captain are in the team
    if (!playerIds.includes(captainId)) {
      throw new Error('Captain must be in the team');
    }
    if (!playerIds.includes(viceCaptainId)) {
      throw new Error('Vice-captain must be in the team');
    }
    
    const teamId = this.generateTeamId();
    
    await transaction(async (client) => {
      await client.query(
        `INSERT INTO fantasy_teams (id, user_id, tournament_id, team_name, captain_id, vice_captain_id, total_points, transfers_left)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [teamId, userId, tournamentId, teamName, captainId, viceCaptainId, 0, 100]
      );
      
      for (const playerId of playerIds) {
        const price = await this.getPlayerPrice(playerId);
        await client.query(
          `INSERT INTO fantasy_team_players (team_id, player_id, price, is_playing, points)
           VALUES ($1, $2, $3, $4, $5)`,
          [teamId, playerId, price, true, 0]
        );
      }
      
      return teamId;
    });
    
    const team = await this.getTeam(teamId);
    if (!team) {
      throw new Error('Failed to create team');
    }
    return team;
  }
  
  async getTeam(teamId: string): Promise<FantasyTeam | null> {
    const cacheKey = `fantasy:team:${teamId}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return cached as FantasyTeam;
    
    const teamResult = await query(
      `SELECT * FROM fantasy_teams WHERE id = $1`,
      [teamId]
    );
    
    if (teamResult.rows.length === 0) return null;
    
    const team = teamResult.rows[0];
    
    const playersResult = await query(
      `SELECT ftp.*, p.full_name, p.role
       FROM fantasy_team_players ftp
       JOIN players p ON ftp.player_id = p.id
       WHERE ftp.team_id = $1`,
      [teamId]
    );
    
    const fantasyTeam: FantasyTeam = {
      id: team.id,
      userId: team.user_id,
      tournamentId: team.tournament_id,
      teamName: team.team_name,
      players: playersResult.rows.map(p => ({
        playerId: p.player_id,
        playerName: p.full_name,
        role: p.role,
        points: p.points,
        isPlaying: p.is_playing,
        price: p.price,
      })),
      totalPoints: team.total_points,
      transfersLeft: team.transfers_left,
      captainId: team.captain_id,
      viceCaptainId: team.vice_captain_id,
      createdAt: team.created_at,
      updatedAt: team.updated_at,
    };
    
    await cacheSet(cacheKey, fantasyTeam, 300);
    return fantasyTeam;
  }
  
  async updatePoints(matchId: string): Promise<void> {
    const match = await query(
      `SELECT scorecard_json FROM matches WHERE id = $1 AND status = 'completed'`,
      [matchId]
    );
    
    if (match.rows.length === 0 || !match.rows[0].scorecard_json) return;
    
    const scorecard = match.rows[0].scorecard_json;
    const playerStats: Record<string, FantasyStats> = {};
    
    // Parse scorecard to get player stats
    for (const innings of scorecard.innings || []) {
      for (const batsman of innings.batsmen || []) {
        if (!playerStats[batsman.id]) {
          playerStats[batsman.id] = {
            playerId: batsman.id,
            matchId,
            runs: 0,
            wickets: 0,
            catches: 0,
            runouts: 0,
            bonusPoints: 0,
          };
        }
        playerStats[batsman.id].runs += batsman.runs || 0;
        
        if ((batsman.runs || 0) >= 50) playerStats[batsman.id].bonusPoints += 10;
        if ((batsman.runs || 0) >= 100) playerStats[batsman.id].bonusPoints += 20;
      }
      
      for (const bowler of innings.bowlers || []) {
        if (!playerStats[bowler.id]) {
          playerStats[bowler.id] = {
            playerId: bowler.id,
            matchId,
            runs: 0,
            wickets: 0,
            catches: 0,
            runouts: 0,
            bonusPoints: 0,
          };
        }
        playerStats[bowler.id].wickets += bowler.wickets || 0;
        
        if ((bowler.wickets || 0) >= 3) playerStats[bowler.id].bonusPoints += 10;
        if ((bowler.wickets || 0) >= 5) playerStats[bowler.id].bonusPoints += 20;
      }
      
      for (const fielder of innings.fielders || []) {
        if (!playerStats[fielder.id]) {
          playerStats[fielder.id] = {
            playerId: fielder.id,
            matchId,
            runs: 0,
            wickets: 0,
            catches: 0,
            runouts: 0,
            bonusPoints: 0,
          };
        }
        playerStats[fielder.id].catches += fielder.catches || 0;
        playerStats[fielder.id].runouts += fielder.runouts || 0;
      }
    }
    
    for (const stats of Object.values(playerStats)) {
      let points = 0;
      points += stats.runs;
      points += stats.wickets * 25;
      points += stats.catches * 8;
      points += stats.runouts * 12;
      points += stats.bonusPoints;
      
      await query(
        `UPDATE fantasy_team_players 
         SET points = points + $1, updated_at = NOW()
         WHERE player_id = $2 AND team_id IN (
           SELECT id FROM fantasy_teams WHERE tournament_id = (
             SELECT tournament_id FROM matches WHERE id = $3
           )
         )`,
        [points, stats.playerId, matchId]
      );
      
      await query(
        `UPDATE fantasy_teams 
         SET total_points = (
           SELECT SUM(points) FROM fantasy_team_players 
           WHERE team_id = fantasy_teams.id
         )
         WHERE tournament_id = (SELECT tournament_id FROM matches WHERE id = $1)`,
        [matchId]
      );
    }
    
    const teams = await query(
      `SELECT id FROM fantasy_teams WHERE tournament_id = (SELECT tournament_id FROM matches WHERE id = $1)`,
      [matchId]
    );
    
    for (const team of teams.rows) {
      await cacheDel(`fantasy:team:${team.id}`);
    }
  }
  
  async makeTransfer(teamId: string, outPlayerId: string, inPlayerId: string): Promise<FantasyTeam> {
    const team = await this.getTeam(teamId);
    if (!team) {
      throw new Error('Team not found');
    }
    
    if (team.transfersLeft <= 0) {
      throw new Error('No transfers remaining');
    }
    
    if (!team.players.find(p => p.playerId === outPlayerId)) {
      throw new Error('Player not in team');
    }
    
    if (team.players.find(p => p.playerId === inPlayerId)) {
      throw new Error('Player already in team');
    }
    
    const outPlayerPrice = team.players.find(p => p.playerId === outPlayerId)?.price || 0;
    const inPlayerPrice = await this.getPlayerPrice(inPlayerId);
    const currentBudget = 100 - team.players.reduce((sum, p) => sum + p.price, 0);
    
    if (currentBudget + outPlayerPrice < inPlayerPrice) {
      throw new Error('Insufficient budget for this transfer');
    }
    
    await transaction(async (client) => {
      await client.query(
        `DELETE FROM fantasy_team_players WHERE team_id = $1 AND player_id = $2`,
        [teamId, outPlayerId]
      );
      
      await client.query(
        `INSERT INTO fantasy_team_players (team_id, player_id, price, is_playing, points)
         VALUES ($1, $2, $3, $4, $5)`,
        [teamId, inPlayerId, inPlayerPrice, true, 0]
      );
      
      await client.query(
        `UPDATE fantasy_teams SET transfers_left = transfers_left - 1 WHERE id = $1`,
        [teamId]
      );
    });
    
    await cacheDel(`fantasy:team:${teamId}`);
    const updatedTeam = await this.getTeam(teamId);
    if (!updatedTeam) {
      throw new Error('Failed to retrieve updated team');
    }
    return updatedTeam;
  }
  
  async getLeaderboard(tournamentId: string, limit: number = 50): Promise<any[]> {
    const result = await query(
      `SELECT ft.*, u.username, u.avatar_url
       FROM fantasy_teams ft
       JOIN users u ON ft.user_id = u.id
       WHERE ft.tournament_id = $1
       ORDER BY ft.total_points DESC
       LIMIT $2`,
      [tournamentId, limit]
    );
    
    return result.rows.map((row, index) => ({
      rank: index + 1,
      teamId: row.id,
      teamName: row.team_name,
      username: row.username,
      avatarUrl: row.avatar_url,
      totalPoints: row.total_points,
      transfersLeft: row.transfers_left,
    }));
  }
  
  private async calculateTeamBudget(playerIds: string[]): Promise<number> {
    let totalBudget = 0;
    for (const playerId of playerIds) {
      const price = await this.getPlayerPrice(playerId);
      totalBudget += price;
    }
    return totalBudget;
  }
  
  private async getPlayerPrice(playerId: string): Promise<number> {
    const cacheKey = `fantasy:player:price:${playerId}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return cached as number;
    
    const stats = await query(
      `SELECT runs, wickets, batting_average, bowling_average
       FROM player_stats
       WHERE player_id = $1 AND format = 'ODI'
       LIMIT 1`,
      [playerId]
    );
    
    let price = 5;
    
    if (stats.rows.length > 0) {
      const s = stats.rows[0];
      price += (s.runs || 0) / 200;
      price += (s.wickets || 0) / 10;
      if (s.batting_average && s.batting_average > 40) price += 3;
      if (s.bowling_average && s.bowling_average < 25) price += 3;
    }
    
    price = Math.min(15, Math.max(3, Math.round(price)));
    
    await cacheSet(cacheKey, price, 86400);
    return price;
  }
  
  private async validateRoleConstraints(playerIds: string[]): Promise<{
    batsmen: number;
    bowlers: number;
    allrounders: number;
    wicketkeepers: number;
  }> {
    const result = await query(
      `SELECT role, COUNT(*) as count
       FROM players
       WHERE id = ANY($1::uuid[])
       GROUP BY role`,
      [playerIds]
    );
    
    let batsmen = 0, bowlers = 0, allrounders = 0, wicketkeepers = 0;
    
    for (const row of result.rows) {
      const role = row.role?.toLowerCase() || '';
      if (role.includes('batsman')) batsmen = parseInt(row.count);
      else if (role.includes('bowler')) bowlers = parseInt(row.count);
      else if (role.includes('all-rounder')) allrounders = parseInt(row.count);
      else if (role.includes('wicket')) wicketkeepers = parseInt(row.count);
    }
    
    return { batsmen, bowlers, allrounders, wicketkeepers };
  }
  
  private generateTeamId(): string {
    return `team_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  }
}

export const fantasyService = new FantasyService();