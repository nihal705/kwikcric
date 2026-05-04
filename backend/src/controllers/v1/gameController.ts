import { Request, Response } from 'express';
import { AuthRequest } from '../../middleware/auth/jwtAuth';

const gameStates: Map<string, any> = new Map();

export const gameController = {
  // Quick Cricket
  startQuickCricket: async (req: AuthRequest, res: Response) => {
    const { mode = 'classic' } = req.body;
    const gameId = `game_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const gameState = { gameId, runs: 0, wickets: 0, balls: 0, maxBalls: 6, isGameOver: false, shotHistory: [] };
    gameStates.set(gameId, gameState);
    res.json({ success: true, data: gameState });
  },

  playQuickCricketShot: async (req: AuthRequest, res: Response) => {
    const { gameId, shotType } = req.body;
    const gameState = gameStates.get(gameId);
    if (!gameState) return res.status(404).json({ error: 'Game not found' });
    
    const outcomes = [
      { runs: 4, isWicket: false, outcome: 'four', message: 'FOUR!', animation: 'boundary' },
      { runs: 6, isWicket: false, outcome: 'six', message: 'SIX!', animation: 'six' },
      { runs: 1, isWicket: false, outcome: 'single', message: 'Single', animation: 'single' },
      { runs: 0, isWicket: true, outcome: 'wicket', message: 'OUT!', animation: 'wicket' },
    ];
    const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
    
    if (!outcome.isWicket) gameState.runs += outcome.runs;
    else gameState.wickets++;
    gameState.balls++;
    gameState.shotHistory.push({ ball: gameState.balls, shotType, ...outcome });
    
    const gameOver = gameState.wickets >= 3 || gameState.balls >= gameState.maxBalls;
    gameState.isGameOver = gameOver;
    gameStates.set(gameId, gameState);
    
    res.json({ success: true, data: { outcome, gameState, gameOver } });
  },

  getQuickCricketGameState: async (req: AuthRequest, res: Response) => {
    const gameState = gameStates.get(req.params.gameId);
    if (!gameState) return res.status(404).json({ error: 'Game not found' });
    res.json({ success: true, data: gameState });
  },

  // Guess Player
  startGuessPlayer: async (req: AuthRequest, res: Response) => {
    const players = ['Virat Kohli', 'Sachin Tendulkar', 'MS Dhoni', 'Rohit Sharma'];
    const randomPlayer = players[Math.floor(Math.random() * players.length)];
    const gameId = `guess_${Date.now()}`;
    const gameState = { gameId, currentPlayerName: randomPlayer, blurLevel: 12, attemptsLeft: 3, score: 100, isGameOver: false };
    gameStates.set(gameId, gameState);
    res.json({ success: true, data: gameState });
  },

  makeGuess: async (req: AuthRequest, res: Response) => {
    const { gameId, guess } = req.body;
    const gameState = gameStates.get(gameId);
    if (!gameState) return res.status(404).json({ error: 'Game not found' });
    
    const isCorrect = guess.toLowerCase() === gameState.currentPlayerName.toLowerCase();
    if (isCorrect) {
      gameState.isGameOver = true;
      res.json({ success: true, data: { correct: true, gameState, message: 'Correct!' } });
    } else {
      gameState.attemptsLeft--;
      if (gameState.attemptsLeft <= 0) gameState.isGameOver = true;
      res.json({ success: true, data: { correct: false, gameState, message: 'Wrong guess!' } });
    }
  },

  revealHint: async (req: AuthRequest, res: Response) => {
    res.json({ success: true, data: { hint: 'This player is from India', gameState: null } });
  },

  reduceBlur: async (req: AuthRequest, res: Response) => {
    res.json({ success: true, data: { newBlurLevel: 5, gameState: null } });
  },

  getGuessPlayerGameState: async (req: AuthRequest, res: Response) => {
    const gameState = gameStates.get(req.params.gameId);
    res.json({ success: true, data: gameState });
  },

  // Leaderboard
  getLeaderboard: async (req: Request, res: Response) => {
    res.json({ success: true, data: [{ rank: 1, username: 'player1', score: 1000 }, { rank: 2, username: 'player2', score: 900 }] });
  },

  getUserRank: async (req: AuthRequest, res: Response) => {
    res.json({ success: true, data: { rank: 5, score: 750, totalPlayers: 100 } });
  },

  getTopCountries: async (req: Request, res: Response) => {
    res.json({ success: true, data: [{ country: 'India', totalScore: 5000 }, { country: 'Australia', totalScore: 4500 }] });
  },

  getRecentWinners: async (req: Request, res: Response) => {
    res.json({ success: true, data: [{ date: '2024-01-15', winner: 'player1', score: 1200 }] });
  },
};