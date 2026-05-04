import { Request, Response } from 'express';
import { AuthRequest } from '../../middleware/auth/jwtAuth';

// Mock data (replace with database later)
const players = [
  { id: 1, name: 'Virat Kohli', country: 'India', role: 'Batsman', runs: 12898, wickets: 4, image: null },
  { id: 2, name: 'Rohit Sharma', country: 'India', role: 'Batsman', runs: 10709, wickets: 8, image: null },
  { id: 3, name: 'Jasprit Bumrah', country: 'India', role: 'Bowler', runs: 87, wickets: 128, image: null },
];

export const playerController = {
  // Get all players
  getPlayers: async (req: Request, res: Response) => {
    const { page = 1, limit = 20, country, role, search } = req.query;
    
    let filtered = [...players];
    
    if (country) filtered = filtered.filter(p => p.country === country);
    if (role) filtered = filtered.filter(p => p.role === role);
    if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes((search as string).toLowerCase()));
    
    const start = (Number(page) - 1) * Number(limit);
    const paginated = filtered.slice(start, start + Number(limit));
    
    res.json({
      success: true,
      data: paginated,
      pagination: { page: Number(page), limit: Number(limit), total: filtered.length, totalPages: Math.ceil(filtered.length / Number(limit)) },
    });
  },

  getPlayerById: async (req: Request, res: Response) => {
    const player = players.find(p => p.id === parseInt(req.params.id));
    if (!player) return res.status(404).json({ error: 'Player not found' });
    res.json({ success: true, data: player });
  },

  getPlayerBySlug: async (req: Request, res: Response) => {
    const player = players.find(p => p.name.toLowerCase().replace(/\s+/g, '-') === req.params.slug);
    if (!player) return res.status(404).json({ error: 'Player not found' });
    res.json({ success: true, data: player });
  },

  getPlayerStats: async (req: Request, res: Response) => {
    res.json({ success: true, data: [{ format: 'ODI', runs: 12898, wickets: 4 }] });
  },

  getPlayerProgression: async (req: Request, res: Response) => {
    res.json({ success: true, data: { years: [2020, 2021, 2022, 2023], runs: [1200, 1300, 1400, 1500] } });
  },

  getPlayerMilestones: async (req: Request, res: Response) => {
    res.json({ success: true, data: { milestones: ['10,000 ODI Runs', '50 Centuries'] } });
  },

  searchPlayers: async (req: Request, res: Response) => {
    const { q } = req.query;
    if (!q) return res.json({ success: true, data: [] });
    const filtered = players.filter(p => p.name.toLowerCase().includes((q as string).toLowerCase()));
    res.json({ success: true, data: filtered });
  },

  getTopPlayers: async (req: Request, res: Response) => {
    const { category, limit = 5 } = req.query;
    let sorted = [...players];
    if (category === 'runs') sorted.sort((a, b) => b.runs - a.runs);
    if (category === 'wickets') sorted.sort((a, b) => b.wickets - a.wickets);
    res.json({ success: true, data: sorted.slice(0, parseInt(limit as string)) });
  },

  comparePlayers: async (req: Request, res: Response) => {
    const p1 = players.find(p => p.id === parseInt(req.params.player1Id));
    const p2 = players.find(p => p.id === parseInt(req.params.player2Id));
    if (!p1 || !p2) return res.status(404).json({ error: 'Player not found' });
    res.json({ success: true, data: { player1: p1, player2: p2, comparison: { runs: { player1: p1.runs, player2: p2.runs } } } });
  },

  getHeadToHead: async (req: Request, res: Response) => {
    res.json({ success: true, data: { matches: [], summary: { player1Better: 3, player2Better: 2 } } });
  },

  createPlayer: async (req: AuthRequest, res: Response) => {
    res.status(201).json({ success: true, data: { id: Date.now(), ...req.body } });
  },

  updatePlayer: async (req: AuthRequest, res: Response) => {
    res.json({ success: true, data: { id: req.params.id, ...req.body } });
  },

  deletePlayer: async (req: AuthRequest, res: Response) => {
    res.json({ success: true, message: 'Player deleted' });
  },

  syncPlayerFromExternal: async (req: AuthRequest, res: Response) => {
    res.json({ success: true, message: 'Player synced' });
  },
};