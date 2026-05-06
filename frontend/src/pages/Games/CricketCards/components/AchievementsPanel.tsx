// frontend/src/pages/Games/CricketCards/components/AchievementsPanel.tsx
import React from 'react';
import { Achievement } from '../types/cricketCards.types';

interface AchievementsPanelProps {
  achievements: Achievement[];
  onClose?: () => void;
}

export const AchievementsPanel: React.FC<AchievementsPanelProps> = ({ achievements }) => {
  const completedCount = achievements.filter(a => a.isCompleted).length;
  const totalCount = achievements.length;
  const totalCoins = achievements.filter(a => a.isCompleted).reduce((sum, a) => sum + a.rewardCoins, 0);
  const totalGems = achievements.filter(a => a.isCompleted).reduce((sum, a) => sum + a.rewardGems, 0);

  const getRarityColor = (progress: number, requirement: number) => {
    const percent = (progress / requirement) * 100;
    if (percent >= 100) return 'bg-emerald-500';
    if (percent >= 75) return 'bg-green-500';
    if (percent >= 50) return 'bg-yellow-500';
    if (percent >= 25) return 'bg-orange-500';
    return 'bg-gray-500';
  };

  return (
    <div className="space-y-4">
      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-800 rounded-lg p-3 text-center border border-gray-700">
          <div className="text-amber-400 text-lg mb-1">¢</div>
          <div className="text-base font-bold text-white">{totalCoins.toLocaleString()}</div>
          <div className="text-[10px] text-gray-500">Coins Earned</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 text-center border border-gray-700">
          <div className="text-yellow-400 text-lg mb-1">◆</div>
          <div className="text-base font-bold text-white">{totalGems.toLocaleString()}</div>
          <div className="text-[10px] text-gray-500">Gems Earned</div>
        </div>
      </div>
      
      {/* Progress Overview */}
      <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-400">Overall Progress</span>
          <span className="text-xs font-semibold text-white">{completedCount}/{totalCount}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-1.5">
          <div 
            className="bg-gradient-to-r from-amber-500 to-yellow-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Achievements List */}
      <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
        {achievements.map(achievement => {
          const progressPercent = (achievement.currentProgress / achievement.requirement) * 100;
          const isCompleted = achievement.isCompleted;
          const progressColor = getRarityColor(achievement.currentProgress, achievement.requirement);
          
          return (
            <div
              key={achievement.id}
              className={`p-3 rounded-lg transition-all ${
                isCompleted
                  ? 'bg-emerald-900/30 border border-emerald-500/30'
                  : 'bg-gray-800 border border-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Icon */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                  isCompleted ? 'bg-emerald-600' : 'bg-gray-700'
                }`}>
                  {achievement.icon === '📦' && '🎁'}
                  {achievement.icon === '🎴' && '🃏'}
                  {achievement.icon === '🏅' && '🏆'}
                  {achievement.icon === '🏆' && '🏆'}
                  {achievement.icon === '⭐' && '⭐'}
                  {achievement.icon === '💎' && '💎'}
                  {achievement.icon === '🎯' && '🎯'}
                  {achievement.icon === '💪' && '💪'}
                  {!achievement.icon && '🏆'}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center flex-wrap gap-1">
                    <h3 className="text-sm font-semibold text-white">{achievement.name}</h3>
                    {isCompleted && (
                      <span className="text-[9px] text-emerald-400 bg-emerald-900/50 px-1.5 py-0.5 rounded-full">Done</span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400 mb-1.5 truncate">{achievement.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="w-full bg-gray-700 rounded-full h-1">
                        <div
                          className={`${progressColor} h-1 rounded-full transition-all duration-300`}
                          style={{ width: `${Math.min(progressPercent, 100)}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-[9px] text-gray-500 flex-shrink-0">
                      {achievement.currentProgress}/{achievement.requirement}
                    </span>
                  </div>
                </div>
                
                {/* Rewards */}
                <div className="flex gap-1.5 flex-shrink-0">
                  <div className="text-center">
                    <div className="text-amber-400 text-[10px]">¢</div>
                    <div className="text-[9px] font-medium text-white">{achievement.rewardCoins}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-yellow-400 text-[10px]">◆</div>
                    <div className="text-[9px] font-medium text-white">{achievement.rewardGems}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Empty State */}
      {achievements.length === 0 && (
        <div className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700">
          <div className="text-3xl mb-2">🏆</div>
          <h3 className="text-sm font-semibold text-white mb-1">No Achievements Yet</h3>
          <p className="text-xs text-gray-400">Complete tasks to earn achievements!</p>
        </div>
      )}
    </div>
  );
};