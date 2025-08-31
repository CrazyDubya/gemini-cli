/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseReport } from '../core/BaseReport.js';

interface ListeningSession {
  timestamp: Date;
  track: {
    title: string;
    artist: string;
    genre: string;
    bpm: number;
    key: string;
    energy: number;
    valence: number;
    danceability: number;
    acousticness: number;
  };
  duration: number;
  skipped: boolean;
  repeated: boolean;
  context: 'work' | 'exercise' | 'relaxation' | 'social' | 'commute' | 'sleep';
  mood: 'happy' | 'sad' | 'energetic' | 'calm' | 'focused' | 'angry';
  deviceType: string;
}

interface MusicDNA {
  genreDistribution: Map<string, number>;
  tempoPreference: { min: number; max: number; optimal: number };
  energyProfile: number[];
  emotionalSignature: Map<string, number>;
  discoveryRate: number;
  loyaltyScore: number;
}

export class MusicListeningDNAReport extends BaseReport {
  private sessions: ListeningSession[] = [];
  private dna: MusicDNA;
  private artists: Map<string, number> = new Map();
  private skipPatterns: Map<string, number> = new Map();

  constructor() {
    super('music-dna');
    this.setTag('personal-analytics');
    this.setTag('behavioral');
    this.dna = {
      genreDistribution: new Map(),
      tempoPreference: { min: 0, max: 200, optimal: 120 },
      energyProfile: [],
      emotionalSignature: new Map(),
      discoveryRate: 0,
      loyaltyScore: 0,
    };
  }

  addSession(session: ListeningSession): void {
    this.sessions.push(session);
    this.updateDNA(session);
    this.trackArtist(session.track.artist);
    
    if (session.skipped) {
      this.analyzeSkip(session);
    }
  }

  private updateDNA(session: ListeningSession): void {
    const genre = session.track.genre;
    this.dna.genreDistribution.set(genre, (this.dna.genreDistribution.get(genre) || 0) + 1);
    
    this.dna.energyProfile.push(session.track.energy);
    
    const mood = `${session.mood}-${session.context}`;
    this.dna.emotionalSignature.set(mood, (this.dna.emotionalSignature.get(mood) || 0) + 1);
    
    this.updateTempoPreference(session.track.bpm);
  }

  private updateTempoPreference(bpm: number): void {
    const allBpms = this.sessions.map(s => s.track.bpm);
    this.dna.tempoPreference = {
      min: Math.min(...allBpms),
      max: Math.max(...allBpms),
      optimal: this.calculateOptimalTempo(),
    };
  }

  private calculateOptimalTempo(): number {
    const weightedBpms = this.sessions
      .filter(s => !s.skipped)
      .map(s => ({
        bpm: s.track.bpm,
        weight: s.repeated ? 2 : 1,
      }));
    
    const totalWeight = weightedBpms.reduce((sum, w) => sum + w.weight, 0);
    const weightedSum = weightedBpms.reduce((sum, w) => sum + w.bpm * w.weight, 0);
    
    return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 120;
  }

  private trackArtist(artist: string): void {
    this.artists.set(artist, (this.artists.get(artist) || 0) + 1);
  }

  private analyzeSkip(session: ListeningSession): void {
    const skipReason = this.inferSkipReason(session);
    this.skipPatterns.set(skipReason, (this.skipPatterns.get(skipReason) || 0) + 1);
  }

  private inferSkipReason(session: ListeningSession): string {
    if (session.duration < 10) return 'immediate-dislike';
    if (session.duration < 30) return 'wrong-mood';
    if (session.track.energy < 0.3 && session.context === 'exercise') return 'energy-mismatch';
    if (session.track.energy > 0.7 && session.context === 'sleep') return 'context-inappropriate';
    return 'other';
  }

  generateListeningPersonality(): string {
    const genres = Array.from(this.dna.genreDistribution.keys());
    const topGenre = this.getTopGenre();
    const avgEnergy = this.dna.energyProfile.reduce((a, b) => a + b, 0) / this.dna.energyProfile.length;
    
    if (genres.length > 10 && this.dna.discoveryRate > 0.3) {
      return 'The Explorer';
    } else if (this.dna.loyaltyScore > 0.7) {
      return 'The Loyalist';
    } else if (avgEnergy > 0.7) {
      return 'The Energizer';
    } else if (avgEnergy < 0.3) {
      return 'The Contemplator';
    } else if (this.hasStrongContextualPatterns()) {
      return 'The Contextual Listener';
    } else if (topGenre && this.dna.genreDistribution.get(topGenre)! > this.sessions.length * 0.5) {
      return `The ${topGenre} Purist`;
    }
    
    return 'The Eclectic';
  }

  private getTopGenre(): string | null {
    let topGenre: string | null = null;
    let maxCount = 0;
    
    this.dna.genreDistribution.forEach((count, genre) => {
      if (count > maxCount) {
        maxCount = count;
        topGenre = genre;
      }
    });
    
    return topGenre;
  }

  private hasStrongContextualPatterns(): boolean {
    const contextPatterns = new Map<string, Set<string>>();
    
    for (const session of this.sessions) {
      if (!contextPatterns.has(session.context)) {
        contextPatterns.set(session.context, new Set());
      }
      contextPatterns.get(session.context)!.add(session.track.genre);
    }
    
    let strongPatterns = 0;
    contextPatterns.forEach((genres) => {
      if (genres.size <= 2) strongPatterns++;
    });
    
    return strongPatterns >= contextPatterns.size * 0.5;
  }

  predictNextTrack(context: string, mood: string): Record<string, unknown> | null {
    const relevantSessions = this.sessions.filter(s => 
      s.context === context && s.mood === mood && !s.skipped
    );
    
    if (relevantSessions.length === 0) return null;
    
    const avgFeatures = {
      bpm: relevantSessions.reduce((sum, s) => sum + s.track.bpm, 0) / relevantSessions.length,
      energy: relevantSessions.reduce((sum, s) => sum + s.track.energy, 0) / relevantSessions.length,
      valence: relevantSessions.reduce((sum, s) => sum + s.track.valence, 0) / relevantSessions.length,
      danceability: relevantSessions.reduce((sum, s) => sum + s.track.danceability, 0) / relevantSessions.length,
    };
    
    const genrePreferences = new Map<string, number>();
    relevantSessions.forEach(s => {
      genrePreferences.set(s.track.genre, (genrePreferences.get(s.track.genre) || 0) + 1);
    });
    
    const preferredGenre = Array.from(genrePreferences.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0];
    
    return {
      recommendedFeatures: avgFeatures,
      preferredGenre,
      avoidFeatures: this.getAvoidFeatures(context),
    };
  }

  private getAvoidFeatures(context: string): Record<string, unknown> {
    const skippedInContext = this.sessions.filter(s => 
      s.context === context && s.skipped
    );
    
    if (skippedInContext.length === 0) return {};
    
    return {
      avoidHighEnergy: skippedInContext.filter(s => s.track.energy > 0.7).length > skippedInContext.length * 0.3,
      avoidLowEnergy: skippedInContext.filter(s => s.track.energy < 0.3).length > skippedInContext.length * 0.3,
      avoidGenres: this.getSkippedGenres(skippedInContext),
    };
  }

  private getSkippedGenres(sessions: ListeningSession[]): string[] {
    const genreSkips = new Map<string, number>();
    
    sessions.forEach(s => {
      genreSkips.set(s.track.genre, (genreSkips.get(s.track.genre) || 0) + 1);
    });
    
    return Array.from(genreSkips.entries())
      .filter(([_, count]) => count > 2)
      .map(([genre]) => genre);
  }

  analyzeTimePatterns(): Record<string, unknown> {
    const hourlyDistribution: Record<number, number> = {};
    const dayDistribution: Record<string, number> = {};
    
    for (const session of this.sessions) {
      const hour = session.timestamp.getHours();
      const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][session.timestamp.getDay()];
      
      hourlyDistribution[hour] = (hourlyDistribution[hour] || 0) + 1;
      dayDistribution[day] = (dayDistribution[day] || 0) + 1;
    }
    
    return {
      peakListeningHour: this.findPeakHour(hourlyDistribution),
      weekendVsWeekday: this.analyzeWeekendPattern(),
      hourlyDistribution,
      dayDistribution,
    };
  }

  private findPeakHour(distribution: Record<number, number>): number {
    let peakHour = 0;
    let maxCount = 0;
    
    for (const [hour, count] of Object.entries(distribution)) {
      if (count > maxCount) {
        maxCount = count;
        peakHour = parseInt(hour);
      }
    }
    
    return peakHour;
  }

  private analyzeWeekendPattern(): string {
    const weekend = this.sessions.filter(s => {
      const day = s.timestamp.getDay();
      return day === 0 || day === 6;
    });
    
    const weekday = this.sessions.filter(s => {
      const day = s.timestamp.getDay();
      return day >= 1 && day <= 5;
    });
    
    const weekendAvgEnergy = weekend.reduce((sum, s) => sum + s.track.energy, 0) / weekend.length;
    const weekdayAvgEnergy = weekday.reduce((sum, s) => sum + s.track.energy, 0) / weekday.length;
    
    if (weekendAvgEnergy > weekdayAvgEnergy * 1.2) {
      return 'weekend-party-mode';
    } else if (weekdayAvgEnergy > weekendAvgEnergy * 1.2) {
      return 'weekday-energizer';
    }
    
    return 'consistent';
  }

  calculateMetrics(): void {
    const uniqueArtists = new Set(this.sessions.map(s => s.track.artist));
    const uniqueTracks = new Set(this.sessions.map(s => `${s.track.artist}-${s.track.title}`));
    
    this.dna.discoveryRate = uniqueTracks.size / this.sessions.length;
    
    const repeatCount = this.sessions.filter(s => s.repeated).length;
    const topArtistPlays = Math.max(...Array.from(this.artists.values()));
    
    this.dna.loyaltyScore = (repeatCount / this.sessions.length) * 0.5 + 
                            (topArtistPlays / this.sessions.length) * 0.5;
  }

  generateReport(): void {
    this.calculateMetrics();
    
    this.setContent({
      totalSessions: this.sessions.length,
      listeningPersonality: this.generateListeningPersonality(),
      dna: {
        genreDistribution: Object.fromEntries(this.dna.genreDistribution),
        tempoPreference: this.dna.tempoPreference,
        averageEnergy: this.dna.energyProfile.reduce((a, b) => a + b, 0) / this.dna.energyProfile.length,
        emotionalSignature: Object.fromEntries(this.dna.emotionalSignature),
        discoveryRate: this.dna.discoveryRate,
        loyaltyScore: this.dna.loyaltyScore,
      },
      topArtists: Array.from(this.artists.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([artist, plays]) => ({ artist, plays })),
      skipPatterns: Object.fromEntries(this.skipPatterns),
      timePatterns: this.analyzeTimePatterns(),
      recommendations: this.generateRecommendations(),
    });
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    
    if (this.dna.discoveryRate < 0.2) {
      recommendations.push('Try discovery playlists to expand your musical horizons');
    }
    
    if (this.skipPatterns.get('energy-mismatch')! > 5) {
      recommendations.push('Create context-specific playlists for better mood matching');
    }
    
    const avgValence = this.sessions.reduce((sum, s) => sum + s.track.valence, 0) / this.sessions.length;
    if (avgValence < 0.3) {
      recommendations.push('Consider adding more uplifting tracks to balance emotional content');
    }
    
    return recommendations;
  }

  async export(): Promise<string> {
    this.generateReport();
    return await this.save();
  }
}