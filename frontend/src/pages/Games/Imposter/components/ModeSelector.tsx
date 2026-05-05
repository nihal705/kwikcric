// frontend/src/pages/Games/Imposter/components/ModeSelector.tsx
import React from 'react';

interface ModeSelectorProps {
  onSelectMode: (mode: 'local' | 'bots') => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ onSelectMode }) => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Imposter</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Find the imposter among cricket fans
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => onSelectMode('local')}
            className="p-6 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl text-center hover:from-green-700 hover:to-green-800 transition"
          >
            <div className="text-2xl mb-2">👥</div>
            <div className="text-lg font-bold mb-1">Play with Friends</div>
            <div className="text-xs opacity-90">Same device - pass around and play</div>
          </button>

          <button
            onClick={() => onSelectMode('bots')}
            className="p-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl text-center hover:from-purple-700 hover:to-purple-800 transition"
          >
            <div className="text-2xl mb-2">🤖</div>
            <div className="text-lg font-bold mb-1">Play with Bots</div>
            <div className="text-xs opacity-90">Play alone against AI opponents</div>
          </button>
        </div>
      </div>
    </div>
  );
};