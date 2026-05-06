// frontend/src/pages/Games/CricketCards/components/ShopModal.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { purchasePackages } from '../data/purchasePackages';

interface ShopModalProps {
  onClose: () => void;
  onPurchase: (gems: number) => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({ onClose, onPurchase }) => {
  const [selectedPackage, setSelectedPackage] = useState<typeof purchasePackages[0] | null>(null);

  const handlePurchase = (pkg: typeof purchasePackages[0]) => {
    setSelectedPackage(pkg);
    setTimeout(() => {
      onPurchase(pkg.gems + pkg.bonusGems);
      setSelectedPackage(null);
    }, 800);
  };

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
            <h2 className="text-2xl font-bold text-white">KwikCric Shop</h2>
            <p className="text-sm text-gray-400 mt-1">Purchase KwikCric Gems</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl transition">×</button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {purchasePackages.map(pkg => (
            <div
              key={pkg.id}
              className={`relative bg-gray-800 rounded-xl p-4 border-2 transition-all hover:scale-105 ${
                pkg.popular ? 'border-amber-500' : pkg.bestValue ? 'border-purple-500' : 'border-gray-700'
              }`}
            >
              {(pkg.popular || pkg.bestValue) && (
                <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold ${
                  pkg.popular ? 'bg-amber-500 text-black' : 'bg-purple-500 text-white'
                }`}>
                  {pkg.popular ? 'POPULAR' : 'BEST VALUE'}
                </div>
              )}
              <div className="text-center">
                <div className="w-14 h-14 mx-auto bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center mb-3 shadow-lg">
                  <span className="text-2xl font-bold text-white">◆</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{pkg.name}</h3>
                <div className="text-2xl font-bold text-amber-400 mb-1">{pkg.gems.toLocaleString()} Gems</div>
                {pkg.bonusGems > 0 && (
                  <div className="text-sm text-emerald-400 mb-2">+{pkg.bonusGems.toLocaleString()} Bonus</div>
                )}
                <div className="text-xl font-semibold text-white mb-4">${pkg.priceUsd}</div>
                <button
                  onClick={() => handlePurchase(pkg)}
                  disabled={!!selectedPackage}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg font-semibold hover:from-emerald-700 hover:to-emerald-800 transition disabled:opacity-50 shadow-md"
                >
                  {selectedPackage?.id === pkg.id ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    'Purchase'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-gray-800 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">i</span>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-1">About KwikCric Gems</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                KwikCric Gems are the premium currency that can be used to open Premium and Legendary packs. 
                You can also earn Gems for free by playing other games and completing daily login rewards!
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};