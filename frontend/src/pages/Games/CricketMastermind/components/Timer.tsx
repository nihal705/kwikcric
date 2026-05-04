// frontend/src/pages/Games/CricketMastermind/components/Timer.tsx
import React, { useEffect } from 'react';

interface TimerProps {
    timeRemaining: number;
    totalTime: number;
    onTimeout: () => void;
    isActive: boolean;
}

export const Timer: React.FC<TimerProps> = ({ timeRemaining, totalTime, onTimeout, isActive }) => {
    useEffect(() => {
        if (timeRemaining <= 0 && isActive) {
            onTimeout();
        }
    }, [timeRemaining, isActive]);

    const percentage = (timeRemaining / totalTime) * 100;
    const getColor = () => {
        if (percentage > 60) return 'bg-green-500';
        if (percentage > 30) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Time Remaining</span>
                <span className={timeRemaining <= 5 ? 'text-red-500 font-bold animate-pulse' : ''}>
                    {timeRemaining}s
                </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                    className={`h-full ${getColor()} transition-all duration-1000 ease-linear`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};