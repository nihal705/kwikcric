// frontend/src/pages/Games/Imposter/components/GameBoard.tsx
import React, { useState, useEffect, useRef } from 'react';
import { BotAI } from '../Logic/BotAI'; // Make sure folder is 'logic' (lowercase)

interface GameBoardProps {
  gameMode: 'local' | 'bots';
  theme: string;
  totalRounds: number;
  players: string[];
  onExit: () => void;
  onPlayAgain?: () => void;
  botCount?: number;
  onWinAsReal?: () => void;
  onWinAsImposter?: () => void;
  onCorrectImposterCatch?: () => void;
  onSurviveAsImposter?: () => void;
}

// Card data
const cardData: Record<string, any[]> = {
  'Cricket Players': [
    { name: 'Virat Kohli', keywords: ['King', 'Chase', 'RCB', 'Aggressive', 'CoverDrive', 'Fitness', 'Captain', 'Delhi'], hints: ['King of Cricket', 'Run Machine', 'Chase Master'] },
    { name: 'MS Dhoni', keywords: ['Captain', 'Finisher', 'Helicopter', 'CSK', 'Calm', 'Thala', 'Wicketkeeper', 'Ranchi'], hints: ['Captain Cool', 'Thala', 'Mahi', 'The Finisher'] },
    { name: 'Sachin Tendulkar', keywords: ['Master', 'Mumbai', 'StraightDrive', 'Legend', 'LittleMaster', 'God', 'BharatRatna'], hints: ['Master Blaster', 'Little Master', 'God of Cricket'] },
    { name: 'Rohit Sharma', keywords: ['Hitman', 'Double', 'Mumbai', 'Sixer', 'Captain', 'Opener', 'ViceCaptain', 'Nagpur'], hints: ['Hitman', 'Double Century King'] },
    { name: 'Hardik Pandya', keywords: ['Allrounder', 'Aggressive', 'Baroda', 'Finisher', 'Power', 'Gujarat', 'Dance', 'Sixer'], hints: ['Kung Fu Pandya', 'HP'] },
    { name: 'Jasprit Bumrah', keywords: ['Yorker', 'Mumbai', 'Death', 'Accuracy', 'Bowler', 'Gujarat', 'Slinger', 'NoBall'], hints: ['Boom Boom Bumrah', 'Yorker King'] }
  ],
  'IPL Teams': [
    { name: 'Mumbai Indians', keywords: ['Blue', '5Titles', 'Rohit', 'Wankhede', 'Ambani', 'Paltan', 'Champions', 'Bumrah'], hints: ['MI', 'Paltan', 'Blue Army'] },
    { name: 'Chennai Super Kings', keywords: ['Yellow', 'Dhoni', 'Whistle', 'Chepauk', 'Comeback', 'Lions', 'CSK', 'SuperKing'], hints: ['CSK', 'Super Kings', 'Yellow Army'] },
    { name: 'Royal Challengers Bangalore', keywords: ['Red', 'Kohli', 'RCB', 'Chinnaswamy', 'Challenger', 'Bangalore', 'ABD', 'Gayle'], hints: ['RCB', 'Challengers', 'Bengaluru'] }
  ],
  'World Cups': [
    { name: '2011 World Cup', keywords: ['India', 'Dhoni', 'Six', 'Mumbai', 'Wankhede', 'Victory', '28Years', 'Tendulkar'], hints: ['India won after 28 years', 'Dhoni six'] },
    { name: '2019 World Cup', keywords: ['England', 'SuperOver', 'Boundary', 'Stokes', "Lord's", 'Final', 'Tie', 'Boult'], hints: ['Tied final', 'Super Over drama'] }
  ],
  'Mixed': [
    { name: 'Virat Kohli', keywords: ['King', 'Chase', 'RCB', 'Aggressive'], hints: ['King of Cricket'] },
    { name: 'MS Dhoni', keywords: ['Captain', 'Finisher', 'CSK', 'Calm'], hints: ['Captain Cool'] },
    { name: 'Mumbai Indians', keywords: ['Blue', '5Titles', 'Rohit', 'Wankhede'], hints: ['MI'] },
    { name: '2011 World Cup', keywords: ['India', 'Dhoni', 'Six', 'Mumbai'], hints: ['India victory'] }
  ]
};

// Unique bot names
const botNames = [
  'Sparky', 'Vexa', 'Megtet', 'Netta', 'Ullalda', 'Zorvik', 'Kaelen', 'Thorne', 'Lyra', 'Dorian',
  'Sylas', 'Morwen', 'Elara', 'Caspian', 'Seraphina', 'Oberon', 'Titania', 'Lysander', 'Calista', 'Draven'
];

// Player colors for cards
const playerColors = [
  { back: 'from-blue-600 to-indigo-700', front: 'bg-blue-50 border-blue-500', text: 'text-blue-700' },
  { back: 'from-green-600 to-emerald-700', front: 'bg-green-50 border-green-500', text: 'text-green-700' },
  { back: 'from-red-600 to-rose-700', front: 'bg-red-50 border-red-500', text: 'text-red-700' },
  { back: 'from-yellow-600 to-amber-700', front: 'bg-yellow-50 border-yellow-500', text: 'text-yellow-700' },
  { back: 'from-pink-600 to-fuchsia-700', front: 'bg-pink-50 border-pink-500', text: 'text-pink-700' },
  { back: 'from-purple-600 to-violet-700', front: 'bg-purple-50 border-purple-500', text: 'text-purple-700' },
  { back: 'from-orange-600 to-amber-700', front: 'bg-orange-50 border-orange-500', text: 'text-orange-700' },
  { back: 'from-teal-600 to-cyan-700', front: 'bg-teal-50 border-teal-500', text: 'text-teal-700' },
  { back: 'from-indigo-600 to-blue-700', front: 'bg-indigo-50 border-indigo-500', text: 'text-indigo-700' },
  { back: 'from-cyan-600 to-sky-700', front: 'bg-cyan-50 border-cyan-500', text: 'text-cyan-700' },
];

export const GameBoard: React.FC<GameBoardProps> = ({
  gameMode,
  theme,
  totalRounds,
  players: initialPlayers,
  onExit,
  onPlayAgain,
}) => {
  const [allDescriptions, setAllDescriptions] = useState<any[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [gamePlayers, setGamePlayers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [phase, setPhase] = useState('playing');
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [imposterName, setImposterName] = useState<string>('');
  const [voteFor, setVoteFor] = useState('');
  const [votes, setVotes] = useState<Map<string, string>>(new Map());
  const [result, setResult] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);
  const [currentDescription, setCurrentDescription] = useState('');
  const [currentTurnPlayer, setCurrentTurnPlayer] = useState('');
  const [flippedCard, setFlippedCard] = useState(false);
  const [botAI] = useState(new BotAI());
  const [playerCards, setPlayerCards] = useState<Map<string, any>>(new Map());
  const [playerColorMap, setPlayerColorMap] = useState<Map<string, number>>(new Map());
  const [playerVotes, setPlayerVotes] = useState<Map<string, string>>(new Map());
  const [votingPlayerIndex, setVotingPlayerIndex] = useState(0);
  const [showVotingScreen, setShowVotingScreen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    initializeGame();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const initializeGame = () => {
    let displayPlayers = [...initialPlayers];
    
    if (gameMode === 'bots') {
      let botIndex = 0;
      displayPlayers = displayPlayers.map((name) => {
        if (name.toLowerCase().includes('bot')) {
          const uniqueName = botNames[botIndex % botNames.length];
          botIndex++;
          return uniqueName;
        }
        return name;
      });
    }
    
    setGamePlayers(displayPlayers);
    
    const cards = cardData[theme] || cardData['Cricket Players'];
    const selectedCardItem = cards[Math.floor(Math.random() * cards.length)];
    setSelectedCard(selectedCardItem);
    
    const imposterIndex = Math.floor(Math.random() * displayPlayers.length);
    const imposterPlayerName = displayPlayers[imposterIndex];
    setImposterName(imposterPlayerName);
    
    const colorMap = new Map<string, number>();
    displayPlayers.forEach((player, idx) => {
      colorMap.set(player, idx % playerColors.length);
    });
    setPlayerColorMap(colorMap);
    
    const newPlayerCards = new Map<string, any>();
    
    for (let i = 0; i < displayPlayers.length; i++) {
      const playerName = displayPlayers[i];
      const isImposter = playerName === imposterPlayerName;
      
      if (isImposter) {
        const hint = selectedCardItem.hints[Math.floor(Math.random() * selectedCardItem.hints.length)];
        newPlayerCards.set(playerName, {
          cardType: 'imposter',
          hint: hint,
          displayText: hint,
          description: 'Describe generically to blend in'
        });
      } else {
        newPlayerCards.set(playerName, {
          cardType: 'real',
          cardName: selectedCardItem.name,
          displayText: selectedCardItem.name,
          description: "Don't say the name!"
        });
      }
    }
    
    setPlayerCards(newPlayerCards);
    setFlippedCard(false);
    
    setCurrentRound(1);
    setCurrentPlayerIndex(0);
    setCurrentTurnPlayer(displayPlayers[0]);
    startTimer();
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(30);
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          if (!isProcessing) {
            handleTimeout();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTimeout = () => {
    if (currentDescription.trim() && !isProcessing) {
      handleSubmitDescription(currentDescription.trim());
    } else if (!isProcessing) {
      handleSubmitDescription('...');
    }
  };

  const getAvailableKeyword = (keywords: string[]): string => {
    const usedWords = allDescriptions
      .filter(d => d.round === currentRound)
      .map(d => d.description.toLowerCase());
    
    const availableKeywords = keywords.filter(k => !usedWords.includes(k.toLowerCase()));
    
    if (availableKeywords.length > 0) {
      return availableKeywords[Math.floor(Math.random() * availableKeywords.length)];
    }
    
    const relatedWords = ['Star', 'Player', 'Legend', 'Icon', 'Champion'];
    return relatedWords[Math.floor(Math.random() * relatedWords.length)];
  };

  const moveToNextPlayer = () => {
    const nextIndex = currentPlayerIndex + 1;
    
    if (nextIndex >= gamePlayers.length) {
      if (currentRound < totalRounds) {
        setCurrentRound(prev => prev + 1);
        setCurrentPlayerIndex(0);
        setCurrentTurnPlayer(gamePlayers[0]);
        setFlippedCard(false);
        startTimer();
      } else {
        setPhase('voting');
      }
    } else {
      setCurrentPlayerIndex(nextIndex);
      setCurrentTurnPlayer(gamePlayers[nextIndex]);
      setFlippedCard(false);
      
      if (gameMode === 'bots' && nextIndex > 0) {
        setTimeout(() => processBotTurn(nextIndex), 1000);
      } else {
        startTimer();
      }
    }
  };

  const processBotTurn = (botIndex: number) => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    const botPlayerName = gamePlayers[botIndex];
    const botCard = playerCards.get(botPlayerName);
    const isBotImposter = botCard?.cardType === 'imposter';
    
    let botDesc: string;
    if (isBotImposter) {
      const currentRoundDescs = allDescriptions.filter(d => d.round === currentRound);
      const realDescriptions = currentRoundDescs.map(d => d.description);
      botDesc = botAI.getImposterDescription(realDescriptions);
    } else {
      const availableKeyword = getAvailableKeyword(selectedCard?.keywords || []);
      botDesc = availableKeyword;
    }
    
    setAllDescriptions(prev => [...prev, {
      playerName: botPlayerName,
      description: botDesc,
      round: currentRound
    }]);
    
    const nextAfterBot = botIndex + 1;
    
    if (nextAfterBot >= gamePlayers.length) {
      if (currentRound < totalRounds) {
        setCurrentRound(prev => prev + 1);
        setCurrentPlayerIndex(0);
        setCurrentTurnPlayer(gamePlayers[0]);
        setFlippedCard(false);
        setIsProcessing(false);
        startTimer();
      } else {
        setPhase('voting');
        setIsProcessing(false);
      }
    } else {
      setCurrentPlayerIndex(nextAfterBot);
      setCurrentTurnPlayer(gamePlayers[nextAfterBot]);
      setFlippedCard(false);
      setIsProcessing(false);
      
      if (gameMode === 'bots' && nextAfterBot > 0) {
        setTimeout(() => processBotTurn(nextAfterBot), 1000);
      } else {
        startTimer();
      }
    }
  };

  const handleSubmitDescription = (description: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    const playerName = gamePlayers[currentPlayerIndex];
    
    setAllDescriptions(prev => [...prev, {
      playerName: playerName,
      description: description.trim() || '...',
      round: currentRound
    }]);
    
    setCurrentDescription('');
    setFlippedCard(false);
    
    moveToNextPlayer();
    setIsProcessing(false);
  };

  const handleVote = (playerName: string) => {
    setVoteFor(playerName);
  };

  const calculateVoteResults = () => {
    const voteCount: Map<string, number> = new Map();
    playerVotes.forEach(vote => {
      voteCount.set(vote, (voteCount.get(vote) || 0) + 1);
    });
    
    let maxVotes = 0;
    let suspectedImposter = '';
    voteCount.forEach((count, player) => {
      if (count > maxVotes) {
        maxVotes = count;
        suspectedImposter = player;
      }
    });
    
    const isImposterCaught = suspectedImposter === imposterName;
    const currentUserCard = playerCards.get(gamePlayers[0]);
    const isUserImposter = currentUserCard?.cardType === 'imposter';
    const didIWin = isUserImposter ? !isImposterCaught : isImposterCaught;
    
    setVotes(playerVotes);
    setResult({
      voteCount: Object.fromEntries(voteCount),
      imposterName: imposterName,
      isImposterCaught,
      didIWin
    });
    
    setShowResult(true);
  };

  const submitVote = () => {
    if (!voteFor) return;
    
    const newVotes = new Map(votes);
    newVotes.set(gamePlayers[0], voteFor);
    
    for (let i = 1; i < gamePlayers.length; i++) {
      const otherPlayers = gamePlayers.filter((_, idx) => idx !== i);
      const randomVote = otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
      newVotes.set(gamePlayers[i], randomVote);
    }
    
    setVotes(newVotes);
    
    const voteCount: Map<string, number> = new Map();
    newVotes.forEach(vote => {
      voteCount.set(vote, (voteCount.get(vote) || 0) + 1);
    });
    
    let maxVotes = 0;
    let suspectedImposter = '';
    voteCount.forEach((count, player) => {
      if (count > maxVotes) {
        maxVotes = count;
        suspectedImposter = player;
      }
    });
    
    const isImposterCaught = suspectedImposter === imposterName;
    const currentUserCard = playerCards.get(gamePlayers[0]);
    const isUserImposter = currentUserCard?.cardType === 'imposter';
    const didIWin = isUserImposter ? !isImposterCaught : isImposterCaught;
    
    setResult({
      voteCount: Object.fromEntries(voteCount),
      imposterName: imposterName,
      isImposterCaught,
      didIWin
    });
    
    setShowResult(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const TimerBar = () => {
    const percentage = (timeLeft / 30) * 100;
    const timerColor = timeLeft <= 10 ? 'bg-red-500' : timeLeft <= 20 ? 'bg-yellow-500' : 'bg-green-500';
    
    return (
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Time Remaining</span>
          <span className={timeLeft <= 10 ? 'text-red-500 font-bold' : ''}>{formatTime(timeLeft)}</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className={`h-full ${timerColor} transition-all duration-1000`} style={{ width: `${percentage}%` }} />
        </div>
      </div>
    );
  };

  // Show result screen
  if (showResult && result) {
    const voteEntries = Object.entries(result.voteCount || {});
    const isLocalMode = gameMode === 'local';
    const winText = isLocalMode 
      ? (result.isImposterCaught ? 'Real Players Win!' : 'Imposter Wins!')
      : (result.didIWin ? 'You Win!' : 'You Lose!');
    
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <div className="text-5xl mb-4">{result.isImposterCaught ? '' : ''}</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {winText}
            </h2>
            
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold mb-2">Vote Results</p>
              <div className="space-y-1">
                {voteEntries && voteEntries.length > 0 ? (
                  voteEntries.map(([player, count]) => (
                    <div key={player} className="text-sm">
                      {player}: {String(count)} vote{Number(count) !== 1 ? 's' : ''}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500">No votes recorded</div>
                )}
              </div>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-4 mb-6">
              <p className="text-lg font-bold text-red-600">The IMPOSTER was: {result.imposterName}</p>
              <p className="text-sm mt-1">
                {result.isImposterCaught ? 'Imposter was CAUGHT! Real Players WIN!' : 'Imposter was NOT CAUGHT! Imposter WINS!'}
              </p>
            </div>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => onPlayAgain ? onPlayAgain() : window.location.reload()}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition"
              >
                Play Again
              </button>
              <button
                onClick={onExit}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition"
              >
                Main Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Voting Phase - BOTS MODE
  if (phase === 'voting' && gameMode === 'bots') {
    const roundDescriptions = Array.from({ length: totalRounds }, (_, i) => ({
      round: i + 1,
      descriptions: allDescriptions.filter(d => d.round === i + 1)
    }));

    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Vote for the Imposter</h2>
              
              {gamePlayers.map((player, idx) => (
                <label key={idx} className={`flex items-center p-3 rounded-lg cursor-pointer transition mb-2 ${
                  voteFor === player ? 'bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-500' : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100'
                }`}>
                  <input type="radio" name="vote" value={player} checked={voteFor === player} onChange={() => handleVote(player)} className="mr-3" />
                  <span className="text-gray-900 dark:text-white">{player}</span>
                  {idx === 0 && <span className="text-xs text-gray-500 ml-2">(You)</span>}
                </label>
              ))}
              
              <button onClick={submitVote} disabled={!voteFor} className="w-full py-3 mt-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-500 transition disabled:opacity-50">
                Submit Vote
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">All Descriptions</h3>
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {roundDescriptions.map(({ round, descriptions }) => (
                  <div key={round}>
                    <div className="font-bold text-sm text-gray-700 mb-2">Round {round}</div>
                    {descriptions.map((desc, idx) => (
                      <div key={idx} className="p-2 bg-gray-50 rounded-lg mb-1">
                        <span className="font-semibold">{desc.playerName}:</span> "{desc.description}"
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Voting Phase - LOCAL MODE
  if (phase === 'voting' && gameMode === 'local') {
    const roundDescriptions = Array.from({ length: totalRounds }, (_, i) => ({
      round: i + 1,
      descriptions: allDescriptions.filter(d => d.round === i + 1)
    }));

    if (!showVotingScreen) {
      return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Voting Phase</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Each player will now vote for who they think is the imposter.
                Pass the device to each player.
              </p>
              <button
                onClick={() => setShowVotingScreen(true)}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition"
              >
                Start Voting →
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (showVotingScreen && votingPlayerIndex < gamePlayers.length) {
      const currentVotingPlayer = gamePlayers[votingPlayerIndex];
      
      return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {currentVotingPlayer}'s Vote
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Player {votingPlayerIndex + 1} of {gamePlayers.length}
                </p>
              </div>
              
              <div className="space-y-2 mb-6">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Who do you think is the imposter?
                </p>
                {gamePlayers.map((player, idx) => {
                  if (player === currentVotingPlayer) return null;
                  const isSelected = playerVotes.get(currentVotingPlayer) === player;
                  return (
                    <label
                      key={idx}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition ${
                        isSelected
                          ? 'bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-500'
                          : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`vote-${currentVotingPlayer}`}
                        value={player}
                        checked={isSelected}
                        onChange={() => {
                          const newVotes = new Map(playerVotes);
                          newVotes.set(currentVotingPlayer, player);
                          setPlayerVotes(newVotes);
                        }}
                        className="mr-3"
                      />
                      <span className="text-gray-900 dark:text-white">{player}</span>
                    </label>
                  );
                })}
              </div>
              
              <div className="flex gap-3">
                {votingPlayerIndex > 0 && (
                  <button
                    onClick={() => setVotingPlayerIndex(prev => prev - 1)}
                    className="flex-1 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-400 transition"
                  >
                    Previous
                  </button>
                )}
                <button
                  onClick={() => {
                    if (playerVotes.has(currentVotingPlayer)) {
                      if (votingPlayerIndex + 1 >= gamePlayers.length) {
                        calculateVoteResults();
                      } else {
                        setVotingPlayerIndex(prev => prev + 1);
                      }
                    } else {
                      alert('Please select a vote before proceeding');
                    }
                  }}
                  className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition"
                >
                  {votingPlayerIndex + 1 >= gamePlayers.length ? 'Finish Voting' : 'Next Player →'}
                </button>
              </div>
            </div>
            
            <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-3">All Descriptions</h3>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {roundDescriptions.map(({ round, descriptions }) => (
                  <div key={round}>
                    <div className="font-bold text-sm text-gray-700 mb-1">Round {round}</div>
                    {descriptions.map((desc, idx) => (
                      <div key={idx} className="p-2 bg-gray-50 rounded-lg mb-1">
                        <span className="font-semibold">{desc.playerName}:</span> "{desc.description}"
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // After all votes collected in local mode
    const currentVotes = playerVotes;
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Votes Collected</h2>
              <div className="space-y-3">
                <p className="text-sm text-green-600 mb-2">✓ All votes collected!</p>
                {Array.from(currentVotes.entries()).map(([voter, votedFor]) => (
                  <div key={voter} className="p-2 bg-gray-50 rounded-lg">
                    <span className="font-semibold">{voter}</span> voted for <span className="font-semibold">{votedFor}</span>
                  </div>
                ))}
              </div>
              <button onClick={calculateVoteResults} className="w-full py-3 mt-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-500 transition">
                Reveal Results
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">All Descriptions</h3>
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {roundDescriptions.map(({ round, descriptions }) => (
                  <div key={round}>
                    <div className="font-bold text-sm text-gray-700 mb-2">Round {round}</div>
                    {descriptions.map((desc, idx) => (
                      <div key={idx} className="p-2 bg-gray-50 rounded-lg mb-1">
                        <span className="font-semibold">{desc.playerName}:</span> "{desc.description}"
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Current player's turn
  const currentPlayerName = currentTurnPlayer;
  const isBot = gameMode === 'bots' && currentPlayerIndex > 0;
  const currentCardData = playerCards.get(currentPlayerName);
  const isCurrentPlayerImposter = currentCardData?.cardType === 'imposter';
  const colorIndex = playerColorMap.get(currentPlayerName) || 0;
  const playerColor = playerColors[colorIndex];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="text-center mb-4">
              <div className="text-sm text-gray-500">Round {currentRound} of {totalRounds}</div>
              <div className="text-xl font-bold">{currentPlayerName}'s Turn</div>
              <div className="text-xs text-gray-500">Player {currentPlayerIndex + 1} of {gamePlayers.length}</div>
              {isBot && <div className="mt-2 text-sm text-blue-600 animate-pulse">Bot is thinking...</div>}
            </div>
            
            <TimerBar />
            
            {/* Flip Card */}
            <div className="mb-4 flex justify-center">
              <div 
                className={`relative w-64 h-60 cursor-pointer transition-all duration-500 ${flippedCard ? 'rotate-y-180' : ''}`}
                style={{ transformStyle: 'preserve-3d' }}
                onClick={() => !isBot && setFlippedCard(!flippedCard)}
              >
                <div className={`absolute inset-0 rounded-xl backface-hidden ${flippedCard ? 'invisible' : 'visible'}`}
                     style={{ backfaceVisibility: 'hidden' }}>
                  <div className={`bg-gradient-to-br ${playerColor.back} rounded-xl p-4 shadow-lg w-full h-full flex flex-col items-center justify-center`}>
                    <div className="text-white font-bold text-md text-center">{currentPlayerName}</div>
                    <div className="text-white/70 text-xs mt-2 text-center">Tap to Reveal</div>
                  </div>
                </div>
                
                <div className={`absolute inset-0 rounded-xl backface-hidden ${flippedCard ? 'visible' : 'invisible'}`}
                     style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                  <div className={`rounded-xl p-4 shadow-lg w-full h-full flex flex-col items-center justify-center border-2 ${playerColor.front}`}>
                    <div className={`text-sm font-semibold mb-1 ${playerColor.text}`}>{currentPlayerName}</div>
                    {isCurrentPlayerImposter ? (
                      <>
                        <div className="text-red-600 font-bold mb-1 text-sm">You are the Imposter</div>
                        <div className="text-lg font-bold text-center">{currentCardData?.hint}</div>
                        <div className="text-xs text-gray-500 mt-2 text-center">Describe generically</div>
                      </>
                    ) : (
                      <>
                        <div className="text-green-600 font-bold mb-1 text-sm">Your Card</div>
                        <div className="text-lg font-bold text-center">{currentCardData?.cardName}</div>
                        <div className="text-xs text-gray-500 mt-2 text-center">Don't say the name!</div>
                      </>
                    )}
                    <div className="text-xs text-gray-400 mt-3">Tap to Hide</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Description Input */}
            {!isBot && (
              <>
                <input
                  type="text"
                  value={currentDescription}
                  onChange={(e) => setCurrentDescription(e.target.value)}
                  placeholder={`${currentPlayerName}, enter one word description...`}
                  className="w-full px-3 py-2 border rounded-lg mb-3"
                  onKeyPress={(e) => e.key === 'Enter' && currentDescription.trim() && handleSubmitDescription(currentDescription.trim())}
                  autoFocus
                />
                <button
                  onClick={() => currentDescription.trim() && handleSubmitDescription(currentDescription.trim())}
                  disabled={!currentDescription.trim()}
                  className="w-full py-2 bg-green-600 text-white rounded-lg disabled:opacity-50"
                >
                  Submit Description
                </button>
              </>
            )}
            
            {isBot && (
              <div className="text-center py-4 text-gray-500">
                Bot is thinking...
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-3">Round {currentRound} Descriptions</h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {allDescriptions.filter(d => d.round === currentRound).map((desc, idx) => (
                <div key={idx} className="p-2 bg-gray-50 rounded-lg">
                  <span className="font-semibold">{desc.playerName}:</span> "{desc.description}"
                </div>
              ))}
              {allDescriptions.filter(d => d.round === currentRound).length === 0 && (
                <div className="text-center text-gray-500 py-4">No descriptions yet</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};