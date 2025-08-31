/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseReport } from '../core/BaseReport.js';

interface DreamEntry {
  narrative: string;
  emotions: string[];
  symbols: string[];
  lucidity: number;
  recurring: boolean;
  interpretation?: string;
}

export class DreamJournalReport extends BaseReport {
  private dreams: DreamEntry[] = [];
  private patterns: Map<string, number> = new Map();

  constructor() {
    super('dream-journal');
    this.setTag('personal');
    this.setTag('psychological');
  }

  recordDream(dream: DreamEntry): void {
    this.dreams.push(dream);
    this.analyzeSymbols(dream.symbols);
    this.trackEmotions(dream.emotions);
  }

  private analyzeSymbols(symbols: string[]): void {
    symbols.forEach(symbol => {
      this.patterns.set(symbol, (this.patterns.get(symbol) || 0) + 1);
    });
  }

  private trackEmotions(emotions: string[]): void {
    emotions.forEach(emotion => {
      this.patterns.set(`emotion:${emotion}`, (this.patterns.get(`emotion:${emotion}`) || 0) + 1);
    });
  }

  generateInsights(): Record<string, unknown> {
    const insights = {
      totalDreams: this.dreams.length,
      averageLucidity: this.dreams.reduce((sum, d) => sum + d.lucidity, 0) / this.dreams.length,
      recurringThemes: Array.from(this.patterns.entries())
        .filter(([_, count]) => count > 1)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5),
      emotionalProfile: Array.from(this.patterns.entries())
        .filter(([key]) => key.startsWith('emotion:'))
        .map(([key, count]) => ({ emotion: key.replace('emotion:', ''), frequency: count })),
      lucidityTrend: this.calculateLucidityTrend(),
    };

    this.setContent({
      dreams: this.dreams,
      insights,
      patterns: Object.fromEntries(this.patterns),
    });

    return insights;
  }

  private calculateLucidityTrend(): string {
    if (this.dreams.length < 2) return 'insufficient-data';
    
    const recentAvg = this.dreams.slice(-5).reduce((sum, d) => sum + d.lucidity, 0) / 5;
    const overallAvg = this.dreams.reduce((sum, d) => sum + d.lucidity, 0) / this.dreams.length;
    
    return recentAvg > overallAvg ? 'improving' : 'declining';
  }

  async export(): Promise<string> {
    this.generateInsights();
    return await this.save();
  }
}