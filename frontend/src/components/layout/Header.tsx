import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiMenu, FiX, FiUser, FiLogOut, FiSun, FiMoon } from 'react-icons/fi';
import { RootState } from '../../app/store/store';
import { toggleSidebar, setTheme } from '../../app/store/slices/uiSlice';
import { useAuth } from '../../app/hooks/useAuth';

export const Header: React.FC = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state: RootState) => state.ui);
  const { isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleThemeToggle = () => {
    dispatch(setTheme(theme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Left section - Menu button + Logo */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FiMenu size={22} />
          </button>
          
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🏏</span>
            <span className="font-bold text-xl text-green-600 dark:text-green-400 hidden sm:inline">
              Cricket Universe
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-green-600 transition">Home</Link>
          <Link to="/players" className="hover:text-green-600 transition">Players</Link>
          <Link to="/ipl" className="hover:text-green-600 transition">IPL</Link>
          <Link to="/world-cup" className="hover:text-green-600 transition">World Cup</Link>
          <Link to="/games" className="hover:text-green-600 transition">Games</Link>
        </nav>

        {/* Right section */}
        <div className="flex items-center space-x-2">
          {/* Theme toggle */}
          <button
            onClick={handleThemeToggle}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

          {/* Auth buttons */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <Link to="/dashboard" className="p-2 text-gray-500 hover:text-green-600">
                <FiUser size={18} />
              </Link>
              <button onClick={logout} className="p-2 text-gray-500 hover:text-red-600">
                <FiLogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="hidden md:flex space-x-2">
              <Link to="/login" className="px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition">
                Login
              </Link>
              <Link to="/register" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t py-4">
          <nav className="flex flex-col space-y-3 px-4">
            <Link to="/" className="py-2 hover:text-green-600" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/players" className="py-2 hover:text-green-600" onClick={() => setIsMenuOpen(false)}>Players</Link>
            <Link to="/ipl" className="py-2 hover:text-green-600" onClick={() => setIsMenuOpen(false)}>IPL</Link>
            <Link to="/world-cup" className="py-2 hover:text-green-600" onClick={() => setIsMenuOpen(false)}>World Cup</Link>
            <Link to="/games" className="py-2 hover:text-green-600" onClick={() => setIsMenuOpen(false)}>Games</Link>
            <div className="pt-3 border-t flex space-x-3">
              <Link to="/login" className="flex-1 text-center px-4 py-2 border border-green-600 rounded-lg" onClick={() => setIsMenuOpen(false)}>Login</Link>
              <Link to="/register" className="flex-1 text-center px-4 py-2 bg-green-600 text-white rounded-lg" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};