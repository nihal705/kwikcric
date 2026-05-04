// frontend/src/pages/Games/CricketMastermind/components/QuestionCard.tsx
import React from 'react';
import { Question } from '../types/quiz.types';
import { motion } from 'framer-motion';

interface QuestionCardProps {
    question: Question;
    onAnswer: (answer: string) => void;
    selectedOption: string | null;
    timeRemaining: number;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ 
    question, 
    onAnswer, 
    selectedOption,
    timeRemaining 
}) => {
    const getOptionClass = (option: string) => {
        if (!selectedOption) return 'border-gray-200 dark:border-gray-700 hover:border-green-500';
        if (option === question.correctAnswer && selectedOption === option) {
            return 'border-green-500 bg-green-50 dark:bg-green-900/20';
        }
        if (selectedOption === option && option !== question.correctAnswer) {
            return 'border-red-500 bg-red-50 dark:bg-red-900/20';
        }
        if (option === question.correctAnswer && selectedOption) {
            return 'border-green-500 bg-green-50 dark:bg-green-900/20';
        }
        return 'border-gray-200 dark:border-gray-700 opacity-50';
    };

    if (question.type === 'truefalse') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
                <div className="text-center mb-6">
                    <div className="flex justify-center gap-2 mb-3">
                        <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                            True/False
                        </span>
                        <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                            {question.points} pts
                        </span>
                    </div>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                        {question.text}
                    </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => onAnswer('True')}
                        disabled={!!selectedOption}
                        className={`py-3 rounded-lg font-semibold transition-all border-2 ${getOptionClass('True')} ${
                            !selectedOption ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : ''
                        }`}
                    >
                        ✅ True
                    </button>
                    <button
                        onClick={() => onAnswer('False')}
                        disabled={!!selectedOption}
                        className={`py-3 rounded-lg font-semibold transition-all border-2 ${getOptionClass('False')} ${
                            !selectedOption ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300' : ''
                        }`}
                    >
                        ❌ False
                    </button>
                </div>
                
                {selectedOption && (
                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-semibold">Explanation:</span> {question.explanation}
                        </p>
                    </div>
                )}
            </motion.div>
        );
    }

    // Multiple Choice Questions
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
            <div className="text-center mb-6">
                <div className="flex justify-center gap-2 mb-3">
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                        Multiple Choice
                    </span>
                    <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                        {question.points} pts
                    </span>
                </div>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {question.text}
                </p>
                {timeRemaining <= 5 && timeRemaining > 0 && (
                    <p className="text-red-500 text-sm mt-2 animate-pulse">
                        ⏰ Hurry up! {timeRemaining} seconds left!
                    </p>
                )}
            </div>
            
            <div className="space-y-3">
                {question.options.map((option, idx) => (
                    <button
                        key={idx}
                        onClick={() => onAnswer(option)}
                        disabled={!!selectedOption}
                        className={`w-full p-3 text-left rounded-lg transition-all border-2 ${getOptionClass(option)} ${
                            !selectedOption ? 'hover:bg-gray-50 dark:hover:bg-gray-700' : ''
                        }`}
                    >
                        <span className="font-semibold mr-2">
                            {String.fromCharCode(65 + idx)}.
                        </span>
                        {option}
                    </button>
                ))}
            </div>
            
            {selectedOption && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-semibold">Explanation:</span> {question.explanation}
                    </p>
                </div>
            )}
        </motion.div>
    );
};