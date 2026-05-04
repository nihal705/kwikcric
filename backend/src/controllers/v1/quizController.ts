import { Request, Response } from 'express';
import { AuthRequest } from '../../middleware/auth/jwtAuth';

const quizSessions: Map<string, any> = new Map();

export const quizController = {
  startQuiz: async (req: AuthRequest, res: Response) => {
    const sessionId = `quiz_${Date.now()}`;
    const session = {
      sessionId,
      currentQuestion: { id: '1', questionText: 'Who holds the record for most ODI runs?', options: ['Sachin', 'Virat', 'Ponting'], correctAnswer: 'Sachin', timeLimit: 30 },
      totalQuestions: 10,
      score: 0,
      progress: { current: 1, total: 10, percentage: 10 },
    };
    quizSessions.set(sessionId, session);
    res.json({ success: true, data: session });
  },

  submitAnswer: async (req: AuthRequest, res: Response) => {
    const { sessionId, answer, timeTaken } = req.body;
    const isCorrect = answer === 'Sachin';
    res.json({
      success: true,
      data: { isCorrect, correctAnswer: 'Sachin', explanation: 'Sachin has 18,426 runs', pointsEarned: isCorrect ? 10 : 0, newScore: isCorrect ? 10 : 0, isLastQuestion: false }
    });
  },

  useLifeline: async (req: AuthRequest, res: Response) => {
    const { sessionId, lifeline } = req.body;
    res.json({ success: true, data: { lifeline, remainingOptions: ['Option A', 'Option B'] } });
  },

  getQuizSession: async (req: AuthRequest, res: Response) => {
    const session = quizSessions.get(req.params.sessionId);
    res.json({ success: true, data: session });
  },

  getQuizStats: async (req: AuthRequest, res: Response) => {
    res.json({ success: true, data: { totalQuizzes: 5, totalScore: 450, highestScore: 100, averageScore: 90 } });
  },
};