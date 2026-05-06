// frontend/src/pages/Games/CricketCards/components/Header.tsx
import React from 'react';

interface HeaderProps {
  gems: number;
  coins: number;
  onShopClick: () => void;
  onDailyClick: () => void;
  onAchievementsClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  gems, 
  coins, 
  onShopClick, 
  onDailyClick, 
  onAchievementsClick 
}) => {
  return (
    <header className="bg-gray-900/95 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center flex-wrap gap-3">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
                <path d="M20 5L25 15L35 18L28 26L30 36L20 31L10 36L12 26L5 18L15 15L20 5Z" fill="white" stroke="#D97706" strokeWidth="1"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Cricket Champions
              </h1>
              <p className="text-[10px] text-gray-500 -mt-0.5">Trading Card Game</p>
            </div>
          </div>

          {/* Actions and Currency */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={onAchievementsClick}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg hover:bg-gray-700 transition border border-gray-700"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-400">
                <path d="M12 2L15 8.5L22 9.5L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9.5L9 8.5L12 2Z"/>
              </svg>
              <span className="text-white text-sm font-medium">Achievements</span>
            </button>
            
            <button
              onClick={onDailyClick}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg hover:bg-gray-700 transition border border-gray-700"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span className="text-white text-sm font-medium">Daily</span>
            </button>
            
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg border border-gray-700">
              <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-black font-bold">◆</span>
              </div>
              <span className="text-yellow-400 font-semibold">{gems.toLocaleString()}</span>
              <span className="text-xs text-gray-500 hidden sm:inline">Gems</span>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg border border-gray-700">
              <div className="w-5 h-5 bg-amber-600 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">¢</span>
              </div>
              <span className="text-amber-400 font-semibold">{coins.toLocaleString()}</span>
              <span className="text-xs text-gray-500 hidden sm:inline">Coins</span>
            </div>
            
            <button
              onClick={onShopClick}
              className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-sm font-semibold rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition shadow-lg"
            >
              Shop
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};