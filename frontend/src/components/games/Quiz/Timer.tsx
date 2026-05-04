import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TimerProps {
  timeLeft: number;
  totalTime: number;
  onTimeOut: () => void;
  isActive: boolean;
}

export const Timer: React.FC<TimerProps> = ({ timeLeft, totalTime, onTimeOut, isActive }) => {
  const [localTimeLeft, setLocalTimeLeft] = useState(timeLeft);

  useEffect(() => {
    if (!isActive) return;
    
    setLocalTimeLeft(timeLeft);
  }, [timeLeft, isActive]);

  useEffect(() => {
    if (!isActive) return;
    
    if (localTimeLeft <= 0) {
      onTimeOut();
      return;
    }
    
    const timer = setTimeout(() => {
      setLocalTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [localTimeLeft, isActive, onTimeOut]);

  const percentage = (localTimeLeft / totalTime) * 100;
  
  let color = "bg-green-500";
  if (percentage < 25) color = "bg-red-500";
  else if (percentage < 50) color = "bg-yellow-500";

  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-500">Time Remaining</span>
        <motion.span
          key={localTimeLeft}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className={`font-mono font-bold ${percentage < 25 ? 'text-red-500' : ''}`}
        >
          {localTimeLeft}s
        </motion.span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'linear' }}
          className={`h-2 rounded-full ${color}`}
        />
      </div>
    </div>
  );
};