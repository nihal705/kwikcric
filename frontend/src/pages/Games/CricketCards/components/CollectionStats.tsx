// frontend/src/pages/Games/CricketCards/components/CollectionStats.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { CardCollection } from '../types/cricketCards.types';

interface CollectionStatsProps {
  stats: CardCollection;
}

export const CollectionStats: React.FC<CollectionStatsProps> = ({ stats }) => {
  const rarityStats = [
    { name: 'Common', color: 'bg-gray-500', count: stats.cards.filter(c => c.rarity === 'common').length, icon: '⬤' },
    { name: 'Standard', color: 'bg-slate-500', count: stats.cards.filter(c => c.rarity === 'standard').length, icon: '⬟' },
    { name: 'Rare', color: 'bg-blue-500', count: stats.cards.filter(c => c.rarity === 'rare').length, icon: '◆' },
    { name: 'Epic', color: 'bg-purple-500', count: stats.cards.filter(c => c.rarity === 'epic').length, icon: '◈' },
    { name: 'Elite', color: 'bg-cyan-500', count: stats.cards.filter(c => c.rarity === 'elite').length, icon: '✧' },
    { name: 'Legendary', color: 'bg-amber-500', count: stats.cards.filter(c => c.rarity === 'legendary').length, icon: '★' },
    { name: 'Mythic', color: 'bg-red-500', count: stats.cards.filter(c => c.rarity === 'mythic').length, icon: '⚜' },
  ];

  return (
    <div className="bg-gray-800 rounded-xl p-5 mb-6 border border-gray-700">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{stats.totalCards}</div>
            <div className="text-xs text-gray-500 mt-0.5">Total Cards</div>
          </div>
          <div className="w-px h-10 bg-gray-700 hidden sm:block" />
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{stats.uniqueCards}</div>
            <div className="text-xs text-gray-500 mt-0.5">Unique Cards</div>
          </div>
          <div className="w-px h-10 bg-gray-700 hidden sm:block" />
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-400">{stats.completionRate}%</div>
            <div className="text-xs text-gray-500 mt-0.5">Completion</div>
          </div>
          <div className="w-px h-10 bg-gray-700 hidden sm:block" />
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-400">{stats.setsCompleted}/{stats.totalSets}</div>
            <div className="text-xs text-gray-500 mt-0.5">Sets Completed</div>
          </div>
        </div>
        
        <div className="flex gap-4">
          {rarityStats.map(stat => (
            <div key={stat.name} className="text-center">
              <div className={`w-9 h-9 rounded-full ${stat.color} flex items-center justify-center mx-auto mb-1 shadow-md`}>
                <span className="text-white text-sm font-bold">{stat.icon}</span>
              </div>
              <div className="text-base font-semibold text-white">{stat.count}</div>
              <div className="text-[10px] text-gray-500">{stat.name}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Overall Progress Bar */}
      <div className="mt-5">
        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
          <span>Collection Progress</span>
          <span className="font-mono">{stats.completionRate}% Complete</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stats.completionRate}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="bg-gradient-to-r from-emerald-500 to-amber-500 h-2.5 rounded-full"
          />
        </div>
      </div>
    </div>
  );
};