import { query } from '../../config/database/postgres';

export interface Tournament {
  id: number;
  year: number;
  tournament_type: string;
  host_country: string;
  winner_name: string;
  runner_up_name: string;
  winner_captain: string;
  player_of_tournament: string;
  total_matches: number;
  total_teams: number;
}

export interface TeamRanking {
  rank: number;
  team_name: string;
  titles_won: number;
  runner_up_count: number;
  semi_final_count: number;
  matches_played: number;
  matches_won: number;
  win_percentage: number;
}

export interface Match {
  id: number;
  match_type: string;
  team1_name: string;
  team2_name: string;
  team1_score: number;
  team2_score: number;
  winner_name: string;
  winner_margin: number;
  margin_type: string;
  venue: string;
  match_date: string;
  man_of_match_name: string;
}

export interface PointsTableEntry {
  group_name: string;
  team_name: string;
  matches_played: number;
  matches_won: number;
  matches_lost: number;
  matches_tied: number;
  matches_nr: number;
  points: number;
  net_run_rate: number;
}

export interface SquadPlayer {
  player_name: string;
  jersey_number: number;
  is_captain: boolean;
  is_keeper: boolean;
  batting_style: string;
  bowling_style: string;
}

export interface TournamentStats {
  most_runs_player: string;
  most_runs_value: number;
  most_wickets_player: string;
  most_wickets_value: number;
  most_sixes_player: string;
  most_sixes_value: number;
  most_hundreds_player: string;
  most_hundreds_value: number;
}

export class WorldCupService {
  
  // Get all tournaments
  async getAllTournaments(tournamentType: string = 'odi'): Promise<Tournament[]> {
    const result = await query(`
      SELECT * FROM vw_tournament_summary 
      WHERE tournament_type = $1 
      ORDER BY year DESC
    `, [tournamentType]);
    return result.rows;
  }

  // Get tournament by ID
  async getTournamentById(id: number): Promise<Tournament | null> {
    const result = await query(`SELECT * FROM vw_tournament_summary WHERE id = $1`, [id]);
    return result.rows[0] || null;
  }

  // Get tournament by year
  async getTournamentByYear(year: number, tournamentType: string = 'odi'): Promise<Tournament | null> {
    const result = await query(`
      SELECT * FROM vw_tournament_summary 
      WHERE year = $1 AND tournament_type = $2
    `, [year, tournamentType]);
    return result.rows[0] || null;
  }

  // Get all-time team rankings
  async getTeamRankings(tournamentType: string = 'odi'): Promise<TeamRanking[]> {
    const result = await query(`
      SELECT * FROM vw_all_time_team_rankings 
      WHERE tournament_type = $1
    `, [tournamentType]);
    return result.rows;
  }

  // Get matches for a tournament
  async getTournamentMatches(tournamentId: number): Promise<Match[]> {
    const result = await query(`
      SELECT * FROM vw_tournament_matches 
      WHERE tournament_id = $1 
      ORDER BY match_date, match_number
    `, [tournamentId]);
    return result.rows;
  }

  // Get points table for a tournament
  async getPointsTable(tournamentId: number): Promise<PointsTableEntry[]> {
    const result = await query(`
      SELECT 
        pt.group_name,
        t.name as team_name,
        pt.matches_played,
        pt.matches_won,
        pt.matches_lost,
        pt.matches_tied,
        pt.matches_nr,
        pt.points,
        pt.net_run_rate
      FROM world_cup_points_table pt
      JOIN teams t ON pt.team_id = t.id
      WHERE pt.tournament_id = $1
      ORDER BY pt.group_name, pt.points DESC, pt.net_run_rate DESC
    `, [tournamentId]);
    return result.rows;
  }

  // Get squad for a team in a tournament
  async getTeamSquad(tournamentId: number, teamId: number): Promise<SquadPlayer[]> {
    const result = await query(`
      SELECT 
        p.name as player_name,
        ws.jersey_number,
        ws.is_captain,
        ws.is_keeper,
        p.batting_style,
        p.bowling_style
      FROM world_cup_squads ws
      JOIN players p ON ws.player_id = p.id
      WHERE ws.tournament_id = $1 AND ws.team_id = $2
      ORDER BY ws.is_captain DESC, p.name
    `, [tournamentId, teamId]);
    return result.rows;
  }

  // Get tournament stats (most runs, wickets, etc.)
  async getTournamentStats(tournamentId: number): Promise<TournamentStats | null> {
    const result = await query(`
      SELECT 
        pr.name as most_runs_player,
        ts.most_runs_value,
        pw.name as most_wickets_player,
        ts.most_wickets_value,
        ps.name as most_sixes_player,
        ts.most_sixes_value,
        ph.name as most_hundreds_player,
        ts.most_hundreds_value
      FROM world_cup_tournament_stats ts
      LEFT JOIN players pr ON ts.most_runs_player_id = pr.id
      LEFT JOIN players pw ON ts.most_wickets_player_id = pw.id
      LEFT JOIN players ps ON ts.most_sixes_player_id = ps.id
      LEFT JOIN players ph ON ts.most_hundreds_player_id = ph.id
      WHERE ts.tournament_id = $1
    `, [tournamentId]);
    return result.rows[0] || null;
  }

  // Get all-time records
  async getAllTimeRecords(category?: string): Promise<any[]> {
    let queryText = `
      SELECT 
        p.name as player_name,
        r.category,
        r.value,
        r.record_description
      FROM world_cup_all_time_records r
      JOIN players p ON r.player_id = p.id
    `;
    const params: any[] = [];
    
    if (category) {
      queryText += ` WHERE r.category = $1`;
      params.push(category);
    }
    
    queryText += ` ORDER BY r.value DESC LIMIT 10`;
    
    const result = await query(queryText, params);
    return result.rows;
  }

  // Get tournament by year with all details
  async getFullTournamentDetails(year: number, tournamentType: string = 'odi'): Promise<any> {
    const tournament = await this.getTournamentByYear(year, tournamentType);
    if (!tournament) return null;

    const [matches, pointsTable, stats, teamRankings] = await Promise.all([
      this.getTournamentMatches(tournament.id),
      this.getPointsTable(tournament.id),
      this.getTournamentStats(tournament.id),
      this.getTeamRankings(tournamentType)
    ]);

    return {
      tournament,
      matches,
      pointsTable,
      stats,
      teamRankings
    };
  }
}

export const worldCupService = new WorldCupService();