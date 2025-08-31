/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseReport } from '../core/BaseReport.js';

interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  substituted?: boolean;
  originalIngredient?: string;
}

interface RecipeAttempt {
  id: string;
  timestamp: Date;
  baseRecipe: string;
  modifications: string[];
  ingredients: Ingredient[];
  cookingTime: number;
  temperature: number;
  technique: string;
  results: {
    taste: number;
    texture: number;
    appearance: number;
    difficulty: number;
  };
  notes: string;
  wouldRepeat: boolean;
}

export class RecipeExperimentReport extends BaseReport {
  private attempts: RecipeAttempt[] = [];
  private successfulVariations: RecipeAttempt[] = [];
  private flavorProfiles: Map<string, number> = new Map();

  constructor() {
    super('recipe-experiment');
    this.setTag('culinary');
    this.setTag('experimental');
  }

  recordAttempt(attempt: RecipeAttempt): void {
    this.attempts.push(attempt);
    
    const overallScore = (attempt.results.taste + attempt.results.texture + 
                         attempt.results.appearance) / 3;
    
    if (overallScore >= 4 && attempt.wouldRepeat) {
      this.successfulVariations.push(attempt);
      this.setPriority('medium');
      this.setTag('success');
    }
    
    this.analyzeIngredients(attempt.ingredients);
  }

  private analyzeIngredients(ingredients: Ingredient[]): void {
    ingredients.forEach(ing => {
      const key = ing.substituted ? `sub:${ing.name}` : ing.name;
      this.flavorProfiles.set(key, (this.flavorProfiles.get(key) || 0) + 1);
    });
  }

  findOptimalCombination(): RecipeAttempt | null {
    if (this.attempts.length === 0) return null;
    
    let best = this.attempts[0];
    let bestScore = this.calculateScore(best);
    
    for (const attempt of this.attempts) {
      const score = this.calculateScore(attempt);
      if (score > bestScore) {
        bestScore = score;
        best = attempt;
      }
    }
    
    return best;
  }

  private calculateScore(attempt: RecipeAttempt): number {
    const { taste, texture, appearance, difficulty } = attempt.results;
    return (taste * 2 + texture + appearance) - (difficulty * 0.5);
  }

  analyzeModificationImpact(): Record<string, { avgImpact: number; frequency: number }> {
    const modificationImpacts: Record<string, number[]> = {};
    
    for (const attempt of this.attempts) {
      const score = this.calculateScore(attempt);
      
      for (const mod of attempt.modifications) {
        if (!modificationImpacts[mod]) {
          modificationImpacts[mod] = [];
        }
        modificationImpacts[mod].push(score);
      }
    }
    
    const analysis: Record<string, { avgImpact: number; frequency: number }> = {};
    
    for (const [mod, scores] of Object.entries(modificationImpacts)) {
      analysis[mod] = {
        avgImpact: scores.reduce((a, b) => a + b, 0) / scores.length,
        frequency: scores.length,
      };
    }
    
    return analysis;
  }

  suggestNextExperiment(): string[] {
    const suggestions: string[] = [];
    const modAnalysis = this.analyzeModificationImpact();
    
    const highImpactMods = Object.entries(modAnalysis)
      .filter(([_, data]) => data.avgImpact > 3.5)
      .map(([mod]) => mod);
    
    if (highImpactMods.length >= 2) {
      suggestions.push(`Try combining: ${highImpactMods.slice(0, 2).join(' and ')}`);
    }
    
    const underusedIngredients = Array.from(this.flavorProfiles.entries())
      .filter(([_, count]) => count === 1)
      .map(([ing]) => ing.replace('sub:', ''));
    
    if (underusedIngredients.length > 0) {
      suggestions.push(`Re-test with: ${underusedIngredients[0]}`);
    }
    
    const avgCookTime = this.attempts.reduce((sum, a) => sum + a.cookingTime, 0) / this.attempts.length;
    const bestTime = this.findOptimalCombination()?.cookingTime || avgCookTime;
    
    if (Math.abs(bestTime - avgCookTime) > 5) {
      suggestions.push(`Experiment with cooking time around ${bestTime} minutes`);
    }
    
    const tempVariation = this.analyzeTemperatureVariation();
    if (tempVariation.optimal) {
      suggestions.push(`Try temperature at ${tempVariation.optimal}°`);
    }
    
    return suggestions;
  }

  private analyzeTemperatureVariation(): { optimal?: number; range: number } {
    if (this.attempts.length < 2) return { range: 0 };
    
    const temps = this.attempts.map(a => a.temperature);
    const scores = this.attempts.map(a => this.calculateScore(a));
    
    const maxTemp = Math.max(...temps);
    const minTemp = Math.min(...temps);
    
    let optimalTemp = 0;
    let maxScore = 0;
    
    for (let i = 0; i < temps.length; i++) {
      if (scores[i] > maxScore) {
        maxScore = scores[i];
        optimalTemp = temps[i];
      }
    }
    
    return {
      optimal: optimalTemp,
      range: maxTemp - minTemp,
    };
  }

  generateScientificMethod(): void {
    const optimal = this.findOptimalCombination();
    const modAnalysis = this.analyzeModificationImpact();
    
    this.setContent({
      totalExperiments: this.attempts.length,
      successfulVariations: this.successfulVariations.length,
      optimalRecipe: optimal,
      modificationAnalysis: modAnalysis,
      ingredientFrequency: Object.fromEntries(this.flavorProfiles),
      hypotheses: {
        temperatureHypothesis: this.generateTemperatureHypothesis(),
        timeHypothesis: this.generateTimeHypothesis(),
        techniqueHypothesis: this.generateTechniqueHypothesis(),
      },
      nextExperiments: this.suggestNextExperiment(),
      trends: {
        skillImprovement: this.analyzeSkillImprovement(),
        tasteEvolution: this.analyzeTasteEvolution(),
      },
    });
  }

  private generateTemperatureHypothesis(): string {
    const variation = this.analyzeTemperatureVariation();
    if (!variation.optimal) return 'Insufficient data';
    
    return `Optimal temperature appears to be ${variation.optimal}° with a tested range of ${variation.range}°`;
  }

  private generateTimeHypothesis(): string {
    const times = this.attempts.map(a => a.cookingTime);
    const scores = this.attempts.map(a => this.calculateScore(a));
    
    const correlation = this.calculateCorrelation(times, scores);
    
    if (Math.abs(correlation) < 0.3) {
      return 'Cooking time shows minimal impact on results';
    } else if (correlation > 0) {
      return 'Longer cooking times correlate with better results';
    } else {
      return 'Shorter cooking times correlate with better results';
    }
  }

  private generateTechniqueHypothesis(): string {
    const techniques = new Map<string, number[]>();
    
    for (const attempt of this.attempts) {
      if (!techniques.has(attempt.technique)) {
        techniques.set(attempt.technique, []);
      }
      techniques.get(attempt.technique)!.push(this.calculateScore(attempt));
    }
    
    let bestTechnique = '';
    let bestAvg = 0;
    
    techniques.forEach((scores, technique) => {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      if (avg > bestAvg) {
        bestAvg = avg;
        bestTechnique = technique;
      }
    });
    
    return `${bestTechnique} technique yields best results (avg score: ${bestAvg.toFixed(1)})`;
  }

  private analyzeSkillImprovement(): string {
    if (this.attempts.length < 3) return 'insufficient-data';
    
    const firstThird = this.attempts.slice(0, Math.floor(this.attempts.length / 3));
    const lastThird = this.attempts.slice(-Math.floor(this.attempts.length / 3));
    
    const firstAvgDifficulty = firstThird.reduce((sum, a) => sum + a.results.difficulty, 0) / firstThird.length;
    const lastAvgDifficulty = lastThird.reduce((sum, a) => sum + a.results.difficulty, 0) / lastThird.length;
    
    const firstAvgScore = firstThird.reduce((sum, a) => sum + this.calculateScore(a), 0) / firstThird.length;
    const lastAvgScore = lastThird.reduce((sum, a) => sum + this.calculateScore(a), 0) / lastThird.length;
    
    if (lastAvgScore > firstAvgScore && lastAvgDifficulty < firstAvgDifficulty) {
      return 'significant-improvement';
    } else if (lastAvgScore > firstAvgScore) {
      return 'quality-improvement';
    } else if (lastAvgDifficulty < firstAvgDifficulty) {
      return 'efficiency-improvement';
    } else {
      return 'stable';
    }
  }

  private analyzeTasteEvolution(): Record<string, number> {
    const evolution: Record<string, number> = {};
    
    if (this.attempts.length < 2) return evolution;
    
    const firstHalf = this.attempts.slice(0, Math.floor(this.attempts.length / 2));
    const secondHalf = this.attempts.slice(Math.floor(this.attempts.length / 2));
    
    evolution['taste_change'] = 
      (secondHalf.reduce((sum, a) => sum + a.results.taste, 0) / secondHalf.length) -
      (firstHalf.reduce((sum, a) => sum + a.results.taste, 0) / firstHalf.length);
    
    evolution['texture_change'] = 
      (secondHalf.reduce((sum, a) => sum + a.results.texture, 0) / secondHalf.length) -
      (firstHalf.reduce((sum, a) => sum + a.results.texture, 0) / firstHalf.length);
    
    return evolution;
  }

  private calculateCorrelation(x: number[], y: number[]): number {
    const n = Math.min(x.length, y.length);
    if (n === 0) return 0;
    
    const sumX = x.slice(0, n).reduce((a, b) => a + b, 0);
    const sumY = y.slice(0, n).reduce((a, b) => a + b, 0);
    const sumXY = x.slice(0, n).reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.slice(0, n).reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.slice(0, n).reduce((sum, yi) => sum + yi * yi, 0);
    
    const correlation = (n * sumXY - sumX * sumY) / 
      Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return isNaN(correlation) ? 0 : correlation;
  }

  async export(): Promise<string> {
    this.generateScientificMethod();
    return await this.save();
  }
}