// frontend/src/pages/Tournaments/ChampionsTrophyDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { worldCupAPI, Tournament, Match, PointsTableEntry } from '../../services/api/worldCupAPI';
import { TournamentStats } from './components/TournamentStats';
import { TournamentAchievements } from './components/TournamentAchievements';

type TabType = 'overview' | 'pointsTable' | 'matches' | 'stats' | 'achievements';

export const ChampionsTrophyDetailPage: React.FC = () => {
  const { year } = useParams<{ year: string }>();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [pointsTable, setPointsTable] = useState<PointsTableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (year) {
      fetchDetails();
    }
  }, [year]);

  const fetchDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const yearNum = parseInt(year!);
      if (isNaN(yearNum)) throw new Error('Invalid year');
      
      const tournamentRes = await worldCupAPI.getTournamentByYear(yearNum, 'champions');
      const tournamentData = tournamentRes.data;
      setTournament(tournamentData);
      
      const matchesRes = await worldCupAPI.getTournamentMatches(tournamentData.id);
      setMatches(matchesRes.data || []);
      
      const pointsRes = await worldCupAPI.getPointsTable(tournamentData.id);
      setPointsTable(pointsRes.data || []);
    } catch (error) {
      console.error('Error fetching Champions Trophy details:', error);
      setError('Failed to load tournament details. Please check if data exists.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-3xl mb-3">⚠️</div>
        <h2 className="text-lg font-bold mb-2">{error || 'Tournament not found'}</h2>
        <Link to="/champions-trophy" className="text-blue-600 hover:underline text-sm">
          ← Back to Champions Trophy
        </Link>
      </div>
    );
  }

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '' },
    { id: 'pointsTable', label: 'Points Table', icon: '' },
    { id: 'matches', label: 'Matches', icon: '' },
    { id: 'stats', label: 'Stats', icon: '' },
    { id: 'achievements', label: 'Moments', icon: '' },
  ];

  const getHeaderColor = () => 'from-blue-700 to-cyan-700';
  const getAccentColor = () => 'text-blue-600 border-blue-600';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className={`relative bg-gradient-to-r ${getHeaderColor()} py-5 md:py-7`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/champions-trophy" className="inline-flex items-center text-white/80 hover:text-white text-xs mb-2 md:mb-3">
            ← Back to Champions Trophy
          </Link>
          <div className="text-center">
            <div className="text-3xl mb-1">🏅</div>
            <h1 className="text-xl md:text-2xl font-bold text-white mb-1">
              ICC Champions Trophy {tournament.year}
            </h1>
            <p className="text-xs md:text-sm text-white/80">
              Hosted by {tournament.host_country} • {tournament.total_teams} Teams • {tournament.total_matches} Matches
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-0.5 border-b border-gray-200 dark:border-gray-700 mb-4 md:mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 md:px-4 md:py-2 font-semibold transition-all flex items-center gap-1 text-xs md:text-sm ${
                activeTab === tab.id
                  ? `${getAccentColor()} border-b-2`
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
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-4 md:space-y-5"
            >
              <CTOverviewSection tournament={tournament} />
            </motion.div>
          )}

          {activeTab === 'pointsTable' && pointsTable && pointsTable.length > 0 && (
            <motion.div
              key="pointsTable"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <CTPointsTableSection pointsTable={pointsTable} />
            </motion.div>
          )}

          {activeTab === 'matches' && (
  <motion.div
    key="matches"
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
  >
    <CTMatchesSection matches={matches} tournamentYear={tournament.year} />
  </motion.div>
)}

          {activeTab === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <TournamentStats tournamentId={tournament.id} year={tournament.year} />
            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <TournamentAchievements tournamentId={tournament.id} year={tournament.year} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ChampionsTrophyDetailPage.tsx - Update the CTOverviewSection component

const CTOverviewSection: React.FC<{ tournament: Tournament }> = ({ tournament }) => {
  const isSharedTrophy = tournament.year === 2002;
  const winnerText = isSharedTrophy ? 'India & Sri Lanka (Shared)' : tournament.winner_name;
  
  // For joint winners, show both captains
  const getWinnerCaptain = () => {
    if (tournament.year === 2002) {
      return 'Sourav Ganguly (India) & Sanath Jayasuriya (Sri Lanka)';
    }
    return tournament.winner_captain;
  };

  return (
    <div className="space-y-4 md:space-y-5">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg p-4 md:p-5 text-white text-center">
        <div className="text-3xl md:text-4xl mb-2 md:mb-3">🏅</div>
        <h2 className="text-xl md:text-2xl font-bold mb-1">{winnerText || 'TBD'}</h2>
        <p className="text-sm md:text-base">Champions Trophy {tournament.year} Champions</p>
        {tournament.runner_up_name && !isSharedTrophy && (
          <p className="text-[10px] md:text-xs mt-1 text-white/80">
            Defeated {tournament.runner_up_name} in the final
          </p>
        )}
        {isSharedTrophy && (
          <p className="text-[10px] md:text-xs mt-1 text-white/80">
            Joint winners after rain abandoned the final twice
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-2 md:p-3 shadow text-center border border-gray-200 dark:border-gray-700">
          <h3 className="text-[10px] md:text-xs font-semibold text-gray-500 mb-0.5">Host Country</h3>
          <p className="text-xs md:text-sm font-bold">{tournament.host_country}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-2 md:p-3 shadow text-center border border-gray-200 dark:border-gray-700">
          <h3 className="text-[10px] md:text-xs font-semibold text-gray-500 mb-0.5">Total Matches</h3>
          <p className="text-xs md:text-sm font-bold">{tournament.total_matches}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-2 md:p-3 shadow text-center border border-gray-200 dark:border-gray-700">
          <h3 className="text-[10px] md:text-xs font-semibold text-gray-500 mb-0.5">Teams</h3>
          <p className="text-xs md:text-sm font-bold">{tournament.total_teams}</p>
        </div>
      </div>

      {(tournament.winner_captain || isSharedTrophy || tournament.player_of_tournament) && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 md:p-4 shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm md:text-base font-bold mb-2 md:mb-3">Key Figures</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
            <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <div className="text-[10px] text-gray-500">Winning Captain</div>
                <div className="text-xs md:text-sm font-semibold">{getWinnerCaptain()}</div>
              </div>
            </div>
            {tournament.player_of_tournament && (
              <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <div className="text-[10px] text-gray-500">Player of the Tournament</div>
                  <div className="text-xs md:text-sm font-semibold">{tournament.player_of_tournament}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {tournament.final_match_venue && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 md:p-4 shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm md:text-base font-bold mb-2 md:mb-3">Final Match</h3>
          <div className="flex flex-wrap items-center justify-between gap-2 md:gap-3">
            <div>
              <div className="text-[10px] text-gray-500">Venue</div>
              <div className="text-xs md:text-sm font-semibold">{tournament.final_match_venue}</div>
            </div>
            {tournament.final_match_date && (
              <div>
                <div className="text-[10px] text-gray-500">Date</div>
                <div className="text-xs md:text-sm font-semibold">{new Date(tournament.final_match_date).toLocaleDateString()}</div>
              </div>
            )}
          </div>
          {tournament.result_note && (
            <div className="mt-2 text-center text-yellow-600 text-xs">
              {tournament.result_note}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Points Table Section
const CTPointsTableSection: React.FC<{ pointsTable: PointsTableEntry[] }> = ({ pointsTable }) => {
  if (!pointsTable || pointsTable.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        <p>Points table data not available for this tournament.</p>
      </div>
    );
  }

  const formatNRR = (nrr: any): string => {
    if (nrr === null || nrr === undefined) return '0.000';
    const num = typeof nrr === 'string' ? parseFloat(nrr) : nrr;
    if (isNaN(num)) return '0.000';
    return num.toFixed(3);
  };

  const groups: Record<string, PointsTableEntry[]> = {};
  pointsTable.forEach((entry) => {
    const group = entry.group_name || 'Group';
    if (!groups[group]) groups[group] = [];
    groups[group].push(entry);
  });

  Object.keys(groups).forEach(group => {
    groups[group].sort((a, b) => {
      if (a.points !== b.points) return b.points - a.points;
      return (b.net_run_rate || 0) - (a.net_run_rate || 0);
    });
  });

  return (
    <div className="space-y-4">
      {Object.entries(groups).map(([groupName, entries]) => (
        <div key={groupName} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1.5">
            <h3 className="font-bold text-sm">{groupName}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-2 py-1.5 text-left">Team</th>
                  <th className="px-2 py-1.5 text-center">MP</th>
                  <th className="px-2 py-1.5 text-center">W</th>
                  <th className="px-2 py-1.5 text-center">L</th>
                  <th className="px-2 py-1.5 text-center">T</th>
                  <th className="px-2 py-1.5 text-center">NR</th>
                  <th className="px-2 py-1.5 text-center">Pts</th>
                  <th className="px-2 py-1.5 text-center">NRR</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, idx) => (
                  <tr key={idx} className={`border-b border-gray-100 dark:border-gray-700 ${
                    idx < 2 ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                  }`}>
                    <td className="px-2 py-1.5 font-medium text-xs">{entry.team_name}</td>
                    <td className="px-2 py-1.5 text-center">{entry.matches_played}</td>
                    <td className="px-2 py-1.5 text-center text-green-600 font-medium">{entry.matches_won}</td>
                    <td className="px-2 py-1.5 text-center text-red-600">{entry.matches_lost}</td>
                    <td className="px-2 py-1.5 text-center">{entry.matches_tied || 0}</td>
                    <td className="px-2 py-1.5 text-center">{entry.matches_nr || 0}</td>
                    <td className="px-2 py-1.5 text-center font-bold">{entry.points}</td>
                    <td className="px-2 py-1.5 text-center font-mono">{formatNRR(entry.net_run_rate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

const CTMatchesSection: React.FC<{ matches: Match[]; tournamentYear: number }> = ({ matches, tournamentYear }) => {
  const [filter, setFilter] = useState<'all' | 'group' | 'quarter' | 'semifinal' | 'final'>('all');

  if (!matches || matches.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 text-xs">
        <p>Match data not available for this tournament.</p>
      </div>
    );
  }

  // Categorize matches by stage
  const groupMatches = matches.filter(m => m.match_type === 'group' || m.match_type === 'group_stage');
  const quarterFinals = matches.filter(m => m.match_type === 'quarterfinal');
  const semiFinals = matches.filter(m => m.match_type === 'semifinal');
  const finalMatches = matches.filter(m => m.match_type === 'final');

  let displayMatches: Match[] = [];
  if (filter === 'all') displayMatches = matches;
  if (filter === 'group') displayMatches = groupMatches;
  if (filter === 'quarter') displayMatches = quarterFinals;
  if (filter === 'semifinal') displayMatches = semiFinals;
  if (filter === 'final') displayMatches = finalMatches;

  // Sort matches by date
  const sortByDate = (a: Match, b: Match) => 
    new Date(a.match_date).getTime() - new Date(b.match_date).getTime();

  const hasGroupMatches = groupMatches.length > 0;
  const hasQuarterFinals = quarterFinals.length > 0;
  const hasSemiFinals = semiFinals.length > 0;
  const hasFinal = finalMatches.length > 0;

  return (
    <div className="space-y-4">
      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-1.5">
        <button
          onClick={() => setFilter('all')}
          className={`px-2.5 py-1 rounded-md font-medium text-[10px] md:text-xs transition ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          All Matches ({matches.length})
        </button>
        {hasGroupMatches && (
          <button
            onClick={() => setFilter('group')}
            className={`px-2.5 py-1 rounded-md font-medium text-[10px] md:text-xs transition ${
              filter === 'group'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Group Stage ({groupMatches.length})
          </button>
        )}
        {hasQuarterFinals && (
          <button
            onClick={() => setFilter('quarter')}
            className={`px-2.5 py-1 rounded-md font-medium text-[10px] md:text-xs transition ${
              filter === 'quarter'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Quarter-finals ({quarterFinals.length})
          </button>
        )}
        {hasSemiFinals && (
          <button
            onClick={() => setFilter('semifinal')}
            className={`px-2.5 py-1 rounded-md font-medium text-[10px] md:text-xs transition ${
              filter === 'semifinal'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Semi-finals ({semiFinals.length})
          </button>
        )}
        {hasFinal && (
          <button
            onClick={() => setFilter('final')}
            className={`px-2.5 py-1 rounded-md font-medium text-[10px] md:text-xs transition ${
              filter === 'final'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Final ({finalMatches.length})
          </button>
        )}
      </div>

      {/* Group Stage Section */}
      {(filter === 'all' || filter === 'group') && groupMatches.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-center text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 py-1.5 rounded">Group Stage</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {groupMatches.sort(sortByDate).map((match) => (
              <CTMatchCard key={match.id} match={match} isKnockout={false} />
            ))}
          </div>
        </div>
      )}

      {/* Quarter-finals Section */}
      {(filter === 'all' || filter === 'quarter') && quarterFinals.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-center text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 py-1.5 rounded">Quarter-finals</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {quarterFinals.sort(sortByDate).map((match) => (
              <CTMatchCard key={match.id} match={match} isKnockout={true} />
            ))}
          </div>
        </div>
      )}

      {/* Semi-finals Section */}
      {(filter === 'all' || filter === 'semifinal') && semiFinals.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-center text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 py-1.5 rounded">Semi-finals</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {semiFinals.sort(sortByDate).map((match) => (
              <CTMatchCard key={match.id} match={match} isKnockout={true} />
            ))}
          </div>
        </div>
      )}

      {/* Final Section */}
{(filter === 'all' || filter === 'final') && finalMatches.length > 0 && (
  <div className="space-y-2">
    <h3 className="text-sm font-bold text-center text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 py-1.5 rounded">
      {tournamentYear === 2002 ? '🏆 Final (Rain Affected - Shared Trophy)' : '🏆 Final'}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {finalMatches.sort(sortByDate).map((match) => (
        <CTMatchCard key={match.id} match={match} isKnockout={true} />
      ))}
    </div>
  </div>
)}

      {displayMatches.length === 0 && filter !== 'all' && (
        <div className="text-center py-6 text-gray-500 text-xs">
          <p>No matches found for this filter.</p>
        </div>
      )}
    </div>
  );
};

const CTMatchCard: React.FC<{ match: Match; isKnockout?: boolean }> = ({ match, isKnockout }) => {
  const isAbandoned = match.is_abandoned === true;
  
  const formatScore = (runs: number | null, wickets: number | null, overs: number | null) => {
    if (runs === null && isAbandoned) return 'Abandoned';
    if (runs === null) return 'N/A';
    const wicketsStr = wickets !== null ? `/${wickets}` : '';
    const oversStr = overs !== null ? ` (${overs})` : '';
    return `${runs}${wicketsStr}${oversStr}`;
  };
  
  const getWinnerMessage = () => {
    if (isAbandoned) {
      if (match.result_note) return match.result_note.substring(0, 60);
      if (match.abandonment_reason) return `Abandoned: ${match.abandonment_reason}`;
      return 'Match abandoned';
    }
    if (!match.winner_name) return '';
    if (match.winner_margin && match.margin_type) {
      return `${match.winner_name} won by ${match.winner_margin} ${match.margin_type}`;
    }
    if (match.result_note) return match.result_note.substring(0, 60);
    return `${match.winner_name} won`;
  };

  const getMatchTypeBadge = () => {
    if (match.match_type === 'final') return { text: 'FINAL', color: 'bg-yellow-500' };
    if (match.match_type === 'semifinal') return { text: 'SF', color: 'bg-purple-500' };
    if (match.match_type === 'quarterfinal') {
      if (match.match_number === 1) return { text: 'PRELIM', color: 'bg-orange-500' };
      return { text: 'QF', color: 'bg-blue-500' };
    }
    if (match.match_type === 'group') return { text: 'GROUP', color: 'bg-green-500' };
    return null;
  };

  const badge = getMatchTypeBadge();

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-2.5 shadow-sm border max-w-md mx-auto w-full ${
      isKnockout ? 'border-blue-300 dark:border-blue-600' : 'border-gray-200 dark:border-gray-700'
    } ${isAbandoned ? 'bg-gray-100 dark:bg-gray-800/50' : ''}`}>
      {/* Match Header */}
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[9px] text-gray-500">
          {match.match_date ? new Date(match.match_date).toLocaleDateString() : 'Date TBD'}
        </span>
        <span className="text-[9px] text-gray-500 truncate max-w-[120px]">
          {match.venue?.split(',')[0] || 'Venue TBD'}
        </span>
        {badge && (
          <span className={`text-[8px] ${badge.color} text-white px-1.5 py-0.5 rounded-full font-semibold`}>
            {badge.text}
          </span>
        )}
      </div>
      
      {/* Team 1 */}
      <div className={`flex justify-between items-center p-1.5 rounded-md ${
        !isAbandoned && match.winner_name === match.team1_name ? 'bg-blue-50 dark:bg-blue-900/20' : ''
      }`}>
        <div className="flex items-center gap-1 flex-1 min-w-0">
          <span className="text-xs font-medium truncate">{match.team1_name}</span>
          {!isAbandoned && match.winner_name === match.team1_name && (
            <span className="text-blue-600 dark:text-blue-400 text-[9px] font-bold shrink-0">✓</span>
          )}
        </div>
        <span className="font-mono text-[10px] font-semibold shrink-0">
          {formatScore(match.team1_score, match.team1_wickets, match.team1_overs)}
        </span>
      </div>
      
      {/* Team 2 */}
      <div className={`flex justify-between items-center p-1.5 rounded-md mt-0.5 ${
        !isAbandoned && match.winner_name === match.team2_name ? 'bg-blue-50 dark:bg-blue-900/20' : ''
      }`}>
        <div className="flex items-center gap-1 flex-1 min-w-0">
          <span className="text-xs font-medium truncate">{match.team2_name}</span>
          {!isAbandoned && match.winner_name === match.team2_name && (
            <span className="text-blue-600 dark:text-blue-400 text-[9px] font-bold shrink-0">✓</span>
          )}
        </div>
        <span className="font-mono text-[10px] font-semibold shrink-0">
          {formatScore(match.team2_score, match.team2_wickets, match.team2_overs)}
        </span>
      </div>
      
      {/* Result Footer */}
      <div className="mt-1.5 pt-1.5 border-t border-gray-100 dark:border-gray-700 text-center">
        <span className="text-[9px] font-semibold text-blue-600 dark:text-blue-400 block truncate">
          {getWinnerMessage()}
        </span>
        {match.man_of_match_name && !isAbandoned && (
          <div className="text-[8px] text-yellow-600 dark:text-yellow-500 mt-0.5 truncate">
            🏅 {match.man_of_match_name}
          </div>
        )}
      </div>
    </div>
  );
};