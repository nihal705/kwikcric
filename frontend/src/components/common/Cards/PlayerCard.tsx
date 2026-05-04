import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiBarChart2, FiTarget, FiZap, FiAward, FiTrendingUp } from 'react-icons/fi';

interface PlayerCardProps {
  player: {
    id: number;
    full_name?: string;
    name?: string;
    country: string;
    role: string;
    runs?: number;
    wickets?: number;
    best_rank?: number;
    goat_score?: number;
    image_url?: string | null;
  };
  rank?: number;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, rank }) => {
  const playerName = player.full_name || player.name || 'Unknown Player';
  const runs = player.runs || 0;
  const wickets = player.wickets || 0;
  const bestRank = player.best_rank || rank || 999;
  
  // Use role from backend
  const actualRole = player.role?.toLowerCase() || 'cricketer';

  // Simple performance score (0-100)
  const getPerformanceScore = (): number => {
    // Use rank if available
    if (bestRank && bestRank < 100) {
      if (bestRank === 1) return 99;
      if (bestRank <= 5) return 95;
      if (bestRank <= 10) return 90;
      if (bestRank <= 20) return 85;
      if (bestRank <= 50) return 75;
      return 65;
    }
    
    // Fallback based on role
    if (actualRole === 'batsman') {
      if (runs > 15000) return 98;
      if (runs > 10000) return 95;
      if (runs > 5000) return 85;
      if (runs > 2000) return 70;
      return 50;
    }
    
    if (actualRole === 'bowler') {
      if (wickets > 500) return 98;
      if (wickets > 300) return 95;
      if (wickets > 150) return 85;
      if (wickets > 50) return 70;
      return 50;
    }
    
    // All-rounder
    const runScore = Math.min(50, runs / 300);
    const wicketScore = Math.min(50, wickets / 8);
    return Math.min(98, Math.round(runScore + wicketScore));
  };

  const perfScore = getPerformanceScore();
  
  // Role configuration
  const getRoleConfig = () => {
    switch (actualRole) {
      case 'batsman':
        return { 
          icon: <FiBarChart2 className="mr-1" size={14} />, 
          label: 'Batsman',
          color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
          gradient: 'from-blue-600 to-blue-800'
        };
      case 'bowler':
        return { 
          icon: <FiTarget className="mr-1" size={14} />, 
          label: 'Bowler',
          color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
          gradient: 'from-red-600 to-red-800'
        };
      case 'allrounder':
        return { 
          icon: <FiZap className="mr-1" size={14} />, 
          label: 'All-Rounder',
          color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
          gradient: 'from-green-600 to-green-800'
        };
      default:
        return { 
          icon: <FiAward className="mr-1" size={14} />, 
          label: 'Cricketer',
          color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
          gradient: 'from-gray-600 to-gray-800'
        };
    }
  };

  const roleConfig = getRoleConfig();

  const getScoreColor = (score: number) => {
    if (score >= 95) return '#fbbf24';
    if (score >= 90) return '#60a5fa';
    if (score >= 80) return '#4ade80';
    if (score >= 70) return '#fb923c';
    return '#9ca3af';
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
    >
      <Link to={`/player/${player.id}`}>
        {/* Header with gradient */}
        <div className={`relative h-44 bg-gradient-to-br ${roleConfig.gradient}`}>
          {/* Rank Badge - Only top 10 */}
          {bestRank && bestRank <= 10 && (
            <div className={`absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm z-10 shadow-lg ${
              bestRank === 1 ? 'bg-yellow-500' : 
              bestRank === 2 ? 'bg-gray-400' : 
              bestRank === 3 ? 'bg-amber-600' : 'bg-black/50'
            }`}>
              #{bestRank}
            </div>
          )}
          
          {/* Player Image */}
          <div className="absolute inset-0 flex items-center justify-center">
            {player.image_url ? (
              <img 
                src={player.image_url} 
                alt={playerName}
                className="w-28 h-28 rounded-full object-cover shadow-xl border-4 border-white/30"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-5xl shadow-xl">
                🏏
              </div>
            )}
          </div>
          
          {/* Performance Score Circle */}
          <div className="absolute top-3 right-3">
            <div className="relative w-12 h-12">
              <svg className="w-12 h-12 transform -rotate-90">
                <circle cx="24" cy="24" r="20" stroke="rgba(255,255,255,0.2)" strokeWidth="4" fill="none" />
                <circle
                  cx="24" cy="24" r="20"
                  stroke={getScoreColor(perfScore)}
                  strokeWidth="4" fill="none"
                  strokeDasharray={`${2 * Math.PI * 20}`}
                  strokeDashoffset={`${2 * Math.PI * 20 * (1 - perfScore / 100)}`}
                  className="transition-all duration-500"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
                {perfScore}
              </span>
            </div>
          </div>
          
          {/* Player Name at bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <div className="text-white font-bold text-base truncate">
              {playerName.length > 20 ? playerName.substring(0, 18) + '...' : playerName}
            </div>
          </div>
        </div>

        {/* Body - ONLY Runs and Wickets, NO averages */}
        <div className="p-4">
          {/* Country and Role */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <FiMapPin className="mr-1" size={12} />
              <span>{player.country || 'International'}</span>
            </div>
            <div className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center ${roleConfig.color}`}>
              {roleConfig.icon}
              <span>{roleConfig.label}</span>
            </div>
          </div>

          {/* ONLY Runs and Wickets - NO averages, NO indexes */}
          <div className="grid grid-cols-2 gap-3 mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
            <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {runs > 0 ? runs.toLocaleString() : '-'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Runs</div>
            </div>
            
            <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {wickets > 0 ? wickets.toLocaleString() : '-'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Wickets</div>
            </div>
          </div>

          {/* GOAT Badge for top 3 players */}
          {bestRank && bestRank <= 3 && (
            <div className="mt-3 flex justify-center">
              <div className="flex items-center gap-1 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded-full">
                <FiTrendingUp size={10} />
                <span>GOAT #{bestRank}</span>
              </div>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default PlayerCard;