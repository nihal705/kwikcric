import { randomInt, shuffleArray } from '../../utils/helpers/mathHelpers';
import { cacheGet, cacheSet } from '../../config/database/redis';
import { getCollection } from '../../config/database/mongodb';
import { query } from '../../config/database/postgres';

export interface QuizQuestion {
  id: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
  timeLimit: number;
  imageUrl?: string;
}

export interface QuizSession {
  sessionId: string;
  userId: string;
  questions: QuizQuestion[];
  currentIndex: number;
  score: number;
  answers: Array<{
    questionId: string;
    isCorrect: boolean;
    selectedAnswer: string;
    timeTaken: number;
    pointsEarned: number;
  }>;
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'completed' | 'abandoned';
  lifelinesUsed: {
    fiftyFifty: boolean;
    audiencePoll: boolean;
    skipQuestion: boolean;
  };
}

export class QuizService {
  
  async createQuiz(userId: string, category?: string, difficulty?: string, questionCount: number = 10): Promise<QuizSession> {
    const questions = await this.getQuestions(category, difficulty, questionCount);
    
    const session: QuizSession = {
      sessionId: this.generateSessionId(),
      userId,
      questions,
      currentIndex: 0,
      score: 0,
      answers: [],
      startTime: new Date(),
      status: 'active',
      lifelinesUsed: {
        fiftyFifty: false,
        audiencePoll: false,
        skipQuestion: false,
      },
    };
    
    await cacheSet(`quiz:session:${session.sessionId}`, session, 7200);
    
    const collection = getCollection('quiz_sessions');
    await collection.insertOne({
      sessionId: session.sessionId,
      userId,
      category,
      difficulty,
      questionCount,
      startTime: session.startTime,
      status: 'active',
    });
    
    return session;
  }
  
  async submitAnswer(sessionId: string, answer: string, timeTaken: number): Promise<{
    isCorrect: boolean;
    correctAnswer: string;
    explanation: string;
    pointsEarned: number;
    newScore: number;
    isLastQuestion: boolean;
    nextQuestion?: QuizQuestion;
  }> {
    const session = await cacheGet(`quiz:session:${sessionId}`);
    if (!session || session.status !== 'active') {
      throw new Error('Quiz session not found or already completed');
    }
    
    const currentQuestion = session.questions[session.currentIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;
    
    let pointsEarned = 0;
    if (isCorrect) {
      pointsEarned = currentQuestion.points;
      if (currentQuestion.timeLimit > 0) {
        const timeBonus = Math.max(0, Math.min(currentQuestion.points * 0.5, 
          (currentQuestion.timeLimit - timeTaken) / currentQuestion.timeLimit * currentQuestion.points * 0.5));
        pointsEarned += Math.floor(timeBonus);
      }
    }
    
    session.score += pointsEarned;
    session.answers.push({
      questionId: currentQuestion.id,
      isCorrect,
      selectedAnswer: answer,
      timeTaken,
      pointsEarned,
    });
    
    const isLastQuestion = session.currentIndex + 1 >= session.questions.length;
    
    if (isLastQuestion) {
      session.status = 'completed';
      session.endTime = new Date();
      await this.endQuiz(session);
    } else {
      session.currentIndex++;
    }
    
    await cacheSet(`quiz:session:${sessionId}`, session, 7200);
    
    return {
      isCorrect,
      correctAnswer: currentQuestion.correctAnswer,
      explanation: currentQuestion.explanation,
      pointsEarned,
      newScore: session.score,
      isLastQuestion,
      nextQuestion: isLastQuestion ? undefined : session.questions[session.currentIndex],
    };
  }
  
  async useLifeline(sessionId: string, lifeline: 'fiftyFifty' | 'audiencePoll' | 'skipQuestion'): Promise<any> {
    const session = await cacheGet(`quiz:session:${sessionId}`);
    if (!session || session.status !== 'active') {
      throw new Error('Quiz session not found');
    }
    
    if (session.lifelinesUsed[lifeline]) {
      throw new Error('Lifeline already used');
    }
    
    session.lifelinesUsed[lifeline] = true;
    
    const currentQuestion = session.questions[session.currentIndex];
    let result: any = { lifeline };
    
    switch (lifeline) {
      case 'fiftyFifty':
        const incorrectOptions = currentQuestion.options.filter((opt: string) => opt !== currentQuestion.correctAnswer);
        const toRemove = shuffleArray([...incorrectOptions]).slice(0, 2);
        result.remainingOptions = currentQuestion.options.filter((opt: string) => !toRemove.includes(opt));
        break;
        
      case 'audiencePoll':
        const correctPercentage = randomInt(60, 95);
        const remainingPercentage = 100 - correctPercentage;
        const otherOptionsCount = currentQuestion.options.length - 1;
        const otherPercentage = Math.floor(remainingPercentage / otherOptionsCount);
        
        result.poll = currentQuestion.options.map((opt: string) => ({
          option: opt,
          percentage: opt === currentQuestion.correctAnswer ? correctPercentage : otherPercentage,
        }));
        break;
        
      case 'skipQuestion':
        session.currentIndex++;
        result.newQuestion = session.questions[session.currentIndex];
        break;
    }
    
    await cacheSet(`quiz:session:${sessionId}`, session, 7200);
    
    return result;
  }
  
  private async getQuestions(category?: string, difficulty?: string, count: number = 10): Promise<QuizQuestion[]> {
    const cacheKey = `quiz:questions:${category || 'all'}:${difficulty || 'all'}`;
    const cached = await cacheGet(cacheKey);
    
    let questions: QuizQuestion[] = [];
    
    if (cached && Array.isArray(cached)) {
      questions = cached as QuizQuestion[];
    } else {
      let queryText = `SELECT * FROM quiz_questions WHERE 1=1`;
      const params: any[] = [];
      let paramIndex = 1;
      
      if (category) {
        queryText += ` AND category = $${paramIndex++}`;
        params.push(category);
      }
      
      if (difficulty) {
        queryText += ` AND difficulty = $${paramIndex++}`;
        params.push(difficulty);
      }
      
      const result = await query(queryText, params);
      
      questions = result.rows.map((row: any) => ({
        id: row.id,
        category: row.category,
        difficulty: row.difficulty,
        questionText: row.question_text,
        options: row.options,
        correctAnswer: row.correct_answer,
        explanation: row.explanation,
        points: row.points,
        timeLimit: row.time_limit_seconds,
        imageUrl: row.image_url,
      }));
      
      await cacheSet(cacheKey, questions, 86400);
    }
    
    const shuffled = shuffleArray([...questions]);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }
  
  private async endQuiz(session: QuizSession): Promise<void> {
    const collection = getCollection('quiz_sessions');
    await collection.updateOne(
      { sessionId: session.sessionId },
      {
        $set: {
          status: 'completed',
          endTime: session.endTime,
          finalScore: session.score,
          totalQuestions: session.questions.length,
          correctAnswers: session.answers.filter((a: any) => a.isCorrect).length,
          answers: session.answers,
        },
      }
    );
    
    await query(
      `UPDATE users SET total_quiz_points = total_quiz_points + $1 WHERE id = $2`,
      [session.score, session.userId]
    );
    
    await query(
      `INSERT INTO quiz_attempts (user_id, score, total_questions, correct_answers, time_taken_seconds, category)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        session.userId,
        session.score,
        session.questions.length,
        session.answers.filter((a: any) => a.isCorrect).length,
        (session.endTime!.getTime() - session.startTime.getTime()) / 1000,
        session.questions[0]?.category || null,
      ]
    );
  }
  
  async getQuizSession(sessionId: string): Promise<QuizSession | null> {
    return cacheGet(`quiz:session:${sessionId}`);
  }
  
  async getQuizStats(userId: string): Promise<any> {
    const result = await query(
      `SELECT 
         COUNT(*) as total_quizzes,
         SUM(score) as total_score,
         AVG(score) as avg_score,
         MAX(score) as highest_score,
         COUNT(CASE WHEN score >= 80 THEN 1 END) as perfect_scores
       FROM quiz_attempts
       WHERE user_id = $1`,
      [userId]
    );
    
    return result.rows[0];
  }
  
  private generateSessionId(): string {
    return `quiz_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
  }
}

export const quizService = new QuizService();