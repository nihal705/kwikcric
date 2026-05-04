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
        <div className="mt-4 grid grid-cols-4 gap-2">
            <button
                onClick={() => onUseLifeline('fiftyFifty')}
                disabled={!lifelines.fiftyFifty}
                className={`py-2 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-1
                    ${lifelines.fiftyFifty 
                        ? 'bg-purple-600 text-white hover:bg-purple-500' 
                        : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
            >
                🎯 50-50
            </button>
            <button
                onClick={() => onUseLifeline('skip')}
                disabled={!lifelines.skip}
                className={`py-2 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-1
                    ${lifelines.skip 
                        ? 'bg-blue-600 text-white hover:bg-blue-500' 
                        : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
            >
                🔄 Skip
            </button>
            <button
                onClick={() => onUseLifeline('hint')}
                disabled={!lifelines.hint}
                className={`py-2 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-1
                    ${lifelines.hint 
                        ? 'bg-yellow-600 text-white hover:bg-yellow-500' 
                        : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
            >
                💡 Hint
            </button>
            <button
                onClick={() => onUseLifeline('audio')}
                disabled={!lifelines.audio}
                className={`py-2 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-1
                    ${lifelines.audio 
                        ? 'bg-green-600 text-white hover:bg-green-500' 
                        : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
            >
                🔊 Audio
            </button>
        </div>
    );
};