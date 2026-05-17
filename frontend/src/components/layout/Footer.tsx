// src/components/layout/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Everything in one row */}
        <div className="flex items-center justify-between">
          
          {/* Logo + Name - Left */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2"
          >
            <img 
              src="/images/KwikCric_logo.png" 
              alt="KwikCric Logo" 
              className="w-6 h-6 object-contain"
            />
            <Link to="/">
              <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                Kwik<span className="text-green-600 dark:text-green-500">Cric</span>
              </span>
            </Link>
          </motion.div>

          {/* Copyright + GitHub - Center */}
          <div className="text-center">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xs text-gray-400 dark:text-gray-500"
            >
              © {currentYear} KwikCric. All rights reserved.
            </motion.p>
            <motion.a
              href="https://github.com/nihalmohammad705-debug"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xs text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 flex items-center justify-center gap-1 mt-1"
            >
              <span>GITHUB : </span> nihalmohammad705-debug
            </motion.a>
          </div>

          {/* Animated Bat - Right */}
          <motion.div
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-2xl opacity-30"
          >
            🏏
          </motion.div>
        </div>
      </div>
    </footer>
  );
};