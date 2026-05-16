// src/pages/IPL/components/IPLTeamRankings.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface IPLTeam {
  id: number;
  name: string;
  short_name: string;
  city: string;
  home_ground: string;
  titles_won: number;
  runner_up_count: number;
  primary_color: string;
  secondary_color: string;
  rank?: number;
}

interface IPLTeamRankingsProps {
  rankings: IPLTeam[];
}

export const IPLTeamRankings: React.FC<IPLTeamRankingsProps> = ({ rankings }) => {
  if (!rankings || rankings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        <p>No team rankings data available.</p>
      </div>
    );
  }

  const getMedalColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-500 to-yellow-600';
    if (rank === 2) return 'from-gray-400 to-gray-500';
    if (rank === 3) return 'from-amber-600 to-amber-700';
    return 'from-blue-500 to-blue-600';
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-center">Most Successful IPL Teams</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rankings.map((team) => (
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`bg-gradient-to-r ${getMedalColor(team.rank || 0)} rounded-lg p-4 text-white cursor-pointer shadow hover:shadow-lg transition-all`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg mb-1 font-bold">#{team.rank}</div>
                  <h3 className="text-xl font-bold">{team.name}</h3>
                  <p className="text-xs text-white/80 mt-1">{team.city}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{team.titles_won}</div>
                  <div className="text-xs text-white/70">Titles</div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
                <div>
                  <div className="font-bold">{team.runner_up_count}</div>
                  <div className="text-white/70">Runner-up</div>
                </div>
                <div>
                  <div className="font-bold truncate">{team.home_ground?.split(',')[0] || 'N/A'}</div>
                  <div className="text-white/70">Home Ground</div>
                </div>
              </div>
            </motion.div>
        ))}
      </div>
    </div>
  );
};