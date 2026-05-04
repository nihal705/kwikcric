export interface PlayerRating {
  overall: number;
  batting: number;
  bowling: number;
  fielding: number;
  experience: number;
  form: number;
}

export class PlayerRatingCalculator {
  
  static calculateRating(player: any): PlayerRating {
    const batting = this.calculateBattingRating(player);
    const bowling = this.calculateBowlingRating(player);
    const fielding = this.calculateFieldingRating(player);
    const experience = this.calculateExperienceRating(player);
    const form = this.calculateFormRating(player);
    
    const overall = (batting + bowling + fielding + experience + form) / 5;
    
    return {
      overall: Math.min(99, Math.max(1, Math.round(overall))),
      batting: Math.min(99, Math.max(1, Math.round(batting))),
      bowling: Math.min(99, Math.max(1, Math.round(bowling))),
      fielding: Math.min(99, Math.max(1, Math.round(fielding))),
      experience: Math.min(99, Math.max(1, Math.round(experience))),
      form: Math.min(99, Math.max(1, Math.round(form))),
    };
  }
  
  private static calculateBattingRating(player: any): number {
    let rating = 50;
    
    if (player.stats) {
      const odiStats = player.stats.find((s: any) => s.format === 'ODI');
      
      if (odiStats) {
        // Runs impact
        if (odiStats.runs > 10000) rating += 20;
        else if (odiStats.runs > 5000) rating += 15;
        else if (odiStats.runs > 2000) rating += 10;
        else if (odiStats.runs > 500) rating += 5;
        
        // Average impact
        if (odiStats.batting_average > 50) rating += 15;
        else if (odiStats.batting_average > 40) rating += 10;
        else if (odiStats.batting_average > 30) rating += 5;
        
        // Strike rate impact (for limited overs)
        if (odiStats.strike_rate > 100) rating += 10;
        else if (odiStats.strike_rate > 85) rating += 5;
        
        // Centuries impact
        if (odiStats.hundreds > 30) rating += 10;
        else if (odiStats.hundreds > 15) rating += 5;
        else if (odiStats.hundreds > 5) rating += 3;
      }
    }
    
    // Role adjustment
    if (player.role?.toLowerCase().includes('batsman')) {
      rating += 10;
    } else if (player.role?.toLowerCase().includes('all-rounder')) {
      rating += 5;
    }
    
    return Math.min(99, rating);
  }
  
  private static calculateBowlingRating(player: any): number {
    let rating = 50;
    
    if (player.stats) {
      const odiStats = player.stats.find((s: any) => s.format === 'ODI');
      
      if (odiStats) {
        // Wickets impact
        if (odiStats.wickets > 300) rating += 20;
        else if (odiStats.wickets > 150) rating += 15;
        else if (odiStats.wickets > 50) rating += 10;
        else if (odiStats.wickets > 20) rating += 5;
        
        // Average impact (lower is better)
        if (odiStats.bowling_average < 25) rating += 15;
        else if (odiStats.bowling_average < 30) rating += 10;
        else if (odiStats.bowling_average < 35) rating += 5;
        
        // Economy impact
        if (odiStats.economy_rate < 4.5) rating += 10;
        else if (odiStats.economy_rate < 5) rating += 5;
        
        // Five-wicket hauls
        if (odiStats.five_wickets > 5) rating += 10;
        else if (odiStats.five_wickets > 2) rating += 5;
      }
    }
    
    // Role adjustment
    if (player.role?.toLowerCase().includes('bowler')) {
      rating += 10;
    } else if (player.role?.toLowerCase().includes('all-rounder')) {
      rating += 5;
    }
    
    return Math.min(99, rating);
  }
  
  private static calculateFieldingRating(player: any): number {
    let rating = 70; // Base rating
    
    if (player.stats) {
      const odiStats = player.stats.find((s: any) => s.format === 'ODI');
      
      if (odiStats) {
        // Catches impact
        if (odiStats.catches > 100) rating += 15;
        else if (odiStats.catches > 50) rating += 10;
        else if (odiStats.catches > 20) rating += 5;
        
        // Stumpings for wicket-keepers
        if (odiStats.stumpings > 20) rating += 10;
        else if (odiStats.stumpings > 10) rating += 5;
      }
    }
    
    // Role adjustment
    if (player.role?.toLowerCase().includes('wicket')) {
      rating += 10;
    }
    
    return Math.min(99, rating);
  }
  
  private static calculateExperienceRating(player: any): number {
    let rating = 30;
    
    if (player.stats) {
      const odiStats = player.stats.find((s: any) => s.format === 'ODI');
      
      if (odiStats) {
        // Matches impact
        if (odiStats.matches > 300) rating += 40;
        else if (odiStats.matches > 200) rating += 30;
        else if (odiStats.matches > 100) rating += 20;
        else if (odiStats.matches > 50) rating += 10;
        else if (odiStats.matches > 20) rating += 5;
        
        // Years active
        if (player.debut_odi) {
          const years = new Date().getFullYear() - new Date(player.debut_odi).getFullYear();
          if (years > 15) rating += 15;
          else if (years > 10) rating += 10;
          else if (years > 5) rating += 5;
        }
      }
    }
    
    return Math.min(99, rating);
  }
  
  private static calculateFormRating(player: any): number {
    let rating = 50;
    
    // This would ideally come from recent performance data
    // For now, use random with slight bias
    rating += Math.random() * 30 - 15;
    
    return Math.min(99, Math.max(1, rating));
  }
  
  static getPlayerStrengths(rating: PlayerRating): string[] {
    const strengths = [];
    
    if (rating.batting > 85) strengths.push('Elite Batsman');
    else if (rating.batting > 75) strengths.push('Strong Batsman');
    else if (rating.batting > 65) strengths.push('Accomplished Batsman');
    
    if (rating.bowling > 85) strengths.push('Elite Bowler');
    else if (rating.bowling > 75) strengths.push('Strong Bowler');
    else if (rating.bowling > 65) strengths.push('Accomplished Bowler');
    
    if (rating.fielding > 85) strengths.push('Excellent Fielder');
    else if (rating.fielding > 75) strengths.push('Safe Hands');
    
    if (rating.experience > 85) strengths.push('Veteran Player');
    else if (rating.experience > 70) strengths.push('Experienced');
    
    if (rating.form > 75) strengths.push('In Form');
    
    return strengths;
  }
  
  static getPlayerWeaknesses(rating: PlayerRating): string[] {
    const weaknesses = [];
    
    if (rating.batting < 40) weaknesses.push('Batting Liability');
    else if (rating.batting < 50) weaknesses.push('Inconsistent Batting');
    
    if (rating.bowling < 40) weaknesses.push('Expensive Bowler');
    else if (rating.bowling < 50) weaknesses.push('Part-time Bowler');
    
    if (rating.fielding < 50) weaknesses.push('Average Fielder');
    
    if (rating.form < 30) weaknesses.push('Out of Form');
    
    return weaknesses;
  }
}