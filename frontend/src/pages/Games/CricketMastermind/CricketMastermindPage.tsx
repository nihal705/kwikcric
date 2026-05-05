// frontend/src/pages/Games/CricketMastermind/CricketMastermindPage.tsx
import React, { useState, useEffect } from 'react';
import { ModeSelector } from './components/ModeSelector';
import { CategorySelector } from './components/CategorySelector';
import { DifficultySelector } from './components/DifficultySelector';
import { QuickQuizMode } from './components/QuickQuizMode';
import { ChallengeMode } from './components/ChallengeMode';
import { FillTheTableMode } from './components/FillTheTableMode';
import { KnowledgeHub } from './components/KnowledgeHub';
import { GameMode, Difficulty } from './types/quiz.types';
import { useAuth } from '../../../contexts/AuthContext';
import { motion } from 'framer-motion';

// Storage keys
const STATS_KEY = 'quiz_mastermind_stats';

interface QuizStats {
    totalScore: number;
    totalQuestions: number;
    totalCorrect: number;
    bestStreak: number;
    gamesPlayed: number;
}

const CricketMastermindPage: React.FC = () => {
    const [gameMode, setGameMode] = useState<GameMode | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('All-Mode');
    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');
    const [stats, setStats] = useState<QuizStats>({
        totalScore: 0,
        totalQuestions: 0,
        totalCorrect: 0,
        bestStreak: 0,
        gamesPlayed: 0
    });
    const { user } = useAuth();

    // Load stats on mount
    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = () => {
        const saved = localStorage.getItem(STATS_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setStats({
                    totalScore: parsed.totalScore || 0,
                    totalQuestions: parsed.totalQuestions || 0,
                    totalCorrect: parsed.totalCorrect || 0,
                    bestStreak: parsed.bestStreak || 0,
                    gamesPlayed: parsed.gamesPlayed || 0
                });
            } catch (e) {
                console.error('Failed to load stats:', e);
            }
        }
    };

    const saveStats = (newStats: QuizStats) => {
        localStorage.setItem(STATS_KEY, JSON.stringify(newStats));
        setStats(newStats);
    };

    const updateStats = (correct: number, total: number, streak: number, score: number) => {
        const newStats = {
            totalScore: stats.totalScore + score,
            totalQuestions: stats.totalQuestions + total,
            totalCorrect: stats.totalCorrect + correct,
            bestStreak: Math.max(stats.bestStreak, streak),
            gamesPlayed: stats.gamesPlayed + 1
        };
        saveStats(newStats);
    };

    const handleModeSelect = (mode: GameMode) => {
        setGameMode(mode);
    };

    const handleBack = () => {
        setGameMode(null);
        loadStats(); // Refresh stats when returning
    };

    if (gameMode === 'quick') {
        return (
            <QuickQuizMode
                category={selectedCategory}
                difficulty={selectedDifficulty}
                onExit={handleBack}
                onUpdateStats={updateStats}
            />
        );
    }

    if (gameMode === 'challenge') {
        return (
            <ChallengeMode
                category={selectedCategory}
                difficulty={selectedDifficulty}
                onExit={handleBack}
                onUpdateStats={updateStats}
            />
        );
    }

    if (gameMode === 'filltable') {
        return (
            <FillTheTableMode
                onExit={handleBack}
                onUpdateStats={updateStats}
            />
        );
    }

    // Calculate accuracy
    const accuracy = stats.totalQuestions > 0 
        ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100) 
        : 0;

    return (
        <div className="min-h bg-gray-100 dark:bg-gray-900 ">
            <div className="max-w-6xl mx-auto px-3">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-4"
                >
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                        Cricket Mastermind
                    </h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Test your cricket knowledge with 1000+ questions!
                    </p>
                    {user?.isGuest && (
                        <p className="text-[10px] text-yellow-600 dark:text-yellow-400 mt-1">
                            Guest Mode • Stats saved locally
                        </p>
                    )}
                </motion.div>

                {/* Stats Summary - Corrected display */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-5 gap-2 mb-4"
                >
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-2 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="text-sm font-bold text-gray-900 dark:text-white">{stats.totalScore}</div>
                        <div className="text-[8px] text-gray-500">Total Score</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-2 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="text-sm font-bold text-gray-900 dark:text-white">{stats.totalQuestions}</div>
                        <div className="text-[8px] text-gray-500">Questions</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-2 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="text-sm font-bold text-green-600">{stats.totalCorrect}</div>
                        <div className="text-[8px] text-gray-500">Correct</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-2 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="text-sm font-bold text-orange-600">{stats.bestStreak}</div>
                        <div className="text-[8px] text-gray-500">Best Streak</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-2 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="text-sm font-bold text-purple-600">{accuracy}%</div>
                        <div className="text-[8px] text-gray-500">Accuracy</div>
                    </div>
                </motion.div>

                {/* Mode Selector */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="mb-4"
                >
                    <ModeSelector onSelect={handleModeSelect} />
                </motion.div>

                {/* Category Selector - Compact */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-3"
                >
                    <CategorySelector
                        selectedCategory={selectedCategory}
                        onSelectCategory={setSelectedCategory}
                    />
                </motion.div>

                {/* Difficulty Selector - Compact */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="mb-4"
                >
                    <DifficultySelector
                        selectedDifficulty={selectedDifficulty}
                        onSelectDifficulty={setSelectedDifficulty}
                    />
                </motion.div>

                {/* Knowledge Hub */}
                <KnowledgeHub />
            </div>
        </div>
    );
};

export default CricketMastermindPage;