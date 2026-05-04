import React from 'react';
import { motion } from 'framer-motion';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatarUrl: string | null;
  score: number;
  country?: string;
}

interface LeaderboardTableProps {
  data: LeaderboardEntry[];
  gameType?: string;
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ data, gameType }) => {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No scores yet. Be the first to play!
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="px-4 py-3 text-left w-20">Rank</th>
            <th className="px-4 py-3 text-left">Player</th>
            <th className="px-4 py-3 text-right">Score</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <motion.tr
              key={entry.userId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <td className="px-4 py-3">
                <div className="flex items-center space-x-2">
                  {getRankIcon(entry.rank) && (
                    <span className="text-xl">{getRankIcon(entry.rank)}</span>
                  )}
                  <span className="font-mono font-bold">#{entry.rank}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
                    {entry.avatarUrl ? (
                      <img src={entry.avatarUrl} alt={entry.username} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm font-bold">{entry.username?.charAt(0).toUpperCase() || 'U'}</span>
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {entry.username}
                    </div>
                    {entry.country && (
                      <div className="text-xs text-gray-500">{entry.country}</div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-right">
                <span className="font-mono font-bold text-lg">{entry.score}</span>
                {gameType === 'quick_cricket' && <span className="text-sm text-gray-500 ml-1">runs</span>}
                {gameType === 'quiz' && <span className="text-sm text-gray-500 ml-1">pts</span>}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};