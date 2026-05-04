import React from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiActivity } from 'react-icons/fi';

interface Game {
  id: number;
  type: string;
  score: number;
  result: string;
  date: string;
  isWin: boolean;
}

export const GameHistory: React.FC = () => {
  // Mock data - would come from API
  const games: Game[] = [
    { id: 1, type: 'Quick Cricket', score: 45, result: 'Completed', date: '2024-01-15', isWin: true },
    { id: 2, type: 'Quiz', score: 85, result: '8/10 Correct', date: '2024-01-14', isWin: true },
    { id: 3, type: 'Guess Player', score: 120, result: 'Correct Guess!', date: '2024-01-13', isWin: true },
    { id: 4, type: 'Quick Cricket', score: 28, result: 'All Out', date: '2024-01-12', isWin: false },
  ];

  const getGameIcon = (type: string): string => {
    switch (type) {
      case 'Quick Cricket': return '🏏';
      case 'Quiz': return '📚';
      case 'Guess Player': return '🕵️';
      default: return '🎮';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Game History</h2>
        <button className="text-sm text-green-600 hover:underline">View All</button>
      </div>

      <div className="space-y-3">
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
          >
            <div className="flex items-center space-x-4">
              <div className="text-3xl">{getGameIcon(game.type)}</div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">{game.type}</div>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <FiCalendar className="mr-1" size={12} />
                  {new Date(game.date).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-900 dark:text-white">{game.score}</div>
              <div className={`text-xs ${game.isWin ? 'text-green-600' : 'text-red-600'}`}>
                {game.result}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {games.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <FiActivity className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No games played yet</p>
          <button className="mt-2 text-green-600 text-sm hover:underline">Start Playing →</button>
        </div>
      )}
    </div>
  );
};