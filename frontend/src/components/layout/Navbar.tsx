// src/components/layout/Navbar.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

interface DropdownItem {
  path: string;
  label: string;
}

interface NavLink {
  path?: string;
  label: string;
  highlight?: boolean;
  dropdown?: DropdownItem[];
}

type ActiveMenu = 'rankings' | 'tournaments' | 'games' | null;

export const Navbar: React.FC<NavbarProps> = ({ darkMode, setDarkMode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<ActiveMenu>(null);
  const [scrolled, setScrolled] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsUserDropdownOpen(false);
    navigate('/');
  };

  const navLinks: NavLink[] = [
    { path: '/', label: 'Home' },
    { path: '/players', label: 'Players' },
    { 
      label: 'Rankings', 
      dropdown: [
        { path: '/players/rankings', label: 'Player Rankings' },
        { path: '/teams/rankings', label: 'Team Rankings' },
      ]
    },
    { 
      label: 'Tournaments', 
      dropdown: [
        { path: '/ipl', label: 'IPL' },
        { path: '/world-cup', label: 'ODI World Cup' },
        { path: '/world-cup/t20', label: 'T20I World Cup' },
        { path: '/champions-trophy', label: 'Champions Trophy' },
        { path: '/wtc', label: 'WTC' },
      ]
    },
    { 
      label: 'Games', 
      dropdown: [
        { path: '/games/kwik-cricket', label: 'Kwik Cricket' },
        { path: '/games/quiz', label: 'Cricket Quiz' },
        { path: '/games/imposter', label: 'Imposter' },
        { path: '/games/guess-legend', label: 'Guess the Legend' },
        { path: '/games/cricket-cards', label: 'Cricket Cards'},
      ]
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  const getActiveMenuData = (): { label: string; items: DropdownItem[] } | null => {
    if (activeMenu === 'rankings') {
      return {
        label: 'Rankings',
        items: navLinks.find(l => l.label === 'Rankings')?.dropdown || []
      };
    }
    if (activeMenu === 'tournaments') {
      return {
        label: 'Tournaments',
        items: navLinks.find(l => l.label === 'Tournaments')?.dropdown || []
      };
    }
    if (activeMenu === 'games') {
      return {
        label: 'Games',
        items: navLinks.find(l => l.label === 'Games')?.dropdown || []
      };
    }
    return null;
  };

  const handleBack = () => {
    setActiveMenu(null);
  };

  const activeMenuData = getActiveMenuData();

  const mainNavVariants = {
    visible: { x: 0, opacity: 1, display: 'flex' },
    hidden: { x: -20, opacity: 0, display: 'none' }
  };

  const subNavVariants = {
    hidden: { x: 20, opacity: 0, display: 'none' },
    visible: { x: 0, opacity: 1, display: 'flex' }
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white dark:bg-gray-900 shadow-md' 
        : 'bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Cricket<span className="text-green-600 dark:text-green-500">Universe</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center flex-1 justify-center">
            <AnimatePresence mode="wait">
              {activeMenu === null ? (
                <motion.div
                  key="main-nav"
                  initial="visible"
                  animate="visible"
                  exit="hidden"
                  variants={mainNavVariants}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="flex items-center space-x-1"
                >
                  {navLinks.map((link) => (
                    <div key={link.label}>
                      {link.dropdown ? (
                        <button
                          onClick={() => setActiveMenu(link.label.toLowerCase() as ActiveMenu)}
                          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                            activeMenu === link.label.toLowerCase() as ActiveMenu
                              ? 'text-green-600 dark:text-green-500 bg-gray-50 dark:bg-gray-800'
                              : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          {link.label}
                        </button>
                      ) : (
                        <Link
                          to={link.path!}
                          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                            isActive(link.path!)
                              ? 'text-green-600 dark:text-green-500 bg-gray-50 dark:bg-gray-800'
                              : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                          } ${link.highlight ? 'text-red-600 dark:text-red-500 font-semibold' : ''}`}
                        >
                          {link.label}
                        </Link>
                      )}
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="sub-nav"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={subNavVariants}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="flex items-center space-x-2"
                >
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-1 px-2 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <span className="text-base">←</span>
                    <span>Back</span>
                  </button>
                  
                  <div className="h-5 w-px bg-gray-300 dark:bg-gray-700" />
                  
                  <span className="px-2 py-2 text-sm font-semibold text-gray-900 dark:text-white">
                    {activeMenuData?.label}
                  </span>
                  
                  <div className="h-5 w-px bg-gray-300 dark:bg-gray-700" />
                  
                  <div className="flex items-center space-x-1">
                    {activeMenuData?.items.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setActiveMenu(null)}
                        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                          isActive(item.path)
                            ? 'text-green-600 dark:text-green-500 bg-gray-50 dark:bg-gray-800'
                            : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Section - Dark Mode Toggle & Auth */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-lg"
              aria-label="Toggle dark mode"
            >
              {darkMode ? '🌙' : '☀️'}
            </button>

            {/* Desktop Auth Section */}
            <div className="hidden lg:block">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="px-3 py-1.5 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    {user?.username || 'Account'}
                  </button>
                  
                  {isUserDropdownOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40"
                        onClick={() => setIsUserDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                        <Link
                          to="/games/kwik-cricket/history"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          Match History
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-3 py-1.5 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-1.5 text-sm font-medium rounded-md bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle mobile menu"
            >
              <span className="text-lg">{isMobileMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden border-t border-gray-200 dark:border-gray-800"
            >
              {activeMenu === null ? (
                <div className="py-2 space-y-0.5">
                  {navLinks.map((link) => (
                    <div key={link.label}>
                      {link.dropdown ? (
                        <button
                          onClick={() => setActiveMenu(link.label.toLowerCase() as ActiveMenu)}
                          className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                        >
                          <span>{link.label}</span>
                          <span className="text-gray-400">→</span>
                        </button>
                      ) : (
                        <Link
                          to={link.path!}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`block px-4 py-2.5 text-sm font-medium rounded-lg ${
                            isActive(link.path!)
                              ? 'text-green-600 dark:text-green-500 bg-gray-50 dark:bg-gray-800'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                          } ${link.highlight ? 'text-red-600 dark:text-red-500' : ''}`}
                        >
                          {link.label}
                        </Link>
                      )}
                    </div>
                  ))}
                  
                  {/* Mobile Auth Section */}
                  <div className="border-t border-gray-200 dark:border-gray-800 my-2 pt-2">
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                          {user?.username}
                        </div>
                        <Link
                          to="/games/kwik-cricket/history"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                        >
                          Match History
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsMobileMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                        >
                          Login
                        </Link>
                        <Link
                          to="/register"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block px-4 py-2.5 text-sm font-medium bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg"
                        >
                          Sign Up
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-2">
                  <button
                    onClick={() => setActiveMenu(null)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg w-full"
                  >
                    <span>←</span>
                    <span>Back</span>
                  </button>
                  
                  <div className="h-px bg-gray-200 dark:bg-gray-700 my-2" />
                  
                  <div className="px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white">
                    {activeMenuData?.label}
                  </div>
                  
                  <div className="mt-1 space-y-0.5">
                    {activeMenuData?.items.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => {
                          setActiveMenu(null);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`block px-4 py-2.5 text-sm font-medium rounded-lg ${
                          isActive(item.path)
                            ? 'text-green-600 dark:text-green-500 bg-gray-50 dark:bg-gray-800'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};