// frontend/src/pages/Games/CricketMastermind/components/DifficultySelector.tsx
import React from 'react';
import { Difficulty } from '../types/quiz.types';

interface DifficultySelectorProps {
    selectedDifficulty: Difficulty;
    onSelectDifficulty: (difficulty: Difficulty) => void;
}

const difficulties: { id: Difficulty; label: string; icon: string; color: string; time: string; points: string }[] = [
    { id: 'easy', label: 'Easy', icon: '🟢', color: 'bg-green-500', time: '30 sec', points: '10 pts' },
    { id: 'medium', label: 'Medium', icon: '🟡', color: 'bg-yellow-500', time: '20 sec', points: '20 pts' },
    { id: 'hard', label: 'Hard', icon: '🔴', color: 'bg-red-500', time: '15 sec', points: '50 pts' },
    { id: 'random', label: 'Random', icon: '🎲', color: 'bg-purple-500', time: 'Variable', points: 'Bonus' },
    { id: 'all', label: 'All-Mode', icon: '🌟', color: 'bg-indigo-500', time: 'Mixed', points: 'Varied' },
];

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({ selectedDifficulty, onSelectDifficulty }) => {
    return (
        <div>
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Difficulty Level
            </h2>
            <div className="flex flex-wrap gap-2">
                {difficulties.map((diff) => (
                    <button
                        key={diff.id}
                        onClick={() => onSelectDifficulty(diff.id)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1
                            ${selectedDifficulty === diff.id 
                                ? `${diff.color} text-white` 
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                    >
                        <span>{diff.icon}</span>
                        <span>{diff.label}</span>
                        <span className="text-[10px] opacity-75 ml-1">({diff.time} • {diff.points})</span>
                    </button>
                ))}
            </div>
        </div>
    );
};