/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseReport } from '../core/BaseReport.js';

interface ConversationTurn {
  timestamp: Date;
  speaker: string;
  text: string;
  duration: number;
  wordCount: number;
  sentiment: number;
  energy: number;
  interruption: boolean;
  questions: number;
  statements: number;
  agreements: number;
  disagreements: number;
}

interface Participant {
  id: string;
  name: string;
  role?: string;
  dominance: number;
  engagement: number;
  positivity: number;
}

interface ConversationMetrics {
  balance: number;
  flow: number;
  productivity: number;
  tension: number;
  rapport: number;
}

export class ConversationDynamicsReport extends BaseReport {
  private turns: ConversationTurn[] = [];
  private participants: Map<string, Participant> = new Map();
  private topics: Map<string, { mentions: number; sentiment: number }> = new Map();
  private metrics: ConversationMetrics;

  constructor() {
    super('conversation-dynamics');
    this.setTag('communication');
    this.setTag('team-dynamics');
    this.metrics = {
      balance: 0,
      flow: 0,
      productivity: 0,
      tension: 0,
      rapport: 0,
    };
  }

  addParticipant(participant: Participant): void {
    this.participants.set(participant.id, participant);
  }

  recordTurn(turn: ConversationTurn): void {
    this.turns.push(turn);
    this.updateParticipantMetrics(turn);
    this.detectPatterns(turn);
  }

  private updateParticipantMetrics(turn: ConversationTurn): void {
    const participant = this.participants.get(turn.speaker);
    if (!participant) return;
    
    const speakerTurns = this.turns.filter(t => t.speaker === turn.speaker);
    const totalTurns = this.turns.length;
    
    participant.dominance = speakerTurns.length / totalTurns;
    
    const avgWordCount = speakerTurns.reduce((sum, t) => sum + t.wordCount, 0) / speakerTurns.length;
    const avgQuestions = speakerTurns.reduce((sum, t) => sum + t.questions, 0) / speakerTurns.length;
    participant.engagement = (avgWordCount / 50) * 0.5 + avgQuestions * 0.5;
    
    const avgSentiment = speakerTurns.reduce((sum, t) => sum + t.sentiment, 0) / speakerTurns.length;
    participant.positivity = avgSentiment;
  }

  private detectPatterns(turn: ConversationTurn): void {
    if (turn.interruption) {
      this.metrics.tension += 0.1;
      this.setTag('high-interruptions');
    }
    
    if (turn.disagreements > turn.agreements) {
      this.metrics.tension += 0.05;
    } else if (turn.agreements > turn.disagreements) {
      this.metrics.rapport += 0.05;
    }
  }

  trackTopic(topic: string, sentiment: number): void {
    if (!this.topics.has(topic)) {
      this.topics.set(topic, { mentions: 0, sentiment: 0 });
    }
    
    const topicData = this.topics.get(topic)!;
    topicData.mentions++;
    topicData.sentiment = (topicData.sentiment * (topicData.mentions - 1) + sentiment) / topicData.mentions;
  }

  calculateConversationMetrics(): void {
    this.metrics.balance = this.calculateBalance();
    this.metrics.flow = this.calculateFlow();
    this.metrics.productivity = this.calculateProductivity();
    this.metrics.rapport = this.calculateRapport();
    
    this.metrics.tension = Math.min(1, Math.max(0, this.metrics.tension));
    this.metrics.rapport = Math.min(1, Math.max(0, this.metrics.rapport));
  }

  private calculateBalance(): number {
    const participantTurns = new Map<string, number>();
    
    this.turns.forEach(turn => {
      participantTurns.set(turn.speaker, (participantTurns.get(turn.speaker) || 0) + 1);
    });
    
    const turnCounts = Array.from(participantTurns.values());
    const avgTurns = turnCounts.reduce((a, b) => a + b, 0) / turnCounts.length;
    const variance = turnCounts.reduce((sum, count) => sum + Math.pow(count - avgTurns, 2), 0) / turnCounts.length;
    
    return Math.max(0, 1 - (Math.sqrt(variance) / avgTurns));
  }

  private calculateFlow(): number {
    if (this.turns.length < 2) return 0;
    
    let smoothTransitions = 0;
    
    for (let i = 1; i < this.turns.length; i++) {
      const prev = this.turns[i - 1];
      const curr = this.turns[i];
      
      if (!curr.interruption && Math.abs(curr.energy - prev.energy) < 0.3) {
        smoothTransitions++;
      }
    }
    
    return smoothTransitions / (this.turns.length - 1);
  }

  private calculateProductivity(): number {
    const totalQuestions = this.turns.reduce((sum, t) => sum + t.questions, 0);
    const totalStatements = this.turns.reduce((sum, t) => sum + t.statements, 0);
    
    const questionRatio = totalQuestions / (totalQuestions + totalStatements);
    const topicDiversity = this.topics.size / Math.max(1, this.turns.length / 10);
    
    return questionRatio * 0.3 + Math.min(1, topicDiversity) * 0.7;
  }

  private calculateRapport(): number {
    const totalAgreements = this.turns.reduce((sum, t) => sum + t.agreements, 0);
    const totalDisagreements = this.turns.reduce((sum, t) => sum + t.disagreements, 0);
    
    if (totalAgreements + totalDisagreements === 0) return 0.5;
    
    const agreementRatio = totalAgreements / (totalAgreements + totalDisagreements);
    const avgSentiment = this.turns.reduce((sum, t) => sum + t.sentiment, 0) / this.turns.length;
    
    return agreementRatio * 0.5 + (avgSentiment + 1) / 2 * 0.5;
  }

  identifyDominantSpeakers(): Array<{ speaker: string; dominance: number }> {
    return Array.from(this.participants.entries())
      .map(([id, participant]) => ({ speaker: participant.name, dominance: participant.dominance }))
      .sort((a, b) => b.dominance - a.dominance)
      .slice(0, 3);
  }

  analyzeTurnTakingPatterns(): Record<string, unknown> {
    const patterns: Record<string, unknown> = {};
    
    patterns.averageTurnLength = this.turns.reduce((sum, t) => sum + t.duration, 0) / this.turns.length;
    patterns.turnDistribution = this.calculateTurnDistribution();
    patterns.interruptionRate = this.calculateInterruptionRate();
    patterns.responseTime = this.calculateAverageResponseTime();
    
    return patterns;
  }

  private calculateTurnDistribution(): Record<string, number> {
    const distribution: Record<string, number> = {};
    
    this.participants.forEach((participant, id) => {
      const turns = this.turns.filter(t => t.speaker === id).length;
      distribution[participant.name] = turns;
    });
    
    return distribution;
  }

  private calculateInterruptionRate(): number {
    const interruptions = this.turns.filter(t => t.interruption).length;
    return this.turns.length > 0 ? interruptions / this.turns.length : 0;
  }

  private calculateAverageResponseTime(): number {
    if (this.turns.length < 2) return 0;
    
    let totalResponseTime = 0;
    let responses = 0;
    
    for (let i = 1; i < this.turns.length; i++) {
      if (this.turns[i].speaker !== this.turns[i - 1].speaker) {
        const timeDiff = this.turns[i].timestamp.getTime() - this.turns[i - 1].timestamp.getTime();
        totalResponseTime += timeDiff;
        responses++;
      }
    }
    
    return responses > 0 ? totalResponseTime / responses / 1000 : 0;
  }

  identifyConversationPhases(): Array<{ phase: string; start: number; end: number; characteristics: string[] }> {
    const phases: Array<{ phase: string; start: number; end: number; characteristics: string[] }> = [];
    
    const windowSize = Math.max(5, Math.floor(this.turns.length / 10));
    
    for (let i = 0; i < this.turns.length; i += windowSize) {
      const window = this.turns.slice(i, Math.min(i + windowSize, this.turns.length));
      const phase = this.characterizePhase(window);
      
      phases.push({
        phase: phase.name,
        start: i,
        end: Math.min(i + windowSize - 1, this.turns.length - 1),
        characteristics: phase.characteristics,
      });
    }
    
    return phases;
  }

  private characterizePhase(turns: ConversationTurn[]): { name: string; characteristics: string[] } {
    const avgEnergy = turns.reduce((sum, t) => sum + t.energy, 0) / turns.length;
    const avgSentiment = turns.reduce((sum, t) => sum + t.sentiment, 0) / turns.length;
    const questionRatio = turns.reduce((sum, t) => sum + t.questions, 0) / 
                         turns.reduce((sum, t) => sum + t.questions + t.statements, 0);
    
    const characteristics: string[] = [];
    let phaseName = 'discussion';
    
    if (questionRatio > 0.6) {
      phaseName = 'exploration';
      characteristics.push('question-heavy');
    } else if (avgEnergy > 0.7) {
      phaseName = 'debate';
      characteristics.push('high-energy');
    } else if (avgSentiment < -0.3) {
      phaseName = 'conflict';
      characteristics.push('negative-sentiment');
    } else if (avgSentiment > 0.3 && avgEnergy < 0.3) {
      phaseName = 'consensus';
      characteristics.push('positive-calm');
    }
    
    if (turns.filter(t => t.interruption).length > turns.length * 0.3) {
      characteristics.push('frequent-interruptions');
    }
    
    return { name: phaseName, characteristics };
  }

  generateCommunicationInsights(): string[] {
    const insights: string[] = [];
    
    const dominantSpeakers = this.identifyDominantSpeakers();
    if (dominantSpeakers[0].dominance > 0.5) {
      insights.push(`${dominantSpeakers[0].speaker} dominated the conversation (${(dominantSpeakers[0].dominance * 100).toFixed(0)}% of turns)`);
    }
    
    if (this.metrics.balance < 0.3) {
      insights.push('Conversation was heavily imbalanced - consider encouraging quieter participants');
    }
    
    if (this.metrics.tension > 0.7) {
      insights.push('High tension detected - consider facilitation or breaks');
    }
    
    if (this.metrics.flow > 0.7) {
      insights.push('Excellent conversational flow with smooth transitions');
    }
    
    const interruptionRate = this.calculateInterruptionRate();
    if (interruptionRate > 0.3) {
      insights.push('High interruption rate may be hindering effective communication');
    }
    
    if (this.metrics.productivity < 0.3) {
      insights.push('Low productivity - consider adding structure or clear objectives');
    }
    
    return insights;
  }

  predictNextTurn(): { likelySpeaker: string; predictedEnergy: number; confidence: number } | null {
    if (this.turns.length < 10) return null;
    
    const recentTurns = this.turns.slice(-5);
    const speakerCounts = new Map<string, number>();
    
    recentTurns.forEach(turn => {
      speakerCounts.set(turn.speaker, (speakerCounts.get(turn.speaker) || 0) + 1);
    });
    
    const leastRecent = Array.from(this.participants.keys()).find(id => 
      !speakerCounts.has(id) || speakerCounts.get(id)! < 2
    );
    
    const avgEnergy = recentTurns.reduce((sum, t) => sum + t.energy, 0) / recentTurns.length;
    
    return {
      likelySpeaker: leastRecent || Array.from(this.participants.keys())[0],
      predictedEnergy: avgEnergy,
      confidence: leastRecent ? 0.7 : 0.3,
    };
  }

  generateNetworkGraph(): Record<string, unknown> {
    const nodes = Array.from(this.participants.values()).map(p => ({
      id: p.id,
      name: p.name,
      size: p.dominance * 100,
      color: p.positivity > 0 ? 'green' : p.positivity < 0 ? 'red' : 'gray',
    }));
    
    const edges: Array<{ source: string; target: string; weight: number }> = [];
    
    for (let i = 1; i < this.turns.length; i++) {
      if (this.turns[i].speaker !== this.turns[i - 1].speaker) {
        const key = `${this.turns[i - 1].speaker}-${this.turns[i].speaker}`;
        const existing = edges.find(e => 
          (e.source === this.turns[i - 1].speaker && e.target === this.turns[i].speaker) ||
          (e.source === this.turns[i].speaker && e.target === this.turns[i - 1].speaker)
        );
        
        if (existing) {
          existing.weight++;
        } else {
          edges.push({
            source: this.turns[i - 1].speaker,
            target: this.turns[i].speaker,
            weight: 1,
          });
        }
      }
    }
    
    return { nodes, edges };
  }

  generateReport(): void {
    this.calculateConversationMetrics();
    
    this.setContent({
      duration: this.calculateTotalDuration(),
      totalTurns: this.turns.length,
      participants: Array.from(this.participants.values()),
      metrics: this.metrics,
      dominantSpeakers: this.identifyDominantSpeakers(),
      turnTakingPatterns: this.analyzeTurnTakingPatterns(),
      phases: this.identifyConversationPhases(),
      topics: Array.from(this.topics.entries()).map(([topic, data]) => ({
        topic,
        mentions: data.mentions,
        sentiment: data.sentiment,
      })),
      insights: this.generateCommunicationInsights(),
      networkGraph: this.generateNetworkGraph(),
      recommendations: this.generateRecommendations(),
      prediction: this.predictNextTurn(),
    });
  }

  private calculateTotalDuration(): number {
    if (this.turns.length === 0) return 0;
    
    const start = this.turns[0].timestamp.getTime();
    const end = this.turns[this.turns.length - 1].timestamp.getTime();
    
    return (end - start) / 1000 / 60;
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    
    if (this.metrics.balance < 0.5) {
      recommendations.push('Use round-robin or structured turn-taking to improve balance');
    }
    
    if (this.metrics.tension > 0.6) {
      recommendations.push('Introduce a neutral facilitator or mediator');
    }
    
    if (this.metrics.productivity < 0.4) {
      recommendations.push('Set clear agenda items and time limits');
    }
    
    if (this.metrics.flow < 0.4) {
      recommendations.push('Practice active listening and build on others\' ideas');
    }
    
    const quietParticipants = Array.from(this.participants.values())
      .filter(p => p.dominance < 0.1);
    
    if (quietParticipants.length > 0) {
      recommendations.push(`Directly invite input from: ${quietParticipants.map(p => p.name).join(', ')}`);
    }
    
    return recommendations;
  }

  async export(): Promise<string> {
    this.generateReport();
    return await this.save();
  }
}