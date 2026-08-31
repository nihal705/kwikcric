import React, { useState, useEffect} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { PlayerCard } from './PlayerCard';
import { apiClient } from '../../services/api/client';

interface Player {
  id: number;
  name: string;
  full_name: string;
  country: string;
  role: string;
  runs: number;
  wickets: number;
  image_url?: string | null;
}

const COUNTRIES = [
  'India', 'Australia', 'England', 'South Africa', 'New Zealand', 
  'Pakistan', 'Sri Lanka', 'West Indies', 'Bangladesh', 'Afghanistan',
  'Zimbabwe', 'Ireland', 'Scotland', 'Netherlands', 'Namibia'
];

const ROLES = ['Batsman', 'Bowler', 'All-rounder'];

export const PlayersPage: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [sortBy, setSortBy] = useState('runs');
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

  // Reset everything when filters/search change
  useEffect(() => {
    setPage(1);
    setPlayers([]);
    setHasMore(true);
    fetchPlayers(1, true);
  }, [selectedCountry, selectedRole, sortBy, searchDebounce]);

  const fetchPlayers = async (pageNum: number, reset: boolean = false) => {
    try {
      if (reset) {
        setInitialLoading(true);
      } else {
        setLoading(true);
      }
      
      const response = await apiClient.get('/players', {
        params: { 
          page: pageNum, 
          limit: 24,
          search: searchDebounce || undefined,
          country: selectedCountry || undefined,
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
      
      // Check if there are more players to load
      const currentTotal = reset ? newPlayers.length : players.length + newPlayers.length;
      setHasMore(currentTotal < total);
      
    } catch (error) {
      console.error('Failed to fetch players:', error);
      toast.error('Failed to load players');
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  // Load more when scrolling
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
    setSelectedCountry('');
    setSelectedRole('');
    setSortBy('runs');
  };

  const hasActiveFilters = search || selectedCountry || selectedRole || sortBy !== 'runs';

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div 
  className="min-h-screen bg-[#f9fafb] dark:bg-[#0f172a] text-gray-900 dark:text-white" 
  style={{ backgroundImage: 'none' }}
>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Cricket Players
          </h1>
          <p className="text-lg text-white/80 max-w-2xl">
            Explore complete profiles cricket players with verified statistics
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by player name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 transition-all"
                />
              </div>
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-5 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                showFilters || hasActiveFilters
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              <FiFilter size={18} />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  {[search, selectedCountry, selectedRole, sortBy !== 'runs'].filter(Boolean).length}
                </span>
              )}
            </button>
            
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-5 py-3 rounded-xl font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 transition-all flex items-center gap-2"
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
                      Country
                    </label>
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">All Countries</option>
                      {COUNTRIES.map(c => (
                        <option key={c} value={c}>{c}</option>
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
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
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
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                    >
                      <option value="runs">Most Runs</option>
                      <option value="wickets">Most Wickets</option>
                      <option value="name">Name (A-Z)</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing <span className="font-semibold text-gray-900 dark:text-white">{players.length}</span> 
          </p>
          {loading && (
            <div className="flex items-center gap-2 text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-500 border-t-transparent" />
              <span className="text-sm">Loading...</span>
            </div>
          )}
        </div>

        {/* Players Grid */}
        {players.length === 0 && !initialLoading ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No players found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
            <button
              onClick={clearFilters}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {players.map((player, index) => (
                  <motion.div
                    key={`${player.id}-${index}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: Math.min(index * 0.02, 0.5) }}
                  >
                    <PlayerCard player={player} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {/* Load More Trigger */}
            {hasMore && (
              <div ref={ref} className="flex justify-center py-8">
                <div className="flex items-center gap-3 text-gray-500">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-green-500 border-t-transparent" />
                  <span className="text-sm">Loading more players...</span>
                </div>
              </div>
            )}
            
            {!hasMore && players.length > 0 && players.length === totalPlayers && (
              <div className="text-center py-8">
                <p className="text-sm text-gray-400">You've seen all {totalPlayers.toLocaleString()} players! 🏏</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};