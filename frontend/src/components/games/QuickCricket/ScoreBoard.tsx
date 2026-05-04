import React from 'react';
import { motion } from 'framer-motion';

interface ScoreBoardProps {
  runs: number;
  wickets: number;
  balls: number;
  maxBalls: number;
  target?: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ runs, wickets, balls, maxBalls, target }) => {
  const ballsRemaining = maxBalls - balls;
  const runRate = runs / (balls / 6) || 0;
  const requiredRunRate = target ? (target - runs) / (ballsRemaining / 6) : 0;

  return (
    <div className="bg-black/50 p-4">
      <div className="grid grid-cols-3 gap-4 text-center">
        {/* Score */}
        <motion.div
          key={runs}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className="text-white"
        >
          <div className="text-sm opacity-75">SCORE</div>
          <div className="text-4xl font-bold">
            {runs}<span className="text-2xl text-gray-400">/{wickets}</span>
          </div>
        </motion.div>
        
        {/* Overs/Balls */}
        <div className="text-white">
          <div className="text-sm opacity-75">BALLS</div>
          <div className="text-3xl font-bold">
            {balls}<span className="text-xl text-gray-400">/{maxBalls}</span>
          </div>
        </div>
        
        {/* Run Rate */}
        <div className="text-white">
          <div className="text-sm opacity-75">RUN RATE</div>
          <div className="text-2xl font-bold">{runRate.toFixed(2)}</div>
        </div>
      </div>
      
      {/* Target Display */}
      {target && (
        <div className="mt-3 text-center">
          <div className="text-sm text-yellow-400">
            Need {target - runs} runs from {ballsRemaining} balls
          </div>
          <div className="text-xs text-gray-400">
            Required RR: {requiredRunRate.toFixed(2)}
          </div>
        </div>
      )}
      
      {/* Balls Remaining Visualization */}
      <div className="mt-3 flex justify-center space-x-1">
        {Array.from({ length: maxBalls }).map((_, i) => (
          <div
            key={i}
            className={`w-6 h-2 rounded-full transition-colors ${
              i < balls
                ? i % 6 === 5
                  ? 'bg-red-500'
                  : 'bg-gray-500'
                : 'bg-gray-700'
            }`}
          />
        ))}
      </div>
    </div>
  );
};