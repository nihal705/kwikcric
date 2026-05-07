// frontend/src/pages/Games/CricketCards/components/DailyRewards.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { DailyReward } from '../types/cricketCards.types';

interface DailyRewardsProps {
  rewards: DailyReward[];
  streak: number;
  onClaim: (day: number) => void;
  onClose: () => void;
}

export const DailyRewards: React.FC<DailyRewardsProps> = ({ rewards, streak, onClaim, onClose }) => {
  const completedDays = rewards.filter(r => r.isClaimed).length;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-900 rounded-2xl p-6 max-w-3xl w-full mx-4"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Daily Rewards</h2>
            <p className="text-sm text-gray-400 mt-1">
              {streak > 0 ? `${streak} Day Streak! 🔥` : 'Start your streak today!'}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl transition">×</button>
        </div>
        
        {/* Streak Progress */}
        <div className="mb-6 p-3 bg-gray-800 rounded-xl">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Streak Progress</span>
            <span>{completedDays}/7 Days</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-amber-500 to-yellow-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedDays / 7) * 100}%` }}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-2 mb-6">
          {rewards.map((reward, index) => {
            const dayNum = index + 1;
            
            return (
              <div
                key={dayNum}
                className={`p-3 rounded-xl text-center transition-all ${
                  reward.isClaimed
                    ? 'bg-gray-800 border border-green-500/30 opacity-70'
                    : reward.canClaim
                    ? 'bg-gradient-to-br from-amber-600 to-yellow-600 ring-2 ring-yellow-400 cursor-pointer hover:scale-105 transition-transform'
                    : 'bg-gray-800 opacity-50'
                }`}
              >
                <div className="text-xs text-gray-400 mb-1">Day {dayNum}</div>
                <div className="text-lg font-bold text-white">{reward.coins}</div>
                <div className="text-xs text-amber-400">Coins</div>
                <div className="text-xs text-purple-400">+{reward.gems} Gems</div>
                {reward.freePack && <div className="text-[10px] text-blue-400 mt-1">Free Pack</div>}
                
                {reward.isClaimed ? (
                  <div className="mt-2 text-[10px] text-green-400">✓ Claimed</div>
                ) : reward.canClaim ? (
                  <button
                    onClick={() => onClaim(dayNum)}
                    className="mt-2 px-3 py-1 bg-white/20 rounded-lg text-xs text-white hover:bg-white/30 transition w-full"
                  >
                    Claim
                  </button>
                ) : (
                  <div className="mt-2 text-[10px] text-gray-500">Locked</div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm">📅</span>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-1">Keep Your Streak Alive!</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Login daily to increase your streak and earn bigger rewards! 
                Day 7 gives a FREE Standard Pack plus bonus gems! Miss a day and your streak resets.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};