// frontend/src/pages/TournamentHub/components/TournamentCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface TournamentStats {
  mostWins: string;
  mostRuns?: string;
  mostWickets?: string;
  mostPoints?: string;
  mostSeries?: string;
}

interface TournamentCardProps {
  id: string;
  name: string;
  icon: string;
  color: string;
  years: string;
  editions: number;
  isActive: boolean;
  onClick: () => void;
  link: string;
  stats: TournamentStats;
}

export const TournamentCard: React.FC<TournamentCardProps> = ({
  name,
  icon,
  color,
  years,
  editions,
  isActive,
  onClick,
  link,
  stats,
}) => {
  // Format long team names for display
  const formatTeamName = (text: string): string => {
    if (text.includes('New Zealand, Australia, South Africa')) {
      return 'NZ, AUS, SA (1 each)';
    }
    if (text.includes('India (3) | West Indies (2) | England (2)')) {
      return 'India (3), WI (2), ENG (2)';
    }
    if (text.includes('India (3) | Australia (2)')) {
      return 'India (3), AUS (2)';
    }
    return text;
  };

  // Safe formatter for value that might be undefined
  const formatValue = (value: string | undefined): string => {
    if (!value) return 'N/A';
    return formatTeamName(value);
  };

  // Determine which stats to show
  const statItems = [
    { label: 'Most Wins', value: stats.mostWins, key: 'wins' },
    { label: 'Most Runs', value: stats.mostRuns, key: 'runs' },
    { label: 'Most Wickets', value: stats.mostWickets, key: 'wickets' },
    { label: 'Most Points', value: stats.mostPoints, key: 'points' },
    { label: 'Most Finals', value: stats.mostSeries, key: 'series' },
  ].filter(item => item.value !== undefined);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <div
        className={`w-full text-left transition-all duration-300 rounded-xl overflow-hidden h-full flex flex-col ${
          isActive ? 'ring-2 ring-yellow-500 shadow-lg transform scale-[1.02]' : 'opacity-80 hover:opacity-100'
        }`}
      >
        <div onClick={onClick} className={`bg-gradient-to-r ${color} p-3 text-white cursor-pointer`}>
          <div className="flex items-center gap-2">
            <div className="text-2xl">{icon}</div>
            <div>
              <h3 className="font-bold text-sm">{name}</h3>
              <p className="text-white/80 text-[10px]">{years} • {editions} Editions</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 p-3 border border-t-0 border-gray-200 dark:border-gray-700 rounded-b-xl flex-1 flex flex-col">
          <div className="grid grid-cols-1 gap-1.5 mb-2">
            {statItems.slice(0, 3).map((item) => (
              <div key={item.key} className="flex justify-between items-center">
                <div className="text-[9px] text-gray-500 dark:text-gray-400">{item.label}</div>
                <div className="text-[10px] font-semibold text-gray-900 dark:text-white text-right">
                  {item.key === 'wins' ? formatValue(item.value) : item.value?.split('|')[0].trim() || 'N/A'}
                </div>
              </div>
            ))}
          </div>
          
          {/* See Complete History Link */}
          <Link 
            to={link}
            className="mt-auto inline-flex items-center justify-center gap-1 text-[10px] text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 transition-colors pt-2 border-t border-gray-200 dark:border-gray-700"
          >
            <span>See Complete History</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};