// frontend/src/pages/Games/CricketCards/components/CardFilters.tsx
import React from 'react';
import { Rarity } from '../types/cricketCards.types';

interface CardFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedRarity: Rarity | 'all';
  onRarityChange: (rarity: Rarity | 'all') => void;
  selectedRole: string;
  onRoleChange: (role: string) => void;
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  showFavoritesOnly: boolean;
  onFavoritesToggle: () => void;
}

const countries = ['India', 'Australia', 'England', 'South Africa', 'New Zealand', 'Pakistan', 'Sri Lanka', 'West Indies', 'Bangladesh', 'Afghanistan'];
const roles = ['all', 'batsman', 'bowler', 'allrounder', 'wicketkeeper'];
const rarities: (Rarity | 'all')[] = ['all', 'common', 'rare', 'epic', 'legendary', 'mythic'];

export const CardFilters: React.FC<CardFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedRarity,
  onRarityChange,
  selectedRole,
  onRoleChange,
  selectedCountry,
  onCountryChange,
  showFavoritesOnly,
  onFavoritesToggle,
}) => {
  const getRarityButtonClass = (rarity: Rarity | 'all') => {
    if (selectedRarity !== rarity) return 'bg-gray-700 text-gray-300 hover:bg-gray-600';
    
    switch (rarity) {
      case 'common': return 'bg-gray-500 text-white';
      case 'rare': return 'bg-blue-500 text-white';
      case 'epic': return 'bg-purple-500 text-white';
      case 'legendary': return 'bg-amber-500 text-black';
      case 'mythic': return 'bg-red-500 text-white';
      default: return 'bg-amber-500 text-black';
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-4 mb-6 border border-gray-700">
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search players by name..."
            className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition pr-10"
          />
          <svg className="absolute right-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3 items-center">
        {/* Rarity Filters */}
        <div className="flex gap-1 flex-wrap">
          {rarities.map(rarity => (
            <button
              key={rarity}
              onClick={() => onRarityChange(rarity)}
              className={`px-3 py-1.5 text-sm rounded-lg transition font-medium ${getRarityButtonClass(rarity)}`}
            >
              {rarity === 'all' ? 'All' : rarity.charAt(0).toUpperCase() + rarity.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="w-px h-6 bg-gray-700 hidden md:block" />
        
        {/* Role Filters */}
        <div className="flex gap-1 flex-wrap">
          {roles.map(role => (
            <button
              key={role}
              onClick={() => onRoleChange(role)}
              className={`px-3 py-1.5 text-sm rounded-lg transition font-medium ${
                selectedRole === role
                  ? 'bg-amber-500 text-black'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {role === 'all' ? 'All' : role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="w-px h-6 bg-gray-700 hidden md:block" />
        
        {/* Country Filter */}
        <select
          value={selectedCountry}
          onChange={(e) => onCountryChange(e.target.value)}
          className="px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500 cursor-pointer"
        >
          <option value="all">🌍 All Countries</option>
          {countries.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
        
        <div className="w-px h-6 bg-gray-700 hidden md:block" />
        
        {/* Favorites Toggle */}
        <button
          onClick={onFavoritesToggle}
          className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition font-medium ${
            showFavoritesOnly
              ? 'bg-amber-500 text-black'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <span className="text-base">{showFavoritesOnly ? '★' : '☆'}</span>
          <span>Favorites</span>
        </button>
        
        {/* Reset Filters */}
        {(searchQuery || selectedRarity !== 'all' || selectedRole !== 'all' || selectedCountry !== 'all' || showFavoritesOnly) && (
          <button
            onClick={() => {
              onSearchChange('');
              onRarityChange('all');
              onRoleChange('all');
              onCountryChange('all');
              if (showFavoritesOnly) onFavoritesToggle();
            }}
            className="px-3 py-1.5 text-sm rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition font-medium"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
};