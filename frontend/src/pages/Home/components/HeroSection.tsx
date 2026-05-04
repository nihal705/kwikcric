// frontend/src/pages/Home/components/HeroSection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[70vh] overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-emerald-900 dark:from-green-950 dark:via-green-900 dark:to-emerald-900">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, gold 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
      </div>
      
      {/* Rotating Cricket Ball */}
      <motion.div
        className="absolute top-20 right-10 w-24 h-24 md:w-32 md:h-32 opacity-10"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-r from-yellow-500 to-red-500" />
      </motion.div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[70vh] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          {/* Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, rotate: -10 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-5xl md:text-7xl font-black text-white/90 tracking-tighter transform -rotate-6 mb-2"
              >
                IT'S
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, rotate: 10 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-6xl md:text-8xl font-black bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent tracking-tighter transform rotate-3"
              >
                HISTORY
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="text-yellow-300/80 text-xs md:text-sm mt-3 italic"
              >
                History will be remembered forever
              </motion.p>
            </div>
          </motion.div>
          
          {/* Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-yellow-400 text-xs">
                <span className="w-6 h-px bg-yellow-400" />
                <span>Since 1877</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                Where Legends Are Made,
                <span className="block text-yellow-400">Records Are Broken</span>
              </h2>
              <p className="text-white/70 text-sm md:text-base">
                Explore the complete history of cricket — from the first Test match 
                in 1877 to the latest World Cup champion.
              </p>
            </div>
            
            {/* Quick Stats Row */}
            <div className="grid grid-cols-3 gap-3 py-3">
              <div className="text-center">
                <div className="text-xl font-bold text-yellow-400">1877</div>
                <div className="text-xs text-white/60">First Test</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-yellow-400">1971</div>
                <div className="text-xs text-white/60">First ODI</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-yellow-400">2005</div>
                <div className="text-xs text-white/60">First T20I</div>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 pt-3">
              <Link
                to="/history"
                className="px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-sm"
              >
                Explore History →
              </Link>
              <Link
                to="/players/rankings"
                className="px-5 py-2.5 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300 text-sm"
              >
                View Rankings
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-2 bg-white/50 rounded-full mt-2" />
        </div>
      </motion.div>
    </section>
  );
};