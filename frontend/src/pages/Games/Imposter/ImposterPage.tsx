// frontend/src/pages/Games/Imposter/ImposterPage.tsx
import React, { useState } from 'react';
import { ModeSelector } from './components/ModeSelector';
import { ThemeSelector } from './components/ThemeSelector';
import { PlayerSetup } from './components/PlayerSetup';
import { GameBoard } from './components/GameBoard';
import { useAuth } from '../../../contexts/AuthContext';
// ========== NEW IMPORT FOR REWARDS ==========
import { useRewards } from '../../../hooks/useRewards';

type GameMode = 'local' | 'bots';
type GamePhase = 'mode-select' | 'theme-select' | 'player-setup' | 'playing';

const ImposterPage: React.FC = () => {
  const { user } = useAuth();
  const [phase, setPhase] = useState<GamePhase>('mode-select');
  const [gameMode, setGameMode] = useState<GameMode>('local');
  const [selectedTheme, setSelectedTheme] = useState('Cricket Players');
  const [totalRounds, setTotalRounds] = useState(3);
  const [players, setPlayers] = useState<string[]>([]);
  const [botCount, setBotCount] = useState(3);
  const [gameKey, setGameKey] = useState(0);
  
  // ========== NEW REWARDS HOOK ==========
  const { claimReward, claimDailyReward } = useRewards();
  
  // ========== NEW REWARD FUNCTIONS ==========
  const handleWinAsReal = async () => {
    await claimReward('imposter', 'win_real', 1);
  };
  
  const handleWinAsImposter = async () => {
    await claimReward('imposter', 'win_imposter', 1);
  };
  
  const handleCorrectImposterCatch = async () => {
    await claimReward('imposter', 'catch_imposter', 1);
  };
  
  const handleSurviveAsImposter = async () => {
    await claimReward('imposter', 'survive_imposter', 1);
  };
  
  const handleDailyFirstGame = async () => {
    // Only claim for bot games (earning only with bots as per requirement)
    if (gameMode === 'bots') {
      await claimDailyReward('imposter', 'daily_first_game');
    }
  };

  const handleModeSelect = (mode: GameMode) => {
    setGameMode(mode);
    setPhase('theme-select');
  };

  const handleThemeSelect = (theme: string, rounds: number) => {
    setSelectedTheme(theme);
    setTotalRounds(rounds);
    setPhase('player-setup');
  };

  const handlePlayerSetup = async (playerNames: string[], botCountParam?: number) => {
    setPlayers(playerNames);
    if (botCountParam !== undefined) setBotCount(botCountParam);
    setPhase('playing');
    // Claim daily first game reward when starting a bot game
    await handleDailyFirstGame();
  };

  const handleBack = () => {
    if (phase === 'theme-select') {
      setPhase('mode-select');
    } else if (phase === 'player-setup') {
      setPhase('theme-select');
    } else {
      setPhase('mode-select');
    }
  };

  const handleExit = () => {
    setPhase('mode-select');
    setGameMode('local');
  };

  const handlePlayAgain = () => {
    setGameKey(prev => prev + 1);
  };

  if (phase === 'mode-select') {
    return <ModeSelector onSelectMode={handleModeSelect} />;
  }

  if (phase === 'theme-select') {
    return (
      <ThemeSelector
        onSelect={handleThemeSelect}
        onBack={handleBack}
      />
    );
  }

  if (phase === 'player-setup') {
    return (
      <PlayerSetup
        gameMode={gameMode}
        onStart={handlePlayerSetup}
        onBack={handleBack}
        playerName={user?.username || 'Guest'}
        botCount={botCount}
        setBotCount={setBotCount}
      />
    );
  }

  if (phase === 'playing') {
    return (
      <GameBoard
        key={gameKey}
        gameMode={gameMode}
        theme={selectedTheme}
        totalRounds={totalRounds}
        players={players}
        onExit={handleExit}
        onPlayAgain={handlePlayAgain}
        botCount={botCount}
        onWinAsReal={handleWinAsReal}
        onWinAsImposter={handleWinAsImposter}
        onCorrectImposterCatch={handleCorrectImposterCatch}
        onSurviveAsImposter={handleSurviveAsImposter}
      />
    );
  }

  return null;
};

export default ImposterPage;