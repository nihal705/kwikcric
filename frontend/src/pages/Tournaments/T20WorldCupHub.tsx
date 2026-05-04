import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { worldCupAPI, Tournament, TeamRanking } from '../../services/api/worldCupAPI';
import { AllTimeRecords } from './components/AllTimeRecords';
import { GreatestMatches } from './components/GreatestMatches';

type TabType = 'rankings' | 'history' | 'records' | 'matches';

export const T20WorldCupHub: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [teamRankings, setTeamRankings] = useState<TeamRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('rankings');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tournamentsRes, rankingsRes] = await Promise.all([
        worldCupAPI.getAllTournaments('t20'),
        worldCupAPI.getTeamRankings('t20')
      ]);
      
      setTournaments(tournamentsRes.data || []);
      setTeamRankings(rankingsRes.data || []);
    } catch (error) {
      console.error('Error fetching T20 World Cup data:', error);
      setError('Failed to load data. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'rankings' as TabType, label: 'Team Rankings' },
    { id: 'history' as TabType, label: 'Tournament History' },
    { id: 'records' as TabType, label: 'All-Time Records' },
    { id: 'matches' as TabType, label: 'Greatest Matches' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent" />
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
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-gradient-to-r from-purple-700 to-pink-700 py-5 md:py-7">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Link to="/world-cup/t20" className="inline-flex items-center text-white/80 hover:text-white text-xs mb-2 md:mb-3">
        ← Back to T20 World Cup
      </Link>
    </div>
  </div>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-700 to-pink-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-4xl mb-2">⚡</div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            ICC T20I World Cup
          </h1>
          <p className="text-sm text-purple-100 max-w-2xl mx-auto">
            Complete history of cricket's fastest tournament - from 2007 to 2024
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
              className={`px-4 py-2 text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              {tab.label}
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
              <T20TeamRankings rankings={teamRankings} />
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <T20History tournaments={tournaments} />
            </motion.div>
          )}

          {activeTab === 'records' && (
  <motion.div
    key="records"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
  >
    <AllTimeRecords tournamentType="t20" />
  </motion.div>
)}

          {activeTab === 'matches' && (
  <motion.div
    key="matches"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
  >
    <GreatestMatches tournamentType="t20" />
  </motion.div>
)}
        </AnimatePresence>

      </div>
    </div>
  );
};

// Team Rankings Component for T20
const T20TeamRankings: React.FC<{ rankings: TeamRanking[] }> = ({ rankings }) => {
  if (!rankings || rankings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        <p>No team rankings data available.</p>
      </div>
    );
  }

  const getMedalColor = (rank: number) => {
    if (rank === 1) return 'from-purple-500 to-pink-500';
    if (rank === 2) return 'from-gray-400 to-gray-500';
    if (rank === 3) return 'from-amber-600 to-amber-700';
    return 'from-blue-500 to-blue-600';
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-center">Most Successful Teams</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rankings.map((team) => (
          <Link key={team.team_name} to={`/world-cup/t20/team/${encodeURIComponent(team.team_name)}`}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`bg-gradient-to-r ${getMedalColor(team.rank)} rounded-lg p-4 text-white cursor-pointer shadow hover:shadow-lg transition-all`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg mb-1 font-bold">#{team.rank}</div>
                  <h3 className="text-xl font-bold">{team.team_name}</h3>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{team.titles_won}</div>
                  <div className="text-xs text-white/70">Titles</div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <div className="font-bold">{team.runner_up_count}</div>
                  <div className="text-white/70">Runner-up</div>
                </div>
                <div>
                  <div className="font-bold">{team.semi_final_count || 0}</div>
                  <div className="text-white/70">Semi-finals</div>
                </div>
                <div>
                  <div className="font-bold">{team.win_percentage || 0}%</div>
                  <div className="text-white/70">Win %</div>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Tournament History Component for T20
const T20History: React.FC<{ tournaments: Tournament[] }> = ({ tournaments }) => {
  if (!tournaments || tournaments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        <p>No tournament history available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold text-center mb-4">All T20 World Cup Editions</h2>
      <div className="grid grid-cols-1 gap-3">
        {tournaments.map((tournament, index) => (
          <Link key={tournament.year} to={`/world-cup/t20/${tournament.year}`}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow hover:shadow-md transition-all border border-gray-200 dark:border-gray-700"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800 dark:text-white">{tournament.year}</div>
                    <div className="text-xs text-gray-500">Edition</div>
                  </div>
                  <div className="hidden sm:block h-8 w-px bg-gray-300 dark:bg-gray-600" />
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-base">{tournament.winner_name || 'TBD'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>📍</span>
                      <span>{tournament.host_country}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {tournament.runner_up_name && (
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Runner-up</div>
                      <div className="font-semibold text-sm">{tournament.runner_up_name}</div>
                    </div>
                  )}
                  <div className="text-purple-600 dark:text-purple-400">
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