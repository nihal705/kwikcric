// src/pages/IPL/components/IPLTeamHistory.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface IPLSeason {
  id: number;
  year: number;
  winner_name: string;
  runner_up_name: string;
  winner_color: string;
  total_matches: number;
  total_teams: number;
  final_venue: string;
  final_match_date: string;
}

interface IPLTeamHistoryProps {
  seasons: IPLSeason[];
}

export const IPLTeamHistory: React.FC<IPLTeamHistoryProps> = ({ seasons }) => {
  if (!seasons || seasons.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        <p>No tournament history available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold text-center mb-4">All IPL Seasons</h2>
      <div className="grid grid-cols-1 gap-3">
        {seasons.map((season, index) => (
          <Link key={season.year} to={`/ipl/${season.year}`}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow hover:shadow-md transition-all border border-gray-200 dark:border-gray-700"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800 dark:text-white">{season.year}</div>
                    <div className="text-xs text-gray-500">Season</div>
                  </div>
                  <div className="hidden sm:block h-8 w-px bg-gray-300 dark:bg-gray-600" />
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: season.winner_color || '#004BA0' }}
                      />
                      <span className="font-semibold text-base">{season.winner_name || 'TBD'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>📍</span>
                      <span>{season.final_venue?.split(',')[0] || 'Venue TBD'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {season.runner_up_name && (
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Runner-up</div>
                      <div className="font-semibold text-sm">{season.runner_up_name}</div>
                    </div>
                  )}
                  <div className="text-blue-600 dark:text-blue-400">
                    <span className="text-xl">→</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};