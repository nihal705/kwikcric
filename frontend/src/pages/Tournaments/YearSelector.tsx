import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface YearSelectorProps {
  years: number[];
  selectedYear: number;
  onYearChange: (year: number) => void;
}

export const YearSelector: React.FC<YearSelectorProps> = ({ years, selectedYear, onYearChange }) => {
  const currentIndex = years.indexOf(selectedYear);
  const prevYear = currentIndex > 0 ? years[currentIndex - 1] : null;
  const nextYear = currentIndex < years.length - 1 ? years[currentIndex + 1] : null;

  return (
    <div className="flex items-center space-x-2">
      {prevYear && (
        <button
          onClick={() => onYearChange(prevYear)}
          className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <FiChevronLeft size={18} />
        </button>
      )}
      
      <div className="relative">
        <select
          value={selectedYear}
          onChange={(e) => onYearChange(parseInt(e.target.value))}
          className="appearance-none px-4 py-2 pr-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {nextYear && (
        <button
          onClick={() => onYearChange(nextYear)}
          className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <FiChevronRight size={18} />
        </button>
      )}
    </div>
  );
};