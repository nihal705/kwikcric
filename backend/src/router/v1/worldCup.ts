// backend/src/router/v1/worldCup.ts
import { Router, Request, Response } from 'express';
import { pool } from '../../config/database/postgres';
require('dotenv').config();

const router = Router();

// Tournament endpoints
router.get('/tournaments', async (req: Request, res: Response) => {
    try {
        const { type = 'odi' } = req.query;
        const result = await pool.query(`
            SELECT 
                wc.id, wc.year, wc.tournament_type, wc.host_country,
                w.name as winner_name, r.name as runner_up_name,
                wc_capt.name as winner_captain, r_capt.name as runner_up_captain,
                pot.name as player_of_tournament,
                wc.total_matches, wc.total_teams,
                wc.final_match_venue, wc.final_match_date,
                wc.total_sixes, wc.total_centuries
            FROM world_cup_tournaments wc
            LEFT JOIN teams w ON wc.winner_team_id = w.id
            LEFT JOIN teams r ON wc.runner_up_team_id = r.id
            LEFT JOIN players wc_capt ON wc.winner_captain_id = wc_capt.id
            LEFT JOIN players r_capt ON wc.runner_up_captain_id = r_capt.id
            LEFT JOIN players pot ON wc.player_of_tournament_id = pot.id
            WHERE wc.tournament_type = $1
            ORDER BY wc.year DESC
        `, [type]);
        
        res.json({ success: true, data: result.rows });
    } catch (error) {
        const err = error as Error;
        console.error('Error fetching tournaments:', err);
        res.status(500).json({ error: err.message });
    }
});

router.get('/tournaments/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const result = await pool.query(`
            SELECT 
                wc.id, wc.year, wc.tournament_type, wc.host_country,
                w.name as winner_name, r.name as runner_up_name,
                wc_capt.name as winner_captain, r_capt.name as runner_up_captain,
                pot.name as player_of_tournament,
                wc.total_matches, wc.total_teams,
                wc.final_match_venue, wc.final_match_date
            FROM world_cup_tournaments wc
            LEFT JOIN teams w ON wc.winner_team_id = w.id
            LEFT JOIN teams r ON wc.runner_up_team_id = r.id
            LEFT JOIN players wc_capt ON wc.winner_captain_id = wc_capt.id
            LEFT JOIN players r_capt ON wc.runner_up_captain_id = r_capt.id
            LEFT JOIN players pot ON wc.player_of_tournament_id = pot.id
            WHERE wc.id = $1
        `, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Tournament not found' });
        }
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        const err = error as Error;
        console.error('Error fetching tournament:', err);
        res.status(500).json({ error: err.message });
    }
});

router.get('/tournaments/year/:year', async (req: Request, res: Response) => {
    try {
        const year = parseInt(req.params.year);
        const { type = 'odi' } = req.query;
        const result = await pool.query(`
            SELECT 
                wc.id, wc.year, wc.tournament_type, wc.host_country,
                w.name as winner_name, r.name as runner_up_name,
                wc_capt.name as winner_captain, r_capt.name as runner_up_captain,
                pot.name as player_of_tournament,
                wc.total_matches, wc.total_teams,
                wc.final_match_venue, wc.final_match_date
            FROM world_cup_tournaments wc
            LEFT JOIN teams w ON wc.winner_team_id = w.id
            LEFT JOIN teams r ON wc.runner_up_team_id = r.id
            LEFT JOIN players wc_capt ON wc.winner_captain_id = wc_capt.id
            LEFT JOIN players r_capt ON wc.runner_up_captain_id = r_capt.id
            LEFT JOIN players pot ON wc.player_of_tournament_id = pot.id
            WHERE wc.year = $1 AND wc.tournament_type = $2
        `, [year, type]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Tournament not found' });
        }
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        const err = error as Error;
        console.error('Error fetching tournament by year:', err);
        res.status(500).json({ error: err.message });
    }
});

// Team rankings
router.get('/team-rankings', async (req: Request, res: Response) => {
    try {
        const { type = 'odi' } = req.query;
        const result = await pool.query(`
            SELECT 
                tr.rank_position as rank,
                t.name as team_name,
                tr.titles_won,
                tr.runner_up_count,
                tr.semi_final_count,
                tr.matches_played,
                tr.matches_won,
                tr.win_percentage
            FROM world_cup_team_rankings tr
            JOIN teams t ON tr.team_id = t.id
            WHERE tr.tournament_type = $1 AND tr.titles_won > 0
            ORDER BY tr.rank_position
        `, [type]);
        
        res.json({ success: true, data: result.rows });
    } catch (error) {
        const err = error as Error;
        console.error('Error fetching team rankings:', err);
        res.status(500).json({ error: err.message });
    }
});

// Tournament specific data
router.get('/tournaments/:id/matches', async (req: Request, res: Response) => {
    try {
        const tournamentId = parseInt(req.params.id);
        const result = await pool.query(`
            SELECT 
                m.id, 
                m.match_type, 
                m.stage, 
                m.match_number,
                COALESCE(t1.name, '') as team1_name,
                COALESCE(t2.name, '') as team2_name,
                m.team1_score,
                m.team1_wickets,
                m.team1_overs,
                m.team2_score,
                m.team2_wickets,
                m.team2_overs,
                COALESCE(w.name, '') as winner_name,
                m.winner_margin,
                COALESCE(m.margin_type, '') as margin_type,
                COALESCE(m.venue, '') as venue,
                m.match_date,
                COALESCE(mom.name, '') as man_of_match_name,
                COALESCE(m.is_final, false) as is_final,
                COALESCE(m.is_abandoned, false) as is_abandoned,
                m.abandonment_reason,
                m.result_note
            FROM world_cup_matches m
            LEFT JOIN teams t1 ON m.team1_id = t1.id
            LEFT JOIN teams t2 ON m.team2_id = t2.id
            LEFT JOIN teams w ON m.winner_team_id = w.id
            LEFT JOIN players mom ON m.man_of_match_id = mom.id
            WHERE m.tournament_id = $1
            ORDER BY m.match_date, m.match_number
        `, [tournamentId]);
        
        res.json({ success: true, data: result.rows });
    } catch (error) {
        const err = error as Error;
        console.error('Error fetching matches:', err);
        res.status(500).json({ error: err.message });
    }
});

router.get('/tournaments/:id/points-table', async (req: Request, res: Response) => {
    try {
        const tournamentId = parseInt(req.params.id);
        const result = await pool.query(`
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
        
        res.json({ success: true, data: result.rows });
    } catch (error) {
        const err = error as Error;
        console.error('Error fetching points table:', err);
        res.status(500).json({ error: err.message });
    }
});

router.get('/tournaments/:id/squad/:teamId', async (req: Request, res: Response) => {
    try {
        const tournamentId = parseInt(req.params.id);
        const teamId = parseInt(req.params.teamId);
        const result = await pool.query(`
            SELECT p.name, s.role, s.is_captain, s.is_wicket_keeper
            FROM team_winning_squads s
            JOIN players p ON s.player_id = p.id
            WHERE s.tournament_id = $1 AND s.team_id = $2
            ORDER BY s.is_captain DESC, p.name
        `, [tournamentId, teamId]);
        
        res.json({ success: true, data: result.rows });
    } catch (error) {
        const err = error as Error;
        console.error('Error fetching squad:', err);
        res.status(500).json({ error: err.message });
    }
});

// Records
router.get('/records', async (req: Request, res: Response) => {
    try {
        const { type = 'odi' } = req.query;
        const result = await pool.query(`
            SELECT p.name as player_name, r.value, r.category, r.matches_played
            FROM world_cup_all_time_records r
            JOIN players p ON r.player_id = p.id
            WHERE r.tournament_type = $1
            ORDER BY r.value DESC
            LIMIT 50
        `, [type]);
        
        res.json({ success: true, data: result.rows });
    } catch (error) {
        const err = error as Error;
        console.error('Error fetching records:', err);
        res.status(500).json({ error: err.message });
    }
});

// Full tournament details
router.get('/:year/full-details', async (req: Request, res: Response) => {
    try {
        const year = parseInt(req.params.year);
        const { type = 'odi' } = req.query;
        
        const tournamentResult = await pool.query(`
            SELECT 
                wc.id, wc.year, wc.tournament_type, wc.host_country,
                w.name as winner_name, r.name as runner_up_name,
                wc_capt.name as winner_captain, r_capt.name as runner_up_captain,
                pot.name as player_of_tournament,
                wc.total_matches, wc.total_teams,
                wc.final_match_venue, wc.final_match_date
            FROM world_cup_tournaments wc
            LEFT JOIN teams w ON wc.winner_team_id = w.id
            LEFT JOIN teams r ON wc.runner_up_team_id = r.id
            LEFT JOIN players wc_capt ON wc.winner_captain_id = wc_capt.id
            LEFT JOIN players r_capt ON wc.runner_up_captain_id = r_capt.id
            LEFT JOIN players pot ON wc.player_of_tournament_id = pot.id
            WHERE wc.year = $1 AND wc.tournament_type = $2
        `, [year, type]);
        
        if (tournamentResult.rows.length === 0) {
            return res.status(404).json({ error: 'Tournament not found' });
        }
        
        const tournament = tournamentResult.rows[0];
        
        const matchesResult = await pool.query(`
            SELECT 
                m.id, m.match_type, m.stage,
                COALESCE(t1.name, '') as team1_name, 
                COALESCE(t2.name, '') as team2_name,
                m.team1_score, m.team2_score,
                m.team1_wickets, m.team2_wickets,
                m.team1_overs, m.team2_overs,
                COALESCE(w.name, '') as winner_name,
                m.winner_margin, 
                COALESCE(m.margin_type, '') as margin_type,
                COALESCE(m.venue, '') as venue,
                m.match_date,
                COALESCE(mom.name, '') as man_of_match_name,
                COALESCE(m.is_final, false) as is_final,
                COALESCE(m.is_abandoned, false) as is_abandoned,
                m.abandonment_reason,
                m.result_note
            FROM world_cup_matches m
            LEFT JOIN teams t1 ON m.team1_id = t1.id
            LEFT JOIN teams t2 ON m.team2_id = t2.id
            LEFT JOIN teams w ON m.winner_team_id = w.id
            LEFT JOIN players mom ON m.man_of_match_id = mom.id
            WHERE m.tournament_id = $1
            ORDER BY m.match_date
        `, [tournament.id]);
        
        const pointsResult = await pool.query(`
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
        `, [tournament.id]);
        
        res.json({ 
            success: true, 
            data: {
                tournament,
                matches: matchesResult.rows,
                pointsTable: pointsResult.rows,
                stats: null,
                teamRankings: []
            }
        });
    } catch (error) {
        const err = error as Error;
        console.error('Error fetching full tournament details:', err);
        res.status(500).json({ error: err.message });
    }
});

// Team details with victory filtering by type
router.get('/team/:teamName', async (req: Request, res: Response) => {
    try {
        const { teamName } = req.params;
        const { type = 'odi' } = req.query;
        
        const decodedTeamName = decodeURIComponent(teamName as string);
        
        let teamResult = await pool.query(`
            SELECT id, name, country, world_cup_wins, t20_world_cup_wins
            FROM teams 
            WHERE name ILIKE $1
        `, [decodedTeamName]);
        
        if (teamResult.rows.length === 0) {
            const searchTerm = decodedTeamName.replace(/\s/g, '%');
            teamResult = await pool.query(`
                SELECT id, name, country, world_cup_wins, t20_world_cup_wins
                FROM teams 
                WHERE name ILIKE $1
            `, [`%${searchTerm}%`]);
        }
        
        if (teamResult.rows.length === 0) {
            return res.status(404).json({ error: 'Team not found', searchedName: decodedTeamName });
        }
        
        const team = teamResult.rows[0];
        
        // Filter victories by tournament type
        const victoriesResult = await pool.query(`
            SELECT 
                v.id,
                v.year,
                c.name as captain_name,
                pot.name as player_of_tournament,
                v.image_url,
                wc.final_match_venue as venue,
                wc.final_match_date
            FROM team_world_cup_victories v
            JOIN world_cup_tournaments wc ON v.tournament_id = wc.id
            LEFT JOIN players c ON v.captain_id = c.id
            LEFT JOIN players pot ON v.player_of_tournament_id = pot.id
            WHERE v.team_id = $1 AND wc.tournament_type = $2
            ORDER BY v.year DESC
        `, [team.id, type]);
        
        const victories = [];
        for (const victory of victoriesResult.rows) {
            const finalMatch = await pool.query(`
                SELECT 
                    t1.name as team1_name,
                    t2.name as team2_name,
                    m.team1_score, m.team1_wickets, m.team1_overs,
                    m.team2_score, m.team2_wickets, m.team2_overs,
                    w.name as winner_name,
                    m.winner_margin, m.margin_type,
                    m.venue,
                    m.result_note
                FROM world_cup_matches m
                JOIN teams t1 ON m.team1_id = t1.id
                JOIN teams t2 ON m.team2_id = t2.id
                JOIN teams w ON m.winner_team_id = w.id
                WHERE m.tournament_id = (SELECT tournament_id FROM team_world_cup_victories WHERE id = $1)
                  AND m.match_type = 'final'
            `, [victory.id]);
            
            const squad = await pool.query(`
                SELECT p.name, s.role, s.is_captain, s.is_wicket_keeper
                FROM team_winning_squads s
                JOIN players p ON s.player_id = p.id
                WHERE s.victory_id = $1
                ORDER BY s.is_captain DESC, p.name
            `, [victory.id]);
            
            victories.push({
                ...victory,
                final_match: finalMatch.rows[0] || null,
                squad: squad.rows,
                top_performers: {
                    most_runs: [],
                    most_wickets: []
                }
            });
        }
        
        res.json({
            success: true,
            data: {
                team,
                victories
            }
        });
        
    } catch (error) {
        const err = error as Error;
        console.error('Error fetching team details:', err);
        res.status(500).json({ error: err.message });
    }
});



export default router;