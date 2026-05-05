// frontend/src/pages/Games/CricketMastermind/components/AudioHint.tsx
import React from 'react';
import { useAudioHint } from '../hooks/useAudioHint';

interface AudioHintProps {
    text: string;
    className?: string;
    onPlay?: () => void;
    onStop?: () => void;
}

export const AudioHint: React.FC<AudioHintProps> = ({ 
    text, 
    className = '', 
    onPlay, 
    onStop 
}) => {
    const { isPlaying, isSupported, play, stop } = useAudioHint({ onPlay, onStop });

    if (!isSupported) {
        return null;
    }

    return (
        <button
            onClick={() => isPlaying ? stop() : play(text)}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition ${
                isPlaying 
                    ? 'bg-green-600 text-white animate-pulse'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            } ${className}`}
            title={isPlaying ? 'Stop reading' : 'Read aloud'}
        >
            <span>{isPlaying ? '🔊' : '🔈'}</span>
            <span>{isPlaying ? 'Playing...' : 'Audio Hint'}</span>
        </button>
    );
};