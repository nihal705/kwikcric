// src/pages/IPL/components/IPLPlayerCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin } from 'react-icons/fi';
import { getPlayerImageUrl, getPlayerFallbackImage } from '../../../utils/playerImage';

interface IPLPlayerCardProps {
  player: {
    id: number;
    name: string;
    full_name: string;
    country: string;
    role: string;
    ipl_runs: number;
    ipl_wickets: number;
    ipl_matches: number;
    ipl_batting_avg: number;
    ipl_bowling_avg: number;
    ipl_strike_rate: number;
    ipl_economy: number;
    best_score: number;
    best_bowling: string;
    image_url?: string | null;
  };
}

const toNumber = (value: any): number => {
  if (value === null || value === undefined) return 0;
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(num) ? 0 : num;
};

export const IPLPlayerCard: React.FC<IPLPlayerCardProps> = ({ player }) => {
  const iplRuns = toNumber(player.ipl_runs);
  const iplWickets = toNumber(player.ipl_wickets);
  const iplMatches = toNumber(player.ipl_matches);
  const iplBattingAvg = toNumber(player.ipl_batting_avg);
  const iplBowlingAvg = toNumber(player.ipl_bowling_avg);
  const iplStrikeRate = toNumber(player.ipl_strike_rate);
  const iplEconomy = toNumber(player.ipl_economy);
  const playerName = player.full_name || player.name;
  
  // Get initials for fallback when image fails to load
  const getInitials = () => {
    const names = playerName.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return playerName.substring(0, 2).toUpperCase();
  };

  // Determine player type for styling
  const getPlayerType = () => {
    const role = player.role?.toLowerCase() || '';
    if (role.includes('allrounder')) return { 
      label: 'ALL-ROUNDER', 
      color: 'from-emerald-500 to-teal-500', 
      badge: 'bg-emerald-500/20 text-emerald-400',
      icon: '⚡'
    };
    if (role.includes('bowler')) return { 
      label: 'BOWLER', 
      color: 'from-red-500 to-rose-500', 
      badge: 'bg-red-500/20 text-red-400',
      icon: '🎯'
    };
    if (role.includes('batsman')) return { 
      label: 'BATSMAN', 
      color: 'from-blue-500 to-indigo-500', 
      badge: 'bg-blue-500/20 text-blue-400',
      icon: '🏏'
    };
    if (role.includes('keeper')) return { 
      label: 'WK-BATSMAN', 
      color: 'from-purple-500 to-pink-500', 
      badge: 'bg-purple-500/20 text-purple-400',
      icon: '🧤'
    };
    return { 
      label: 'PLAYER', 
      color: 'from-gray-500 to-gray-600', 
      badge: 'bg-gray-500/20 text-gray-400',
      icon: '⭐'
    };
  };

  const playerType = getPlayerType();

  // Calculate IPL dominance score
  const getDominanceScore = () => {
    let score = 50;
    if (iplRuns > 5000) score += 25;
    else if (iplRuns > 3000) score += 18;
    else if (iplRuns > 1000) score += 10;
    
    if (iplWickets > 150) score += 25;
    else if (iplWickets > 100) score += 18;
    else if (iplWickets > 50) score += 10;
    
    if (iplBattingAvg > 35) score += 10;
    if (iplStrikeRate > 135) score += 10;
    if (iplEconomy < 7.5 && iplEconomy > 0) score += 10;
    
    return Math.min(99, score);
  };

  const dominanceScore = getDominanceScore();

  // Get color based on score
  const getScoreColor = () => {
    if (dominanceScore >= 90) return 'text-yellow-400';
    if (dominanceScore >= 75) return 'text-blue-400';
    return 'text-emerald-400';
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <Link to={`/ipl/player/${player.id}`}>
        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
          
          {/* Top Section with Avatar and Score */}
          <div className="relative bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 p-4">
            <div className="flex items-start justify-between">
              {/* Avatar and Name Section */}
              <div className="flex items-center gap-3">
                {/* Avatar Image with Fallback */}
                <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-md">
                  <img
                    src={getPlayerImageUrl(playerName)}
                    alt={playerName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = getPlayerFallbackImage(playerName);
                      // If fallback also fails, show initials
                      e.currentTarget.onerror = () => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          const span = document.createElement('span');
                          span.className = 'text-white font-bold text-lg';
                          span.textContent = getInitials();
                          parent.appendChild(span);
                          e.currentTarget.remove();
                        }
                      };
                    }}
                  />
                </div>
                
                {/* Name and Country */}
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white text-base">
                    {playerName.length > 18 ? playerName.substring(0, 16) + '..' : playerName}
                  </h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <FiMapPin size={10} className="text-gray-400" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">{player.country || 'International'}</span>
                  </div>
                </div>
              </div>
              
              {/* IPL Score */}
              <div className="text-center">
                <div className={`text-xl font-bold ${getScoreColor()}`}>{dominanceScore}</div>
                <div className="text-[9px] text-gray-400">IPL Score</div>
              </div>
            </div>
          </div>
          
          {/* Role Badge */}
          <div className="px-4 pt-3">
            <div className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg ${playerType.badge}`}>
              <span>{playerType.icon}</span>
              <span>{playerType.label}</span>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="p-4 pt-2">
            {/* Primary Stats - 3 columns */}
            <div className="grid grid-cols-3 gap-2 mb-3 text-center">
              <div>
                <div className="text-lg font-bold text-gray-800 dark:text-white">{iplMatches}</div>
                <div className="text-[9px] text-gray-400">Matches</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{iplRuns.toLocaleString()}</div>
                <div className="text-[9px] text-gray-400">Runs</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{iplWickets}</div>
                <div className="text-[9px] text-gray-400">Wickets</div>
              </div>
            </div>
            
            {/* Batting Stats - if batsman or all-rounder */}
            {(playerType.label === 'BATSMAN' || playerType.label === 'ALL-ROUNDER' || playerType.label === 'WK-BATSMAN') && (
              <div className="grid grid-cols-2 gap-2 mb-2 text-center bg-gray-50 dark:bg-gray-700/30 rounded-lg p-2">
                <div>
                  <div className="text-[9px] text-gray-400">Bat Avg</div>
                  <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{iplBattingAvg.toFixed(1)}</div>
                </div>
                <div>
                  <div className="text-[9px] text-gray-400">Strike Rate</div>
                  <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{iplStrikeRate.toFixed(1)}</div>
                </div>
              </div>
            )}
            
            {/* Bowling Stats - if bowler or all-rounder */}
            {(playerType.label === 'BOWLER' || playerType.label === 'ALL-ROUNDER') && (
              <div className="grid grid-cols-2 gap-2 mb-2 text-center bg-gray-50 dark:bg-gray-700/30 rounded-lg p-2">
                <div>
                  <div className="text-[9px] text-gray-400">Bowl Avg</div>
                  <div className="text-sm font-semibold text-rose-600 dark:text-rose-400">{iplBowlingAvg.toFixed(1)}</div>
                </div>
                <div>
                  <div className="text-[9px] text-gray-400">Economy</div>
                  <div className="text-sm font-semibold text-rose-600 dark:text-rose-400">{iplEconomy.toFixed(2)}</div>
                </div>
              </div>
            )}
            
            {/* Best Performance */}
            <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 text-center">
              <div className="flex justify-center gap-3 text-[10px]">
                {player.best_score > 0 && (
                  <span className="text-yellow-600 dark:text-yellow-400">Best: {player.best_score}*</span>
                )}
                {player.best_bowling && player.best_bowling !== '-' && player.best_bowling !== 'N/A' && (
                  <span className="text-cyan-600 dark:text-cyan-400">Best: {player.best_bowling}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};