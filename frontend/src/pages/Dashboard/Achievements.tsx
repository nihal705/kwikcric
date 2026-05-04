import React from 'react';

export const Achievements: React.FC = () => {
  const achievements = [
    { name: 'First Game', description: 'Play your first game', unlocked: false },
    { name: 'Century Maker', description: 'Score 100 runs in Quick Cricket', unlocked: false },
    { name: 'Quiz Master', description: 'Score 90% in a quiz', unlocked: false },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
      <h2 className="text-xl font-bold mb-4">Achievements</h2>
      <div className="space-y-3">
        {achievements.map((achievement, index) => (
          <div key={index} className={`p-3 rounded-lg border ${achievement.unlocked ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{achievement.name}</div>
                <div className="text-sm text-gray-500">{achievement.description}</div>
              </div>
              <div className="text-2xl">{achievement.unlocked ? '🏆' : '🔒'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};