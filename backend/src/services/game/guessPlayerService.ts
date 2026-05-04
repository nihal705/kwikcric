import { randomInt, shuffleArray, randomItem } from '../../utils/helpers/mathHelpers.js';
import { cacheGet, cacheSet } from '../../config/database/redis';
import { getCollection } from '../../config/database/mongodb';
import { query } from '../../config/database/postgres';

export interface GuessPlayerGameState {
  gameId: string;
  userId: string;
  currentPlayerId: string;
  currentPlayerName: string;
  currentPlayerCountry: string;
  currentPlayerImageUrl: string;
  blurLevel: number;
  revealedClues: string[];
  attemptsLeft: number;
  maxAttempts: number;
  score: number;
  hintsUsed: number;
  isGameOver: boolean;
  isWinner: boolean;
  startTime: Date;
  lastUpdate: Date;
}

export interface Clue {
  id: string;
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  revealOrder: number;
}

export class GuessPlayerService {
  
  async createGame(userId: string, difficulty: 'easy' | 'medium' | 'hard' = 'medium'): Promise<GuessPlayerGameState> {
    const player = await this.getRandomPlayer();
    
    const maxAttempts = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 3 : 2;
    const baseScore = difficulty === 'easy' ? 100 : difficulty === 'medium' ? 200 : 300;
    
    const gameState: GuessPlayerGameState = {
      gameId: this.generateGameId(),
      userId,
      currentPlayerId: player.id,
      currentPlayerName: player.full_name,
      currentPlayerCountry: player.country,
      currentPlayerImageUrl: player.image_url || '/assets/default-player.png',
      blurLevel: difficulty === 'easy' ? 8 : difficulty === 'medium' ? 12 : 16,
      revealedClues: [],
      attemptsLeft: maxAttempts,
      maxAttempts,
      score: baseScore,
      hintsUsed: 0,
      isGameOver: false,
      isWinner: false,
      startTime: new Date(),
      lastUpdate: new Date(),
    };
    
    await cacheSet(`game:guess:${gameState.gameId}`, gameState, 3600);
    
    const collection = getCollection('game_sessions');
    await collection.insertOne({
      gameId: gameState.gameId,
      userId,
      gameType: 'guess_player',
      difficulty,
      startTime: gameState.startTime,
      status: 'active',
    });
    
    return gameState;
  }
  
  async makeGuess(gameId: string, guess: string): Promise<{
    correct: boolean;
    gameState: GuessPlayerGameState;
    message: string;
  }> {
    const gameState = await cacheGet(`game:guess:${gameId}`);
    if (!gameState) {
      throw new Error('Game not found');
    }
    
    if (gameState.isGameOver) {
      throw new Error('Game already over');
    }
    
    const isCorrect = this.isMatch(guess, gameState.currentPlayerName);
    
    if (isCorrect) {
      gameState.isGameOver = true;
      gameState.isWinner = true;
      const attemptBonus = gameState.attemptsLeft * 20;
      gameState.score += attemptBonus;
      const hintBonus = (gameState.maxAttempts - gameState.hintsUsed) * 10;
      gameState.score += hintBonus;
      
      await this.endGame(gameState, true);
      
      return {
        correct: true,
        gameState,
        message: `Correct! It's ${gameState.currentPlayerName}! You scored ${gameState.score} points!`,
      };
    }
    
    gameState.attemptsLeft--;
    
    if (gameState.attemptsLeft <= 0) {
      gameState.isGameOver = true;
      gameState.isWinner = false;
      await this.endGame(gameState, false);
      
      return {
        correct: false,
        gameState,
        message: `Game over! The player was ${gameState.currentPlayerName}. Better luck next time!`,
      };
    }
    
    gameState.blurLevel = Math.max(2, gameState.blurLevel - 2);
    await cacheSet(`game:guess:${gameId}`, gameState, 3600);
    
    return {
      correct: false,
      gameState,
      message: `Wrong guess! ${gameState.attemptsLeft} attempts remaining.`,
    };
  }
  
  async revealHint(gameId: string): Promise<{
    hint: string;
    gameState: GuessPlayerGameState;
  }> {
    const gameState = await cacheGet(`game:guess:${gameId}`);
    if (!gameState) {
      throw new Error('Game not found');
    }
    
    if (gameState.isGameOver) {
      throw new Error('Game already over');
    }
    
    const clues = await this.getPlayerClues(gameState.currentPlayerId);
    const nextClueIndex = gameState.revealedClues.length;
    
    if (nextClueIndex >= clues.length) {
      return {
        hint: 'No more hints available!',
        gameState,
      };
    }
    
    const clue = clues[nextClueIndex];
    gameState.revealedClues.push(clue.text);
    gameState.hintsUsed++;
    gameState.score = Math.max(10, gameState.score - 15);
    
    await cacheSet(`game:guess:${gameId}`, gameState, 3600);
    
    return {
      hint: clue.text,
      gameState,
    };
  }
  
  async reduceBlur(gameId: string): Promise<{
    newBlurLevel: number;
    gameState: GuessPlayerGameState;
  }> {
    const gameState = await cacheGet(`game:guess:${gameId}`);
    if (!gameState) {
      throw new Error('Game not found');
    }
    
    if (gameState.isGameOver) {
      throw new Error('Game already over');
    }
    
    gameState.blurLevel = Math.max(0, gameState.blurLevel - 3);
    gameState.score = Math.max(10, gameState.score - 10);
    
    await cacheSet(`game:guess:${gameId}`, gameState, 3600);
    
    return {
      newBlurLevel: gameState.blurLevel,
      gameState,
    };
  }
  
  async getGameState(gameId: string): Promise<GuessPlayerGameState | null> {
    return cacheGet(`game:guess:${gameId}`);
  }
  
  private async getRandomPlayer(): Promise<any> {
    const result = await query(
      `SELECT id, full_name, country, image_url, role
       FROM players
       WHERE image_url IS NOT NULL AND is_active = true
       ORDER BY RANDOM()
       LIMIT 1`
    );
    
    if (result.rows.length === 0) {
      return {
        id: 'sachin-tendulkar',
        full_name: 'Sachin Tendulkar',
        country: 'India',
        image_url: '/assets/players/sachin.jpg',
        role: 'Batsman',
      };
    }
    
    return result.rows[0];
  }
  
  private async getPlayerClues(playerId: string): Promise<Clue[]> {
    const cached = await cacheGet(`player:clues:${playerId}`);
    if (cached) return cached as Clue[];
    
    const player = await query(
      `SELECT full_name, country, role, batting_style, bowling_style,
              (SELECT runs FROM player_stats WHERE player_id = players.id AND format = 'ODI' LIMIT 1) as odi_runs,
              (SELECT wickets FROM player_stats WHERE player_id = players.id AND format = 'ODI' LIMIT 1) as odi_wickets
       FROM players WHERE id = $1`,
      [playerId]
    );
    
    if (player.rows.length === 0) {
      return this.getDefaultClues();
    }
    
    const p = player.rows[0];
    const clues: Clue[] = [];
    
    clues.push({
      id: 'country',
      text: `Plays for ${p.country}`,
      difficulty: 'easy',
      revealOrder: 1,
    });
    
    clues.push({
      id: 'role',
      text: `${p.role} by trade`,
      difficulty: 'easy',
      revealOrder: 2,
    });
    
    if (p.batting_style) {
      clues.push({
        id: 'batting',
        text: `${p.batting_style} batsman`,
        difficulty: 'medium',
        revealOrder: 3,
      });
    }
    
    if (p.bowling_style) {
      clues.push({
        id: 'bowling',
        text: `${p.bowling_style} bowler`,
        difficulty: 'medium',
        revealOrder: 4,
      });
    }
    
    if (p.odi_runs && p.odi_runs > 5000) {
      clues.push({
        id: 'runs',
        text: `Has scored over ${Math.floor(p.odi_runs / 1000)}000+ ODI runs`,
        difficulty: 'hard',
        revealOrder: 5,
      });
    }
    
    if (p.odi_wickets && p.odi_wickets > 100) {
      clues.push({
        id: 'wickets',
        text: `Has taken ${p.odi_wickets}+ ODI wickets`,
        difficulty: 'hard',
        revealOrder: 6,
      });
    }
    
    await cacheSet(`player:clues:${playerId}`, clues, 86400);
    return clues;
  }
  
  private getDefaultClues(): Clue[] {
    return [
      { id: 'c1', text: 'Legendary cricketer', difficulty: 'easy', revealOrder: 1 },
      { id: 'c2', text: 'Multiple world records', difficulty: 'medium', revealOrder: 2 },
      { id: 'c3', text: 'Played for over 20 years', difficulty: 'hard', revealOrder: 3 },
    ];
  }
  
  private isMatch(guess: string, actual: string): boolean {
    const normalize = (s: string) => s.toLowerCase().trim().replace(/[^\w\s]/g, '');
    const guessNorm = normalize(guess);
    const actualNorm = normalize(actual);
    
    if (guessNorm === actualNorm) return true;
    
    const actualParts = actualNorm.split(' ');
    if (actualParts.length > 1 && guessNorm === actualParts[0]) return true;
    if (actualParts.length > 1 && guessNorm === actualParts[actualParts.length - 1]) return true;
    
    return false;
  }
  
  private async endGame(gameState: GuessPlayerGameState, isWinner: boolean): Promise<void> {
    const collection = getCollection('game_sessions');
    await collection.updateOne(
      { gameId: gameState.gameId },
      {
        $set: {
          status: 'completed',
          endTime: new Date(),
          isWinner,
          finalScore: gameState.score,
          attemptsUsed: gameState.maxAttempts - gameState.attemptsLeft,
          hintsUsed: gameState.hintsUsed,
        },
      }
    );
    
    if (isWinner) {
      await query(
        `UPDATE users SET total_quiz_points = total_quiz_points + $1 WHERE id = $2`,
        [gameState.score, gameState.userId]
      );
    }
  }
  
  private generateGameId(): string {
    return `guess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  }
}

export const guessPlayerService = new GuessPlayerService();