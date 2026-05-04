// frontend/src/pages/Games/KwikCricket/logic/aiBowling.ts

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface BallResult {
    runs: number;
    isWicket: boolean;
    message: string;
    animation: string;
    ballNumber: number;
    runsInOver: number;
    wicketsInOver: number;
}

export const bowlBall = (
    difficulty: Difficulty, 
    currentOver: number, 
    ballInOver: number,
    totalOvers: number = 20  // Add default value
): BallResult => {
    let runs: number;
    let isWicket: boolean = false;
    let message: string = "";
    let animation: string = "";
    
    // Base probability based on difficulty
    let boundaryProb: number;
    let wicketProb: number;
    let singleProb: number;
    
    switch (difficulty) {
        case 'easy':
            boundaryProb = 0.35;
            wicketProb = 0.05;
            singleProb = 0.40;
            break;
        case 'hard':
            boundaryProb = 0.15;
            wicketProb = 0.15;
            singleProb = 0.35;
            break;
        default:
            boundaryProb = 0.25;
            wicketProb = 0.10;
            singleProb = 0.38;
    }
    
    const random = Math.random();
    const isBoundary = Math.random() < 0.6;
    
    if (random < wicketProb) {
        isWicket = true;
        runs = 0;
        message = Math.random() < 0.5 ? "OUT! Bowled! 🎯" : "OUT! Caught! 🧤";
        animation = "wicket";
    } else if (random < wicketProb + boundaryProb) {
        runs = isBoundary ? 6 : 4;
        message = runs === 6 ? "SIX! Huge hit! 💥" : "FOUR! Beautiful shot! 🏏";
        animation = runs === 6 ? "six" : "boundary";
    } else if (random < wicketProb + boundaryProb + singleProb) {
        runs = Math.floor(Math.random() * 3) + 1;
        message = runs === 1 ? "Single taken" : runs === 2 ? "Two runs" : "Three runs";
        animation = runs === 1 ? "single" : runs === 2 ? "double" : "triple";
    } else {
        runs = 0;
        message = Math.random() < 0.5 ? "Dot ball! Good fielding!" : "No run!";
        animation = "dot";
    }
    
    // Death overs effect (last 2 overs)
    const isDeathOver = currentOver > totalOvers - 2;
    if (isDeathOver && difficulty === 'hard') {
        if (Math.random() < 0.2 && !isWicket) {
            isWicket = true;
            runs = 0;
            message = "OUT! Yorker! 🎯";
            animation = "wicket";
        } else if (Math.random() < 0.3) {
            runs = Math.min(runs, 2);
            message = "Well fielded! Only " + runs + " run" + (runs > 1 ? "s" : "");
        }
    }
    
    return {
        runs,
        isWicket,
        message,
        animation,
        ballNumber: (currentOver - 1) * 6 + ballInOver,
        runsInOver: 0,
        wicketsInOver: 0
    };
};

export const getTargetForOpponent = (
    userScore: number,
    _totalOvers: number
): number => {
    let target = userScore + 1;
    return target;
};