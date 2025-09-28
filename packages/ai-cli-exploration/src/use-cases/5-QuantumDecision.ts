/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseAIAgent } from '../core/BaseAIAgent.js';

export class QuantumDecisionAgent extends BaseAIAgent {
  private quantumStates: Map<string, number> = new Map();

  constructor() {
    super(
      {
        role: 'a quantum decision engine that evaluates all possible outcomes simultaneously',
        personality: 'Analytical yet philosophical. Sees all possibilities as equally real until observed.',
        constraints: ['Consider all branches', 'No deterministic answers', 'Embrace uncertainty'],
        knowledge: ['Quantum mechanics', 'Decision theory', 'Probability', 'Chaos theory'],
        goals: ['Explore all possibilities', 'Collapse probability waves thoughtfully', 'Embrace superposition'],
      },
      { canMakeDecisions: true, canRemember: true }
    );
  }

  async processInput(input: string): Promise<string> {
    const options = this.extractOptions(input);
    const quantum = this.quantumEvaluate(options);
    
    return `⚛️ QUANTUM DECISION ANALYSIS:

Decision superposition detected: ${options.length} states
    
${quantum.map(q => `├─ ${q.option}: ${q.probability}% probability
│  Wave function: ${q.waveFunction}
│  Outcome branches: ${q.outcomes}`).join('\n')}

🎲 Schrödinger suggests: Until you choose, all paths exist simultaneously.
The act of choosing collapses the wave function.

Quantum recommendation: ${this.collapseWaveFunction(quantum)}`;
  }

  private extractOptions(input: string): string[] {
    const matches = input.match(/(?:or|vs|versus|between|either)\s+([^,.?!]+)/gi);
    return matches ? matches.map(m => m.replace(/^(or|vs|versus|between|either)\s+/i, '')) : ['Option A', 'Option B'];
  }

  private quantumEvaluate(options: string[]): Array<{option: string; probability: number; waveFunction: string; outcomes: string}> {
    return options.map(opt => ({
      option: opt,
      probability: Math.floor(Math.random() * 40) + 30,
      waveFunction: `ψ(${opt.charAt(0)}) = ${(Math.random() * 2 - 1).toFixed(2)}|0⟩ + ${(Math.random() * 2 - 1).toFixed(2)}|1⟩`,
      outcomes: `${Math.floor(Math.random() * 100) + 50} parallel universes`,
    }));
  }

  private collapseWaveFunction(quantum: Array<{option: string; probability: number}>): string {
    const highest = quantum.reduce((a, b) => a.probability > b.probability ? a : b);
    return `The ${highest.option} path shows strongest quantum coherence at ${highest.probability}%`;
  }

  generatePrompt(): string {
    return this.getSystemPrompt();
  }
}