import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store/store';

export const ProfilePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || '');

  const handleSave = () => {
    // Save profile logic here
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Username</label>
            <p className="text-lg font-semibold">{user?.username || 'N/A'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
            <p className="text-lg font-semibold">{user?.email || 'N/A'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
            {isEditing ? (
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            ) : (
              <p className="text-lg">{user?.fullName || 'Not set'}</p>
            )}
          </div>
          <div className="pt-4">
            {isEditing ? (
              <div className="flex space-x-3">
                <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded-lg">Save</button>
                <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-500 text-white rounded-lg">Cancel</button>
              </div>
            ) : (
              <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-green-600 text-white rounded-lg">Edit Profile</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};