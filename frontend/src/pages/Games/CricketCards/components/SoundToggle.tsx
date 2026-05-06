// frontend/src/pages/Games/CricketCards/components/SoundToggle.tsx
import React, { useState, useEffect } from 'react';
import { soundService } from '../services/soundService';

interface SoundToggleProps {
  className?: string;
}

export const SoundToggle: React.FC<SoundToggleProps> = ({ className = '' }) => {
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    setIsEnabled(soundService.getEnabled());
  }, []);

  const toggleSound = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    soundService.setEnabled(newState);
  };

  return (
    <button
      onClick={toggleSound}
      className={`p-2 rounded-lg transition ${className} ${
        isEnabled ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-800 text-gray-500 hover:bg-gray-700'
      }`}
      title={isEnabled ? 'Sound On' : 'Sound Off'}
    >
      {isEnabled ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9h4l6-4v14l-6-4H3V9z" />
          <path d="M15 10a4 4 0 010 8M19 6a8 8 0 010 16" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9h4l6-4v14l-6-4H3V9z" />
          <line x1="18" y1="9" x2="22" y2="15" />
          <line x1="22" y1="9" x2="18" y2="15" />
        </svg>
      )}
    </button>
  );
};