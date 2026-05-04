// frontend/src/pages/Tournaments/ChampionsTrophyTeamDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { worldCupAPI } from '../../services/api/worldCupAPI';

interface Victory {
  id: number;
  year: number;
  captain_name: string;
  player_of_tournament: string;
  image_url: string | null;
  venue: string;
  final_match_date: string;
  final_match: {
    team1_name: string;
    team2_name: string;
    team1_score: number;
    team1_wickets: number;
    team1_overs: number;
    team2_score: number;
    team2_wickets: number;
    team2_overs: number;
    winner_name: string;
    winner_margin: number;
    margin_type: string;
    venue: string;
    result_note?: string;
    man_of_match_name?: string;
  };
  top_performers: {
    most_runs: Array<{ player_name: string; runs: number }>;
    most_wickets: Array<{ player_name: string; wickets: number }>;
  };
  squad: Array<{ name: string; role: string; is_captain: boolean; is_wicket_keeper: boolean }>;
}

interface TeamDetail {
  team: {
    id: number;
    name: string;
    country: string;
    champions_trophy_wins: number;
  };
  victories: Victory[];
}

export const ChampionsTrophyTeamDetailPage: React.FC = () => {
  const { teamName } = useParams<{ teamName: string }>();
  const [teamDetail, setTeamDetail] = useState<TeamDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  useEffect(() => {
    fetchTeamDetails();
  }, [teamName]);

  const fetchTeamDetails = async () => {
    setLoading(true);
    try {
      const response = await worldCupAPI.getTeamDetails(teamName || '', 'champions');
      console.log('Champions Trophy Team data:', response.data);
      setTeamDetail(response.data);
      if (response.data.victories.length > 0) {
        setSelectedYear(response.data.victories[0].year);
      }
    } catch (error) {
      console.error('Error fetching team details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBackLink = () => '/champions-trophy';

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!teamDetail) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-3">Team not found</h2>
        <Link to={getBackLink()} className="text-blue-600 hover:underline text-base">
          Back to Champions Trophy
        </Link>
      </div>
    );
  }

  const { team, victories } = teamDetail;
  const selectedVictory = victories.find(v => v.year === selectedYear);
  const winsCount = team.champions_trophy_wins || victories.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-cyan-700 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <Link to={getBackLink()} className="inline-flex items-center text-white/80 hover:text-white text-sm mb-3">
            ← Back to Champions Trophy
          </Link>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">{team.name}</h1>
              <p className="text-blue-100 text-base mt-1">{winsCount} Champions Trophy Titles</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {victories.map((v) => (
                <button
                  key={v.year}
                  onClick={() => setSelectedYear(v.year)}
                  className={`px-4 py-2 rounded-lg font-semibold text-base transition-all ${
                    selectedYear === v.year
                      ? 'bg-yellow-500 text-white'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  🏆 {v.year}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {selectedVictory && (
          <div className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500">Year</div>
                <div className="text-2xl font-bold text-blue-600">{selectedVictory.year}</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500">Captain</div>
                <div className="font-bold text-gray-800 dark:text-white text-base truncate">{selectedVictory.captain_name}</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500">Player of Tournament</div>
                <div className="font-bold text-gray-800 dark:text-white text-base truncate">{selectedVictory.player_of_tournament}</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500">Final vs</div>
                <div className="font-bold text-gray-800 dark:text-white text-base truncate">
                  {selectedVictory.final_match?.team1_name === team.name 
                    ? selectedVictory.final_match?.team2_name 
                    : selectedVictory.final_match?.team1_name}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500">Venue</div>
                <div className="font-bold text-gray-800 dark:text-white text-base truncate">{selectedVictory.venue?.split(',')[0]}</div>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Final Match Card */}
                {selectedVictory.final_match && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="bg-blue-50 dark:bg-blue-900/20 px-5 py-3 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="font-semibold text-blue-700 dark:text-blue-300 text-base">Final Match</h3>
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-medium text-lg">{selectedVictory.final_match.team1_name}</span>
                        <span className="font-mono font-semibold text-base">
                          {selectedVictory.final_match.team1_score}/{selectedVictory.final_match.team1_wickets}
                          <span className="text-gray-500 text-sm ml-1">({selectedVictory.final_match.team1_overs} ov)</span>
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-medium text-lg">{selectedVictory.final_match.team2_name}</span>
                        <span className="font-mono font-semibold text-base">
                          {selectedVictory.final_match.team2_score}/{selectedVictory.final_match.team2_wickets}
                          <span className="text-gray-500 text-sm ml-1">({selectedVictory.final_match.team2_overs} ov)</span>
                        </span>
                      </div>
                      <div className="text-center pt-3 border-t border-gray-100 dark:border-gray-700">
                        <span className="text-blue-600 font-semibold text-sm">
                          {selectedVictory.year === 2002 ? (
                            <>Match abandoned due to rain. Trophy shared between India and Sri Lanka</>
                          ) : (
                            <>{selectedVictory.final_match.winner_name} won by {selectedVictory.final_match.winner_margin} {selectedVictory.final_match.margin_type}</>
                          )}
                        </span>
                        {selectedVictory.final_match.man_of_match_name && (
                          <div className="text-xs text-yellow-600 mt-2">
                            🏅 Player of the Match: {selectedVictory.final_match.man_of_match_name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Top Performers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm">🏏 Most Runs</h3>
                    </div>
                    <div className="p-3 space-y-2">
                      {selectedVictory.top_performers?.most_runs?.slice(0, 3).map((player, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <span className="font-medium">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'} {player.player_name}</span>
                          <span className="font-semibold text-green-600">{player.runs} runs</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm">🎯 Most Wickets</h3>
                    </div>
                    <div className="p-3 space-y-2">
                      {selectedVictory.top_performers?.most_wickets?.slice(0, 3).map((player, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <span className="font-medium">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'} {player.player_name}</span>
                          <span className="font-semibold text-blue-600">{player.wickets} wkts</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Winning Squad */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
                    🏆 Winning Squad ({selectedVictory.squad?.length || 0} players)
                  </h3>
                </div>
                <div className="p-3 max-h-80 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-2">
                    {selectedVictory.squad?.map((player, idx) => (
                      <div key={idx} className="text-xs p-1.5 flex items-center gap-1">
                        {player.is_captain && <span className="text-yellow-500 text-xs">(c)</span>}
                        {player.is_wicket_keeper && <span className="text-blue-500 text-xs">†</span>}
                        <span className="truncate">{player.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};