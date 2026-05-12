// frontend/src/pages/Games/KwikCricket/KwikCricketHistoryPage.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';
import { Link } from 'react-router-dom';

interface MatchHistory {
  id: number;
  userTeam: string;
  opponentTeam: string;
  overs: number;
  userScore: number;
  userWickets: number;
  opponentScore: number;
  opponentWickets: number;
  result: string;
  played_at: string;
}

interface UserStats {
  matches_played: number;
  matches_won: number;
  total_runs: number;
  total_wickets: number;
  highest_score: number;
  best_bowling?: string;
}

const KwikCricketHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<MatchHistory[]>([]);
  const [stats, setStats] = useState<UserStats>({
    matches_played: 0,
    matches_won: 0,
    total_runs: 0,
    total_wickets: 0,
    highest_score: 0,
  });
  const [filter, setFilter] = useState<'all' | 'wins' | 'losses'>('all');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    // Load from localStorage for all users (guest or registered)
    const guestHistory = localStorage.getItem('kwik_cricket_guest_history');
    const guestStats = localStorage.getItem('kwik_cricket_guest_stats');
    
    if (guestHistory) {
      setHistory(JSON.parse(guestHistory));
    }
    
    if (guestStats) {
      setStats(JSON.parse(guestStats));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getResultBadge = (result: string) => {
    if (result === 'win') {
      return <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full font-medium">🏆 WON</span>;
    } else {
      return <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs rounded-full font-medium">😔 LOST</span>;
    }
  };

  const getMargin = (match: MatchHistory) => {
    if (match.result === 'win') {
      const margin = match.userScore - match.opponentScore;
      return `Won by ${margin} runs`;
    } else {
      const margin = 10 - match.opponentWickets;
      return `Lost by ${margin} wickets`;
    }
  };

  const filteredHistory = history.filter(match => {
    if (filter === 'wins') return match.result === 'win';
    if (filter === 'losses') return match.result === 'loss';
    return true;
  });

  const winRate = stats.matches_played > 0 
    ? Math.round((stats.matches_won / stats.matches_played) * 100) 
    : 0;

  return (
    <div 
      className="min-h-screen bg-[#f9fafb] dark:bg-[#0f172a] text-gray-900 dark:text-white" 
      style={{ backgroundImage: 'none' }}
    >
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-4xl">⚡</span>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kwik Cricket History</h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            {user?.isGuest ? 'Guest Mode' : user?.username || 'Player'} - Your match records
          </p>
          <Link 
            to="/games/kwik-cricket" 
            className="inline-block mt-2 text-sm text-green-600 hover:underline"
          >
            ← Back to Game
          </Link>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-xl mb-1">📊</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.matches_played}</div>
            <div className="text-[10px] text-gray-500">Matches</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-xl mb-1">🏆</div>
            <div className="text-xl font-bold text-green-600">{stats.matches_won}</div>
            <div className="text-[10px] text-gray-500">Won</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-xl mb-1">📈</div>
            <div className="text-xl font-bold text-blue-600">{winRate}%</div>
            <div className="text-[10px] text-gray-500">Win Rate</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-xl mb-1">🏏</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.total_runs}</div>
            <div className="text-[10px] text-gray-500">Total Runs</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-xl mb-1">⚡</div>
            <div className="text-xl font-bold text-yellow-600">{stats.highest_score}</div>
            <div className="text-[10px] text-gray-500">Highest</div>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex gap-2 mb-4"
        >
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 text-sm rounded-lg transition ${
              filter === 'all' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            All Matches
          </button>
          <button
            onClick={() => setFilter('wins')}
            className={`px-4 py-1.5 text-sm rounded-lg transition ${
              filter === 'wins' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            🏆 Wins
          </button>
          <button
            onClick={() => setFilter('losses')}
            className={`px-4 py-1.5 text-sm rounded-lg transition ${
              filter === 'losses' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            😔 Losses
          </button>
        </motion.div>

        {/* History List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30">
            <h2 className="font-semibold text-gray-900 dark:text-white">
              Recent Matches ({filteredHistory.length})
            </h2>
          </div>

          {filteredHistory.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-5xl mb-3">🏏</div>
              <p className="text-gray-500 dark:text-gray-400">No matches played yet</p>
              <p className="text-sm text-gray-400 mt-1">Play your first match in Kwik Cricket!</p>
              <Link 
                to="/games/kwik-cricket" 
                className="inline-block mt-4 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-500 transition"
              >
                Play Now →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredHistory.map((match, idx) => (
                <div key={idx} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    {/* Match Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getResultBadge(match.result)}
                        <span className="text-xs text-gray-500">{formatDate(match.played_at)}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-semibold text-gray-900 dark:text-white text-sm">{match.userTeam}</div>
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">{match.userScore}/{match.userWickets}</div>
                        </div>
                        <div className="text-gray-500 text-sm">vs</div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white text-sm">{match.opponentTeam}</div>
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">{match.opponentScore}/{match.opponentWickets}</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Match Details */}
                    <div className="text-right">
                      <div className="text-xs text-gray-500">{match.overs} overs match</div>
                      <div className={`text-sm font-semibold ${match.result === 'win' ? 'text-green-600' : 'text-red-600'}`}>
                        {getMargin(match)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Clear History Button (Only for Guest) */}
        {user?.isGuest && history.length > 0 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear your match history? This cannot be undone.')) {
                  localStorage.removeItem('kwik_cricket_guest_history');
                  localStorage.removeItem('kwik_cricket_guest_stats');
                  setHistory([]);
                  setStats({
                    matches_played: 0,
                    matches_won: 0,
                    total_runs: 0,
                    total_wickets: 0,
                    highest_score: 0,
                  });
                }
              }}
              className="text-xs text-gray-500 hover:text-red-500 transition"
            >
              Clear History
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default KwikCricketHistoryPage;