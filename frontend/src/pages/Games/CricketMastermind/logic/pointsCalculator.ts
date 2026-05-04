// frontend/src/pages/Games/CricketMastermind/logic/pointsCalculator.ts
import { Difficulty } from '../types/quiz.types';

const difficultyPoints: Record<Difficulty, number> = {
    easy: 10,
    medium: 20,
    hard: 50,
    random: 25,
    all: 30
};

export const calculatePoints = (
    difficulty: Difficulty,
    streak: number,
    timeRemaining: number,
    totalTime: number,
    isCorrect: boolean
): number => {
    if (!isCorrect) return 0;
    
    const basePoints = difficultyPoints[difficulty];
    const streakBonus = Math.min(streak, 5) * (basePoints * 0.2);
    const timeBonus = (timeRemaining / totalTime) * (basePoints * 0.5);
    
    return Math.floor(basePoints + streakBonus + timeBonus);
};

export const calculateStreak = (currentStreak: number, isCorrect: boolean): number => {
    if (isCorrect) {
        return currentStreak + 1;
    }
    return 0;
};

export const calculateRank = (score: number): { rank: string; color: string } => {
    if (score >= 1000) return { rank: 'Cricket Legend 🏆', color: 'text-yellow-600' };
    if (score >= 750) return { rank: 'Master Blaster ⭐', color: 'text-purple-600' };
    if (score >= 500) return { rank: 'Six Hitter 💥', color: 'text-blue-600' };
    if (score >= 250) return { rank: 'Centurion 🏏', color: 'text-green-600' };
    if (score >= 100) return { rank: 'Rising Star 🌟', color: 'text-orange-600' };
    return { rank: 'Rookie Player 🆕', color: 'text-gray-500' };
};

export const calculateAccuracy = (correct: number, total: number): number => {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
};

export const calculateTimeBonus = (timeRemaining: number, totalTime: number): number => {
    if (timeRemaining <= 0) return 0;
    return Math.floor((timeRemaining / totalTime) * 50);
};