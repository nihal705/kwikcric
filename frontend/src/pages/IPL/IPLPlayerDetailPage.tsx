// src/pages/IPL/IPLPlayerDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../../services/api/config';
import { 
  FiArrowLeft, FiBarChart2, FiTarget, FiMapPin, FiActivity, FiTrendingUp, FiUsers, FiStar 
} from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getPlayerImageUrl, getPlayerFallbackImage } from '../../utils/playerImage';

interface IPLSeasonStat {
  season_year: number;
  team_name: string;
  matches: number;
  runs: number;
  highest_score: number;
  batting_average: number;
  strike_rate: number;
  fours: number;
  sixes: number;
  fifties: number;
  centuries: number;
  wickets: number;
  bowling_average: number;
  economy: number;
}

interface IPLPlayerDetail {
  id: number;
  name: string;
  full_name: string;
  country: string;
  playing_role: string;
  batting_style: string;
  bowling_style: string;
  career_stats: {
    matches: number;
    runs: number;
    highest_score: number;
    batting_average: number;
    strike_rate: number;
    hundreds: number;
    fifties: number;
    fours: number;
    sixes: number;
    wickets: number;
    best_bowling: string;
    bowling_average: number;
    economy: number;
    five_wickets: number;
  };
  season_stats: IPLSeasonStat[];
  teams_played: string[];
  description: string;
}

export const IPLPlayerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [player, setPlayer] = useState<IPLPlayerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'stats'>('overview');

  useEffect(() => {
    const fetchPlayer = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/ipl/players/${id}`);
        setPlayer(response.data.data);
      } catch (error) {
        console.error('Failed to fetch IPL player:', error);
        toast.error('Failed to load player details');
      } finally {
        setLoading(false);
      }
    };
    fetchPlayer();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🏏</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Player Not Found</h2>
        <Link to="/ipl/players" className="text-blue-600 dark:text-blue-400 hover:underline transition">Back to IPL Players</Link>
      </div>
    );
  }

  const getPlayerGradient = () => {
    const role = player.playing_role?.toLowerCase() || '';
    if (role.includes('allrounder')) return 'from-emerald-600 to-teal-600';
    if (role.includes('bowler')) return 'from-red-600 to-rose-600';
    if (role.includes('batsman')) return 'from-blue-600 to-indigo-600';
    return 'from-purple-600 to-pink-600';
  };

  // Helper to format numbers safely
  const formatNumber = (value: number, defaultValue: string = '0') => {
    if (value === undefined || value === null || isNaN(value)) return defaultValue;
    return value.toLocaleString();
  };

return (
    <div className="space-y-5 min-h-screen bg-[#f9fafb] dark:bg-[#0f172a] text-gray-900 dark:text-white p-4 md:p-6" style={{ backgroundImage: 'none' }}>
      {/* Hero Section - Premium Header */}
      <div className={`relative bg-gradient-to-r ${getPlayerGradient()} pt-8 pb-32`}>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/ipl/players" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition mb-6">
            <FiArrowLeft size={16} />
            <span className="text-sm">Back to IPL Players</span>
          </Link>
          
          {/* Player Profile Header */}
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Avatar with actual player image */}
            <div className="relative">
              <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl bg-gradient-to-br from-gray-800 to-gray-900">
                <img
                  src={getPlayerImageUrl(player.name)}
                  alt={player.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = getPlayerFallbackImage(player.name);
                  }}
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-black/80 backdrop-blur-sm rounded-full px-2 py-1">
                <span className="text-[10px] font-bold text-yellow-500">IPL</span>
              </div>
            </div>
            
            {/* Player Info */}
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{player.full_name || player.name}</h1>
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="flex items-center gap-1 text-white/70 text-sm">
                  <FiMapPin size={14} />
                  {player.country}
                </span>
                <span className="flex items-center gap-1 text-white/70 text-sm">
                  <FiActivity size={14} />
                  {player.playing_role || 'Cricketer'}
                </span>
                <span className="flex items-center gap-1 text-white/70 text-sm">
                  <FiTrendingUp size={14} />
                  {player.batting_style || 'Right-hand bat'}
                </span>
                {player.bowling_style && (
                  <span className="flex items-center gap-1 text-white/70 text-sm">
                    <FiTarget size={14} />
                    {player.bowling_style}
                  </span>
                )}
              </div>
{/* Description added here */}
              {player.description && (
                <p className="text-white/70 text-sm line-clamp-2 max-w-2xl">{player.description}</p>
              )}
            </div>
            
            {/* IPL Badge */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2 text-center">
              <div className="text-2xl font-bold text-white">{player.career_stats.matches}</div>
              <div className="text-[10px] text-white/60">IPL Matches</div>
            </div>
          </div>
        </div>
      </div>

{/* Content Section */}
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-12">
  {/* Premium Stats Cards */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    {/* Runs Card */}
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md border border-gray-200 dark:border-gray-700 text-center">
      <div className="text-blue-600 dark:text-blue-400 text-2xl font-bold">
        {player.career_stats.runs ? player.career_stats.runs.toLocaleString() : '0'}
      </div>
      <div className="text-gray-500 dark:text-gray-400 text-xs mt-1">IPL Runs</div>
      <div className="text-gray-400 dark:text-gray-500 text-[10px] mt-2">Career Aggregate</div>
    </div>
    
    {/* Wickets Card */}
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md border border-gray-200 dark:border-gray-700 text-center">
      <div className="text-purple-600 dark:text-purple-400 text-2xl font-bold">
        {player.career_stats.wickets || 0}
      </div>
      <div className="text-gray-500 dark:text-gray-400 text-xs mt-1">IPL Wickets</div>
      <div className="text-gray-400 dark:text-gray-500 text-[10px] mt-2">Career Aggregate</div>
    </div>
    
    {/* Batting Average Card */}
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md border border-gray-200 dark:border-gray-700 text-center">
      <div className="text-emerald-600 dark:text-emerald-400 text-2xl font-bold">
        {player.career_stats.batting_average > 0 ? player.career_stats.batting_average.toFixed(1) : '-'}
      </div>
      <div className="text-gray-500 dark:text-gray-400 text-xs mt-1">Batting Average</div>
      <div className="text-gray-400 dark:text-gray-500 text-[10px] mt-2">Career</div>
    </div>
    
    {/* Strike Rate Card */}
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md border border-gray-200 dark:border-gray-700 text-center">
      <div className="text-rose-600 dark:text-rose-400 text-2xl font-bold">
        {player.career_stats.strike_rate > 0 ? player.career_stats.strike_rate.toFixed(1) : '-'}
      </div>
      <div className="text-gray-500 dark:text-gray-400 text-xs mt-1">Strike Rate</div>
      <div className="text-gray-400 dark:text-gray-500 text-[10px] mt-2">Career</div>
    </div>
  </div>
        
        {/* Tabs - Only Overview and Stats */}
        <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700 mb-6">
          {[
            { id: 'overview', label: 'Overview', icon: <FiStar size={16} /> },
            { id: 'stats', label: 'Statistics', icon: <FiBarChart2 size={16} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all rounded-t-xl ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {tab.icon}
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </div>
        
        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Teams Played */}
              {player.teams_played && player.teams_played.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
                  <h3 className="text-gray-900 dark:text-white font-semibold mb-3 flex items-center gap-2">
                    <FiUsers size={18} />
                    IPL Teams Represented
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {player.teams_played.map((team, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl text-sm">
                        {team}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Career Highlights Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Batting Highlights */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
                  <h3 className="text-blue-600 dark:text-blue-400 font-semibold mb-4 flex items-center gap-2">
                    <FiBarChart2 size={18} />
                    Batting Excellence
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">Highest Score</span>
                      <span className="text-gray-900 dark:text-white font-bold text-lg">{player.career_stats.highest_score || 0}*</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">Hundreds / Fifties</span>
                      <span className="text-gray-900 dark:text-white font-semibold">{player.career_stats.hundreds || 0} / {player.career_stats.fifties || 0}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">Fours / Sixes</span>
                      <span className="text-gray-900 dark:text-white font-semibold">{player.career_stats.fours || 0} / {player.career_stats.sixes || 0}</span>
                    </div>
                  </div>
                </div>
                
                {/* Bowling Highlights */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
                  <h3 className="text-purple-600 dark:text-purple-400 font-semibold mb-4 flex items-center gap-2">
                    <FiTarget size={18} />
                    Bowling Excellence
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">Best Bowling</span>
                      <span className="text-gray-900 dark:text-white font-bold text-lg">{player.career_stats.best_bowling || '-'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">Bowling Average / Economy</span>
                      <span className="text-gray-900 dark:text-white font-semibold">{player.career_stats.bowling_average > 0 ? player.career_stats.bowling_average.toFixed(2) : '-'} / {player.career_stats.economy > 0 ? player.career_stats.economy.toFixed(2) : '-'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">5-Wicket Hauls</span>
                      <span className="text-gray-900 dark:text-white font-semibold">{player.career_stats.five_wickets || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-gray-900 dark:text-white font-semibold mb-4">Complete IPL Statistics</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                      <td className="py-3 text-gray-500 dark:text-gray-400">Matches Played</td>
                      <td className="py-3 text-gray-900 dark:text-white font-semibold text-right">{player.career_stats.matches || 0}</td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                      <td className="py-3 text-gray-500 dark:text-gray-400">Total Runs</td>
                      <td className="py-3 text-blue-600 dark:text-blue-400 font-bold text-right">{formatNumber(player.career_stats.runs)}</td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                      <td className="py-3 text-gray-500 dark:text-gray-400">Batting Average</td>
                      <td className="py-3 text-emerald-600 dark:text-emerald-400 font-semibold text-right">{player.career_stats.batting_average > 0 ? player.career_stats.batting_average.toFixed(2) : '-'}</td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                      <td className="py-3 text-gray-500 dark:text-gray-400">Strike Rate</td>
                      <td className="py-3 text-emerald-600 dark:text-emerald-400 font-semibold text-right">{player.career_stats.strike_rate > 0 ? player.career_stats.strike_rate.toFixed(2) : '-'}</td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                      <td className="py-3 text-gray-500 dark:text-gray-400">Total Wickets</td>
                      <td className="py-3 text-purple-600 dark:text-purple-400 font-bold text-right">{player.career_stats.wickets || 0}</td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                      <td className="py-3 text-gray-500 dark:text-gray-400">Bowling Average</td>
                      <td className="py-3 text-rose-600 dark:text-rose-400 font-semibold text-right">{player.career_stats.bowling_average > 0 ? player.career_stats.bowling_average.toFixed(2) : '-'}</td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                      <td className="py-3 text-gray-500 dark:text-gray-400">Economy Rate</td>
                      <td className="py-3 text-rose-600 dark:text-rose-400 font-semibold text-right">{player.career_stats.economy > 0 ? player.career_stats.economy.toFixed(2) : '-'}</td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                      <td className="py-3 text-gray-500 dark:text-gray-400">Highest Score</td>
                      <td className="py-3 text-gray-900 dark:text-white font-semibold text-right">{player.career_stats.highest_score || 0}*</td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                      <td className="py-3 text-gray-500 dark:text-gray-400">Best Bowling</td>
                      <td className="py-3 text-gray-900 dark:text-white font-semibold text-right">{player.career_stats.best_bowling || '-'}</td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                      <td className="py-3 text-gray-500 dark:text-gray-400">Hundreds / Fifties</td>
                      <td className="py-3 text-gray-900 dark:text-white font-semibold text-right">{player.career_stats.hundreds || 0} / {player.career_stats.fifties || 0}</td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                      <td className="py-3 text-gray-500 dark:text-gray-400">Fours / Sixes</td>
                      <td className="py-3 text-gray-900 dark:text-white font-semibold text-right">{player.career_stats.fours || 0} / {player.career_stats.sixes || 0}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};