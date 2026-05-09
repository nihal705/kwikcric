// src/App.tsx
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import HomePage from './pages/Home/HomePage';
import { PlayersPage } from './pages/Players/PlayersPage';
import { PlayerDetailPage } from './pages/Players/PlayerDetailPage';
import PlayerRankingsPage from './pages/Players/PlayerRankingsPage';
import TournamentsPage from './pages/Tournaments/TournamentsPage';
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
import { CurrencyProvider } from './contexts/CurrencyContext';
import { RewardNotification } from './components/RewardNotification';
import { useRewards } from './hooks/useRewards';

function AppContent() {
  const { showNotification, currentReward, hideNotification } = useRewards();
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
    <>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="flex-1">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/players" element={<PlayersPage />} />
          <Route path="/player/:id" element={<PlayerDetailPage />} />
          <Route path="/players/rankings" element={<PlayerRankingsPage />} />
          <Route path="/tournaments" element={<TournamentsPage />} />
          <Route path="/ipl" element={<TournamentsPage />} />
          <Route path="/world-cup" element={<WorldCupHub />} />
          <Route path="/world-cup/:year" element={<WorldCupDetailPage />} />
          <Route path="/world-cup/team/:teamName" element={<TeamDetailPage />} />
          <Route path="/world-cup/t20" element={<T20WorldCupHub />} />
          <Route path="/world-cup/t20/:year" element={<T20WorldCupDetailPage />} />
          <Route path="/world-cup/t20/team/:teamName" element={<T20TeamDetailPage />} />
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
        </Routes>
      </main>
      <Footer />
      <Toaster position="top-right" />
      {showNotification && currentReward && (
        <RewardNotification 
          reward={currentReward} 
          onClose={hideNotification} 
        />
      )}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            <AppContent />
          </div>
        </BrowserRouter>
      </CurrencyProvider>
    </AuthProvider>
  );
}

export default App;