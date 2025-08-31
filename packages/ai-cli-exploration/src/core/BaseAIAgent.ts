/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AIContext {
  role: string;
  personality?: string;
  constraints?: string[];
  knowledge?: string[];
  goals?: string[];
}

export interface ConversationTurn {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface AgentCapabilities {
  canExecuteCode?: boolean;
  canAccessFiles?: boolean;
  canMakeDecisions?: boolean;
  canLearn?: boolean;
  canRemember?: boolean;
}

export abstract class BaseAIAgent {
  protected context: AIContext;
  protected history: ConversationTurn[] = [];
  protected capabilities: AgentCapabilities;
  protected memory: Map<string, unknown> = new Map();

  constructor(context: AIContext, capabilities: AgentCapabilities = {}) {
    this.context = context;
    this.capabilities = capabilities;
  }

  abstract processInput(input: string): Promise<string>;
  abstract generatePrompt(): string;

  addTurn(turn: ConversationTurn): void {
    this.history.push(turn);
    if (this.history.length > 100) {
      this.compressHistory();
    }
  }

  protected compressHistory(): void {
    // Keep first 10 and last 40 turns
    if (this.history.length > 50) {
      const compressed = [
        ...this.history.slice(0, 10),
        {
          role: 'system' as const,
          content: `[${this.history.length - 50} turns compressed]`,
          timestamp: new Date(),
        },
        ...this.history.slice(-40),
      ];
      this.history = compressed;
    }
  }

  remember(key: string, value: unknown): void {
    if (this.capabilities.canRemember) {
      this.memory.set(key, value);
    }
  }

  recall(key: string): unknown | undefined {
    return this.memory.get(key);
  }

  getSystemPrompt(): string {
    const parts = [`You are ${this.context.role}.`];
    
    if (this.context.personality) {
      parts.push(`Your personality: ${this.context.personality}`);
    }
    
    if (this.context.constraints?.length) {
      parts.push(`Constraints: ${this.context.constraints.join(', ')}`);
    }
    
    if (this.context.knowledge?.length) {
      parts.push(`Your knowledge includes: ${this.context.knowledge.join(', ')}`);
    }
    
    if (this.context.goals?.length) {
      parts.push(`Your goals: ${this.context.goals.join(', ')}`);
    }
    
    return parts.join('\n');
  }

  async makeDecision(options: string[]): Promise<string> {
    if (!this.capabilities.canMakeDecisions) {
      return options[0];
    }
    
    // Simulate decision-making based on context and history
    const weights = options.map(() => Math.random());
    const maxIndex = weights.indexOf(Math.max(...weights));
    return options[maxIndex];
  }

  reset(): void {
    this.history = [];
    this.memory.clear();
  }
}