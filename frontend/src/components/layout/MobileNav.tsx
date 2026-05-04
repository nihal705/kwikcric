import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiUsers, FiAward, FiMenu, FiUser } from 'react-icons/fi';

export const MobileNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 md:hidden z-40">
      <div className="flex justify-around py-2">
        <Link to="/" className="flex flex-col items-center p-2 text-gray-600 dark:text-gray-400 hover:text-green-600">
          <FiHome size={22} />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link to="/players" className="flex flex-col items-center p-2 text-gray-600 dark:text-gray-400 hover:text-green-600">
          <FiUsers size={22} />
          <span className="text-xs mt-1">Players</span>
        </Link>
        <Link to="/ipl" className="flex flex-col items-center p-2 text-gray-600 dark:text-gray-400 hover:text-green-600">
          <FiAward size={22} />
          <span className="text-xs mt-1">IPL</span>
        </Link>
        <Link to="/games" className="flex flex-col items-center p-2 text-gray-600 dark:text-gray-400 hover:text-green-600">
          <FiMenu size={22} />
          <span className="text-xs mt-1">Games</span>
        </Link>
        <Link to="/dashboard" className="flex flex-col items-center p-2 text-gray-600 dark:text-gray-400 hover:text-green-600">
          <FiUser size={22} />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </nav>
  );
};