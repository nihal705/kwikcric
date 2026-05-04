import { Request, Response } from 'express';
import { AuthRequest } from '../../middleware/auth/jwtAuth';

const iplData: Record<number, any> = {
  2024: { winner: 'Kolkata Knight Riders', runnerUp: 'Sunrisers Hyderabad', orangeCap: { player: 'Virat Kohli', runs: 741 }, purpleCap: { player: 'Harshal Patel', wickets: 32 } },
  2023: { winner: 'Chennai Super Kings', runnerUp: 'Gujarat Titans', orangeCap: { player: 'Shubman Gill', runs: 890 }, purpleCap: { player: 'Mohammed Shami', wickets: 28 } },
};

const worldCupData: Record<number, any> = {
  2023: { winner: 'Australia', runnerUp: 'India', host: 'India', mostRuns: { player: 'Virat Kohli', runs: 765 }, mostWickets: { player: 'Mohammed Shami', wickets: 24 } },
  2019: { winner: 'England', runnerUp: 'New Zealand', host: 'England', mostRuns: { player: 'Rohit Sharma', runs: 648 }, mostWickets: { player: 'Mitchell Starc', wickets: 27 } },
};

export const tournamentController = {
  getTournaments: async (req: Request, res: Response) => {
    res.json({ success: true, data: [{ id: 1, name: 'IPL', year: 2024 }, { id: 2, name: 'World Cup', year: 2023 }] });
  },

  getIPLByYear: async (req: Request, res: Response) => {
    const data = iplData[parseInt(req.params.year)];
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, data });
  },

  getWorldCupByYear: async (req: Request, res: Response) => {
    const data = worldCupData[parseInt(req.params.year)];
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, data });
  },

  getLiveMatches: async (req: Request, res: Response) => {
    res.json({ success: true, data: [{ id: 1, team1: 'India', team2: 'Australia', status: 'live' }] });
  },

  getUpcomingMatches: async (req: Request, res: Response) => {
    res.json({ success: true, data: [{ id: 2, team1: 'England', team2: 'New Zealand', date: '2024-01-20' }] });
  },

  getRecentResults: async (req: Request, res: Response) => {
    res.json({ success: true, data: [{ id: 3, team1: 'India', team2: 'Pakistan', winner: 'India', margin: '6 wickets' }] });
  },

  getTournamentById: async (req: Request, res: Response) => {
    res.json({ success: true, data: { id: req.params.id, name: 'IPL', year: 2024 } });
  },

  getPointsTable: async (req: Request, res: Response) => {
    res.json({ success: true, data: [{ position: 1, team: 'Team A', points: 22 }, { position: 2, team: 'Team B', points: 20 }] });
  },

  getMatches: async (req: Request, res: Response) => {
    res.json({ success: true, data: [{ id: 1, team1: 'CSK', team2: 'MI', winner: 'CSK' }] });
  },

  getTournamentStats: async (req: Request, res: Response) => {
    res.json({ success: true, data: { totalMatches: 74, mostRuns: { player: 'Virat Kohli', runs: 741 } } });
  },

  getMatchById: async (req: Request, res: Response) => {
    res.json({ success: true, data: { id: req.params.matchId, team1: 'India', team2: 'Australia', status: 'completed' } });
  },

  getMatchStats: async (req: Request, res: Response) => {
    res.json({ success: true, data: { totalRuns: 450, totalWickets: 10, topScorer: { name: 'Virat Kohli', runs: 117 } } });
  },

  getHeadToHead: async (req: Request, res: Response) => {
    res.json({ success: true, data: { totalMatches: 10, team1Wins: 6, team2Wins: 4 } });
  },

  createTournament: async (req: AuthRequest, res: Response) => {
    res.status(201).json({ success: true, data: { id: Date.now(), ...req.body } });
  },

  updateTournamentWinner: async (req: AuthRequest, res: Response) => {
    res.json({ success: true, data: { id: req.params.id, winner: req.body.winnerTeamId } });
  },

  createMatch: async (req: AuthRequest, res: Response) => {
    res.status(201).json({ success: true, data: { id: Date.now(), ...req.body } });
  },

  updateLiveScore: async (req: AuthRequest, res: Response) => {
    res.json({ success: true, message: 'Score updated' });
  },

  updateMatchResult: async (req: AuthRequest, res: Response) => {
    res.json({ success: true, message: 'Result updated' });
  },
};