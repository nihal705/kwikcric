// frontend/src/pages/Home/components/ChampionsWall.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

type TournamentType = 'odi' | 't20' | 'ct' | 'wtc';

// Team logos mapping
const teamLogos: Record<string, string> = {
  'West Indies': '🌴',
  'India': '🇮🇳',
  'Australia': '🇦🇺',
  'Pakistan': '🇵🇰',
  'Sri Lanka': '🇱🇰',
  'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'New Zealand': '🇳🇿',
  'South Africa': '🇿🇦',
  'India & Sri Lanka': '🏆',
};

const tournamentData = {
  odi: [
    { year: 1975, winner: "West Indies", runnerUp: "Australia", venue: "Lord's, London", captain: "Clive Lloyd" },
    { year: 1979, winner: "West Indies", runnerUp: "England", venue: "Lord's, London", captain: "Clive Lloyd" },
    { year: 1983, winner: "India", runnerUp: "West Indies", venue: "Lord's, London", captain: "Kapil Dev" },
    { year: 1987, winner: "Australia", runnerUp: "England", venue: "Eden Gardens, Kolkata", captain: "Allan Border" },
    { year: 1992, winner: "Pakistan", runnerUp: "England", venue: "MCG, Melbourne", captain: "Imran Khan" },
    { year: 1996, winner: "Sri Lanka", runnerUp: "Australia", venue: "Gaddafi Stadium, Lahore", captain: "Arjuna Ranatunga" },
    { year: 1999, winner: "Australia", runnerUp: "Pakistan", venue: "Lord's, London", captain: "Steve Waugh" },
    { year: 2003, winner: "Australia", runnerUp: "India", venue: "Wanderers, Johannesburg", captain: "Ricky Ponting" },
    { year: 2007, winner: "Australia", runnerUp: "Sri Lanka", venue: "Kensington Oval, Barbados", captain: "Ricky Ponting" },
    { year: 2011, winner: "India", runnerUp: "Sri Lanka", venue: "Wankhede, Mumbai", captain: "MS Dhoni" },
    { year: 2015, winner: "Australia", runnerUp: "New Zealand", venue: "MCG, Melbourne", captain: "Michael Clarke" },
    { year: 2019, winner: "England", runnerUp: "New Zealand", venue: "Lord's, London", captain: "Eoin Morgan" },
    { year: 2023, winner: "Australia", runnerUp: "India", venue: "Narendra Modi Stadium", captain: "Pat Cummins" },
  ],
  t20: [
    { year: 2007, winner: "India", runnerUp: "Pakistan", venue: "Johannesburg", captain: "MS Dhoni" },
    { year: 2009, winner: "Pakistan", runnerUp: "Sri Lanka", venue: "Lord's, London", captain: "Younis Khan" },
    { year: 2010, winner: "England", runnerUp: "Australia", venue: "Barbados", captain: "Paul Collingwood" },
    { year: 2012, winner: "West Indies", runnerUp: "Sri Lanka", venue: "Colombo", captain: "Darren Sammy" },
    { year: 2014, winner: "Sri Lanka", runnerUp: "India", venue: "Dhaka", captain: "Lasith Malinga" },
    { year: 2016, winner: "West Indies", runnerUp: "England", venue: "Kolkata", captain: "Darren Sammy" },
    { year: 2021, winner: "Australia", runnerUp: "New Zealand", venue: "Dubai", captain: "Aaron Finch" },
    { year: 2022, winner: "England", runnerUp: "Pakistan", venue: "Melbourne", captain: "Jos Buttler" },
    { year: 2024, winner: "India", runnerUp: "South Africa", venue: "Barbados", captain: "Rohit Sharma" },
    { year: 2026, winner: "India", runnerUp: "New Zealand", venue: "Ahmedabad", captain: "Suryakumar Yadav" },
  ],
  ct: [
    { year: 1998, winner: "South Africa", runnerUp: "West Indies", venue: "Dhaka", captain: "Hansie Cronje" },
    { year: 2000, winner: "New Zealand", runnerUp: "India", venue: "Nairobi", captain: "Stephen Fleming" },
    { year: 2002, winner: "India & Sri Lanka", runnerUp: "Shared", venue: "Colombo", captain: "Sourav Ganguly" },
    { year: 2004, winner: "West Indies", runnerUp: "England", venue: "London", captain: "Brian Lara" },
    { year: 2006, winner: "Australia", runnerUp: "West Indies", venue: "Mumbai", captain: "Ricky Ponting" },
    { year: 2009, winner: "Australia", runnerUp: "New Zealand", venue: "Centurion", captain: "Ricky Ponting" },
    { year: 2013, winner: "India", runnerUp: "England", venue: "London", captain: "MS Dhoni" },
    { year: 2017, winner: "Pakistan", runnerUp: "India", venue: "London", captain: "Sarfaraz Ahmed" },
    { year: 2025, winner: "India", runnerUp: "England", venue: "Lahore", captain: "Rohit Sharma" },
  ],
  wtc: [
    { year: "2019-21", winner: "New Zealand", runnerUp: "India", venue: "Southampton", captain: "Kane Williamson" },
    { year: "2021-23", winner: "Australia", runnerUp: "India", venue: "The Oval", captain: "Pat Cummins" },
    { year: "2023-25", winner: "South Africa", runnerUp: "Australia", venue: "Lord's", captain: "Temba Bavuma" },
  ],
};

const teamColors: Record<string, string> = {
  'West Indies': 'from-purple-600 to-pink-600',
  'India': 'from-orange-600 to-orange-800',
  'Australia': 'from-yellow-600 to-yellow-800',
  'Pakistan': 'from-green-600 to-green-800',
  'Sri Lanka': 'from-blue-600 to-blue-800',
  'England': 'from-red-600 to-red-800',
  'New Zealand': 'from-slate-600 to-slate-800',
  'South Africa': 'from-green-500 to-green-700',
};

export const ChampionsWall: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TournamentType>('odi');

  const tabs = [
    { id: 'odi' as TournamentType, label: 'ODI World Cup', icon: '', count: tournamentData.odi.length },
    { id: 't20' as TournamentType, label: 'T20 World Cup', icon: '', count: tournamentData.t20.length },
    { id: 'ct' as TournamentType, label: 'Champions Trophy', icon: '', count: tournamentData.ct.length },
    { id: 'wtc' as TournamentType, label: 'Test Championship', icon: '', count: tournamentData.wtc.length },
  ];

  const currentData = tournamentData[activeTab];

  return (
    <section className="py-6 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 bg-yellow-500/10 rounded-full px-2.5 py-0.5 mb-2"
          >
            <span className="text-yellow-600 dark:text-yellow-400 text-[10px]">🏆</span>
            <span className="text-yellow-600 dark:text-yellow-400 text-[10px] font-medium">WORLD CHAMPIONS</span>
          </motion.div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-0.5">Wall of Champions</h2>
          <p className="text-xs text-gray-600 dark:text-gray-400">Every team that lifted the coveted trophy</p>
        </div>
        
        {/* Tab Selector - Compact */}
        <div className="flex flex-wrap justify-center gap-1.5 mb-5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-yellow-500 text-white shadow-sm'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <span className="text-sm">{tab.icon}</span>
              <span>{tab.label}</span>
              <span className="text-[10px] opacity-70">({tab.count})</span>
            </button>
          ))}
        </div>
        
        {/* Champions Grid - Compact */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {currentData.map((champion, index) => (
            <motion.div
              key={champion.year}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
              viewport={{ once: true }}
              whileHover={{ y: -2, scale: 1.01 }}
              className="group cursor-pointer"
            >
              <Link to={activeTab === 'odi' ? `/world-cup/${champion.year}` : activeTab === 't20' ? `/world-cup/t20/${champion.year}` : '#'}>
                <div className={`bg-gradient-to-br ${teamColors[champion.winner] || 'from-gray-700 to-gray-800'} rounded-md p-2 text-center shadow-sm transition-all duration-200`}>
                  <div className="text-xl">{teamLogos[champion.winner] || '🏆'}</div>
                  <div className="text-xs font-bold text-white">{champion.year}</div>
                  <div className="text-[10px] font-semibold text-yellow-300 mt-0.5 truncate">{champion.winner}</div>
                  <div className="text-[8px] text-white/70 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity truncate">
                    vs {champion.runnerUp}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-4">
          <Link to="/tournaments/hub" className="inline-flex items-center gap-1 text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 transition-colors text-xs">
            <span>View all tournaments</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};