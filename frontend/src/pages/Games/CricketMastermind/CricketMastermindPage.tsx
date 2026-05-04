// frontend/src/pages/Games/CricketMastermind/CricketMastermindPage.tsx
import React, { useState, useEffect } from 'react';
import { ModeSelector } from './components/ModeSelector';
import { CategorySelector } from './components/CategorySelector';
import { DifficultySelector } from './components/DifficultySelector';
import { QuickQuizMode } from './components/QuickQuizMode';
import { ChallengeMode } from './components/ChallengeMode';
import { FillTheTableMode } from './components/FillTheTableMode';
import { GameMode, Difficulty } from './types/quiz.types';
import { useAuth } from '../../../contexts/AuthContext';
import { motion } from 'framer-motion';

const CricketMastermindPage: React.FC = () => {
    const [gameMode, setGameMode] = useState<GameMode | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('All-Mode');
    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');
    const { user } = useAuth();

    // Load user's quiz stats
    useEffect(() => {
        // Load stats from localStorage or API
        const savedStats = localStorage.getItem('quiz_stats');
        if (savedStats) {
            // Set stats
        }
    }, []);

    const handleModeSelect = (mode: GameMode) => {
        setGameMode(mode);
    };

    const handleBack = () => {
        setGameMode(null);
    };

    if (gameMode === 'quick') {
        return (
            <QuickQuizMode
                category={selectedCategory}
                difficulty={selectedDifficulty}
                onExit={handleBack}
            />
        );
    }

    if (gameMode === 'challenge') {
        return (
            <ChallengeMode
                category={selectedCategory}
                difficulty={selectedDifficulty}
                onExit={handleBack}
            />
        );
    }

    if (gameMode === 'filltable') {
        return (
            <FillTheTableMode
                onExit={handleBack}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-6"
                >
                    <div className="text-5xl mb-2">🧠</div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Cricket Mastermind
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Test your cricket knowledge with 1000+ questions!
                    </p>
                    {user?.isGuest && (
                        <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                            Guest Mode • Stats saved locally
                        </p>
                    )}
                </motion.div>

                {/* Stats Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-4 gap-3 mb-6"
                >
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="text-lg mb-1">📊</div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">0</div>
                        <div className="text-[10px] text-gray-500">Questions</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="text-lg mb-1">✅</div>
                        <div className="text-lg font-bold text-green-600">0</div>
                        <div className="text-[10px] text-gray-500">Correct</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="text-lg mb-1">🔥</div>
                        <div className="text-lg font-bold text-orange-600">0</div>
                        <div className="text-[10px] text-gray-500">Best Streak</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="text-lg mb-1">🏆</div>
                        <div className="text-lg font-bold text-purple-600">0</div>
                        <div className="text-[10px] text-gray-500">High Score</div>
                    </div>
                </motion.div>

                {/* Mode Selector */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="mb-6"
                >
                    <ModeSelector onSelect={handleModeSelect} />
                </motion.div>

                {/* Category Selector */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6"
                >
                    <CategorySelector
                        selectedCategory={selectedCategory}
                        onSelectCategory={setSelectedCategory}
                    />
                </motion.div>

                {/* Difficulty Selector */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                >
                    <DifficultySelector
                        selectedDifficulty={selectedDifficulty}
                        onSelectDifficulty={setSelectedDifficulty}
                    />
                </motion.div>

                {/* Info Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                >
                    <div className="text-xs text-blue-700 dark:text-blue-300">
                        <span className="font-semibold">💡 Did you know?</span> The first Cricket World Cup was held in 1975 in England. West Indies won the final against Australia by 17 runs at Lord's Cricket Ground.
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CricketMastermindPage;