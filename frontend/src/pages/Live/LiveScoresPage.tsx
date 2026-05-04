import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiRefreshCw, FiAlertCircle } from 'react-icons/fi';

interface LiveMatch {
  id: number;
  team1_name: string;
  team2_name: string;
  team1_code: string;
  team2_code: string;
  current_score?: string;
  current_overs?: string;
  status: string;
  tournament_name: string;
  venue_name: string;
}

export const LiveScoresPage: React.FC = () => {
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchLiveMatches = async () => {
    try {
      const response = await axios.get('/api/tournaments/live');
      setMatches(response.data.data || []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch live matches:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiveMatches();
    const interval = setInterval(fetchLiveMatches, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchLiveMatches();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Live Scores</h1>
          <p className="text-gray-500">Real-time updates from ongoing matches</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <FiRefreshCw className={`${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Last Updated */}
      <div className="text-sm text-gray-500 mb-6 text-right">
        Last updated: {lastUpdated.toLocaleTimeString()}
      </div>

      {/* Matches Grid */}
      {matches.length === 0 ? (
        <div className="text-center py-20">
          <FiAlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Live Matches</h3>
          <p className="text-gray-500">Check back later for live cricket action!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {matches.map((match, index) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card overflow-hidden"
            >
              <div className="bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="live-dot" />
                  <span className="text-white text-sm font-semibold">LIVE</span>
                </div>
                <span className="text-white/80 text-xs">{match.tournament_name}</span>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-center flex-1">
                    <div className="text-2xl font-bold">{match.team1_code}</div>
                    <div className="text-sm text-gray-500">{match.team1_name}</div>
                  </div>
                  <div className="text-2xl font-bold text-gray-400 px-4">VS</div>
                  <div className="text-center flex-1">
                    <div className="text-2xl font-bold">{match.team2_code}</div>
                    <div className="text-sm text-gray-500">{match.team2_name}</div>
                  </div>
                </div>
                
                {match.current_score && (
                  <div className="text-center bg-gray-100 dark:bg-gray-800 rounded-lg py-2 mb-4">
                    <div className="text-xl font-mono font-bold">{match.current_score}</div>
                    {match.current_overs && <div className="text-sm text-gray-500">Overs: {match.current_overs}</div>}
                  </div>
                )}
                
                <div className="text-center text-xs text-gray-500">
                  📍 {match.venue_name}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};