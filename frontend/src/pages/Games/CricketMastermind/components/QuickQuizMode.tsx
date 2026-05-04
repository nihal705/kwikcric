// frontend/src/pages/Games/CricketMastermind/components/QuickQuizMode.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Question, Difficulty, QuizState } from '../types/quiz.types';
import { QuestionCard } from './QuestionCard';
import { Timer } from './Timer';
import { ScoreBoard } from './ScoreBoard';
import { LifelinesBar } from './LifelinesBar';
import { ResultScreen } from './ResultScreen';
import { QuestionSelector } from '../logic/questionSelector';
import { calculatePoints, calculateStreak, calculateRank } from '../logic/pointsCalculator';
import { AudioManager } from '../logic/audioManager';
import { motion } from 'framer-motion';

interface QuickQuizModeProps {
    category: string;
    difficulty: Difficulty;
    onExit: () => void;
}

export const QuickQuizMode: React.FC<QuickQuizModeProps> = ({ category, difficulty, onExit }) => {
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [quizState, setQuizState] = useState<QuizState>({
        mode: 'quick',
        category,
        difficulty,
        score: 0,
        streak: 0,
        lives: 3,
        currentQuestionIndex: 0,
        questionsAnswered: 0,
        correctAnswers: 0,
        maxStreak: 0,
        timeRemaining: difficulty === 'easy' ? 30 : difficulty === 'medium' ? 20 : 15,
        isGameOver: false,
        isPaused: false,
        lifelines: {
            fiftyFifty: true,
            skip: true,
            hint: true,
            audio: true
        }
    });
    const [isLoading, setIsLoading] = useState(true);
    const [showResult, setShowResult] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    
    const questionSelector = new QuestionSelector(category, difficulty);
    const audioManager = new AudioManager();

    const loadNextQuestion = useCallback(() => {
        const nextQuestion = questionSelector.getNextQuestion();
        if (nextQuestion) {
            setCurrentQuestion(nextQuestion);
            setSelectedOption(null);
            setQuizState(prev => ({
                ...prev,
                timeRemaining: difficulty === 'easy' ? 30 : difficulty === 'medium' ? 20 : 15,
                isPaused: false
            }));
        } else {
            // No more questions - game ends
            setQuizState(prev => ({ ...prev, isGameOver: true }));
        }
        setIsLoading(false);
    }, [difficulty]);

    useEffect(() => {
        loadNextQuestion();
        return () => audioManager.stop();
    }, []);

    const handleAnswer = (answer: string) => {
        if (!currentQuestion || quizState.isGameOver || selectedOption) return;
        
        setSelectedOption(answer);
        const isCorrect = answer === currentQuestion.correctAnswer;
        
        if (isCorrect) {
            audioManager.correctSound();
            const points = calculatePoints(
                difficulty,
                quizState.streak,
                quizState.timeRemaining,
                difficulty === 'easy' ? 30 : difficulty === 'medium' ? 20 : 15,
                true
            );
            const newStreak = calculateStreak(quizState.streak, true);
            
            setQuizState(prev => ({
                ...prev,
                score: prev.score + points,
                streak: newStreak,
                maxStreak: Math.max(prev.maxStreak, newStreak),
                questionsAnswered: prev.questionsAnswered + 1,
                correctAnswers: prev.correctAnswers + 1,
            }));
        } else {
            audioManager.wrongSound();
            const newStreak = calculateStreak(quizState.streak, false);
            const newLives = quizState.lives - 1;
            
            setQuizState(prev => ({
                ...prev,
                streak: newStreak,
                lives: newLives,
                questionsAnswered: prev.questionsAnswered + 1,
            }));
            
            if (newLives <= 0) {
                audioManager.timeoutSound();
                setQuizState(prev => ({ ...prev, isGameOver: true }));
                setTimeout(() => {
                    audioManager.victorySound();
                    setShowResult(true);
                }, 1000);
                return;
            }
        }
        
        // Load next question after delay
        setTimeout(() => {
            loadNextQuestion();
        }, 1000);
    };

    const handleTimeout = () => {
        if (quizState.isGameOver || selectedOption) return;
        
        audioManager.timeoutSound();
        const newLives = quizState.lives - 1;
        
        setQuizState(prev => ({
            ...prev,
            streak: 0,
            lives: newLives,
            questionsAnswered: prev.questionsAnswered + 1,
        }));
        
        if (newLives <= 0) {
            setQuizState(prev => ({ ...prev, isGameOver: true }));
            setTimeout(() => {
                audioManager.victorySound();
                setShowResult(true);
            }, 1000);
        } else {
            setTimeout(() => {
                loadNextQuestion();
            }, 1000);
        }
    };

    const handleLifeline = (type: 'fiftyFifty' | 'skip' | 'hint' | 'audio') => {
        if (!currentQuestion || quizState.isGameOver || !quizState.lifelines[type]) return;
        
        switch (type) {
            case 'fiftyFifty':
                if (currentQuestion.type === 'mcq') {
                    // Remove two incorrect options
                    const incorrectOptions = currentQuestion.options.filter(
                        opt => opt !== currentQuestion.correctAnswer
                    );
                    const toRemove = incorrectOptions.slice(0, 2);
                    setCurrentQuestion({
                        ...currentQuestion,
                        options: currentQuestion.options.filter(opt => !toRemove.includes(opt))
                    });
                }
                break;
            case 'skip':
                loadNextQuestion();
                break;
            case 'hint':
                if (currentQuestion.hint) {
                    alert(`💡 HINT: ${currentQuestion.hint}`);
                }
                break;
            case 'audio':
                audioManager.speak(currentQuestion.text);
                break;
        }
        
        setQuizState(prev => ({
            ...prev,
            lifelines: { ...prev.lifelines, [type]: false }
        }));
    };

    const handlePlayAgain = () => {
        setShowResult(false);
        setQuizState(prev => ({
            ...prev,
            score: 0,
            streak: 0,
            lives: 3,
            questionsAnswered: 0,
            correctAnswers: 0,
            maxStreak: 0,
            isGameOver: false,
            lifelines: {
                fiftyFifty: true,
                skip: true,
                hint: true,
                audio: true
            }
        }));
        loadNextQuestion();
    };

    if (showResult) {
        const accuracy = quizState.questionsAnswered > 0 
            ? Math.round((quizState.correctAnswers / quizState.questionsAnswered) * 100) 
            : 0;
        const rank = calculateRank(quizState.score);
        
        return (
            <ResultScreen
                score={quizState.score}
                totalQuestions={quizState.questionsAnswered}
                correctAnswers={quizState.correctAnswers}
                accuracy={accuracy}
                maxStreak={quizState.maxStreak}
                rank={rank.rank}
                rankColor={rank.color}
                onPlayAgain={handlePlayAgain}
                onExit={onExit}
            />
        );
    }

    if (isLoading || !currentQuestion) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-3xl animate-spin mb-2">⏳</div>
                    <div className="text-gray-500">Loading question...</div>
                </div>
            </div>
        );
    }

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
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        {category} • {difficulty.toUpperCase()}
                    </div>
                </div>

                {/* Score Board */}
                <ScoreBoard
                    score={quizState.score}
                    streak={quizState.streak}
                    lives={quizState.lives}
                    questionsAnswered={quizState.questionsAnswered}
                />

                {/* Question Card */}
                <QuestionCard
                    question={currentQuestion}
                    onAnswer={handleAnswer}
                    selectedOption={selectedOption}
                    timeRemaining={quizState.timeRemaining}
                />

                {/* Timer */}
                <Timer
                    timeRemaining={quizState.timeRemaining}
                    totalTime={difficulty === 'easy' ? 30 : difficulty === 'medium' ? 20 : 15}
                    onTimeout={handleTimeout}
                    isActive={!quizState.isGameOver && !selectedOption}
                />

                {/* Lifelines */}
                <LifelinesBar
                    lifelines={quizState.lifelines}
                    onUseLifeline={handleLifeline}
                />
            </div>
        </div>
    );
};