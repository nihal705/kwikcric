import { randomInt, randomFloat } from '../../utils/helpers/mathHelpers';
import { cacheGet, cacheSet, cacheIncrement } from '../../config/database/redis';
import { getCollection } from '../../config/database/mongodb';
import { query } from '../../config/database/postgres';
import { logger } from '../../utils/logger';

export interface QuickCricketGameState {
  gameId: string;
  userId: string;
  runs: number;
  wickets: number;
  balls: number;
  maxBalls: number;
  target?: number;
  isBatting: boolean;
  isGameOver: boolean;
  currentBowler?: {
    name: string;
    type: 'fast' | 'spin' | 'medium';
    difficulty: number;
  };
  striker?: {
    name: string;
    runs: number;
    balls: number;
  };
  nonStriker?: {
    name: string;
    runs: number;
    balls: number;
  };
  shotHistory: Array<{
    ball: number;
    shotType: string;
    runs: number;
    outcome: string;
    isWicket: boolean;
  }>;
  startTime: Date;
  lastUpdate: Date;
}

export interface ShotOutcome {
  runs: number;
  isWicket: boolean;
  outcomeType: 'dot' | 'single' | 'double' | 'triple' | 'four' | 'six' | 'wicket';
  message: string;
  animation: string;
}

// Realistic cricket probabilities based on real match data
const SHOT_PROBABILITIES: Record<string, Record<string, number>> = {
  aggressive: {
    dot: 0.15,
    single: 0.20,
    double: 0.15,
    triple: 0.05,
    four: 0.25,
    six: 0.15,
    wicket: 0.05,
  },
  normal: {
    dot: 0.30,
    single: 0.35,
    double: 0.15,
    triple: 0.03,
    four: 0.12,
    six: 0.03,
    wicket: 0.02,
  },
  defensive: {
    dot: 0.60,
    single: 0.30,
    double: 0.08,
    triple: 0.01,
    four: 0.01,
    six: 0.00,
    wicket: 0.00,
  },
};

interface BowlerModifier {
  difficulty: number;
  wicketBonus: number;
  boundaryPenalty: number;
}

const BOWLER_TYPES: Record<string, BowlerModifier> = {
  fast: { difficulty: 1.2, wicketBonus: 1.1, boundaryPenalty: 0.9 },
  spin: { difficulty: 1.1, wicketBonus: 1.0, boundaryPenalty: 1.1 },
  medium: { difficulty: 1.0, wicketBonus: 0.9, boundaryPenalty: 1.0 },
};

export class QuickCricketService {
  
  async createGame(userId: string, mode: 'classic' | 'chase' | 'timed' = 'classic'): Promise<QuickCricketGameState> {
    const gameId = this.generateGameId();
    
    const gameState: QuickCricketGameState = {
      gameId,
      userId,
      runs: 0,
      wickets: 0,
      balls: 0,
      maxBalls: mode === 'timed' ? 12 : 6,
      isBatting: true,
      isGameOver: false,
      shotHistory: [],
      startTime: new Date(),
      lastUpdate: new Date(),
      currentBowler: this.getRandomBowler(),
      striker: {
        name: 'Your Batter',
        runs: 0,
        balls: 0,
      },
      nonStriker: {
        name: 'Partner',
        runs: 0,
        balls: 0,
      },
    };
    
    if (mode === 'chase') {
      gameState.target = randomInt(20, 50);
    }
    
    await cacheSet(`game:quick:${gameId}`, gameState, 3600);
    
    const collection = getCollection('game_sessions');
    await collection.insertOne({
      gameId,
      userId,
      gameType: 'quick_cricket',
      mode,
      startTime: gameState.startTime,
      status: 'active',
    });
    
    return gameState;
  }
  
  async playShot(gameId: string, shotType: 'aggressive' | 'normal' | 'defensive'): Promise<{
    outcome: ShotOutcome;
    gameState: QuickCricketGameState;
    gameOver: boolean;
  }> {
    const gameState = await cacheGet(`game:quick:${gameId}`);
    if (!gameState) {
      throw new Error('Game not found');
    }
    
    if (gameState.isGameOver) {
      throw new Error('Game already over');
    }
    
    const bowler = gameState.currentBowler!;
    const bowlerType = bowler.type as string;
    const bowlerMod = BOWLER_TYPES[bowlerType];
    
    let probs = { ...SHOT_PROBABILITIES[shotType] };
    
    if (bowlerMod) {
      probs.wicket *= bowlerMod.wicketBonus;
      probs.four *= bowlerMod.boundaryPenalty;
      probs.six *= bowlerMod.boundaryPenalty;
      
      const total = probs.dot + probs.single + probs.double + probs.triple + probs.four + probs.six + probs.wicket;
      probs.dot = probs.dot / total;
      probs.single = probs.single / total;
      probs.double = probs.double / total;
      probs.triple = probs.triple / total;
      probs.four = probs.four / total;
      probs.six = probs.six / total;
      probs.wicket = probs.wicket / total;
    }
    
    const outcome = this.determineOutcome(probs);
    
    if (outcome.isWicket) {
      gameState.wickets++;
      gameState.shotHistory.push({
        ball: gameState.balls + 1,
        shotType,
        runs: 0,
        outcome: outcome.outcomeType,
        isWicket: true,
      });
    } else {
      gameState.runs += outcome.runs;
      if (gameState.striker) {
        gameState.striker.runs += outcome.runs;
        gameState.striker.balls++;
      }
      
      gameState.shotHistory.push({
        ball: gameState.balls + 1,
        shotType,
        runs: outcome.runs,
        outcome: outcome.outcomeType,
        isWicket: false,
      });
      
      if (outcome.runs % 2 === 1) {
        this.rotateStrike(gameState);
      }
    }
    
    gameState.balls++;
    gameState.lastUpdate = new Date();
    
    let gameOver = false;
    let gameResult = '';
    
    if (gameState.wickets >= 3) {
      gameOver = true;
      gameResult = `All out for ${gameState.runs} runs!`;
    } else if (gameState.balls >= gameState.maxBalls) {
      gameOver = true;
      gameResult = `Innings ended: ${gameState.runs}/${gameState.wickets} in ${gameState.balls} balls`;
    }
    
    if (gameState.target && gameState.runs >= gameState.target) {
      gameOver = true;
      gameResult = `Victory! You chased ${gameState.target} runs in ${gameState.balls} balls!`;
    }
    
    if (gameOver) {
      gameState.isGameOver = true;
      await this.endGame(gameState, gameResult);
    }
    
    await cacheSet(`game:quick:${gameId}`, gameState, 3600);
    
    if (gameOver) {
      await this.updateLeaderboard(gameState.userId, gameState.runs, 'quick_cricket');
    }
    
    return {
      outcome: {
        runs: outcome.runs,
        isWicket: outcome.isWicket,
        outcomeType: outcome.outcomeType,
        message: outcome.message,
        animation: outcome.animation,
      },
      gameState,
      gameOver,
    };
  }
  
  private determineOutcome(probs: Record<string, number>): {
    runs: number;
    isWicket: boolean;
    outcomeType: ShotOutcome['outcomeType'];
    message: string;
    animation: string;
  } {
    const random = randomFloat(0, 1);
    let cumulative = 0;
    
    if (random < (cumulative += probs.wicket)) {
      return {
        runs: 0,
        isWicket: true,
        outcomeType: 'wicket',
        message: this.getWicketMessage(),
        animation: 'wicket',
      };
    }
    if (random < (cumulative += probs.six)) {
      return {
        runs: 6,
        isWicket: false,
        outcomeType: 'six',
        message: 'SIX! Maximum power!',
        animation: 'six',
      };
    }
    if (random < (cumulative += probs.four)) {
      return {
        runs: 4,
        isWicket: false,
        outcomeType: 'four',
        message: 'FOUR! Beautiful shot!',
        animation: 'boundary',
      };
    }
    if (random < (cumulative += probs.triple)) {
      return {
        runs: 3,
        isWicket: false,
        outcomeType: 'triple',
        message: 'Three runs! Good running!',
        animation: 'running',
      };
    }
    if (random < (cumulative += probs.double)) {
      return {
        runs: 2,
        isWicket: false,
        outcomeType: 'double',
        message: 'Two runs! Quick running!',
        animation: 'running',
      };
    }
    if (random < (cumulative += probs.single)) {
      return {
        runs: 1,
        isWicket: false,
        outcomeType: 'single',
        message: 'Single taken',
        animation: 'single',
      };
    }
    
    return {
      runs: 0,
      isWicket: false,
      outcomeType: 'dot',
      message: 'Dot ball! Good bowling!',
      animation: 'dot',
    };
  }
  
  private getWicketMessage(): string {
    const messages = [
      'OUT! Bowled! Timber!',
      'CAUGHT! Great catch in the deep!',
      'LBW! Plumb in front!',
      'RUN OUT! Direct hit!',
      'STUMPED! Keeper whips the bails off!',
    ];
    return messages[randomInt(0, messages.length - 1)];
  }
  
  private rotateStrike(gameState: QuickCricketGameState): void {
    const temp = gameState.striker;
    gameState.striker = gameState.nonStriker;
    gameState.nonStriker = temp;
  }
  
  private getRandomBowler(): { name: string; type: 'fast' | 'spin' | 'medium'; difficulty: number } {
    const bowlers = [
      { name: 'Mitchell Starc', type: 'fast' as const, difficulty: 1.3 },
      { name: 'Rashid Khan', type: 'spin' as const, difficulty: 1.2 },
      { name: 'Jasprit Bumrah', type: 'fast' as const, difficulty: 1.25 },
      { name: 'Pat Cummins', type: 'fast' as const, difficulty: 1.15 },
      { name: 'Ravindra Jadeja', type: 'spin' as const, difficulty: 1.1 },
      { name: 'Shaheen Afridi', type: 'fast' as const, difficulty: 1.2 },
      { name: 'Trent Boult', type: 'fast' as const, difficulty: 1.15 },
      { name: 'Adam Zampa', type: 'spin' as const, difficulty: 1.05 },
      { name: 'Kagiso Rabada', type: 'fast' as const, difficulty: 1.2 },
      { name: 'Ben Stokes', type: 'medium' as const, difficulty: 1.0 },
    ];
    return bowlers[randomInt(0, bowlers.length - 1)];
  }
  
  async getGameState(gameId: string): Promise<QuickCricketGameState | null> {
    return cacheGet(`game:quick:${gameId}`);
  }
  
  private async endGame(gameState: QuickCricketGameState, result: string): Promise<void> {
    const collection = getCollection('game_sessions');
    await collection.updateOne(
      { gameId: gameState.gameId },
      {
        $set: {
          status: 'completed',
          endTime: new Date(),
          finalScore: gameState.runs,
          finalWickets: gameState.wickets,
          ballsPlayed: gameState.balls,
          result,
        },
      }
    );
    
    logger.info(`Game ended: ${gameState.gameId} - Score: ${gameState.runs}/${gameState.wickets} - ${result}`);
  }
  
  private async updateLeaderboard(userId: string, score: number, gameType: string): Promise<void> {
    await query(
      `UPDATE users SET highest_game_score = GREATEST(highest_game_score, $1) WHERE id = $2`,
      [score, userId]
    );
    
    const today = new Date().toISOString().split('T')[0];
    await cacheIncrement(`leaderboard:daily:${gameType}:${today}:${userId}`, score);
  }
  
  private generateGameId(): string {
    return `game_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  }
  
  async getLeaderboard(gameType: string, period: 'daily' | 'weekly' | 'all_time' = 'daily', limit: number = 10): Promise<any[]> {
    if (period === 'all_time') {
      const result = await query(
        `SELECT id, username, avatar_url, highest_game_score
         FROM users
         WHERE highest_game_score > 0
         ORDER BY highest_game_score DESC
         LIMIT $1`,
        [limit]
      );
      return result.rows;
    }
    
    return [];
  }
}

export const quickCricketService = new QuickCricketService();