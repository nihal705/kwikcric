// frontend/src/pages/Home/components/CTASection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const CTASection: React.FC = () => {
  return (
    <section className="py-8 bg-gradient-to-br from-green-900 to-emerald-900 dark:from-green-900 dark:to-emerald-900">
      <div className="max-w-4xl mx-auto text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="space-y-3"
        >
          <div className="text-yellow-400 text-4xl mb-1">"</div>
          <p className="text-base md:text-lg font-light text-white italic leading-relaxed">
            History isn't just pages in a book.
            <br />
            It's every boundary, every wicket, every moment
            <br />
            that made cricket what it is today.
          </p>
          <div className="text-yellow-400 text-4xl mt-1 transform rotate-180">"</div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="pt-3"
          >
            <Link
              to="/history"
              className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 text-sm"
            >
              <span>Explore the History</span>
              <span className="text-sm">→</span>
            </Link>
          </motion.div>
        
        </motion.div>
      </div>
    </section>
  );
};