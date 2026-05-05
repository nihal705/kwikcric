// frontend/src/pages/Games/CricketMastermind/hooks/useAudioHint.ts
import { useState, useCallback, useRef } from 'react';
import { audioManager } from '../logic/audioManager';

interface UseAudioHintProps {
    onPlay?: () => void;
    onStop?: () => void;
}

export const useAudioHint = ({ onPlay, onStop }: UseAudioHintProps = {}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isSupported, setIsSupported] = useState(true);
    const currentTextRef = useRef<string>('');

    const play = useCallback((text: string) => {
        if (!audioManager) {
            setIsSupported(false);
            return;
        }
        
        currentTextRef.current = text;
        setIsPlaying(true);
        onPlay?.();
        
        // Speech synthesis doesn't have a reliable way to track end
        // We'll set a timer based on text length
        const duration = Math.max(2000, text.length * 100);
        
        setTimeout(() => {
            setIsPlaying(false);
            onStop?.();
        }, duration);
        
        audioManager.speak(text);
    }, [onPlay, onStop]);

    const stop = useCallback(() => {
        audioManager.stopSpeaking();
        setIsPlaying(false);
        onStop?.();
    }, [onStop]);

    const playQuestion = useCallback((question: string) => {
        play(`Question: ${question}`);
    }, [play]);

    const playOption = useCallback((option: string, letter: string) => {
        play(`Option ${letter}: ${option}`);
    }, [play]);

    const playCorrectAnswer = useCallback((answer: string) => {
        play(`The correct answer is: ${answer}`);
    }, [play]);

    const playResult = useCallback((isCorrect: boolean, correctAnswer: string) => {
        if (isCorrect) {
            play('Correct answer! Well done!');
        } else {
            play(`Wrong answer. The correct answer is: ${correctAnswer}`);
        }
    }, [play]);

    const playTimerWarning = useCallback((seconds: number) => {
        if (seconds <= 5 && seconds > 0) {
            play(`${seconds} seconds remaining`);
        }
    }, [play]);

    return {
        isPlaying,
        isSupported,
        play,
        stop,
        playQuestion,
        playOption,
        playCorrectAnswer,
        playResult,
        playTimerWarning
    };
};