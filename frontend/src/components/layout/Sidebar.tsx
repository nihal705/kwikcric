import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiHome, FiUsers, FiAward, FiMap, FiMenu, FiActivity, FiX } from 'react-icons/fi';
import { RootState } from '../../app/store/store';
import { toggleSidebar } from '../../app/store/slices/uiSlice';

export const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state: RootState) => state.ui);

  const menuItems = [
    { path: '/', icon: FiHome, label: 'Home' },
    { path: '/players', icon: FiUsers, label: 'Players' },
    { path: '/ipl', icon: FiAward, label: 'IPL' },
    { path: '/world-cup', icon: FiMap, label: 'World Cup' },
    { path: '/games', icon: FiMenu, label: 'Games' },
    { path: '/live', icon: FiActivity, label: 'Live Scores' },
  ];

  if (!sidebarOpen) return null;

  return (
    <>
      {/* Overlay - closes sidebar when clicked outside */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={() => dispatch(toggleSidebar())}
      />
      
      {/* Sidebar */}
      <aside className="fixed left-0 top-16 h-full w-64 bg-white dark:bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 overflow-y-auto">
        {/* Close button for mobile */}
        <button 
          onClick={() => dispatch(toggleSidebar())}
          className="absolute top-4 right-4 p-2 rounded-lg lg:hidden hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <FiX size={20} />
        </button>
        
        <nav className="p-4 pt-16 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => dispatch(toggleSidebar())}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};