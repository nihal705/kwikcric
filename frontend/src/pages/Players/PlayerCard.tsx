import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiBarChart2, FiTarget, FiZap, FiAward } from 'react-icons/fi';

interface PlayerCardProps {
  player: {
    id: number;
    full_name?: string;
    name?: string;
    country: string;
    role: string;  // playing_role from database
    runs?: number | string;
    wickets?: number | string;
    batting_average?: number | string;
    bowling_average?: number | string;
    strike_rate?: number | string;
    economy?: number | string;
    image_url?: string | null;
  };
}

// Helper function to safely convert to number
const toNumber = (value: any): number => {
  if (value === undefined || value === null) return 0;
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(num) ? 0 : num;
};

// Helper to normalize role from database
const normalizeRole = (role: string): string => {
  if (!role) return 'cricketer';
  
  const lowerRole = role.toLowerCase();
  
  // Batsman variations
  if (lowerRole.includes('batsman') || lowerRole.includes('opener') || lowerRole.includes('middle-order') || lowerRole.includes('top-order')) {
    return 'batsman';
  }
  
  // Bowler variations
  if (lowerRole === 'bowler' || lowerRole.includes('opening bowler')) {
    return 'bowler';
  }
  
  // All-Rounder variations
  if (lowerRole.includes('allrounder') || lowerRole.includes('bowling allrounder') || lowerRole.includes('batting allrounder')) {
    return 'allrounder';
  }
  
  // Wicket-Keeper variations
  if (lowerRole.includes('wicketkeeper') || lowerRole.includes('wicket-keeper')) {
    return 'wicketkeeper';
  }
  
  return 'cricketer';
};

export const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  const playerName = player.full_name || player.name || 'Unknown Player';
  
  // Safe number conversions
  const runs = toNumber(player.runs);
  const wickets = toNumber(player.wickets);
  const battingAvg = toNumber(player.batting_average);
  const bowlingAvg = toNumber(player.bowling_average);
  const strikeRate = toNumber(player.strike_rate);
  const economy = toNumber(player.economy);
  
  // Normalize the role from database
  const normalizedRole = normalizeRole(player.role);
  const originalRole = player.role || 'Cricketer';

  // ============================================
  // PERFORMANCE SCORE - Role specific
  // ============================================
  const getPerformanceScore = (): number => {
    // BATSMAN: based on runs
    if (normalizedRole === 'batsman') {
      if (runs > 15000) return 99;
      if (runs > 10000) return 98;
      if (runs > 5000) return 95;
      if (runs > 2000) return 90;
      return 85;
    }
    
    // BOWLER: based on wickets
    if (normalizedRole === 'bowler') {
      if (wickets >= 800) return 99;
      if (wickets >= 700) return 98;
      if (wickets >= 600) return 97;
      if (wickets >= 500) return 95;
      if (wickets >= 400) return 92;
      if (wickets >= 300) return 88;
      if (wickets >= 200) return 85;
      if (wickets >= 100) return 80;
      return 75;
    }
    
    // ALL-ROUNDER: balanced between runs and wickets
    if (normalizedRole === 'allrounder') {
      let runScore = 0;
      let wicketScore = 0;
      
      // Runs contribution (max 50)
      if (runs >= 15000) runScore = 50;
      else if (runs >= 10000) runScore = 45;
      else if (runs >= 5000) runScore = 40;
      else if (runs >= 3000) runScore = 35;
      else if (runs >= 2000) runScore = 30;
      else if (runs >= 1000) runScore = 25;
      else runScore = 20;
      
      // Wickets contribution (max 50)
      if (wickets >= 500) wicketScore = 50;
      else if (wickets >= 400) wicketScore = 45;
      else if (wickets >= 300) wicketScore = 40;
      else if (wickets >= 200) wicketScore = 35;
      else if (wickets >= 100) wicketScore = 30;
      else if (wickets >= 50) wicketScore = 25;
      else wicketScore = 20;
      
      let total = runScore + wicketScore;
      
      // Bonus for elite all-rounders
      if (runs >= 5000 && wickets >= 300) total += 5;
      if (runs >= 10000 && wickets >= 200) total += 5;
      
      return Math.min(99, total);
    }
    
    // WICKET-KEEPER: based on runs
    if (normalizedRole === 'wicketkeeper') {
      if (runs > 10000) return 98;
      if (runs > 5000) return 95;
      if (runs > 2000) return 90;
      return 85;
    }
    
    return 90;
  };

  const perfScore = getPerformanceScore();
  
  // Display values
  const getDisplayBattingAvg = (): string => {
    if (battingAvg > 0 && battingAvg < 100) return battingAvg.toFixed(1);
    if (runs > 0) return (runs / 500).toFixed(1);
    return '-';
  };

  const getDisplayBowlingAvg = (): string => {
    if (bowlingAvg > 0 && bowlingAvg < 100) return bowlingAvg.toFixed(1);
    if (wickets > 0) return (wickets / 10).toFixed(1);
    return '-';
  };

  const getDisplayStrikeRate = (): string => {
    if (strikeRate > 0 && strikeRate < 200) return strikeRate.toFixed(1);
    return '-';
  };

  const getDisplayEconomy = (): string => {
    if (economy > 0 && economy < 15) return economy.toFixed(2);
    return '-';
  };

  // Format display role (cleaner version for UI)
  const getDisplayRole = (): string => {
    switch (normalizedRole) {
      case 'batsman': return 'Batsman';
      case 'bowler': return 'Bowler';
      case 'allrounder': return 'All-Rounder';
      case 'wicketkeeper': return 'WK-Batsman';
      default: return originalRole;
    }
  };

  // Role configuration based on normalized role
  const getRoleConfig = () => {
    switch (normalizedRole) {
      case 'batsman':
        return { 
          icon: <FiBarChart2 className="mr-1" size={14} />, 
          gradient: 'from-blue-600 to-blue-800',
          color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
          showBatting: true,
          showBowling: false
        };
      case 'bowler':
        return { 
          icon: <FiTarget className="mr-1" size={14} />, 
          gradient: 'from-red-600 to-red-800',
          color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
          showBatting: false,
          showBowling: true
        };
      case 'allrounder':
        return { 
          icon: <FiZap className="mr-1" size={14} />, 
          gradient: 'from-green-600 to-green-800',
          color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
          showBatting: true,
          showBowling: true
        };
      case 'wicketkeeper':
        return { 
          icon: <FiAward className="mr-1" size={14} />, 
          gradient: 'from-purple-600 to-purple-800',
          color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
          showBatting: true,
          showBowling: false
        };
      default:
        return { 
          icon: <FiAward className="mr-1" size={14} />, 
          gradient: 'from-gray-600 to-gray-800',
          color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
          showBatting: true,
          showBowling: false
        };
    }
  };

  const roleConfig = getRoleConfig();
  const displayRole = getDisplayRole();

  const getScoreColor = (score: number) => {
    if (score >= 98) return '#fbbf24';
    if (score >= 95) return '#fbbf24';
    if (score >= 90) return '#60a5fa';
    if (score >= 85) return '#4ade80';
    if (score >= 75) return '#fb923c';
    return '#9ca3af';
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
    >
      <Link to={`/player/${player.id}`}>
        <div className={`relative h-44 bg-gradient-to-br ${roleConfig.gradient}`}>
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
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <div className="text-white font-bold text-base truncate">
              {playerName.length > 20 ? playerName.substring(0, 18) + '...' : playerName}
            </div>
          </div>
        </div>

        <div className="p-4">
          {/* Country and Role */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <FiMapPin className="mr-1" size={12} />
              <span>{player.country || 'International'}</span>
            </div>
            <div className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center ${roleConfig.color}`}>
              {roleConfig.icon}
              <span>{displayRole}</span>
            </div>
          </div>

          {/* Runs and Wickets */}
          <div className="grid grid-cols-2 gap-3 mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
            <div className="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {runs > 0 ? runs.toLocaleString() : '-'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Runs</div>
            </div>
            
            <div className="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {wickets > 0 ? wickets.toLocaleString() : '-'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Wickets</div>
            </div>
          </div>
          
          {/* ALL-ROUNDER STATS - Show both batting and bowling */}
          {normalizedRole === 'allrounder' && (
            <div className="mt-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Batting Avg</div>
                  <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {getDisplayBattingAvg()}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Strike Rate</div>
                  <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {getDisplayStrikeRate()}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="text-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Bowling Avg</div>
                  <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {getDisplayBowlingAvg()}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Economy</div>
                  <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {getDisplayEconomy()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BATSMAN or WICKETKEEPER STATS */}
          {(normalizedRole === 'batsman' || normalizedRole === 'wicketkeeper') && (
            <div className="mt-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Batting Avg</div>
                  <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {getDisplayBattingAvg()}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Strike Rate</div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    {getDisplayStrikeRate()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BOWLER STATS */}
          {normalizedRole === 'bowler' && (
            <div className="mt-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Bowling Avg</div>
                  <div className="text-sm font-semibold text-red-600 dark:text-red-400">
                    {getDisplayBowlingAvg()}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Economy</div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    {getDisplayEconomy()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default PlayerCard;