// frontend/src/pages/Games/Imposter/logic/BotAI.ts

export class BotAI {
  private seenKeywords: Set<string> = new Set();
  private genericWords: string[] = [
    'Cricket', 'Stadium', 'Umpire', 'Boundary', 'Wicket', 'Crowd', 'Trophy', 
    'Final', 'Match', 'Player', 'Field', 'Crease', 'Pitch', 'Innings', 'Over',
    'Run', 'Six', 'Four', 'Catch', 'Bowled', 'LBW', 'Stumped', 'RunOut'
  ];
  
  constructor() {}

  // Real player bot - analyzes context and picks relevant keywords
  getRealPlayerDescription(cardName: string, keywords: string[], allDescriptions: string[]): string {
    // Track what others have said
    allDescriptions.forEach(desc => {
      const words = desc.toLowerCase().split(' ');
      words.forEach(w => this.seenKeywords.add(w));
    });
    
    // Get available keywords not used yet
    const availableKeywords = keywords.filter(k => !this.seenKeywords.has(k.toLowerCase()));
    
    if (availableKeywords.length > 0) {
      // Pick a relevant keyword
      const selected = availableKeywords[Math.floor(Math.random() * availableKeywords.length)];
      this.seenKeywords.add(selected.toLowerCase());
      return selected;
    }
    
    // Fallback to card-related context
    const contextWords = this.getContextWords(cardName);
    const available = contextWords.filter(w => !this.seenKeywords.has(w.toLowerCase()));
    
    if (available.length > 0) {
      const selected = available[Math.floor(Math.random() * available.length)];
      this.seenKeywords.add(selected.toLowerCase());
      return selected;
    }
    
    // Ultimate fallback - but tries to be relevant
    const relevantWords = this.getRelevantWords(cardName);
    return relevantWords[Math.floor(Math.random() * relevantWords.length)];
  }

  // Imposter bot - analyzes real players' words to guess the card and blend in
  getImposterDescription(realDescriptions: string[]): string {
    // Analyze real players' words to guess the card
    const possibleCard = this.analyzeRealWords(realDescriptions);
    
    if (possibleCard) {
      // Try to give a word that matches the pattern
      const matchingWords = this.getMatchingWords(possibleCard);
      if (matchingWords.length > 0) {
        return matchingWords[Math.floor(Math.random() * matchingWords.length)];
      }
    }
    
    // Strategic generic words that could relate to cricket
    const strategicWords = this.getStrategicWords(realDescriptions);
    return strategicWords[Math.floor(Math.random() * strategicWords.length)];
  }

  // Analyze what real players are saying to guess the card
  private analyzeRealWords(descriptions: string[]): string | null {
    // Common patterns
    const patterns: Record<string, string[]> = {
      'Virat Kohli': ['king', 'chase', 'rcb', 'aggressive', 'coverdrive', 'runmachine'],
      'MS Dhoni': ['captain', 'finisher', 'helicopter', 'csk', 'calm', 'thala'],
      'Sachin Tendulkar': ['master', 'god', 'mumbai', 'straightdrive', 'legend'],
      'Rohit Sharma': ['hitman', 'double', 'mumbai', 'sixer', 'captain'],
      'Hardik Pandya': ['allrounder', 'aggressive', 'baroda', 'finisher', 'power'],
      'Jasprit Bumrah': ['yorker', 'unorthodox', 'mumbai', 'death', 'accuracy'],
      'Mumbai Indians': ['blue', '5titles', 'rohit', 'wankhede', 'ambani'],
      'Chennai Super Kings': ['yellow', 'dhoni', 'whistle', 'chepauk', 'superking'],
      'Royal Challengers Bangalore': ['red', 'kohli', 'rcb', 'chinnaswamy', 'challenger']
    };
    
    const text = descriptions.join(' ').toLowerCase();
    
    for (const [card, keywords] of Object.entries(patterns)) {
      const matchCount = keywords.filter(kw => text.includes(kw)).length;
      if (matchCount >= 2) {
        return card;
      }
    }
    
    return null;
  }

  private getContextWords(cardName: string): string[] {
    const context: Record<string, string[]> = {
      'Virat Kohli': ['King', 'RunMachine', 'ChaseMaster', 'CoverDrive', 'RCB', 'Aggressive'],
      'MS Dhoni': ['Captain', 'Finisher', 'Helicopter', 'CSK', 'Calm', 'Thala'],
      'Sachin Tendulkar': ['Master', 'God', 'Mumbai', 'StraightDrive', 'Legend', 'LittleMaster'],
      'Rohit Sharma': ['Hitman', 'Double', 'Mumbai', 'Sixer', 'Captain', 'ViceCaptain'],
      'Mumbai Indians': ['Blue', '5Titles', 'Rohit', 'Wankhede', 'Ambani', 'Paltan'],
      'Chennai Super Kings': ['Yellow', 'Dhoni', 'Whistle', 'Chepauk', 'SuperKing', 'Comeback'],
      'Royal Challengers Bangalore': ['Red', 'Kohli', 'RCB', 'Chinnaswamy', 'Challenger', 'Bangalore']
    };
    
    return context[cardName] || this.genericWords;
  }

  private getRelevantWords(cardName: string): string[] {
    const relevant: Record<string, string[]> = {
      'Virat Kohli': ['Aggressive', 'Consistent', 'Chaser', 'Record', 'Captain'],
      'MS Dhoni': ['Cool', 'Finisher', 'Wicketkeeper', 'Captain', 'Legend'],
      'Sachin Tendulkar': ['Elegant', 'Perfect', 'Record', 'Legend', 'Icon'],
      'Rohit Sharma': ['Explosive', 'Opener', 'Captain', 'Sixer', 'Record']
    };
    
    return relevant[cardName] || ['Cricket', 'Player', 'Legend', 'Star', 'Icon'];
  }

  private getMatchingWords(cardName: string): string[] {
    const matches: Record<string, string[]> = {
      'Virat Kohli': ['King', 'Chase', 'RCB', 'RunMachine', 'CoverDrive'],
      'MS Dhoni': ['Captain', 'Helicopter', 'CSK', 'Finisher', 'Calm'],
      'Sachin Tendulkar': ['Master', 'Mumbai', 'StraightDrive', 'Legend'],
      'Rohit Sharma': ['Hitman', 'Double', 'Sixer', 'Captain']
    };
    
    return matches[cardName] || this.genericWords;
  }

  private getStrategicWords(descriptions: string[]): string[] {
    // Analyze if real players are using specific patterns
    const allText = descriptions.join(' ').toLowerCase();
    
    if (allText.includes('king') || allText.includes('chase') || allText.includes('rcb')) {
      return ['Cricket', 'Player', 'Stadium', 'Crowd', 'Match', 'Umpire'];
    }
    
    if (allText.includes('captain') || allText.includes('finisher') || allText.includes('csk')) {
      return ['Wicket', 'Boundary', 'Stadium', 'Cricket', 'Match'];
    }
    
    if (allText.includes('hitman') || allText.includes('double') || allText.includes('sixer')) {
      return ['Crowd', 'Stadium', 'Boundary', 'Cricket', 'Player'];
    }
    
    // Default strategic words
    const strategic = ['Cricket', 'Stadium', 'Umpire', 'Boundary', 'Wicket', 'Crowd', 'Trophy'];
    return strategic;
  }

  // Voting intelligence
  getVote(players: any[], descriptions: Map<string, string[]>): string {
    const genericThreshold = 0.3;
    let mostGenericPlayer = null;
    let highestGenericCount = 0;
    
    for (const player of players) {
      const playerDescs = descriptions.get(player.name) || [];
      if (playerDescs.length === 0) continue;
      
      let genericCount = 0;
      for (const desc of playerDescs) {
        if (this.genericWords.some(gw => gw.toLowerCase() === desc.toLowerCase())) {
          genericCount++;
        }
      }
      
      const genericRatio = genericCount / playerDescs.length;
      if (genericRatio > genericThreshold && genericCount > highestGenericCount) {
        highestGenericCount = genericCount;
        mostGenericPlayer = player.name;
      }
    }
    
    // If found a generic player, vote for them
    if (mostGenericPlayer) {
      return mostGenericPlayer;
    }
    
    // Otherwise vote randomly among other players (not self)
    const otherPlayers = players.filter(p => !p.isBot).map(p => p.name);
    if (otherPlayers.length > 0) {
      return otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
    }
    
    return players[0]?.name || '';
  }
}