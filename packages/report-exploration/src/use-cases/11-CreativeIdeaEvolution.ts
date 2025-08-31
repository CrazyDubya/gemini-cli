/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseReport } from '../core/BaseReport.js';

interface Idea {
  id: string;
  timestamp: Date;
  title: string;
  description: string;
  category: string;
  tags: string[];
  inspirations: string[];
  stage: 'spark' | 'concept' | 'development' | 'prototype' | 'refined' | 'abandoned';
  feasibility: number;
  originality: number;
  impact: number;
  resources: string[];
  connections: string[];
}

interface IdeaEvolution {
  parentId?: string;
  mutations: string[];
  crossPollination?: string[];
  iterationNumber: number;
}

interface CreativeSession {
  timestamp: Date;
  duration: number;
  mood: string;
  environment: string;
  techniques: string[];
  ideasGenerated: number;
  quality: number;
}

export class CreativeIdeaEvolutionReport extends BaseReport {
  private ideas: Map<string, Idea> = new Map();
  private evolutions: Map<string, IdeaEvolution> = new Map();
  private sessions: CreativeSession[] = [];
  private ideaClusters: Map<string, Set<string>> = new Map();

  constructor() {
    super('creative-idea-evolution');
    this.setTag('innovation');
    this.setTag('creativity');
  }

  addIdea(idea: Idea, evolution?: IdeaEvolution): void {
    this.ideas.set(idea.id, idea);
    
    if (evolution) {
      this.evolutions.set(idea.id, evolution);
      this.trackLineage(idea.id, evolution);
    }
    
    this.clusterIdea(idea);
    this.analyzeConnections(idea);
  }

  private trackLineage(ideaId: string, evolution: IdeaEvolution): void {
    if (evolution.parentId) {
      const parent = this.ideas.get(evolution.parentId);
      if (parent) {
        parent.connections.push(ideaId);
      }
    }
    
    if (evolution.crossPollination) {
      evolution.crossPollination.forEach(sourceId => {
        const source = this.ideas.get(sourceId);
        if (source) {
          source.connections.push(ideaId);
        }
      });
    }
  }

  private clusterIdea(idea: Idea): void {
    const clusterKey = this.generateClusterKey(idea);
    
    if (!this.ideaClusters.has(clusterKey)) {
      this.ideaClusters.set(clusterKey, new Set());
    }
    
    this.ideaClusters.get(clusterKey)!.add(idea.id);
  }

  private generateClusterKey(idea: Idea): string {
    const primaryTag = idea.tags[0] || 'uncategorized';
    const category = idea.category;
    return `${category}-${primaryTag}`;
  }

  private analyzeConnections(idea: Idea): void {
    const similarIdeas = this.findSimilarIdeas(idea);
    
    similarIdeas.forEach(similarId => {
      if (!idea.connections.includes(similarId)) {
        idea.connections.push(similarId);
      }
    });
  }

  private findSimilarIdeas(idea: Idea): string[] {
    const similar: string[] = [];
    
    this.ideas.forEach((otherIdea, otherId) => {
      if (otherId === idea.id) return;
      
      const tagOverlap = idea.tags.filter(tag => otherIdea.tags.includes(tag)).length;
      const categoryMatch = idea.category === otherIdea.category;
      
      if (tagOverlap >= 2 || (categoryMatch && tagOverlap >= 1)) {
        similar.push(otherId);
      }
    });
    
    return similar;
  }

  recordCreativeSession(session: CreativeSession): void {
    this.sessions.push(session);
  }

  analyzeEvolutionPatterns(): Record<string, unknown> {
    const patterns = {
      mutationFrequency: this.calculateMutationFrequency(),
      crossPollinationRate: this.calculateCrossPollinationRate(),
      abandonmentRate: this.calculateAbandonmentRate(),
      evolutionDepth: this.calculateEvolutionDepth(),
      convergentEvolution: this.findConvergentEvolution(),
    };
    
    return patterns;
  }

  private calculateMutationFrequency(): number {
    let totalMutations = 0;
    
    this.evolutions.forEach(evolution => {
      totalMutations += evolution.mutations.length;
    });
    
    return this.evolutions.size > 0 ? totalMutations / this.evolutions.size : 0;
  }

  private calculateCrossPollinationRate(): number {
    let crossPollinated = 0;
    
    this.evolutions.forEach(evolution => {
      if (evolution.crossPollination && evolution.crossPollination.length > 0) {
        crossPollinated++;
      }
    });
    
    return this.evolutions.size > 0 ? crossPollinated / this.evolutions.size : 0;
  }

  private calculateAbandonmentRate(): number {
    const abandoned = Array.from(this.ideas.values()).filter(idea => idea.stage === 'abandoned').length;
    return this.ideas.size > 0 ? abandoned / this.ideas.size : 0;
  }

  private calculateEvolutionDepth(): number {
    let maxDepth = 0;
    
    this.evolutions.forEach(evolution => {
      maxDepth = Math.max(maxDepth, evolution.iterationNumber);
    });
    
    return maxDepth;
  }

  private findConvergentEvolution(): Array<{ ideas: string[]; commonTraits: string[] }> {
    const convergent: Array<{ ideas: string[]; commonTraits: string[] }> = [];
    
    this.ideaClusters.forEach(cluster => {
      if (cluster.size >= 3) {
        const clusterIdeas = Array.from(cluster).map(id => this.ideas.get(id)!);
        const commonTags = this.findCommonTags(clusterIdeas);
        
        if (commonTags.length >= 2) {
          convergent.push({
            ideas: Array.from(cluster),
            commonTraits: commonTags,
          });
        }
      }
    });
    
    return convergent;
  }

  private findCommonTags(ideas: Idea[]): string[] {
    if (ideas.length === 0) return [];
    
    const tagCounts = new Map<string, number>();
    
    ideas.forEach(idea => {
      idea.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });
    
    return Array.from(tagCounts.entries())
      .filter(([_, count]) => count === ideas.length)
      .map(([tag]) => tag);
  }

  identifyBreakthroughIdeas(): Idea[] {
    return Array.from(this.ideas.values())
      .filter(idea => 
        idea.originality >= 4 && 
        idea.impact >= 4 && 
        idea.feasibility >= 3
      )
      .sort((a, b) => (b.originality + b.impact) - (a.originality + a.impact));
  }

  generateIdeaGenealogy(ideaId: string): Record<string, unknown> | null {
    const idea = this.ideas.get(ideaId);
    if (!idea) return null;
    
    const evolution = this.evolutions.get(ideaId);
    const genealogy: Record<string, unknown> = {
      current: idea,
      ancestors: [],
      descendants: [],
      siblings: [],
    };
    
    if (evolution?.parentId) {
      genealogy.ancestors = this.traceAncestors(evolution.parentId);
    }
    
    genealogy.descendants = this.findDescendants(ideaId);
    genealogy.siblings = this.findSiblings(ideaId, evolution?.parentId);
    
    return genealogy;
  }

  private traceAncestors(ideaId: string): Array<{ id: string; generation: number }> {
    const ancestors: Array<{ id: string; generation: number }> = [];
    let currentId = ideaId;
    let generation = 1;
    
    while (currentId) {
      ancestors.push({ id: currentId, generation });
      const evolution = this.evolutions.get(currentId);
      currentId = evolution?.parentId || '';
      generation++;
    }
    
    return ancestors;
  }

  private findDescendants(ideaId: string): string[] {
    const descendants: string[] = [];
    
    this.evolutions.forEach((evolution, childId) => {
      if (evolution.parentId === ideaId) {
        descendants.push(childId);
        descendants.push(...this.findDescendants(childId));
      }
    });
    
    return descendants;
  }

  private findSiblings(ideaId: string, parentId?: string): string[] {
    if (!parentId) return [];
    
    const siblings: string[] = [];
    
    this.evolutions.forEach((evolution, siblingId) => {
      if (evolution.parentId === parentId && siblingId !== ideaId) {
        siblings.push(siblingId);
      }
    });
    
    return siblings;
  }

  analyzeCreativePatterns(): Record<string, unknown> {
    const patterns: Record<string, unknown> = {};
    
    patterns.productiveTimes = this.findProductiveTimes();
    patterns.effectiveTechniques = this.findEffectiveTechniques();
    patterns.inspirationSources = this.analyzeInspirationSources();
    patterns.ideaVelocity = this.calculateIdeaVelocity();
    
    return patterns;
  }

  private findProductiveTimes(): Record<string, number> {
    const timeProductivity: Record<string, { ideas: number; quality: number }> = {};
    
    this.sessions.forEach(session => {
      const hour = session.timestamp.getHours();
      const timeSlot = this.getTimeSlot(hour);
      
      if (!timeProductivity[timeSlot]) {
        timeProductivity[timeSlot] = { ideas: 0, quality: 0 };
      }
      
      timeProductivity[timeSlot].ideas += session.ideasGenerated;
      timeProductivity[timeSlot].quality += session.quality;
    });
    
    const normalized: Record<string, number> = {};
    
    Object.entries(timeProductivity).forEach(([slot, data]) => {
      const sessionCount = this.sessions.filter(s => 
        this.getTimeSlot(s.timestamp.getHours()) === slot
      ).length;
      
      normalized[slot] = sessionCount > 0 
        ? (data.ideas / sessionCount) * (data.quality / sessionCount) 
        : 0;
    });
    
    return normalized;
  }

  private getTimeSlot(hour: number): string {
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 22) return 'evening';
    return 'night';
  }

  private findEffectiveTechniques(): Array<{ technique: string; effectiveness: number }> {
    const techniqueStats = new Map<string, { totalQuality: number; count: number }>();
    
    this.sessions.forEach(session => {
      session.techniques.forEach(technique => {
        if (!techniqueStats.has(technique)) {
          techniqueStats.set(technique, { totalQuality: 0, count: 0 });
        }
        
        const stats = techniqueStats.get(technique)!;
        stats.totalQuality += session.quality * session.ideasGenerated;
        stats.count++;
      });
    });
    
    return Array.from(techniqueStats.entries())
      .map(([technique, stats]) => ({
        technique,
        effectiveness: stats.totalQuality / stats.count,
      }))
      .sort((a, b) => b.effectiveness - a.effectiveness);
  }

  private analyzeInspirationSources(): Record<string, number> {
    const sources = new Map<string, number>();
    
    this.ideas.forEach(idea => {
      idea.inspirations.forEach(inspiration => {
        sources.set(inspiration, (sources.get(inspiration) || 0) + 1);
      });
    });
    
    return Object.fromEntries(sources);
  }

  private calculateIdeaVelocity(): number {
    if (this.sessions.length === 0) return 0;
    
    const firstSession = this.sessions[0].timestamp;
    const lastSession = this.sessions[this.sessions.length - 1].timestamp;
    const daySpan = (lastSession.getTime() - firstSession.getTime()) / (1000 * 60 * 60 * 24);
    
    return daySpan > 0 ? this.ideas.size / daySpan : 0;
  }

  suggestNextSteps(): string[] {
    const suggestions: string[] = [];
    
    const breakthroughs = this.identifyBreakthroughIdeas();
    if (breakthroughs.length > 0) {
      suggestions.push(`Develop prototype for: ${breakthroughs[0].title}`);
    }
    
    const abandonmentRate = this.calculateAbandonmentRate();
    if (abandonmentRate > 0.4) {
      suggestions.push('Review abandoned ideas for salvageable concepts');
    }
    
    const crossPollinationRate = this.calculateCrossPollinationRate();
    if (crossPollinationRate < 0.2) {
      suggestions.push('Try combining ideas from different categories');
    }
    
    const patterns = this.analyzeCreativePatterns();
    const bestTime = Object.entries(patterns.productiveTimes as Record<string, number>)
      .sort((a, b) => b[1] - a[1])[0];
    
    if (bestTime) {
      suggestions.push(`Schedule creative sessions during ${bestTime[0]}`);
    }
    
    const stagnantIdeas = Array.from(this.ideas.values())
      .filter(idea => idea.stage === 'concept' || idea.stage === 'development')
      .filter(idea => !this.hasRecentEvolution(idea.id));
    
    if (stagnantIdeas.length > 0) {
      suggestions.push(`Revisit stagnant idea: ${stagnantIdeas[0].title}`);
    }
    
    return suggestions;
  }

  private hasRecentEvolution(ideaId: string): boolean {
    const descendants = this.findDescendants(ideaId);
    
    if (descendants.length === 0) return false;
    
    const recentDescendant = descendants.find(descId => {
      const desc = this.ideas.get(descId);
      if (!desc) return false;
      
      const daysSince = (Date.now() - desc.timestamp.getTime()) / (1000 * 60 * 60 * 24);
      return daysSince < 30;
    });
    
    return !!recentDescendant;
  }

  generateReport(): void {
    this.setContent({
      totalIdeas: this.ideas.size,
      activeIdeas: Array.from(this.ideas.values()).filter(i => i.stage !== 'abandoned').length,
      breakthroughIdeas: this.identifyBreakthroughIdeas().length,
      evolutionPatterns: this.analyzeEvolutionPatterns(),
      creativePatterns: this.analyzeCreativePatterns(),
      ideaClusters: Array.from(this.ideaClusters.entries()).map(([key, ids]) => ({
        cluster: key,
        size: ids.size,
        ideas: Array.from(ids),
      })),
      networkMetrics: {
        connectivity: this.calculateNetworkConnectivity(),
        centralIdeas: this.findCentralIdeas(),
        isolatedIdeas: this.findIsolatedIdeas(),
      },
      recommendations: this.suggestNextSteps(),
      creativityScore: this.calculateCreativityScore(),
    });
  }

  private calculateNetworkConnectivity(): number {
    let totalConnections = 0;
    
    this.ideas.forEach(idea => {
      totalConnections += idea.connections.length;
    });
    
    const maxPossible = this.ideas.size * (this.ideas.size - 1);
    return maxPossible > 0 ? totalConnections / maxPossible : 0;
  }

  private findCentralIdeas(): string[] {
    return Array.from(this.ideas.entries())
      .sort((a, b) => b[1].connections.length - a[1].connections.length)
      .slice(0, 5)
      .map(([id]) => id);
  }

  private findIsolatedIdeas(): string[] {
    return Array.from(this.ideas.entries())
      .filter(([_, idea]) => idea.connections.length === 0)
      .map(([id]) => id);
  }

  private calculateCreativityScore(): number {
    const diversityScore = this.ideaClusters.size / Math.max(1, this.ideas.size / 10);
    const evolutionScore = this.calculateEvolutionDepth() / 10;
    const qualityScore = Array.from(this.ideas.values())
      .reduce((sum, idea) => sum + (idea.originality + idea.impact) / 10, 0) / this.ideas.size;
    const velocityScore = Math.min(1, this.calculateIdeaVelocity() / 5);
    
    return (diversityScore * 0.25 + evolutionScore * 0.25 + qualityScore * 0.3 + velocityScore * 0.2);
  }

  async export(): Promise<string> {
    this.generateReport();
    return await this.save();
  }
}