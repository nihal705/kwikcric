// src/pages/IPL/components/IPLPointsTable.tsx
import React from 'react';

interface IPLPointsTableEntry {
  id: number;
  team_id: number;
  team_name: string;
  short_name: string;
  primary_color: string;
  matches_played: number;
  matches_won: number;
  matches_lost: number;
  points: number;
  net_run_rate: number;
}

interface IPLPointsTableProps {
  pointsTable: IPLPointsTableEntry[];
}

export const IPLPointsTable: React.FC<IPLPointsTableProps> = ({ pointsTable }) => {
  if (!pointsTable || pointsTable.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        <p>Points table not available for this season.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Pos</th>
              <th className="px-4 py-3 text-left">Team</th>
              <th className="px-4 py-3 text-center">Pld</th>
              <th className="px-4 py-3 text-center">W</th>
              <th className="px-4 py-3 text-center">L</th>
              <th className="px-4 py-3 text-center">Pts</th>
              <th className="px-4 py-3 text-center">NRR</th>
            </tr>
          </thead>
          <tbody>
            {pointsTable.map((entry, idx) => (
              <tr key={idx} className={`border-b border-gray-100 dark:border-gray-800 ${
                idx < 4 ? 'bg-green-50 dark:bg-green-900/10' : ''
              }`}>
                <td className="px-4 py-3 font-bold">#{idx + 1}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.primary_color || '#gray' }}
                    />
                    <span className="font-medium">{entry.team_name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">{entry.matches_played}</td>
                <td className="px-4 py-3 text-center text-green-600 font-medium">{entry.matches_won}</td>
                <td className="px-4 py-3 text-center text-red-600">{entry.matches_lost}</td>
                <td className="px-4 py-3 text-center font-bold">{entry.points}</td>
                <td className="px-4 py-3 text-center font-mono">{entry.net_run_rate?.toFixed(3) || '0.000'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};