// src/pages/IPL/components/IPLPlayoffBracket.tsx
import React from 'react';

interface IPLPlayoffMatch {
  id: number;
  match_type: string;
  team1_name: string;
  team2_name: string;
  winner_name: string;
  winner_margin: string;
  venue: string;
  match_date: string;
  man_of_match: string;
  team1_color: string;
  team2_color: string;
}

interface IPLPlayoffBracketProps {
  playoffs: IPLPlayoffMatch[];
  winnerColor?: string;
}

export const IPLPlayoffBracket: React.FC<IPLPlayoffBracketProps> = ({ playoffs, winnerColor }) => {
  const qualifier1 = playoffs.find(p => p.match_type === 'qualifier1');
  const eliminator = playoffs.find(p => p.match_type === 'eliminator');
  const qualifier2 = playoffs.find(p => p.match_type === 'qualifier2');
  const finalMatch = playoffs.find(p => p.match_type === 'final');

  const PlayoffCard: React.FC<{ match?: IPLPlayoffMatch; title: string; isFinal?: boolean }> = ({ match, title, isFinal }) => {
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

  if (!playoffs.length) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        <p>Playoff bracket not available for this season.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <PlayoffCard match={qualifier1} title="Qualifier 1" />
        <PlayoffCard match={eliminator} title="Eliminator" />
        <PlayoffCard match={qualifier2} title="Qualifier 2" />
        <PlayoffCard match={finalMatch} title="FINAL" isFinal />
      </div>
      
      {finalMatch && (
        <div className="text-center mt-4">
          <div 
            className="inline-block px-6 py-3 rounded-full text-white font-bold"
            style={{ background: winnerColor || '#004BA0' }}
          >
            🏆 {finalMatch.winner_name} are the Champions! 🏆
          </div>
        </div>
      )}
    </div>
  );
};