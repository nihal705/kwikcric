import { query } from '../../config/database/postgres';
import { cacheGet, cacheSet } from '../../config/database/redis';

export interface MatchPrediction {
  matchId: string;
  team1: string;
  team2: string;
  team1WinProbability: number;
  team2WinProbability: number;
  predictedWinner: string;
  predictedMargin: string;
  confidence: number;
  factors: {
    homeAdvantage: number;
    recentForm: number;
    headToHead: number;
    playerForm: number;
  };
}

export interface PlayerPrediction {
  playerId: string;
  playerName: string;
  predictedRuns: number;
  predictedWickets: number;
  confidence: number;
  formTrend: 'improving' | 'stable' | 'declining';
}

export class PredictionService {
  
  async predictMatch(matchId: string): Promise<MatchPrediction> {
    const cacheKey = `prediction:match:${matchId}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return cached as MatchPrediction;
    
    // Get match details
    const match = await query(
      `SELECT m.*, 
              t1.name as team1_name, t2.name as team2_name,
              t1.primary_color as team1_color, t2.primary_color as team2_color
       FROM matches m
       JOIN teams t1 ON m.team1_id = t1.id
       JOIN teams t2 ON m.team2_id = t2.id
       WHERE m.id = $1`,
      [matchId]
    );
    
    if (match.rows.length === 0) {
      throw new Error('Match not found');
    }
    
    const matchData = match.rows[0];
    
    // Calculate various factors
    const homeAdvantage = await this.calculateHomeAdvantage(matchData.team1_id, matchData.team2_id, matchData.venue_name);
    const recentForm = await this.calculateRecentForm(matchData.team1_id, matchData.team2_id);
    const headToHead = await this.calculateHeadToHead(matchData.team1_id, matchData.team2_id);
    const playerForm = await this.calculatePlayerForm(matchData.team1_id, matchData.team2_id);
    
    // Calculate win probabilities
    let team1Probability = 50;
    team1Probability += homeAdvantage * 5;
    team1Probability += recentForm.team1 * 10;
    team1Probability += headToHead.team1Advantage * 8;
    team1Probability += playerForm.team1 * 7;
    
    const finalTeam1Prob = Math.max(5, Math.min(95, team1Probability));
    const finalTeam2Prob = 100 - finalTeam1Prob;
    
    const predictedWinner = finalTeam1Prob > finalTeam2Prob ? matchData.team1_name : matchData.team2_name;
    const confidence = Math.abs(finalTeam1Prob - finalTeam2Prob);
    
    const prediction: MatchPrediction = {
      matchId,
      team1: matchData.team1_name,
      team2: matchData.team2_name,
      team1WinProbability: Math.round(finalTeam1Prob),
      team2WinProbability: Math.round(finalTeam2Prob),
      predictedWinner,
      predictedMargin: this.calculatePredictedMargin(finalTeam1Prob, finalTeam2Prob),
      confidence: Math.round(confidence),
      factors: {
        homeAdvantage: homeAdvantage * 100,
        recentForm: recentForm.team1 * 100,
        headToHead: headToHead.team1Advantage * 100,
        playerForm: playerForm.team1 * 100,
      },
    };
    
    await cacheSet(cacheKey, prediction, 3600);
    return prediction;
  }
  
  private async calculateHomeAdvantage(team1Id: string, team2Id: string, venue: string): Promise<number> {
    const homeTeamResult = await query(
      `SELECT team_id FROM teams WHERE home_ground ILIKE $1 AND (team_id = $2 OR team_id = $3)`,
      [`%${venue}%`, team1Id, team2Id]
    );
    
    if (homeTeamResult.rows.length > 0) {
      const homeTeamId = homeTeamResult.rows[0].team_id;
      if (homeTeamId === team1Id) return 0.6;
      if (homeTeamId === team2Id) return -0.6;
    }
    
    const venueStats = await query(
      `SELECT 
         COUNT(CASE WHEN winner_team_id = $1 THEN 1 END) as team1_wins,
         COUNT(CASE WHEN winner_team_id = $2 THEN 1 END) as team2_wins
       FROM matches
       WHERE venue_name ILIKE $3 AND status = 'completed'`,
      [team1Id, team2Id, `%${venue}%`]
    );
    
    const total = (venueStats.rows[0].team1_wins || 0) + (venueStats.rows[0].team2_wins || 0);
    if (total > 0) {
      const team1WinRate = venueStats.rows[0].team1_wins / total;
      return (team1WinRate - 0.5) * 2;
    }
    
    return 0;
  }
  
  private async calculateRecentForm(team1Id: string, team2Id: string): Promise<{ team1: number; team2: number }> {
    const getRecentForm = async (teamId: string) => {
      const result = await query(
        `SELECT winner_team_id
         FROM matches
         WHERE (team1_id = $1 OR team2_id = $1) AND status = 'completed'
         ORDER BY match_date DESC
         LIMIT 5`,
        [teamId]
      );
      
      if (result.rows.length === 0) return 0.5;
      
      let wins = 0;
      for (const row of result.rows) {
        if (row.winner_team_id === teamId) wins++;
      }
      
      return wins / result.rows.length;
    };
    
    const team1Form = await getRecentForm(team1Id);
    const team2Form = await getRecentForm(team2Id);
    
    const formDiff = team1Form - team2Form;
    return {
      team1: Math.max(-1, Math.min(1, formDiff)),
      team2: Math.max(-1, Math.min(1, -formDiff)),
    };
  }
  
  private async calculateHeadToHead(team1Id: string, team2Id: string): Promise<{ team1Advantage: number }> {
    const result = await query(
      `SELECT 
         COUNT(CASE WHEN winner_team_id = $1 THEN 1 END) as team1_wins,
         COUNT(CASE WHEN winner_team_id = $2 THEN 1 END) as team2_wins
       FROM matches
       WHERE (team1_id = $1 AND team2_id = $2) OR (team1_id = $2 AND team2_id = $1)`,
      [team1Id, team2Id]
    );
    
    const total = result.rows[0].team1_wins + result.rows[0].team2_wins;
    if (total === 0) return { team1Advantage: 0 };
    
    const team1WinRate = result.rows[0].team1_wins / total;
    const advantage = (team1WinRate - 0.5) * 2;
    
    return { team1Advantage: Math.max(-1, Math.min(1, advantage)) };
  }
  
  private async calculatePlayerForm(team1Id: string, team2Id: string): Promise<{ team1: number; team2: number }> {
    const team1Players = await query(
      `SELECT player_id FROM tournament_teams WHERE team_id = $1 LIMIT 5`,
      [team1Id]
    );
    
    const team2Players = await query(
      `SELECT player_id FROM tournament_teams WHERE team_id = $1 LIMIT 5`,
      [team2Id]
    );
    
    let team1Form = 0;
    let team2Form = 0;
    
    for (const player of team1Players.rows) {
      const form = await this.getPlayerRecentForm(player.player_id);
      team1Form += form;
    }
    
    for (const player of team2Players.rows) {
      const form = await this.getPlayerRecentForm(player.player_id);
      team2Form += form;
    }
    
    const avgTeam1Form = team1Players.rows.length > 0 ? team1Form / team1Players.rows.length : 0.5;
    const avgTeam2Form = team2Players.rows.length > 0 ? team2Form / team2Players.rows.length : 0.5;
    
    const formDiff = avgTeam1Form - avgTeam2Form;
    
    return {
      team1: Math.max(-1, Math.min(1, formDiff)),
      team2: Math.max(-1, Math.min(1, -formDiff)),
    };
  }
  
  private async getPlayerRecentForm(playerId: string): Promise<number> {
    const result = await query(
      `SELECT runs, wickets
       FROM match_players
       WHERE player_id = $1
       ORDER BY created_at DESC
       LIMIT 5`,
      [playerId]
    );
    
    if (result.rows.length === 0) return 0.5;
    
    let totalScore = 0;
    for (const row of result.rows) {
      const runs = row.runs || 0;
      const wickets = row.wickets || 0;
      totalScore += (runs / 50) + (wickets * 2);
    }
    
    const avgScore = totalScore / result.rows.length;
    return Math.min(1, Math.max(0, avgScore / 5));
  }
  
  private calculatePredictedMargin(team1Prob: number, team2Prob: number): string {
    const margin = Math.abs(team1Prob - team2Prob);
    
    if (margin < 10) return 'Very close match';
    if (margin < 20) return 'Close match';
    if (margin < 35) return 'Comfortable win expected';
    return 'One-sided match expected';
  }
  
  async predictPlayerPerformance(playerId: string, matchId: string): Promise<PlayerPrediction> {
    const cacheKey = `prediction:player:${playerId}:${matchId}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return cached as PlayerPrediction;
    
    // Get player stats
    const stats = await query(
      `SELECT runs, wickets, batting_average, bowling_average
       FROM player_stats
       WHERE player_id = $1 AND format IN ('ODI', 'T20I')
       ORDER BY year DESC
       LIMIT 1`,
      [playerId]
    );
    
    // Get recent form
    const recentForm = await this.getPlayerRecentForm(playerId);
    
    // Get venue stats
    const match = await query(`SELECT venue_name FROM matches WHERE id = $1`, [matchId]);
    const venueStats = await query(
      `SELECT AVG(runs) as avg_runs, AVG(wickets) as avg_wickets
       FROM match_players mp
       JOIN matches m ON mp.match_id = m.id
       WHERE mp.player_id = $1 AND m.venue_name ILIKE $2`,
      [playerId, `%${match.rows[0]?.venue_name || ''}%`]
    );
    
    const baseRuns = stats.rows[0]?.runs / (stats.rows[0]?.matches || 1) || 20;
    const baseWickets = stats.rows[0]?.wickets / (stats.rows[0]?.matches || 1) || 0.5;
    
    const predictedRuns = Math.floor(baseRuns * (0.5 + recentForm * 0.5) * (venueStats.rows[0]?.avg_runs ? 1.1 : 1));
    const predictedWickets = parseFloat((baseWickets * (0.5 + recentForm * 0.5)).toFixed(1));
    
    const formTrend = recentForm > 0.6 ? 'improving' : recentForm < 0.4 ? 'declining' : 'stable';
    
    const playerNameResult = await query(`SELECT full_name FROM players WHERE id = $1`, [playerId]);
    
    const prediction: PlayerPrediction = {
      playerId,
      playerName: playerNameResult.rows[0]?.full_name || 'Unknown',
      predictedRuns,
      predictedWickets,
      confidence: Math.round(50 + recentForm * 30),
      formTrend,
    };
    
    await cacheSet(cacheKey, prediction, 3600);
    return prediction;
  }
}

export const predictionService = new PredictionService();