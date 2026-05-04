// frontend/src/pages/Games/CricketMastermind/components/ScoreBoard.tsx
import React from 'react';

interface ScoreBoardProps {
    score: number;
    streak: number;
    lives: number;
    questionsAnswered: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, streak, lives, questionsAnswered }) => {
    return (
        <div className="grid grid-cols-4 gap-3 mb-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500">Score</div>
                <div className="text-xl font-bold text-green-600">{score}</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500">Streak</div>
                <div className="text-xl font-bold text-orange-600">
                    {streak > 0 ? `🔥 ${streak}` : streak}
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500">Lives</div>
                <div className="text-xl font-bold">
                    {Array(lives).fill(0).map((_, i) => (
                        <span key={i} className="text-red-500">❤️</span>
                    ))}
                    {Array(3 - lives).fill(0).map((_, i) => (
                        <span key={i} className="text-gray-300">🖤</span>
                    ))}
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500">Questions</div>
                <div className="text-xl font-bold text-blue-600">{questionsAnswered}</div>
            </div>
        </div>
    );
};