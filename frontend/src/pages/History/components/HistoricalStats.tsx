// frontend/src/pages/History/components/HistoricalStats.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface HistoricalStatsProps {
  era?: string;
}

const eraStats: Record<string, { label: string; value: string; icon: string }[]> = {
  origins: [
    { label: 'First Match', value: '1550', icon: '' },
    { label: 'Dictionary Entry', value: '1598', icon: '' },
    { label: 'County Teams', value: '1660s', icon: '' },
  ],
  rules: [
    { label: 'Laws of Cricket', value: '1744', icon: '' },
    { label: 'MCC Founded', value: '1787', icon: '' },
    { label: 'Hambledon Club', value: '1760', icon: '' },
  ],
  global: [
    { label: 'First Int\'l Match', value: '1844', icon: '' },
    { label: 'First Test', value: '1877', icon: '' },
    { label: 'The Ashes', value: '1882', icon: '' },
    { label: 'Test Nations', value: '3', icon: '' },
  ],
  golden: [
    { label: 'Bradman\'s Avg', value: '99.94', icon: '' },
    { label: 'Bodyline', value: '1930', icon: '' },
    { label: 'Invincibles', value: '1948', icon: '' },
  ],
  modern: [
    { label: 'First ODI', value: '1971', icon: '' },
    { label: 'First World Cup', value: '1975', icon: '' },
    { label: 'India\'s First WC', value: '1983', icon: '' },
    { label: 'Day-Night', value: '1992', icon: '' },
  ],
  t20: [
    { label: 'First T20I', value: '2005', icon: '' },
    { label: 'First T20 WC', value: '2007', icon: '' },
    { label: 'IPL Launched', value: '2008', icon: '' },
    { label: 'WTC', value: '2019', icon: '' },
    { label: 'Latest T20 WC', value: '2026', icon: '' },
  ],
};

const allTimeRecords = [
  { label: 'Most Runs', player: 'Sachin Tendulkar', value: '34,357', format: 'All Format' },
  { label: 'Most Wickets', player: 'Muttiah Muralitharan', value: '1,347', format: 'All Format' },
  { label: 'Most Hundreds', player: 'Sachin Tendulkar', value: '100', format: 'All Format' },
  { label: 'Most Sixes', player: 'Rohit Sharma', value: '645', format: 'All Format' },
  { label: 'Highest Score', player: 'Brian Lara', value: '400*', format: 'Test' },
  { label: 'Best Bowling', player: 'Jim Laker', value: '10/53', format: 'Test' },
];

export const HistoricalStats: React.FC<HistoricalStatsProps> = ({ era = 'origins' }) => {
  const stats = eraStats[era] || eraStats.origins;

  return (
    <section className="py-5 bg-gray-50 dark:bg-gray-800 rounded-lg mb-6">
      <div className="px-4">
        <div className="text-center mb-4">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-0.5">Era Statistics</h3>
          <p className="text-[10px] text-gray-600 dark:text-gray-400">Key numbers from this period</p>
        </div>
        
        {/* Era-Specific Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-5">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-900 rounded-lg p-2 text-center border border-gray-200 dark:border-gray-700"
            >
              <div className="text-xl mb-0.5">{stat.icon}</div>
              <div className="text-sm font-bold text-yellow-600 dark:text-yellow-400">{stat.value}</div>
              <div className="text-[9px] text-gray-600 dark:text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
        
        {/* All-Time Records (shown for Modern and T20 eras) */}
        {(era === 'modern' || era === 't20') && (
          <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="bg-yellow-500 px-3 py-1.5">
              <h4 className="font-bold text-white text-center text-xs">🏆 All-Time Cricket Records</h4>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 dark:divide-gray-700">
              {allTimeRecords.map((record) => (
                <div key={record.label} className="p-2 text-center">
                  <div className="text-[9px] text-gray-500 dark:text-gray-400 mb-0.5">{record.format}</div>
                  <div className="text-[10px] font-semibold text-gray-900 dark:text-white">{record.label}</div>
                  <div className="text-sm font-bold text-yellow-600 dark:text-yellow-400 my-0.5">{record.value}</div>
                  <div className="text-[9px] text-gray-600 dark:text-gray-400 truncate">{record.player}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};