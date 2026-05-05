// frontend/src/pages/Games/CricketMastermind/components/FillTheTableMode.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface FillTableChallenge {
    id: number;
    title: string;
    category: string;
    columns: string[];
    rows: any[];
    hints: string[];
}

const challenges: FillTableChallenge[] = [
    {
        id: 1,
        title: 'Top 10 ODI Run Scorers',
        category: 'Records',
        columns: ['Rank', 'Player Name', 'Runs', 'Country'],
        rows: [
            { rank: 1, playerName: 'Sachin Tendulkar', runs: 18426, country: 'India' },
            { rank: 2, playerName: 'Kumar Sangakkara', runs: 14234, country: 'Sri Lanka' },
            { rank: 3, playerName: 'Ricky Ponting', runs: 13704, country: 'Australia' },
            { rank: 4, playerName: 'Virat Kohli', runs: 14378, country: 'India' },
            { rank: 5, playerName: 'Mahela Jayawardene', runs: 12650, country: 'Sri Lanka' },
            { rank: 6, playerName: 'Sanath Jayasuriya', runs: 12500, country: 'Sri Lanka' },
            { rank: 7, playerName: 'Jacques Kallis', runs: 11579, country: 'South Africa' },
            { rank: 8, playerName: 'Inzamam-ul-Haq', runs: 11500, country: 'Pakistan' },
            { rank: 9, playerName: 'Mohammad Yousuf', runs: 10800, country: 'Pakistan' },
            { rank: 10, playerName: 'Brian Lara', runs: 10405, country: 'West Indies' }
        ],
        hints: [
            'Rank 1 is known as "The Master Blaster"',
            'Rank 2 is a left-handed wicket-keeper batsman',
            'Rank 4 holds record for fastest to 10,000 ODI runs',
            'Rank 6 invented the "Dilscoop" shot'
        ]
    },
    {
        id: 2,
        title: 'Top 10 ODI Wicket Takers',
        category: 'Records',
        columns: ['Rank', 'Player Name', 'Wickets', 'Country'],
        rows: [
            { rank: 1, playerName: 'Muttiah Muralitharan', wickets: 534, country: 'Sri Lanka' },
            { rank: 2, playerName: 'Wasim Akram', wickets: 502, country: 'Pakistan' },
            { rank: 3, playerName: 'Waqar Younis', wickets: 416, country: 'Pakistan' },
            { rank: 4, playerName: 'Glenn McGrath', wickets: 381, country: 'Australia' },
            { rank: 5, playerName: 'Anil Kumble', wickets: 337, country: 'India' },
            { rank: 6, playerName: 'Shaun Pollock', wickets: 393, country: 'South Africa' },
            { rank: 7, playerName: 'Brett Lee', wickets: 380, country: 'Australia' },
            { rank: 8, playerName: 'Lasith Malinga', wickets: 338, country: 'Sri Lanka' },
            { rank: 9, playerName: 'Chaminda Vaas', wickets: 400, country: 'Sri Lanka' },
            { rank: 10, playerName: 'Saqlain Mushtaq', wickets: 288, country: 'Pakistan' }
        ],
        hints: [
            'Rank 1 has the most wickets in ODI history',
            'Rank 2 is known as the "Sultan of Swing"',
            'Rank 4 is called "Pigeon"',
            'Rank 6 is a South African all-rounder'
        ]
    },
    {
        id: 3,
        title: 'Guess the Player - IPL 2024 Top Scorers',
        category: 'IPL',
        columns: ['Rank', 'Player Name'],
        rows: [
            { rank: 1, playerName: 'Virat Kohli' },
            { rank: 2, playerName: 'Ruturaj Gaikwad' },
            { rank: 3, playerName: 'Riyan Parag' },
            { rank: 4, playerName: 'Travis Head' },
            { rank: 5, playerName: 'Sanju Samson' },
            { rank: 6, playerName: 'KL Rahul' },
            { rank: 7, playerName: 'Shubman Gill' },
            { rank: 8, playerName: 'Rohit Sharma' },
            { rank: 9, playerName: 'Nicholas Pooran' },
            { rank: 10, playerName: 'Heinrich Klaasen' }
        ],
        hints: [
            'Rank 1 is known as "King Kohli"',
            'Rank 2 plays for CSK',
            'Rank 3 plays for RR',
            'Rank 4 is from Australia',
            'Rank 5 is the captain of RR',
            'Rank 6 is the captain of LSG',
            'Rank 7 plays for GT',
            'Rank 8 is called "Hitman"',
            'Rank 9 is from West Indies',
            'Rank 10 is from South Africa'
        ]
    }
];

// Define correct answers for easier matching
const correctAnswers: Record<string, string[]> = {
    'Sachin Tendulkar': ['sachin tendulkar', 'sachin', 'master blaster', 'tendulkar'],
    'Kumar Sangakkara': ['kumar sangakkara', 'sangakkara', 'sanga'],
    'Ricky Ponting': ['ricky ponting', 'ponting', 'punter'],
    'Virat Kohli': ['virat kohli', 'kohli', 'virat', 'king kohli', 'vk'],
    'Mahela Jayawardene': ['mahela jayawardene', 'mahela', 'jayawardene'],
    'Sanath Jayasuriya': ['sanath jayasuriya', 'sanath', 'jayasuriya'],
    'Jacques Kallis': ['jacques kallis', 'kallis'],
    'Inzamam-ul-Haq': ['inzamam ul haq', 'inzamam', 'inzi'],
    'Mohammad Yousuf': ['mohammad yousuf', 'yousuf', 'mohammad yousuf'],
    'Brian Lara': ['brian lara', 'lara', 'prince of trinidad'],
    'Muttiah Muralitharan': ['muttiah muralitharan', 'murali', 'muralitharan'],
    'Wasim Akram': ['wasim akram', 'akram', 'sultan of swing'],
    'Waqar Younis': ['waqar younis', 'waqar', 'younis'],
    'Glenn McGrath': ['glenn mcgrath', 'mcgrath', 'pigeon'],
    'Anil Kumble': ['anil kumble', 'kumble'],
    'Shaun Pollock': ['shaun pollock', 'pollock'],
    'Brett Lee': ['brett lee', 'lee', 'binga'],
    'Lasith Malinga': ['lasith malinga', 'malinga', 'slinger'],
    'Chaminda Vaas': ['chaminda vaas', 'vaas'],
    'Saqlain Mushtaq': ['saqlain mushtaq', 'saqlain'],
    'Ruturaj Gaikwad': ['ruturaj gaikwad', 'ruturaj', 'gaikwad'],
    'Riyan Parag': ['riyan parag', 'riyan', 'parag'],
    'Travis Head': ['travis head', 'travis', 'head'],
    'Sanju Samson': ['sanju samson', 'sanju', 'samson'],
    'KL Rahul': ['kl rahul', 'kl', 'rahul'],
    'Shubman Gill': ['shubman gill', 'shubman', 'gill'],
    'Rohit Sharma': ['rohit sharma', 'rohit', 'sharma', 'hitman'],
    'Nicholas Pooran': ['nicholas pooran', 'pooran', 'nick'],
    'Heinrich Klaasen': ['heinrich klaasen', 'klaasen', 'heinrich']
};

export const FillTheTableMode: React.FC<{ onExit: () => void; onUpdateStats: (correct: number, total: number, streak: number, score: number) => void }> = ({ 
    onExit, 
    onUpdateStats 
}) => {
    const [challenge, setChallenge] = useState<FillTableChallenge | null>(null);
    const [userAnswers, setUserAnswers] = useState<Map<string, string>>(new Map());
    const [correctAnswersMap, setCorrectAnswersMap] = useState<Map<string, boolean>>(new Map());
    const [score, setScore] = useState(0);
    const [totalPossible, setTotalPossible] = useState(0);
    const [showHint, setShowHint] = useState(false);
    const [currentHint, setCurrentHint] = useState('');
    const [hintIndex, setHintIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(300);
    const [wrongFeedback, setWrongFeedback] = useState<{ key: string; show: boolean }>({ key: '', show: false });

    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        loadRandomChallenge();
        
        timerRef.current = setInterval(() => {
            if (!isComplete) {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        if (timerRef.current) clearInterval(timerRef.current);
                        return 0;
                    }
                    return prev - 1;
                });
            }
        }, 1000);
        
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isComplete]);

    useEffect(() => {
        if (wrongFeedback.show) {
            const timeout = setTimeout(() => {
                setWrongFeedback({ key: '', show: false });
            }, 1000);
            return () => clearTimeout(timeout);
        }
    }, [wrongFeedback]);

    const loadRandomChallenge = () => {
        const randomIndex = Math.floor(Math.random() * challenges.length);
        const selected = JSON.parse(JSON.stringify(challenges[randomIndex]));
        setChallenge(selected);
        
        const newAnswers = new Map<string, string>();
        const newCorrectMap = new Map<string, boolean>();
        let possible = 0;
        
        selected.rows.forEach(( rowIndex: number) => {
            selected.columns.forEach((col: string) => {
                if (col !== 'Rank') {
                    const cellKey = `${rowIndex}_${col}`;
                    possible += 10;
                    newAnswers.set(cellKey, '');
                    newCorrectMap.set(cellKey, false);
                }
            });
        });
        
        setUserAnswers(newAnswers);
        setCorrectAnswersMap(newCorrectMap);
        setTotalPossible(possible);
        setScore(0);
        setHintIndex(0);
        setShowHint(false);
        setIsComplete(false);
        setTimeRemaining(300);
    };

    const normalizeAnswer = (input: string): string => {
        return input.trim().toLowerCase().replace(/[^\w\s]/g, '');
    };

    const isAnswerCorrect = (userInput: string, correctValue: string): boolean => {
        if (!userInput || !correctValue) return false;
        
        const normalizedInput = normalizeAnswer(userInput);
        const normalizedCorrect = normalizeAnswer(correctValue);
        
        // Direct match
        if (normalizedInput === normalizedCorrect) return true;
        
        // Check alias mapping
        const aliases = correctAnswers[correctValue];
        if (aliases) {
            if (aliases.includes(normalizedInput)) return true;
        }
        
        // Check by nickname
        for (const [correct, variations] of Object.entries(correctAnswers)) {
            if (variations.includes(normalizedInput) && normalizedCorrect === normalizeAnswer(correct)) {
                return true;
            }
        }
        
        return false;
    };

    const handleInputChange = (rowIndex: number, col: string, value: string) => {
        const cellKey = `${rowIndex}_${col}`;
        const isCorrect = correctAnswersMap.get(cellKey);
        if (isCorrect) return;
        setUserAnswers(prev => new Map(prev).set(cellKey, value));
    };

    const handleCheckAnswer = (rowIndex: number, col: string) => {
        if (!challenge) return;
        
        const cellKey = `${rowIndex}_${col}`;
        const isAlreadyCorrect = correctAnswersMap.get(cellKey);
        if (isAlreadyCorrect) return;
        
        const userValue = userAnswers.get(cellKey) || '';
        const row = challenge.rows[rowIndex];
        const correctValue = row[col === 'Player Name' ? 'playerName' : col === 'Runs' ? 'runs' : col === 'Wickets' ? 'wickets' : col.toLowerCase()];
        
        if (!userValue.trim()) {
            setWrongFeedback({ key: cellKey, show: true });
            return;
        }
        
        const isCorrect = isAnswerCorrect(userValue, String(correctValue));
        
        if (isCorrect) {
            setScore(prev => prev + 10);
            setCorrectAnswersMap(prev => new Map(prev).set(cellKey, true));
        } else {
            setWrongFeedback({ key: cellKey, show: true });
        }
    };

    const handleUseHint = () => {
        if (!challenge || hintIndex >= challenge.hints.length) return;
        setCurrentHint(challenge.hints[hintIndex]);
        setShowHint(true);
        setHintIndex(prev => prev + 1);
        setTimeout(() => setShowHint(false), 5000);
    };

    const handleSubmit = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsComplete(true);
        onUpdateStats(score, totalPossible, 0, score);
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (isComplete) {
        const percentage = totalPossible > 0 ? Math.round((score / totalPossible) * 100) : 0;
        return (
            <div className="h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-600 to-teal-600 px-4 py-3 text-center">
                        <div className="text-2xl mb-1">📋</div>
                        <h2 className="text-base font-bold text-white">Challenge Complete!</h2>
                    </div>
                    <div className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600 mb-1">{score} / {totalPossible}</div>
                        <div className="text-xs text-gray-500">Total Score</div>
                        <div className="text-xs text-gray-600 mt-2">Accuracy: {percentage}%</div>
                        <div className="flex gap-2 mt-4">
                            <button onClick={() => { loadRandomChallenge(); }} className="flex-1 py-2 bg-green-600 text-white rounded-lg font-medium text-sm hover:bg-green-500 transition">Play Again</button>
                            <button onClick={onExit} className="flex-1 py-2 bg-gray-500 text-white rounded-lg font-medium text-sm hover:bg-gray-400 transition">Main Menu</button>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (!challenge) {
        return (
            <div className="h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-2xl animate-spin mb-2">⏳</div>
                    <div className="text-sm text-gray-500">Loading challenge...</div>
                </div>
            </div>
        );
    }

    const completedCount = Array.from(correctAnswersMap.values()).filter(v => v === true).length;
    const totalFields = correctAnswersMap.size;

    const getCellClass = (rowIndex: number, col: string): string => {
        const cellKey = `${rowIndex}_${col}`;
        const isCorrect = correctAnswersMap.get(cellKey);
        const isWrong = wrongFeedback.show && wrongFeedback.key === cellKey;
        if (isCorrect) return 'bg-green-50 dark:bg-green-900/20';
        if (isWrong) return 'animate-shake bg-red-50 dark:bg-red-900/20';
        return '';
    };

    const isCellCorrect = (rowIndex: number, col: string): boolean => {
        return correctAnswersMap.get(`${rowIndex}_${col}`) || false;
    };

    const getDisplayValue = (rowIndex: number, col: string): string => {
        const cellKey = `${rowIndex}_${col}`;
        if (isCellCorrect(rowIndex, col)) {
            const row = challenge.rows[rowIndex];
            return String(row[col === 'Player Name' ? 'playerName' : col === 'Runs' ? 'runs' : col === 'Wickets' ? 'wickets' : col.toLowerCase()]);
        }
        return userAnswers.get(cellKey) || '';
    };

    return (
        <div className="h-screen bg-gray-100 dark:bg-gray-900 flex flex-col overflow-hidden">
            {/* Top Bar */}
            <div className="flex justify-between items-center px-4 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <button onClick={onExit} className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition">← Exit</button>
                <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">{challenge.title}</span>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-4 gap-2 p-3 bg-gray-50 dark:bg-gray-900/30 border-b border-gray-200 dark:border-gray-700">
                <div className="text-center"><div className="text-lg font-bold text-green-600">{score}</div><div className="text-[9px] text-gray-500">Score</div></div>
                <div className="text-center"><div className="text-lg font-bold text-blue-600">{completedCount}/{totalFields}</div><div className="text-[9px] text-gray-500">Progress</div></div>
                <div className="text-center"><div className={`text-lg font-bold ${timeRemaining <= 60 ? 'text-red-500 animate-pulse' : 'text-orange-600'}`}>{formatTime(timeRemaining)}</div><div className="text-[9px] text-gray-500">Time</div></div>
                <div className="text-center"><div className="text-lg font-bold text-yellow-600">{challenge.hints.length - hintIndex}</div><div className="text-[9px] text-gray-500">Hints</div></div>
            </div>

            {/* Hint Display */}
            {showHint && currentHint && (
                <div className="mx-auto w-full px-4 pt-2">
                    <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-2 mb-2">
                        <div className="flex items-start gap-2">
                            <span className="text-yellow-600 text-sm">💡</span>
                            <div className="flex-1"><div className="text-[10px] font-semibold text-yellow-700">HINT</div><div className="text-xs text-gray-700 dark:text-gray-300">{currentHint}</div></div>
                            <button onClick={() => setShowHint(false)} className="text-gray-400 text-xs">✕</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content - Scrollable Table */}
            <div className="flex-1 overflow-auto p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                            <tr>
                                {challenge.columns.map((col, idx) => (
                                    <th key={idx} className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300 text-xs">{col}</th>
                                ))}
                                <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700 dark:text-gray-300">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {challenge.rows.map((row, rowIndex) => (
                                <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                    {challenge.columns.map((col, colIndex) => {
                                        const displayValue = row[col === 'Player Name' ? 'playerName' : col === 'Runs' ? 'runs' : col === 'Wickets' ? 'wickets' : col.toLowerCase()];
                                        const isEditable = col !== 'Rank';
                                        
                                        if (!isEditable) {
                                            return <td key={colIndex} className="px-3 py-2 text-gray-900 dark:text-white text-xs">{displayValue}</td>;
                                        }
                                        
                                        const isCorrect = isCellCorrect(rowIndex, col);
                                        
                                        return (
                                            <td key={colIndex} className={`px-3 py-2 ${getCellClass(rowIndex, col)}`}>
                                                {isCorrect ? (
                                                    <span className="text-green-600 dark:text-green-400 font-medium text-xs">
                                                        {getDisplayValue(rowIndex, col)}
                                                        <span className="ml-1">✓</span>
                                                    </span>
                                                ) : (
                                                    <input
                                                        type="text"
                                                        value={getDisplayValue(rowIndex, col)}
                                                        onChange={(e) => handleInputChange(rowIndex, col, e.target.value)}
                                                        onKeyPress={(e) => { if (e.key === 'Enter') handleCheckAnswer(rowIndex, col); }}
                                                        placeholder={`Enter ${col.toLowerCase()}`}
                                                        className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-500"
                                                    />
                                                )}
                                            </td>
                                        );
                                    })}
                                    <td className="px-3 py-2 text-center">
                                        <button
                                            onClick={() => handleCheckAnswer(rowIndex, 'Player Name')}
                                            className="px-2 py-1 bg-green-600 text-white text-[10px] rounded hover:bg-green-500 transition"
                                        >
                                            Check
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="flex gap-2 p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <button
                    onClick={handleUseHint}
                    disabled={hintIndex >= challenge.hints.length}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${hintIndex < challenge.hints.length ? 'bg-yellow-600 text-white hover:bg-yellow-500' : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'}`}
                >
                    💡 Use Hint ({challenge.hints.length - hintIndex} left)
                </button>
                <button
                    onClick={handleSubmit}
                    className="flex-1 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-500 transition"
                >
                    Submit Challenge →
                </button>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-gray-200 dark:bg-gray-700">
                <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${(completedCount / totalFields) * 100}%` }} />
            </div>
        </div>
    );
};