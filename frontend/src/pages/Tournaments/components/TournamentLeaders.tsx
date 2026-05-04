import React, { useState, useEffect } from 'react';
import { worldCupAPI, TournamentStatsData } from '../../../services/api/worldCupAPI';

interface TournamentLeadersProps {
  tournamentId: number;
  year: number;
}

export const TournamentLeaders: React.FC<TournamentLeadersProps> = ({ tournamentId, year }) => {
  const [stats, setStats] = useState<TournamentStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [tournamentId]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await worldCupAPI.getTournamentStats(tournamentId);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching tournament stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent" />
      </div>
    );
  }

  const hasData = stats && (stats.mostRuns?.length > 0 || stats.mostWickets?.length > 0);

  if (!hasData) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500">Tournament statistics not available for {year}.</p>
        <p className="text-sm text-gray-400 mt-2">Data is being updated. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Player of the Tournament */}
      {stats.playerOfTournament && (
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-5 text-white text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-xl">⭐</span>
            <span className="font-semibold">Player of the Tournament</span>
          </div>
          <p className="text-2xl font-bold">{stats.playerOfTournament.player_name}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Most Runs */}
        {stats.mostRuns && stats.mostRuns.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-xl">🏏</span>
              <h4 className="font-semibold text-lg">Most Runs</h4>
            </div>
            <div className="space-y-3">
              {stats.mostRuns.map((player, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-400 w-6">{idx + 1}</span>
                    <span className="font-medium">{player.player_name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-green-600">{player.runs?.toLocaleString()}</span>
                    <span className="text-xs text-gray-500 ml-1">runs</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Most Wickets */}
        {stats.mostWickets && stats.mostWickets.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-xl">🎯</span>
              <h4 className="font-semibold text-lg">Most Wickets</h4>
            </div>
            <div className="space-y-3">
              {stats.mostWickets.map((player, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-400 w-6">{idx + 1}</span>
                    <span className="font-medium">{player.player_name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-blue-600">{player.wickets}</span>
                    <span className="text-xs text-gray-500 ml-1">wickets</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Most Sixes */}
        {stats.mostSixes && stats.mostSixes.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-xl">💥</span>
              <h4 className="font-semibold text-lg">Most Sixes</h4>
            </div>
            <div className="space-y-3">
              {stats.mostSixes.map((player, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-400 w-6">{idx + 1}</span>
                    <span className="font-medium">{player.player_name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-orange-600">{player.sixes}</span>
                    <span className="text-xs text-gray-500 ml-1">sixes</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Most Hundreds */}
        {stats.mostHundreds && stats.mostHundreds.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-xl">💯</span>
              <h4 className="font-semibold text-lg">Most Hundreds</h4>
            </div>
            <div className="space-y-3">
              {stats.mostHundreds.map((player, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-400 w-6">{idx + 1}</span>
                    <span className="font-medium">{player.player_name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-purple-600">{player.hundreds}</span>
                    <span className="text-xs text-gray-500 ml-1">centuries</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};