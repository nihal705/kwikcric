import { Router } from 'express';

const router = Router();

const players = [
  { id: 1, name: 'Virat Kohli', country: 'India', role: 'Batsman', runs: 12898, wickets: 4 },
  { id: 2, name: 'Rohit Sharma', country: 'India', role: 'Batsman', runs: 10709, wickets: 8 },
  { id: 3, name: 'Jasprit Bumrah', country: 'India', role: 'Bowler', runs: 87, wickets: 128 },
  { id: 4, name: 'MS Dhoni', country: 'India', role: 'WK-Batsman', runs: 10773, wickets: 0 },
];

router.get('/', (req, res) => {
  res.json({ success: true, data: players });
});

router.get('/:id', (req, res) => {
  const player = players.find(p => p.id === parseInt(req.params.id));
  if (!player) return res.status(404).json({ error: 'Player not found' });
  res.json({ success: true, data: player });
});

router.get('/search', (req, res) => {
  const { q } = req.query;
  if (!q) return res.json({ success: true, data: [] });
  const filtered = players.filter(p => p.name.toLowerCase().includes((q as string).toLowerCase()));
  res.json({ success: true, data: filtered });
});

router.get('/top', (req, res) => {
  const { category, limit = 5 } = req.query;
  let sorted = [...players];
  if (category === 'runs') sorted.sort((a, b) => b.runs - a.runs);
  if (category === 'wickets') sorted.sort((a, b) => b.wickets - a.wickets);
  res.json({ success: true, data: sorted.slice(0, parseInt(limit as string)) });
});

export default router;