// frontend/src/pages/Games/GamesHistoryHubPage.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { gamePersistence } from '../../services/gamePersistence';

interface GameStats {
    name: string;
    path: string;
    historyPath: string;
    totalGames: number;
    totalScore: number;
    winRate?: number;
    accuracy?: number;
    bgColor: string;
}

const GamesHistoryHubPage: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const [selectedGame, setSelectedGame] = useState<string | null>(null);
    const [gameHistory, setGameHistory] = useState<any[]>([]);
    const [overallStats, setOverallStats] = useState<any>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        gamePersistence.setAuthStatus(isAuthenticated, user?.id);
        loadAllStats();
    }, [isAuthenticated, user]);

    const loadAllStats = async () => {
        setIsLoading(true);
        try {
            const stats = await gamePersistence.getOverallStats();
            setOverallStats(stats);
        } catch (error) {
            console.error('Failed to load stats:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const games: GameStats[] = [
        { 
            name: 'Kwik Cricket', 
            path: '/games/kwik-cricket',
            historyPath: '/games/kwik-cricket/history',
            totalGames: overallStats.kwik_cricket?.totalGames || 0,
            totalScore: overallStats.kwik_cricket?.totalScore || 0,
            winRate: overallStats.kwik_cricket?.winRate || 0,
            bgColor: 'from-green-600 to-green-800'
        },
        { 
            name: 'Cricket Mastermind', 
            path: '/games/quiz',
            historyPath: '/games/quiz/history',
            totalGames: overallStats.quiz?.totalGames || 0,
            totalScore: overallStats.quiz?.totalScore || 0,
            accuracy: overallStats.quiz?.accuracy || 0,
            bgColor: 'from-purple-600 to-pink-600'
        },
        { 
            name: 'Imposter', 
            path: '/games/imposter',
            historyPath: '/games/imposter/history',
            totalGames: overallStats.imposter?.totalGames || 0,
            totalScore: overallStats.imposter?.totalScore || 0,
            winRate: overallStats.imposter?.winRate || 0,
            bgColor: 'from-red-600 to-orange-600'
        },
        { 
            name: 'Guess the Legend', 
            path: '/games/guess-legend',
            historyPath: '/games/guess-legend/history',
            totalGames: overallStats.guess_legend?.totalGames || 0,
            totalScore: overallStats.guess_legend?.totalScore || 0,
            accuracy: overallStats.guess_legend?.accuracy || 0,
            bgColor: 'from-blue-600 to-cyan-600'
        },
        { 
            name: 'Cricket Cards', 
            path: '/games/cricket-cards',
            historyPath: '/games/cricket-cards/history',
            totalGames: overallStats.cards?.totalGames || 0,
            totalScore: overallStats.cards?.totalScore || 0,
            winRate: overallStats.cards?.winRate || 0,
            bgColor: 'from-yellow-600 to-amber-600'
        }
    ];

    const loadGameHistory = async (gameName: string) => {
        const gameKey = gameName.toLowerCase().replace(/\s+/g, '_');
        const history = await gamePersistence.loadGameHistory(gameKey);
        setGameHistory(history);
        setSelectedGame(gameName);
    };

    const totalGames = games.reduce((sum, g) => sum + g.totalGames, 0);
    const totalScore = games.reduce((sum, g) => sum + g.totalScore, 0);
    const avgPerformance = Math.round(
        games.reduce((sum, g) => sum + (g.winRate || g.accuracy || 0), 0) / games.filter(g => g.totalGames > 0).length
    ) || 0;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-2xl animate-spin mb-2">⏳</div>
                    <div className="text-sm text-gray-500">Loading history...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-4">
            <div className="max-w-6xl mx-auto px-3">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-4"
                >
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Games History Hub</h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {user?.isGuest ? 'Guest Mode' : user?.username || 'Player'} - Track your progress
                    </p>
                    <Link 
                        to="/games" 
                        className="inline-block mt-1 text-[10px] text-green-600 hover:underline"
                    >
                        ← Back to Games
                    </Link>
                </motion.div>

                {/* Overall Stats - Compact */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-4 gap-2 mb-4"
                >
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-2 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">{totalGames}</div>
                        <div className="text-[9px] text-gray-500">Games</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-2 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="text-lg font-bold text-green-600">{totalScore}</div>
                        <div className="text-[9px] text-gray-500">Score</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-2 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="text-lg font-bold text-blue-600">{avgPerformance}%</div>
                        <div className="text-[9px] text-gray-500">Avg Perf</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-2 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="text-lg font-bold text-yellow-600">
                            {Math.max(...games.map(g => g.totalScore), 0)}
                        </div>
                        <div className="text-[9px] text-gray-500">Best Score</div>
                    </div>
                </motion.div>

                {/* Games Grid - Compact cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 mb-4"
                >
                    {games.map((game) => (
                        <div
                            key={game.name}
                            className={`bg-gradient-to-br ${game.bgColor} rounded-lg p-2 text-white shadow-sm hover:transform hover:scale-102 transition-all duration-200 cursor-pointer`}
                            onClick={() => loadGameHistory(game.name)}
                        >
                            <div className="flex justify-between items-start">
                                <h3 className="text-xs font-bold truncate">{game.name}</h3>
                                <Link
                                    to={game.historyPath}
                                    className="text-[8px] bg-white/20 px-1 py-0.5 rounded hover:bg-white/30 transition"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    View
                                </Link>
                            </div>
                            <div className="grid grid-cols-2 gap-1 mt-2">
                                <div>
                                    <div className="text-white/70 text-[8px]">Games</div>
                                    <div className="text-sm font-bold">{game.totalGames}</div>
                                </div>
                                <div>
                                    <div className="text-white/70 text-[8px]">Score</div>
                                    <div className="text-sm font-bold">{game.totalScore}</div>
                                </div>
                                {game.winRate !== undefined && (
                                    <div>
                                        <div className="text-white/70 text-[8px]">Win %</div>
                                        <div className="text-sm font-bold">{game.winRate}%</div>
                                    </div>
                                )}
                                {game.accuracy !== undefined && (
                                    <div>
                                        <div className="text-white/70 text-[8px]">Acc %</div>
                                        <div className="text-sm font-bold">{game.accuracy}%</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Detailed History Section */}
                {selectedGame && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden mt-4"
                    >
                        <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 flex justify-between items-center">
                            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                                {selectedGame} - Recent Games
                            </h2>
                            <button
                                onClick={() => setSelectedGame(null)}
                                className="text-[10px] text-gray-500 hover:text-gray-700 px-1.5 py-0.5 rounded hover:bg-gray-200 transition"
                            >
                                Close
                            </button>
                        </div>
                        
                        {gameHistory.length === 0 ? (
                            <div className="p-6 text-center">
                                <p className="text-xs text-gray-500">No history found for {selectedGame}</p>
                                <Link 
                                    to={games.find(g => g.name === selectedGame)?.path || '#'}
                                    className="inline-block mt-2 px-2 py-0.5 bg-green-600 text-white text-[10px] rounded hover:bg-green-500 transition"
                                >
                                    Play Now
                                </Link>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-80 overflow-y-auto">
                                {gameHistory.slice(0, 10).map((record, idx) => (
                                    <div key={idx} className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                                        <div className="flex justify-between items-center">
                                            <div className="flex-1">
                                                <div className="text-[10px] text-gray-500">
                                                    {new Date(record.played_at).toLocaleDateString()}
                                                </div>
                                                <div className="text-xs font-medium text-gray-900 dark:text-white">
                                                    Score: {record.score}
                                                    {record.accuracy && ` • Acc: ${record.accuracy}%`}
                                                    {record.result && ` • ${record.result === 'win' ? 'Won' : 'Lost'}`}
                                                </div>
                                            </div>
                                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                                                (record.result === 'win' || (record.accuracy && record.accuracy >= 70))
                                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                                            }`}>
                                                {record.result === 'win' ? 'Win' : 
                                                 record.accuracy && record.accuracy >= 70 ? 'Good' : 'Try'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default GamesHistoryHubPage;