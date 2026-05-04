// frontend/src/pages/Home/components/StatsDashboard.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const statsData = [
  { label: "Total Runs", value: 2456789, icon: "", suffix: "runs", description: "Across all formats" },
  { label: "Total Wickets", value: 98765, icon: "", suffix: "wickets", description: "In international cricket" },
  { label: "Total Matches", value: 12345, icon: "", suffix: "matches", description: "Test + ODI + T20I" },
  { label: "Total Players", value: 5432, icon: "", suffix: "players", description: "Who played internationals" },
  { label: "Centuries", value: 11234, icon: "", suffix: "100s", description: "In all formats" },
  { label: "Sixes Hit", value: 34567, icon: "", suffix: "sixes", description: "In international cricket" },
];

const AnimatedCounter: React.FC<{ value: number; suffix: string }> = ({ value, suffix }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const increment = value / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {count.toLocaleString()} {suffix}
    </span>
  );
};

export const StatsDashboard: React.FC = () => {
  return (
    <section className="py-10 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-yellow-500/10 rounded-full px-3 py-0.5 mb-3"
          >
            <span className="text-yellow-600 dark:text-yellow-400 text-xs">THE NUMBERS BEHIND THE GAME</span>
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Cricket by the Numbers</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Over 150 years of history captured in data</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-900 rounded-lg p-3 text-center border border-gray-200 dark:border-gray-700 hover:border-yellow-500/50 transition-all duration-300"
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-xl md:text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                <AnimatedCounter value={stat.value} suffix="" />
              </div>
              <div className="text-xs font-semibold text-gray-900 dark:text-white mt-1">{stat.label}</div>
              <div className="text-[10px] text-gray-500 dark:text-gray-500 mt-0.5">{stat.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};