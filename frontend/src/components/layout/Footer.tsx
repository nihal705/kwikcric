// src/components/layout/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const sections = [
    {
      title: 'Explore',
      links: [
        { label: 'Player Rankings', path: '/players/rankings' },
        { label: 'Team Rankings', path: '/teams/rankings' },
        { label: 'Tournaments', path: '/tournaments' },
        { label: 'Live Scores', path: '/live' },
      ]
    },
    {
      title: 'Games',
      links: [
        { label: 'Quick Cricket', path: '/games/quick-cricket' },
        { label: 'Cricket Quiz', path: '/games/quiz' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'About Us', path: '/about' },
        { label: 'Contact', path: '/contact' },
        { label: 'Privacy Policy', path: '/privacy' },
      ]
    },
  ];

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🏏</span>
              <span className="text-xl font-bold">Cricket Universe</span>
            </div>
            <p className="text-gray-400 text-sm">
              The ultimate cricket analytics platform featuring player rankings, team statistics, 
              tournament history, and interactive games.
            </p>
            <div className="flex space-x-4 mt-4">
              <span className="text-2xl">🐦</span>
              <span className="text-2xl">📘</span>
              <span className="text-2xl">📷</span>
            </div>
          </div>

          {/* Links */}
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-lg mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-gray-400 hover:text-green-400 transition">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {currentYear} Cricket Universe. All rights reserved.</p>
          <p className="mt-1">Data sourced from Cricsheet and official cricket archives</p>
        </div>
      </div>
    </footer>
  );
};