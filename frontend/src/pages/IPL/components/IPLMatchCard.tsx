// src/pages/IPL/components/IPLMatchCard.tsx
import React from 'react';

interface IPLMatch {
  id: number;
  match_type: string;
  match_number: number;
  team1_name: string;
  team2_name: string;
  team1_score: number;
  team1_wickets: number;
  team1_overs: number;
  team2_score: number;
  team2_wickets: number;
  team2_overs: number;
  winner_name: string;
  winner_margin: string;
  margin_type: string;
  venue: string;
  match_date: string;
  man_of_match_name: string;
  team1_color: string;
  team2_color: string;
}

interface IPLMatchCardProps {
  match: IPLMatch;
  isPlayoff?: boolean;
}

export const IPLMatchCard: React.FC<IPLMatchCardProps> = ({ match, isPlayoff }) => {
  const formatScore = (score: number, wickets: number, overs: number) => {
    if (!score) return 'DNB';
    const oversStr = overs ? overs.toFixed(1) : '0';
    return `${score}/${wickets} (${oversStr} ov)`;
  };

  const isFinal = match.match_type === 'final';

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border ${
      isPlayoff ? 'border-blue-300 dark:border-blue-600' : 'border-gray-200 dark:border-gray-700'
    }`}>
      <div className="text-center mb-2">
        <span className="text-xs text-gray-500">{new Date(match.match_date).toLocaleDateString()}</span>
        <span className="mx-2">•</span>
        <span className="text-xs text-gray-500">{match.venue?.split(',')[0]}</span>
        {isFinal && (
          <span className="ml-2 text-xs bg-yellow-500 text-white px-1.5 py-0.5 rounded-full">FINAL</span>
        )}
        {isPlayoff && !isFinal && (
          <span className="ml-2 text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full">PLAYOFF</span>
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
            {formatScore(match.team1_score, match.team1_wickets, match.team1_overs)}
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
            {formatScore(match.team2_score, match.team2_wickets, match.team2_overs)}
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