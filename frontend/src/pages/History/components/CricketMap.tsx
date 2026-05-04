// frontend/src/pages/History/components/CricketMap.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface CricketMapProps {
  era?: string;
}

const allCountries = [
  { name: 'England', year: 1877,  color: 'bg-red-500' },
  { name: 'Australia', year: 1877, icon: '', color: 'bg-yellow-600' },
  { name: 'South Africa', year: 1889, icon: '', color: 'bg-green-600' },
  { name: 'West Indies', year: 1928, icon: '', color: 'bg-purple-600' },
  { name: 'New Zealand', year: 1930, icon: '', color: 'bg-slate-600' },
  { name: 'India', year: 1932, icon: '', color: 'bg-orange-600' },
  { name: 'Pakistan', year: 1952, icon: '', color: 'bg-green-700' },
  { name: 'Sri Lanka', year: 1982, icon: '', color: 'bg-blue-700' },
  { name: 'Zimbabwe', year: 1992, icon: '', color: 'bg-yellow-500' },
  { name: 'Bangladesh', year: 2000, icon: '', color: 'bg-green-500' },
  { name: 'Afghanistan', year: 2018, icon: '', color: 'bg-red-700' },
  { name: 'Ireland', year: 2018, icon: '', color: 'bg-green-400' },
];

const getCountriesForEra = (era: string) => {
  const yearLimit: Record<string, number> = {
    global: 1900,
    golden: 1950,
    modern: 2000,
    t20: 2025,
  };
  const limit = yearLimit[era] || 1900;
  return allCountries.filter(c => c.year <= limit);
};

export const CricketMap: React.FC<CricketMapProps> = ({ era = 'global' }) => {
  const countries = getCountriesForEra(era);
  const eraName = {
    global: 'the 19th Century',
    golden: 'the Golden Era',
    modern: 'the Modern Era',
    t20: 'the T20 Era',
  }[era] || 'this period';

  if (countries.length === 0) return null;

  return (
    <section className="py-4 bg-white dark:bg-gray-900 rounded-lg">
      <div className="text-center mb-3">
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-0.5">Cricket Around the World</h3>
        <p className="text-[10px] text-gray-600 dark:text-gray-400">Test-playing nations during {eraName}</p>
      </div>
      
      <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg p-3 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 1px)',
            backgroundSize: '25px 25px',
          }} />
        </div>
        
        <div className="relative z-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
            {countries.map((country, index) => (
              <motion.div
                key={country.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
                viewport={{ once: true }}
                whileHover={{ y: -1 }}
                className={`${country.color} bg-opacity-20 dark:bg-opacity-30 rounded-md p-1.5 text-center border border-gray-200 dark:border-gray-700`}
              >
                <div className="text-lg mb-0.5">{country.icon}</div>
                <div className="font-semibold text-gray-900 dark:text-white text-[10px]">{country.name}</div>
                <div className="text-[8px] text-gray-500 dark:text-gray-400">{country.year}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      <p className="text-center text-[9px] text-gray-500 dark:text-gray-500 mt-2">
        Test match status achieved year • Nations during {eraName}
      </p>
    </section>
  );
};