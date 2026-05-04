// frontend/src/pages/Games/CricketMastermind/components/ResultScreen.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface ResultScreenProps {
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    accuracy: number;
    maxStreak: number;
    rank: string;
    rankColor: string;
    onPlayAgain: () => void;
    onExit: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
    score,
    totalQuestions,
    correctAnswers,
    accuracy,
    maxStreak,
    rank,
    rankColor,
    onPlayAgain,
    onExit
}) => {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center py-6">
            <div className="max-w-md w-full mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 text-center">
                        <div className="text-4xl mb-2">🏆</div>
                        <h2 className="text-xl font-bold text-white">Quiz Complete!</h2>
                    </div>
                    
                    <div className="p-6">
                        {/* Score */}
                        <div className="text-center mb-6">
                            <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                                {score}
                            </div>
                            <div className="text-xs text-gray-500">Total Score</div>
                        </div>
                        
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                                <div className="text-sm text-gray-500">Questions</div>
                                <div className="text-lg font-bold text-gray-900 dark:text-white">
                                    {totalQuestions}
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                                <div className="text-sm text-gray-500">Correct</div>
                                <div className="text-lg font-bold text-green-600">
                                    {correctAnswers}
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                                <div className="text-sm text-gray-500">Accuracy</div>
                                <div className="text-lg font-bold text-blue-600">
                                    {accuracy}%
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                                <div className="text-sm text-gray-500">Best Streak</div>
                                <div className="text-lg font-bold text-orange-600">
                                    🔥 {maxStreak}
                                </div>
                            </div>
                        </div>
                        
                        {/* Rank */}
                        <div className={`text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 mb-6`}>
                            <div className="text-xs text-gray-500">Your Rank</div>
                            <div className={`text-lg font-bold ${rankColor}`}>{rank}</div>
                        </div>
                        
                        {/* Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={onPlayAgain}
                                className="flex-1 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-500 transition"
                            >
                                Play Again
                            </button>
                            <button
                                onClick={onExit}
                                className="flex-1 py-2 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-400 transition"
                            >
                                Main Menu
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};