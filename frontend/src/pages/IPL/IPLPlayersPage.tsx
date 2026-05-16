// src/pages/IPL/IPLPlayersPage.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import { IPLPlayerCard } from './components/IPLPlayerCard';

interface IPLPlayer {
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
  teams_played: string[];
}

const IPL_TEAMS = [
  'Mumbai Indians', 'Chennai Super Kings', 'Kolkata Knight Riders', 
  'Royal Challengers Bangalore', 'Sunrisers Hyderabad', 'Delhi Capitals',
  'Rajasthan Royals', 'Punjab Kings', 'Gujarat Titans', 'Lucknow Super Giants',
  'Deccan Chargers', 'Pune Warriors', 'Rising Pune Supergiant'
];

const ROLES = ['Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper'];

export const IPLPlayersPage: React.FC = () => {
  const [players, setPlayers] = useState<IPLPlayer[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [sortBy, setSortBy] = useState('ipl_runs');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [searchDebounce, setSearchDebounce] = useState('');
  const { ref, inView } = useInView();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounce(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset when filters change
  useEffect(() => {
    setPage(1);
    setPlayers([]);
    setHasMore(true);
    fetchPlayers(1, true);
  }, [selectedTeam, selectedRole, sortBy, searchDebounce]);

  const fetchPlayers = async (pageNum: number, reset: boolean = false) => {
    try {
      if (reset) {
        setInitialLoading(true);
      } else {
        setLoading(true);
      }

      const response = await axios.get('http://localhost:3000/api/ipl/players', {
        params: {
          page: pageNum,
          limit: 24,
          search: searchDebounce || undefined,
          team: selectedTeam || undefined,
          role: selectedRole || undefined,
          sortBy
        }
      });

      const newPlayers = response.data.data;
      const total = response.data.total;

      setTotalPlayers(total);

      if (reset || pageNum === 1) {
        setPlayers(newPlayers);
      } else {
        setPlayers(prev => [...prev, ...newPlayers]);
      }

      const currentTotal = reset ? newPlayers.length : players.length + newPlayers.length;
      setHasMore(currentTotal < total);

    } catch (error) {
      console.error('Failed to fetch IPL players:', error);
      toast.error('Failed to load IPL players');
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    if (inView && hasMore && !loading && !initialLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPlayers(nextPage, false);
    }
  }, [inView, hasMore, loading, initialLoading]);

  const clearFilters = () => {
    setSearch('');
    setSearchDebounce('');
    setSelectedTeam('');
    setSelectedRole('');
    setSortBy('ipl_runs');
  };

  const hasActiveFilters = search || selectedTeam || selectedRole || sortBy !== 'ipl_runs';

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-[#f9fafb] dark:bg-[#0f172a] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-5 min-h-screen bg-[#f9fafb] dark:bg-[#0f172a] text-gray-900 dark:text-white p-4 md:p-6" style={{ backgroundImage: 'none' }}>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Filter Bar - Fancode Style */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search IPL player..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-5 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                showFilters || hasActiveFilters
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              <FiFilter size={18} />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  {[search, selectedTeam, selectedRole, sortBy !== 'ipl_runs'].filter(Boolean).length}
                </span>
              )}
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-5 py-3 rounded-xl font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
              >
                <FiX size={18} />
                <span>Clear</span>
              </button>
            )}
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      IPL Team
                    </label>
                    <select
                      value={selectedTeam}
                      onChange={(e) => setSelectedTeam(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Teams</option>
                      {IPL_TEAMS.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Player Role
                    </label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Roles</option>
                      {ROLES.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="ipl_runs">Most IPL Runs</option>
                      <option value="ipl_wickets">Most IPL Wickets</option>
                      <option value="ipl_batting_avg">Highest Batting Avg</option>
                      <option value="ipl_strike_rate">Best Strike Rate</option>
                      <option value="name">Name (A-Z)</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Players Grid */}
        {players.length === 0 && !initialLoading ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏏</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No IPL players found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
            <button
              onClick={clearFilters}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              <AnimatePresence mode="popLayout">
                {players.map((player, index) => (
                  <motion.div
                    key={`${player.id}-${index}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: Math.min(index * 0.02, 0.5) }}
                  >
                    <IPLPlayerCard player={player} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Load More Trigger */}
            {hasMore && (
              <div ref={ref} className="flex justify-center py-8">
                <div className="flex items-center gap-3 text-gray-500">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent" />
                  <span className="text-sm">Loading more IPL players...</span>
                </div>
              </div>
            )}

            {!hasMore && players.length > 0 && players.length === totalPlayers && (
              <div className="text-center py-6">
                <p className="text-sm text-gray-400">You've seen all {totalPlayers.toLocaleString()} IPL players! 🏏</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};