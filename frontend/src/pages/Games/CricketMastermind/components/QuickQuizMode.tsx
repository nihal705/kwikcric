// frontend/src/pages/Games/CricketMastermind/components/QuickQuizMode.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Question, Difficulty } from '../types/quiz.types';
import { QuestionCard } from './QuestionCard';
import { ResultScreen } from './ResultScreen';
import { QuestionSelector } from '../logic/questionSelector';
import { calculatePoints, calculateStreak, calculateRank } from '../logic/pointsCalculator';

interface QuickQuizModeProps {
    category: string;
    difficulty: Difficulty;
    onExit: () => void;
    onUpdateStats: (correct: number, total: number, streak: number, score: number) => void;
}

export const QuickQuizMode: React.FC<QuickQuizModeProps> = ({ 
    category, 
    difficulty, 
    onExit, 
    onUpdateStats 
}) => {
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [maxStreak, setMaxStreak] = useState(0);
    const [lives, setLives] = useState(3);
    const [questionsAnswered, setQuestionsAnswered] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [timeLeft, setTimeLeft] = useState(difficulty === 'easy' ? 30 : difficulty === 'medium' ? 20 : 15);
    const [isGameOver, setIsGameOver] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [answerResult, setAnswerResult] = useState<{ isCorrect: boolean; show: boolean }>({ isCorrect: false, show: false });
    const [isWaiting, setIsWaiting] = useState(false);
    const [showEndConfirm, setShowEndConfirm] = useState(false);
    const [currentHint, setCurrentHint] = useState<string | null>(null);
    const [showHint, setShowHint] = useState(false);
    
    const [lifelines, setLifelines] = useState({
        fiftyFifty: true,
        skip: true,
        hint: true,
        audio: true
    });
    
    const questionSelector = useRef(new QuestionSelector(category, difficulty));
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const waitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isMounted = useRef(true);
    const currentQuestionRef = useRef<Question | null>(null);

    // Update ref when currentQuestion changes
    useEffect(() => {
        currentQuestionRef.current = currentQuestion;
    }, [currentQuestion]);

    // Auto-hide hint after 5 seconds
    useEffect(() => {
        if (showHint) {
            if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
            hintTimerRef.current = setTimeout(() => {
                setShowHint(false);
                setCurrentHint(null);
            }, 5000);
        }
        return () => {
            if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
        };
    }, [showHint]);

    // Load saved game on mount
    useEffect(() => {
        const saved = localStorage.getItem('quiz_quick_save');
        if (saved) {
            const state = JSON.parse(saved);
            if (Date.now() - state.timestamp < 3600000 && state.currentQuestion) {
                setCurrentQuestion(state.currentQuestion);
                setScore(state.score || 0);
                setStreak(state.streak || 0);
                setMaxStreak(state.maxStreak || 0);
                setLives(state.lives || 3);
                setQuestionsAnswered(state.questionsAnswered || 0);
                setCorrectAnswers(state.correctAnswers || 0);
                if (state.lifelines) setLifelines(state.lifelines);
                startTimer();
                return;
            }
        }
        loadNextQuestion();
        
        return () => {
            isMounted.current = false;
            if (timerRef.current) clearInterval(timerRef.current);
            if (waitTimerRef.current) clearTimeout(waitTimerRef.current);
            if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
            window.speechSynthesis.cancel();
        };
    }, []);

    // Save game state
    useEffect(() => {
        if (currentQuestion && !isGameOver && !showResult && questionsAnswered > 0) {
            const saveTimeout = setTimeout(() => {
                localStorage.setItem('quiz_quick_save', JSON.stringify({
                    currentQuestion,
                    score,
                    streak,
                    maxStreak,
                    lives,
                    questionsAnswered,
                    correctAnswers,
                    lifelines,
                    timestamp: Date.now()
                }));
            }, 500);
            return () => clearTimeout(saveTimeout);
        }
    }, [currentQuestion, score, streak, maxStreak, lives, questionsAnswered, correctAnswers, isGameOver, showResult, lifelines]);

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

    const clearWaitTimer = useCallback(() => {
        if (waitTimerRef.current) {
            clearTimeout(waitTimerRef.current);
            waitTimerRef.current = null;
        }
    }, []);

    const startTimer = useCallback(() => {
        clearTimer();
        const totalTime = difficulty === 'easy' ? 30 : difficulty === 'medium' ? 20 : 15;
        setTimeLeft(totalTime);
        
        timerRef.current = setInterval(() => {
            if (isMounted.current && !selectedOption && !isGameOver && !isProcessing && !isWaiting) {
                setTimeLeft(prev => {
                    const newTime = prev - 1;
                    if (newTime <= 0) {
                        clearTimer();
                        if (!selectedOption && !isProcessing && !isGameOver && !isWaiting) {
                            handleTimeout();
                        }
                        return 0;
                    }
                    return newTime;
                });
            }
        }, 1000);
    }, [difficulty, selectedOption, isGameOver, isProcessing, isWaiting]);

    const stopTimer = useCallback(() => {
        clearTimer();
    }, [clearTimer]);

    const loadNextQuestion = useCallback(() => {
        clearWaitTimer();
        setAnswerResult({ isCorrect: false, show: false });
        setIsWaiting(false);
        setShowHint(false);
        setCurrentHint(null);
        setSelectedOption(null);
        
        const nextQuestion = questionSelector.current.getNextQuestion();
        if (nextQuestion) {
            setCurrentQuestion(nextQuestion);
            setIsProcessing(false);
            startTimer();
        } else {
            setIsGameOver(true);
            setShowResult(true);
            onUpdateStats(correctAnswers, questionsAnswered, maxStreak, score);
            localStorage.removeItem('quiz_quick_save');
        }
    }, [correctAnswers, questionsAnswered, maxStreak, score, onUpdateStats, startTimer, clearWaitTimer]);

    const goToNextQuestion = useCallback(() => {
        clearWaitTimer();
        setAnswerResult({ isCorrect: false, show: false });
        setIsWaiting(false);
        setShowHint(false);
        setCurrentHint(null);
        setSelectedOption(null);
        setIsProcessing(false);
        
        const nextQuestion = questionSelector.current.getNextQuestion();
        if (nextQuestion) {
            setCurrentQuestion(nextQuestion);
            startTimer();
        } else {
            setIsGameOver(true);
            setShowResult(true);
            onUpdateStats(correctAnswers, questionsAnswered, maxStreak, score);
            localStorage.removeItem('quiz_quick_save');
        }
    }, [correctAnswers, questionsAnswered, maxStreak, score, onUpdateStats, startTimer, clearWaitTimer]);

    const handleTimeout = useCallback(() => {
        if (isGameOver || selectedOption || isProcessing || isWaiting) return;
        
        stopTimer();
        
        if (!isMuted) speak("Time's up!");
        
        const newLives = lives - 1;
        setStreak(0);
        setLives(newLives);
        setQuestionsAnswered(prev => prev + 1);
        setAnswerResult({ isCorrect: false, show: true });
        
        if (newLives <= 0) {
            setIsGameOver(true);
            setTimeout(() => {
                if (isMounted.current) {
                    setShowResult(true);
                    onUpdateStats(correctAnswers, questionsAnswered, maxStreak, score);
                    localStorage.removeItem('quiz_quick_save');
                }
            }, 1500);
        } else {
            setIsWaiting(true);
            // Wait 4 seconds before moving to next question
            waitTimerRef.current = setTimeout(() => {
                if (isMounted.current) {
                    goToNextQuestion();
                }
            }, 4000);
        }
    }, [isGameOver, selectedOption, isProcessing, isWaiting, isMuted, lives, stopTimer, correctAnswers, questionsAnswered, maxStreak, score, onUpdateStats, goToNextQuestion]);

    const handleAnswer = useCallback((answer: string) => {
        if (!currentQuestion || isGameOver || selectedOption || isProcessing || isWaiting) return;
        
        setIsProcessing(true);
        setSelectedOption(answer);
        stopTimer();
        
        const isCorrect = answer === currentQuestion.correctAnswer;
        
        if (isCorrect) {
            if (!isMuted) speak("Correct!");
            const points = calculatePoints(difficulty, streak, timeLeft, difficulty === 'easy' ? 30 : difficulty === 'medium' ? 20 : 15, true);
            const newStreak = calculateStreak(streak, true);
            
            setScore(prev => prev + points);
            setStreak(newStreak);
            setMaxStreak(prev => Math.max(prev, newStreak));
            setQuestionsAnswered(prev => prev + 1);
            setCorrectAnswers(prev => prev + 1);
        } else {
            if (!isMuted) speak("Wrong answer!");
            const newStreak = calculateStreak(streak, false);
            const newLives = lives - 1;
            
            setStreak(newStreak);
            setLives(newLives);
            setQuestionsAnswered(prev => prev + 1);
            
            if (newLives <= 0) {
                setIsGameOver(true);
                setTimeout(() => {
                    if (isMounted.current) {
                        setShowResult(true);
                        onUpdateStats(correctAnswers, questionsAnswered, maxStreak, score);
                        localStorage.removeItem('quiz_quick_save');
                    }
                }, 1500);
                setIsProcessing(false);
                return;
            }
        }
        
        setAnswerResult({ isCorrect, show: true });
        setIsProcessing(false);
        setIsWaiting(true);
        
        // Wait 4 seconds before moving to next question
        waitTimerRef.current = setTimeout(() => {
            if (isMounted.current && !isGameOver) {
                goToNextQuestion();
            }
        }, 4000);
    }, [currentQuestion, isGameOver, selectedOption, isProcessing, isWaiting, isMuted, difficulty, streak, timeLeft, lives, correctAnswers, questionsAnswered, maxStreak, score, onUpdateStats, stopTimer, goToNextQuestion]);

    const handleLifeline = useCallback((type: 'fiftyFifty' | 'skip' | 'hint' | 'audio') => {
        const question = currentQuestionRef.current;
        if (!question || isGameOver || isProcessing || isWaiting || selectedOption || !lifelines[type]) return;
        
        switch (type) {
            case 'fiftyFifty':
                if (question.type === 'mcq') {
                    const incorrectOptions = question.options.filter(opt => opt !== question.correctAnswer);
                    const toRemove = incorrectOptions.slice(0, 2);
                    setCurrentQuestion({
                        ...question,
                        options: question.options.filter(opt => !toRemove.includes(opt))
                    });
                }
                break;
            case 'skip':
                stopTimer();
                clearWaitTimer();
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
    }, [isGameOver, isProcessing, isWaiting, selectedOption, lifelines, isMuted, stopTimer, clearWaitTimer, goToNextQuestion]);

    const toggleMute = useCallback(() => {
        setIsMuted(prev => {
            if (!prev) window.speechSynthesis.cancel();
            return !prev;
        });
    }, []);

    const handleEndGame = useCallback(() => {
        clearTimer();
        clearWaitTimer();
        localStorage.removeItem('quiz_quick_save');
        onExit();
    }, [onExit, clearTimer, clearWaitTimer]);

    const handlePlayAgain = useCallback(() => {
        setShowResult(false);
        setScore(0);
        setStreak(0);
        setMaxStreak(0);
        setLives(3);
        setQuestionsAnswered(0);
        setCorrectAnswers(0);
        setIsGameOver(false);
        setSelectedOption(null);
        setIsProcessing(false);
        setIsWaiting(false);
        setAnswerResult({ isCorrect: false, show: false });
        setShowHint(false);
        setCurrentHint(null);
        setLifelines({ fiftyFifty: true, skip: true, hint: true, audio: true });
        questionSelector.current = new QuestionSelector(category, difficulty);
        localStorage.removeItem('quiz_quick_save');
        loadNextQuestion();
    }, [category, loadNextQuestion]);

    if (showResult) {
        const accuracy = questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0;
        const rank = calculateRank(score);
        
        return (
            <ResultScreen
                score={score}
                totalQuestions={questionsAnswered}
                correctAnswers={correctAnswers}
                accuracy={accuracy}
                maxStreak={maxStreak}
                rank={rank.rank}
                rankColor={rank.color}
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

    const totalTime = difficulty === 'easy' ? 30 : difficulty === 'medium' ? 20 : 15;
    const timerPercentage = (timeLeft / totalTime) * 100;
    const timerColor = timerPercentage > 60 ? 'bg-green-500' : timerPercentage > 30 ? 'bg-yellow-500' : 'bg-red-500';

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
                        {category} • {difficulty.toUpperCase()}
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

            {/* Answer Result Toast */}
            {answerResult.show && (
                <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-full text-white text-sm font-bold ${
                    answerResult.isCorrect ? 'bg-green-500' : 'bg-red-500'
                } animate-bounce shadow-lg`}>
                    {answerResult.isCorrect ? '✓ Correct!' : '✗ Wrong!'}
                    {isWaiting && <span className="ml-2 text-xs">Next in 4s...</span>}
                </div>
            )}

            {/* Waiting Indicator */}
            {isWaiting && !answerResult.show && (
                <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-blue-500 text-white text-sm font-bold shadow-lg animate-pulse">
                    ⏳ Next question in 4 seconds...
                </div>
            )}

            {/* Main Content - Side by Side Layout */}
            <div className="flex-1 flex max-w-6xl mx-auto w-full px-4 py-4 gap-4">
                {/* Left Column - Question */}
                <div className="flex-1">
                    <QuestionCard
                        question={currentQuestion}
                        onAnswer={handleAnswer}
                        selectedOption={selectedOption}
                        timeRemaining={timeLeft}
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
                        <div className="grid grid-cols-3 gap-2 mt-2">
                            <div className="text-center">
                                <div className="text-sm font-bold text-orange-600">🔥 {streak}</div>
                                <div className="text-[9px] text-gray-500">Streak</div>
                            </div>
                            <div className="text-center">
                                <div className="text-sm font-bold text-red-500">{lives} ❤️</div>
                                <div className="text-[9px] text-gray-500">Lives</div>
                            </div>
                            <div className="text-center">
                                <div className="text-sm font-bold text-blue-600">{questionsAnswered}</div>
                                <div className="text-[9px] text-gray-500">Questions</div>
                            </div>
                        </div>
                    </div>

                    {/* Timer Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>⏱️ Time</span>
                            <span className={timeLeft <= 5 ? 'text-red-500 font-bold animate-pulse' : ''}>
                                {timeLeft}s
                            </span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                                className={`h-full ${timerColor} transition-all duration-1000 rounded-full`}
                                style={{ width: `${timerPercentage}%` }}
                            />
                        </div>
                    </div>

                    {/* Lifelines Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                        <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Lifelines</div>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => handleLifeline('fiftyFifty')}
                                disabled={!lifelines.fiftyFifty || isWaiting}
                                className={`py-2 rounded-lg text-sm font-medium transition ${
                                    lifelines.fiftyFifty && !isWaiting
                                        ? 'bg-purple-600 text-white hover:bg-purple-500 cursor-pointer' 
                                        : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                50-50
                            </button>
                            <button
                                onClick={() => handleLifeline('skip')}
                                disabled={!lifelines.skip || isWaiting}
                                className={`py-2 rounded-lg text-sm font-medium transition ${
                                    lifelines.skip && !isWaiting
                                        ? 'bg-blue-600 text-white hover:bg-blue-500 cursor-pointer' 
                                        : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                Skip
                            </button>
                            <button
                                onClick={() => handleLifeline('hint')}
                                disabled={!lifelines.hint || isWaiting}
                                className={`py-2 rounded-lg text-sm font-medium transition ${
                                    lifelines.hint && !isWaiting
                                        ? 'bg-yellow-600 text-white hover:bg-yellow-500 cursor-pointer' 
                                        : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                Hint
                            </button>
                            <button
                                onClick={() => handleLifeline('audio')}
                                disabled={!lifelines.audio || isWaiting}
                                className={`py-2 rounded-lg text-sm font-medium transition ${
                                    lifelines.audio && !isWaiting
                                        ? 'bg-green-600 text-white hover:bg-green-500 cursor-pointer' 
                                        : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                Audio
                            </button>
                        </div>
                    </div>

                    {/* Lives Status */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-2 text-center border border-gray-200 dark:border-gray-700">
                        <div className="text-xs text-gray-500">Lives</div>
                        <div className="text-lg">
                            {Array(lives).fill(0).map((_, i) => (
                                <span key={i} className="text-red-500 text-xl mx-0.5">❤️</span>
                            ))}
                            {Array(3 - lives).fill(0).map((_, i) => (
                                <span key={i} className="text-gray-300 dark:text-gray-600 text-xl mx-0.5">🖤</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};