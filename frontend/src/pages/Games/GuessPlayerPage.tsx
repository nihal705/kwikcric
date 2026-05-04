import React, { useState } from 'react';
import { motion } from 'framer-motion';

const players = [
  { name: 'Virat Kohli', country: 'India', role: 'Batsman', image: '🏏' },
  { name: 'Sachin Tendulkar', country: 'India', role: 'Batsman', image: '🏏' },
  { name: 'MS Dhoni', country: 'India', role: 'WK-Batsman', image: '🏏' },
  { name: 'Rohit Sharma', country: 'India', role: 'Batsman', image: '🏏' },
];

export const GuessPlayerPage: React.FC = () => {
  const [currentPlayer, setCurrentPlayer] = useState(players[Math.floor(Math.random() * players.length)]);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [attempts, setAttempts] = useState(3);
  const [score, setScore] = useState(100);
  const [gameOver, setGameOver] = useState(false);
  const [hintsRevealed, setHintsRevealed] = useState<string[]>([]);

  const hints = [
    `Plays for ${currentPlayer.country}`,
    `Role: ${currentPlayer.role}`,
    `Legendary ${currentPlayer.role}`,
  ];

  const handleGuess = () => {
    if (gameOver) return;
    
    if (guess.toLowerCase().trim() === currentPlayer.name.toLowerCase()) {
      setMessage(`🎉 Correct! You earned ${score} points!`);
      setGameOver(true);
    } else {
      const newAttempts = attempts - 1;
      setAttempts(newAttempts);
      setScore(Math.max(0, score - 20));
      setMessage(`❌ Wrong guess! ${newAttempts} attempts remaining.`);
      
      if (newAttempts === 0) {
        setMessage(`💀 Game Over! The player was ${currentPlayer.name}.`);
        setGameOver(true);
      }
    }
    setGuess('');
  };

  const revealHint = () => {
    if (gameOver || hintsRevealed.length >= hints.length) return;
    const nextHint = hints[hintsRevealed.length];
    setHintsRevealed([...hintsRevealed, nextHint]);
    setScore(Math.max(0, score - 15));
  };

  const resetGame = () => {
    setCurrentPlayer(players[Math.floor(Math.random() * players.length)]);
    setGuess('');
    setMessage('');
    setAttempts(3);
    setScore(100);
    setGameOver(false);
    setHintsRevealed([]);
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Guess The Player</h1>
      
      <div className="card p-6">
        <div className="text-center mb-6">
          <div className="w-40 h-40 mx-auto bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center text-7xl mb-4">
            {currentPlayer.image}
          </div>
          <div className="flex justify-between text-sm mb-4">
            <span className="text-gray-500">Score: {score}</span>
            <span className="text-gray-500">Attempts: {attempts}</span>
          </div>
          
          {/* Blur Effect */}
          <div className="filter blur-md text-center p-4 bg-gray-100 dark:bg-gray-800 rounded-xl mb-4">
            <p className="text-gray-500">???</p>
          </div>
        </div>

        {/* Hints */}
        {hintsRevealed.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <h3 className="font-semibold text-sm mb-2">💡 Hints:</h3>
            <ul className="space-y-1">
              {hintsRevealed.map((hint, i) => (
                <li key={i} className="text-sm text-gray-600 dark:text-gray-400">{hint}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
            placeholder="Enter player name..."
            disabled={gameOver}
            className="flex-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-800"
          />
          <button
            onClick={handleGuess}
            disabled={gameOver || !guess.trim()}
            className="px-6 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50"
          >
            Guess
          </button>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={revealHint}
            disabled={gameOver || hintsRevealed.length >= hints.length}
            className="flex-1 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50"
          >
            💡 Reveal Hint (-15)
          </button>
          <button
            onClick={resetGame}
            className="flex-1 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700"
          >
            New Game
          </button>
        </div>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-3 rounded-xl text-center ${
              message.includes('🎉') ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
              message.includes('💀') ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
            }`}
          >
            {message}
          </motion.div>
        )}
      </div>
    </div>
  );
};