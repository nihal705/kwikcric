// frontend/src/pages/Home/components/RecordGallery.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const recordCategories = [
  { type: "runs", title: "Most Runs - ODI", data: [
    { player: "Sachin Tendulkar", value: "18,426", country: "India", matches: 463 },
    { player: "Kumar Sangakkara", value: "14,234", country: "Sri Lanka", matches: 404 },
    { player: "Virat Kohli", value: "13,848", country: "India", matches: 292 },
    { player: "Ricky Ponting", value: "13,704", country: "Australia", matches: 375 },
    { player: "Sanath Jayasuriya", value: "13,430", country: "Sri Lanka", matches: 445 },
  ]},
  { type: "wickets", title: "Most Wickets - ODI", data: [
    { player: "Muttiah Muralitharan", value: "534", country: "Sri Lanka", matches: 350 },
    { player: "Wasim Akram", value: "502", country: "Pakistan", matches: 356 },
    { player: "Waqar Younis", value: "416", country: "Pakistan", matches: 262 },
    { player: "Chaminda Vaas", value: "400", country: "Sri Lanka", matches: 322 },
    { player: "Shaun Pollock", value: "393", country: "South Africa", matches: 303 },
  ]},
  { type: "sixes", title: "Most Sixes - All Formats", data: [
    { player: "Chris Gayle", value: "553", country: "West Indies", matches: 301 },
    { player: "Rohit Sharma", value: "553", country: "India", matches: 262 },
    { player: "Shahid Afridi", value: "476", country: "Pakistan", matches: 398 },
    { player: "Brendon McCullum", value: "398", country: "New Zealand", matches: 260 },
    { player: "MS Dhoni", value: "359", country: "India", matches: 350 },
  ]},
];

export const RecordGallery: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % recordCategories.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + recordCategories.length) % recordCategories.length);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -200 : 200,
      opacity: 0,
    }),
  };

  const currentCategory = recordCategories[activeIndex];

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
            <span className="text-yellow-600 dark:text-yellow-400 text-xs">IMMORTAL RECORDS</span>
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Record Holders</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Legends who set the bar</p>
        </div>
        
        <div className="relative max-w-3xl mx-auto">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            ←
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            →
          </button>
          
          {/* Carousel Content */}
          <div className="overflow-hidden mx-8">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-lg font-bold text-yellow-600 dark:text-yellow-400 text-center mb-5">
                  {currentCategory.title}
                </h3>
                <div className="space-y-2">
                  {currentCategory.data.map((player, idx) => (
                    <div
                      key={player.player}
                      className={`flex justify-between items-center p-2 rounded-lg transition-all ${
                        idx === 0 ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-gray-100 dark:bg-gray-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-lg">
                          {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white text-sm">{player.player}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{player.country}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{player.value}</div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400">{player.matches} matches</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Dots Indicator */}
          <div className="flex justify-center gap-1.5 mt-4">
            {recordCategories.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > activeIndex ? 1 : -1);
                  setActiveIndex(idx);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === activeIndex ? 'w-4 bg-yellow-500' : 'bg-gray-400 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};