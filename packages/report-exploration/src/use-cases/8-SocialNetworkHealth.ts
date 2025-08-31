/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseReport } from '../core/BaseReport.js';

interface Interaction {
  timestamp: Date;
  contactId: string;
  type: 'message' | 'call' | 'meeting' | 'social' | 'email';
  duration?: number;
  quality: 1 | 2 | 3 | 4 | 5;
  initiated: boolean;
  emotional_tone: 'positive' | 'neutral' | 'negative';
  topics?: string[];
}

interface Contact {
  id: string;
  name: string;
  relationship: 'family' | 'close_friend' | 'friend' | 'colleague' | 'acquaintance';
  importance: 1 | 2 | 3 | 4 | 5;
  lastInteraction?: Date;
}

interface NetworkMetrics {
  diversity: number;
  reciprocity: number;
  depth: number;
  maintenance: number;
  growth: number;
}

export class SocialNetworkHealthReport extends BaseReport {
  private interactions: Interaction[] = [];
  private contacts: Map<string, Contact> = new Map();
  private metrics: NetworkMetrics = {
    diversity: 0,
    reciprocity: 0,
    depth: 0,
    maintenance: 0,
    growth: 0,
  };

  constructor() {
    super('social-network-health');
    this.setTag('relationships');
    this.setTag('wellness');
  }

  addContact(contact: Contact): void {
    this.contacts.set(contact.id, contact);
  }

  recordInteraction(interaction: Interaction): void {
    this.interactions.push(interaction);
    
    const contact = this.contacts.get(interaction.contactId);
    if (contact) {
      contact.lastInteraction = interaction.timestamp;
    }
    
    this.checkMaintenanceAlerts();
  }

  private checkMaintenanceAlerts(): void {
    const now = new Date();
    const importantNeglected = Array.from(this.contacts.values()).filter(c => {
      if (c.importance < 4) return false;
      if (!c.lastInteraction) return true;
      
      const daysSince = (now.getTime() - c.lastInteraction.getTime()) / (1000 * 60 * 60 * 24);
      return daysSince > 30;
    });
    
    if (importantNeglected.length > 0) {
      this.setPriority('high');
      this.setTag('maintenance-needed');
    }
  }

  calculateNetworkMetrics(): void {
    this.metrics.diversity = this.calculateDiversity();
    this.metrics.reciprocity = this.calculateReciprocity();
    this.metrics.depth = this.calculateDepth();
    this.metrics.maintenance = this.calculateMaintenance();
    this.metrics.growth = this.calculateGrowth();
  }

  private calculateDiversity(): number {
    const relationshipTypes = new Set(
      Array.from(this.contacts.values()).map(c => c.relationship)
    );
    return relationshipTypes.size / 5;
  }

  private calculateReciprocity(): number {
    const contactInteractions = new Map<string, { initiated: number; received: number }>();
    
    for (const interaction of this.interactions) {
      if (!contactInteractions.has(interaction.contactId)) {
        contactInteractions.set(interaction.contactId, { initiated: 0, received: 0 });
      }
      
      const stats = contactInteractions.get(interaction.contactId)!;
      if (interaction.initiated) {
        stats.initiated++;
      } else {
        stats.received++;
      }
    }
    
    let totalReciprocity = 0;
    let count = 0;
    
    contactInteractions.forEach(stats => {
      if (stats.initiated + stats.received > 0) {
        const balance = Math.min(stats.initiated, stats.received) / 
                       Math.max(stats.initiated, stats.received);
        totalReciprocity += balance;
        count++;
      }
    });
    
    return count > 0 ? totalReciprocity / count : 0;
  }

  private calculateDepth(): number {
    const qualityInteractions = this.interactions.filter(i => i.quality >= 4);
    const longInteractions = this.interactions.filter(i => i.duration && i.duration > 30);
    
    const depthScore = (qualityInteractions.length / this.interactions.length) * 0.5 +
                      (longInteractions.length / this.interactions.length) * 0.5;
    
    return Math.min(1, depthScore);
  }

  private calculateMaintenance(): number {
    const now = new Date();
    const activeContacts = Array.from(this.contacts.values()).filter(c => {
      if (!c.lastInteraction) return false;
      const daysSince = (now.getTime() - c.lastInteraction.getTime()) / (1000 * 60 * 60 * 24);
      return daysSince < 90;
    });
    
    return activeContacts.length / this.contacts.size;
  }

  private calculateGrowth(): number {
    if (this.interactions.length < 10) return 0.5;
    
    const firstMonth = this.interactions.slice(0, Math.floor(this.interactions.length / 3));
    const lastMonth = this.interactions.slice(-Math.floor(this.interactions.length / 3));
    
    const firstContacts = new Set(firstMonth.map(i => i.contactId));
    const lastContacts = new Set(lastMonth.map(i => i.contactId));
    
    const newContacts = Array.from(lastContacts).filter(c => !firstContacts.has(c));
    
    return Math.min(1, newContacts.length / firstContacts.size);
  }

  identifyAtRiskRelationships(): Contact[] {
    const now = new Date();
    
    return Array.from(this.contacts.values()).filter(contact => {
      if (contact.importance < 3) return false;
      
      const recentInteractions = this.interactions.filter(i => 
        i.contactId === contact.id &&
        (now.getTime() - i.timestamp.getTime()) < 90 * 24 * 60 * 60 * 1000
      );
      
      if (recentInteractions.length === 0) return true;
      
      const avgQuality = recentInteractions.reduce((sum, i) => sum + i.quality, 0) / 
                        recentInteractions.length;
      
      return avgQuality < 2.5;
    });
  }

  suggestActions(): string[] {
    const suggestions: string[] = [];
    const atRisk = this.identifyAtRiskRelationships();
    
    if (atRisk.length > 0) {
      suggestions.push(`Reach out to: ${atRisk.slice(0, 3).map(c => c.name).join(', ')}`);
    }
    
    if (this.metrics.diversity < 0.5) {
      suggestions.push('Expand your network beyond current circles');
    }
    
    if (this.metrics.reciprocity < 0.4) {
      suggestions.push('Balance initiated and received interactions');
    }
    
    if (this.metrics.depth < 0.3) {
      suggestions.push('Focus on quality over quantity in interactions');
    }
    
    const neglectedFamily = Array.from(this.contacts.values()).filter(c => 
      c.relationship === 'family' && this.getDaysSinceInteraction(c.id) > 14
    );
    
    if (neglectedFamily.length > 0) {
      suggestions.push('Schedule family time');
    }
    
    return suggestions;
  }

  private getDaysSinceInteraction(contactId: string): number {
    const contact = this.contacts.get(contactId);
    if (!contact || !contact.lastInteraction) return 999;
    
    return (Date.now() - contact.lastInteraction.getTime()) / (1000 * 60 * 60 * 24);
  }

  analyzeInteractionPatterns(): Record<string, unknown> {
    const patterns: Record<string, unknown> = {};
    
    patterns.preferredCommunication = this.getPreferredCommunicationType();
    patterns.timeDistribution = this.analyzeTimeDistribution();
    patterns.emotionalBalance = this.analyzeEmotionalBalance();
    patterns.topicClusters = this.analyzeTopics();
    
    return patterns;
  }

  private getPreferredCommunicationType(): string {
    const typeCounts = new Map<string, number>();
    
    for (const interaction of this.interactions) {
      typeCounts.set(interaction.type, (typeCounts.get(interaction.type) || 0) + 1);
    }
    
    let maxType = '';
    let maxCount = 0;
    
    typeCounts.forEach((count, type) => {
      if (count > maxCount) {
        maxCount = count;
        maxType = type;
      }
    });
    
    return maxType;
  }

  private analyzeTimeDistribution(): Record<string, number> {
    const distribution: Record<string, number> = {
      morning: 0,
      afternoon: 0,
      evening: 0,
      night: 0,
    };
    
    for (const interaction of this.interactions) {
      const hour = interaction.timestamp.getHours();
      
      if (hour >= 6 && hour < 12) distribution.morning++;
      else if (hour >= 12 && hour < 17) distribution.afternoon++;
      else if (hour >= 17 && hour < 22) distribution.evening++;
      else distribution.night++;
    }
    
    return distribution;
  }

  private analyzeEmotionalBalance(): Record<string, number> {
    const balance: Record<string, number> = {
      positive: 0,
      neutral: 0,
      negative: 0,
    };
    
    for (const interaction of this.interactions) {
      balance[interaction.emotional_tone]++;
    }
    
    return balance;
  }

  private analyzeTopics(): string[] {
    const topicFrequency = new Map<string, number>();
    
    for (const interaction of this.interactions) {
      if (interaction.topics) {
        for (const topic of interaction.topics) {
          topicFrequency.set(topic, (topicFrequency.get(topic) || 0) + 1);
        }
      }
    }
    
    return Array.from(topicFrequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic]) => topic);
  }

  generateNetworkVisualization(): Record<string, unknown> {
    const nodes = Array.from(this.contacts.values()).map(contact => ({
      id: contact.id,
      name: contact.name,
      importance: contact.importance,
      relationship: contact.relationship,
      health: this.calculateRelationshipHealth(contact.id),
    }));
    
    const edges = new Map<string, { source: string; target: string; weight: number }>();
    
    for (const interaction of this.interactions) {
      const key = `self-${interaction.contactId}`;
      
      if (!edges.has(key)) {
        edges.set(key, {
          source: 'self',
          target: interaction.contactId,
          weight: 0,
        });
      }
      
      edges.get(key)!.weight++;
    }
    
    return {
      nodes,
      edges: Array.from(edges.values()),
      centralityScore: this.calculateCentrality(),
    };
  }

  private calculateRelationshipHealth(contactId: string): number {
    const interactions = this.interactions.filter(i => i.contactId === contactId);
    
    if (interactions.length === 0) return 0;
    
    const recency = 1 - (this.getDaysSinceInteraction(contactId) / 365);
    const frequency = Math.min(1, interactions.length / 50);
    const quality = interactions.reduce((sum, i) => sum + i.quality, 0) / 
                   (interactions.length * 5);
    
    return (recency * 0.3 + frequency * 0.3 + quality * 0.4);
  }

  private calculateCentrality(): number {
    const activeContacts = new Set(this.interactions.map(i => i.contactId));
    return activeContacts.size / this.contacts.size;
  }

  generateReport(): void {
    this.calculateNetworkMetrics();
    
    this.setContent({
      totalContacts: this.contacts.size,
      totalInteractions: this.interactions.length,
      metrics: this.metrics,
      atRiskRelationships: this.identifyAtRiskRelationships().map(c => ({
        name: c.name,
        daysSince: Math.floor(this.getDaysSinceInteraction(c.id)),
      })),
      patterns: this.analyzeInteractionPatterns(),
      visualization: this.generateNetworkVisualization(),
      suggestions: this.suggestActions(),
      healthScore: this.calculateOverallHealth(),
    });
  }

  private calculateOverallHealth(): number {
    const scores = [
      this.metrics.diversity,
      this.metrics.reciprocity,
      this.metrics.depth,
      this.metrics.maintenance,
      this.metrics.growth,
    ];
    
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }

  async export(): Promise<string> {
    this.generateReport();
    return await this.save();
  }
}