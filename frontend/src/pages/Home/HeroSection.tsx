import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-900 via-green-800 to-emerald-900">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
      </div>
      
      <div className="relative px-6 py-12 md:py-16 lg:py-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-3 py-1 text-sm font-semibold text-green-200 bg-green-700/50 rounded-full mb-4">
              #1 Cricket Platform
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Complete Cricket
              <span className="block text-green-300">Universe</span>
            </h1>
            <p className="text-lg md:text-xl text-green-100 mb-8 max-w-2xl">
              Live scores, player stats, tournament history, and exciting cricket games — all in one place.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link
                to="/live"
                className="inline-flex items-center px-6 py-3 bg-white text-green-800 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                🎯 Live Scores
              </Link>
              <Link
                to="/players"
                className="inline-flex items-center px-6 py-3 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
              >
                👥 Explore Players
              </Link>
              <Link
                to="/games"
                className="inline-flex items-center px-6 py-3 border border-green-400 text-green-100 rounded-lg font-semibold hover:bg-green-700/30 transition-colors"
              >
                🎮 Play Games
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      
      <motion.div
        className="absolute bottom-0 right-0 w-48 h-48 md:w-64 md:h-64 opacity-10"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <div className="w-full h-full rounded-full bg-white" />
      </motion.div>
    </section>
  );
};