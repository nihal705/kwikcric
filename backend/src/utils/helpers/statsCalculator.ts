export class StatsCalculator {
  
  static calculateBattingAverage(runs: number, innings: number, notOut: number): number {
    const dismissals = innings - notOut;
    if (dismissals === 0) return 0;
    return parseFloat((runs / dismissals).toFixed(2));
  }
  
  static calculateStrikeRate(runs: number, ballsFaced: number): number {
    if (ballsFaced === 0) return 0;
    return parseFloat(((runs / ballsFaced) * 100).toFixed(2));
  }
  
  static calculateBowlingAverage(runsConceded: number, wickets: number): number {
    if (wickets === 0) return 0;
    return parseFloat((runsConceded / wickets).toFixed(2));
  }
  
  static calculateEconomyRate(runsConceded: number, oversBowled: number): number {
    if (oversBowled === 0) return 0;
    return parseFloat((runsConceded / oversBowled).toFixed(2));
  }
  
  static calculateBowlingStrikeRate(ballsBowled: number, wickets: number): number {
    if (wickets === 0) return 0;
    return parseFloat((ballsBowled / wickets).toFixed(2));
  }
  
  static calculateNetRunRate(runsFor: number, oversFor: number, runsAgainst: number, oversAgainst: number): number {
    if (oversFor === 0 || oversAgainst === 0) return 0;
    const forRate = runsFor / oversFor;
    const againstRate = runsAgainst / oversAgainst;
    return parseFloat((forRate - againstRate).toFixed(3));
  }
  
  static calculateRequiredRunRate(runsNeeded: number, oversRemaining: number): number {
    if (oversRemaining === 0) return 0;
    return parseFloat((runsNeeded / oversRemaining).toFixed(2));
  }
  
  static calculateProjectedScore(currentRuns: number, currentOvers: number, totalOvers: number): number {
    if (currentOvers === 0) return 0;
    const runRate = currentRuns / currentOvers;
    return Math.floor(runRate * totalOvers);
  }
  
  static calculateForm(performances: number[], weightRecent: boolean = true): number {
    if (performances.length === 0) return 0;
    
    let total = 0;
    let weightSum = 0;
    
    for (let i = 0; i < performances.length; i++) {
      const weight = weightRecent ? Math.pow(2, i) : 1;
      total += performances[performances.length - 1 - i] * weight;
      weightSum += weight;
    }
    
    return parseFloat((total / weightSum).toFixed(2));
  }
  
  static calculateConfidenceInterval(values: number[], confidenceLevel: number = 0.95): { lower: number; upper: number; mean: number } {
    if (values.length < 2) {
      return { lower: values[0] || 0, upper: values[0] || 0, mean: values[0] || 0 };
    }
    
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    // Z-score for 95% confidence is approximately 1.96
    const zScore = confidenceLevel === 0.95 ? 1.96 : 2.58;
    const marginOfError = zScore * (stdDev / Math.sqrt(values.length));
    
    return {
      lower: parseFloat((mean - marginOfError).toFixed(2)),
      upper: parseFloat((mean + marginOfError).toFixed(2)),
      mean: parseFloat(mean.toFixed(2)),
    };
  }
  
  static calculatePeakPerformance(values: number[], windowSize: number = 5): { peak: number; startIndex: number; endIndex: number } {
    if (values.length < windowSize) {
      const max = Math.max(...values);
      return { peak: max, startIndex: values.indexOf(max), endIndex: values.indexOf(max) };
    }
    
    let bestSum = 0;
    let bestStart = 0;
    
    for (let i = 0; i <= values.length - windowSize; i++) {
      const sum = values.slice(i, i + windowSize).reduce((a, b) => a + b, 0);
      if (sum > bestSum) {
        bestSum = sum;
        bestStart = i;
      }
    }
    
    return {
      peak: parseFloat((bestSum / windowSize).toFixed(2)),
      startIndex: bestStart,
      endIndex: bestStart + windowSize - 1,
    };
  }
  
  static calculateWinProbability(runsNeeded: number, ballsRemaining: number, wicketsRemaining: number, runRate: number): number {
    if (wicketsRemaining === 0) return 0;
    if (runsNeeded <= 0) return 100;
    if (ballsRemaining === 0) return 0;
    
    // Duckworth-Lewis simplified method
    const resourcesRemaining = (ballsRemaining / 6) * (wicketsRemaining / 10);
    const targetRate = runsNeeded / (ballsRemaining / 6);
    const requiredRateRatio = targetRate / (runRate + 0.1);
    
    let probability = 50 - (requiredRateRatio * 30) + (resourcesRemaining * 20);
    probability = Math.max(0, Math.min(100, probability));
    
    return parseFloat(probability.toFixed(2));
  }
  
  static calculatePlayerRating(runs: number, wickets: number, matches: number, format: string): number {
    const formatMultiplier = format === 'Test' ? 1.2 : format === 'ODI' ? 1.0 : 0.8;
    
    const runsPerMatch = runs / matches;
    const wicketsPerMatch = wickets / matches;
    
    let rating = (runsPerMatch * 0.6 + wicketsPerMatch * 40) * formatMultiplier;
    rating = Math.min(1000, Math.max(0, rating));
    
    return parseFloat(rating.toFixed(2));
  }
}

export const statsCalculator = StatsCalculator;