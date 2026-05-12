// frontend/src/pages/Tournaments/T20WorldCupDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { worldCupAPI } from '../../services/api/worldCupAPI';
import { TournamentStats } from './components/TournamentStats';
import { TournamentAchievements } from './components/TournamentAchievements';

interface Tournament {
  id: number;
  year: number;
  tournament_type: string;
  host_country: string;
  winner_name: string;
  runner_up_name: string;
  winner_captain: string;
  player_of_tournament: string;
  total_matches: number;
  total_teams: number;
  final_match_venue: string;
  final_match_date: string;
}

interface Match {
  id: number;
  match_type: string;
  stage: string;
  team1_name: string;
  team2_name: string;
  team1_score: number | null;
  team2_score: number | null;
  team1_wickets: number | null;
  team2_wickets: number | null;
  team1_overs: number | null;
  team2_overs: number | null;
  winner_name: string;
  winner_margin: number | null;
  margin_type: string;
  venue: string;
  match_date: string;
  man_of_match_name: string;
  is_final: boolean;
  is_abandoned?: boolean;
  result_note?: string;
  abandonment_reason?: string;  
}

interface PointsTableEntry {
  group_name: string;
  team_name: string;
  matches_played: number;
  matches_won: number;
  matches_lost: number;
  matches_tied: number;
  matches_nr: number;
  points: number;
  net_run_rate: number;
}

type TabType = 'overview' | 'pointsTable' | 'matches' | 'stats' | 'achievements';;

export const T20WorldCupDetailPage: React.FC = () => {
  const { year } = useParams<{ year: string }>();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [pointsTable, setPointsTable] = useState<PointsTableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (year) {
      fetchT20Details();
    }
  }, [year]);

  const fetchT20Details = async () => {
    setLoading(true);
    setError(null);
    try {
      const yearNum = parseInt(year!);
      if (isNaN(yearNum)) throw new Error('Invalid year');
      
      console.log(`Fetching T20 World Cup data for year: ${yearNum}`);
      
      // Get tournament by year for T20 type
      const tournamentRes = await worldCupAPI.getTournamentByYear(yearNum, 't20');
      const tournamentData = tournamentRes.data;
      console.log('T20 Tournament found:', tournamentData);
      setTournament(tournamentData);
      
      // Get matches for this tournament
      const matchesRes = await worldCupAPI.getTournamentMatches(tournamentData.id);
      console.log(`Found ${matchesRes.data?.length || 0} matches`);
      setMatches(matchesRes.data || []);
      
      // Get points table
      const pointsRes = await worldCupAPI.getPointsTable(tournamentData.id);
      setPointsTable(pointsRes.data || []);
      
    } catch (error) {
      console.error('Error fetching T20 World Cup details:', error);
      setError('Failed to load T20 World Cup details. Please check if data exists.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="text-center py-20">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold mb-2">{error || 'T20 World Cup data not found'}</h2>
        <p className="text-gray-500 mb-4">Year: {year}</p>
        <Link to="/world-cup/t20" className="text-purple-600 hover:underline">
          ← Back to T20 World Cup
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

  return (
    <div 
      className="min-h-screen bg-[#f9fafb] dark:bg-[#0f172a] text-gray-900 dark:text-white" 
      style={{ backgroundImage: 'none' }}
    >
      {/* Header - T20 Purple Theme */}
      <div className="relative bg-gradient-to-r from-purple-700 to-pink-700 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to="/world-cup/t20" 
            className="inline-flex items-center text-white/80 hover:text-white text-sm mb-3 md:mb-4"
          >
            ← Back to T20 World Cup
          </Link>
          <div className="text-center">
            <img 
        src="/images/icc_t20i_wc_trophy.png"
        alt="ICC Cricket World Cup Trophy"
        className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 md:mb-4 object-contain"
    />
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
              ICC T20 World Cup {tournament.year}
            </h1>
            <p className="text-sm md:text-lg text-white/80">
              Hosted by {tournament.host_country} • {tournament.total_teams} Teams • {tournament.total_matches} Matches
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-1 border-b border-gray-200 dark:border-gray-700 mb-6 md:mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 md:px-6 md:py-3 font-semibold transition-all flex items-center gap-1 md:gap-2 text-sm md:text-base ${
                activeTab === tab.id
                  ? 'text-purple-600 border-b-2 border-purple-600'
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
              className="space-y-5 md:space-y-6"
            >
              <T20OverviewSection tournament={tournament} />
            </motion.div>
          )}

          {activeTab === 'pointsTable' && pointsTable.length > 0 && (
            <motion.div
              key="pointsTable"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <T20PointsTableSection pointsTable={pointsTable} />
            </motion.div>
          )}

          {activeTab === 'matches' && (
            <motion.div
              key="matches"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <T20MatchesSection matches={matches} />
            </motion.div>
          )}

          {activeTab === 'stats' && (
    <motion.div
        key="stats"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
    >
        <TournamentStats tournamentId={tournament.id} year={tournament.year} />
    </motion.div>
)}

{activeTab === 'achievements' && (
    <motion.div
        key="achievements"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
    >
        <TournamentAchievements tournamentId={tournament.id} year={tournament.year} />
    </motion.div>
)}

        </AnimatePresence>
      </div>
    </div>
  );
};

// T20 Overview Section Component
const T20OverviewSection: React.FC<{ tournament: Tournament }> = ({ tournament }) => {
  return (
    <div className="space-y-5 md:space-y-6">
      {/* Winner Card */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-5 md:p-8 text-white text-center">
        <img 
        src="/images/icc_t20i_wc_trophy.png"
        alt="ICC Cricket World Cup Trophy"
        className="w-26 h-20 md:w-20 md:h-20 mx-auto mb-3 md:mb-4 object-contain"
        />
        <h2 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">{tournament.winner_name || 'TBD'}</h2>
        <p className="text-base md:text-lg">T20 World Cup {tournament.year} Champions</p>
        {tournament.runner_up_name && (
          <p className="text-xs md:text-sm mt-2 text-white/80">
            Defeated {tournament.runner_up_name} in the final
          </p>
        )}
      </div>

      {/* Tournament Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg md:rounded-xl p-3 md:p-6 shadow text-center border border-gray-200 dark:border-gray-700">
          <h3 className="text-xs md:text-sm font-semibold text-gray-500 mb-0.5 md:mb-1">Host Country</h3>
          <p className="text-sm md:text-xl font-bold">{tournament.host_country}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg md:rounded-xl p-3 md:p-6 shadow text-center border border-gray-200 dark:border-gray-700">
          <h3 className="text-xs md:text-sm font-semibold text-gray-500 mb-0.5 md:mb-1">Total Matches</h3>
          <p className="text-sm md:text-xl font-bold">{tournament.total_matches}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg md:rounded-xl p-3 md:p-6 shadow text-center border border-gray-200 dark:border-gray-700">
          <h3 className="text-xs md:text-sm font-semibold text-gray-500 mb-0.5 md:mb-1">Teams</h3>
          <p className="text-sm md:text-xl font-bold">{tournament.total_teams}</p>
        </div>
      </div>

      {/* Captain and Player of Tournament */}
      {(tournament.winner_captain || tournament.player_of_tournament) && (
        <div className="bg-white dark:bg-gray-800 rounded-lg md:rounded-xl p-4 md:p-6 shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-base md:text-xl font-bold mb-3 md:mb-4">Key Figures</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {tournament.winner_captain && (
              <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <div className="text-xs text-gray-500">Winning Captain</div>
                  <div className="text-sm md:text-base font-semibold">{tournament.winner_captain}</div>
                </div>
              </div>
            )}
            {tournament.player_of_tournament && (
              <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <div className="text-xs text-gray-500">Player of the Tournament</div>
                  <div className="text-sm md:text-base font-semibold">{tournament.player_of_tournament}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Final Match Info */}
      {tournament.final_match_venue && (
        <div className="bg-white dark:bg-gray-800 rounded-lg md:rounded-xl p-4 md:p-6 shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-base md:text-xl font-bold mb-3 md:mb-4">Final Match</h3>
          <div className="flex flex-wrap items-center justify-between gap-3 md:gap-4">
            <div>
              <div className="text-xs text-gray-500">Venue</div>
              <div className="text-sm md:text-base font-semibold">{tournament.final_match_venue}</div>
            </div>
            {tournament.final_match_date && (
              <div>
                <div className="text-xs text-gray-500">Date</div>
                <div className="text-sm md:text-base font-semibold">{new Date(tournament.final_match_date).toLocaleDateString()}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// T20 Points Table Section
const T20PointsTableSection: React.FC<{ pointsTable: PointsTableEntry[] }> = ({ pointsTable }) => {
  if (!pointsTable || pointsTable.length === 0) {
    return (
      <div className="text-center py-8 md:py-12 text-gray-500">
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

  // Group by group_name
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
    <div className="space-y-6 md:space-y-8">
      {Object.entries(groups).map(([groupName, entries]) => (
        <div key={groupName} className="bg-white dark:bg-gray-800 rounded-lg md:rounded-xl shadow overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="bg-gray-100 dark:bg-gray-700 px-4 md:px-6 py-2 md:py-3">
            <h3 className="font-bold text-base md:text-lg">{groupName}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-3 md:px-4 py-2 md:py-3 text-left">Team</th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-center">MP</th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-center">W</th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-center">L</th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-center">T</th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-center">NR</th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-center">Pts</th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-center">NRR</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, idx) => (
                  <tr key={idx} className={`border-b border-gray-100 dark:border-gray-700 ${
                    idx < 2 ? 'bg-purple-50 dark:bg-purple-900/10' : ''
                  }`}>
                    <td className="px-3 md:px-4 py-2 md:py-3 font-medium text-xs md:text-sm">{entry.team_name}</td>
                    <td className="px-2 md:px-4 py-2 md:py-3 text-center">{entry.matches_played}</td>
                    <td className="px-2 md:px-4 py-2 md:py-3 text-center text-green-600 font-medium">{entry.matches_won}</td>
                    <td className="px-2 md:px-4 py-2 md:py-3 text-center text-red-600">{entry.matches_lost}</td>
                    <td className="px-2 md:px-4 py-2 md:py-3 text-center">{entry.matches_tied || 0}</td>
                    <td className="px-2 md:px-4 py-2 md:py-3 text-center">{entry.matches_nr || 0}</td>
                    <td className="px-2 md:px-4 py-2 md:py-3 text-center font-bold">{entry.points}</td>
                    <td className="px-2 md:px-4 py-2 md:py-3 text-center font-mono">{formatNRR(entry.net_run_rate)}</td>
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

// T20WorldCupDetailPage.tsx - Complete T20MatchesSection Component

const T20MatchesSection: React.FC<{ matches: Match[] }> = ({ matches }) => {
  const [filter, setFilter] = useState<'all' | 'group' | 'super8' | 'super10' | 'super12' | 'knockout'>('all');

  if (!matches || matches.length === 0) {
    return (
      <div className="text-center py-8 md:py-12 text-gray-500">
        <p>Match data not available for this tournament.</p>
      </div>
    );
  }

  // Separate matches by type
  const groupMatches = matches.filter(m => m.match_type === 'group' || m.match_type === 'group_stage');
  const superEightMatches = matches.filter(m => m.match_type === 'super_eight');
  const superTenMatches = matches.filter(m => m.match_type === 'super_ten');
  const superTwelveMatches = matches.filter(m => m.match_type === 'super_twelve');
  const knockoutMatches = matches.filter(m => m.match_type === 'semifinal' || m.match_type === 'final');

  let displayMatches: Match[] = [];
  if (filter === 'all') displayMatches = matches;
  if (filter === 'group') displayMatches = groupMatches;
  if (filter === 'super8') displayMatches = superEightMatches;
  if (filter === 'super10') displayMatches = superTenMatches;
  if (filter === 'super12') displayMatches = superTwelveMatches;
  if (filter === 'knockout') displayMatches = knockoutMatches;

  // Sort by date
  displayMatches = [...displayMatches].sort((a, b) => 
    new Date(a.match_date).getTime() - new Date(b.match_date).getTime()
  );

  const hasSuper8 = superEightMatches.length > 0;
  const hasSuper10 = superTenMatches.length > 0;
  const hasSuper12 = superTwelveMatches.length > 0;

  return (
    <div className="space-y-5 md:space-y-6">
      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-medium text-xs md:text-sm transition ${
            filter === 'all'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}
        >
          All Matches ({matches.length})
        </button>
        <button
          onClick={() => setFilter('group')}
          className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-medium text-xs md:text-sm transition ${
            filter === 'group'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}
        >
          Group Stage ({groupMatches.length})
        </button>
        {hasSuper8 && (
          <button
            onClick={() => setFilter('super8')}
            className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-medium text-xs md:text-sm transition ${
              filter === 'super8'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
          >
            Super 8s ({superEightMatches.length})
          </button>
        )}
        {hasSuper10 && (
          <button
            onClick={() => setFilter('super10')}
            className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-medium text-xs md:text-sm transition ${
              filter === 'super10'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
          >
            Super 10s ({superTenMatches.length})
          </button>
        )}
        {hasSuper12 && (
          <button
            onClick={() => setFilter('super12')}
            className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-medium text-xs md:text-sm transition ${
              filter === 'super12'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
          >
            Super 12s ({superTwelveMatches.length})
          </button>
        )}
        <button
          onClick={() => setFilter('knockout')}
          className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-medium text-xs md:text-sm transition ${
            filter === 'knockout'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}
        >
          Knockouts ({knockoutMatches.length})
        </button>
      </div>

      {/* Knockout Stage Section */}
      {(filter === 'all' || filter === 'knockout') && knockoutMatches.length > 0 && (
        <div className="space-y-3 md:space-y-4">
          <h3 className="text-lg md:text-xl font-bold text-center text-gray-700 dark:text-gray-300"> Knockout Stage</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {knockoutMatches.map((match) => (
              <T20MatchCard key={match.id} match={match} isKnockout={true} />
            ))}
          </div>
        </div>
      )}

      {/* Super 12s Stage Section */}
      {(filter === 'all' || filter === 'super12') && superTwelveMatches.length > 0 && (
        <div className="space-y-3 md:space-y-4">
          <h3 className="text-lg md:text-xl font-bold text-center text-gray-700 dark:text-gray-300"> Super 12s</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {superTwelveMatches.map((match) => (
              <T20MatchCard key={match.id} match={match} isKnockout={false} />
            ))}
          </div>
        </div>
      )}

      {/* Super 10s Stage Section */}
      {(filter === 'all' || filter === 'super10') && superTenMatches.length > 0 && (
        <div className="space-y-3 md:space-y-4">
          <h3 className="text-lg md:text-xl font-bold text-center text-gray-700 dark:text-gray-300"> Super 10s</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {superTenMatches.map((match) => (
              <T20MatchCard key={match.id} match={match} isKnockout={false} />
            ))}
          </div>
        </div>
      )}

      {/* Super 8s Stage Section */}
      {(filter === 'all' || filter === 'super8') && superEightMatches.length > 0 && (
        <div className="space-y-3 md:space-y-4">
          <h3 className="text-lg md:text-xl font-bold text-center text-gray-700 dark:text-gray-300"> Super 8s</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {superEightMatches.map((match) => (
              <T20MatchCard key={match.id} match={match} isKnockout={false} />
            ))}
          </div>
        </div>
      )}

      {/* Group Stage Section */}
      {(filter === 'all' || filter === 'group') && groupMatches.length > 0 && (
        <div className="space-y-3 md:space-y-4">
          <h3 className="text-lg md:text-xl font-bold text-center text-gray-700 dark:text-gray-300">📋 Group Stage</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {groupMatches.map((match) => (
              <T20MatchCard key={match.id} match={match} isKnockout={false} />
            ))}
          </div>
        </div>
      )}

      {/* Show if no matches match the filter */}
      {displayMatches.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No matches found for this filter.</p>
        </div>
      )}
    </div>
  );
};

// T20 Match Card Component
const T20MatchCard: React.FC<{ match: Match; isKnockout?: boolean }> = ({ match, isKnockout }) => {
  const isAbandoned = match.is_abandoned === true;
  
  const formatScore = (runs: number | null, wickets: number | null, overs: number | null) => {
    if (runs === null && isAbandoned) return 'Abandoned';
    if (runs === null) return 'N/A';
    const wicketsStr = wickets !== null ? `/${wickets}` : '';
    const oversStr = overs !== null ? ` (${overs} ov)` : '';
    return `${runs}${wicketsStr}${oversStr}`;
  };
  
  const getWinnerMessage = () => {
    if (isAbandoned) {
      if (match.result_note) return match.result_note;
      if (match.abandonment_reason) return `Match abandoned due to ${match.abandonment_reason}`;
      return 'Match abandoned';
    }
    if (!match.winner_name) return '';
    if (match.winner_margin && match.margin_type) {
      return `${match.winner_name} won by ${match.winner_margin} ${match.margin_type}`;
    }
    if (match.result_note) return match.result_note;
    return `${match.winner_name} won`;
  };
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-3 md:p-4 shadow border ${
      isKnockout ? 'border-purple-400 dark:border-purple-600' : 'border-gray-200 dark:border-gray-700'
    } ${isAbandoned ? 'bg-gray-100 dark:bg-gray-800/50' : ''}`}>
      <div className="text-center mb-2 md:mb-3">
        <span className="text-xs text-gray-500">{match.match_date ? new Date(match.match_date).toLocaleDateString() : 'Date TBD'}</span>
        <span className="mx-1 md:mx-2">•</span>
        <span className="text-xs text-gray-500">{match.venue?.split(',')[0] || 'Venue TBD'}</span>
        {match.match_type === 'final' && !isAbandoned && (
          <span className="ml-1 md:ml-2 text-xs bg-yellow-500 text-white px-1.5 py-0.5 rounded-full">FINAL</span>
        )}
        {match.match_type === 'semifinal' && !isAbandoned && (
          <span className="ml-1 md:ml-2 text-xs bg-purple-500 text-white px-1.5 py-0.5 rounded-full">SF</span>
        )}
      </div>
      
      <div className="space-y-1 md:space-y-2">
        <div className={`flex justify-between items-center p-1.5 rounded ${
          !isAbandoned && match.winner_name === match.team1_name ? 'bg-purple-50 dark:bg-purple-900/20' : ''
        }`}>
          <div className="flex items-center gap-1 md:gap-2">
            <span className="text-sm md:text-base font-medium">{match.team1_name}</span>
            {!isAbandoned && match.winner_name === match.team1_name && (
              <span className="text-purple-600 text-xs font-semibold">✓</span>
            )}
          </div>
          <div className="text-right">
            <span className="font-mono font-semibold text-xs md:text-sm">
              {formatScore(match.team1_score, match.team1_wickets, match.team1_overs)}
            </span>
          </div>
        </div>
        
        <div className={`flex justify-between items-center p-1.5 rounded ${
          !isAbandoned && match.winner_name === match.team2_name ? 'bg-purple-50 dark:bg-purple-900/20' : ''
        }`}>
          <div className="flex items-center gap-1 md:gap-2">
            <span className="text-sm md:text-base font-medium">{match.team2_name}</span>
            {!isAbandoned && match.winner_name === match.team2_name && (
              <span className="text-purple-600 text-xs font-semibold">✓</span>
            )}
          </div>
          <div className="text-right">
            <span className="font-mono font-semibold text-xs md:text-sm">
              {formatScore(match.team2_score, match.team2_wickets, match.team2_overs)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-2 md:mt-3 pt-1.5 md:pt-2 border-t border-gray-100 dark:border-gray-700 text-center">
        <span className={`text-xs md:text-sm font-semibold ${isAbandoned ? 'text-orange-600' : 'text-purple-600'}`}>
          {getWinnerMessage()}
        </span>
        {match.man_of_match_name && !isAbandoned && (
          <div className="text-xs text-gray-500 mt-1">
            🏅 Player of the Match: {match.man_of_match_name}
          </div>
        )}
      </div>
    </div>
  );
};