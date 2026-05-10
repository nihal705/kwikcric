// frontend/src/pages/Games/CricketMastermind/types/quiz.types.ts
export type Difficulty = 'easy' | 'medium' | 'hard' | 'random' | 'all';
export type GameMode = 'quick' | 'challenge' | 'filltable';
export type FillTableType = 'complete' | 'guess';
export type QuestionType = 'mcq' | 'truefalse' | 'fillblank';

export interface Question {
    id: number;
    category: string;
    subCategory: string;
    difficulty: Difficulty;
    type: QuestionType;
    text: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    points: number;
    hint?: string;
    audioUrl?: string;
    imageUrl?: string;
}

export interface FillTableChallenge {
    id: number;
    title: string;
    category: string;
    type: FillTableType;
    columns: string[];
    rows: FillTableRow[];
    timeLimit: number;
    hints: string[];
}

export interface FillTableRow {
    rank?: number;
    playerName?: string;
    runs?: number | string;
    country?: string;
    team?: string;
    score?: string;
    against?: string;
    year?: number;
    [key: string]: any;
}

export interface QuizState {
    mode: GameMode;
    category: string;
    difficulty: Difficulty;
    score: number;
    streak: number;
    lives: number;
    currentQuestionIndex: number;
    questionsAnswered: number;
    correctAnswers: number;
    maxStreak: number;
    timeRemaining: number;
    isGameOver: boolean;
    isPaused: boolean;
    lifelines: {
        fiftyFifty: boolean;
        skip: boolean;
        hint: boolean;
        audio: boolean;
    };
}

export interface QuizStats {
    totalQuestions: number;
    correctAnswers: number;
    totalScore: number;
    bestStreak: number;
    gamesPlayed: number;
    categoryStats: Record<string, { played: number; correct: number }>;
}