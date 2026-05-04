import { Request, Response } from 'express';
import { worldCupService } from '../../services/internal/worldCupService';

export class WorldCupController {
  
  // GET /api/v1/world-cup/tournaments
  async getAllTournaments(req: Request, res: Response) {
    try {
      const { type = 'odi' } = req.query;
      const tournaments = await worldCupService.getAllTournaments(type as string);
      res.json({
        success: true,
        data: tournaments,
        total: tournaments.length
      });
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch tournaments' });
    }
  }

  // GET /api/v1/world-cup/tournaments/:id
  async getTournamentById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const tournament = await worldCupService.getTournamentById(id);
      if (!tournament) {
        return res.status(404).json({ success: false, error: 'Tournament not found' });
      }
      res.json({ success: true, data: tournament });
    } catch (error) {
      console.error('Error fetching tournament:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch tournament' });
    }
  }

  // GET /api/v1/world-cup/tournaments/year/:year
  async getTournamentByYear(req: Request, res: Response) {
    try {
      const year = parseInt(req.params.year);
      const { type = 'odi' } = req.query;
      const tournament = await worldCupService.getTournamentByYear(year, type as string);
      if (!tournament) {
        return res.status(404).json({ success: false, error: 'Tournament not found' });
      }
      res.json({ success: true, data: tournament });
    } catch (error) {
      console.error('Error fetching tournament by year:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch tournament' });
    }
  }

  // GET /api/v1/world-cup/team-rankings
  async getTeamRankings(req: Request, res: Response) {
    try {
      const { type = 'odi' } = req.query;
      const rankings = await worldCupService.getTeamRankings(type as string);
      res.json({ success: true, data: rankings });
    } catch (error) {
      console.error('Error fetching team rankings:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch team rankings' });
    }
  }

  // GET /api/v1/world-cup/tournaments/:id/matches
  async getTournamentMatches(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const matches = await worldCupService.getTournamentMatches(id);
      res.json({ success: true, data: matches });
    } catch (error) {
      console.error('Error fetching matches:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch matches' });
    }
  }

  // GET /api/v1/world-cup/tournaments/:id/points-table
  async getPointsTable(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const pointsTable = await worldCupService.getPointsTable(id);
      res.json({ success: true, data: pointsTable });
    } catch (error) {
      console.error('Error fetching points table:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch points table' });
    }
  }

  // GET /api/v1/world-cup/tournaments/:id/squad/:teamId
  async getTeamSquad(req: Request, res: Response) {
    try {
      const tournamentId = parseInt(req.params.id);
      const teamId = parseInt(req.params.teamId);
      const squad = await worldCupService.getTeamSquad(tournamentId, teamId);
      res.json({ success: true, data: squad });
    } catch (error) {
      console.error('Error fetching squad:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch squad' });
    }
  }

  // GET /api/v1/world-cup/tournaments/:id/stats
  async getTournamentStats(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const stats = await worldCupService.getTournamentStats(id);
      res.json({ success: true, data: stats });
    } catch (error) {
      console.error('Error fetching tournament stats:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch tournament stats' });
    }
  }

  // GET /api/v1/world-cup/records
  async getAllTimeRecords(req: Request, res: Response) {
    try {
      const { category } = req.query;
      const records = await worldCupService.getAllTimeRecords(category as string);
      res.json({ success: true, data: records });
    } catch (error) {
      console.error('Error fetching records:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch records' });
    }
  }

  // GET /api/v1/world-cup/:year/full-details
  async getFullTournamentDetails(req: Request, res: Response) {
    try {
      const year = parseInt(req.params.year);
      const { type = 'odi' } = req.query;
      const details = await worldCupService.getFullTournamentDetails(year, type as string);
      if (!details) {
        return res.status(404).json({ success: false, error: 'Tournament not found' });
      }
      res.json({ success: true, data: details });
    } catch (error) {
      console.error('Error fetching full tournament details:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch tournament details' });
    }
  }
}

export const worldCupController = new WorldCupController();