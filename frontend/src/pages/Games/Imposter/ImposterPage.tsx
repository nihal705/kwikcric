// frontend/src/pages/Games/Imposter/ImposterPage.tsx
import React, { useState } from 'react';
import { ModeSelector } from './components/ModeSelector';
import { ThemeSelector } from './components/ThemeSelector';
import { PlayerSetup } from './components/PlayerSetup';
import { GameBoard } from './components/GameBoard';
import { useAuth } from '../../../contexts/AuthContext';

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

  const handleModeSelect = (mode: GameMode) => {
    setGameMode(mode);
    setPhase('theme-select');
  };

  const handleThemeSelect = (theme: string, rounds: number) => {
    setSelectedTheme(theme);
    setTotalRounds(rounds);
    setPhase('player-setup');
  };

  const handlePlayerSetup = (playerNames: string[], botCountParam?: number) => {
    setPlayers(playerNames);
    if (botCountParam !== undefined) setBotCount(botCountParam);
    setPhase('playing');
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
      />
    );
  }

  return null;
};

export default ImposterPage;