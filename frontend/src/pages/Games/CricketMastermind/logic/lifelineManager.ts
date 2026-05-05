// frontend/src/pages/Games/CricketMastermind/logic/lifelineManager.ts
import { Question } from '../types/quiz.types';

export interface LifelineState {
    fiftyFifty: boolean;
    skip: boolean;
    hint: boolean;
    audio: boolean;
}

export class LifelineManager {
    private lifelines: LifelineState;
    
    constructor() {
        this.lifelines = {
            fiftyFifty: true,
            skip: true,
            hint: true,
            audio: true
        };
    }
    
    // Get current lifeline status
    getLifelines(): LifelineState {
        return { ...this.lifelines };
    }
    
    // Check if lifeline is available
    isAvailable(lifeline: keyof LifelineState): boolean {
        return this.lifelines[lifeline];
    }
    
    // Use a lifeline
    useLifeline(lifeline: keyof LifelineState): boolean {
        if (!this.lifelines[lifeline]) return false;
        
        this.lifelines[lifeline] = false;
        return true;
    }
    
    // Apply 50-50 lifeline to question
    applyFiftyFifty(question: Question): Question {
        if (!this.lifelines.fiftyFifty) return question;
        
        this.useLifeline('fiftyFifty');
        
        if (question.type === 'mcq') {
            const incorrectOptions = question.options.filter(
                opt => opt !== question.correctAnswer
            );
            const toRemove = incorrectOptions.slice(0, 2);
            return {
                ...question,
                options: question.options.filter(opt => !toRemove.includes(opt))
            };
        }
        
        return question;
    }
    
    // Get hint for question
    getHint(question: Question): string | null {
        if (!this.lifelines.hint) return null;
        
        this.useLifeline('hint');
        return question.hint || null;
    }
    
    // Skip current question
    canSkip(): boolean {
        return this.lifelines.skip;
    }
    
    // Mark skip as used
    useSkip(): boolean {
        return this.useLifeline('skip');
    }
    
    // Check audio lifeline
    canUseAudio(): boolean {
        return this.lifelines.audio;
    }
    
    // Use audio lifeline
    useAudio(): boolean {
        return this.useLifeline('audio');
    }
    
    // Reset all lifelines
    reset(): void {
        this.lifelines = {
            fiftyFifty: true,
            skip: true,
            hint: true,
            audio: true
        };
    }
    
    // Get remaining lifelines count
    getRemainingCount(): number {
        return Object.values(this.lifelines).filter(Boolean).length;
    }
    
    // Get lifelines as array for UI
    getLifelinesArray(): { type: keyof LifelineState; available: boolean }[] {
        return [
            { type: 'fiftyFifty', available: this.lifelines.fiftyFifty },
            { type: 'skip', available: this.lifelines.skip },
            { type: 'hint', available: this.lifelines.hint },
            { type: 'audio', available: this.lifelines.audio }
        ];
    }
}

// Create a singleton instance
export const lifelineManager = new LifelineManager();