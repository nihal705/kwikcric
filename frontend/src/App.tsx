// src/App.tsx
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import HomePage from './pages/Home/HomePage';
import { PlayersPage } from './pages/Players/PlayersPage';
import { PlayerDetailPage } from './pages/Players/PlayerDetailPage';
import PlayerRankingsPage from './pages/Players/PlayerRankingsPage';
import TeamRankingsPage from './pages/Players/Teams/TeamRankingsPage';
import { GamesPage } from './pages/Games/GamesPage';
import { QuickCricketPage } from './pages/Games/QuickCricketPage';
import { LiveScoresPage } from './pages/Live/LiveScoresPage';
import { WorldCupHub } from './pages/Tournaments/WorldCupHub';
import { WorldCupDetailPage } from './pages/Tournaments/WorldCupDetailPage';
import { TeamDetailPage } from './pages/Tournaments/TeamDetailPage';
import { T20WorldCupHub } from './pages/Tournaments/T20WorldCupHub';
import { T20WorldCupDetailPage } from './pages/Tournaments/T20WorldCupDetailPage';
import { T20TeamDetailPage } from './pages/Tournaments/T20TeamDetailPage';
import TournamentHubPage from './pages/TournamentHub/TournamentHubPage';
import HistoryPage from './pages/History/HistoryPage';
import { ChampionsTrophyHub } from './pages/Tournaments/ChampionsTrophyHub';
import { ChampionsTrophyDetailPage } from './pages/Tournaments/ChampionsTrophyDetailPage';
import { ChampionsTrophyTeamDetailPage } from './pages/Tournaments/ChampionsTrophyTeamDetailPage';
import { WTCHub } from './pages/Tournaments/WTCHub';
import { WTCDetailPage } from './pages/Tournaments/WTCDetailPage';
import { WTCTeamDetailPage } from './pages/Tournaments/WTCTeamDetailPage';
import KwikCricketPage from './pages/Games/KwikCricket/KwikCricketPage';
import { AuthProvider } from './contexts/AuthContext';
import { LoginPage } from './pages/Auth/LoginPage';
import { RegisterPage } from './pages/Auth/RegisterPage';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import KwikCricketHistoryPage from './pages/Games/KwikCricket/KwikCricketHistoryPage';
import CricketMastermindPage from './pages/Games/CricketMastermind/CricketMastermindPage';
import GamesHistoryHubPage from './pages/Games/GamesHistoryHubPage';
import ImposterPage from './pages/Games/Imposter/ImposterPage';
import CricketCardsPage from './pages/Games/CricketCards/CricketCardsPage';
import { IPLHub } from './pages/IPL/IPLHub';
import { IPLSeasonDetailPage } from './pages/IPL/IPLSeasonDetailPage';
import { IPLPlayersPage } from './pages/IPL/IPLPlayersPage';
import { IPLPlayerDetailPage } from './pages/IPL/IPLPlayerDetailPage';
import { motion } from 'framer-motion';

const GlobalBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
      className="bg-yellow-50 dark:bg-yellow-950/20 border-b border-yellow-200 dark:border-yellow-800 px-4 py-2.5 relative z-50"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-3 text-xs">
        {/* Animated emoji */}
        <motion.span
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-base"
        >
          🚧
        </motion.span>
        
        <span className="text-amber-800 dark:text-amber-400 font-medium">
          <span className="font-bold">Development Mode</span>
        </span>
        
        <span className="text-amber-700 dark:text-amber-500">•</span>
        
        <span className="text-amber-700 dark:text-amber-500">
          Authentication is <span className="font-semibold">not functional</span>
        </span>
        
        <span className="text-amber-700 dark:text-amber-500">•</span>
        
        <span className="text-amber-700 dark:text-amber-500">
          Games are in <span className="font-semibold">Beta</span>
        </span>
        
        <span className="text-amber-700 dark:text-amber-500">•</span>
        
        <span className="text-amber-700 dark:text-amber-500">
          Some data may be <span className="font-semibold">outdated</span>
        </span>

        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="ml-2 text-amber-500 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors"
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
};

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

useEffect(() => {
  if (darkMode) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
}, [darkMode]);

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-white dark:bg-[#0f172a]">
          <GlobalBanner />
          <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
          <main className="flex-1">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/players" element={<PlayersPage />} />
              <Route path="/player/:id" element={<PlayerDetailPage />} />
              <Route path="/players/rankings" element={<PlayerRankingsPage />} />
              <Route path="/team-rankings" element={<TeamRankingsPage />} />
              {/* ODI World Cup Routes */}
              <Route path="/world-cup" element={<WorldCupHub />} />
              <Route path="/world-cup/:year" element={<WorldCupDetailPage />} />
              <Route path="/world-cup/team/:teamName" element={<TeamDetailPage />} />
              
              {/* T20 World Cup Routes - Using dedicated component */}
              <Route path="/world-cup/t20" element={<T20WorldCupHub />} />
              <Route path="/world-cup/t20/:year" element={<T20WorldCupDetailPage />} />
              <Route path="/world-cup/t20/team/:teamName" element={<T20TeamDetailPage />} />
              
              {/* Games Routes */}
              <Route path="/games" element={<GamesPage />} />
              <Route path="/games/quick-cricket" element={<QuickCricketPage />} />
              <Route path="/games/quiz" element={<CricketMastermindPage />} />
              <Route path="/games/kwik-cricket" element={
                <ProtectedRoute>
                  <KwikCricketPage />
                </ProtectedRoute>
              } />
              <Route path="/games/kwik-cricket/history" element={<KwikCricketHistoryPage />} />
              <Route path="/games/history" element={<GamesHistoryHubPage />} />
              
              {/* Other Routes */}
              <Route path="/live" element={<LiveScoresPage />} />
              <Route path="/tournaments/hub" element={<TournamentHubPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/champions-trophy" element={<ChampionsTrophyHub />} />
              <Route path="/champions-trophy/:year" element={<ChampionsTrophyDetailPage />} />
              <Route path="/champions-trophy/team/:teamName" element={<ChampionsTrophyTeamDetailPage />} />
              <Route path="/wtc" element={<WTCHub />} />
              <Route path="/wtc/:year" element={<WTCDetailPage />} />
              <Route path="/wtc/team/:teamName" element={<WTCTeamDetailPage />} />
              <Route path="/games/imposter" element={<ImposterPage />} />
              <Route path="/games/cricket-cards" element={<CricketCardsPage />} />
              <Route path="/ipl" element={<IPLHub />} />
              <Route path="/ipl/:year" element={<IPLSeasonDetailPage />} />
              <Route path="/ipl/players" element={<IPLPlayersPage />} />
              <Route path="/ipl/player/:id" element={<IPLPlayerDetailPage />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-right" />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;