// frontend/src/pages/Tournaments/ChampionsTrophyHub.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { worldCupAPI, Tournament, TeamRanking } from '../../services/api/worldCupAPI';
import { AllTimeRecords } from './components/AllTimeRecords';
import { GreatestMatches } from './components/GreatestMatches';

type TabType = 'rankings' | 'history' | 'records' | 'matches';

export const ChampionsTrophyHub: React.FC = () => {
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
        worldCupAPI.getAllTournaments('champions'),
        worldCupAPI.getTeamRankings('champions')
      ]);
      
      setTournaments(tournamentsRes.data || []);
      setTeamRankings(rankingsRes.data || []);
    } catch (error) {
      console.error('Error fetching Champions Trophy data:', error);
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
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-4xl mb-3">⚠️</div>
        <h2 className="text-lg font-bold mb-2">{error}</h2>
        <p className="text-xs text-gray-500">Make sure backend is running on port 3000</p>
        <button 
          onClick={fetchData}
          className="mt-3 px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-[#f9fafb] dark:bg-[#0f172a] text-gray-900 dark:text-white" 
      style={{ backgroundImage: 'none' }}
    >
        <div className="bg-gradient-to-r from-blue-700 to-cyan-700 py-5 md:py-7">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/tournaments/hub" className="inline-flex items-center text-white/80 hover:text-white text-xs mb-2 md:mb-3">
              ← Back to Tournament Hub
            </Link>
          </div>
        </div>
     {/* Hero Section - Compact */}
      <div className="relative bg-gradient-to-r from-blue-700 to-cyan-700 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-3xl mb-1">
            <img 
                src="/images/icc_ct.png"
                alt="ICC Champions Trophy"
                className="w-26 h-20 md:w-20 md:h-20 mx-auto mb-3 md:mb-4 object-contain"
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
            ICC Champions Trophy
          </h1>
          <p className="text-xs text-blue-100 max-w-2xl mx-auto">
            Complete history of cricket's 'Mini World Cup' - from 1998 to 2025
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Tab Selector - Compact */}
        <div className="flex flex-wrap justify-center gap-0.5 border-b border-gray-200 dark:border-gray-700 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
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
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <CTTeamRankings rankings={teamRankings} />
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <CTHistory tournaments={tournaments} />
            </motion.div>
          )}

          {activeTab === 'records' && (
            <motion.div
              key="records"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <AllTimeRecords tournamentType="champions" />
            </motion.div>
          )}

          {activeTab === 'matches' && (
            <motion.div
              key="matches"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <GreatestMatches tournamentType="champions" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Team Rankings Component - Compact
const CTTeamRankings: React.FC<{ rankings: TeamRanking[] }> = ({ rankings }) => {
  if (!rankings || rankings.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 text-xs">
        <p>No team rankings data available.</p>
      </div>
    );
  }

  const getMedalColor = (rank: number) => {
    if (rank === 1) return 'from-blue-500 to-cyan-500';
    if (rank === 2) return 'from-gray-400 to-gray-500';
    if (rank === 3) return 'from-amber-600 to-amber-700';
    return 'from-green-500 to-green-600';
  };

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-center">Most Successful Teams</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {rankings.map((team) => (
          <Link key={team.team_name} to={`/champions-trophy/team/${encodeURIComponent(team.team_name)}`}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`bg-gradient-to-r ${getMedalColor(team.rank)} rounded-lg p-3 text-white cursor-pointer shadow hover:shadow-md transition-all`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm mb-0.5 font-bold">#{team.rank}</div>
                  <h3 className="text-base font-bold">{team.team_name}</h3>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">{team.titles_won}</div>
                  <div className="text-[10px] text-white/70">Titles</div>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-1 text-center text-[10px]">
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

// Tournament History Component - Compact
const CTHistory: React.FC<{ tournaments: Tournament[] }> = ({ tournaments }) => {
  if (!tournaments || tournaments.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 text-xs">
        <p>No tournament history available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-bold text-center mb-3">All Champions Trophy Editions</h2>
      <div className="grid grid-cols-1 gap-2">
        {tournaments.map((tournament, index) => (
          <Link key={tournament.year} to={`/champions-trophy/${tournament.year}`}>
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
              className="bg-white dark:bg-gray-800 rounded-md p-3 shadow hover:shadow-md transition-all border border-gray-200 dark:border-gray-700"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-800 dark:text-white">{tournament.year}</div>
                    <div className="text-[10px] text-gray-500">Edition</div>
                  </div>
                  <div className="hidden sm:block h-6 w-px bg-gray-300 dark:bg-gray-600" />
                  <div>
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="font-semibold text-sm">{tournament.winner_name || 'TBD'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-gray-500">
                      <span>📍</span>
                      <span>{tournament.host_country}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {tournament.runner_up_name && (
                    <div className="text-right">
                      <div className="text-[10px] text-gray-500">Runner-up</div>
                      <div className="font-semibold text-xs">{tournament.runner_up_name}</div>
                    </div>
                  )}
                  <div className="text-blue-600 dark:text-blue-400 text-base">→</div>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};