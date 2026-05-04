import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface RecordEntry {
  rank: number;
  player: string;
  country: string;
  span: string;
  matches: number;
  innings: number;
  runs: number;
  average: number;
  hundreds: number;
}

export const AllTimeRecordsPage: React.FC = () => {
  const [mostRuns, setMostRuns] = useState<RecordEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get('/api/stats/most-runs/odi');
        setMostRuns(response.data.data);
      } catch (error) {
        console.error('Failed to fetch records:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent" /></div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">All-Time Records</h1>
        <p className="text-gray-500">Greatest cricketers of all time</p>
      </div>

      {/* Most Runs Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-white">Most Runs in ODI Cricket</h2>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 border-b">
                <th className="px-4 py-3 text-left">Rank</th>
                <th className="px-4 py-3 text-left">Player</th>
                <th className="px-4 py-3 text-left">Country</th>
                <th className="px-4 py-3 text-center">Span</th>
                <th className="px-4 py-3 text-center">Mat</th>
                <th className="px-4 py-3 text-center">Inns</th>
                <th className="px-4 py-3 text-center">Runs</th>
                <th className="px-4 py-3 text-center">HS</th>
                <th className="px-4 py-3 text-center">Avg</th>
                <th className="px-4 py-3 text-center">SR</th>
                <th className="px-4 py-3 text-center">100s</th>
                <th className="px-4 py-3 text-center">50s</th>
               </tr>
            </thead>
            <tbody>
              {mostRuns.map((record, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3 font-bold">#{record.rank}</td>
                  <td className="px-4 py-3 font-semibold">{record.player}</td>
                  <td className="px-4 py-3">{record.country}</td>
                  <td className="px-4 py-3 text-center">{record.span}</td>
                  <td className="px-4 py-3 text-center">{record.matches}</td>
                  <td className="px-4 py-3 text-center">{record.innings}</td>
                  <td className="px-4 py-3 text-center font-bold text-green-600">{record.runs.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">—</td>
                  <td className="px-4 py-3 text-center">{record.average}</td>
                  <td className="px-4 py-3 text-center">—</td>
                  <td className="px-4 py-3 text-center font-semibold">{record.hundreds}</td>
                  <td className="px-4 py-3 text-center">—</td>
                </tr>
              ))}
            </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};