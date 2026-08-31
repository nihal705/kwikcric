// frontend/src/pages/Tournaments/WTCDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { worldCupAPI, Tournament, Match, PointsTableEntry } from '../../services/api/worldCupAPI';
import { WTCTournamentStats } from './components/WTCTournamentStats';
import { TournamentAchievements } from './components/TournamentAchievements';
import { API_BASE_URL } from '../../services/api/config';
import axios from 'axios';

type TabType = 'overview' | 'pointsTable' | 'matches' | 'stats' | 'achievements';

interface Batter {
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  how_out: string;
  not_out: boolean;
}

interface Bowler {
  name: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
}

interface InningsData {
  id: number;
  innings_number: number;
  batting_team_name: string;
  runs: number;
  wickets: number;
  overs: number;
  declaration: boolean;
  follow_on: boolean;
  extras: number;
  batting: Batter[];
  bowling: Bowler[];
}

export const WTCDetailPage: React.FC = () => {
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
      
      const tournamentRes = await worldCupAPI.getTournamentByYear(yearNum, 'test');
      const tournamentData = tournamentRes.data;
      setTournament(tournamentData);
      
      const matchesRes = await worldCupAPI.getTournamentMatches(tournamentData.id);
      setMatches(matchesRes.data || []);
      
      const pointsRes = await worldCupAPI.getPointsTable(tournamentData.id);
      setPointsTable(pointsRes.data || []);
    } catch (error) {
      console.error('Error fetching WTC details:', error);
      setError('Failed to load tournament details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-teal-500 border-t-transparent" />
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-3xl mb-3">⚠️</div>
        <h2 className="text-lg font-bold mb-2">{error || 'Tournament not found'}</h2>
        <Link to="/wtc" className="text-teal-600 hover:underline text-sm">← Back to WTC</Link>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '' },
    { id: 'pointsTable', label: 'Standings', icon: '' },
    { id: 'matches', label: 'Matches', icon: '' },
    { id: 'stats', label: 'Stats', icon: '' },
    { id: 'achievements', label: 'Moments', icon: '' },
  ];

  const cycleYear = `${tournament.year - 2}-${tournament.year}`;

  return (
    <div className="space-y-5 min-h-screen bg-[#f9fafb] dark:bg-[#0f172a] text-gray-900 dark:text-white p-4 md:p-6" style={{ backgroundImage: 'none' }}>
      <div className="bg-gradient-to-r from-teal-700 to-emerald-700 py-5">
        <div className="max-w-7xl mx-auto px-4">
          <Link to="/wtc" className="inline-flex items-center text-white/80 hover:text-white text-xs mb-2">← Back to WTC</Link>
          <div className="text-center">
            <div className="text-3xl mb-1">
              <img 
                  src="/images/icc_wtc.png"
                  alt="ICC WTC"
                  className="w-30 h-34 md:w-22 md:h-24 mx-auto mb-3 md:mb-4 object-contain"
              />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white mb-1">WTC {cycleYear}</h1>
            <p className="text-xs text-teal-100">Hosted by {tournament.host_country} • Final Match Only</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-wrap justify-center gap-0.5 border-b border-gray-200 dark:border-gray-700 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-3 py-1.5 text-xs font-semibold transition-all flex items-center gap-1 ${
                activeTab === tab.id
                  ? 'text-teal-600 border-b-2 border-teal-600'
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
            <motion.div key="overview" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
              <WTCOverview tournament={tournament} cycleYear={cycleYear} />
            </motion.div>
          )}
          {activeTab === 'pointsTable' && pointsTable.length > 0 && (
            <motion.div key="pointsTable" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
              <WTCPointsTable pointsTable={pointsTable} />
            </motion.div>
          )}
          {activeTab === 'matches' && (
  <motion.div key="matches" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
    <WTCMatchesSection matches={matches} />
    <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-center text-xs text-gray-500">
      📌 <span className="font-semibold">Note:</span> The World Test Championship consists of 60+ league matches played over 2 years. 
      The <strong>Standings</strong> tab shows the complete league results with PCT%. 
      Only the final match is displayed here.
    </div>
  </motion.div>
)}
          {activeTab === 'stats' && (
            <motion.div key="stats" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
              <WTCTournamentStats tournamentId={tournament.id}  />
            </motion.div>
          )}
          {activeTab === 'achievements' && (
  <motion.div key="achievements" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
    <TournamentAchievements tournamentId={tournament.id} year={tournament.year} tournamentType="test" />
  </motion.div>
)}
        </AnimatePresence>
      </div>
    </div>
  );
};

const WTCOverview: React.FC<{ tournament: Tournament; cycleYear: string }> = ({ tournament, cycleYear }) => {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg p-5 text-white text-center">
        <h2 className="text-2xl font-bold mb-1">{tournament.winner_name || 'TBD'}</h2>
        <p className="text-sm">WTC {cycleYear} Champions</p>
        {tournament.runner_up_name && (
          <p className="text-xs mt-1 text-white/80">Defeated {tournament.runner_up_name} in the final</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow border border-gray-200 dark:border-gray-700">
          <div className="text-2xl mb-0.5"></div>
          <h3 className="text-[10px] font-semibold text-gray-500">Host</h3>
          <p className="text-sm font-bold">{tournament.host_country}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow border border-gray-200 dark:border-gray-700">
          <div className="text-2xl mb-0.5"></div>
          <h3 className="text-[10px] font-semibold text-gray-500">Captain</h3>
          <p className="text-sm font-bold">{tournament.winner_captain || 'TBD'}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow border border-gray-200 dark:border-gray-700">
          <div className="text-2xl mb-0.5"></div>
          <h3 className="text-[10px] font-semibold text-gray-500">Player of Tournament</h3>
          <p className="text-sm font-bold">{tournament.player_of_tournament || 'TBD'}</p>
        </div>
      </div>

      {tournament.final_match_venue && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-bold mb-2">Final Match</h3>
          <div className="flex justify-between">
            <div><div className="text-[10px] text-gray-500">Venue</div><div className="text-sm font-semibold">{tournament.final_match_venue}</div></div>
            {tournament.final_match_date && <div><div className="text-[10px] text-gray-500">Date</div><div className="text-sm font-semibold">{new Date(tournament.final_match_date).toLocaleDateString()}</div></div>}
          </div>
        </div>
      )}
    </div>
  );
};

// WTCDetailPage.tsx - Replace the WTCPointsTable component

const WTCPointsTable: React.FC<{ pointsTable: PointsTableEntry[] }> = ({ pointsTable }) => {
  // Sort by PCT% (net_run_rate) descending, then by points
  const sorted = [...pointsTable].sort((a, b) => {
    const pctA = typeof a.net_run_rate === 'string' ? parseFloat(a.net_run_rate) : (a.net_run_rate || 0);
    const pctB = typeof b.net_run_rate === 'string' ? parseFloat(b.net_run_rate) : (b.net_run_rate || 0);
    
    if (pctB !== pctA) return pctB - pctA;
    return b.points - a.points;
  });
  
  const formatPCT = (value: any): string => {
    if (value === null || value === undefined) return '0.00';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '0.00';
    return num.toFixed(2);
  };

  return (
    <div className="space-y-3">
      {/* Note about qualification */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 text-center text-xs text-gray-600 dark:text-gray-400 border border-blue-200 dark:border-blue-800">
        📌 <span className="font-semibold">Note:</span> Top two teams based on PCT% qualify for the one-off Test final.
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-3 py-2 text-left">Rank</th>
                <th className="px-3 py-2 text-left">Team</th>
                <th className="px-3 py-2 text-center">MP</th>
                <th className="px-3 py-2 text-center">W</th>
                <th className="px-3 py-2 text-center">L</th>
                <th className="px-3 py-2 text-center">D</th>
                <th className="px-3 py-2 text-center">Pts</th>
                <th className="px-3 py-2 text-center">PCT%</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((entry, idx) => {
                const isTop2 = idx < 2;
                return (
                  <tr 
                    key={idx} 
                    className={`border-b border-gray-100 dark:border-gray-700 ${
                      isTop2 ? 'bg-green-50 dark:bg-green-900/20' : ''
                    }`}
                  >
                    <td className="px-3 py-2 text-center font-bold">
                      {idx === 0 && '🥇'}
                      {idx === 1 && '🥈'}
                      {idx > 1 && `#${idx + 1}`}
                    </td>
                    <td className={`px-3 py-2 font-medium ${isTop2 ? 'font-bold text-green-700 dark:text-green-400' : ''}`}>
                      {entry.team_name}
                      {isTop2 && <span className="ml-1 text-[8px] bg-green-500 text-white px-1 py-0.5 rounded-full">Finalist</span>}
                    </td>
                    <td className="px-3 py-2 text-center">{entry.matches_played}</td>
                    <td className="px-3 py-2 text-center text-green-600">{entry.matches_won}</td>
                    <td className="px-3 py-2 text-center text-red-600">{entry.matches_lost}</td>
                    <td className="px-3 py-2 text-center text-yellow-600">{entry.matches_tied || 0}</td>
                    <td className="px-3 py-2 text-center font-bold">{entry.points}</td>
                    <td className={`px-3 py-2 text-center font-mono font-bold ${isTop2 ? 'text-green-700 dark:text-green-400' : ''}`}>
                      {formatPCT(entry.net_run_rate)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const WTCMatchesSection: React.FC<{ matches: Match[] }> = ({ matches }) => {
  const [inningsData, setInningsData] = useState<InningsData[]>([]);
  const [activeInnings, setActiveInnings] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (matches.length > 0 && matches[0]?.id) {
      fetchInningsData(matches[0].id);
    }
  }, [matches]);

  const fetchInningsData = async (matchId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/test-match/${matchId}/innings`);
      
      if (response.data.success && response.data.data) {
        setInningsData(response.data.data);
      } else {
        setError('No innings data available');
      }
    } catch (err: any) {
      console.error('Error fetching innings data:', err);
      setError(err.message || 'Failed to load innings data');
    } finally {
      setIsLoading(false);
    }
  };

  if (!matches.length) {
    return (
      <div className="text-center py-6 text-gray-500 text-xs">
        <p>No match data available</p>
      </div>
    );
  }

  const match = matches[0];

  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-teal-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6 text-red-500 text-xs">
        <p>Error loading innings data: {error}</p>
        <button 
          onClick={() => fetchInningsData(match.id)} 
          className="mt-2 px-3 py-1 bg-teal-500 text-white rounded text-xs"
        >
          Retry
        </button>
      </div>
    );
  }

  if (inningsData.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 text-xs">
        <p>No innings data available for this match.</p>
      </div>
    );
  }

  const currentInnings = inningsData.find(inn => inn.innings_number === activeInnings);

  // Innings labels
  const getInningsLabel = (inningsNumber: number) => {
    if (inningsNumber === 1) return '1st Innings';
    if (inningsNumber === 2) return '2nd Innings';
    if (inningsNumber === 3) return '3rd Innings';
    return '4th Innings';
  };

  // Get bowling team name
  const getBowlingTeam = (inningsNumber: number) => {
    if (inningsNumber === 1 || inningsNumber === 3) return 'New Zealand';
    return 'India';
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden max-w-5xl mx-auto">
        {/* Match Header */}
        <div className="bg-gray-100 dark:bg-gray-700/50 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-sm text-gray-500">
              {new Date(match.match_date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })} • {match.venue}
            </div>
            <div className="text-xs font-semibold text-gray-400 mt-0.5">
              Final • ICC World Test Championship
            </div>
          </div>
        </div>

        {/* Innings Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 overflow-x-auto">
          {inningsData.map((inn) => (
            <button
              key={inn.innings_number}
              onClick={() => setActiveInnings(inn.innings_number)}
              className={`px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                activeInnings === inn.innings_number
                  ? 'bg-white dark:bg-gray-700 text-teal-600 dark:text-teal-400 border-b-2 border-teal-500'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              {getInningsLabel(inn.innings_number)}
              <span className="ml-1 text-xs text-gray-400">
                ({inn.runs}/{inn.wickets})
              </span>
            </button>
          ))}
        </div>

        {/* Innings Content */}
        {currentInnings && (
          <div className="p-5">
            {/* Innings Header */}
            <div className="mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                    {currentInnings.batting_team_name}
                  </h3>
                  <p className="text-xs text-gray-500">Batting</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800 dark:text-white">
                    {currentInnings.runs}/{currentInnings.wickets}
                  </div>
                  <div className="text-xs text-gray-500">{currentInnings.overs} overs</div>
                  <div className="text-xs text-gray-400">Extras: {currentInnings.extras || 0}</div>
                </div>
              </div>
            </div>

            {/* Batting Table */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Batting</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-3 py-2 text-left">Batter</th>
                      <th className="px-3 py-2 text-left">How Out</th>
                      <th className="px-3 py-2 text-center">R</th>
                      <th className="px-3 py-2 text-center">B</th>
                      <th className="px-3 py-2 text-center">4s</th>
                      <th className="px-3 py-2 text-center">6s</th>
                      <th className="px-3 py-2 text-center">SR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentInnings.batting && currentInnings.batting.length > 0 ? (
                      currentInnings.batting.map((batter, i) => (
                        <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                          <td className="px-3 py-2 font-medium">
                            {batter.name}
                            {batter.not_out && <span className="text-green-600 text-xs ml-1">*</span>}
                          </td>
                          <td className="px-3 py-2 text-gray-500 text-xs">{batter.how_out || 'not out'}</td>
                          <td className="px-3 py-2 text-center font-bold">{batter.runs}</td>
                          <td className="px-3 py-2 text-center">{batter.balls || '-'}</td>
                          <td className="px-3 py-2 text-center">{batter.fours || 0}</td>
                          <td className="px-3 py-2 text-center">{batter.sixes || 0}</td>
                          <td className="px-3 py-2 text-center">
                            {batter.balls ? ((batter.runs / batter.balls) * 100).toFixed(1) : '-'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-3 py-2 text-center text-gray-500">No batting data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bowling Table */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Bowling • {getBowlingTeam(currentInnings.innings_number)}
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-3 py-2 text-left">Bowler</th>
                      <th className="px-3 py-2 text-center">O</th>
                      <th className="px-3 py-2 text-center">M</th>
                      <th className="px-3 py-2 text-center">R</th>
                      <th className="px-3 py-2 text-center">W</th>
                      <th className="px-3 py-2 text-center">Econ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentInnings.bowling && currentInnings.bowling.length > 0 ? (
                      currentInnings.bowling.map((bowler, i) => (
                        <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                          <td className="px-3 py-2 font-medium">{bowler.name}</td>
                          <td className="px-3 py-2 text-center">{bowler.overs}</td>
                          <td className="px-3 py-2 text-center">{bowler.maidens || 0}</td>
                          <td className="px-3 py-2 text-center">{bowler.runs}</td>
                          <td className="px-3 py-2 text-center font-bold">{bowler.wickets}</td>
                          <td className="px-3 py-2 text-center">
                            {(bowler.runs / parseFloat(bowler.overs.toString())).toFixed(2)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-3 py-2 text-center text-gray-500">No bowling data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Result */}
        <div className="bg-gray-50 dark:bg-gray-700/30 px-5 py-3 border-t border-gray-200 dark:border-gray-700 text-center">
          <div className="text-base font-bold text-green-600 dark:text-green-400">
            {match.winner_name} won by {match.winner_margin} {match.margin_type}
          </div>
          {match.man_of_match_name && (
            <div className="text-xs text-yellow-600 dark:text-yellow-500 mt-1">
              🏅 Player of the Match: {match.man_of_match_name}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};