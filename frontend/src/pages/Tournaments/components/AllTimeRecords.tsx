// frontend/src/pages/Tournaments/components/AllTimeRecords.tsx
import React, { useState, useEffect } from 'react';
import { worldCupAPI } from '../../../services/api/worldCupAPI';

interface AllTimeRecord {
  player_name: string;
  runs?: number;
  wickets?: number;
  sixes?: number;
  hundreds?: number;
  matches_played?: number;
}

interface AllTimeRecordsData {
  mostRuns: AllTimeRecord[];
  mostWickets: AllTimeRecord[];
  mostSixes: AllTimeRecord[];
  mostHundreds: AllTimeRecord[];
}

interface AllTimeRecordsProps {
  tournamentType?: 'odi' | 't20' | 'champions' | 'test';
}

export const AllTimeRecords: React.FC<AllTimeRecordsProps> = ({ 
  tournamentType = 'odi'
}) => {
  const [records, setRecords] = useState<AllTimeRecordsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<'runs' | 'wickets' | 'sixes' | 'hundreds'>('runs');

  useEffect(() => {
    fetchRecords();
  }, [tournamentType]);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await worldCupAPI.getAllTimeRecords(tournamentType);
      console.log(`${tournamentType} records:`, response.data);
      setRecords(response.data);
    } catch (error) {
      console.error('Error fetching records:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTitleByType = () => {
    switch (tournamentType) {
      case 't20':
        return 'All-Time T20I World Cup Records';
      case 'champions':
        return 'All-Time Champions Trophy Records';
      case 'test':
        return 'All-Time ICC WTC Records';
      default:
        return 'All-Time ODI World Cup Records';
    }
  };

  const getHeaderColor = () => {
    switch (tournamentType) {
      case 't20':
        return 'from-purple-600 to-pink-600';
      case 'champions':
        return 'from-blue-600 to-cyan-600';
      case 'test':
        return 'from-teal-600 to-emerald-600';
      default:
        return 'from-green-600 to-green-800';
    }
  };

  const getActiveTabColor = () => {
    switch (tournamentType) {
      case 't20':
        return 'text-purple-600 border-purple-600';
      case 'champions':
        return 'text-blue-600 border-blue-600';
      case 'test':
        return 'text-teal-600 border-teal-600';
      default:
        return 'text-green-600 border-green-600';
    }
  };

  const categories = [
    { id: 'runs' as const, label: 'Most Runs' },
    { id: 'wickets' as const, label: 'Most Wickets' },
    { id: 'sixes' as const, label: 'Most Sixes' },
    { id: 'hundreds' as const, label: 'Most Hundreds' },
  ];

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className={`bg-gradient-to-r ${getHeaderColor()} px-4 py-2`}>
          <h3 className="text-sm font-bold text-white">{getTitleByType()}</h3>
          <p className="text-white/80 text-[10px]">Greatest performers in history</p>
        </div>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-4 border-green-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  const getCurrentData = () => {
    switch (activeCategory) {
      case 'runs': return records?.mostRuns || [];
      case 'wickets': return records?.mostWickets || [];
      case 'sixes': return records?.mostSixes || [];
      case 'hundreds': return records?.mostHundreds || [];
      default: return [];
    }
  };

  const getStatValue = (record: AllTimeRecord) => {
    switch (activeCategory) {
      case 'runs': return record.runs;
      case 'wickets': return record.wickets;
      case 'sixes': return record.sixes;
      case 'hundreds': return record.hundreds;
      default: return 0;
    }
  };

  const getStatLabel = () => {
    switch (activeCategory) {
      case 'runs': return 'runs';
      case 'wickets': return 'wickets';
      case 'sixes': return 'sixes';
      case 'hundreds': return 'centuries';
    }
  };

  const currentData = getCurrentData();
  const activeTabColor = getActiveTabColor();

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className={`bg-gradient-to-r ${getHeaderColor()} px-4 py-2`}>
        <h3 className="text-sm font-bold text-white">{getTitleByType()}</h3>
        <p className="text-white/80 text-[10px]">Greatest performers in history</p>
      </div>

      {/* Category Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex-1 px-2 py-1.5 text-[10px] font-medium transition-all text-center ${
              activeCategory === cat.id
                ? `${activeTabColor} border-b-2`
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Records List */}
      <div className="p-3">
        {currentData.length === 0 ? (
          <div className="text-center py-4 text-gray-500 text-xs">
            No records available for this category.
          </div>
        ) : (
          <div className="space-y-1.5">
            {currentData.map((record, idx) => (
              <div
                key={idx}
                className={`flex justify-between items-center p-1.5 rounded transition ${
                  idx === 0 ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 text-center text-xs">
                    {idx === 0 && <span className="font-bold text-yellow-600">#1</span>}
                    {idx === 1 && <span className="font-bold text-gray-400">#2</span>}
                    {idx === 2 && <span className="font-bold text-amber-600">#3</span>}
                    {idx > 2 && <span className="font-bold text-gray-400 text-[10px]">#{idx + 1}</span>}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white text-xs">{record.player_name}</p>
                    {record.matches_played && (
                      <p className="text-[9px] text-gray-500">{record.matches_played} matches</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">
                    {getStatValue(record)?.toLocaleString()} {getStatLabel()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};