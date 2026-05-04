// frontend/src/pages/Home/components/HistoricalTimeline.tsx
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const timelineData = [
  { year: 1877, event: "First Test Match", description: "England vs Australia at Melbourne", icon: "" },
  { year: 1900, event: "Cricket in Olympics", description: "First and only appearance until 2028", icon: "" },
  { year: 1930, event: "Bradman Era", description: "Don Bradman averages 99.94", icon: "" },
  { year: 1948, event: "The Invincibles", description: "Australia unbeaten tour of England", icon: "" },
  { year: 1960, event: "First Tied Test", description: "Australia vs West Indies, Brisbane", icon: "" },
  { year: 1971, event: "First ODI", description: "Australia vs England at MCG", icon: "" },
  { year: 1975, event: "First World Cup", description: "West Indies vs Australia", icon: "" },
  { year: 1983, event: "India's First WC", description: "Kapil's Devils stun the world", icon: "" },
  { year: 1992, event: "Day-Night Cricket", description: "First day-night Test", icon: "" },
  { year: 2005, event: "First T20I", description: "Australia vs New Zealand", icon: "" },
  { year: 2007, event: "First T20 WC", description: "India win inaugural title", icon: "" },
  { year: 2011, event: "India's Home WC", description: "Dhoni's six finishes it", icon: "" },
  { year: 2019, event: "Super Over Final", description: "England win on boundary count",  },
  { year: 2023, event: "Australia Win WC", description: "6th title for Aussies", icon: "" },
  { year: 2026, event: "India Champion", description: "Back-to-back T20 WC wins", icon: "" },
];

export const HistoricalTimeline: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section className="py-10 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-yellow-500/10 rounded-full px-3 py-0.5 mb-3"
          >
            <span className="text-yellow-600 dark:text-yellow-400 text-xs">THROUGH THE AGES</span>
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Cricket Timeline</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">150+ years of cricketing history</p>
        </div>
        
        <div ref={containerRef} className="relative overflow-x-auto pb-6">
          <div className="relative min-w-[1000px]">
            {/* Timeline Line */}
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-gradient-to-r from-green-600 via-yellow-500 to-green-600 rounded-full" />
            
            {/* Timeline Nodes */}
            <div className="relative flex justify-between">
              {timelineData.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className="flex flex-col items-center cursor-pointer group"
                  style={{ width: `${100 / timelineData.length}%` }}
                >
                  <div className="relative">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mb-2 z-10 relative" />
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-yellow-500 rounded-full animate-ping opacity-50" />
                  </div>
                  
                  <div className="text-center mt-1">
                    <div className="text-[10px] font-bold text-yellow-600 dark:text-yellow-400">{item.year}</div>
                    <div className="text-xs font-semibold text-gray-900 dark:text-white mt-1">{item.event}</div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-500 hidden group-hover:block transition-all">
                      {item.description}
                    </div>
                    <div className="text-sm mt-1">{item.icon}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        <p className="text-center text-gray-500 dark:text-gray-500 text-[10px] mt-4">
          Scroll horizontally to explore more → {timelineData.length} milestones captured
        </p>
      </div>
    </section>
  );
};