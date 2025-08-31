/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseReport } from '../core/BaseReport.js';

interface ReadingSession {
  timestamp: Date;
  material: {
    title: string;
    type: 'book' | 'article' | 'paper' | 'documentation' | 'news';
    category: string;
    difficulty: 1 | 2 | 3 | 4 | 5;
    length: number;
  };
  duration: number;
  pagesRead: number;
  comprehensionTest?: {
    score: number;
    questions: number;
  };
  notes: string[];
  highlights: number;
  rereads: number;
  distractions: number;
  environment: 'quiet' | 'moderate' | 'noisy';
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
}

interface ComprehensionProfile {
  readingSpeed: number;
  comprehensionRate: number;
  retentionScore: number;
  optimalConditions: Record<string, string | number>;
  strengths: string[];
  challenges: string[];
}

export class ReadingComprehensionReport extends BaseReport {
  private sessions: ReadingSession[] = [];
  private profile: ComprehensionProfile;
  private vocabulary: Map<string, { encounters: number; understood: boolean }> = new Map();

  constructor() {
    super('reading-comprehension');
    this.setTag('learning');
    this.setTag('cognitive');
    this.profile = {
      readingSpeed: 0,
      comprehensionRate: 0,
      retentionScore: 0,
      optimalConditions: {},
      strengths: [],
      challenges: [],
    };
  }

  recordSession(session: ReadingSession): void {
    this.sessions.push(session);
    this.updateProfile(session);
  }

  private updateProfile(session: ReadingSession): void {
    const speed = session.pagesRead / (session.duration / 60);
    this.profile.readingSpeed = this.profile.readingSpeed === 0 
      ? speed 
      : (this.profile.readingSpeed * 0.8 + speed * 0.2);
    
    if (session.comprehensionTest) {
      const comprehension = session.comprehensionTest.score / session.comprehensionTest.questions;
      this.profile.comprehensionRate = this.profile.comprehensionRate === 0
        ? comprehension
        : (this.profile.comprehensionRate * 0.7 + comprehension * 0.3);
    }
  }

  addVocabularyEncounter(word: string, understood: boolean): void {
    if (!this.vocabulary.has(word)) {
      this.vocabulary.set(word, { encounters: 0, understood });
    }
    
    const vocab = this.vocabulary.get(word)!;
    vocab.encounters++;
    vocab.understood = vocab.understood || understood;
  }

  analyzeReadingPatterns(): Record<string, unknown> {
    return {
      speedByDifficulty: this.analyzeSpeedByDifficulty(),
      comprehensionByEnvironment: this.analyzeComprehensionByEnvironment(),
      optimalTimeOfDay: this.findOptimalTimeOfDay(),
      materialPreferences: this.analyzeMaterialPreferences(),
      learningCurve: this.analyzeLearningCurve(),
    };
  }

  private analyzeSpeedByDifficulty(): Record<number, number> {
    const speedByDiff: Record<number, number[]> = {};
    
    for (const session of this.sessions) {
      const speed = session.pagesRead / (session.duration / 60);
      
      if (!speedByDiff[session.material.difficulty]) {
        speedByDiff[session.material.difficulty] = [];
      }
      speedByDiff[session.material.difficulty].push(speed);
    }
    
    const avgSpeeds: Record<number, number> = {};
    for (const [diff, speeds] of Object.entries(speedByDiff)) {
      avgSpeeds[parseInt(diff)] = speeds.reduce((a, b) => a + b, 0) / speeds.length;
    }
    
    return avgSpeeds;
  }

  private analyzeComprehensionByEnvironment(): Record<string, number> {
    const comprehension: Record<string, { total: number; count: number }> = {
      quiet: { total: 0, count: 0 },
      moderate: { total: 0, count: 0 },
      noisy: { total: 0, count: 0 },
    };
    
    for (const session of this.sessions) {
      if (session.comprehensionTest) {
        const score = session.comprehensionTest.score / session.comprehensionTest.questions;
        comprehension[session.environment].total += score;
        comprehension[session.environment].count++;
      }
    }
    
    const avgComprehension: Record<string, number> = {};
    for (const [env, data] of Object.entries(comprehension)) {
      avgComprehension[env] = data.count > 0 ? data.total / data.count : 0;
    }
    
    return avgComprehension;
  }

  private findOptimalTimeOfDay(): string {
    const timeScores: Record<string, { speed: number; comprehension: number; count: number }> = {
      morning: { speed: 0, comprehension: 0, count: 0 },
      afternoon: { speed: 0, comprehension: 0, count: 0 },
      evening: { speed: 0, comprehension: 0, count: 0 },
      night: { speed: 0, comprehension: 0, count: 0 },
    };
    
    for (const session of this.sessions) {
      const speed = session.pagesRead / (session.duration / 60);
      const time = session.timeOfDay;
      
      timeScores[time].speed += speed;
      timeScores[time].count++;
      
      if (session.comprehensionTest) {
        timeScores[time].comprehension += session.comprehensionTest.score / session.comprehensionTest.questions;
      }
    }
    
    let bestTime = 'morning';
    let bestScore = 0;
    
    for (const [time, scores] of Object.entries(timeScores)) {
      if (scores.count > 0) {
        const avgSpeed = scores.speed / scores.count;
        const avgComprehension = scores.comprehension / scores.count;
        const combinedScore = avgSpeed * 0.3 + avgComprehension * 0.7;
        
        if (combinedScore > bestScore) {
          bestScore = combinedScore;
          bestTime = time;
        }
      }
    }
    
    return bestTime;
  }

  private analyzeMaterialPreferences(): Record<string, { count: number; avgSpeed: number; enjoyment: number }> {
    const preferences: Record<string, { totalSpeed: number; count: number; highlights: number }> = {};
    
    for (const session of this.sessions) {
      const type = session.material.type;
      
      if (!preferences[type]) {
        preferences[type] = { totalSpeed: 0, count: 0, highlights: 0 };
      }
      
      const speed = session.pagesRead / (session.duration / 60);
      preferences[type].totalSpeed += speed;
      preferences[type].count++;
      preferences[type].highlights += session.highlights;
    }
    
    const result: Record<string, { count: number; avgSpeed: number; enjoyment: number }> = {};
    
    for (const [type, data] of Object.entries(preferences)) {
      result[type] = {
        count: data.count,
        avgSpeed: data.totalSpeed / data.count,
        enjoyment: data.highlights / data.count,
      };
    }
    
    return result;
  }

  private analyzeLearningCurve(): string {
    if (this.sessions.length < 5) return 'insufficient-data';
    
    const recentSessions = this.sessions.slice(-5);
    const olderSessions = this.sessions.slice(0, 5);
    
    const recentSpeed = recentSessions.reduce((sum, s) => 
      sum + s.pagesRead / (s.duration / 60), 0
    ) / recentSessions.length;
    
    const olderSpeed = olderSessions.reduce((sum, s) => 
      sum + s.pagesRead / (s.duration / 60), 0
    ) / olderSessions.length;
    
    const improvement = ((recentSpeed - olderSpeed) / olderSpeed) * 100;
    
    if (improvement > 20) return 'rapid-improvement';
    if (improvement > 5) return 'steady-improvement';
    if (improvement > -5) return 'plateau';
    return 'needs-attention';
  }

  identifyOptimalConditions(): void {
    const bestSessions = this.sessions
      .filter(s => s.comprehensionTest)
      .sort((a, b) => {
        const scoreA = a.comprehensionTest!.score / a.comprehensionTest!.questions;
        const scoreB = b.comprehensionTest!.score / b.comprehensionTest!.questions;
        return scoreB - scoreA;
      })
      .slice(0, Math.min(5, Math.floor(this.sessions.length * 0.2)));
    
    if (bestSessions.length > 0) {
      const avgDistractions = bestSessions.reduce((sum, s) => sum + s.distractions, 0) / bestSessions.length;
      const mostCommonEnv = this.getMostCommon(bestSessions.map(s => s.environment));
      const mostCommonTime = this.getMostCommon(bestSessions.map(s => s.timeOfDay));
      
      this.profile.optimalConditions = {
        environment: mostCommonEnv,
        timeOfDay: mostCommonTime,
        maxDistractions: Math.floor(avgDistractions),
        sessionLength: bestSessions.reduce((sum, s) => sum + s.duration, 0) / bestSessions.length,
      };
    }
  }

  private getMostCommon<T>(items: T[]): T {
    const counts = new Map<T, number>();
    
    for (const item of items) {
      counts.set(item, (counts.get(item) || 0) + 1);
    }
    
    let mostCommon = items[0];
    let maxCount = 0;
    
    counts.forEach((count, item) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommon = item;
      }
    });
    
    return mostCommon;
  }

  generatePersonalizedTips(): string[] {
    const tips: string[] = [];
    
    const patterns = this.analyzeReadingPatterns();
    
    if (patterns.optimalTimeOfDay) {
      tips.push(`Schedule important reading during ${patterns.optimalTimeOfDay} for best comprehension`);
    }
    
    const avgDistractions = this.sessions.reduce((sum, s) => sum + s.distractions, 0) / this.sessions.length;
    if (avgDistractions > 3) {
      tips.push('Use focus techniques like Pomodoro to reduce distractions');
    }
    
    const highlightRate = this.sessions.reduce((sum, s) => sum + s.highlights, 0) / 
                         this.sessions.reduce((sum, s) => sum + s.pagesRead, 0);
    
    if (highlightRate < 0.05) {
      tips.push('Try highlighting key passages to improve retention');
    }
    
    const rereadRate = this.sessions.reduce((sum, s) => sum + s.rereads, 0) / this.sessions.length;
    if (rereadRate > 2) {
      tips.push('Consider slowing down initial reading pace to reduce rereads');
    }
    
    const difficultMaterial = this.sessions.filter(s => s.material.difficulty >= 4);
    if (difficultMaterial.length > 0) {
      const avgSpeed = difficultMaterial.reduce((sum, s) => 
        sum + s.pagesRead / (s.duration / 60), 0
      ) / difficultMaterial.length;
      
      if (avgSpeed > this.profile.readingSpeed * 0.8) {
        tips.push('Slow down when reading difficult material to improve comprehension');
      }
    }
    
    return tips;
  }

  calculateRetentionScore(): number {
    const testsWithScore = this.sessions.filter(s => s.comprehensionTest);
    
    if (testsWithScore.length === 0) return 0;
    
    let weightedScore = 0;
    let totalWeight = 0;
    const now = Date.now();
    
    for (const session of testsWithScore) {
      const daysSince = (now - session.timestamp.getTime()) / (1000 * 60 * 60 * 24);
      const weight = Math.exp(-daysSince / 30);
      const score = session.comprehensionTest!.score / session.comprehensionTest!.questions;
      
      weightedScore += score * weight;
      totalWeight += weight;
    }
    
    return totalWeight > 0 ? weightedScore / totalWeight : 0;
  }

  identifyStrengthsAndChallenges(): void {
    const strengths: string[] = [];
    const challenges: string[] = [];
    
    if (this.profile.readingSpeed > 250) {
      strengths.push('Fast reading speed');
    } else if (this.profile.readingSpeed < 150) {
      challenges.push('Below-average reading speed');
    }
    
    if (this.profile.comprehensionRate > 0.8) {
      strengths.push('Excellent comprehension');
    } else if (this.profile.comprehensionRate < 0.6) {
      challenges.push('Comprehension needs improvement');
    }
    
    const techMaterial = this.sessions.filter(s => s.material.type === 'documentation' || s.material.type === 'paper');
    if (techMaterial.length > 0) {
      const techComprehension = techMaterial
        .filter(s => s.comprehensionTest)
        .reduce((sum, s) => sum + s.comprehensionTest!.score / s.comprehensionTest!.questions, 0) / 
        techMaterial.filter(s => s.comprehensionTest).length;
      
      if (techComprehension > 0.75) {
        strengths.push('Strong technical reading ability');
      }
    }
    
    const vocabularyMastery = Array.from(this.vocabulary.values())
      .filter(v => v.understood).length / this.vocabulary.size;
    
    if (vocabularyMastery > 0.9) {
      strengths.push('Excellent vocabulary');
    } else if (vocabularyMastery < 0.7) {
      challenges.push('Vocabulary expansion needed');
    }
    
    this.profile.strengths = strengths;
    this.profile.challenges = challenges;
  }

  generateReport(): void {
    this.identifyOptimalConditions();
    this.profile.retentionScore = this.calculateRetentionScore();
    this.identifyStrengthsAndChallenges();
    
    this.setContent({
      totalSessions: this.sessions.length,
      totalPagesRead: this.sessions.reduce((sum, s) => sum + s.pagesRead, 0),
      totalHoursRead: this.sessions.reduce((sum, s) => sum + s.duration, 0) / 60,
      profile: this.profile,
      patterns: this.analyzeReadingPatterns(),
      vocabularyStats: {
        uniqueWords: this.vocabulary.size,
        masteredWords: Array.from(this.vocabulary.values()).filter(v => v.understood).length,
        challengingWords: Array.from(this.vocabulary.entries())
          .filter(([_, v]) => !v.understood && v.encounters > 2)
          .map(([word]) => word),
      },
      recommendations: this.generatePersonalizedTips(),
      progressMetrics: {
        speedTrend: this.calculateSpeedTrend(),
        comprehensionTrend: this.calculateComprehensionTrend(),
        consistencyScore: this.calculateConsistencyScore(),
      },
    });
  }

  private calculateSpeedTrend(): string {
    if (this.sessions.length < 5) return 'insufficient-data';
    
    const speeds = this.sessions.map(s => s.pagesRead / (s.duration / 60));
    const firstHalf = speeds.slice(0, Math.floor(speeds.length / 2));
    const secondHalf = speeds.slice(Math.floor(speeds.length / 2));
    
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    const change = ((secondAvg - firstAvg) / firstAvg) * 100;
    
    if (change > 10) return 'improving';
    if (change < -10) return 'declining';
    return 'stable';
  }

  private calculateComprehensionTrend(): string {
    const testsWithScore = this.sessions.filter(s => s.comprehensionTest);
    
    if (testsWithScore.length < 3) return 'insufficient-data';
    
    const scores = testsWithScore.map(s => s.comprehensionTest!.score / s.comprehensionTest!.questions);
    const recent = scores.slice(-3);
    const older = scores.slice(0, 3);
    
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
    
    if (recentAvg > olderAvg * 1.1) return 'improving';
    if (recentAvg < olderAvg * 0.9) return 'declining';
    return 'stable';
  }

  private calculateConsistencyScore(): number {
    if (this.sessions.length < 7) return 0;
    
    const dates = this.sessions.map(s => s.timestamp);
    const daysBetween: number[] = [];
    
    for (let i = 1; i < dates.length; i++) {
      const days = (dates[i].getTime() - dates[i - 1].getTime()) / (1000 * 60 * 60 * 24);
      daysBetween.push(days);
    }
    
    const avgDays = daysBetween.reduce((a, b) => a + b, 0) / daysBetween.length;
    const variance = daysBetween.reduce((sum, days) => sum + Math.pow(days - avgDays, 2), 0) / daysBetween.length;
    
    return Math.max(0, 1 - (Math.sqrt(variance) / avgDays));
  }

  async export(): Promise<string> {
    this.generateReport();
    return await this.save();
  }
}