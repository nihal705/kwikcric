// frontend/src/pages/Home/components/FlipFacts.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const flipFactsData = [
  {
    front: { title: "Fastest Century" },
    back: { fact: "AB de Villiers scored 100 off just 31 balls against West Indies in 2015!", year: 2015, player: "AB de Villiers" }
  },
  {
    front: { title: "Most Sixes in Match" },
    back: { fact: "Afghanistan smashed 22 sixes against Ireland in 2019 - the most by any team in a T20I!", year: 2019, player: "Team Afghanistan" }
  },
  {
    front: { title: "Best Bowling in WC" },
    back: { fact: "Glenn McGrath took 71 wickets across 4 World Cups - the most by any bowler!", year: 2007, player: "Glenn McGrath" }
  },
  {
    front: { title: "Most World Cups" },
    back: { fact: "Australia has won 6 ODI World Cups - the most by any nation!", year: 2023, player: "Australia" }
  },
  {
    front: { title: "Longest Test Career" },
    back: { fact: "Sachin Tendulkar played 200 Tests over 24 years - the most in cricket history!", year: 2013, player: "Sachin Tendulkar" }
  },
  {
    front: { title: "Most Sixes All Time" },
    back: { fact: "Chris Gayle has hit 553 sixes in international cricket - the most by any player!", year: 2019, player: "Chris Gayle" }
  },
];

const FlipCard: React.FC<{ data: typeof flipFactsData[0]; index: number }> = ({ data, index }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      viewport={{ once: true }}
      className="relative h-36 cursor-pointer"
      style={{ perspective: '1000px' }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className="relative w-full h-full transition-all duration-400"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        {/* Front Side - Without emoji */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg p-3 flex flex-col items-center justify-center text-center border border-gray-200 dark:border-gray-700 shadow-sm"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="text-base font-bold text-gray-900 dark:text-white">{data.front.title}</div>
          <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-2">👇 Tap to reveal</div>
        </div>
        
        {/* Back Side */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-lg p-3 flex flex-col items-center justify-center text-center shadow-md"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="text-[10px] text-white/80 mb-0.5">🏆 {data.back.year}</div>
          <p className="text-xs text-white font-medium leading-tight">{data.back.fact}</p>
          <div className="text-[10px] text-white/80 mt-1.5">— {data.back.player}</div>
          <div className="text-[9px] text-white/70 mt-1">✨ Tap to flip back</div>
        </div>
      </div>
    </motion.div>
  );
};

export const FlipFacts: React.FC = () => {
  return (
    <section className="py-6 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 bg-yellow-500/10 rounded-full px-2.5 py-0.5 mb-2"
          >
            <span className="text-yellow-600 dark:text-yellow-400 text-[10px]">💡</span>
            <span className="text-yellow-600 dark:text-yellow-400 text-[10px] font-medium">DID YOU KNOW?</span>
          </motion.div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-0.5">Amazing Cricket Facts</h2>
          <p className="text-xs text-gray-600 dark:text-gray-400">Tap on any card to reveal surprising facts</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {flipFactsData.map((fact, index) => (
            <FlipCard key={index} data={fact} index={index} />
          ))}
        </div>
        
        <div className="text-center mt-4 text-[10px] text-gray-500 dark:text-gray-500">
          <span>💡 Tip: Click/tap on cards to flip and discover amazing cricket records</span>
        </div>
      </div>
    </section>
  );
};