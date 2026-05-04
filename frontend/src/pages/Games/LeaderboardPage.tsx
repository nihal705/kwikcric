import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useAuth } from '../../app/hooks/useAuth';
import { gameAPI } from '../../services/api/gameAPI';
import { LeaderboardTable } from '../../components/games/Common/LeaderboardTable';
import { Loader } from '../../components/common/Loader';
import { motion } from 'framer-motion';

export const LeaderboardPage: React.FC = () => {
  const { user } = useAuth();
  const [gameType, setGameType] = useState<'quick_cricket' | 'quiz'>('quick_cricket');
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'all_time'>('all_time');

  const { data: leaderboard, isLoading } = useQuery(
    ['leaderboard', gameType, period],
    () => gameAPI.getLeaderboard(gameType, period, 50),
    { refetchInterval: 60000 }
  );

  const { data: userRank } = useQuery(
    ['userRank', gameType, period, user?.id],
    () => user ? gameAPI.getUserRank(gameType, period) : null,
    { enabled: !!user }
  );

  const gameTypes = [
    { id: 'quick_cricket', name: 'Quick Cricket', icon: '🏏' },
    { id: 'quiz', name: 'Quiz Master', icon: '📚' },
  ];

  const periods = [
    { id: 'daily', name: 'Daily' },
    { id: 'weekly', name: 'Weekly' },
    { id: 'monthly', name: 'Monthly' },
    { id: 'all_time', name: 'All Time' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leaderboards</h1>
        <p className="text-gray-500 dark:text-gray-400">Compete with players worldwide!</p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-4">
          {/* Game Type Selector */}
          <div className="flex space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {gameTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setGameType(type.id as any)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  gameType === type.id
                    ? 'bg-white dark:bg-gray-800 text-green-600 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                }`}
              >
                {type.icon} {type.name}
              </button>
            ))}
          </div>

          {/* Period Selector */}
          <div className="flex space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {periods.map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id as any)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  period === p.id
                    ? 'bg-white dark:bg-gray-800 text-green-600 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* User Rank Card */}
      {userRank?.data && userRank.data.rank > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-4 text-white"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-90">Your Rank</p>
              <p className="text-3xl font-bold">#{userRank.data.rank}</p>
            </div>
            <div className="text-center">
              <p className="text-sm opacity-90">Your Score</p>
              <p className="text-2xl font-bold">{userRank.data.score}</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">Total Players</p>
              <p className="text-2xl font-bold">{userRank.data.totalPlayers}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Leaderboard Table */}
      {isLoading ? (
        <Loader />
      ) : (
        <LeaderboardTable data={leaderboard?.data || []} gameType={gameType} />
      )}
    </div>
  );
};