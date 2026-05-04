// frontend/src/pages/Home/components/QuoteOfTheDay.tsx
import React, { useState, useEffect } from 'react';
import { quotesData } from '../../../data/quotesData';

export const QuoteOfTheDay: React.FC = () => {
  const [quote, setQuote] = useState(quotesData[0]);

  useEffect(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86400000);
    const quoteIndex = dayOfYear % quotesData.length;
    setQuote(quotesData[quoteIndex]);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden h-full">
      <div className="bg-gray-50 dark:bg-gray-700/50 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-xs">Quote of the Day</h3>
      </div>
      <div className="p-3 min-h-[160px] flex flex-col justify-between">
        <div>
          <div className="text-gray-400 dark:text-gray-500 text-xs mb-1">"</div>
          <p className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed">
            {quote.text}
          </p>
          <div className="text-gray-400 dark:text-gray-500 text-xs mt-1 text-right">"</div>
        </div>
        <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="text-[11px] font-semibold text-gray-800 dark:text-white text-center">
            — {quote.author}
          </div>
          <div className="text-[9px] text-gray-500 dark:text-gray-400 text-center mt-0.5">
            {quote.country}
          </div>
        </div>
      </div>
    </div>
  );
};