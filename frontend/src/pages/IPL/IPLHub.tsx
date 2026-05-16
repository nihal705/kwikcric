// src/pages/IPL/IPLHub.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { iplAPI, IPLTeam, IPLSeason } from '../../services/api/iplAPI';
import { AllTimeRecords } from '../Tournaments/components/AllTimeRecords';
import { IPLPlayersPage } from './IPLPlayersPage';
import { IPLCapWinners } from './components/IPLCapWinners';
import toast from 'react-hot-toast';

type TabType = 'rankings' | 'players' | 'history' | 'records' | 'matches' | 'capWinners';

export const IPLHub: React.FC = () => {
  const [seasons, setSeasons] = useState<IPLSeason[]>([]);
  const [teamRankings, setTeamRankings] = useState<IPLTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('rankings');
  const [error, setError] = useState<string | null>(null);
  const [capWinners, setCapWinners] = useState([]);
  const [capWinnersLoading, setCapWinnersLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [seasonsRes, rankingsRes] = await Promise.all([
        iplAPI.getAllSeasons(),
        iplAPI.getTeamRankings()
      ]);
      
      setSeasons(seasonsRes.data.data);
      setTeamRankings(rankingsRes.data.data);
    } catch (error) {
      console.error('Error fetching IPL data:', error);
      setError('Failed to load IPL data. Please check if backend is running.');
      toast.error('Failed to load IPL data');
    } finally {
      setLoading(false);
    }
  };

  const fetchCapWinners = async () => {
  try {
    const response = await iplAPI.getCapWinners();
    setCapWinners(response.data.data);
  } catch (error) {
    console.error('Error fetching cap winners:', error);
  } finally {
    setCapWinnersLoading(false);
  }
};

// Call in fetchData
useEffect(() => {
  fetchData();
  fetchCapWinners();
}, []);

  const tabs = [
    { id: 'rankings' as TabType, label: 'Team Rankings', icon: '' },
    { id: 'players' as TabType, label: 'Players', icon: '' },
    { id: 'records' as TabType, label: 'All-Time Records', icon: '' },
    { id: 'capWinners' as TabType, label: 'Cap Winners', icon: '' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold mb-2">{error}</h2>
        <p className="text-gray-500">Make sure backend is running on port 3000</p>
        <button 
          onClick={fetchData}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
        <div className="space-y-5 min-h-screen bg-[#f9fafb] dark:bg-[#0f172a] text-gray-900 dark:text-white p-4 md:p-6" style={{ backgroundImage: 'none' }}>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-700 to-purple-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-5xl mb-4">
            <img 
                src="/images/ipl.png"
                alt="IPL Trophy"
                className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 md:mb-4 object-contain"
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Indian Premier League
          </h1>
          <p className="text-sm text-blue-100 max-w-2xl mx-auto">
            Complete history of cricket's biggest T20 league - from 2008 to 2024
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab Selector */}
        <div className="flex flex-wrap justify-center gap-1 border-b border-gray-200 dark:border-gray-700 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-semibold transition-all flex items-center gap-1 ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'rankings' && (
            <motion.div
              key="rankings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <IPLTeamRankings rankings={teamRankings} />
            </motion.div>
          )}

          {activeTab === 'players' && (
            <motion.div
              key="players"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <IPLPlayersPage />
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <IPLHistory seasons={seasons} />
            </motion.div>
          )}

          {activeTab === 'records' && (
            <motion.div
              key="records"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AllTimeRecords tournamentType="ipl" />
            </motion.div>
          )}

          {activeTab === 'capWinners' && (
            <motion.div
                key="capWinners"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
            >
                <IPLCapWinners winners={capWinners} loading={capWinnersLoading} />
            </motion.div>
            )}

        </AnimatePresence>
      </div>
    </div>
  );
};

// IPL Team Rankings Component
const IPLTeamRankings: React.FC<{ rankings: IPLTeam[] }> = ({ rankings }) => {
  if (!rankings || rankings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        <p>No team rankings data available.</p>
      </div>
    );
  }

  const getMedalColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-500 to-yellow-600';
    if (rank === 2) return 'from-gray-400 to-gray-500';
    if (rank === 3) return 'from-amber-600 to-amber-700';
    return 'from-blue-500 to-blue-600';
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-center">Most Successful Teams</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rankings.map((team) => (
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`bg-gradient-to-r ${getMedalColor(team.rank || 0)} rounded-lg p-4 text-white cursor-pointer shadow hover:shadow-lg transition-all`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg mb-1 font-bold">#{team.rank}</div>
                  <h3 className="text-xl font-bold">{team.name}</h3>
                  <p className="text-xs text-white/80 mt-1">{team.city}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{team.titles_won}</div>
                  <div className="text-xs text-white/70">Titles</div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
                <div>
                  <div className="font-bold">{team.runner_up_count}</div>
                  <div className="text-white/70">Runner-up</div>
                </div>
                <div>
                  <div className="font-bold truncate">{team.home_ground?.split(',')[0] || 'N/A'}</div>
                  <div className="text-white/70">Home Ground</div>
                </div>
              </div>
            </motion.div>
        ))}
      </div>
    </div>
  );
};

// IPL History Component
const IPLHistory: React.FC<{ seasons: IPLSeason[] }> = ({ seasons }) => {
  if (!seasons || seasons.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        <p>No tournament history available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold text-center mb-4">All IPL Seasons</h2>
      <div className="grid grid-cols-1 gap-3">
        {seasons.map((season, index) => (
          <Link key={season.year} to={`/ipl/${season.year}`}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow hover:shadow-md transition-all border border-gray-200 dark:border-gray-700"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800 dark:text-white">{season.year}</div>
                    <div className="text-xs text-gray-500">Season</div>
                  </div>
                  <div className="hidden sm:block h-8 w-px bg-gray-300 dark:bg-gray-600" />
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: season.winner_color || '#004BA0' }}
                      />
                      <span className="font-semibold text-base">{season.winner_name || 'TBD'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>📍</span>
                      <span>{season.final_venue?.split(',')[0] || 'Venue TBD'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {season.runner_up_name && (
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Runner-up</div>
                      <div className="font-semibold text-sm">{season.runner_up_name}</div>
                    </div>
                  )}
                  <div className="text-blue-600 dark:text-blue-400">
                    <span className="text-xl">→</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};