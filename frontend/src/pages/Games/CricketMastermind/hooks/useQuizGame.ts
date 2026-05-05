// frontend/src/pages/Games/CricketMastermind/hooks/useQuizGame.ts
import { useState, useCallback, useEffect, useRef } from 'react';
import { Question, Difficulty, GameMode, QuizState } from '../types/quiz.types';
import { QuestionSelector } from '../logic/questionSelector';
import { calculatePoints, calculateStreak } from '../logic/pointsCalculator';
import { audioManager } from '../logic/audioManager';

interface UseQuizGameProps {
    category: string;
    difficulty: Difficulty;
    mode: GameMode;
    onGameEnd?: (score: number, correctAnswers: number, totalQuestions: number) => void;
}

export const useQuizGame = ({ category, difficulty, mode, onGameEnd }: UseQuizGameProps) => {
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [quizState, setQuizState] = useState<QuizState>({
        mode,
        category,
        difficulty,
        score: 0,
        streak: 0,
        lives: mode === 'quick' ? 3 : 0,
        currentQuestionIndex: 0,
        questionsAnswered: 0,
        correctAnswers: 0,
        maxStreak: 0,
        timeRemaining: 0,
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
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    
    const questionSelectorRef = useRef<QuestionSelector | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Initialize question selector
    useEffect(() => {
        questionSelectorRef.current = new QuestionSelector(category, difficulty);
        loadNextQuestion();
        
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            audioManager.stop();
        };
    }, []);

    const loadNextQuestion = useCallback(() => {
        const nextQuestion = questionSelectorRef.current?.getNextQuestion();
        if (nextQuestion) {
            setCurrentQuestion(nextQuestion);
            setSelectedOption(null);
            setQuizState(prev => ({
                ...prev,
                timeRemaining: difficulty === 'easy' ? 30 : difficulty === 'medium' ? 20 : 15,
                isPaused: false
            }));
            setIsLoading(false);
            
            // Start timer for challenge mode
            if (mode === 'challenge' && timerRef.current) {
                clearInterval(timerRef.current);
            }
        } else if (mode !== 'quick') {
            // No more questions - game ends
            setQuizState(prev => ({ ...prev, isGameOver: true }));
            setShowResult(true);
            onGameEnd?.(quizState.score, quizState.correctAnswers, quizState.questionsAnswered);
        }
    }, [difficulty, mode, quizState.score, quizState.correctAnswers, quizState.questionsAnswered]);

    const handleAnswer = useCallback((answer: string) => {
        if (!currentQuestion || quizState.isGameOver || selectedOption) return;
        
        setSelectedOption(answer);
        const isCorrect = answer === currentQuestion.correctAnswer;
        
        if (isCorrect) {
            audioManager.playCorrectSound();
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
            audioManager.playWrongSound();
            const newStreak = calculateStreak(quizState.streak, false);
            const newLives = mode === 'quick' ? quizState.lives - 1 : quizState.lives;
            
            setQuizState(prev => ({
                ...prev,
                streak: newStreak,
                lives: newLives,
                questionsAnswered: prev.questionsAnswered + 1,
            }));
            
            if (mode === 'quick' && newLives <= 0) {
                audioManager.playTimeoutSound();
                setQuizState(prev => ({ ...prev, isGameOver: true }));
                setTimeout(() => {
                    audioManager.playVictorySound();
                    setShowResult(true);
                    onGameEnd?.(quizState.score, quizState.correctAnswers, quizState.questionsAnswered + 1);
                }, 1000);
                return;
            }
        }
        
        // Load next question after delay
        setTimeout(() => {
            if (!quizState.isGameOver) {
                loadNextQuestion();
            }
        }, 1000);
    }, [currentQuestion, quizState, selectedOption, difficulty, mode, loadNextQuestion, onGameEnd]);

    const handleTimeout = useCallback(() => {
        if (quizState.isGameOver || selectedOption) return;
        
        audioManager.playTimeoutSound();
        const newLives = mode === 'quick' ? quizState.lives - 1 : quizState.lives;
        
        setQuizState(prev => ({
            ...prev,
            streak: 0,
            lives: newLives,
            questionsAnswered: prev.questionsAnswered + 1,
        }));
        
        if (mode === 'quick' && newLives <= 0) {
            setQuizState(prev => ({ ...prev, isGameOver: true }));
            setTimeout(() => {
                audioManager.playVictorySound();
                setShowResult(true);
                onGameEnd?.(quizState.score, quizState.correctAnswers, quizState.questionsAnswered + 1);
            }, 1000);
        } else {
            setTimeout(() => {
                if (!quizState.isGameOver) {
                    loadNextQuestion();
                }
            }, 1000);
        }
    }, [quizState, selectedOption, mode, loadNextQuestion, onGameEnd]);

    const useLifeline = useCallback((type: 'fiftyFifty' | 'skip' | 'hint' | 'audio') => {
        if (!currentQuestion || quizState.isGameOver || !quizState.lifelines[type]) return;
        
        switch (type) {
            case 'fiftyFifty':
                if (currentQuestion.type === 'mcq') {
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
    }, [currentQuestion, quizState, loadNextQuestion]);

    const resetGame = useCallback(() => {
        setShowResult(false);
        setQuizState(prev => ({
            ...prev,
            score: 0,
            streak: 0,
            lives: mode === 'quick' ? 3 : 0,
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
        questionSelectorRef.current?.reset();
        loadNextQuestion();
    }, [mode, loadNextQuestion]);

    return {
        currentQuestion,
        quizState,
        isLoading,
        selectedOption,
        showResult,
        handleAnswer,
        handleTimeout,
        useLifeline,
        resetGame,
        setShowResult
    };
};