// frontend/src/pages/Home/components/GamesPreview.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const GamesPreview: React.FC = () => {
  const games = [
    {
      title: "Quick Cricket",
      icon: "",
      description: "Face the bowler and score maximum runs in 6 balls!",
      link: "/games/quick-cricket",
      color: "from-yellow-500 to-orange-600",
      tag: "Arcade Mode",
    },
    {
      title: "Cricket Quiz",
      icon: "",
      description: "Answer 1000+ questions and prove your knowledge!",
      link: "/games/quiz",
      color: "from-purple-500 to-pink-600",
      tag: "1000+ Questions",
    },
    {
      title: "Cricket Players Card",
      icon: "",
      description: "Collect your favourite player card",
      link: "/games/cricket-cards",
      color: "from-blue-500 to-cyan-600",
      tag: "Mythic, Legendry, Elite",
    },
  ];

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
            <span className="text-yellow-600 dark:text-yellow-400 text-xs">PLAY & LEARN</span>
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Interactive Games</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Test your cricket knowledge and skills</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {games.map((game, index) => (
            <motion.div
              key={game.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
            >
              {(
                <Link to={game.link}>
                  <div className={`bg-gradient-to-br ${game.color} rounded-xl p-5 text-white text-center hover:scale-105 transition-all duration-300 shadow-lg cursor-pointer`}>
                    <div className="text-4xl mb-2">{game.icon}</div>
                    <h3 className="text-lg font-bold mb-1">{game.title}</h3>
                    <p className="text-white/80 text-xs mb-3">{game.description}</p>
                    <div className="text-[10px] bg-white/20 rounded-full px-2 py-0.5 inline-block">{game.tag}</div>
                    <div className="mt-2 text-xs font-semibold">Play Now →</div>
                  </div>
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
    
  );
};