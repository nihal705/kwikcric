import { Schema, model, Document } from 'mongoose';

export interface IQuizAnswer {
  questionId: string;
  isCorrect: boolean;
  selectedAnswer: string;
  timeTaken: number;
  pointsEarned: number;
}

export interface IQuizAttempt extends Document {
  sessionId: string;
  userId: string;
  category?: string;
  difficulty?: string;
  startTime: Date;
  endTime: Date;
  finalScore: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeTakenSeconds: number;
  answers: IQuizAnswer[];
  lifelinesUsed: {
    fiftyFifty: boolean;
    audiencePoll: boolean;
    skipQuestion: boolean;
  };
}

const QuizAnswerSchema = new Schema<IQuizAnswer>({
  questionId: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
  selectedAnswer: { type: String, required: true },
  timeTaken: { type: Number, required: true },
  pointsEarned: { type: Number, required: true },
});

const QuizAttemptSchema = new Schema<IQuizAttempt>(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    category: { type: String, index: true },
    difficulty: { type: String },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    finalScore: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    correctAnswers: { type: Number, required: true },
    wrongAnswers: { type: Number, required: true },
    timeTakenSeconds: { type: Number, required: true },
    answers: [QuizAnswerSchema],
    lifelinesUsed: {
      fiftyFifty: { type: Boolean, default: false },
      audiencePoll: { type: Boolean, default: false },
      skipQuestion: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

// Indexes for leaderboard queries
QuizAttemptSchema.index({ userId: 1, finalScore: -1 });
QuizAttemptSchema.index({ category: 1, finalScore: -1 });
QuizAttemptSchema.index({ createdAt: -1 });

export const QuizAttempt = model<IQuizAttempt>('QuizAttempt', QuizAttemptSchema);