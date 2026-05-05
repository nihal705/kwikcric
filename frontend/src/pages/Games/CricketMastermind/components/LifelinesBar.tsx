// frontend/src/pages/Games/CricketMastermind/components/LifelinesBar.tsx
import React from 'react';

interface LifelinesBarProps {
    lifelines: {
        fiftyFifty: boolean;
        skip: boolean;
        hint: boolean;
        audio: boolean;
    };
    onUseLifeline: (type: 'fiftyFifty' | 'skip' | 'hint' | 'audio') => void;
}

export const LifelinesBar: React.FC<LifelinesBarProps> = ({ lifelines, onUseLifeline }) => {
    return (
        <div className="flex gap-2">
            <button
                onClick={() => onUseLifeline('fiftyFifty')}
                disabled={!lifelines.fiftyFifty}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1
                    ${lifelines.fiftyFifty 
                        ? 'bg-purple-600 text-white hover:bg-purple-500 cursor-pointer' 
                        : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
                    }`}
            >
                🎯 50-50
            </button>
            <button
                onClick={() => onUseLifeline('skip')}
                disabled={!lifelines.skip}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1
                    ${lifelines.skip 
                        ? 'bg-blue-600 text-white hover:bg-blue-500 cursor-pointer' 
                        : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
                    }`}
            >
                🔄 Skip
            </button>
            <button
                onClick={() => onUseLifeline('hint')}
                disabled={!lifelines.hint}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1
                    ${lifelines.hint 
                        ? 'bg-yellow-600 text-white hover:bg-yellow-500 cursor-pointer' 
                        : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
                    }`}
            >
                💡 Hint
            </button>
            <button
                onClick={() => onUseLifeline('audio')}
                disabled={!lifelines.audio}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1
                    ${lifelines.audio 
                        ? 'bg-green-600 text-white hover:bg-green-500 cursor-pointer' 
                        : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
                    }`}
            >
                🔊 Audio
            </button>
        </div>
    );
};