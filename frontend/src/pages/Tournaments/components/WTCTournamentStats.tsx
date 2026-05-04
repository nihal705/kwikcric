// frontend/src/pages/Tournaments/components/WTCTournamentStats.tsx
import React, { useState, useEffect } from 'react';
import { worldCupAPI } from '../../../services/api/worldCupAPI';
import axios from 'axios';

interface WTCTournamentStatsProps {
  tournamentId: number;
}

interface AdditionalStats {
  wicketKeepers: any[];
  mostCatches: any[];
  highestScores: any[];
  bestBowlingInnings: any[];
  bestBattingAverages: any[];
  bestBowlingAverages: any[];
  highestTeamTotals: any[];
  lowestTeamTotals: any[];
  highestRunChases: any[];
}

export const WTCTournamentStats: React.FC<WTCTournamentStatsProps> = ({ tournamentId }) => {
  const [stats, setStats] = useState<any>(null);
  const [additionalStats, setAdditionalStats] = useState<AdditionalStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'batting' | 'bowling' | 'fielding' | 'team'>('batting');

  useEffect(() => {
    fetchStats();
  }, [tournamentId]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Fetch main stats (top runs, top wickets)
      const response = await worldCupAPI.getTournamentStats(tournamentId);
      console.log('WTC Stats data:', response.data);
      setStats(response.data);

      // Fetch additional stats from the API
      try {
        const additionalResponse = await axios.get(`http://localhost:3000/api/wtc/${tournamentId}/additional-stats`);
        console.log('Additional WTC Stats:', additionalResponse.data);
        if (additionalResponse.data.success) {
          setAdditionalStats(additionalResponse.data.data);
        }
      } catch (err) {
        console.log('No additional stats endpoint yet - using empty data');
        setAdditionalStats({
          wicketKeepers: [],
          mostCatches: [],
          highestScores: [],
          bestBowlingInnings: [],
          bestBattingAverages: [],
          bestBowlingAverages: [],
          highestTeamTotals: [],
          lowestTeamTotals: [],
          highestRunChases: []
        });
      }
    } catch (error) {
      console.error('Error fetching WTC stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-teal-500 border-t-transparent" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        <p>No statistics available for this WTC cycle.</p>
      </div>
    );
  }

  const { topRuns = [], topWickets = [] } = stats;
  const additional = additionalStats || {
    wicketKeepers: [],
    mostCatches: [],
    highestScores: [],
    bestBowlingInnings: [],
    bestBattingAverages: [],
    bestBowlingAverages: [],
    highestTeamTotals: [],
    lowestTeamTotals: [],
    highestRunChases: []
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-1 border-b border-gray-200 dark:border-gray-700 pb-2">
        <button
          onClick={() => setActiveTab('batting')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition ${
            activeTab === 'batting'
              ? 'bg-teal-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Batting
        </button>
        <button
          onClick={() => setActiveTab('bowling')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition ${
            activeTab === 'bowling'
              ? 'bg-teal-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Bowling
        </button>
        <button
          onClick={() => setActiveTab('fielding')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition ${
            activeTab === 'fielding'
              ? 'bg-teal-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Fielding
        </button>
        <button
          onClick={() => setActiveTab('team')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition ${
            activeTab === 'team'
              ? 'bg-teal-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Team Statistics
        </button>
      </div>

      {/* Batting Tab */}
      {activeTab === 'batting' && (
        <div className="space-y-5">
          {/* Most Runs */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-500 to-emerald-500 px-4 py-2">
              <h3 className="font-bold text-white text-sm">Most Runs</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-3 py-2 text-left">Rank</th>
                    <th className="px-3 py-2 text-left">Player</th>
                    <th className="px-3 py-2 text-left">Team</th>
                    <th className="px-3 py-2 text-center">Matches</th>
                    <th className="px-3 py-2 text-center">Runs</th>
                    <th className="px-3 py-2 text-center">Average</th>
                    <th className="px-3 py-2 text-center">100s</th>
                    <th className="px-3 py-2 text-center">50s</th>
                    <th className="px-3 py-2 text-center">Highest</th>
                  </tr>
                </thead>
                <tbody>
                  {topRuns.map((player: any, idx: number) => (
                    <tr key={idx} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="px-3 py-2 font-bold text-gray-600">{idx + 1}</td>
                      <td className="px-3 py-2 font-medium">{player.player_name}</td>
                      <td className="px-3 py-2 text-gray-500">{player.team_name || '-'}</td>
                      <td className="px-3 py-2 text-center">{player.matches || '-'}</td>
                      <td className="px-3 py-2 text-center font-bold text-teal-600">{player.runs}</td>
                      <td className="px-3 py-2 text-center">{player.average || '-'}</td>
                      <td className="px-3 py-2 text-center">{player.centuries || 0}</td>
                      <td className="px-3 py-2 text-center">{player.fifties || 0}</td>
                      <td className="px-3 py-2 text-center">{player.highest_score || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Highest Individual Scores */}
          {additional.highestScores && additional.highestScores.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-500 to-emerald-500 px-4 py-2">
                <h3 className="font-bold text-white text-sm">Highest Individual Scores</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="px-3 py-2 text-left">Runs</th>
                      <th className="px-3 py-2 text-left">Player</th>
                      <th className="px-3 py-2 text-left">Team</th>
                      <th className="px-3 py-2 text-center">Balls</th>
                      <th className="px-3 py-2 text-center">4s</th>
                      <th className="px-3 py-2 text-center">6s</th>
                      <th className="px-3 py-2 text-left">Opposition</th>
                      <th className="px-3 py-2 text-left">Venue</th>
                      <th className="px-3 py-2 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {additional.highestScores.map((score, idx) => (
                      <tr key={idx} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="px-3 py-2 font-bold text-teal-600">{score.runs}</td>
                        <td className="px-3 py-2 font-medium">{score.player_name}</td>
                        <td className="px-3 py-2 text-gray-500">{score.team_name}</td>
                        <td className="px-3 py-2 text-center">{score.balls}</td>
                        <td className="px-3 py-2 text-center">{score.fours}</td>
                        <td className="px-3 py-2 text-center">{score.sixes}</td>
                        <td className="px-3 py-2 text-left">{score.opposition}</td>
                        <td className="px-3 py-2 text-left text-xs">{score.venue}</td>
                        <td className="px-3 py-2 text-left text-xs">{score.match_date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Best Batting Averages */}
          {additional.bestBattingAverages && additional.bestBattingAverages.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-500 to-emerald-500 px-4 py-2">
                <h3 className="font-bold text-white text-sm">Best Batting Averages</h3>
                <p className="text-[9px] text-white/70">Qualification: Minimum 10 innings</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="px-3 py-2 text-left">Rank</th>
                      <th className="px-3 py-2 text-left">Player</th>
                      <th className="px-3 py-2 text-left">Team</th>
                      <th className="px-3 py-2 text-center">Matches</th>
                      <th className="px-3 py-2 text-center">Runs</th>
                      <th className="px-3 py-2 text-center">Average</th>
                      <th className="px-3 py-2 text-center">Highest</th>
                      <th className="px-3 py-2 text-center">100s</th>
                      <th className="px-3 py-2 text-center">50s</th>
                    </tr>
                  </thead>
                  <tbody>
                    {additional.bestBattingAverages.map((player, idx) => (
                      <tr key={idx} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="px-3 py-2 font-bold text-gray-600">{idx + 1}</td>
                        <td className="px-3 py-2 font-medium">{player.player_name}</td>
                        <td className="px-3 py-2 text-gray-500">{player.team_name}</td>
                        <td className="px-3 py-2 text-center">{player.matches}</td>
                        <td className="px-3 py-2 text-center font-bold text-teal-600">{player.runs}</td>
                        <td className="px-3 py-2 text-center font-bold">{player.average}</td>
                        <td className="px-3 py-2 text-center">{player.highest_score}</td>
                        <td className="px-3 py-2 text-center">{player.centuries}</td>
                        <td className="px-3 py-2 text-center">{player.fifties}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bowling Tab */}
      {activeTab === 'bowling' && (
        <div className="space-y-5">
          {/* Most Wickets */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-500 to-emerald-500 px-4 py-2">
              <h3 className="font-bold text-white text-sm">Most Wickets</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-3 py-2 text-left">Rank</th>
                    <th className="px-3 py-2 text-left">Player</th>
                    <th className="px-3 py-2 text-left">Team</th>
                    <th className="px-3 py-2 text-center">Matches</th>
                    <th className="px-3 py-2 text-center">Wickets</th>
                    <th className="px-3 py-2 text-center">Average</th>
                    <th className="px-3 py-2 text-center">Economy</th>
                    <th className="px-3 py-2 text-center">5WI</th>
                  </tr>
                </thead>
                <tbody>
                  {topWickets.map((player: any, idx: number) => (
                    <tr key={idx} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="px-3 py-2 font-bold text-gray-600">{idx + 1}</td>
                      <td className="px-3 py-2 font-medium">{player.player_name}</td>
                      <td className="px-3 py-2 text-gray-500">{player.team_name || '-'}</td>
                      <td className="px-3 py-2 text-center">{player.matches || '-'}</td>
                      <td className="px-3 py-2 text-center font-bold text-teal-600">{player.wickets}</td>
                      <td className="px-3 py-2 text-center">{player.average || '-'}</td>
                      <td className="px-3 py-2 text-center">{player.economy || '-'}</td>
                      <td className="px-3 py-2 text-center">{player.five_wickets || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Best Bowling Figures in an Innings */}
          {additional.bestBowlingInnings && additional.bestBowlingInnings.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-500 to-emerald-500 px-4 py-2">
                <h3 className="font-bold text-white text-sm">Best Bowling Figures in an Innings</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="px-3 py-2 text-left">Figures</th>
                      <th className="px-3 py-2 text-left">Bowler</th>
                      <th className="px-3 py-2 text-left">Team</th>
                      <th className="px-3 py-2 text-center">Overs</th>
                      <th className="px-3 py-2 text-center">Maidens</th>
                      <th className="px-3 py-2 text-center">Economy</th>
                      <th className="px-3 py-2 text-left">Opposition</th>
                      <th className="px-3 py-2 text-left">Venue</th>
                      <th className="px-3 py-2 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {additional.bestBowlingInnings.map((bowling, idx) => (
                      <tr key={idx} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="px-3 py-2 font-bold text-teal-600">{bowling.figures}</td>
                        <td className="px-3 py-2 font-medium">{bowling.player_name}</td>
                        <td className="px-3 py-2 text-gray-500">{bowling.team_name}</td>
                        <td className="px-3 py-2 text-center">{bowling.overs}</td>
                        <td className="px-3 py-2 text-center">{bowling.maidens}</td>
                        <td className="px-3 py-2 text-center">{bowling.economy}</td>
                        <td className="px-3 py-2 text-left">{bowling.opposition}</td>
                        <td className="px-3 py-2 text-left text-xs">{bowling.venue}</td>
                        <td className="px-3 py-2 text-left text-xs">{bowling.match_date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Best Bowling Averages */}
          {additional.bestBowlingAverages && additional.bestBowlingAverages.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-500 to-emerald-500 px-4 py-2">
                <h3 className="font-bold text-white text-sm">Best Bowling Averages</h3>
                <p className="text-[9px] text-white/70">Qualification: Minimum 500 deliveries bowled</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="px-3 py-2 text-left">Rank</th>
                      <th className="px-3 py-2 text-left">Player</th>
                      <th className="px-3 py-2 text-left">Team</th>
                      <th className="px-3 py-2 text-center">Matches</th>
                      <th className="px-3 py-2 text-center">Wickets</th>
                      <th className="px-3 py-2 text-center">Runs</th>
                      <th className="px-3 py-2 text-center">Average</th>
                      <th className="px-3 py-2 text-center">Best Innings</th>
                      <th className="px-3 py-2 text-center">Best Match</th>
                    </tr>
                  </thead>
                  <tbody>
                    {additional.bestBowlingAverages.map((bowler, idx) => (
                      <tr key={idx} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="px-3 py-2 font-bold text-gray-600">{idx + 1}</td>
                        <td className="px-3 py-2 font-medium">{bowler.player_name}</td>
                        <td className="px-3 py-2 text-gray-500">{bowler.team_name}</td>
                        <td className="px-3 py-2 text-center">{bowler.matches}</td>
                        <td className="px-3 py-2 text-center font-bold text-teal-600">{bowler.wickets}</td>
                        <td className="px-3 py-2 text-center">{bowler.runs_conceded}</td>
                        <td className="px-3 py-2 text-center font-bold">{bowler.average}</td>
                        <td className="px-3 py-2 text-center">{bowler.best_bowling_inning}</td>
                        <td className="px-3 py-2 text-center">{bowler.best_bowling_match}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Fielding Tab */}
      {activeTab === 'fielding' && (
        <div className="space-y-5">
          {/* Most Dismissals for a Wicket-Keeper */}
          {additional.wicketKeepers && additional.wicketKeepers.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-500 to-emerald-500 px-4 py-2">
                <h3 className="font-bold text-white text-sm">Most Dismissals for a Wicket-Keeper</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="px-3 py-2 text-left">Rank</th>
                      <th className="px-3 py-2 text-left">Player</th>
                      <th className="px-3 py-2 text-left">Team</th>
                      <th className="px-3 py-2 text-center">Matches</th>
                      <th className="px-3 py-2 text-center">Catches</th>
                      <th className="px-3 py-2 text-center">Stumpings</th>
                      <th className="px-3 py-2 text-center">Total</th>
                      <th className="px-3 py-2 text-center">Dis/Inn</th>
                    </tr>
                  </thead>
                  <tbody>
                    {additional.wicketKeepers.map((keeper, idx) => (
                      <tr key={idx} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="px-3 py-2 font-bold text-gray-600">{idx + 1}</td>
                        <td className="px-3 py-2 font-medium">{keeper.player_name}</td>
                        <td className="px-3 py-2 text-gray-500">{keeper.team_name}</td>
                        <td className="px-3 py-2 text-center">{keeper.matches}</td>
                        <td className="px-3 py-2 text-center">{keeper.catches}</td>
                        <td className="px-3 py-2 text-center">{keeper.stumpings}</td>
                        <td className="px-3 py-2 text-center font-bold text-teal-600">{keeper.total_dismissals}</td>
                        <td className="px-3 py-2 text-center">{keeper.dismissals_per_innings}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Most Catches for a Player */}
          {additional.mostCatches && additional.mostCatches.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-500 to-emerald-500 px-4 py-2">
                <h3 className="font-bold text-white text-sm">Most Catches for a Fielder</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="px-3 py-2 text-left">Rank</th>
                      <th className="px-3 py-2 text-left">Player</th>
                      <th className="px-3 py-2 text-left">Team</th>
                      <th className="px-3 py-2 text-center">Matches</th>
                      <th className="px-3 py-2 text-center">Catches</th>
                      <th className="px-3 py-2 text-center">Dis/Inn</th>
                  </tr>
                  </thead>
                  <tbody>
                    {additional.mostCatches.map((fielder, idx) => (
                      <tr key={idx} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="px-3 py-2 font-bold text-gray-600">{idx + 1}</td>
                        <td className="px-3 py-2 font-medium">{fielder.player_name}</td>
                        <td className="px-3 py-2 text-gray-500">{fielder.team_name}</td>
                        <td className="px-3 py-2 text-center">{fielder.matches}</td>
                        <td className="px-3 py-2 text-center font-bold text-teal-600">{fielder.catches}</td>
                        <td className="px-3 py-2 text-center">{fielder.dismissals_per_innings}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Team Statistics Tab */}
      {activeTab === 'team' && (
        <div className="space-y-5">
          {/* Highest Team Totals */}
          {additional.highestTeamTotals && additional.highestTeamTotals.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-500 to-emerald-500 px-4 py-2">
                <h3 className="font-bold text-white text-sm">Highest Team Totals</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="px-3 py-2 text-left">Score</th>
                      <th className="px-3 py-2 text-left">Team</th>
                      <th className="px-3 py-2 text-center">Overs</th>
                      <th className="px-3 py-2 text-center">Run Rate</th>
                      <th className="px-3 py-2 text-left">Opposition</th>
                      <th className="px-3 py-2 text-left">Venue</th>
                      <th className="px-3 py-2 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {additional.highestTeamTotals.map((total, idx) => (
                      <tr key={idx} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="px-3 py-2 font-bold text-teal-600">{total.score}</td>
                        <td className="px-3 py-2 font-medium">{total.team_name}</td>
                        <td className="px-3 py-2 text-center">{total.overs}</td>
                        <td className="px-3 py-2 text-center">{total.run_rate}</td>
                        <td className="px-3 py-2 text-left">{total.opposition}</td>
                        <td className="px-3 py-2 text-left text-xs">{total.venue}</td>
                        <td className="px-3 py-2 text-left text-xs">{total.match_date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Lowest Team Totals */}
          {additional.lowestTeamTotals && additional.lowestTeamTotals.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-500 to-emerald-500 px-4 py-2">
                <h3 className="font-bold text-white text-sm">Lowest Team Totals</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="px-3 py-2 text-left">Score</th>
                      <th className="px-3 py-2 text-left">Team</th>
                      <th className="px-3 py-2 text-center">Overs</th>
                      <th className="px-3 py-2 text-center">Run Rate</th>
                      <th className="px-3 py-2 text-left">Opposition</th>
                      <th className="px-3 py-2 text-left">Venue</th>
                      <th className="px-3 py-2 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {additional.lowestTeamTotals.map((total, idx) => (
                      <tr key={idx} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="px-3 py-2 font-bold text-red-600">{total.runs}</td>
                        <td className="px-3 py-2 font-medium">{total.team_name}</td>
                        <td className="px-3 py-2 text-center">{total.overs}</td>
                        <td className="px-3 py-2 text-center">{total.run_rate}</td>
                        <td className="px-3 py-2 text-left">{total.opposition}</td>
                        <td className="px-3 py-2 text-left text-xs">{total.venue}</td>
                        <td className="px-3 py-2 text-left text-xs">{total.match_date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Highest Successful Run Chases */}
          {additional.highestRunChases && additional.highestRunChases.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-500 to-emerald-500 px-4 py-2">
                <h3 className="font-bold text-white text-sm">Highest Successful Run Chases</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="px-3 py-2 text-left">Score</th>
                      <th className="px-3 py-2 text-left">Team</th>
                      <th className="px-3 py-2 text-center">Target</th>
                      <th className="px-3 py-2 text-center">Overs</th>
                      <th className="px-3 py-2 text-center">Run Rate</th>
                      <th className="px-3 py-2 text-left">Opposition</th>
                      <th className="px-3 py-2 text-left">Venue</th>
                      <th className="px-3 py-2 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {additional.highestRunChases.map((chase, idx) => (
                      <tr key={idx} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="px-3 py-2 font-bold text-teal-600">{chase.score}</td>
                        <td className="px-3 py-2 font-medium">{chase.team_name}</td>
                        <td className="px-3 py-2 text-center">{chase.target}</td>
                        <td className="px-3 py-2 text-center">{chase.overs}</td>
                        <td className="px-3 py-2 text-center">{chase.run_rate}</td>
                        <td className="px-3 py-2 text-left">{chase.opposition}</td>
                        <td className="px-3 py-2 text-left text-xs">{chase.venue}</td>
                        <td className="px-3 py-2 text-left text-xs">{chase.match_date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Note */}
      <div className="text-center py-2">
        <p className="text-[9px] text-gray-400 italic">
          Test cricket statistics focus on runs, wickets, centuries, and bowling figures.
          Sixes and strike rates are not primary metrics in Test cricket.
        </p>
      </div>
    </div>
  );
};