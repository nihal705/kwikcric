// frontend/src/pages/Tournaments/components/GreatestMatches.tsx
import React, { useState, useEffect } from 'react';
import { worldCupAPI } from '../../../services/api/worldCupAPI';

interface GreatestMatch {
  rank: number;
  title: string;
  description: string;
  year: number;
  team1_name: string;
  team2_name: string;
  team1_score: number;
  team1_wickets: number;
  team1_overs: number;
  team2_score: number;
  team2_wickets: number;
  team2_overs: number;
  total_runs?: number;
  winner_name: string;
  winner_margin: number;
  margin_type: string;
  venue: string;
}

interface GreatestMatchesProps {
  tournamentType?: 'odi' | 't20' | 'champions' | 'test';
}

export const GreatestMatches: React.FC<GreatestMatchesProps> = ({ 
  tournamentType = 'odi' 
}) => {
  const [highestScoring, setHighestScoring] = useState<GreatestMatch[]>([]);
  const [closestFinishes, setClosestFinishes] = useState<GreatestMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'highest' | 'closest'>('highest');

  useEffect(() => {
    fetchMatches();
  }, [tournamentType]);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const response = await worldCupAPI.getGreatestMatches(tournamentType);
      setHighestScoring(response.data.highestScoring || []);
      setClosestFinishes(response.data.closestFinishes || []);
    } catch (error) {
      console.error('Error fetching greatest matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatScore = (score: number, wickets: number, overs: number) => {
    return `${score}/${wickets} (${overs} ov)`;
  };

  const getTitleByType = () => {
    switch (tournamentType) {
      case 't20':
        return 'Greatest T20I Matches';
      case 'champions':
        return 'Greatest Champions Trophy Matches';
      case 'test':
        return 'Greatest Test Championship Matches';
      default:
        return 'Greatest ODI Matches';
    }
  };

  const getHeaderColor = () => {
    switch (tournamentType) {
      case 't20':
        return 'from-purple-600 to-pink-600';
      case 'champions':
        return 'from-blue-600 to-cyan-600';
      case 'test':
        return 'from-teal-600 to-emerald-600';
      default:
        return 'from-orange-600 to-red-600';
    }
  };

  const getActiveTabColor = () => {
    switch (tournamentType) {
      case 't20':
        return 'text-purple-600 border-purple-600';
      case 'champions':
        return 'text-blue-600 border-blue-600';
      case 'test':
        return 'text-teal-600 border-teal-600';
      default:
        return 'text-orange-600 border-orange-600';
    }
  };

  const matches = activeTab === 'highest' ? highestScoring : closestFinishes;
  const activeTabColor = getActiveTabColor();

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className={`bg-gradient-to-r ${getHeaderColor()} px-4 py-2`}>
          <h3 className="text-sm font-bold text-white">{getTitleByType()}</h3>
          <p className="text-white/80 text-[10px]">Most thrilling encounters</p>
        </div>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-4 border-green-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className={`bg-gradient-to-r ${getHeaderColor()} px-4 py-2`}>
        <h3 className="text-sm font-bold text-white">{getTitleByType()}</h3>
        <p className="text-white/80 text-[10px]">Most thrilling encounters</p>
      </div>

      {/* Tab Selector */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('highest')}
          className={`flex-1 px-2 py-1.5 text-[10px] font-medium transition-all text-center ${
            activeTab === 'highest'
              ? `${activeTabColor} border-b-2`
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          Highest Scoring
        </button>
        <button
          onClick={() => setActiveTab('closest')}
          className={`flex-1 px-2 py-1.5 text-[10px] font-medium transition-all text-center ${
            activeTab === 'closest'
              ? `${activeTabColor} border-b-2`
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          Closest Finishes
        </button>
      </div>

      {/* Matches List */}
      <div className="p-3 space-y-2">
        {matches.length === 0 ? (
          <div className="text-center py-4 text-gray-500 text-xs">
            No matches available.
          </div>
        ) : (
          matches.map((match) => (
            <div
              key={match.rank}
              className="border border-gray-200 dark:border-gray-700 rounded-md p-2 hover:shadow-sm transition"
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-orange-600">#{match.rank}</span>
                  <span className="text-[10px] font-semibold bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                    {match.year}
                  </span>
                </div>
                <div className="text-right">
                  {activeTab === 'highest' && match.total_runs && (
                    <span className="text-[10px] font-semibold text-orange-600">
                      Total: {match.total_runs}
                    </span>
                  )}
                  {activeTab === 'closest' && (
                    <span className="text-[10px] font-semibold text-blue-600">
                      Margin: {match.winner_margin} {match.margin_type}
                    </span>
                  )}
                </div>
              </div>

              <h4 className="text-xs font-bold text-gray-800 dark:text-white mb-1 line-clamp-1">{match.title}</h4>
              <p className="text-[10px] text-gray-600 dark:text-gray-400 mb-1.5 line-clamp-2">{match.description}</p>

              <div className="space-y-0.5">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-medium truncate max-w-[120px]">{match.team1_name}</span>
                  <span className="font-mono">{formatScore(match.team1_score, match.team1_wickets, match.team1_overs)}</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-medium truncate max-w-[120px]">{match.team2_name}</span>
                  <span className="font-mono">{formatScore(match.team2_score, match.team2_wickets, match.team2_overs)}</span>
                </div>
              </div>

              <div className="mt-1.5 pt-1 border-t border-gray-100 dark:border-gray-700">
                <span className="text-[10px] font-medium text-green-600">
                  {match.winner_name} won
                </span>
                <div className="text-[9px] text-gray-500 mt-0.5 truncate">📍 {match.venue}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};