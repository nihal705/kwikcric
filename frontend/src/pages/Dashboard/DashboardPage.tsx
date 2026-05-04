import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../../app/store/store';

export const DashboardPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const stats = [
    { label: 'Games Played', value: '0', icon: '🎮' },
    { label: 'Total Score', value: '0', icon: '🏆' },
    { label: 'Quiz Points', value: '0', icon: '📚' },
    { label: 'Rank', value: '-', icon: '📊' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.username || 'User'}!</h1>
      <p className="text-gray-500 mb-8">Track your progress and continue playing games.</p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
          <h2 className="text-xl font-bold mb-4">Recent Games</h2>
          <div className="text-center py-8 text-gray-500">No games played yet</div>
          <Link to="/games" className="block text-center mt-2 text-green-600 hover:underline">Play a Game →</Link>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
          <h2 className="text-xl font-bold mb-4">Achievements</h2>
          <div className="text-center py-8 text-gray-500">Complete games to earn achievements!</div>
        </div>
      </div>
    </div>
  );
};