// frontend/src/pages/Games/GamesPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const games = [
  {
    id: 'kwik-cricket',
    title: 'Kwik Cricket',
    description: 'Fast-paced cricket action! Choose shots, set targets, win matches.',
    icon: '⚡',
    color: 'from-green-600 to-green-800',
    path: '/games/kwik-cricket',
    features: ['Multiple Overs', 'AI Opponent', 'Two Player Mode', 'Stats Tracking'],
    isReady: true
  },
  {
    id: 'cricket-quiz',
    title: 'Cricket Mastermind',
    description: 'Test your cricket knowledge with 1000+ questions across all formats!',
    icon: '🧠',
    color: 'from-purple-600 to-purple-800',
    path: '/games/quiz',
    features: ['1000+ Questions', 'Fill the Table', 'Multiple Categories', 'Leaderboards'],
    isReady: false
  },
  {
    id: 'imposter',
    title: 'Imposter',
    description: 'Find the imposter among cricket fans! Play with friends or AI bots.',
    icon: '🕵️',
    color: 'from-red-600 to-orange-600',
    path: '/games/imposter',
    features: ['Multiplayer', 'AI Bots', 'Multiple Themes', 'Voting System'],
    isReady: false
  },
  {
    id: 'guess-legend',
    title: 'Guess the Legend',
    description: 'Identify cricketers from faces, actions, stats, and IPL history!',
    icon: '🎯',
    color: 'from-blue-600 to-cyan-600',
    path: '/games/guess-legend',
    features: ['Face Recognition', 'Action Shots', 'Career Stats', 'IPL History'],
    isReady: false
  },
  {
    id: 'cricket-cards',
    title: 'Cricket Champions Cards',
    description: 'Collect, trade, and battle with cricket player cards!',
    icon: '💳',
    color: 'from-yellow-600 to-amber-600',
    path: '/games/cricket-cards',
    features: ['Card Collection', 'Trading System', 'Special Editions', 'Set Bonuses'],
    isReady: false
  },
];

export const GamesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Cricket Games</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Test your skills and compete with players worldwide</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="group"
          >
            <Link to={game.isReady ? game.path : '#'}>
              <div className={`bg-gradient-to-br ${game.color} rounded-xl p-5 text-white shadow-lg transition-all duration-300 group-hover:shadow-xl ${!game.isReady ? 'opacity-75' : ''}`}>
                <div className="flex justify-between items-start">
                  <div className="text-5xl">{game.icon}</div>
                  {!game.isReady && (
                    <span className="px-2 py-0.5 bg-gray-800/50 text-white text-[10px] font-semibold rounded-full">
                      Coming Soon
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold mt-3">{game.title}</h2>
                <p className="text-white/80 text-sm mt-1">{game.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {game.features.slice(0, 3).map(feature => (
                    <span key={feature} className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded-full">
                      {feature}
                    </span>
                  ))}
                </div>
                <button 
                  className={`w-full mt-3 py-2 rounded-lg font-semibold transition text-sm ${
                    game.isReady 
                      ? 'bg-white/20 hover:bg-white/30' 
                      : 'bg-gray-700/50 cursor-not-allowed'
                  }`}
                  disabled={!game.isReady}
                >
                  {game.isReady ? 'Play Now →' : 'Coming Soon'}
                </button>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-green-600 text-2xl">⚡</div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">1</div>
          <div className="text-[10px] text-gray-500">Active Game</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-yellow-600 text-2xl">🎮</div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">5</div>
          <div className="text-[10px] text-gray-500">Total Games</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-blue-600 text-2xl">🧠</div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">1000+</div>
          <div className="text-[10px] text-gray-500">Quiz Questions</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-purple-600 text-2xl">👥</div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">11</div>
          <div className="text-[10px] text-gray-500">Max Players</div>
        </div>
      </div>
    </div>
  );
};