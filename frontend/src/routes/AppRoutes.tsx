import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from '../pages/Home/HomePage';
import { PlayersPage } from '../pages/Players/PlayersPage';
import { PlayerDetailPage } from '../pages/Players/PlayerDetailPage';
import { IPLPage } from '../pages/Tournaments/IPLPage';
import { WorldCupPage } from '../pages/Tournaments/WorldCupPage';
import { GamesHubPage } from '../pages/Games/GamesHubPage';
import { QuickCricketPage } from '../pages/Games/QuickCricketPage';
import { GuessPlayerPage } from '../pages/Games/GuessPlayerPage';
import { QuizPage } from '../pages/Games/QuizPage';
import { LeaderboardPage } from '../pages/Games/LeaderboardPage';
import { LoginPage } from '../pages/Auth/LoginPage';
import { RegisterPage } from '../pages/Auth/RegisterPage';
import { DashboardPage } from '../pages/Dashboard/DashboardPage';
import { ProfilePage } from '../pages/Dashboard/ProfilePage';
import { LiveMatchesPage } from '../pages/Live/LiveMatchesPage';
import { MatchDetailPage } from '../pages/Live/MatchDetailPage';
import { RecordsPage } from '../pages/Stats/RecordsPage';
import { PrivateRoute } from './PrivateRoute';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/players" element={<PlayersPage />} />
      <Route path="/player/:id" element={<PlayerDetailPage />} />
      <Route path="/ipl" element={<IPLPage />} />
      <Route path="/world-cup" element={<WorldCupPage />} />
      <Route path="/live" element={<LiveMatchesPage />} />
      <Route path="/live/:matchId" element={<MatchDetailPage />} />
      <Route path="/records" element={<RecordsPage />} />
      <Route path="/games" element={<GamesHubPage />} />
      <Route path="/games/quick-cricket" element={<QuickCricketPage />} />
      <Route path="/games/guess-player" element={<GuessPlayerPage />} />
      <Route path="/games/quiz" element={<QuizPage />} />
      <Route path="/games/leaderboard/:gameType?" element={<LeaderboardPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <PrivateRoute>
          <DashboardPage />
        </PrivateRoute>
      } />
      <Route path="/profile" element={
        <PrivateRoute>
          <ProfilePage />
        </PrivateRoute>
      } />
    </Routes>
  );
};