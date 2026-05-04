import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface Match {
  id: number;
  team1_name: string;
  team2_name: string;
  team1_code: string;
  team2_code: string;
  current_score?: string;
  status: string;
  tournament_name: string;
}

interface LiveMatchesWidgetProps {
  matches: Match[];
}

export const LiveMatchesWidget: React.FC<LiveMatchesWidgetProps> = ({ matches }) => {
  if (!matches || matches.length === 0) {
    return (
      <div className="text-center py-8 text-white/70">
        No live matches at the moment
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {matches.map((match, index) => (
        <motion.div
          key={match.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Link to={`/live/${match.id}`} className="block">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors">
              <div className="text-xs text-green-200 mb-2">{match.tournament_name}</div>
              <div className="flex items-center justify-between mb-3">
                <div className="text-center flex-1">
                  <div className="font-bold text-lg">{match.team1_code}</div>
                  <div className="text-sm text-green-200">{match.team1_name}</div>
                </div>
                <div className="text-white font-bold px-2">VS</div>
                <div className="text-center flex-1">
                  <div className="font-bold text-lg">{match.team2_code}</div>
                  <div className="text-sm text-green-200">{match.team2_name}</div>
                </div>
              </div>
              {match.current_score && (
                <div className="text-center text-sm font-mono bg-black/30 rounded py-1">
                  {match.current_score}
                </div>
              )}
              <div className="text-center text-xs text-green-200 mt-2">
                {match.status === 'live' ? '🔴 LIVE' : match.status}
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};