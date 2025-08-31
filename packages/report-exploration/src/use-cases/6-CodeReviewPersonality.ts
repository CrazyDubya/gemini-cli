/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseReport } from '../core/BaseReport.js';

interface CodeReview {
  id: string;
  timestamp: Date;
  reviewer: string;
  fileType: string;
  linesReviewed: number;
  comments: ReviewComment[];
  timeSpent: number;
  severity: 'info' | 'suggestion' | 'warning' | 'error';
  approved: boolean;
}

interface ReviewComment {
  type: 'style' | 'performance' | 'security' | 'logic' | 'documentation' | 'testing';
  tone: 'supportive' | 'neutral' | 'critical' | 'harsh';
  length: number;
  hasCodeSuggestion: boolean;
  hasExplanation: boolean;
  hasReference: boolean;
}

interface PersonalityTraits {
  thoroughness: number;
  empathy: number;
  technical_depth: number;
  pedantry: number;
  helpfulness: number;
  consistency: number;
}

export class CodeReviewPersonalityReport extends BaseReport {
  private reviews: CodeReview[] = [];
  private traits: PersonalityTraits = {
    thoroughness: 0,
    empathy: 0,
    technical_depth: 0,
    pedantry: 0,
    helpfulness: 0,
    consistency: 0,
  };

  constructor() {
    super('code-review-personality');
    this.setTag('behavioral');
    this.setTag('team-dynamics');
  }

  addReview(review: CodeReview): void {
    this.reviews.push(review);
    this.updatePersonalityTraits(review);
  }

  private updatePersonalityTraits(review: CodeReview): void {
    const commentDensity = review.comments.length / review.linesReviewed;
    this.traits.thoroughness = this.updateTrait(this.traits.thoroughness, commentDensity * 10);
    
    const supportiveComments = review.comments.filter(c => c.tone === 'supportive').length;
    const empathyScore = supportiveComments / review.comments.length;
    this.traits.empathy = this.updateTrait(this.traits.empathy, empathyScore * 5);
    
    const technicalComments = review.comments.filter(c => 
      c.type === 'performance' || c.type === 'security' || c.type === 'logic'
    ).length;
    this.traits.technical_depth = this.updateTrait(
      this.traits.technical_depth, 
      (technicalComments / review.comments.length) * 5
    );
    
    const styleComments = review.comments.filter(c => c.type === 'style').length;
    this.traits.pedantry = this.updateTrait(
      this.traits.pedantry,
      (styleComments / review.comments.length) * 5
    );
    
    const helpfulComments = review.comments.filter(c => 
      c.hasCodeSuggestion || c.hasExplanation || c.hasReference
    ).length;
    this.traits.helpfulness = this.updateTrait(
      this.traits.helpfulness,
      (helpfulComments / review.comments.length) * 5
    );
  }

  private updateTrait(current: number, newValue: number): number {
    return current === 0 ? newValue : (current * 0.7 + newValue * 0.3);
  }

  generatePersonalityProfile(): string {
    const profiles = [
      { name: 'The Mentor', match: this.traits.empathy > 3 && this.traits.helpfulness > 3 },
      { name: 'The Guardian', match: this.traits.technical_depth > 4 && this.traits.thoroughness > 4 },
      { name: 'The Perfectionist', match: this.traits.pedantry > 4 && this.traits.consistency > 3 },
      { name: 'The Pragmatist', match: this.traits.technical_depth > 3 && this.traits.pedantry < 2 },
      { name: 'The Encourager', match: this.traits.empathy > 4 && this.traits.helpfulness > 4 },
      { name: 'The Architect', match: this.traits.technical_depth > 4 && this.traits.consistency > 4 },
    ];
    
    const matched = profiles.find(p => p.match);
    return matched?.name || 'The Balanced Reviewer';
  }

  analyzeReviewPatterns(): Record<string, unknown> {
    const timeOfDayPattern = this.analyzeTimeOfDayPattern();
    const fileTypePreferences = this.analyzeFileTypePreferences();
    const moodOverTime = this.analyzeMoodProgression();
    
    return {
      averageReviewTime: this.calculateAverageReviewTime(),
      commentDensity: this.calculateCommentDensity(),
      approvalRate: this.calculateApprovalRate(),
      timeOfDayPattern,
      fileTypePreferences,
      moodOverTime,
      focusAreas: this.identifyFocusAreas(),
    };
  }

  private analyzeTimeOfDayPattern(): Record<string, number> {
    const pattern: Record<string, number> = {
      morning: 0,
      afternoon: 0,
      evening: 0,
      night: 0,
    };
    
    for (const review of this.reviews) {
      const hour = review.timestamp.getHours();
      if (hour >= 6 && hour < 12) pattern.morning++;
      else if (hour >= 12 && hour < 17) pattern.afternoon++;
      else if (hour >= 17 && hour < 22) pattern.evening++;
      else pattern.night++;
    }
    
    return pattern;
  }

  private analyzeFileTypePreferences(): Record<string, { count: number; avgComments: number }> {
    const preferences: Record<string, { total: number; comments: number }> = {};
    
    for (const review of this.reviews) {
      if (!preferences[review.fileType]) {
        preferences[review.fileType] = { total: 0, comments: 0 };
      }
      preferences[review.fileType].total++;
      preferences[review.fileType].comments += review.comments.length;
    }
    
    const result: Record<string, { count: number; avgComments: number }> = {};
    for (const [type, data] of Object.entries(preferences)) {
      result[type] = {
        count: data.total,
        avgComments: data.comments / data.total,
      };
    }
    
    return result;
  }

  private analyzeMoodProgression(): string {
    if (this.reviews.length < 5) return 'insufficient-data';
    
    const recent = this.reviews.slice(-5);
    const older = this.reviews.slice(0, 5);
    
    const recentHarshness = recent.reduce((sum, r) => 
      sum + r.comments.filter(c => c.tone === 'harsh' || c.tone === 'critical').length, 0
    ) / recent.reduce((sum, r) => sum + r.comments.length, 0);
    
    const olderHarshness = older.reduce((sum, r) => 
      sum + r.comments.filter(c => c.tone === 'harsh' || c.tone === 'critical').length, 0
    ) / older.reduce((sum, r) => sum + r.comments.length, 0);
    
    if (recentHarshness < olderHarshness * 0.8) return 'becoming-gentler';
    if (recentHarshness > olderHarshness * 1.2) return 'becoming-stricter';
    return 'stable';
  }

  private identifyFocusAreas(): string[] {
    const typeCounts: Record<string, number> = {};
    
    for (const review of this.reviews) {
      for (const comment of review.comments) {
        typeCounts[comment.type] = (typeCounts[comment.type] || 0) + 1;
      }
    }
    
    return Object.entries(typeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([type]) => type);
  }

  private calculateAverageReviewTime(): number {
    if (this.reviews.length === 0) return 0;
    return this.reviews.reduce((sum, r) => sum + r.timeSpent, 0) / this.reviews.length;
  }

  private calculateCommentDensity(): number {
    if (this.reviews.length === 0) return 0;
    
    const totalComments = this.reviews.reduce((sum, r) => sum + r.comments.length, 0);
    const totalLines = this.reviews.reduce((sum, r) => sum + r.linesReviewed, 0);
    
    return totalLines > 0 ? totalComments / totalLines : 0;
  }

  private calculateApprovalRate(): number {
    if (this.reviews.length === 0) return 0;
    const approved = this.reviews.filter(r => r.approved).length;
    return approved / this.reviews.length;
  }

  suggestImprovements(): string[] {
    const suggestions: string[] = [];
    
    if (this.traits.empathy < 2) {
      suggestions.push('Consider adding more positive feedback and encouragement');
    }
    
    if (this.traits.helpfulness < 2) {
      suggestions.push('Include more code examples and explanations in reviews');
    }
    
    if (this.traits.pedantry > 4) {
      suggestions.push('Focus on significant issues rather than minor style preferences');
    }
    
    if (this.traits.consistency < 2) {
      suggestions.push('Develop consistent review criteria and apply them uniformly');
    }
    
    const approvalRate = this.calculateApprovalRate();
    if (approvalRate < 0.3) {
      suggestions.push('Consider if standards might be too strict');
    } else if (approvalRate > 0.95) {
      suggestions.push('Ensure thorough review of potential issues');
    }
    
    return suggestions;
  }

  generateCompatibilityScore(otherProfile: PersonalityTraits): number {
    let score = 0;
    let factors = 0;
    
    if (this.traits.empathy > 3 && otherProfile.empathy < 2) {
      score += 3;
      factors++;
    }
    
    if (Math.abs(this.traits.pedantry - otherProfile.pedantry) < 2) {
      score += 2;
      factors++;
    }
    
    if (this.traits.technical_depth > 3 && otherProfile.technical_depth > 3) {
      score += 2;
      factors++;
    }
    
    if (this.traits.helpfulness > 3 || otherProfile.helpfulness > 3) {
      score += 1;
      factors++;
    }
    
    return factors > 0 ? (score / factors) * 20 : 50;
  }

  generateReport(): void {
    this.traits.consistency = this.calculateConsistency();
    
    this.setContent({
      totalReviews: this.reviews.length,
      personalityProfile: this.generatePersonalityProfile(),
      traits: this.traits,
      patterns: this.analyzeReviewPatterns(),
      strengths: this.identifyStrengths(),
      improvements: this.suggestImprovements(),
      teamDynamics: {
        bestPairings: this.suggestBestPairings(),
        conflictRisk: this.assessConflictRisk(),
      },
    });
  }

  private calculateConsistency(): number {
    if (this.reviews.length < 2) return 3;
    
    const commentRatios = this.reviews.map(r => r.comments.length / r.linesReviewed);
    const mean = commentRatios.reduce((a, b) => a + b, 0) / commentRatios.length;
    const variance = commentRatios.reduce((sum, ratio) => sum + Math.pow(ratio - mean, 2), 0) / commentRatios.length;
    const stdDev = Math.sqrt(variance);
    
    return Math.max(1, Math.min(5, 5 - stdDev * 10));
  }

  private identifyStrengths(): string[] {
    const strengths: string[] = [];
    
    if (this.traits.thoroughness > 4) strengths.push('Exceptionally thorough reviews');
    if (this.traits.empathy > 4) strengths.push('Supportive and encouraging feedback');
    if (this.traits.technical_depth > 4) strengths.push('Deep technical insights');
    if (this.traits.helpfulness > 4) strengths.push('Provides actionable suggestions');
    if (this.traits.consistency > 4) strengths.push('Consistent review standards');
    
    return strengths;
  }

  private suggestBestPairings(): string[] {
    const pairings: string[] = [];
    
    if (this.traits.technical_depth > 4) {
      pairings.push('Pair with junior developers for mentoring');
    }
    
    if (this.traits.empathy > 4) {
      pairings.push('Ideal for reviewing first-time contributors');
    }
    
    if (this.traits.pedantry > 3) {
      pairings.push('Best for final reviews before production');
    }
    
    return pairings;
  }

  private assessConflictRisk(): string {
    if (this.traits.pedantry > 4 && this.traits.empathy < 2) {
      return 'high - may create tension with sensitive team members';
    }
    
    if (this.traits.empathy > 4 && this.traits.technical_depth < 2) {
      return 'medium - may miss critical issues while being supportive';
    }
    
    return 'low - balanced approach to reviews';
  }

  async export(): Promise<string> {
    this.generateReport();
    return await this.save();
  }
}