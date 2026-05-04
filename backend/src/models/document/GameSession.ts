import { Schema, model, Document } from 'mongoose';

export interface IGameSession extends Document {
  gameId: string;
  userId: string;
  gameType: 'quick_cricket' | 'guess_player' | 'quiz';
  mode?: string;
  difficulty?: string;
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'completed' | 'abandoned';
  finalScore?: number;
  finalWickets?: number;
  ballsPlayed?: number;
  isWinner?: boolean;
  attemptsUsed?: number;
  hintsUsed?: number;
  result?: string;
  metadata?: Record<string, any>;
}

const GameSessionSchema = new Schema<IGameSession>(
  {
    gameId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    gameType: { 
      type: String, 
      required: true, 
      enum: ['quick_cricket', 'guess_player', 'quiz'],
      index: true 
    },
    mode: { type: String },
    difficulty: { type: String },
    startTime: { type: Date, required: true, default: Date.now },
    endTime: { type: Date },
    status: { 
      type: String, 
      required: true, 
      enum: ['active', 'completed', 'abandoned'],
      default: 'active' 
    },
    finalScore: { type: Number },
    finalWickets: { type: Number },
    ballsPlayed: { type: Number },
    isWinner: { type: Boolean },
    attemptsUsed: { type: Number },
    hintsUsed: { type: Number },
    result: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

// Compound indexes for efficient queries
GameSessionSchema.index({ userId: 1, createdAt: -1 });
GameSessionSchema.index({ gameType: 1, createdAt: -1 });
GameSessionSchema.index({ status: 1, startTime: 1 });

export const GameSession = model<IGameSession>('GameSession', GameSessionSchema);