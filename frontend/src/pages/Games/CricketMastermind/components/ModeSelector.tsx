// frontend/src/pages/Games/CricketMastermind/components/ModeSelector.tsx
import React from 'react';
import { GameMode } from '../types/quiz.types';
import { motion } from 'framer-motion';

interface ModeSelectorProps {
    onSelect: (mode: GameMode) => void;
}

const modes: { id: GameMode; title: string; icon: string; description: string; color: string }[] = [
    {
        id: 'quick',
        title: 'Quick Quiz',
        icon: '⚡',
        description: 'Endless questions • 3 lives • Streak bonus',
        color: 'from-yellow-500 to-orange-500'
    },
    {
        id: 'challenge',
        title: 'Challenge Mode',
        icon: '🏆',
        description: '20 questions • 2 minute timer • Bonus points',
        color: 'from-purple-500 to-pink-500'
    },
    {
        id: 'filltable',
        title: 'Fill The Table',
        icon: '📋',
        description: 'Complete tables • Guess players • Time pressure',
        color: 'from-green-500 to-teal-500'
    }
];

export const ModeSelector: React.FC<ModeSelectorProps> = ({ onSelect }) => {
    return (
        <div>
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Choose Game Mode
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {modes.map((mode, idx) => (
                    <motion.button
                        key={mode.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => onSelect(mode.id)}
                        className={`bg-gradient-to-r ${mode.color} p-4 rounded-xl text-white text-left hover:transform hover:scale-105 transition-all duration-300 shadow-md`}
                    >
                        <div className="text-3xl mb-2">{mode.icon}</div>
                        <div className="font-bold text-base">{mode.title}</div>
                        <div className="text-xs text-white/80 mt-1">{mode.description}</div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};