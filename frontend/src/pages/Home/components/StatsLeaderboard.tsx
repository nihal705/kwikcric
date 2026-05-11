// frontend/src/pages/Home/components/StatsLeaderboard.tsx
import React, { useState, useRef} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { leaderboardData } from '../../../data/leaderboardData';

type CategoryType = 'runs' | 'wickets' | 'sixes';

export const StatsLeaderboard: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('runs');
  const [hoveredPlayer, setHoveredPlayer] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<'left' | 'right'>('right');
  const containerRef = useRef<HTMLDivElement>(null);

  const categories = [
    { id: 'runs' as CategoryType, label: 'Most Runs', subLabel: 'All Format' },
    { id: 'wickets' as CategoryType, label: 'Most Wickets', subLabel: 'All Format' },
    { id: 'sixes' as CategoryType, label: 'Most Sixes', subLabel: 'All Format' },
  ];

  const currentData = leaderboardData[activeCategory];

  const getMedalColor = (index: number) => {
    if (index === 0) return 'text-yellow-500';
    if (index === 1) return 'text-gray-400';
    if (index === 2) return 'text-amber-600';
    return 'text-gray-500';
  };

  const getMedalIcon = (index: number) => {
    if (index === 0) return '1';
    if (index === 1) return '2';
    if (index === 2) return '3';
    return `${index + 1}`;
  };

  const getTooltipContent = (player: any) => {
    const parts = [];
    if (player.matches) parts.push(`${player.matches} matches`);
    if (player.avg) parts.push(`Avg: ${player.avg}`);
    if (player.econ) parts.push(`Econ: ${player.econ}`);
    if (player.sixesPerMatch) parts.push(`${player.sixesPerMatch} sixes/match`);
    return parts.join(' • ');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="text-center mb-4">
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    viewport={{ once: true }}
    className="inline-flex items-center gap-1.5 bg-yellow-500/10 rounded-full px-2 py-0.5 mb-2"
  >
  </motion.div>
  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-0.5">Record Holders</h3>
  <p className="text-[10px] text-gray-600 dark:text-gray-400">Legends who set the bar</p>
</div>
      
      {/* Category Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex-1 px-2 py-1.5 text-center transition-all ${
              activeCategory === cat.id
                ? 'text-yellow-600 dark:text-yellow-400 border-b-2 border-yellow-500'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            <div className="text-xs font-medium">{cat.label}</div>
            <div className="text-[9px] text-gray-400 dark:text-gray-500">{cat.subLabel}</div>
          </button>
        ))}
      </div>
      
      {/* Leaderboard List */}
      <div className="p-2 space-y-1" ref={containerRef}>
        {currentData.map((player, idx) => (
          <div
            key={player.name}
            className="relative"
            onMouseEnter={(e) => {
              setHoveredPlayer(player.name);
              // Calculate if tooltip would go off screen
              const rect = e.currentTarget.getBoundingClientRect();
              const viewportWidth = window.innerWidth;
              // Check if right edge of tooltip would exceed viewport
              if (rect.right + 150 > viewportWidth) {
                setTooltipPosition('left');
              } else {
                setTooltipPosition('right');
              }
            }}
            onMouseLeave={() => setHoveredPlayer(null)}
          >
            <div className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold w-5 ${getMedalColor(idx)}`}>
                  {getMedalIcon(idx)}
                </span>
                <span className="text-xs font-medium text-gray-800 dark:text-white">{player.name}</span>
                <span className="text-[10px] text-gray-500">{player.country}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400">{player.value}</span>
              </div>
            </div>
            
            {/* Hover Details - Dynamic positioning */}
            <AnimatePresence>
              {hoveredPlayer === player.name && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className={`absolute top-full mt-1 z-50 bg-gray-900 text-white text-[10px] rounded-md px-2 py-1 whitespace-nowrap shadow-lg ${
                    tooltipPosition === 'left' ? 'right-0' : 'left-0'
                  }`}
                >
                  {getTooltipContent(player)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};