// frontend/src/pages/Home/components/TournamentCountdown.tsx
import React, { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface Tournament {
  name: string;
  year: number;
  host: string;
  date: string;
  icon: string;
}

const tournamentsData: Tournament[] = [
  { 
    name: "ODI World Cup", 
    year: 2027, 
    host: "South Africa/Zimbabwe/Namibia", 
    date: "2027-10-01",
    icon: ""
  },
  { 
    name: "T20 World Cup", 
    year: 2028, 
    host: "Australia/New Zealand", 
    date: "2028-10-01",
    icon: ""
  },
  { 
    name: "Champions Trophy", 
    year: 2029, 
    host: "India", 
    date: "2029-09-01",
    icon: ""
  },
  { 
    name: "WTC Final", 
    year: 2027, 
    host: "Lord's, London", 
    date: "2027-06-01",
    icon: ""
  }
];

export const TournamentCountdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<{ [key: number]: TimeLeft }>({});

  useEffect(() => {
    const calculateTimeLeft = () => {
      const newTimeLeft: { [key: number]: TimeLeft } = {};
      tournamentsData.forEach((tournament, idx) => {
        const targetDate = new Date(tournament.date);
        const now = new Date();
        const difference = targetDate.getTime() - now.getTime();

        if (difference > 0) {
          newTimeLeft[idx] = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
          };
        } else {
          newTimeLeft[idx] = { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
      });
      setTimeLeft(newTimeLeft);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden h-full">
      <div className="bg-gray-50 dark:bg-gray-700/50 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-xs">Upcoming Tournaments</h3>
      </div>
      <div className="p-2 space-y-2">
        {tournamentsData.map((tournament, idx) => {
          const time = timeLeft[idx];
          if (!time) return null;
          
          return (
            <div key={tournament.name} className="bg-gray-50 dark:bg-gray-700/30 rounded-md p-2">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{tournament.icon}</span>
                  <div>
                    <span className="text-xs font-semibold text-gray-800 dark:text-white">{tournament.name}</span>
                    <span className="text-[10px] text-gray-500 ml-1">{tournament.year}</span>
                  </div>
                </div>
              </div>
              <div className="text-[10px] text-gray-500 mb-2">Host: {tournament.host}</div>
              <div className="grid grid-cols-4 gap-1 text-center">
                <div className="bg-gray-100 dark:bg-gray-800 rounded py-1">
                  <div className="text-sm font-bold text-yellow-600 dark:text-yellow-400">{time.days}</div>
                  <div className="text-[8px] text-gray-500">Days</div>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded py-1">
                  <div className="text-sm font-bold text-yellow-600 dark:text-yellow-400">{time.hours}</div>
                  <div className="text-[8px] text-gray-500">Hours</div>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded py-1">
                  <div className="text-sm font-bold text-yellow-600 dark:text-yellow-400">{time.minutes}</div>
                  <div className="text-[8px] text-gray-500">Mins</div>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded py-1">
                  <div className="text-sm font-bold text-yellow-600 dark:text-yellow-400">{time.seconds}</div>
                  <div className="text-[8px] text-gray-500">Secs</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};