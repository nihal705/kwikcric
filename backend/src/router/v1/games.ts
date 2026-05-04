import { Router } from 'express';

const router = Router();

const gameStates = new Map();

router.post('/quick-cricket/start', (req, res) => {
  const gameId = `game_${Date.now()}`;
  const gameState = { gameId, runs: 0, wickets: 0, balls: 0, maxBalls: 6, isGameOver: false };
  gameStates.set(gameId, gameState);
  res.json({ success: true, data: gameState });
});

router.post('/quick-cricket/play', (req, res) => {
  const { gameId, shotType } = req.body;
  const gameState = gameStates.get(gameId);
  if (!gameState) return res.status(404).json({ error: 'Game not found' });
  
  const outcomes = [
    { runs: 4, isWicket: false, message: 'FOUR!' },
    { runs: 6, isWicket: false, message: 'SIX!' },
    { runs: 1, isWicket: false, message: 'Single' },
    { runs: 0, isWicket: true, message: 'OUT!' },
  ];
  const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
  
  if (!outcome.isWicket) gameState.runs += outcome.runs;
  else gameState.wickets++;
  gameState.balls++;
  gameState.isGameOver = gameState.wickets >= 3 || gameState.balls >= gameState.maxBalls;
  
  gameStates.set(gameId, gameState);
  res.json({ success: true, data: { outcome, gameState, gameOver: gameState.isGameOver } });
});

router.get('/leaderboard/:gameType', (req, res) => {
  res.json({ success: true, data: [
    { rank: 1, username: 'player1', score: 1000 },
    { rank: 2, username: 'player2', score: 900 },
  ]});
});

export default router;