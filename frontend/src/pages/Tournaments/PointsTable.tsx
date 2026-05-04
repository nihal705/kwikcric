import React from 'react';

interface PointsTableEntry {
  position: number;
  team_name: string;
  team_logo_url: string | null;
  matches_played: number;
  matches_won: number;
  matches_lost: number;
  matches_tied: number;
  matches_nr: number;
  points: number;
  net_run_rate: number;
}

interface PointsTableProps {
  data: PointsTableEntry[];
}

export const PointsTable: React.FC<PointsTableProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-500 py-8">No points table data available</div>;
  }

  const sortedData = [...data].sort((a, b) => {
    if (a.points !== b.points) return b.points - a.points;
    return b.net_run_rate - a.net_run_rate;
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <th className="px-4 py-3 text-left w-16">Pos</th>
            <th className="px-4 py-3 text-left">Team</th>
            <th className="px-4 py-3 text-center">Pld</th>
            <th className="px-4 py-3 text-center">W</th>
            <th className="px-4 py-3 text-center">L</th>
            <th className="px-4 py-3 text-center">T</th>
            <th className="px-4 py-3 text-center">NR</th>
            <th className="px-4 py-3 text-center">Pts</th>
            <th className="px-4 py-3 text-center">NRR</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((team, index) => (
            <tr
              key={team.team_name}
              className={`border-b border-gray-100 dark:border-gray-800 ${
                index < 4 ? 'bg-green-50 dark:bg-green-900/10' : ''
              }`}
            >
              <td className="px-4 py-3 font-medium">
                {team.position || index + 1}
               </td>
              <td className="px-4 py-3">
                <div className="flex items-center space-x-3">
                  {team.team_logo_url && (
                    <img
                      src={team.team_logo_url}
                      alt={team.team_name}
                      className="w-6 h-6 object-contain"
                    />
                  )}
                  <span className="font-medium">{team.team_name}</span>
                </div>
               </td>
              <td className="px-4 py-3 text-center">{team.matches_played}</td>
              <td className="px-4 py-3 text-center text-green-600 font-medium">{team.matches_won}</td>
              <td className="px-4 py-3 text-center text-red-600">{team.matches_lost}</td>
              <td className="px-4 py-3 text-center">{team.matches_tied || 0}</td>
              <td className="px-4 py-3 text-center">{team.matches_nr || 0}</td>
              <td className="px-4 py-3 text-center font-bold">{team.points}</td>
              <td className="px-4 py-3 text-center">
                {team.net_run_rate?.toFixed(3) || '—'}
               </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};