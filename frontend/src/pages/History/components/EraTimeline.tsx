// frontend/src/pages/History/components/EraTimeline.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { eraData } from '../../../data/historyData';
import { HistoricalStats } from './HistoricalStats';
import { CricketMap } from './CricketMap';

interface EraTimelineProps {
  activeEra: string;
}

export const EraTimeline: React.FC<EraTimelineProps> = ({ activeEra }) => {
  const currentEra = eraData[activeEra as keyof typeof eraData];
  
  if (!currentEra) return null;

  return (
    <motion.div
      key={activeEra}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
    >
      {/* Era Header - Compact */}
      <div className={`bg-gradient-to-r ${currentEra.color} rounded-lg p-4 text-white mb-5`}>
        <div className="flex items-center gap-2">
          <div className="text-3xl">{currentEra.icon}</div>
          <div>
            <h2 className="text-xl font-bold">{currentEra.title}</h2>
            <p className="text-white/80 text-xs">{currentEra.period}</p>
          </div>
        </div>
        <p className="mt-2 text-white/90 text-xs">{currentEra.description}</p>
      </div>
      
      {/* Timeline Events - Compact */}
      <div className="relative mb-8">
        <div className="space-y-3">
          {currentEra.events.map((event, index) => (
            <motion.div
              key={event.year}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04 }}
              className="relative"
            >
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border-l-3 border-yellow-500 hover:shadow-sm transition-shadow">
                <div className="flex flex-wrap items-start gap-2">
                  <div className="text-base font-bold text-yellow-600 dark:text-yellow-400 min-w-[50px]">
                    {event.year}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{event.title}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{event.description}</p>
                    {event.location && (
                      <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-1">
                        📍 {event.location}
                      </p>
                    )}
                  </div>
                  {event.image && (
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <span className="text-lg">{event.image}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Era-Specific Stats */}
      <HistoricalStats era={activeEra} />
      
      {/* Cricket Map (only for Global Era and beyond) */}
      {(activeEra === 'global' || activeEra === 'golden' || activeEra === 'modern' || activeEra === 't20') && (
        <CricketMap era={activeEra} />
      )}
    </motion.div>
  );
};