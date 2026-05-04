// frontend/src/pages/Games/CricketMastermind/components/ChallengeMode.tsx
import React, { useState, useEffect } from 'react';
import { Question, Difficulty } from '../types/quiz.types';
import { QuestionCard } from './QuestionCard';
import { Timer as CountdownTimer } from './Timer';
import { ResultScreen } from './ResultScreen';
import { getRandomQuestions } from '../data/questions';
import { calculatePoints, calculateRank } from '../logic/pointsCalculator';
import { AudioManager } from '../logic/audioManager';

interface ChallengeModeProps {
    category: string;
    difficulty: Difficulty;
    onExit: () => void;
}

const TOTAL_QUESTIONS = 20;
const TOTAL_TIME = 120;

export const ChallengeMode: React.FC<ChallengeModeProps> = ({ category, difficulty, onExit }) => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(TOTAL_TIME);
    const [isGameOver, setIsGameOver] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    
    const audioManager = new AudioManager();

    useEffect(() => {
        // Get questions based on category
        let allQuestions = getRandomQuestions(TOTAL_QUESTIONS * 2);
        if (category !== 'All-Mode') {
            allQuestions = allQuestions.filter(q => q.category === category);
        }
        setQuestions(allQuestions.slice(0, TOTAL_QUESTIONS));
        
        // Timer countdown
        const timer = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setIsGameOver(true);
                    setShowResult(true);
                    audioManager.timeoutSound();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        
        return () => clearInterval(timer);
    }, []);

    const currentQuestion = questions[currentIndex];

    const handleAnswer = (answer: string) => {
        if (!currentQuestion || isGameOver || selectedOption) return;
        
        setSelectedOption(answer);
        const isCorrect = answer === currentQuestion.correctAnswer;
        
        if (isCorrect) {
            audioManager.correctSound();
            const points = calculatePoints(difficulty, 0, TOTAL_TIME, TOTAL_TIME, true);
            setScore(prev => prev + points);
            setCorrectAnswers(prev => prev + 1);
        } else {
            audioManager.wrongSound();
        }
        
        if (currentIndex + 1 >= TOTAL_QUESTIONS) {
            setIsGameOver(true);
            setTimeout(() => {
                audioManager.victorySound();
                setShowResult(true);
            }, 1000);
        } else {
            setTimeout(() => {
                setCurrentIndex(prev => prev + 1);
                setSelectedOption(null);
            }, 1000);
        }
    };

    const handlePlayAgain = () => {
        window.location.reload();
    };

    if (showResult) {
        const accuracy = TOTAL_QUESTIONS > 0 
            ? Math.round((correctAnswers / TOTAL_QUESTIONS) * 100) 
            : 0;
        const rank = calculateRank(score);
        
        // Add time bonus to score
        const finalScore = score + (timeRemaining * 2);
        
        return (
            <ResultScreen
                score={finalScore}
                totalQuestions={TOTAL_QUESTIONS}
                correctAnswers={correctAnswers}
                accuracy={accuracy}
                maxStreak={0}
                rank={rank.rank}
                rankColor={rank.color}
                onPlayAgain={handlePlayAgain}
                onExit={onExit}
            />
        );
    }

    if (!currentQuestion) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-3xl animate-spin mb-2">⏳</div>
                    <div className="text-gray-500">Loading...</div>
                </div>
            </div>
        );
    }

    const progress = ((currentIndex + 1) / TOTAL_QUESTIONS) * 100;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6">
            <div className="max-w-3xl mx-auto px-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={onExit}
                        className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                        ← Exit
                    </button>
                    <div className="text-center">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                            Challenge Mode
                        </div>
                        <div className="text-xs text-gray-500">{category}</div>
                    </div>
                    <div className="text-sm font-semibold text-purple-600">
                        {score} pts
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Question {currentIndex + 1} of {TOTAL_QUESTIONS}</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-purple-600 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Timer */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 mb-4 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-500">Time Remaining</div>
                    <div className={`text-2xl font-bold ${timeRemaining <= 30 ? 'text-red-500 animate-pulse' : 'text-green-600'}`}>
                        {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                    </div>
                </div>

                {/* Question Card */}
                <QuestionCard
                    question={currentQuestion}
                    onAnswer={handleAnswer}
                    selectedOption={selectedOption}
                    timeRemaining={timeRemaining}
                />
            </div>
        </div>
    );
};