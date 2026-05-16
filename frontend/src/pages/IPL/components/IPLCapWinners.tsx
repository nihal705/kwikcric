// src/pages/IPL/components/IPLCapWinners.tsx
import React, { useState } from 'react';

interface CapWinner {
  year: number;
  orange_cap_player: string;
  orange_cap_runs: number;
  purple_cap_player: string;
  purple_cap_wickets: number;
  orange_cap_team?: string;
  purple_cap_team?: string;
}

interface IPLCapWinnersProps {
  winners: CapWinner[];
  loading?: boolean;
}

export const IPLCapWinners: React.FC<IPLCapWinnersProps> = ({ winners, loading }) => {
  const [activeView, setActiveView] = useState<'all' | 'orange' | 'purple'>('all');

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!winners || winners.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No cap winners data available.</p>
      </div>
    );
  }

  const orangeCapLeaders = [...winners].sort((a, b) => b.orange_cap_runs - a.orange_cap_runs).slice(0, 10);
  const purpleCapLeaders = [...winners].sort((a, b) => b.purple_cap_wickets - a.purple_cap_wickets).slice(0, 10);

  return (
    <div className="space-y-6">
      {/* View Tabs */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setActiveView('all')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
            activeView === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}
        >
          All Seasons
        </button>
        <button
          onClick={() => setActiveView('orange')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1 ${
            activeView === 'orange'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}
        >
          🟠 Orange Cap Leaders
        </button>
        <button
          onClick={() => setActiveView('purple')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1 ${
            activeView === 'purple'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}
        >
          🟣 Purple Cap Leaders
        </button>
      </div>

      {/* All Seasons View - Yearly Table */}
      {activeView === 'all' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3">
            <h3 className="text-sm font-bold text-white">Orange Cap & Purple Cap Winners (2008-2025)</h3>
            <p className="text-[10px] text-white/80">Highest run-scorer and wicket-taker each season</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-3 py-2 text-left">Year</th>
                  <th className="px-3 py-2 text-left"> Orange Cap</th>
                  <th className="px-3 py-2 text-center">Runs</th>
                  <th className="px-3 py-2 text-left"> Purple Cap</th>
                  <th className="px-3 py-2 text-center">Wickets</th>
                </tr>
              </thead>
              <tbody>
                {winners.map((winner, idx) => (
                  <tr key={winner.year} className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${idx % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700/30'}`}>
                    <td className="px-3 py-2 font-bold">{winner.year}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{winner.orange_cap_player}</span>
                        {winner.orange_cap_team && (
                          <span className="text-[9px] text-gray-400">({winner.orange_cap_team})</span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center font-semibold text-orange-600">{winner.orange_cap_runs.toLocaleString()}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{winner.purple_cap_player}</span>
                        {winner.purple_cap_team && (
                          <span className="text-[9px] text-gray-400">({winner.purple_cap_team})</span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center font-semibold text-purple-600">{winner.purple_cap_wickets}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orange Cap Leaders View */}
      {activeView === 'orange' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3">
            <h3 className="text-sm font-bold text-white">All-Time Orange Cap Leaders</h3>
            <p className="text-[10px] text-white/80">Most runs in a single IPL season</p>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {orangeCapLeaders.map((leader, idx) => (
              <div key={idx} className={`flex justify-between items-center p-3 ${idx === 0 ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 text-center">
                    {idx === 0 && <span className="text-xl">🥇</span>}
                    {idx === 1 && <span className="text-xl">🥈</span>}
                    {idx === 2 && <span className="text-xl">🥉</span>}
                    {idx > 2 && <span className="text-sm font-bold text-gray-400">#{idx + 1}</span>}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">{leader.orange_cap_player}</p>
                    <p className="text-[10px] text-gray-500">IPL {leader.year}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-orange-600">{leader.orange_cap_runs.toLocaleString()}</p>
                  <p className="text-[9px] text-gray-400">runs</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Purple Cap Leaders View */}
      {activeView === 'purple' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-3">
            <h3 className="text-sm font-bold text-white">All-Time Purple Cap Leaders</h3>
            <p className="text-[10px] text-white/80">Most wickets in a single IPL season</p>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {purpleCapLeaders.map((leader, idx) => (
              <div key={idx} className={`flex justify-between items-center p-3 ${idx === 0 ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 text-center">
                    {idx === 0 && <span className="text-xl">🥇</span>}
                    {idx === 1 && <span className="text-xl">🥈</span>}
                    {idx === 2 && <span className="text-xl">🥉</span>}
                    {idx > 2 && <span className="text-sm font-bold text-gray-400">#{idx + 1}</span>}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">{leader.purple_cap_player}</p>
                    <p className="text-[10px] text-gray-500">IPL {leader.year}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-purple-600">{leader.purple_cap_wickets}</p>
                  <p className="text-[9px] text-gray-400">wickets</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};