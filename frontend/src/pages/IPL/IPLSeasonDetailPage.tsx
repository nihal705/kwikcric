// src/pages/IPL/IPLSeasonDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiMapPin, FiUsers, FiAward } from 'react-icons/fi';
import { iplAPI, IPLSeasonDetail, IPLPointsTableEntry, IPLPlayoffMatch, IPLMatch } from '../../services/api/iplAPI';
import toast from 'react-hot-toast';

type TabType = 'overview' | 'pointsTable' | 'playoffs' | 'matches';

export const IPLSeasonDetailPage: React.FC = () => {
  const { year } = useParams<{ year: string }>();
  const [data, setData] = useState<IPLSeasonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (year) {
      fetchSeason();
    }
  }, [year]);

  const fetchSeason = async () => {
    setLoading(true);
    setError(null);
    try {
      const yearNum = parseInt(year!);
      if (isNaN(yearNum)) throw new Error('Invalid year');
      
      const response = await iplAPI.getSeasonByYear(yearNum);
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching IPL season:', error);
      setError('Failed to load IPL season details');
      toast.error('Failed to load season details');
    } finally {
      setLoading(false);
    }
  };

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '🏆' },
    { id: 'pointsTable', label: 'Points Table', icon: '📊' },
    { id: 'playoffs', label: 'Playoffs', icon: '🏅' },
    { id: 'matches', label: 'Matches', icon: '📋' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-20">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold mb-2">{error || 'Season not found'}</h2>
        <Link to="/ipl" className="text-blue-600 hover:underline">
          ← Back to IPL Hub
        </Link>
      </div>
    );
  }

  const { season, pointsTable, playoffs, matches } = data;

  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-[#0f172a] text-gray-900 dark:text-white">
      {/* Header */}
      <div 
        className="relative py-8"
        style={{ 
          background: `linear-gradient(135deg, ${season.winner_color || '#004BA0'} 0%, ${season.winner_color ? `${season.winner_color}cc` : '#2E0854'} 100%)`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/ipl" className="inline-flex items-center text-white/80 hover:text-white text-sm mb-3">
            ← Back to IPL Hub
          </Link>
          <div className="text-center">
            <div className="text-4xl mb-2">🏏</div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
              IPL {season.year}
            </h1>
            <p className="text-sm text-white/80">
              {season.total_teams} Teams • {season.total_matches} Matches
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab Navigation */}
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

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-5"
            >
              <OverviewSection season={season} />
            </motion.div>
          )}

          {activeTab === 'pointsTable' && pointsTable.length > 0 && (
            <motion.div
              key="pointsTable"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <PointsTableSection pointsTable={pointsTable} />
            </motion.div>
          )}

          {activeTab === 'playoffs' && playoffs.length > 0 && (
            <motion.div
              key="playoffs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <PlayoffBracketSection playoffs={playoffs} season={season} />
            </motion.div>
          )}

          {activeTab === 'matches' && matches.length > 0 && (
            <motion.div
              key="matches"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <MatchesSection matches={matches} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Overview Section
const OverviewSection: React.FC<{ season: IPLSeasonDetail['season'] }> = ({ season }) => {
  return (
    <div className="space-y-5">
      {/* Winner Card */}
      <div 
        className="rounded-xl p-6 text-white text-center"
        style={{ background: `linear-gradient(135deg, ${season.winner_color || '#004BA0'} 0%, ${season.winner_color ? `${season.winner_color}cc` : '#2E0854'} 100%)` }}
      >
        <div className="text-5xl mb-3">🏆</div>
        <h2 className="text-2xl font-bold mb-1">{season.winner_name}</h2>
        <p className="text-sm opacity-90">IPL {season.year} Champions</p>
        {season.runner_up_name && (
          <p className="text-xs mt-2 opacity-80">
            Defeated {season.runner_up_name} in the final
          </p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm border border-gray-200 dark:border-gray-700">
          <FiCalendar className="w-5 h-5 text-blue-500 mx-auto mb-1" />
          <div className="text-xs text-gray-500">Final Date</div>
          <div className="text-sm font-bold">
            {season.final_match_date ? new Date(season.final_match_date).toLocaleDateString() : 'TBD'}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm border border-gray-200 dark:border-gray-700">
          <FiMapPin className="w-5 h-5 text-red-500 mx-auto mb-1" />
          <div className="text-xs text-gray-500">Final Venue</div>
          <div className="text-sm font-bold truncate">{season.final_venue?.split(',')[0] || 'TBD'}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm border border-gray-200 dark:border-gray-700">
          <FiUsers className="w-5 h-5 text-green-500 mx-auto mb-1" />
          <div className="text-xs text-gray-500">Teams</div>
          <div className="text-sm font-bold">{season.total_teams}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm border border-gray-200 dark:border-gray-700">
          <FiAward className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
          <div className="text-xs text-gray-500">Matches</div>
          <div className="text-sm font-bold">{season.total_matches}</div>
        </div>
      </div>

      {/* Key Awards */}
      {(season.orange_cap_player || season.purple_cap_player || season.player_of_tournament) && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-bold mb-3">Key Awards</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {season.orange_cap_player && (
              <div className="flex items-center gap-2 p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <span className="text-xl">🟠</span>
                <div>
                  <div className="text-xs text-gray-500">Orange Cap</div>
                  <div className="text-sm font-semibold">{season.orange_cap_player}</div>
                </div>
              </div>
            )}
            {season.purple_cap_player && (
              <div className="flex items-center gap-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <span className="text-xl">🟣</span>
                <div>
                  <div className="text-xs text-gray-500">Purple Cap</div>
                  <div className="text-sm font-semibold">{season.purple_cap_player}</div>
                </div>
              </div>
            )}
            {season.player_of_tournament && (
              <div className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <span className="text-xl">⭐</span>
                <div>
                  <div className="text-xs text-gray-500">Player of Tournament</div>
                  <div className="text-sm font-semibold">{season.player_of_tournament}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Points Table Section
const PointsTableSection: React.FC<{ pointsTable: IPLPointsTableEntry[] }> = ({ pointsTable }) => {
  if (!pointsTable.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Points table not available for this season.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Pos</th>
              <th className="px-4 py-3 text-left">Team</th>
              <th className="px-4 py-3 text-center">Pld</th>
              <th className="px-4 py-3 text-center">W</th>
              <th className="px-4 py-3 text-center">L</th>
              <th className="px-4 py-3 text-center">Pts</th>
              <th className="px-4 py-3 text-center">NRR</th>
            </tr>
          </thead>
          <tbody>
            {pointsTable.map((entry, idx) => (
              <tr key={idx} className={`border-b border-gray-100 dark:border-gray-800 ${
                idx < 4 ? 'bg-green-50 dark:bg-green-900/10' : ''
              }`}>
                <td className="px-4 py-3 font-bold">#{idx + 1}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.primary_color || '#gray' }}
                    />
                    <span className="font-medium">{entry.team_name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">{entry.matches_played}</td>
                <td className="px-4 py-3 text-center text-green-600 font-medium">{entry.matches_won}</td>
                <td className="px-4 py-3 text-center text-red-600">{entry.matches_lost}</td>
                <td className="px-4 py-3 text-center font-bold">{entry.points}</td>
                <td className="px-4 py-3 text-center font-mono">{entry.net_run_rate?.toFixed(3) || '0.000'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Playoff Bracket Section
const PlayoffBracketSection: React.FC<{ playoffs: IPLPlayoffMatch[]; season: IPLSeasonDetail['season'] }> = ({ playoffs, season }) => {
  const qualifier1 = playoffs.find(p => p.match_type === 'qualifier1');
  const eliminator = playoffs.find(p => p.match_type === 'eliminator');
  const qualifier2 = playoffs.find(p => p.match_type === 'qualifier2');
  const finalMatch = playoffs.find(p => p.match_type === 'final');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Qualifier 1 */}
        <MatchCard match={qualifier1} title="Qualifier 1" />
        {/* Eliminator */}
        <MatchCard match={eliminator} title="Eliminator" />
        {/* Qualifier 2 */}
        <MatchCard match={qualifier2} title="Qualifier 2" />
        {/* Final */}
        <MatchCard match={finalMatch} title="FINAL" isFinal />
      </div>
      
      {/* Final Winner Highlight */}
      {finalMatch && (
        <div className="text-center mt-4">
          <div 
            className="inline-block px-6 py-3 rounded-full text-white font-bold"
            style={{ background: season.winner_color || '#004BA0' }}
          >
            🏆 {finalMatch.winner_name} are the IPL {season.year} Champions! 🏆
          </div>
        </div>
      )}
    </div>
  );
};

const MatchCard: React.FC<{ match?: IPLPlayoffMatch; title: string; isFinal?: boolean }> = ({ match, title, isFinal }) => {
  if (!match) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="text-xs font-semibold text-gray-500 mb-2">{title}</div>
        <div className="text-gray-400 text-sm">TBD</div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border-2 ${
      isFinal ? 'border-yellow-500' : 'border-gray-200 dark:border-gray-700'
    }`}>
      <div className="text-center mb-3">
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
          isFinal ? 'bg-yellow-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
        }`}>
          {title}
        </span>
      </div>
      
      <div className="space-y-2">
        <div className={`flex justify-between items-center p-2 rounded ${
          match.winner_name === match.team1_name ? 'bg-green-50 dark:bg-green-900/20' : ''
        }`}>
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: match.team1_color || '#gray' }}
            />
            <span className="text-sm font-medium">{match.team1_name}</span>
          </div>
          {match.winner_name === match.team1_name && <span className="text-green-600 text-xs">✓</span>}
        </div>
        
        <div className={`flex justify-between items-center p-2 rounded ${
          match.winner_name === match.team2_name ? 'bg-green-50 dark:bg-green-900/20' : ''
        }`}>
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: match.team2_color || '#gray' }}
            />
            <span className="text-sm font-medium">{match.team2_name}</span>
          </div>
          {match.winner_name === match.team2_name && <span className="text-green-600 text-xs">✓</span>}
        </div>
      </div>
      
      <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700 text-center">
        <div className="text-xs text-green-600 font-medium">
          {match.winner_name} won by {match.winner_margin}
        </div>
        {match.man_of_match && (
          <div className="text-xs text-yellow-600 mt-1">
            🏅 {match.man_of_match}
          </div>
        )}
      </div>
    </div>
  );
};

// Matches Section
const MatchesSection: React.FC<{ matches: IPLMatch[] }> = ({ matches }) => {
  const [filter, setFilter] = useState<'all' | 'league' | 'playoff'>('all');

  const leagueMatches = matches.filter(m => m.match_type === 'league');
  const playoffMatches = matches.filter(m => m.match_type !== 'league');

  let displayMatches = matches;
  if (filter === 'league') displayMatches = leagueMatches;
  if (filter === 'playoff') displayMatches = playoffMatches;

  return (
    <div className="space-y-4">
      {/* Filter Buttons */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}
        >
          All Matches ({matches.length})
        </button>
        <button
          onClick={() => setFilter('league')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            filter === 'league'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}
        >
          League Stage ({leagueMatches.length})
        </button>
        <button
          onClick={() => setFilter('playoff')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            filter === 'playoff'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}
        >
          Playoffs ({playoffMatches.length})
        </button>
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {displayMatches.map((match, idx) => (
          <IPLMatchCard key={idx} match={match} />
        ))}
      </div>
    </div>
  );
};

const IPLMatchCard: React.FC<{ match: IPLMatch }> = ({ match }) => {
  const isPlayoff = match.match_type !== 'league';
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border ${
      isPlayoff ? 'border-blue-300 dark:border-blue-600' : 'border-gray-200 dark:border-gray-700'
    }`}>
      <div className="text-center mb-2">
        <span className="text-xs text-gray-500">{new Date(match.match_date).toLocaleDateString()}</span>
        <span className="mx-2">•</span>
        <span className="text-xs text-gray-500">{match.venue?.split(',')[0]}</span>
        {match.match_type === 'final' && (
          <span className="ml-2 text-xs bg-yellow-500 text-white px-1.5 py-0.5 rounded-full">FINAL</span>
        )}
      </div>
      
      <div className="space-y-1">
        <div className={`flex justify-between items-center p-1.5 rounded ${
          match.winner_name === match.team1_name ? 'bg-green-50 dark:bg-green-900/20' : ''
        }`}>
          <div className="flex items-center gap-2">
            <div 
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: match.team1_color || '#gray' }}
            />
            <span className="text-sm font-medium">{match.team1_name}</span>
          </div>
          <span className="font-mono text-sm font-semibold">
            {match.team1_score}/{match.team1_wickets} ({match.team1_overs})
          </span>
        </div>
        
        <div className={`flex justify-between items-center p-1.5 rounded ${
          match.winner_name === match.team2_name ? 'bg-green-50 dark:bg-green-900/20' : ''
        }`}>
          <div className="flex items-center gap-2">
            <div 
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: match.team2_color || '#gray' }}
            />
            <span className="text-sm font-medium">{match.team2_name}</span>
          </div>
          <span className="font-mono text-sm font-semibold">
            {match.team2_score}/{match.team2_wickets} ({match.team2_overs})
          </span>
        </div>
      </div>
      
      <div className="mt-2 pt-1.5 border-t border-gray-100 dark:border-gray-700 text-center">
        <span className="text-xs text-green-600 font-medium">
          {match.winner_name} won by {match.winner_margin} {match.margin_type}
        </span>
        {match.man_of_match_name && (
          <div className="text-xs text-yellow-600 mt-0.5">
            🏅 {match.man_of_match_name}
          </div>
        )}
      </div>
    </div>
  );
};