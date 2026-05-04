// frontend/src/pages/Home/components/BirthdayReminder.tsx
import React, { useState, useEffect } from 'react';
import { birthdaysData } from '../../../data/birthdaysData';

interface Birthday {
  name: string;
  date: string;
  country: string;
  role: string;
  age?: number;
}

export const BirthdayReminder: React.FC = () => {
  const [todayBirthdays, setTodayBirthdays] = useState<Birthday[]>([]);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState<Birthday[]>([]);

  useEffect(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const todayMonthDay = `${today.getMonth() + 1}-${today.getDate()}`;

    const todayBirths: Birthday[] = [];
    const upcomingBirths: Birthday[] = [];

    birthdaysData.forEach(player => {
      const birthDate = new Date(player.date);
      const birthMonthDay = `${birthDate.getMonth() + 1}-${birthDate.getDate()}`;
      
      if (birthMonthDay === todayMonthDay) {
        const age = currentYear - birthDate.getFullYear();
        todayBirths.push({ ...player, age });
      } else {
        // Check if birthday is in next 7 days
        const birthThisYear = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
        const diffDays = Math.ceil((birthThisYear.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays > 0 && diffDays <= 7) {
          upcomingBirths.push({ ...player });
        }
      }
    });

    setTodayBirthdays(todayBirths);
    setUpcomingBirthdays(upcomingBirths.slice(0, 5));
    
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden h-full">
      <div className="bg-gray-50 dark:bg-gray-700/50 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-xs">Birthday Reminder</h3>
      </div>
      <div className="p-2">
        {todayBirthdays.length > 0 ? (
          <div className="mb-3">
            <div className="text-[10px] font-semibold text-green-600 dark:text-green-400 mb-1">Today's Birthdays</div>
            {todayBirthdays.map((player, idx) => (
              <div key={idx} className="bg-green-50 dark:bg-green-900/20 rounded-md p-1.5 mb-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-800 dark:text-white">{player.name}</span>
                  <span className="text-[10px] text-green-600 dark:text-green-400">{player.age} years</span>
                </div>
                <div className="flex justify-between text-[9px] text-gray-500">
                  <span>{player.country}</span>
                  <span>{player.role}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-3">
            <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1">No Birthdays Today</div>
          </div>
        )}
        
        {upcomingBirthdays.length > 0 && (
          <div>
            <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1">Upcoming Birthdays</div>
            {upcomingBirthdays.map((player, idx) => (
              <div key={idx} className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-700">
                <span className="text-xs text-gray-700 dark:text-gray-300">{player.name}</span>
                <span className="text-[9px] text-gray-500">{player.country}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    
    </div>
  );
};