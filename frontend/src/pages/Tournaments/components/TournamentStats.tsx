import React, { useState, useEffect } from 'react';

interface TournamentStatsProps {
  tournamentId: number;
  year: number;
}

interface PlayerStat {
  player_name: string;
  runs?: number | string;
  wickets?: number | string;
  matches?: number | string;
  average?: number | string;
  strike_rate?: number | string;
  economy?: number | string;
  batting_avg?: number | string;
  bowling_avg?: number | string;
  sixes?: number | string;
  centuries?: number | string;
}

interface Achievement {
  achievement_type: string;
  title: string;
  description: string;
  is_featured: boolean;
  players: string[];
}

interface TournamentStatsData {
  topRuns: PlayerStat[];
  topWickets: PlayerStat[];
  topAllrounders: PlayerStat[];
  teamStats: {
    totalSixes: number;
    totalCenturies: number;
    mostSixes: number;
    mostHundreds: number;
    highestScore: number;
    highestScorePlayer: string;
    bestBowling: string;
    bestBowlingPlayer: string;
    highestTeamScore: number;
    highestTeamScorePlayer: string;
    mostSixesPlayer: string;
    mostCenturies: number;
    mostCenturiesPlayer: string;
  };
  achievements: Achievement[];
}

// Safe number formatter
const safeNumber = (value: any): number => {
  if (value === null || value === undefined) return 0;
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(num) ? 0 : num;
};

// Safe to fixed
const toFixed = (value: any, decimals: number = 2): string => {
  const num = safeNumber(value);
  return num > 0 ? num.toFixed(decimals) : '-';
};

export const TournamentStats: React.FC<TournamentStatsProps> = ({ tournamentId, year }) => {
  const [stats, setStats] = useState<TournamentStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeStatTab, setActiveStatTab] = useState<'runs' | 'wickets' | 'allrounder' | 'achievements'>('runs');

  useEffect(() => {
    fetchTournamentStats();
  }, [tournamentId, year]);

  const fetchTournamentStats = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/world-cup/tournaments/${tournamentId}/detailed-stats`);
      const data = await response.json();
      console.log('Stats data:', data);
      setStats(data.data);
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

  if (!stats) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Statistics not available for {year}.</p>
        <p className="text-sm mt-2">Data is being updated. Check back soon!</p>
      </div>
    );
  }

  const statTabs = [
    { id: 'runs' as const, label: 'Most Runs' },
    { id: 'wickets' as const, label: 'Most Wickets' },
    { id: 'allrounder' as const, label: 'All-Rounders' },
  ];

  const getCurrentData = () => {
    switch (activeStatTab) {
      case 'runs': return stats.topRuns;
      case 'wickets': return stats.topWickets;
      case 'allrounder': return stats.topAllrounders;
      default: return [];
    }
  };

  const getStatLabel = (player: PlayerStat, type: string) => {
    if (type === 'runs') return `${safeNumber(player.runs)} runs`;
    if (type === 'wickets') return `${safeNumber(player.wickets)} wickets`;
    return `${safeNumber(player.runs)} runs • ${safeNumber(player.wickets)} wkts`;
  };

  const getStatSubLabel = (player: PlayerStat, type: string) => {
    if (type === 'runs') {
      return `Avg: ${toFixed(player.average)} • SR: ${toFixed(player.strike_rate)}`;
    }
    if (type === 'wickets') {
      return `Avg: ${toFixed(player.average)} • Econ: ${toFixed(player.economy)}`;
    }
    const battingAvg = player.batting_avg !== undefined ? toFixed(player.batting_avg) : toFixed(player.average);
    const bowlingAvg = player.bowling_avg !== undefined ? toFixed(player.bowling_avg) : toFixed(player.economy);
    return `Bat Avg: ${battingAvg} • Bowl Avg: ${bowlingAvg}`;
  };

  const featuredAchievement = stats.achievements?.find(a => a.is_featured);
  const otherAchievements = stats.achievements?.filter(a => !a.is_featured) || [];

  return (
    <div className="space-y-6">
      {/* Tournament Highlight Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl p-4 text-white text-center">
          <div className="text-2xl font-bold">{stats.teamStats.totalSixes}</div>
          <div className="text-xs opacity-90">Total Sixes</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-4 text-white text-center">
          <div className="text-2xl font-bold">{stats.teamStats.totalCenturies}</div>
          <div className="text-xs opacity-90">Total Centuries</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-4 text-white text-center">
          <div className="text-lg font-bold truncate">{stats.teamStats.highestScorePlayer || '-'}</div>
          <div className="text-xl font-bold">{stats.teamStats.highestScore}*</div>
          <div className="text-xs opacity-90">Highest Score</div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-rose-500 rounded-xl p-4 text-white text-center">
          <div className="text-lg font-bold truncate">{stats.teamStats.bestBowlingPlayer || '-'}</div>
          <div className="text-xl font-bold">{stats.teamStats.bestBowling}</div>
          <div className="text-xs opacity-90">Best Bowling</div>
        </div>
      </div>

      {/* Player Stats Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-800 px-6 py-4">
          <h3 className="text-xl font-bold text-white">Tournament Leaders</h3>
          <p className="text-green-100 text-sm">Top performers of {year} World Cup</p>
        </div>

        {/* Sub-tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {statTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveStatTab(tab.id)}
              className={`flex-1 px-4 py-3 font-medium transition-all text-center ${
                activeStatTab === tab.id
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Leaderboard Content */}
        <div className="p-5">
          {activeStatTab !== 'achievements' ? (
            <div className="space-y-3">
              {getCurrentData().map((player, idx) => (
                <div
                  key={idx}
                  className={`flex justify-between items-center p-3 rounded-lg transition ${
                    idx === 0 ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 text-center">
                      {idx === 0 && <span className="text-xl font-bold">1</span>}
                      {idx === 1 && <span className="text-xl font-bold">2</span>}
                      {idx === 2 && <span className="text-xl font-bold">3</span>}
                      {idx > 2 && <span className="text-lg font-bold text-gray-400">{idx + 1}</span>}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white">{player.player_name}</p>
                      <p className="text-xs text-gray-500">{getStatSubLabel(player, activeStatTab)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      {getStatLabel(player, activeStatTab)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Featured Moment */}
              {featuredAchievement && (
                <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl p-6 text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-semibold uppercase tracking-wide">Iconic Moment</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{featuredAchievement.title}</h3>
                  <p className="text-white/90 leading-relaxed">{featuredAchievement.description}</p>
                  {featuredAchievement.players && featuredAchievement.players.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {featuredAchievement.players.map((player, pIdx) => (
                        <span key={pIdx} className="px-3 py-1 bg-white/20 rounded-full text-sm">
                          {player}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Other Moments */}
              {otherAchievements.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {otherAchievements.map((achievement, idx) => (
                    <div key={idx} className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          {achievement.achievement_type?.replace('_', ' ')}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{achievement.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{achievement.description}</p>
                      {achievement.players && achievement.players.length > 0 && (
                        <div className="mt-3 text-xs text-gray-500">
                          {achievement.players.join(' • ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Additional Analytics */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow border border-gray-200 dark:border-gray-700">
    <h4 className="font-semibold mb-4">Run Rate Analysis</h4>
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-gray-600">Highest Team Total</span>
        <div className="text-right">
          <span className="font-bold">{stats.teamStats.highestTeamScore} runs</span>
          {stats.teamStats.highestTeamScorePlayer && (
            <div className="text-xs text-gray-500">{stats.teamStats.highestTeamScorePlayer}</div>
          )}
        </div>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Most Sixes in Tournament</span>
        <div className="text-right">
          <span className="font-bold">{stats.teamStats.mostSixes}</span>
          {stats.teamStats.mostSixesPlayer && (
            <div className="text-xs text-gray-500">by {stats.teamStats.mostSixesPlayer}</div>
          )}
        </div>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Most Centuries</span>
        <div className="text-right">
          <span className="font-bold">{stats.teamStats.mostCenturies}</span>
          {stats.teamStats.mostCenturiesPlayer && (
            <div className="text-xs text-gray-500">by {stats.teamStats.mostCenturiesPlayer}</div>
          )}
        </div>
      </div>
    </div>
  </div>

  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow border border-gray-200 dark:border-gray-700">
    <h4 className="font-semibold mb-4">Bowling Excellence</h4>
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-gray-600">Best Bowling Figures</span>
        <div className="text-right">
          <span className="font-bold">{stats.teamStats.bestBowling}</span>
          {stats.teamStats.bestBowlingPlayer && (
            <div className="text-xs text-gray-500">by {stats.teamStats.bestBowlingPlayer}</div>
          )}
        </div>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Best Bowler</span>
        <span className="font-bold">{stats.teamStats.bestBowlingPlayer}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Total Wickets (Top 5)</span>
        <span className="font-bold">
          {stats.topWickets.reduce((sum, p) => sum + safeNumber(p.wickets), 0)}
        </span>
      </div>
    </div>
  </div>
</div>
    </div>
  );
};