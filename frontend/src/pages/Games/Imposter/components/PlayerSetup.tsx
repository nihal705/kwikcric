// frontend/src/pages/Games/Imposter/components/PlayerSetup.tsx
import React, { useState } from 'react';

interface PlayerSetupProps {
  gameMode: 'local' | 'bots';
  onStart: (players: string[], botCount?: number) => void;
  onBack: () => void;
  playerName: string;
  botCount: number;
  setBotCount: (count: number) => void;
}

export const PlayerSetup: React.FC<PlayerSetupProps> = ({
  gameMode,
  onStart,
  onBack,
  playerName,
  botCount,
  setBotCount
}) => {
  const [localPlayers, setLocalPlayers] = useState<string[]>([playerName, '', '']);
  const [error, setError] = useState('');

  if (gameMode === 'local') {
    const addPlayer = () => {
      if (localPlayers.length < 11) {
        setLocalPlayers([...localPlayers, '']);
      }
    };

    const removePlayer = (index: number) => {
      if (localPlayers.length > 3) {
        const newPlayers = [...localPlayers];
        newPlayers.splice(index, 1);
        setLocalPlayers(newPlayers);
      }
    };

    const updatePlayerName = (index: number, name: string) => {
      const newPlayers = [...localPlayers];
      newPlayers[index] = name;
      setLocalPlayers(newPlayers);
    };

    const startLocalGame = () => {
      const validPlayers = localPlayers.filter(p => p.trim() !== '');
      if (validPlayers.length < 3) {
        setError('Need at least 3 players');
        return;
      }
      onStart(validPlayers);
    };

    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6">
        <div className="max-w-lg mx-auto px-4">
          <button onClick={onBack} className="mb-4 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900">
            ← Back
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Play with Friends - Add Players</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-3 mb-4">
              {localPlayers.map((name, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 font-bold text-sm">
                    {idx + 1}
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => updatePlayerName(idx, e.target.value)}
                    placeholder={`Player ${idx + 1} name`}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                  {localPlayers.length > 3 && (
                    <button
                      onClick={() => removePlayer(idx)}
                      className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-500 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            {localPlayers.length < 11 && (
              <button
                onClick={addPlayer}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition mb-4"
              >
                + Add Player
              </button>
            )}

            <button
              onClick={startLocalGame}
              className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition"
            >
              Start Game ({localPlayers.filter(p => p.trim()).length} players)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Bots mode
  const startBotGame = () => {
    const allPlayers = [playerName];
    for (let i = 1; i <= botCount; i++) {
      allPlayers.push(`Bot ${i}`);
    }
    onStart(allPlayers, botCount);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6">
      <div className="max-w-lg mx-auto px-4">
        <button onClick={onBack} className="mb-4 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900">
          ← Back
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Play with Bots</h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Number of Bots: {botCount}
            </label>
            <div className="flex gap-2 flex-wrap">
              {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((count) => (
                <button
                  key={count}
                  onClick={() => setBotCount(count)}
                  className={`w-12 py-2 rounded-lg text-sm font-medium transition ${
                    botCount === count
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">Total players: 1 you + {botCount} bots = {botCount + 1} players</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">You will play as:</p>
            <p className="text-lg font-bold text-green-600">{playerName}</p>
          </div>

          <button
            onClick={startBotGame}
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition"
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
};