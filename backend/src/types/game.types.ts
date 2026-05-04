export type GameType = 'quick_cricket' | 'guess_player' | 'quiz' | 'predictor' | 'fantasy';

export type GameDifficulty = 'easy' | 'medium' | 'hard';

export type ShotType = 'aggressive' | 'normal' | 'defensive';

export type ShotOutcomeType = 'dot' | 'single' | 'double' | 'triple' | 'four' | 'six' | 'wicket';

export interface QuickCricketConfig {
  maxBalls: number;
  maxWickets: number;
  powerUps: boolean;
  difficulty: GameDifficulty;
}

export interface GuessPlayerConfig {
  maxAttempts: number;
  initialBlur: number;
  hintPenalty: number;
  blurReduction: number;
}

export interface QuizConfig {
  totalQuestions: number;
  timePerQuestion: number;
  lifelines: ('fiftyFifty' | 'audiencePoll' | 'skipQuestion')[];
  pointsPerQuestion: number;
  negativePoints: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatarUrl: string | null;
  score: number;
  country?: string;
  timestamp?: Date;
}

export interface GameStatistics {
  totalGamesPlayed: number;
  totalWins: number;
  winRate: number;
  highestScore: number;
  averageScore: number;
  totalPoints: number;
  gamesByType: Record<GameType, number>;
  recentGames: Array<{
    gameType: GameType;
    score: number;
    isWin: boolean;
    playedAt: Date;
  }>;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  requirement: {
    type: 'score' | 'wins' | 'streak' | 'perfect';
    value: number;
    gameType?: GameType;
  };
  reward: {
    points: number;
    badge: string;
    title?: string;
  };
  isAchieved: boolean;
  achievedAt?: Date;
  progress: number;
}

export const GameConstants = {
  QUICK_CRICKET: {
    DEFAULT_BALLS: 6,
    DEFAULT_WICKETS: 3,
    BOUNDARY_BOUNS: 10,
    SIX_BONUS: 15,
    WICKET_PENALTY: -20,
  },
  GUESS_PLAYER: {
    BASE_SCORE: 100,
    HINT_PENALTY: 15,
    WRONG_GUESS_PENALTY: 10,
    BLUR_REDUCTION: 3,
  },
  QUIZ: {
    BASE_POINTS: 10,
    TIME_BONUS_MAX: 5,
    STREAK_BONUS: 2,
  },
  LEADERBOARD: {
    DAILY_RESET_HOUR: 0,
    WEEKLY_RESET_DAY: 1, // Monday
    MONTHLY_RESET_DAY: 1,
  },
} as const;