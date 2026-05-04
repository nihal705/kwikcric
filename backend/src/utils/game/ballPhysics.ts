export interface BallTrajectory {
  type: 'seam' | 'swing' | 'spin' | 'bounce';
  deviation: number;
  speed: number;
  landingPoint: { x: number; y: number };
}

export interface ShotPhysics {
  power: number;
  direction: number;
  elevation: number;
  distance: number;
}

export class BallPhysicsEngine {
  
  static calculateBallTrajectory(bowlerType: string, deliveryVariation: string): BallTrajectory {
    let trajectory: BallTrajectory = {
      type: 'seam',
      deviation: 0,
      speed: 130,
      landingPoint: { x: 0, y: 0 },
    };
    
    switch (bowlerType) {
      case 'fast':
        trajectory.speed = Math.random() * 30 + 140; // 140-170 km/h
        if (deliveryVariation === 'yorker') {
          trajectory.landingPoint = { x: 0, y: 22 }; // At batsman's feet
        } else if (deliveryVariation === 'bouncer') {
          trajectory.landingPoint = { x: 0, y: 6 }; // Short length
          trajectory.type = 'bounce';
        } else {
          trajectory.landingPoint = { x: 0, y: 12 + Math.random() * 6 };
        }
        break;
        
      case 'spin':
        trajectory.speed = Math.random() * 30 + 80; // 80-110 km/h
        trajectory.type = 'spin';
        trajectory.deviation = (Math.random() - 0.5) * 10; // -5 to 5 degrees deviation
        trajectory.landingPoint = { x: 0, y: 10 + Math.random() * 8 };
        break;
        
      case 'medium':
        trajectory.speed = Math.random() * 20 + 110; // 110-130 km/h
        trajectory.type = 'swing';
        trajectory.deviation = (Math.random() - 0.5) * 5;
        trajectory.landingPoint = { x: 0, y: 10 + Math.random() * 8 };
        break;
    }
    
    return trajectory;
  }
  
  static calculateShotPhysics(battingStyle: string, shotType: string, ballTrajectory: BallTrajectory): ShotPhysics {
    let power = 0.7;
    let direction = 0;
    let elevation = 0;
    
    // Base power based on shot type
    switch (shotType) {
      case 'aggressive':
        power = Math.random() * 0.3 + 0.8; // 0.8-1.1
        direction = (Math.random() - 0.5) * 120; // -60 to 60 degrees
        elevation = Math.random() * 40 + 20; // 20-60 degrees
        break;
      case 'normal':
        power = Math.random() * 0.3 + 0.5; // 0.5-0.8
        direction = (Math.random() - 0.5) * 90; // -45 to 45 degrees
        elevation = Math.random() * 30 + 10; // 10-40 degrees
        break;
      case 'defensive':
        power = Math.random() * 0.2 + 0.2; // 0.2-0.4
        direction = (Math.random() - 0.5) * 60; // -30 to 30 degrees
        elevation = Math.random() * 20 + 5; // 5-25 degrees
        break;
    }
    
    // Adjust for ball trajectory
    const deviationImpact = Math.abs(ballTrajectory.deviation) / 10;
    direction += ballTrajectory.deviation * 2;
    power *= (1 - deviationImpact * 0.3);
    
    // Adjust for batting style
    if (battingStyle === 'aggressive') {
      power *= 1.1;
    } else if (battingStyle === 'defensive') {
      power *= 0.9;
    }
    
    // Calculate distance based on power
    const distance = power * 120; // Max 120 meters
    
    return {
      power,
      direction,
      elevation,
      distance,
    };
  }
  
  static calculateBoundaryProbability(shotPhysics: ShotPhysics, fieldPosition: string): number {
    let probability = 0;
    
    // Base probability based on power and direction
    if (shotPhysics.distance > 70) {
      probability = 0.6;
    } else if (shotPhysics.distance > 50) {
      probability = 0.3;
    } else {
      probability = 0.1;
    }
    
    // Adjust for field position
    if (fieldPosition === 'boundary') {
      probability *= 0.5;
    } else if (fieldPosition === 'inner') {
      probability *= 1.2;
    } else if (fieldPosition === 'powerplay') {
      probability *= 1.3;
    }
    
    return Math.min(0.95, Math.max(0.05, probability));
  }
  
  static calculateCatchProbability(shotPhysics: ShotPhysics, fielderPosition: string): number {
    if (shotPhysics.elevation < 15) return 0.05; // Ground shot
    
    let probability = 0.3; // Base catch probability
    
    // Higher elevation = easier catch
    if (shotPhysics.elevation > 45) {
      probability += 0.3;
    } else if (shotPhysics.elevation > 30) {
      probability += 0.2;
    } else {
      probability += 0.1;
    }
    
    // Adjust for fielder position
    if (fielderPosition === 'close') {
      probability += 0.1;
    } else if (fielderPosition === 'deep') {
      probability -= 0.1;
    }
    
    return Math.min(0.95, Math.max(0.1, probability));
  }
  
  static calculateRunOutProbability(distance: number, isDirectHit: boolean): number {
    let probability = 0.3;
    
    if (distance < 10) {
      probability = 0.8;
    } else if (distance < 20) {
      probability = 0.5;
    } else {
      probability = 0.2;
    }
    
    if (isDirectHit) {
      probability += 0.2;
    }
    
    return Math.min(0.95, probability);
  }
}