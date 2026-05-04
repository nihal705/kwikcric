// frontend/src/pages/Games/GamesHubPage.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../app/hooks/useAuth';
import { LeaderboardTable } from '../../components/games/Common/LeaderboardTable';
import { useQuery } from 'react-query';
import { gameAPI } from '../../services/api/gameAPI';

export const GamesHubPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const { data: leaderboard } = useQuery(
    ['leaderboard', 'kwik_cricket', 'all_time'],
    () => gameAPI.getLeaderboard('kwik_cricket', 'all_time', 5),
    { refetchInterval: 60000 }
  );

  const games = [
    {
      id: 'kwik-cricket',
      title: 'Kwik Cricket',
      description: 'Fast-paced cricket action! Choose shots, score runs, win matches.',
      icon: '⚡',
      color: 'from-green-600 to-green-800',
      path: '/games/kwik-cricket',
      difficulty: 'Easy to Hard',
      players: '1-2 Players',
      tag: 'NEW'
    },
    {
      id: 'cricket-quiz',
      title: 'Cricket Mastermind',
      description: 'Test your cricket knowledge with 1000+ questions across all formats!',
      icon: '🧠',
      color: 'from-purple-600 to-purple-800',
      path: '/games/quiz',
      difficulty: 'Variable',
      players: '1 Player',
      tag: 'Coming Soon'
    },
    {
      id: 'imposter',
      title: 'Imposter',
      description: 'Find the imposter among cricket fans! Play with friends or AI bots.',
      icon: '🕵️',
      color: 'from-red-600 to-orange-600',
      path: '/games/imposter',
      difficulty: 'Medium',
      players: '3-11 Players',
      tag: 'Coming Soon'
    },
    {
      id: 'guess-legend',
      title: 'Guess the Legend',
      description: 'Identify cricketers from faces, actions, stats, and IPL history!',
      icon: '🎯',
      color: 'from-blue-600 to-cyan-600',
      path: '/games/guess-legend',
      difficulty: 'Medium',
      players: '1 Player',
      tag: 'Coming Soon'
    },
    {
      id: 'cricket-cards',
      title: 'Cricket Champions Cards',
      description: 'Collect, trade, and battle with cricket player cards!',
      icon: '💳',
      color: 'from-yellow-600 to-amber-600',
      path: '/games/cricket-cards',
      difficulty: 'Easy',
      players: '1 Player',
      tag: 'Coming Soon'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cricket Games</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Play exciting cricket games, test your knowledge, and compete on leaderboards!
        </p>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={isAuthenticated ? game.path : '/login'}>
              <div className={`bg-gradient-to-br ${game.color} rounded-lg p-4 text-white hover:transform hover:scale-102 transition-all duration-300 cursor-pointer shadow-lg`}>
                <div className="flex items-start justify-between">
                  <div className="text-3xl">{game.icon}</div>
                  {game.tag === 'NEW' && (
                    <span className="px-2 py-0.5 bg-yellow-500 text-black text-[10px] font-bold rounded-full">
                      {game.tag}
                    </span>
                  )}
                  {game.tag === 'Coming Soon' && (
                    <span className="px-2 py-0.5 bg-gray-700 text-gray-300 text-[9px] font-semibold rounded-full">
                      {game.tag}
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-bold mt-2">{game.title}</h2>
                <p className="text-white/80 text-xs mt-1">{game.description}</p>
                <div className="flex gap-2 mt-3">
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">
                    🎯 {game.difficulty}
                  </span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">
                    👥 {game.players}
                  </span>
                </div>
                <button className="w-full mt-3 py-1.5 bg-white/20 rounded-lg text-sm font-semibold hover:bg-white/30 transition">
                  {game.tag === 'Coming Soon' ? 'Coming Soon →' : 'Play Now →'}
                </button>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Authentication Notice */}
      {!isAuthenticated && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
          <p className="text-yellow-800 dark:text-yellow-200 text-center text-sm">
            🔐 Please <Link to="/login" className="underline font-semibold">login</Link> to play games and save your scores to the leaderboard!
          </p>
        </div>
      )}

      {/* Leaderboard Preview */}
      {leaderboard?.data && leaderboard.data.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              🏆 Top Players - All Time
            </h2>
            <Link
              to="/games/leaderboard/kwik_cricket"
              className="text-xs text-green-600 dark:text-green-400 hover:underline"
            >
              View Full Leaderboard →
            </Link>
          </div>
          <LeaderboardTable data={leaderboard.data} gameType="kwik_cricket" />
        </div>
      )}
    </div>
  );
};