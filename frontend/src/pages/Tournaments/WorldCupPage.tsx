import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiAward, FiCalendar } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface WorldCupData {
  winner: string;
  runnerUp: string;
  host: string;
  playerOfTournament: string;
  mostRuns: { player: string; runs: number };
  mostWickets: { player: string; wickets: number };
  format: string;
  totalMatches?: number;
  teams?: number;
}

export const WorldCupPage: React.FC = () => {
  const [year, setYear] = useState(2023);
  const [data, setData] = useState<WorldCupData | null>(null);
  const [loading, setLoading] = useState(true);

  const years = [2023, 2019, 2015, 2011, 2007, 2003, 1999, 1996, 1992, 1987, 1983, 1979, 1975];

  useEffect(() => {
    const fetchWorldCup = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/tournaments/world-cup/${year}`);
        setData(response.data.data);
      } catch (error) {
        console.error('Failed to fetch World Cup data:', error);
        toast.error('Failed to load World Cup data');
      } finally {
        setLoading(false);
      }
    };
    fetchWorldCup();
  }, [year]);

  return (
    <div className="space-y-5">
      {/* Header - Compact */}
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-1">ICC Cricket World Cup</h1>
        <p className="text-xs text-gray-500">Complete history of cricket's biggest tournament</p>
      </div>

      {/* Year Selector - Compact Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-13 gap-1.5">
        {years.map(y => (
          <button
            key={y}
            onClick={() => setYear(y)}
            className={`px-2 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              year === y
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {y}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent" />
          </div>
        ) : data ? (
          <motion.div
            key={year}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Winner Card - Compact */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-xl p-5 text-white text-center">
              <span className="text-3xl">🏆</span>
              <h2 className="text-xl font-bold mb-1">{data.winner}</h2>
              <p className="text-white/80 text-sm">World Cup {year} Champions</p>
              <p className="text-xs mt-2 text-white/70">
                Defeated {data.runnerUp} in the final • Hosted by {data.host}
              </p>
            </div>

            {/* Stats Grid - Compact 3 cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                <FiMapPin className="w-5 h-5 text-red-500 mx-auto mb-2" />
                <h3 className="text-xs font-semibold text-gray-500 mb-0.5">Host Country</h3>
                <p className="text-sm font-bold">{data.host}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                <FiAward className="w-5 h-5 text-green-500 mx-auto mb-2" />
                <h3 className="text-xs font-semibold text-gray-500 mb-0.5">Most Runs</h3>
                <p className="text-sm font-bold">{data.mostRuns?.player || 'N/A'}</p>
                <p className="text-xs text-gray-500">{data.mostRuns?.runs || 0} runs</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                <FiAward className="w-5 h-5 text-purple-500 mx-auto mb-2" />
                <h3 className="text-xs font-semibold text-gray-500 mb-0.5">Most Wickets</h3>
                <p className="text-sm font-bold">{data.mostWickets?.player || 'N/A'}</p>
                <p className="text-xs text-gray-500">{data.mostWickets?.wickets || 0} wickets</p>
              </div>
            </div>

            {/* Tournament Info - Compact */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-bold mb-2">Tournament Info</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <FiCalendar className="text-green-500 w-4 h-4" />
                  <span className="text-xs">Format: {data.format}</span>
                </div>
                {data.totalMatches && (
                  <div className="flex items-center gap-2">
                    <span className="text-base">🏆</span>
                    <span className="text-xs">Total Matches: {data.totalMatches}</span>
                  </div>
                )}
                {data.teams && (
                  <div className="flex items-center gap-2">
                    <FiAward className="text-green-500 w-4 h-4" />
                    <span className="text-xs">Teams: {data.teams}</span>
                  </div>
                )}
                {data.playerOfTournament && (
                  <div className="flex items-center gap-2">
                    <FiAward className="text-green-500 w-4 h-4" />
                    <span className="text-xs">Player of Tournament: {data.playerOfTournament}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};