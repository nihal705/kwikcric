import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiMapPin, FiTrendingUp } from 'react-icons/fi';

interface VenueStat {
  venue: string;
  matches_played: number;
  highest_total: number;
  highest_total_team: string;
  highest_total_year: number;
  average_runs: number | string;
}

interface VenueStatsData {
  mostMatches: VenueStat[];
  highestTotals: VenueStat[];
  bestBattingVenues: VenueStat[];
}

export const VenueStats: React.FC = () => {
  const [venueStats, setVenueStats] = useState<VenueStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeVenueTab, setActiveVenueTab] = useState<'matches' | 'totals' | 'batting'>('matches');

  useEffect(() => {
    fetchVenueStats();
  }, []);

  const fetchVenueStats = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/world-cup/venue-stats');
      console.log('Venue stats response:', response.data);
      setVenueStats(response.data.data);
    } catch (error) {
      console.error('Error fetching venue stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'matches' as const, label: 'Most Matches' },
    { id: 'totals' as const, label: 'Highest Totals' },
    { id: 'batting' as const, label: 'Batting Friendly' },
  ];

  // Safe number formatting
  const formatNumber = (value: number | string | undefined, decimals: number = 1): string => {
    if (value === undefined || value === null) return '0';
    let num: number;
    if (typeof value === 'string') {
      num = parseFloat(value);
    } else {
      num = value;
    }
    if (isNaN(num)) return '0';
    return num.toFixed(decimals);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-4 border-green-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  const currentData = activeVenueTab === 'matches' ? venueStats?.mostMatches : 
                      activeVenueTab === 'totals' ? venueStats?.highestTotals : 
                      venueStats?.bestBattingVenues;

  if (!currentData || currentData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 text-center">
        <p className="text-sm text-gray-500">Venue statistics not available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header - Compact */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <FiMapPin className="w-4 h-4 text-white" />
          <h3 className="text-base font-bold text-white">Venue Statistics</h3>
        </div>
        <p className="text-blue-100 text-xs mt-0.5">Iconic World Cup venues and their records</p>
      </div>

      {/* Sub-tabs - Compact */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveVenueTab(tab.id)}
            className={`flex-1 px-3 py-2 text-xs font-medium transition-all text-center ${
              activeVenueTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Venue Stats Content - Compact */}
      <div className="p-3">
        <div className="space-y-2">
          {currentData.map((venue, idx) => (
            <div
              key={idx}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:shadow-sm transition"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-blue-600 w-6">#{idx + 1}</span>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white text-sm">
                      {venue.venue?.split(',')[0] || venue.venue}
                    </p>
                    <p className="text-xs text-gray-500 truncate max-w-[180px]">{venue.venue}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-gray-600">
                    {activeVenueTab === 'matches' && `${venue.matches_played} matches`}
                    {activeVenueTab === 'totals' && `${venue.highest_total} runs`}
                    {activeVenueTab === 'batting' && `${formatNumber(venue.average_runs)} avg`}
                  </p>
                </div>
              </div>

              {(activeVenueTab === 'totals' || activeVenueTab === 'batting') && venue.highest_total_team && (
                <div className="mt-1 pt-1 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <span className="text-xs">🏏</span>
                    <span className="truncate">{venue.highest_total_team} scored {venue.highest_total} in {venue.highest_total_year}</span>
                  </div>
                </div>
              )}

              {activeVenueTab === 'matches' && (
                <div className="mt-1 pt-1 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <FiTrendingUp className="w-3 h-3 text-green-500" />
                    <span>Avg {formatNumber(venue.average_runs)} runs/match</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VenueStats;