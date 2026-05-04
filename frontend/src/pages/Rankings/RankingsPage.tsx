import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiSearch } from 'react-icons/fi';
import { rankingsAPI } from '../../services/api/rankingsAPI';
import toast from 'react-hot-toast';

interface RankingPlayer {
  rank: number;
  player_id: number;
  player_name: string;
  runs?: number;
  wickets?: number;
  batting_average?: number;
  bowling_average?: number;
  centuries?: number;
  fifties?: number;
  five_wickets?: number;
  rating: number;
}

type FormatType = 'odi' | 'test' | 't20i' | 'ipl' | 'overall';
type CategoryType = 'batting' | 'bowling' | 'allrounder';

export const RankingsPage: React.FC = () => {
  const [format, setFormat] = useState<FormatType>('odi');
  const [category, setCategory] = useState<CategoryType>('batting');
  const [rankings, setRankings] = useState<RankingPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [limit, setLimit] = useState(50);

  const formats: { value: FormatType; label: string; icon: string }[] = [
    { value: 'odi', label: 'ODI', icon: '🏏' },
    { value: 'test', label: 'Test', icon: '📋' },
    { value: 't20i', label: 'T20I', icon: '⚡' },
    { value: 'ipl', label: 'IPL', icon: '🌟' },
    { value: 'overall', label: 'All Format', icon: '🏆' },
  ];

  const categories: { value: CategoryType; label: string; icon: string }[] = [
    { value: 'batting', label: 'Batsmen', icon: '🏏' },
    { value: 'bowling', label: 'Bowlers', icon: '🎯' },
    { value: 'allrounder', label: 'All-Rounders', icon: '⭐' },
  ];

  useEffect(() => {
    fetchRankings();
  }, [format, category, limit]);

  const fetchRankings = async () => {
    setLoading(true);
    try {
      let response;
      switch (format) {
        case 'odi':
          if (category === 'batting') response = await rankingsAPI.getODIBatting(limit);
          else if (category === 'bowling') response = await rankingsAPI.getODIBowling(limit);
          else response = await rankingsAPI.getODIAllrounder(limit);
          break;
        case 'test':
          if (category === 'batting') response = await rankingsAPI.getTestBatting(limit);
          else response = await rankingsAPI.getTestBowling(limit);
          break;
        case 't20i':
          if (category === 'batting') response = await rankingsAPI.getT20IBatting(limit);
          else response = await rankingsAPI.getT20IBowling(limit);
          break;
        case 'ipl':
          if (category === 'batting') response = await rankingsAPI.getIPLBatting(limit);
          else response = await rankingsAPI.getIPLBowling(limit);
          break;
        case 'overall':
          if (category === 'batting') response = await rankingsAPI.getOverallBatsmen(limit);
          else if (category === 'bowling') response = await rankingsAPI.getOverallBowlers(limit);
          else response = await rankingsAPI.getOverallAllrounders(limit);
          break;
      }
      setRankings(response?.data || []);
    } catch (error) {
      console.error('Failed to fetch rankings:', error);
      toast.error('Failed to load rankings');
    } finally {
      setLoading(false);
    }
  };

  const filteredRankings = rankings.filter(player =>
    player.player_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Player Rankings
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Based on historical performance data across all formats
          </p>
        </div>

        {/* Format Selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {formats.map((f) => (
            <button
              key={f.value}
              onClick={() => setFormat(f.value)}
              className={`px-5 py-2 rounded-full font-semibold transition-all flex items-center gap-2 ${
                format === f.value
                  ? 'bg-green-600 text-white shadow-lg scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm'
              }`}
            >
              <span>{f.icon}</span>
              <span>{f.label}</span>
            </button>
          ))}
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                category === cat.value
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full md:w-80">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search player..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-400" />
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
            >
              <option value={25}>Top 25</option>
              <option value={50}>Top 50</option>
              <option value={100}>Top 100</option>
              <option value={200}>Top 200</option>
            </select>
          </div>
        </div>

        {/* Rankings Table */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Rank</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Player</th>
                    {category === 'batting' && (
                      <>
                        <th className="px-6 py-4 text-right text-sm font-semibold">Runs</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold">Avg</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold">100s</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold">50s</th>
                      </>
                    )}
                    {category === 'bowling' && (
                      <>
                        <th className="px-6 py-4 text-right text-sm font-semibold">Wickets</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold">Avg</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold">5w</th>
                      </>
                    )}
                    {category === 'allrounder' && (
                      <>
                        <th className="px-6 py-4 text-right text-sm font-semibold">Runs</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold">Wickets</th>
                      </>
                    )}
                    <th className="px-6 py-4 text-right text-sm font-semibold">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredRankings.map((player, index) => (
                      <motion.tr
                        key={player.player_id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                        onClick={() => window.location.href = `/player/${player.player_id}`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{getMedalIcon(player.rank)}</span>
                          </div>
                         </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-full flex items-center justify-center text-sm">
                              🏏
                            </div>
                            <span className="font-semibold">{player.player_name}</span>
                          </div>
                         </td>
                        {category === 'batting' && (
                          <>
                            <td className="px-6 py-4 text-right font-semibold">{player.runs?.toLocaleString() || '-'}</td>
                            <td className="px-6 py-4 text-right">{player.batting_average?.toFixed(2) || '-'}</td>
                            <td className="px-6 py-4 text-right text-yellow-600 font-semibold">{player.centuries || 0}</td>
                            <td className="px-6 py-4 text-right">{player.fifties || 0}</td>
                          </>
                        )}
                        {category === 'bowling' && (
                          <>
                            <td className="px-6 py-4 text-right font-semibold text-blue-600">{player.wickets || 0}</td>
                            <td className="px-6 py-4 text-right">{player.bowling_average?.toFixed(2) || '-'}</td>
                            <td className="px-6 py-4 text-right text-purple-600 font-semibold">{player.five_wickets || 0}</td>
                          </>
                        )}
                        {category === 'allrounder' && (
                          <>
                            <td className="px-6 py-4 text-right font-semibold text-green-600">{player.runs?.toLocaleString() || '-'}</td>
                            <td className="px-6 py-4 text-right font-semibold text-blue-600">{player.wickets || 0}</td>
                          </>
                        )}
                        <td className="px-6 py-4 text-right">
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm font-semibold">
                            {player.rating?.toFixed(1) || '-'}
                          </span>
                         </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {filteredRankings.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No players found</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Info Footer */}
        <div className="mt-8 text-center text-xs text-gray-400">
          Rankings are calculated based on runs, average, strike rate, centuries, and consistency across formats
        </div>
      </div>
    </div>
  );
};