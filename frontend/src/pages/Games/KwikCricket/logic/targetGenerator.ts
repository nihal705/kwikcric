// frontend/src/pages/Games/KwikCricket/logic/targetGenerator.ts

export interface TargetConfig {
    baseTarget: number;
    difficultyMultiplier: number;
    minTarget: number;
    maxTarget: number;
}

export const generateTarget = (
    userScore: number,
    overs: number,
    difficulty: 'easy' | 'medium' | 'hard',
    opponentStrength: number = 85
): number => {
    let multiplier: number;
    
    switch (difficulty) {
        case 'easy':
            multiplier = 0.75;
            break;
        case 'hard':
            multiplier = 1.15;
            break;
        default:
            multiplier = 0.95;
    }
    
    // Adjust based on opponent strength
    const strengthFactor = opponentStrength / 100;
    multiplier = multiplier * (1 + (1 - strengthFactor) * 0.2);
    
    let target = Math.floor(userScore * multiplier);
    
    // Minimum target based on overs
    const minTargetByOvers = overs * 10;
    target = Math.max(target, minTargetByOvers);
    
    // Maximum target (can't be more than userScore + 30)
    target = Math.min(target, userScore + 30);
    
    return target;
};

export const calculateRequiredRunRate = (
    currentScore: number,
    target: number,
    ballsBowled: number,
    totalBalls: number
): number => {
    const ballsRemaining = totalBalls - ballsBowled;
    if (ballsRemaining <= 0) return 0;
    
    const runsNeeded = target - currentScore;
    if (runsNeeded <= 0) return 0;
    
    const oversRemaining = ballsRemaining / 6;
    return runsNeeded / oversRemaining;
};

export const calculateProjectedScore = (
    currentScore: number,
    ballsPlayed: number,
    totalBalls: number
): number => {
    if (ballsPlayed === 0) return 0;
    const runRate = (currentScore / ballsPlayed) * 6;
    return Math.floor(runRate * (totalBalls / 6));
};