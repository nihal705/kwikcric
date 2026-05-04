import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface LiveScoreCardProps {
  match: {
    id: string;
    team1_name: string;
    team2_name: string;
    team1_code: string;
    team2_code: string;
    current_score?: string;
    current_overs?: string;
    status: string;
    tournament_name: string;
    venue_name: string;
  };
  compact?: boolean;
}

export const LiveScoreCard: React.FC<LiveScoreCardProps> = ({ match, compact = false }) => {
  const isLive = match.status === 'live';

  if (compact) {
    return (
      <Link to={`/live/${match.id}`}>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isLive && <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />}
              <span className="text-xs text-gray-500">{match.tournament_name}</span>
            </div>
            <span className="text-xs text-gray-500">{match.venue_name}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="text-center flex-1">
              <div className="font-bold">{match.team1_code}</div>
            </div>
            <div className="text-gray-500 font-bold mx-2">VS</div>
            <div className="text-center flex-1">
              <div className="font-bold">{match.team2_code}</div>
            </div>
          </div>
          {match.current_score && (
            <div className="text-center text-xs font-mono mt-1">
              {match.current_score} ({match.current_overs})
            </div>
          )}
        </div>
      </Link>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div className={`p-4 ${isLive ? 'border-l-4 border-red-500' : ''}`}>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2">
            {isLive && (
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-red-500 uppercase">LIVE</span>
              </div>
            )}
            <span className="text-xs text-gray-500">{match.tournament_name}</span>
          </div>
          <span className="text-xs text-gray-500">{match.venue_name}</span>
        </div>

        <div className="flex justify-between items-center py-4">
          <div className="text-center flex-1">
            <div className="text-lg font-bold text-gray-900 dark:text-white">{match.team1_name}</div>
            <div className="text-2xl font-mono font-bold text-gray-900 dark:text-white mt-1">
              {match.current_score?.split('/')[0] || '-'}
            </div>
            {match.current_score && (
              <div className="text-sm text-gray-500">
                {match.current_score?.split('/')[1] || ''} wickets
              </div>
            )}
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-400">VS</div>
          </div>
          
          <div className="text-center flex-1">
            <div className="text-lg font-bold text-gray-900 dark:text-white">{match.team2_name}</div>
            <div className="text-2xl font-mono font-bold text-gray-900 dark:text-white mt-1">-</div>
          </div>
        </div>

        {match.current_overs && (
          <div className="text-center text-sm text-gray-500">
            Overs: {match.current_overs}
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
          <Link
            to={`/live/${match.id}`}
            className="block text-center text-green-600 dark:text-green-400 text-sm font-medium hover:underline"
          >
            View Match Details →
          </Link>
        </div>
      </div>
    </motion.div>
  );
};