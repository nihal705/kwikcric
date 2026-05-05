// frontend/src/pages/Games/Imposter/components/ThemeSelector.tsx
import React, { useState } from 'react';

interface ThemeSelectorProps {
  onSelect: (theme: string, rounds: number) => void;
  onBack: () => void;
}

const themes = [
  { id: 'Cricket Players', name: 'Cricket Players', description: 'Famous cricket players from around the world' },
  { id: 'IPL Teams', name: 'IPL Teams', description: 'Indian Premier League teams' },
  { id: 'World Cups', name: 'World Cups', description: 'ICC World Cup tournaments' },
  { id: 'Cricket Rules', name: 'Cricket Rules', description: 'Rules and regulations of cricket' },
  { id: 'Umpires', name: 'Umpires', description: 'Famous cricket umpires' },
  { id: 'Stadiums', name: 'Stadiums', description: 'Famous cricket stadiums' },
  { id: 'Commentators', name: 'Commentators', description: 'Famous cricket commentators' },
  { id: 'Records', name: 'Records', description: 'Cricket records and milestones' },
  { id: 'Mixed', name: 'Mixed', description: 'Mix of all categories' }
];

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ onSelect, onBack }) => {
  const [selectedTheme, setSelectedTheme] = useState('Cricket Players');
  const [totalRounds, setTotalRounds] = useState(3);

  const handleSubmit = () => {
    onSelect(selectedTheme, totalRounds);
  };

  return (
    <div className="min-h bg-gray-100 dark:bg-gray-900 py-4">
      <div className="max-w-4xl mx-auto px-4">
        <button onClick={onBack} className="mb-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900">
          ← Back
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Game Setup</h2>

          {/* Theme Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Theme
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.name)}
                  className={`p-3 rounded-lg text-left transition ${
                    selectedTheme === theme.name
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                  }`}
                >
                  <div className="font-medium text-sm">{theme.name}</div>
                  <div className="text-xs opacity-75 mt-1">{theme.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Number of Rounds */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Number of Rounds: {totalRounds}
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((round) => (
                <button
                  key={round}
                  onClick={() => setTotalRounds(round)}
                  className={`w-12 py-2 rounded-lg text-sm font-medium transition ${
                    totalRounds === round
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {round}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition"
          >
            Next: Add Players →
          </button>
        </div>
      </div>
    </div>
  );
};