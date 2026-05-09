// frontend/src/components/RewardNotification.tsx
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RewardNotificationProps {
  reward: { coins: number; gems: number; achievement: string; game: string } | null;
  onClose: () => void;
}

export const RewardNotification: React.FC<RewardNotificationProps> = ({ reward, onClose }) => {
  useEffect(() => {
    if (reward) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [reward, onClose]);

  if (!reward) return null;

  const getGameIcon = (game: string) => {
    switch (game) {
      case 'kwik-cricket': return '';
      case 'cricket-mastermind': return '';
      case 'imposter': return '';
      case 'guess-legend': return '';
      default: return '';
    }
  };

  const getAchievementName = (achievement: string) => {
    const names: Record<string, string> = {
      'runs_10': '10 Runs!',
      'runs_50': 'Half Century!',
      'runs_100': 'Century!',
      'wicket_1': 'First Wicket!',
      'wicket_3': 'Three Wickets!',
      'wicket_5': 'Five Wickets!',
      'match_win': 'Match Victory!',
      'tournament_win': 'Tournament Champion!',
      'correct_answer': 'Correct Answer!',
      'perfect_round': 'Perfect Round!',
      'streak_10': '10 Streak!',
      'win_real': 'Victory as Real!',
      'win_imposter': 'Victory as Imposter!',
      'catch_imposter': 'Imposter Caught!',
      'survive_imposter': 'Survived!',
      'correct_guess': 'Correct Guess!',
      'streak_5': '5 Streak!',
      'fast_guess': 'Lightning Guess!',
    };
    return names[achievement] || achievement.replace(/_/g, ' ');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        className="fixed top-20 right-4 z-50 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl shadow-2xl border border-amber-500/30 overflow-hidden"
      >
        <div className="flex items-center p-4 gap-4">
          {/* Icon */}
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center text-2xl">
            {getGameIcon(reward.game)}
          </div>
          
          {/* Content */}
          <div>
            <p className="text-xs text-gray-400">Achievement Unlocked!</p>
            <h3 className="text-sm font-bold text-white">{getAchievementName(reward.achievement)}</h3>
            <div className="flex gap-3 mt-1">
              {reward.coins > 0 && (
                <span className="text-xs text-amber-400">+{reward.coins} 🪙</span>
              )}
              {reward.gems > 0 && (
                <span className="text-xs text-purple-400">+{reward.gems} 💎</span>
              )}
            </div>
          </div>
          
          {/* Close button */}
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300">
            ×
          </button>
        </div>
        
        {/* Progress bar animation */}
        <div className="h-0.5 bg-gradient-to-r from-amber-500 to-yellow-500 w-full animate-[shrink_3s_linear_forwards]" />
      </motion.div>
      
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </AnimatePresence>
  );
};