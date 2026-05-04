import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Record {
  player: string;
  value: number | string;
  format: string;
}

interface RecordsData {
  mostRuns: Record;
  mostWickets: Record;
  highestScore: Record;
  bestBowling: Record;
}

export const RecordsPage: React.FC = () => {
  const [records, setRecords] = useState<RecordsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get('/api/stats/records');
        setRecords(response.data.data);
      } catch (error) {
        console.error('Failed to fetch records:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading records...</div>;
  }

  const recordItems = records ? [
    { title: 'Most Runs', player: records.mostRuns?.player, value: records.mostRuns?.value, format: records.mostRuns?.format },
    { title: 'Most Wickets', player: records.mostWickets?.player, value: records.mostWickets?.value, format: records.mostWickets?.format },
    { title: 'Highest Score', player: records.highestScore?.player, value: records.highestScore?.value, format: records.highestScore?.format },
    { title: 'Best Bowling', player: records.bestBowling?.player, value: records.bestBowling?.value, format: records.bestBowling?.format },
  ] : [];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Cricket Records</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recordItems.map((item, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
            <h2 className="text-xl font-semibold text-green-600 mb-2">{item.title}</h2>
            <p className="text-2xl font-bold">{item.player}</p>
            <p className="text-gray-500">{item.value} ({item.format})</p>
          </div>
        ))}
      </div>
    </div>
  );
};