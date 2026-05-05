// frontend/src/pages/Games/CricketMastermind/components/ChallengeMode.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Question, Difficulty } from '../types/quiz.types';
import { QuestionCard } from './QuestionCard';
import { ResultScreen } from './ResultScreen';
import { getRandomQuestions } from '../data/questions/allQuestions';

interface ChallengeModeProps {
    category: string;
    difficulty: Difficulty;
    onExit: () => void;
    onUpdateStats: (correct: number, total: number, streak: number, score: number) => void;
}

const TOTAL_QUESTIONS = 20;
const TOTAL_TIME = 120;

export const ChallengeMode: React.FC<ChallengeModeProps> = ({ 
    category, 
    difficulty, 
    onExit, 
    onUpdateStats 
}) => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(TOTAL_TIME);
    const [isGameOver, setIsGameOver] = useState(false);
    const [showResultScreen, setShowResultScreen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [answerResult, setAnswerResult] = useState<{ isCorrect: boolean; show: boolean }>({ isCorrect: false, show: false });
    const [currentHint, setCurrentHint] = useState<string | null>(null);
    const [showHint, setShowHint] = useState(false);
    const [showEndConfirm, setShowEndConfirm] = useState(false);
    
    const [lifelines, setLifelines] = useState({
        fiftyFifty: true,
        skip: true,
        hint: true,
        audio: true
    });

    const timerRef = useRef<number | null>(null);
    const hintTimerRef = useRef<number | null>(null);
    const isMounted = useRef(true);
    const currentQuestionRef = useRef<Question | null>(null);

    const speak = useCallback((text: string) => {
        if (isMuted || !text) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        window.speechSynthesis.speak(utterance);
    }, [isMuted]);

    const clearTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    // Auto-hide hint after 5 seconds
    useEffect(() => {
        if (showHint) {
            if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
            hintTimerRef.current = window.setTimeout(() => {
                setShowHint(false);
                setCurrentHint(null);
            }, 5000);
        }
        return () => {
            if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
        };
    }, [showHint]);

    useEffect(() => {
        isMounted.current = true;
        
        // Get questions based on category
        let allQuestions = getRandomQuestions(TOTAL_QUESTIONS * 2);
        if (category !== 'All-Mode') {
            allQuestions = allQuestions.filter(q => q.category === category);
        }
        setQuestions(allQuestions.slice(0, TOTAL_QUESTIONS));
        
        // Timer countdown
        timerRef.current = window.setInterval(() => {
            if (isMounted.current && !selectedOption && !isGameOver) {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        clearTimer();
                        if (!selectedOption && !isGameOver) {
                            handleTimeout();
                        }
                        return 0;
                    }
                    return prev - 1;
                });
            }
        }, 1000);
        
        return () => {
            isMounted.current = false;
            if (timerRef.current) clearInterval(timerRef.current);
            if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
            window.speechSynthesis.cancel();
        };
    }, []);

    const currentQuestion = questions[currentIndex];
    
    // Update ref when currentQuestion changes
    useEffect(() => {
        currentQuestionRef.current = currentQuestion;
    }, [currentQuestion]);

    const goToNextQuestion = useCallback(() => {
        setAnswerResult({ isCorrect: false, show: false });
        setShowHint(false);
        setCurrentHint(null);
        
        if (currentIndex + 1 >= TOTAL_QUESTIONS) {
            setIsGameOver(true);
            clearTimer();
            setTimeout(() => {
                if (isMounted.current) {
                    setShowResultScreen(true);
                    onUpdateStats(correctAnswers, TOTAL_QUESTIONS, 0, score);
                }
            }, 500);
        } else {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
        }
    }, [currentIndex, correctAnswers, score, onUpdateStats, clearTimer]);

    const handleTimeout = useCallback(() => {
        if (isGameOver || selectedOption) return;
        
        if (!isMuted) speak("Time's up!");
        
        setSelectedOption(null);
        setAnswerResult({ isCorrect: false, show: true });
        
        // Show result briefly then move to next
        setTimeout(() => {
            if (isMounted.current) {
                setAnswerResult({ isCorrect: false, show: false });
                goToNextQuestion();
            }
        }, 500);
    }, [isGameOver, selectedOption, isMuted, goToNextQuestion]);

    const handleAnswer = (answer: string) => {
        if (!currentQuestion || isGameOver || selectedOption) return;
        
        setSelectedOption(answer);
        const isCorrect = answer === currentQuestion.correctAnswer;
        
        if (isCorrect) {
            if (!isMuted) speak("Correct!");
            const points = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 50;
            setScore(prev => prev + points);
            setCorrectAnswers(prev => prev + 1);
        } else {
            if (!isMuted) speak("Wrong answer!");
        }
        
        setAnswerResult({ isCorrect, show: true });
        
        // Show result briefly then move to next question immediately
        setTimeout(() => {
            if (isMounted.current) {
                setAnswerResult({ isCorrect: false, show: false });
                goToNextQuestion();
            }
        }, 500);
    };

    const handleLifeline = (type: 'fiftyFifty' | 'skip' | 'hint' | 'audio') => {
        const question = currentQuestionRef.current;
        if (!question || isGameOver || selectedOption || !lifelines[type]) return;
        
        switch (type) {
            case 'fiftyFifty':
                if (question.type === 'mcq') {
                    const incorrectOptions = question.options.filter((opt: string) => opt !== question.correctAnswer);
                    const toRemove = incorrectOptions.slice(0, 2);
                    const updatedQuestions = [...questions];
                    updatedQuestions[currentIndex] = {
                        ...question,
                        options: question.options.filter((opt: string) => !toRemove.includes(opt))
                    };
                    setQuestions(updatedQuestions);
                }
                break;
            case 'skip':
                goToNextQuestion();
                break;
            case 'hint':
                if (question.hint) {
                    setCurrentHint(question.hint);
                    setShowHint(true);
                    if (!isMuted) speak(question.hint);
                } else {
                    setCurrentHint("No hint available for this question.");
                    setShowHint(true);
                }
                break;
            case 'audio':
                if (question.text) {
                    speak(question.text);
                }
                break;
        }
        setLifelines(prev => ({ ...prev, [type]: false }));
    };

    const toggleMute = () => {
        setIsMuted(prev => {
            if (!prev) window.speechSynthesis.cancel();
            return !prev;
        });
    };

    const handleEndGame = () => {
        clearTimer();
        onExit();
    };

    const handlePlayAgain = () => {
        setShowResultScreen(false);
        window.location.reload();
    };

    if (showResultScreen) {
        const accuracy = TOTAL_QUESTIONS > 0 
            ? Math.round((correctAnswers / TOTAL_QUESTIONS) * 100) 
            : 0;
        const finalScore = score + Math.floor(timeRemaining * 2);
        
        let rank = '';
        let rankColor = '';
        if (finalScore >= 1000) {
            rank = 'Cricket Legend 🏆';
            rankColor = 'text-yellow-600';
        } else if (finalScore >= 750) {
            rank = 'Master Blaster ⭐';
            rankColor = 'text-purple-600';
        } else if (finalScore >= 500) {
            rank = 'Six Hitter 💥';
            rankColor = 'text-blue-600';
        } else if (finalScore >= 250) {
            rank = 'Centurion 🏏';
            rankColor = 'text-green-600';
        } else {
            rank = 'Rising Star 🌟';
            rankColor = 'text-orange-600';
        }
        
        return (
            <ResultScreen
                score={finalScore}
                totalQuestions={TOTAL_QUESTIONS}
                correctAnswers={correctAnswers}
                accuracy={accuracy}
                maxStreak={0}
                rank={rank}
                rankColor={rankColor}
                onPlayAgain={handlePlayAgain}
                onExit={onExit}
            />
        );
    }

    if (!currentQuestion) {
        return (
            <div className="h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-2xl animate-spin mb-2">⏳</div>
                    <div className="text-sm text-gray-500">Loading...</div>
                </div>
            </div>
        );
    }

    const progress = ((currentIndex + 1) / TOTAL_QUESTIONS) * 100;

    return (
        <div className="h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
            {/* Top Bar */}
            <div className="flex justify-between items-center px-4 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <button
                        onClick={onExit}
                        className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
                    >
                        ← Exit
                    </button>
                    <button
                        onClick={() => setShowEndConfirm(true)}
                        className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-500 transition"
                    >
                        🛑 End Game
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleMute}
                        className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
                    >
                        {isMuted ? '🔇 Unmute' : '🔊 Mute'}
                    </button>
                    <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                        {category} • {difficulty.toUpperCase()} • Challenge
                    </span>
                </div>
            </div>

            {/* End Game Confirmation Modal */}
            {showEndConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-5 max-w-sm mx-4 shadow-xl">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">End Game?</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Your progress will be lost. Are you sure you want to end the game?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={handleEndGame}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-500 transition"
                            >
                                Yes, End Game
                            </button>
                            <button
                                onClick={() => setShowEndConfirm(false)}
                                className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-medium hover:bg-gray-400 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Hint Display */}
            {showHint && currentHint && (
                <div className="mx-auto max-w-6xl w-full px-4 pt-2">
                    <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-2">
                        <div className="flex items-start gap-2">
                            <span className="text-yellow-600 dark:text-yellow-400 text-lg">💡</span>
                            <div className="flex-1">
                                <div className="text-xs font-semibold text-yellow-700 dark:text-yellow-400">HINT</div>
                                <div className="text-sm text-gray-700 dark:text-gray-300">{currentHint}</div>
                            </div>
                            <button
                                onClick={() => {
                                    setShowHint(false);
                                    setCurrentHint(null);
                                    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
                                }}
                                className="text-gray-400 hover:text-gray-600 text-sm"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Answer Result Toast - shows briefly then disappears */}
            {answerResult.show && (
                <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-full text-white text-sm font-bold ${
                    answerResult.isCorrect ? 'bg-green-500' : 'bg-red-500'
                } animate-bounce shadow-lg`}>
                    {answerResult.isCorrect ? '✓ Correct!' : '✗ Wrong!'}
                </div>
            )}

            {/* Progress Bar */}
            <div className="px-4 pt-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Question {currentIndex + 1} of {TOTAL_QUESTIONS}</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600 transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
            </div>

            {/* Main Content - Side by Side Layout */}
            <div className="flex-1 flex max-w-6xl mx-auto w-full px-4 py-4 gap-4">
                {/* Left Column - Question */}
                <div className="flex-1">
                    <QuestionCard
                        question={currentQuestion}
                        onAnswer={handleAnswer}
                        selectedOption={selectedOption}
                        timeRemaining={timeRemaining}
                    />
                </div>

                {/* Right Column - Stats & Lifelines */}
                <div className="w-80 flex flex-col gap-3">
                    {/* Score Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">{score}</div>
                            <div className="text-xs text-gray-500">Score</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <div className="text-center">
                                <div className="text-sm font-bold text-green-600">{correctAnswers}</div>
                                <div className="text-[9px] text-gray-500">Correct</div>
                            </div>
                            <div className="text-center">
                                <div className="text-sm font-bold text-blue-600">{currentIndex + 1}</div>
                                <div className="text-[9px] text-gray-500">Questions</div>
                            </div>
                        </div>
                    </div>

                    {/* Timer Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>⏱️ Time Remaining</span>
                            <span className={timeRemaining <= 30 ? 'text-red-500 font-bold animate-pulse' : 'text-green-600'}>
                                {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                            </span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-green-500 transition-all duration-1000"
                                style={{ width: `${(timeRemaining / TOTAL_TIME) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Lifelines Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                        <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Lifelines</div>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => handleLifeline('fiftyFifty')}
                                disabled={!lifelines.fiftyFifty}
                                className={`py-2 rounded-lg text-sm font-medium transition ${
                                    lifelines.fiftyFifty
                                        ? 'bg-purple-600 text-white hover:bg-purple-500 cursor-pointer' 
                                        : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                50-50
                            </button>
                            <button
                                onClick={() => handleLifeline('skip')}
                                disabled={!lifelines.skip}
                                className={`py-2 rounded-lg text-sm font-medium transition ${
                                    lifelines.skip
                                        ? 'bg-blue-600 text-white hover:bg-blue-500 cursor-pointer' 
                                        : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                Skip
                            </button>
                            <button
                                onClick={() => handleLifeline('hint')}
                                disabled={!lifelines.hint}
                                className={`py-2 rounded-lg text-sm font-medium transition ${
                                    lifelines.hint
                                        ? 'bg-yellow-600 text-white hover:bg-yellow-500 cursor-pointer' 
                                        : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                Hint
                            </button>
                            <button
                                onClick={() => handleLifeline('audio')}
                                disabled={!lifelines.audio}
                                className={`py-2 rounded-lg text-sm font-medium transition ${
                                    lifelines.audio
                                        ? 'bg-green-600 text-white hover:bg-green-500 cursor-pointer' 
                                        : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                Audio
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};