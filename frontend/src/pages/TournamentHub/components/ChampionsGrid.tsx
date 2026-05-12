// frontend/src/pages/TournamentHub/components/ChampionsGrid.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { tournamentData } from '../../../data/tournamentData';

interface ChampionsGridProps {
  tournamentType: 'odi' | 't20' | 'ct' | 'wtc';
}

const teamColors: Record<string, string> = {
  'West Indies': 'from-purple-600 to-pink-600',
  'India': 'from-orange-600 to-orange-800',
  'Australia': 'from-yellow-600 to-yellow-800',
  'Pakistan': 'from-green-600 to-green-800',
  'Sri Lanka': 'from-blue-600 to-blue-800',
  'England': 'from-red-600 to-red-800',
  'New Zealand': 'from-slate-600 to-slate-800',
  'South Africa': 'from-green-500 to-green-700',
};

export const ChampionsGrid: React.FC<ChampionsGridProps> = ({ tournamentType }) => {
  const champions = tournamentData[tournamentType];
  const displayName = {
    odi: 'ODI World Cup',
    t20: 'T20 World Cup',
    ct: 'Champions Trophy',
    wtc: 'World Test Championship',
  }[tournamentType];

  if (!champions || champions.length === 0) {
    return (
      <div className="text-center py-5 text-xs text-gray-500 dark:text-gray-400">
        No champion data available for {displayName}
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h3 className="text-base font-bold text-gray-900 dark:text-white text-center mb-3">
         {displayName} Champions
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {champions.map((champion, index) => (
          <motion.div
            key={champion.year}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.02 }}
            viewport={{ once: true }}
            whileHover={{ y: -2 }}
            className="group cursor-pointer"
          >
            <Link to={tournamentType === 'odi' ? `/world-cup/${champion.year}` : tournamentType === 't20' ? `/world-cup/t20/${champion.year}` : '#'}>
              <div className={`bg-gradient-to-br ${teamColors[champion.winner] || 'from-gray-700 to-gray-800'} rounded-md p-2 text-center shadow-sm`}>
                <div className="text-xl mb-0.5">{champion.image}</div>
                <div className="text-xs font-bold text-white">{champion.year}</div>
                <div className="text-[10px] font-semibold text-yellow-300 mt-0.5">{champion.winner}</div>
                <div className="text-[8px] text-white/70 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  vs {champion.runnerUp}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};