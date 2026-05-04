import React from 'react';
import { motion } from 'framer-motion';

interface PlayoffMatch {
  id: string;
  round: 'qualifier1' | 'eliminator' | 'qualifier2' | 'final';
  team1: string;
  team2: string;
  winner?: string;
  margin?: string;
  date?: string;
}

interface PlayoffBracketProps {
  data: PlayoffMatch[];
}

export const PlayoffBracket: React.FC<PlayoffBracketProps> = ({ data }) => {
  const qualifier1 = data.find(m => m.round === 'qualifier1');
  const eliminator = data.find(m => m.round === 'eliminator');
  const qualifier2 = data.find(m => m.round === 'qualifier2');
  const final = data.find(m => m.round === 'final');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col lg:flex-row justify-center items-center gap-4 lg:gap-8">
        {/* Qualifier 1 */}
        <div className="flex-1 w-full">
          <div className="text-center text-sm text-gray-500 mb-2">Qualifier 1</div>
          <MatchCard match={qualifier1} />
          <div className="text-center my-2 text-gray-400">↓</div>
        </div>

        {/* Eliminator */}
        <div className="flex-1 w-full">
          <div className="text-center text-sm text-gray-500 mb-2">Eliminator</div>
          <MatchCard match={eliminator} />
          <div className="text-center my-2 text-gray-400">↓</div>
        </div>

        {/* Qualifier 2 */}
        <div className="flex-1 w-full">
          <div className="text-center text-sm text-gray-500 mb-2">Qualifier 2</div>
          <MatchCard match={qualifier2} />
          <div className="text-center my-2 text-gray-400">↓</div>
        </div>

        {/* Final */}
        <div className="flex-1 w-full">
          <div className="text-center text-sm text-gray-500 mb-2">FINAL</div>
          <MatchCard match={final} isFinal />
        </div>
      </div>
    </div>
  );
};

interface MatchCardProps {
  match?: PlayoffMatch;
  isFinal?: boolean;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, isFinal }) => {
  if (!match) {
    return (
      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center text-gray-500">
        TBD
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border-2 ${
        isFinal ? 'border-yellow-500' : 'border-gray-200 dark:border-gray-600'
      }`}
    >
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-medium">{match.team1}</span>
          {match.winner === match.team1 && (
            <span className="text-green-500 text-xs">✓</span>
          )}
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">{match.team2}</span>
          {match.winner === match.team2 && (
            <span className="text-green-500 text-xs">✓</span>
          )}
        </div>
        {match.winner && (
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600 text-center">
            <div className="text-xs text-green-600 font-medium">
              {match.winner} won {match.margin && `by ${match.margin}`}
            </div>
          </div>
        )}
        {isFinal && match.winner && (
          <div className="mt-2 flex justify-center">
            <span className="text-yellow-500 text-2xl">🏆</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};