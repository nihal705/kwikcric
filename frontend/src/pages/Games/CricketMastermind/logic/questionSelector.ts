// frontend/src/pages/Games/CricketMastermind/logic/questionSelector.ts
import { Question, Difficulty } from '../types/quiz.types';
import { allQuestions } from '../data/questions';

interface QuestionPool {
    easy: Question[];
    medium: Question[];
    hard: Question[];
}

export class QuestionSelector {
    private pool: QuestionPool = { easy: [], medium: [], hard: [] };
    private usedQuestions: Set<number> = new Set();
    private category: string;
    private difficulty: Difficulty;
    
    constructor(category: string, difficulty: Difficulty, initialQuestions: Question[] = allQuestions) {
        this.category = category;
        this.difficulty = difficulty;
        this.initializePool(initialQuestions);
    }
    
    private initializePool(questions: Question[]): void {
        const filtered = this.category === 'All-Mode' 
            ? questions 
            : questions.filter(q => q.category === this.category);
        
        this.pool.easy = filtered.filter(q => q.difficulty === 'easy');
        this.pool.medium = filtered.filter(q => q.difficulty === 'medium');
        this.pool.hard = filtered.filter(q => q.difficulty === 'hard');
        
        // Shuffle pools for randomness
        this.shuffleArray(this.pool.easy);
        this.shuffleArray(this.pool.medium);
        this.shuffleArray(this.pool.hard);
    }
    
    private shuffleArray<T>(array: T[]): void {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    private getPoolByDifficulty(): Question[] {
        switch (this.difficulty) {
            case 'easy': return this.pool.easy;
            case 'medium': return this.pool.medium;
            case 'hard': return this.pool.hard;
            case 'random': {
                const all = [...this.pool.easy, ...this.pool.medium, ...this.pool.hard];
                return all;
            }
            case 'all': {
                return [...this.pool.easy, ...this.pool.medium, ...this.pool.hard];
            }
            default: return this.pool.medium;
        }
    }
    
    getNextQuestion(): Question | null {
        const pool = this.getPoolByDifficulty();
        const available = pool.filter(q => !this.usedQuestions.has(q.id));
        
        if (available.length === 0) {
            // Reset used questions if pool is exhausted
            this.usedQuestions.clear();
            if (pool.length === 0) return null;
            const question = pool[Math.floor(Math.random() * pool.length)];
            this.usedQuestions.add(question.id);
            return question;
        }
        
        const randomIndex = Math.floor(Math.random() * available.length);
        const question = available[randomIndex];
        this.usedQuestions.add(question.id);
        
        return question;
    }
    
    getRandomQuestion(): Question | null {
        const pool = this.getPoolByDifficulty();
        if (pool.length === 0) return null;
        return pool[Math.floor(Math.random() * pool.length)];
    }
    
    reset(): void {
        this.usedQuestions.clear();
    }
    
    getRemainingCount(): number {
        const pool = this.getPoolByDifficulty();
        return pool.filter(q => !this.usedQuestions.has(q.id)).length;
    }
}