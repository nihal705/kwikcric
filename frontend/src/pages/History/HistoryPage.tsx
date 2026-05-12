// frontend/src/pages/History/HistoryPage.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EraSelector } from './components/EraSelector';
import { EraTimeline } from './components/EraTimeline';

type EraType = 'origins' | 'rules' | 'global' | 'golden' | 'modern' | 't20';

const HistoryPage: React.FC = () => {
  const [activeEra, setActiveEra] = useState<EraType>('origins');

  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-[#0f172a] text-gray-900 dark:text-white" style={{ backgroundImage: 'none' }}>
      {/* Hero Section - Compact */}
      <div className="bg-gradient-to-r from-gray-900 via-green-900 to-gray-900 py-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl font-bold text-white mb-1">History of Cricket</h1>
          <p className="text-xs text-gray-300">From 1550 to 2026 — The Complete Journey</p>
        </motion.div>
      </div>
      
      {/* Era Selector Component */}
      <EraSelector activeEra={activeEra} onEraChange={setActiveEra} />
      
      {/* Era Timeline Component (includes stats and map) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <EraTimeline activeEra={activeEra} />
      </div>
      
      {/* Footer Note - Compact */}
      <div className="text-center py-4 text-[10px] text-gray-500 dark:text-gray-500 border-t border-gray-200 dark:border-gray-800">
        <p>Data compiled from ICC records, ESPNcricinfo, and historical archives</p>
      </div>
    </div>
  );
};

export default HistoryPage;