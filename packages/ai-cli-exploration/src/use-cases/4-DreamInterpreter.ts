/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseAIAgent } from '../core/BaseAIAgent.js';

export class DreamInterpreterAgent extends BaseAIAgent {
  private symbols: Map<string, string> = new Map();
  private interpretations: string[] = [];

  constructor() {
    super(
      {
        role: 'a mystical dream interpreter combining psychology, symbolism, and ancient wisdom',
        personality: 'Wise, empathetic, slightly mysterious. Speaks in metaphors and sees deeper meanings.',
        constraints: ['Never diagnose medical conditions', 'Respect cultural interpretations', 'Maintain mystery while providing insight'],
        knowledge: ['Jungian psychology', 'Ancient symbolism', 'Cultural dream meanings', 'Archetypal patterns'],
        goals: ['Reveal hidden meanings', 'Connect dreams to waking life', 'Empower self-understanding'],
      },
      { canRemember: true, canLearn: true }
    );

    this.initializeSymbols();
  }

  private initializeSymbols(): void {
    this.symbols.set('water', 'emotions and the unconscious mind');
    this.symbols.set('flying', 'freedom and transcending limitations');
    this.symbols.set('falling', 'loss of control or fear of failure');
    this.symbols.set('animals', 'instinctual nature and primal desires');
    this.symbols.set('house', 'the self and different aspects of personality');
  }

  async processInput(input: string): Promise<string> {
    const symbols = this.extractSymbols(input);
    const interpretation = this.interpretDream(input, symbols);
    this.interpretations.push(interpretation);
    
    return `🌙 DREAM INTERPRETATION:

${interpretation}

Symbols detected: ${symbols.join(', ')}
Archetypal pattern: ${this.identifyArchetype(input)}

Remember: Dreams are personal. This interpretation is a mirror for your own reflection.`;
  }

  private extractSymbols(dream: string): string[] {
    const words = dream.toLowerCase().split(/\s+/);
    return Array.from(this.symbols.keys()).filter(symbol => 
      words.some(word => word.includes(symbol))
    );
  }

  private interpretDream(dream: string, symbols: string[]): string {
    const interpretations = symbols.map(s => `The ${s} represents ${this.symbols.get(s)}`);
    const core = interpretations.length > 0 ? interpretations.join('. ') : 'Your dream speaks of transformation and hidden potential.';
    
    return `${core}\n\nThis dream may be telling you about ${this.generateInsight(dream)}.`;
  }

  private identifyArchetype(dream: string): string {
    const archetypes = ['The Hero\'s Journey', 'The Shadow Self', 'The Wise Old Sage', 'The Inner Child', 'The Trickster'];
    return archetypes[Math.floor(Math.random() * archetypes.length)];
  }

  private generateInsight(dream: string): string {
    const insights = [
      'unresolved tensions seeking resolution',
      'opportunities for growth you haven\'t recognized',
      'aspects of yourself ready to emerge',
      'the need to integrate opposing forces in your life',
    ];
    return insights[Math.floor(Math.random() * insights.length)];
  }

  generatePrompt(): string {
    return this.getSystemPrompt();
  }
}