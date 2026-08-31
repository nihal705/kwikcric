// frontend/src/pages/Tournaments/TeamDetailPage.tsx
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
    world_cup_wins: number;
    t20_world_cup_wins?: number;
  };
  victories: Victory[];
}

export const TeamDetailPage: React.FC = () => {
  const { teamName, type } = useParams<{ teamName: string; type?: string }>();
  const tournamentType = type || 'odi';
  
  const [teamDetail, setTeamDetail] = useState<TeamDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  useEffect(() => {
    fetchTeamDetails();
  }, [teamName, tournamentType]);

  const fetchTeamDetails = async () => {
    setLoading(true);
    try {
      const response = await worldCupAPI.getTeamDetails(teamName || '', tournamentType);
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

  const getBackLink = () => {
    if (tournamentType === 't20') {
      return '/world-cup/t20';
    }
    return '/world-cup';
  };

  const getGradientColor = () => {
    if (tournamentType === 't20') {
      return 'from-purple-700 to-pink-700';
    }
    return 'from-green-700 to-green-900';
  };

  const getTitleText = () => {
    if (tournamentType === 't20') {
      return 'T20 World Cup Titles';
    }
    return 'World Cup Titles';
  };

  const getFinalOpponent = (victory: Victory, teamName: string) => {
    if (!victory.final_match) return 'TBD';
    if (victory.final_match.team1_name === teamName) {
      return victory.final_match.team2_name;
    }
    return victory.final_match.team1_name;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent" />
      </div>
    );
  }

  if (!teamDetail) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Team not found</h2>
        <Link to={getBackLink()} className="text-green-600 hover:underline">
          Back to {tournamentType === 't20' ? 'T20 World Cup' : 'World Cup'}
        </Link>
      </div>
    );
  }

  const { team, victories } = teamDetail;
  const selectedVictory = victories.find(v => v.year === selectedYear);
  const winsCount = tournamentType === 't20' ? team.t20_world_cup_wins || 0 : team.world_cup_wins || 0;

  return (
    <div className="space-y-5 min-h-screen bg-[#f9fafb] dark:bg-[#0f172a] text-gray-900 dark:text-white p-4 md:p-6" style={{ backgroundImage: 'none' }}>
      {/* Header */}
      <div className={`bg-gradient-to-r ${getGradientColor()} py-6`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to={getBackLink()} className="inline-flex items-center text-white/80 hover:text-white text-sm mb-3">
            ← Back to {tournamentType === 't20' ? 'T20 World Cup' : 'World Cup'}
          </Link>
          <div className="flex flex-wrap items-center justify-between gap-4">
    <div>
        <h1 className="text-3xl md:text-4xl font-bold text-white">{team.name}</h1>
        <p className="text-white/80 text-sm">{winsCount} {getTitleText()}</p>
    </div>
    <div className="flex flex-wrap gap-2">
        {victories.map((v) => (
            <button
                key={v.year}
                onClick={() => setSelectedYear(v.year)}
                className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition-all flex items-center gap-1.5 ${
                    selectedYear === v.year
                        ? 'bg-yellow-500 text-white'
                        : 'bg-white/20 text-white hover:bg-white/30'
                }`}
            >
                <img 
                    src="/images/icc_odi_wc_trophy.png"
                    alt="ICC Cricket World Cup Trophy"
                    className="w-4 h-4 object-contain"
                />
                {v.year}
            </button>
        ))}
    </div>
</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {selectedVictory && (
          <div className="space-y-5">
            {/* Stats Row - 6 Compact Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500">Year</div>
                <div className="text-xl font-bold text-green-600">{selectedVictory.year}</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500">Captain</div>
                <div className="font-bold text-gray-800 dark:text-white text-sm truncate">{selectedVictory.captain_name}</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500">Player of Tournament</div>
                <div className="font-bold text-gray-800 dark:text-white text-sm truncate">{selectedVictory.player_of_tournament}</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500">Final vs</div>
                <div className="font-bold text-gray-800 dark:text-white text-sm truncate">{getFinalOpponent(selectedVictory, team.name)}</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500">Venue</div>
                <div className="font-bold text-gray-800 dark:text-white text-sm truncate">{selectedVictory.venue?.split(',')[0] || 'TBD'}</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500">Margin</div>
                <div className="font-bold text-gray-800 dark:text-white text-sm truncate">
                  {selectedVictory.final_match ? `${selectedVictory.final_match.winner_margin} ${selectedVictory.final_match.margin_type}` : 'N/A'}
                </div>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Left Column - Final Match & Top Performers */}
              <div className="lg:col-span-2 space-y-5">
                {/* Final Match Card */}
                {selectedVictory.final_match && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm">Final Match</h3>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{selectedVictory.final_match.team1_name}</span>
                        <span className="font-mono font-semibold text-sm">
                          {selectedVictory.final_match.team1_score}/{selectedVictory.final_match.team1_wickets}
                          <span className="text-gray-500 text-xs ml-1">({selectedVictory.final_match.team1_overs} ov)</span>
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-medium">{selectedVictory.final_match.team2_name}</span>
                        <span className="font-mono font-semibold text-sm">
                          {selectedVictory.final_match.team2_score}/{selectedVictory.final_match.team2_wickets}
                          <span className="text-gray-500 text-xs ml-1">({selectedVictory.final_match.team2_overs} ov)</span>
                        </span>
                      </div>
                      <div className="text-center pt-2 border-t border-gray-100 dark:border-gray-700">
                        <span className="text-green-600 font-semibold text-sm">
                          {selectedVictory.final_match.winner_name} won by {selectedVictory.final_match.winner_margin} {selectedVictory.final_match.margin_type}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Top Performers - Side by Side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Most Runs */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-xs">🏏 Most Runs</h3>
                    </div>
                    <div className="p-2 space-y-1">
                      {selectedVictory.top_performers?.most_runs?.length > 0 ? (
                        selectedVictory.top_performers.most_runs.slice(0, 3).map((player, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs">
                            <span className="font-medium">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'} {player.player_name}</span>
                            <span className="font-semibold text-green-600">{player.runs} runs</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-gray-500 text-xs py-2">No data available</div>
                      )}
                    </div>
                  </div>

                  {/* Most Wickets */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-xs">🎯 Most Wickets</h3>
                    </div>
                    <div className="p-2 space-y-1">
                      {selectedVictory.top_performers?.most_wickets?.length > 0 ? (
                        selectedVictory.top_performers.most_wickets.slice(0, 3).map((player, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs">
                            <span className="font-medium">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'} {player.player_name}</span>
                            <span className="font-semibold text-blue-600">{player.wickets} wkts</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-gray-500 text-xs py-2">No data available</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Winning Squad (Show All) */}
<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div className="bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 border-b border-gray-200 dark:border-gray-700">
    <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-xs flex items-center gap-1.5">
        <img 
            src="/images/icc_odi_wc_trophy.png"
            alt="ICC Cricket World Cup Trophy"
            className="w-3 h-3 md:w-3.5 md:h-3.5 object-contain"
        />
        Winning Squad ({selectedVictory.squad?.length || 0} players)
    </h3>
</div>
    <div className="p-2 max-h-96 overflow-y-auto">
        <div className="grid grid-cols-2 gap-1">
            {selectedVictory.squad?.map((player, idx) => (
                <div key={idx} className="text-xs p-1 flex items-center gap-1">
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