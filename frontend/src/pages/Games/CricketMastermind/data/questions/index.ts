// frontend/src/pages/Games/CricketMastermind/data/questions/index.ts
import { Question } from '../../types/quiz.types';

// ODI World Cup Questions (500+)
import { odiWorldCupQuestions } from './odiWorldCup';
// T20 World Cup Questions (400+)
import { t20WorldCupQuestions } from './t20WorldCup';
// Test Cricket Questions (400+)
import { testCricketQuestions } from './testCricket';
// IPL Questions (600+)
import { iplQuestions } from './ipl';
// Women's Cricket Questions (300+)
import { womensCricketQuestions } from './womensCricket';
// Champions Trophy Questions (200+)
import { championsTrophyQuestions } from './championsTrophy';
// Asia Cup Questions (150+)
import { asiaCupQuestions } from './asiaCup';
// Records Questions (200+)
import { recordsQuestions } from './records';
// Players Questions (300+)
import { playersQuestions } from './players';

// Combine all questions
export const allQuestions: Question[] = [
    ...odiWorldCupQuestions,
    ...t20WorldCupQuestions,
    ...testCricketQuestions,
    ...iplQuestions,
    ...womensCricketQuestions,
    ...championsTrophyQuestions,
    ...asiaCupQuestions,
    ...recordsQuestions,
    ...playersQuestions
];

// Get questions by category
export const getQuestionsByCategory = (category: string): Question[] => {
    if (category === 'All-Mode') return allQuestions;
    return allQuestions.filter(q => q.category === category);
};

// Get questions by difficulty
export const getQuestionsByDifficulty = (difficulty: string): Question[] => {
    if (difficulty === 'all') return allQuestions;
    return allQuestions.filter(q => q.difficulty === difficulty);
};

// Get random questions
export const getRandomQuestions = (count: number, category?: string): Question[] => {
    let pool = category && category !== 'All-Mode' 
        ? getQuestionsByCategory(category) 
        : allQuestions;
    
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
};

// Get random question
export const getRandomQuestion = (category?: string, difficulty?: string): Question | null => {
    let pool = allQuestions;
    if (category && category !== 'All-Mode') {
        pool = pool.filter(q => q.category === category);
    }
    if (difficulty && difficulty !== 'all') {
        pool = pool.filter(q => q.difficulty === difficulty);
    }
    if (pool.length === 0) return null;
    return pool[Math.floor(Math.random() * pool.length)];
};

// Get categories list
export const getCategories = (): string[] => {
    const categories = new Set(allQuestions.map(q => q.category));
    return ['All-Mode', ...Array.from(categories)];
};

// Get difficulty levels with counts
export const getDifficultyStats = (): Record<string, number> => {
    return {
        easy: allQuestions.filter(q => q.difficulty === 'easy').length,
        medium: allQuestions.filter(q => q.difficulty === 'medium').length,
        hard: allQuestions.filter(q => q.difficulty === 'hard').length
    };
};

// Export individual question sets
export {
    odiWorldCupQuestions,
    t20WorldCupQuestions,
    testCricketQuestions,
    iplQuestions,
    womensCricketQuestions,
    championsTrophyQuestions,
    asiaCupQuestions,
    recordsQuestions,
    playersQuestions
};