// frontend/src/pages/Games/CricketMastermind/components/FillTheTableMode.tsx
import React, { useState, useEffect } from 'react';
import { FillTableChallenge, FillTableRow } from '../types/quiz.types';
import { fillTableChallenges } from '../data/questions/fillTheTableData';
import { checkAnswer, normalizeText } from '../logic/smartRecognition';
import { Timer } from './Timer';
import { motion } from 'framer-motion';

interface FillTheTableModeProps {
    onExit: () => void;
}

export const FillTheTableMode: React.FC<FillTheTableModeProps> = ({ onExit }) => {
    const [challenge, setChallenge] = useState<FillTableChallenge | null>(null);
    const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
    const [score, setScore] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [currentHint, setCurrentHint] = useState('');
    const [hintIndex, setHintIndex] = useState(0);
    const [results, setResults] = useState<{ row: number; column: string; isCorrect: boolean; correctValue: string }[]>([]);

    useEffect(() => {
        // Select random challenge
        const randomIndex = Math.floor(Math.random() * fillTableChallenges.length);
        const selected = { ...fillTableChallenges[randomIndex] };
        setChallenge(selected);
        setTimeRemaining(selected.timeLimit);
    }, []);

    const getCellKey = (rowIndex: number, column: string): string => {
        return `${rowIndex}_${column}`;
    };

    const getPlaceholder = (row: FillTableRow, column: string): string => {
        if (column === 'Rank') return `Enter rank ${row.rank}`;
        if (column === 'Player Name') return 'Enter player name';
        if (column === 'Runs') return 'Enter runs';
        if (column === 'Country') return 'Enter country';
        if (column === 'Team') return 'Enter team name';
        if (column === 'Score') return 'Enter score';
        if (column === 'Against') return 'Enter opponent';
        if (column === 'Year') return 'Enter year';
        return 'Enter value';
    };

    const getDisplayValue = (row: FillTableRow, column: string): string | undefined => {
        if (column === 'Rank') return row.rank?.toString();
        if (column === 'Player Name') return row.playerName;
        if (column === 'Runs') return row.runs?.toString();
        if (column === 'Country') return row.country;
        if (column === 'Team') return row.team;
        if (column === 'Score') return row.score;
        if (column === 'Against') return row.against;
        if (column === 'Year') return row.year?.toString();
        return undefined;
    };

    const isCellEditable = (row: FillTableRow, column: string): boolean => {
        const value = getDisplayValue(row, column);
        return value === undefined || value === '';
    };

    const handleInputChange = (rowIndex: number, column: string, value: string) => {
        const key = getCellKey(rowIndex, column);
        setUserAnswers(prev => ({ ...prev, [key]: value }));
    };

    const handleUseHint = () => {
        if (!challenge || hintIndex >= challenge.hints.length) return;
        
        setCurrentHint(challenge.hints[hintIndex]);
        setShowHint(true);
        setHintIndex(prev => prev + 1);
        
        setTimeout(() => {
            setShowHint(false);
        }, 5000);
    };

    const handleSubmit = () => {
        if (!challenge) return;
        
        let newScore = 0;
        const newResults: { row: number; column: string; isCorrect: boolean; correctValue: string }[] = [];
        
        challenge.rows.forEach((row, rowIndex) => {
            challenge.columns.forEach(column => {
                const cellKey = getCellKey(rowIndex, column);
                const userAnswer = userAnswers[cellKey];
                const correctValue = getDisplayValue(row, column);
                
                if (userAnswer && correctValue) {
                    const isCorrect = checkAnswer(userAnswer, correctValue.toString());
                    if (isCorrect) {
                        newScore += 10;
                        newResults.push({ row: rowIndex, column, isCorrect: true, correctValue: correctValue.toString() });
                    } else {
                        newResults.push({ row: rowIndex, column, isCorrect: false, correctValue: correctValue.toString() });
                    }
                } else if (correctValue) {
                    newResults.push({ row: rowIndex, column, isCorrect: false, correctValue: correctValue.toString() });
                }
            });
        });
        
        setScore(newScore);
        setResults(newResults);
        setIsComplete(true);
    };

    const handleTimeout = () => {
        handleSubmit();
    };

    if (!challenge) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-3xl animate-spin mb-2">⏳</div>
                    <div className="text-gray-500">Loading challenge...</div>
                </div>
            </div>
        );
    }

    if (isComplete) {
        const totalPossible = challenge.rows.length * challenge.columns.filter(c => c !== 'Rank').length * 10;
        const percentage = totalPossible > 0 ? Math.round((score / totalPossible) * 100) : 0;
        
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6">
                <div className="max-w-5xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                        <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-4 text-center">
                            <div className="text-4xl mb-2">📋</div>
                            <h2 className="text-xl font-bold text-white">Challenge Complete!</h2>
                        </div>
                        
                        <div className="p-6">
                            <div className="text-center mb-6">
                                <div className="text-4xl font-bold text-green-600">{score}</div>
                                <div className="text-xs text-gray-500">Total Score</div>
                                <div className="text-sm text-gray-600 mt-2">Accuracy: {percentage}%</div>
                            </div>
                            
                            <div className="space-y-2 mb-6 max-h-96 overflow-y-auto">
                                {results.map((result, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-2 rounded-lg text-sm flex justify-between items-center ${
                                            result.isCorrect 
                                                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                                                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                                        }`}
                                    >
                                        <span className="text-gray-700 dark:text-gray-300">
                                            Row {result.row + 1}, {result.column}
                                        </span>
                                        <span className={result.isCorrect ? 'text-green-600' : 'text-red-600'}>
                                            {result.isCorrect ? '✓ Correct' : `✗ Correct: ${result.correctValue}`}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="flex gap-3">
                                <button
                                    onClick={() => window.location.reload()}
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
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6">
            <div className="max-w-5xl mx-auto px-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={onExit}
                        className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                        ← Exit
                    </button>
                    <div className="text-center">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">{challenge.title}</div>
                        <div className="text-xs text-gray-500">{challenge.type === 'complete' ? 'Complete Table' : 'Guess Player'}</div>
                    </div>
                    <div className="w-16"></div>
                </div>

                {/* Score and Timer */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="text-xs text-gray-500">Score</div>
                        <div className="text-xl font-bold text-green-600">{score}</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="text-xs text-gray-500">Time Left</div>
                        <div className="text-xl font-bold text-orange-600">{timeRemaining}s</div>
                    </div>
                </div>

                {/* Hint Section */}
                {showHint && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
                    >
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            💡 {currentHint}
                        </p>
                    </motion.div>
                )}

                {/* Table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto mb-4">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                {challenge.columns.map((col, idx) => (
                                    <th key={idx} className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {challenge.rows.map((row, rowIndex) => (
                                <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                    {challenge.columns.map((col, colIndex) => {
                                        const displayValue = getDisplayValue(row, col);
                                        const isEditable = isCellEditable(row, col);
                                        const cellKey = getCellKey(rowIndex, col);
                                        const userValue = userAnswers[cellKey];
                                        
                                        if (displayValue !== undefined) {
                                            return (
                                                <td key={colIndex} className="px-4 py-2 text-gray-900 dark:text-white">
                                                    {displayValue}
                                                </td>
                                            );
                                        }
                                        
                                        return (
                                            <td key={colIndex} className="px-4 py-2">
                                                <input
                                                    type="text"
                                                    value={userValue || ''}
                                                    onChange={(e) => handleInputChange(rowIndex, col, e.target.value)}
                                                    placeholder={getPlaceholder(row, col)}
                                                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                                />
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Timer and Actions */}
                <Timer
                    timeRemaining={timeRemaining}
                    totalTime={challenge.timeLimit}
                    onTimeout={handleTimeout}
                    isActive={!isComplete}
                />
                
                <div className="flex gap-3 mt-4">
                    <button
                        onClick={handleUseHint}
                        disabled={hintIndex >= challenge.hints.length}
                        className={`flex-1 py-2 rounded-lg font-semibold transition ${
                            hintIndex < challenge.hints.length
                                ? 'bg-yellow-600 text-white hover:bg-yellow-500'
                                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        💡 Use Hint ({challenge.hints.length - hintIndex} left)
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex-1 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-500 transition"
                    >
                        Submit Answers →
                    </button>
                </div>
            </div>
        </div>
    );
};