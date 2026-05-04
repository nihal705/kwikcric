// frontend/src/pages/History/components/EraSelector.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface EraSelectorProps {
  activeEra: string;
  onEraChange: (era: any) => void;
}

const eras = [
  { id: 'origins', label: 'Origins', icon: '', period: '1550-1699' },
  { id: 'rules', label: 'Rules', icon: '', period: '1700-1799' },
  { id: 'global', label: 'Global', icon: '', period: '1800-1899' },
  { id: 'golden', label: 'Golden', icon: '', period: '1900-1949' },
  { id: 'modern', label: 'Modern', icon: '', period: '1950-1999' },
  { id: 't20', label: 'T20 Era', icon: '', period: '2000-2026' },
];

export const EraSelector: React.FC<EraSelectorProps> = ({ activeEra, onEraChange }) => {
  return (
    <div className="sticky top-14 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 py-2 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-1.5">
          {eras.map((era) => (
            <motion.button
              key={era.id}
              onClick={() => onEraChange(era.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                activeEra === era.id
                  ? 'bg-yellow-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <span className="text-sm">{era.icon}</span>
              <span className="hidden sm:inline">{era.label}</span>
              <span className="text-[10px] opacity-70 hidden md:inline">{era.period}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};