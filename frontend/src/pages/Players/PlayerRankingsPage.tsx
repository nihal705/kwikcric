// src/pages/Players/PlayerRankingsPage.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { getPlayerImageUrl, getPlayerFallbackImage } from '../../utils/playerImage';

interface Ranking {
  rank: number;
  player_id?: number;
  player_name: string;
  runs?: number | string;
  wickets?: number | string;
  batting_average?: number | string;
  bowling_average?: number | string;
  strike_rate?: number | string;
  economy?: number | string;
  centuries?: number | string;
  fifties?: number | string;
  five_wickets?: number | string;
  rating?: number | string;
  allrounder_score?: number | string;
  goat_score?: number | string;
}

const toNumber = (value: any): number => {
  if (value === undefined || value === null) return 0;
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(num) ? 0 : num;
};

const formatNumber = (value: any, decimals: number = 2): string => {
  const num = toNumber(value);
  return num > 0 ? num.toFixed(decimals) : '-';
};

const formatLargeNumber = (value: any): string => {
  const num = toNumber(value);
  return num > 0 ? num.toLocaleString() : '-';
};

const PlayerRankingsPage: React.FC = () => {
  const [format, setFormat] = useState<'odi' | 'test' | 't20i' | 'overall'>('odi');
  const [category, setCategory] = useState<'batting' | 'bowling' | 'allrounder'>('batting');
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [limit, setLimit] = useState(50);

  useEffect(() => {
    fetchRankings();
  }, [format, category, limit]);

  const fetchRankings = async () => {
    setLoading(true);
    try {
      const url = `http://localhost:3000/api/rankings/${format}/${category}?limit=${limit}`;
      const response = await axios.get(url);
      let data = response.data.data || [];
      
      if (format === 'overall' && category === 'allrounder') {
        data = data.map((player: any) => ({
          ...player,
          runs: player.runs,
          wickets: player.wickets,
          batting_average: player.batting_average,
          bowling_average: player.bowling_average,
          centuries: player.centuries,
          five_wickets: player.five_wickets,
          goat_score: player.goat_score || player.rating
        }));
      }
      
      setRankings(data);
    } catch (error) {
      console.error('Error fetching rankings:', error);
      toast.error('Failed to load rankings');
    } finally {
      setLoading(false);
    }
  };

  const getMedalStyle = (rank: number) => {
    if (rank === 1) return { emoji: '🥇', textColor: 'text-yellow-500', bgColor: 'bg-yellow-500/20' };
    if (rank === 2) return { emoji: '🥈', textColor: 'text-gray-400', bgColor: 'bg-gray-400/20' };
    if (rank === 3) return { emoji: '🥉', textColor: 'text-amber-600', bgColor: 'bg-amber-600/20' };
    return { emoji: `#${rank}`, textColor: 'text-gray-700 dark:text-white', bgColor: 'bg-gray-200 dark:bg-gray-700' };
  };

  const filteredRankings = rankings.filter(r => 
    r.player_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatsList = [
  { id: 'odi', name: 'ODI', color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-500', subtitle: 'One Day International' },
  { id: 'test', name: 'TEST', color: 'from-red-500 to-red-600', bgColor: 'bg-red-500', subtitle: 'Test Cricket' },
  { id: 't20i', name: 'T20I', color: 'from-green-500 to-green-600', bgColor: 'bg-green-500', subtitle: 'Twenty20 International' },
  { id: 'overall', name: 'OVERALL', color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-500', subtitle: 'All Format GOAT' },
];

  const categoriesList = [
    { id: 'batting', name: ' Batting', color: 'bg-blue-500' },
    { id: 'bowling', name: ' Bowling', color: 'bg-red-500' },
    { id: 'allrounder', name: ' All-Rounders', color: 'bg-purple-500' },
  ];

  const getCurrentFormatColor = () => {
    const f = formatsList.find(f => f.id === format);
    return f?.bgColor || 'bg-blue-500';
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className={`relative bg-gradient-to-r ${formatsList.find(f => f.id === format)?.color || 'from-blue-600 to-purple-600'} py-12`}>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {format.toUpperCase()} {category === 'batting' ? ' Batting' : category === 'bowling' ? ' Bowling' : ' All-Rounder'} Rankings
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            All-time greatest {category === 'batting' ? 'batsmen' : category === 'bowling' ? 'bowlers' : 'all-rounders'} in {format.toUpperCase()} cricket
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Format Selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {formatsList.map((f) => (
  <button
    key={f.id}
    onClick={() => setFormat(f.id as any)}
    className={`px-6 py-2 rounded-lg font-bold transition-all transform flex flex-col items-center
      ${format === f.id 
        ? `${f.bgColor} text-white shadow-lg scale-105 ring-2 ring-white` 
        : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700'
      }`}
  >
    <span>{f.name}</span>
    <span className="text-[10px] opacity-70 mt-0.5">{f.subtitle}</span>
  </button>
))}
        </div>

        {/* Category Selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categoriesList.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id as any)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all
                ${category === c.id 
                  ? `${c.color} text-white shadow-lg scale-105` 
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700'
                }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* GOAT Methodology Note - Only for OVERALL format */}
        {format === 'overall' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl border border-blue-200 dark:border-blue-800"
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl"></div>
              <div className="flex-1">
                <h4 className="font-bold text-blue-800 dark:text-blue-300 text-lg flex items-center gap-2">
                  Greatest of All Time (GOAT) Rankings Methodology
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-full">International Only</span>
                </h4>
                
                {category === 'batting' && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                       <span className="font-semibold">GOAT Batsmen</span> are ranked using a weighted formula:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 text-xs">
                      <div className="bg-blue-100 dark:bg-blue-900/50 rounded p-1.5 text-center">
                        <span className="font-bold text-blue-700 dark:text-blue-300">35%</span>
                        <p className="text-gray-600 dark:text-gray-400">Batting Average</p>
                      </div>
                      <div className="bg-blue-100 dark:bg-blue-900/50 rounded p-1.5 text-center">
                        <span className="font-bold text-blue-700 dark:text-blue-300">20%</span>
                        <p className="text-gray-600 dark:text-gray-400">Total Runs</p>
                      </div>
                      <div className="bg-blue-100 dark:bg-blue-900/50 rounded p-1.5 text-center">
                        <span className="font-bold text-blue-700 dark:text-blue-300">15%</span>
                        <p className="text-gray-600 dark:text-gray-400">Centuries</p>
                      </div>
                      <div className="bg-blue-100 dark:bg-blue-900/50 rounded p-1.5 text-center">
                        <span className="font-bold text-blue-700 dark:text-blue-300">10%</span>
                        <p className="text-gray-600 dark:text-gray-400">Fifties</p>
                      </div>
                      <div className="bg-blue-100 dark:bg-blue-900/50 rounded p-1.5 text-center">
                        <span className="font-bold text-blue-700 dark:text-blue-300">10%</span>
                        <p className="text-gray-600 dark:text-gray-400">Formats Played</p>
                      </div>
                      <div className="bg-blue-100 dark:bg-blue-900/50 rounded p-1.5 text-center">
                        <span className="font-bold text-blue-700 dark:text-blue-300">10%</span>
                        <p className="text-gray-600 dark:text-gray-400">Peak ICC Rank</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                       Formula: (Average × 6) + (Runs/2000) + (Centuries × 2) + (Fifties × 0.5) + (Formats × 8) + Peak Bonus
                    </p>
                  </div>
                )}

                {category === 'bowling' && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                       <span className="font-semibold">GOAT Bowlers</span> are ranked using a weighted formula:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 text-xs">
                      <div className="bg-red-100 dark:bg-red-900/50 rounded p-1.5 text-center">
                        <span className="font-bold text-red-700 dark:text-red-300">35%</span>
                        <p className="text-gray-600 dark:text-gray-400">Bowling Average</p>
                      </div>
                      <div className="bg-red-100 dark:bg-red-900/50 rounded p-1.5 text-center">
                        <span className="font-bold text-red-700 dark:text-red-300">25%</span>
                        <p className="text-gray-600 dark:text-gray-400">Total Wickets</p>
                      </div>
                      <div className="bg-red-100 dark:bg-red-900/50 rounded p-1.5 text-center">
                        <span className="font-bold text-red-700 dark:text-red-300">20%</span>
                        <p className="text-gray-600 dark:text-gray-400">5-Wicket Hauls</p>
                      </div>
                      <div className="bg-red-100 dark:bg-red-900/50 rounded p-1.5 text-center">
                        <span className="font-bold text-red-700 dark:text-red-300">10%</span>
                        <p className="text-gray-600 dark:text-gray-400">Economy Rate</p>
                      </div>
                      <div className="bg-red-100 dark:bg-red-900/50 rounded p-1.5 text-center">
                        <span className="font-bold text-red-700 dark:text-red-300">5%</span>
                        <p className="text-gray-600 dark:text-gray-400">Formats Played</p>
                      </div>
                      <div className="bg-red-100 dark:bg-red-900/50 rounded p-1.5 text-center">
                        <span className="font-bold text-red-700 dark:text-red-300">5%</span>
                        <p className="text-gray-600 dark:text-gray-400">Peak ICC Rank</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Formula: (10000/Average) + (Wickets/5) + (5W × 15)
                    </p>
                  </div>
                )}

                {category === 'allrounder' && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                       <span className="font-semibold">GOAT All-Rounders</span> are ranked by averaging Batting and Bowling GOAT scores:
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                      <div className="bg-green-100 dark:bg-green-900/50 rounded p-1.5 text-center">
                        <span className="font-bold text-green-700 dark:text-green-300">Batting Score (50%)</span>
                        <p className="text-gray-600 dark:text-gray-400">Runs + Average + Centuries</p>
                      </div>
                      <div className="bg-red-100 dark:bg-red-900/50 rounded p-1.5 text-center">
                        <span className="font-bold text-red-700 dark:text-red-300">Bowling Score (50%)</span>
                        <p className="text-gray-600 dark:text-gray-400">Wickets + Average + 5W</p>
                      </div>
                    </div>
                    <div className="bg-purple-100 dark:bg-purple-900/50 rounded p-2 mt-2 text-center">
                      <span className="font-semibold text-purple-700 dark:text-purple-300">GOAT Score = (Batting GOAT Score + Bowling GOAT Score) / 2</span>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Minimum requirements: 2000 runs AND 50 wickets in international cricket</p>
                    </div>
                  </div>
                )}

                <div className="mt-3 pt-2 border-t border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-3 flex-wrap">
                    <span>• Only Test + ODI + T20I careers considered</span>
                    <span>• Peak ICC rankings from official ICC ratings</span>
                    <span>• Domestic leagues (IPL, BBL, etc.) are NOT included</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Search and Filter */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="🔍 Search player..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={20}>Top 20</option>
            <option value={50}>Top 50</option>
            <option value={100}>Top 100</option>
          </select>
        </div>

        {/* Rankings Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className={`${getCurrentFormatColor()} text-white`}>
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold">#</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Player</th>
                    
                    {category === 'batting' && (
                      <>
                        <th className="px-6 py-4 text-right text-sm font-bold">Runs</th>
                        <th className="px-6 py-4 text-right text-sm font-bold">Avg</th>
                        {format !== 'overall' && (
                          <th className="px-6 py-4 text-right text-sm font-bold">SR</th>
                        )}
                        <th className="px-6 py-4 text-right text-sm font-bold">100s</th>
                        <th className="px-6 py-4 text-right text-sm font-bold">50s</th>
                        {format === 'overall' && (
                          <th className="px-6 py-4 text-right text-sm font-bold"> GOAT Score</th>
                        )}
                      </>
                    )}
                    
                    {category === 'bowling' && (
                      <>
                        <th className="px-6 py-4 text-right text-sm font-bold">Wickets</th>
                        <th className="px-6 py-4 text-right text-sm font-bold">Avg</th>
                        {format !== 'overall' && (
                          <th className="px-6 py-4 text-right text-sm font-bold">Economy</th>
                        )}
                        <th className="px-6 py-4 text-right text-sm font-bold">5W</th>
                        {format === 'overall' && (
                          <th className="px-6 py-4 text-right text-sm font-bold"> GOAT Score</th>
                        )}
                      </>
                    )}
                    
                    {category === 'allrounder' && (
                      <>
                        <th className="px-6 py-4 text-right text-sm font-bold">Runs</th>
                        <th className="px-6 py-4 text-right text-sm font-bold">Avg</th>
                        <th className="px-6 py-4 text-right text-sm font-bold">Wickets</th>
                        <th className="px-6 py-4 text-right text-sm font-bold">Bowl Avg</th>
                        <th className="px-6 py-4 text-right text-sm font-bold">100s</th>
                        <th className="px-6 py-4 text-right text-sm font-bold">5W</th>
                        <th className="px-6 py-4 text-right text-sm font-bold"> GOAT Score</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <AnimatePresence>
                    {filteredRankings.slice(0, limit).map((player, idx) => {
                      const medal = getMedalStyle(player.rank);
                      return (
                        <motion.tr
                          key={player.player_id || idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.02 }}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                          onClick={() => player.player_id && (window.location.href = `/player/${player.player_id}`)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`w-10 h-10 rounded-full ${medal.bgColor} flex items-center justify-center font-bold ${medal.textColor}`}>
                              {medal.emoji}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <img 
                                src={getPlayerImageUrl(player.player_name)}
                                alt={player.player_name}
                                className="w-10 h-10 rounded-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = getPlayerFallbackImage(player.player_name);
                                }}
                              />
                              <span className="font-semibold text-gray-900 dark:text-white">{player.player_name}</span>
                            </div>
                          </td>
                          
                          {category === 'batting' && (
                            <>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900 dark:text-white font-bold">
                                {formatLargeNumber(player.runs)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-gray-600 dark:text-gray-300">
                                {formatNumber(player.batting_average)}
                              </td>
                              {format !== 'overall' && (
                                <td className="px-6 py-4 whitespace-nowrap text-right text-gray-600 dark:text-gray-300">
                                  {formatNumber(player.strike_rate)}
                                </td>
                              )}
                              <td className="px-6 py-4 whitespace-nowrap text-right text-yellow-600 dark:text-yellow-500 font-bold">
                                {formatNumber(player.centuries, 0)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-blue-600 dark:text-blue-400 font-bold">
                                {formatNumber(player.fifties, 0)}
                              </td>
                              {format === 'overall' && (
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                  <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full font-bold text-sm">
                                    {formatNumber(player.goat_score || player.rating, 0)}
                                  </span>
                                </td>
                              )}
                            </>
                          )}
                          
                          {category === 'bowling' && (
                            <>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900 dark:text-white font-bold">
                                {formatNumber(player.wickets, 0)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-gray-600 dark:text-gray-300">
                                {formatNumber(player.bowling_average)}
                              </td>
                              {format !== 'overall' && (
                                <td className="px-6 py-4 whitespace-nowrap text-right text-gray-600 dark:text-gray-300">
                                  {formatNumber(player.economy)}
                                </td>
                              )}
                              <td className="px-6 py-4 whitespace-nowrap text-right text-purple-600 dark:text-purple-400 font-bold">
                                {formatNumber(player.five_wickets, 0)}
                              </td>
                              {format === 'overall' && (
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                  <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full font-bold text-sm">
                                    {formatNumber(player.goat_score || player.rating, 0)}
                                  </span>
                                </td>
                              )}
                            </>
                          )}
                          
                          {category === 'allrounder' && (
                            <>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-green-600 dark:text-green-500 font-bold">
                                {formatLargeNumber(player.runs)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-gray-600 dark:text-gray-300">
                                {formatNumber(player.batting_average)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-blue-600 dark:text-blue-400 font-bold">
                                {formatNumber(player.wickets, 0)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-gray-600 dark:text-gray-300">
                                {formatNumber(player.bowling_average)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-yellow-600 dark:text-yellow-500 font-bold">
                                {formatNumber(player.centuries, 0)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-purple-600 dark:text-purple-400 font-bold">
                                {formatNumber(player.five_wickets, 0)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right">
                                <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full font-bold text-sm">
                                  {formatNumber(player.goat_score || player.rating, 0)}
                                </span>
                              </td>
                            </>
                          )}
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Methodology Section */}
        {/* <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            How Rankings Are Calculated
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3">
              <div className="font-bold text-blue-600 dark:text-blue-400 mb-2"> Batting Rankings</div>
              <ul className="text-gray-700 dark:text-gray-300 space-y-1 text-xs">
                <li>• Ranked by Total Runs scored (ODI/Test/T20I)</li>
                <li>• GOAT formula: (Average × 6) + (Runs/2000) + (100s × 2) + (50s × 0.5)</li>
                <li>• Centuries and Fifties shown as achievements</li>
                <li>• Minimum 2000 runs across all formats</li>
              </ul>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3">
              <div className="font-bold text-red-600 dark:text-red-400 mb-2">Bowling Rankings</div>
              <ul className="text-gray-700 dark:text-gray-300 space-y-1 text-xs">
                <li>• Ranked by Bowling Average (lower is better)</li>
                <li>• GOAT formula: (10000/Avg) + (Wickets/5) + (5W × 15)</li>
                <li>• 5-wicket hauls shown as achievements</li>
                <li>• Minimum 200 wickets across all formats</li>
              </ul>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3">
              <div className="font-bold text-purple-600 dark:text-purple-400 mb-2">All-Rounder Rankings</div>
              <ul className="text-gray-700 dark:text-gray-300 space-y-1 text-xs">
                <li>• GOAT Score = (Batting GOAT + Bowling GOAT) / 2</li>
                <li>• Minimum 2000 runs AND 50 wickets required</li>
                <li>• Only players who excelled in both disciplines</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 text-center text-gray-500 dark:text-gray-500 text-xs">
            Data sourced from official cricket archives | Rankings are all-time and updated in real-time | Domestic leagues excluded
          </div>
        </div> */}
        <div className="mt-4 text-center text-gray-500 dark:text-gray-500 text-xs">
  <span className="block mt-1 text-yellow-600 dark:text-yellow-500">
    Note: Some stats may not reflect the most recent matches. Updates are in progress.
  </span>
</div>
      </div>
    </div>
  );
};

export default PlayerRankingsPage;