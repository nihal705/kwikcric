// frontend/src/pages/Games/CricketMastermind/components/CategorySelector.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface CategorySelectorProps {
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
}

const categories = [
    { name: 'All-Mode', icon: '🎲', color: 'bg-gray-500' },
    { name: 'ODI World Cup', icon: '🏏', color: 'bg-blue-500' },
    { name: 'T20 World Cup', icon: '⚡', color: 'bg-yellow-500' },
    { name: 'Test Cricket', icon: '📋', color: 'bg-red-500' },
    { name: 'IPL', icon: '💪', color: 'bg-purple-500' },
    { name: 'Women\'s Cricket', icon: '👩', color: 'bg-pink-500' },
    { name: 'Records', icon: '📊', color: 'bg-indigo-500' },
];

export const CategorySelector: React.FC<CategorySelectorProps> = ({ selectedCategory, onSelectCategory }) => {
    return (
        <div>
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Category
            </h2>
            <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                    <button
                        key={cat.name}
                        onClick={() => onSelectCategory(cat.name)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1
                            ${selectedCategory === cat.name 
                                ? `${cat.color} text-white` 
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                    >
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};