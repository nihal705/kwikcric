import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiMapPin, FiUsers, FiBarChart2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface IPLData {
  winner: string;
  runnerUp: string;
  orangeCap: { player: string; runs: number };
  purpleCap: { player: string; wickets: number };
  playerOfTournament: string;
  final: string;
  venue?: string;
  totalMatches?: number;
  teams?: string[];
}

export const IPLPage: React.FC = () => {
  const [year, setYear] = useState(2024);
  const [data, setData] = useState<IPLData | null>(null);
  const [loading, setLoading] = useState(true);

  const years = Array.from({ length: 2024 - 2008 + 1 }, (_, i) => 2008 + i).reverse();

  useEffect(() => {
    const fetchIPL = async () => {
      setLoading(true);
      try {
        // Mock data - replace with actual API call
        const mockData: IPLData = {
          winner: year === 2024 ? 'Kolkata Knight Riders' : year === 2023 ? 'Chennai Super Kings' : 'Mumbai Indians',
          runnerUp: year === 2024 ? 'Sunrisers Hyderabad' : year === 2023 ? 'Gujarat Titans' : 'Delhi Capitals',
          orangeCap: { player: 'Virat Kohli', runs: 741 },
          purpleCap: { player: 'Harshal Patel', wickets: 32 },
          playerOfTournament: 'Sunil Narine',
          final: 'KKR vs SRH',
          venue: 'Ahmedabad',
          totalMatches: 74,
          teams: ['CSK', 'MI', 'RCB', 'KKR', 'SRH', 'DC', 'RR', 'PBKS', 'GT', 'LSG'],
        };
        setData(mockData);
      } catch (error) {
        console.error('Failed to fetch IPL data:', error);
        toast.error('Failed to load IPL data');
      } finally {
        setLoading(false);
      }
    };
    fetchIPL();
  }, [year]);

  const getWinnerColor = (winner: string) => {
    const colors: Record<string, string> = {
      'Mumbai Indians': 'from-blue-600 to-blue-800',
      'Chennai Super Kings': 'from-yellow-600 to-yellow-800',
      'Kolkata Knight Riders': 'from-purple-600 to-purple-800',
      'Sunrisers Hyderabad': 'from-orange-600 to-orange-800',
      'Rajasthan Royals': 'from-pink-600 to-pink-800',
      'Gujarat Titans': 'from-cyan-600 to-cyan-800',
      'Lucknow Super Giants': 'from-indigo-600 to-indigo-800',
    };
    return colors[winner] || 'from-primary-600 to-primary-800';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">Indian Premier League</h1>
        <p className="text-gray-500">Complete history and statistics of IPL</p>
      </div>

      {/* Year Selector */}
      <div className="flex flex-wrap justify-center gap-2">
        {years.map(y => (
          <button
            key={y}
            onClick={() => setYear(y)}
            className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
              year === y
                ? 'bg-primary-600 text-white shadow-lg scale-105'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900/30'
            }`}
          >
            {y}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center py-20"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
          </motion.div>
        ) : data ? (
          <motion.div
            key={year}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Champion Card */}
            <div className={`bg-gradient-to-r ${getWinnerColor(data.winner)} rounded-2xl p-8 text-white text-center shadow-xl`}>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4">
                <span className="text-4xl">🏆</span>
              </div>
              <h2 className="text-3xl font-bold mb-2">{data.winner}</h2>
              <p className="text-white/80">IPL {year} Champions</p>
              <p className="text-sm mt-2">Defeated {data.runnerUp} in the final</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card p-6 text-center">
                <span className="text-4xl block mb-3">🟠</span>
                <h3 className="font-semibold text-gray-500 mb-1">Orange Cap</h3>
                <p className="text-xl font-bold">{data.orangeCap?.player || 'N/A'}</p>
                <p className="text-sm text-gray-500">{data.orangeCap?.runs || 0} runs</p>
              </div>
              <div className="card p-6 text-center">
                <span className="text-4xl block mb-3">🟣</span>
                <h3 className="font-semibold text-gray-500 mb-1">Purple Cap</h3>
                <p className="text-xl font-bold">{data.purpleCap?.player || 'N/A'}</p>
                <p className="text-sm text-gray-500">{data.purpleCap?.wickets || 0} wickets</p>
              </div>
              <div className="card p-6 text-center">
                <span className="text-4xl block mb-3">⭐</span>
                <h3 className="font-semibold text-gray-500 mb-1">Player of the Tournament</h3>
                <p className="text-xl font-bold">{data.playerOfTournament || 'N/A'}</p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="card p-6">
              <h3 className="text-xl font-bold mb-4">Tournament Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <FiCalendar className="text-primary-500" />
                  <span>Final: {data.final}</span>
                </div>
                {data.venue && (
                  <div className="flex items-center space-x-3">
                    <FiMapPin className="text-primary-500" />
                    <span>Venue: {data.venue}</span>
                  </div>
                )}
                {data.totalMatches && (
                  <div className="flex items-center space-x-3">
                    <FiBarChart2 className="text-primary-500" />
                    <span>Total Matches: {data.totalMatches}</span>
                  </div>
                )}
                {data.teams && (
                  <div className="flex items-center space-x-3">
                    <FiUsers className="text-primary-500" />
                    <span>Teams: {data.teams.join(', ')}</span>
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