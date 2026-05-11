// frontend/src/pages/Home/HomePage.tsx
import React, { useEffect } from 'react';
import { HeroSection } from './components/HeroSection';
import { StatsDashboard } from './components/StatsDashboard';
import { HistoricalTimeline } from './components/HistoricalTimeline';
import { ChampionsWall } from './components/ChampionsWall';
import { FlipFacts } from './components/FlipFacts';
import { GamesPreview } from './components/GamesPreview';
import { CTASection } from './components/CTASection';
import { StatsLeaderboard } from './components/StatsLeaderboard';
import { QuoteOfTheDay } from './components/QuoteOfTheDay';
import { TournamentCountdown } from './components/TournamentCountdown';
import { BirthdayReminder } from './components/BirthdayReminder';
import { WeeklyPoll } from './components/WeeklyPoll';

const HomePage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    // CHANGE THIS LINE - REMOVE dark:bg-gray-900
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      <StatsDashboard />
      
     {/* New Features Row 1 */}
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsLeaderboard />
          <QuoteOfTheDay />
          <TournamentCountdown />
        </div>
      </div>
    </div>

    {/* New Features Row 2 */}
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BirthdayReminder />
          <WeeklyPoll />
        </div>
      </div>
    </div>
      
      <HistoricalTimeline />
      <ChampionsWall />
      <FlipFacts />
      <GamesPreview />
      <CTASection />
    </div>
  );
};

export default HomePage;