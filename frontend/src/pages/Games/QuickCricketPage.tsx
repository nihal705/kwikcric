import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface GameState {
  runs: number;
  wickets: number;
  balls: number;
  maxBalls: number;
  isGameOver: boolean;
  shotHistory: Array<{ runs: number; isWicket: boolean; message: string }>;
}

export const QuickCricketPage: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    runs: 0,
    wickets: 0,
    balls: 0,
    maxBalls: 6,
    isGameOver: false,
    shotHistory: [],
  });
  const [animation, setAnimation] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const shotOutcomes = {
    aggressive: [
      { runs: 4, isWicket: false, message: 'FOUR!', probability: 0.25, animation: 'boundary' },
      { runs: 6, isWicket: false, message: 'SIX!', probability: 0.15, animation: 'six' },
      { runs: 1, isWicket: false, message: 'Single', probability: 0.20, animation: 'single' },
      { runs: 0, isWicket: true, message: 'OUT! Bowled!', probability: 0.10, animation: 'wicket' },
      { runs: 0, isWicket: false, message: 'Dot ball!', probability: 0.30, animation: 'dot' },
    ],
    normal: [
      { runs: 4, isWicket: false, message: 'FOUR!', probability: 0.15, animation: 'boundary' },
      { runs: 2, isWicket: false, message: 'Two runs!', probability: 0.20, animation: 'double' },
      { runs: 1, isWicket: false, message: 'Single', probability: 0.35, animation: 'single' },
      { runs: 0, isWicket: true, message: 'CAUGHT!', probability: 0.05, animation: 'wicket' },
      { runs: 0, isWicket: false, message: 'Dot ball!', probability: 0.25, animation: 'dot' },
    ],
    defensive: [
      { runs: 1, isWicket: false, message: 'Single', probability: 0.30, animation: 'single' },
      { runs: 2, isWicket: false, message: 'Two runs!', probability: 0.10, animation: 'double' },
      { runs: 0, isWicket: true, message: 'LBW!', probability: 0.02, animation: 'wicket' },
      { runs: 0, isWicket: false, message: 'Defended!', probability: 0.58, animation: 'dot' },
    ],
  };

  const playShot = (shotType: 'aggressive' | 'normal' | 'defensive') => {
    if (gameState.isGameOver) return;

    const outcomes = shotOutcomes[shotType];
    const random = Math.random();
    let cumulative = 0;
    let outcome = outcomes[0];

    for (const o of outcomes) {
      cumulative += o.probability;
      if (random <= cumulative) {
        outcome = o;
        break;
      }
    }

    // Update game state
    if (!outcome.isWicket) {
      setGameState(prev => ({ ...prev, runs: prev.runs + outcome.runs, balls: prev.balls + 1 }));
    } else {
      setGameState(prev => ({ ...prev, wickets: prev.wickets + 1, balls: prev.balls + 1 }));
    }

    setGameState(prev => ({
      ...prev,
      shotHistory: [{ runs: outcome.runs, isWicket: outcome.isWicket, message: outcome.message }, ...prev.shotHistory].slice(0, 10),
    }));

    setAnimation(outcome.animation);
    setTimeout(() => setAnimation(null), 800);

    if (outcome.runs === 4 || outcome.runs === 6) {
      toast.success(outcome.message);
    } else if (outcome.isWicket) {
      toast.error(outcome.message);
    }
  };

  useEffect(() => {
    if (gameState.wickets >= 3 || gameState.balls >= gameState.maxBalls) {
      setGameState(prev => ({ ...prev, isGameOver: true }));
      setShowResult(true);
      toast.success(`Game Over! You scored ${gameState.runs}/${gameState.wickets}`);
    }
  }, [gameState.wickets, gameState.balls]);

  const resetGame = () => {
    setGameState({
      runs: 0,
      wickets: 0,
      balls: 0,
      maxBalls: 6,
      isGameOver: false,
      shotHistory: [],
    });
    setShowResult(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Quick Cricket</h1>
      
      <div className="bg-gradient-to-b from-green-800 to-green-900 rounded-2xl overflow-hidden shadow-2xl">
        {/* Scoreboard */}
        <div className="bg-black/50 p-6">
          <div className="grid grid-cols-3 gap-4 text-center text-white">
            <div>
              <div className="text-sm opacity-75">SCORE</div>
              <div className="text-5xl font-bold">{gameState.runs}<span className="text-2xl text-gray-400">/{gameState.wickets}</span></div>
            </div>
            <div>
              <div className="text-sm opacity-75">BALLS</div>
              <div className="text-4xl font-bold">{gameState.balls}<span className="text-xl text-gray-400">/{gameState.maxBalls}</span></div>
            </div>
            <div>
              <div className="text-sm opacity-75">RUN RATE</div>
              <div className="text-3xl font-bold">{((gameState.runs / (gameState.balls / 6)) || 0).toFixed(2)}</div>
            </div>
          </div>
          
          {/* Balls remaining visualization */}
          <div className="flex justify-center space-x-1 mt-4">
            {Array.from({ length: gameState.maxBalls }).map((_, i) => (
              <div
                key={i}
                className={`w-8 h-2 rounded-full transition-colors ${
                  i < gameState.balls
                    ? i % 6 === 5 ? 'bg-red-500' : 'bg-gray-500'
                    : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Shot Buttons */}
        {!gameState.isGameOver ? (
          <div className="p-6">
            <div className="grid grid-cols-3 gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => playShot('aggressive')}
                className="py-4 bg-red-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-red-700 transition"
              >
                💥 AGGRESSIVE
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => playShot('normal')}
                className="py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 transition"
              >
                ⚖️ NORMAL
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => playShot('defensive')}
                className="py-4 bg-green-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-green-700 transition"
              >
                🛡️ DEFENSIVE
              </motion.button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h2 className="text-3xl font-bold text-white mb-2">Game Over!</h2>
                  <p className="text-5xl font-bold text-yellow-400 mb-4">{gameState.runs}/{gameState.wickets}</p>
                  <button
                    onClick={resetGame}
                    className="px-6 py-3 bg-white text-green-800 rounded-xl font-bold hover:bg-gray-100 transition"
                  >
                    Play Again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Commentary */}
        <div className="bg-black/30 p-4 max-h-40 overflow-y-auto">
          <h3 className="text-white/70 text-sm mb-2">📝 Commentary</h3>
          <div className="space-y-1">
            {gameState.shotHistory.map((shot, idx) => (
              <div key={idx} className="text-white/60 text-sm">
                {shot.isWicket ? (
                  <span className="text-red-400">{shot.message}</span>
                ) : (
                  <span>{shot.message} {shot.runs > 0 && `+${shot.runs} runs`}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl p-4">
        <h3 className="font-semibold mb-2">How to Play</h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>💥 AGGRESSIVE - Higher chance of boundaries but risk of wicket</li>
          <li>⚖️ NORMAL - Balanced approach</li>
          <li>🛡️ DEFENSIVE - Safe play, low risk</li>
          <li>🏆 Score as many runs as possible in 6 balls!</li>
        </ul>
      </div>

      {/* Animation Overlay */}
      <AnimatePresence>
        {animation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            <div className={`text-8xl font-bold text-white text-center drop-shadow-2xl ${
              animation === 'boundary' ? 'animate-bounce' : 
              animation === 'six' ? 'animate-pulse' : 
              animation === 'wicket' ? 'animate-shake' : ''
            }`}>
              {animation === 'boundary' && 'FOUR!'}
              {animation === 'six' && 'SIX!'}
              {animation === 'wicket' && 'OUT!'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};