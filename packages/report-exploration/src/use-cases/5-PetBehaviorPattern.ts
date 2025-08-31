/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseReport } from '../core/BaseReport.js';

interface BehaviorEvent {
  timestamp: Date;
  behavior: string;
  trigger?: string;
  duration: number;
  intensity: 1 | 2 | 3 | 4 | 5;
  location: string;
  humanPresent: boolean;
  otherPetsPresent: boolean;
  precedingActivity?: string;
}

interface PetProfile {
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  medicalConditions?: string[];
}

export class PetBehaviorReport extends BaseReport {
  private behaviors: BehaviorEvent[] = [];
  private profile: PetProfile;
  private patterns: Map<string, BehaviorEvent[]> = new Map();
  private triggers: Map<string, number> = new Map();

  constructor(profile: PetProfile) {
    super('pet-behavior');
    this.profile = profile;
    this.setTag('animal-behavior');
    this.setTag('predictive');
  }

  recordBehavior(event: BehaviorEvent): void {
    this.behaviors.push(event);
    
    if (!this.patterns.has(event.behavior)) {
      this.patterns.set(event.behavior, []);
    }
    this.patterns.get(event.behavior)!.push(event);
    
    if (event.trigger) {
      this.triggers.set(event.trigger, (this.triggers.get(event.trigger) || 0) + 1);
    }
    
    this.checkAnomalies(event);
  }

  private checkAnomalies(event: BehaviorEvent): void {
    if (event.intensity >= 4) {
      this.setPriority('high');
      this.setTag('needs-attention');
    }
    
    const similarBehaviors = this.patterns.get(event.behavior) || [];
    const avgIntensity = similarBehaviors.reduce((sum, b) => sum + b.intensity, 0) / similarBehaviors.length;
    
    if (event.intensity > avgIntensity * 1.5) {
      this.setTag('anomaly-detected');
    }
  }

  predictNextBehavior(): { behavior: string; probability: number; timeWindow: string } | null {
    if (this.behaviors.length < 10) return null;
    
    const timePatterns = this.analyzeTimePatterns();
    const currentHour = new Date().getHours();
    
    let mostLikely = { behavior: '', probability: 0, timeWindow: '' };
    
    for (const [hour, behaviors] of Object.entries(timePatterns)) {
      const hourNum = parseInt(hour);
      if (Math.abs(hourNum - currentHour) <= 1) {
        const behaviorCounts = new Map<string, number>();
        
        for (const b of behaviors as string[]) {
          behaviorCounts.set(b, (behaviorCounts.get(b) || 0) + 1);
        }
        
        behaviorCounts.forEach((count, behavior) => {
          const probability = count / (behaviors as string[]).length;
          if (probability > mostLikely.probability) {
            mostLikely = {
              behavior,
              probability,
              timeWindow: `${hourNum}:00-${(hourNum + 1) % 24}:00`,
            };
          }
        });
      }
    }
    
    return mostLikely.probability > 0 ? mostLikely : null;
  }

  private analyzeTimePatterns(): Record<number, string[]> {
    const patterns: Record<number, string[]> = {};
    
    for (const behavior of this.behaviors) {
      const hour = behavior.timestamp.getHours();
      if (!patterns[hour]) {
        patterns[hour] = [];
      }
      patterns[hour].push(behavior.behavior);
    }
    
    return patterns;
  }

  identifyStressors(): string[] {
    const stressors: string[] = [];
    const stressBehaviors = ['pacing', 'excessive-grooming', 'hiding', 'aggression', 'vocalization'];
    
    for (const [trigger, count] of this.triggers.entries()) {
      const relatedBehaviors = this.behaviors.filter(b => 
        b.trigger === trigger && stressBehaviors.includes(b.behavior)
      );
      
      if (relatedBehaviors.length / count > 0.5) {
        stressors.push(trigger);
      }
    }
    
    return stressors;
  }

  analyzeSocialPatterns(): Record<string, unknown> {
    const withHumans = this.behaviors.filter(b => b.humanPresent);
    const withoutHumans = this.behaviors.filter(b => !b.humanPresent);
    const withPets = this.behaviors.filter(b => b.otherPetsPresent);
    const alone = this.behaviors.filter(b => !b.humanPresent && !b.otherPetsPresent);
    
    return {
      behaviorWithHumans: this.summarizeBehaviors(withHumans),
      behaviorWithoutHumans: this.summarizeBehaviors(withoutHumans),
      behaviorWithOtherPets: this.summarizeBehaviors(withPets),
      behaviorAlone: this.summarizeBehaviors(alone),
      socialPreference: this.calculateSocialPreference(withHumans, withPets, alone),
    };
  }

  private summarizeBehaviors(behaviors: BehaviorEvent[]): Record<string, number> {
    const summary: Record<string, number> = {};
    
    for (const b of behaviors) {
      summary[b.behavior] = (summary[b.behavior] || 0) + 1;
    }
    
    return summary;
  }

  private calculateSocialPreference(
    withHumans: BehaviorEvent[],
    withPets: BehaviorEvent[],
    alone: BehaviorEvent[]
  ): string {
    const humanScore = withHumans.reduce((sum, b) => sum + (5 - b.intensity), 0) / withHumans.length;
    const petScore = withPets.reduce((sum, b) => sum + (5 - b.intensity), 0) / withPets.length;
    const aloneScore = alone.reduce((sum, b) => sum + (5 - b.intensity), 0) / alone.length;
    
    const maxScore = Math.max(humanScore || 0, petScore || 0, aloneScore || 0);
    
    if (maxScore === humanScore) return 'human-oriented';
    if (maxScore === petScore) return 'social-with-pets';
    return 'independent';
  }

  generateTrainingRecommendations(): string[] {
    const recommendations: string[] = [];
    const stressors = this.identifyStressors();
    
    if (stressors.length > 0) {
      recommendations.push(`Desensitization training for: ${stressors.join(', ')}`);
    }
    
    const highIntensityBehaviors = Array.from(this.patterns.entries())
      .filter(([_, events]) => {
        const avgIntensity = events.reduce((sum, e) => sum + e.intensity, 0) / events.length;
        return avgIntensity > 3;
      })
      .map(([behavior]) => behavior);
    
    if (highIntensityBehaviors.length > 0) {
      recommendations.push(`Focus on reducing intensity of: ${highIntensityBehaviors.join(', ')}`);
    }
    
    const socialPatterns = this.analyzeSocialPatterns();
    if (socialPatterns.socialPreference === 'independent') {
      recommendations.push('Gradual socialization exercises recommended');
    }
    
    return recommendations;
  }

  generateReport(): void {
    const prediction = this.predictNextBehavior();
    
    this.setContent({
      profile: this.profile,
      totalBehaviors: this.behaviors.length,
      uniqueBehaviors: this.patterns.size,
      behaviorFrequency: Object.fromEntries(
        Array.from(this.patterns.entries()).map(([b, events]) => [b, events.length])
      ),
      triggers: Object.fromEntries(this.triggers),
      stressors: this.identifyStressors(),
      socialPatterns: this.analyzeSocialPatterns(),
      prediction,
      recommendations: this.generateTrainingRecommendations(),
      healthIndicators: this.analyzeHealthIndicators(),
    });
  }

  private analyzeHealthIndicators(): Record<string, unknown> {
    const eatingBehaviors = this.behaviors.filter(b => 
      b.behavior.includes('eating') || b.behavior.includes('food')
    );
    
    const sleepBehaviors = this.behaviors.filter(b => 
      b.behavior.includes('sleep') || b.behavior.includes('rest')
    );
    
    const playBehaviors = this.behaviors.filter(b => 
      b.behavior.includes('play') || b.behavior.includes('active')
    );
    
    return {
      appetiteLevel: eatingBehaviors.length > 0 ? 'normal' : 'concerning',
      sleepPattern: this.analyzeSleepPattern(sleepBehaviors),
      activityLevel: playBehaviors.length / this.behaviors.length,
      overallHealth: this.calculateHealthScore(),
    };
  }

  private analyzeSleepPattern(sleepBehaviors: BehaviorEvent[]): string {
    if (sleepBehaviors.length === 0) return 'no-data';
    
    const nightSleep = sleepBehaviors.filter(b => {
      const hour = b.timestamp.getHours();
      return hour >= 22 || hour <= 6;
    });
    
    return nightSleep.length / sleepBehaviors.length > 0.6 ? 'normal' : 'irregular';
  }

  private calculateHealthScore(): number {
    let score = 5;
    
    const avgIntensity = this.behaviors.reduce((sum, b) => sum + b.intensity, 0) / this.behaviors.length;
    score -= (avgIntensity - 2.5);
    
    const stressors = this.identifyStressors();
    score -= stressors.length * 0.5;
    
    return Math.max(1, Math.min(5, score));
  }

  async export(): Promise<string> {
    this.generateReport();
    return await this.save();
  }
}