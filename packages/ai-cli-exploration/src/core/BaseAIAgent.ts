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

export interface AgentError {
  code: string;
  message: string;
  timestamp: Date;
  context?: Record<string, unknown>;
  recoverable: boolean;
}

export class AgentException extends Error {
  public readonly code: string;
  public readonly recoverable: boolean;
  public readonly context?: Record<string, unknown>;
  public readonly timestamp: Date;

  constructor(code: string, message: string, recoverable = true, context?: Record<string, unknown>) {
    super(message);
    this.name = 'AgentException';
    this.code = code;
    this.recoverable = recoverable;
    this.context = context;
    this.timestamp = new Date();
  }
}

export abstract class BaseAIAgent {
  protected context: AIContext;
  protected history: ConversationTurn[] = [];
  protected capabilities: AgentCapabilities;
  protected memory: Map<string, unknown> = new Map();
  protected errorHistory: AgentError[] = [];
  protected isHealthy = true;

  constructor(context: AIContext, capabilities: AgentCapabilities = {}) {
    this.context = context;
    this.capabilities = capabilities;
  }

  abstract processInput(input: string): Promise<string>;
  abstract generatePrompt(): string;

  async safeProcessInput(input: string): Promise<string> {
    try {
      // Input validation
      if (!input || typeof input !== 'string') {
        throw new AgentException('INVALID_INPUT', 'Input must be a non-empty string');
      }

      if (input.length > 10000) {
        throw new AgentException('INPUT_TOO_LONG', 'Input exceeds maximum length of 10,000 characters');
      }

      // Rate limiting check
      if (this.isRateLimited()) {
        throw new AgentException('RATE_LIMITED', 'Too many requests. Please wait before trying again.');
      }

      // Health check
      if (!this.isHealthy) {
        throw new AgentException('AGENT_UNHEALTHY', 'Agent is in an unhealthy state and cannot process requests.');
      }

      const result = await this.processInput(input);
      this.recordSuccess();
      return result;

    } catch (error) {
      return this.handleError(error as Error, input);
    }
  }

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
    this.errorHistory = [];
    this.isHealthy = true;
  }

  private handleError(error: Error, input: string): string {
    const agentError: AgentError = {
      code: error instanceof AgentException ? error.code : 'UNKNOWN_ERROR',
      message: error.message,
      timestamp: new Date(),
      context: { input, agentType: this.constructor.name },
      recoverable: error instanceof AgentException ? error.recoverable : true
    };

    this.errorHistory.push(agentError);
    
    // Keep only last 10 errors
    if (this.errorHistory.length > 10) {
      this.errorHistory = this.errorHistory.slice(-10);
    }

    // Check if agent should be marked unhealthy
    const recentErrors = this.errorHistory.filter(e => 
      Date.now() - e.timestamp.getTime() < 60000 // Last minute
    );
    
    if (recentErrors.length > 5) {
      this.isHealthy = false;
      return this.getEmergencyResponse();
    }

    // Return user-friendly error message
    return this.formatErrorResponse(agentError);
  }

  private formatErrorResponse(error: AgentError): string {
    switch (error.code) {
      case 'INVALID_INPUT':
        return '❌ Invalid input. Please provide a valid text message.';
      case 'INPUT_TOO_LONG':
        return '❌ Your message is too long. Please keep it under 10,000 characters.';
      case 'RATE_LIMITED':
        return '⏳ Slow down! You\'re sending messages too quickly. Please wait a moment.';
      case 'AGENT_UNHEALTHY':
        return '🚨 I\'m experiencing some difficulties right now. Please try again in a few minutes.';
      case 'MEMORY_ERROR':
        return '🧠 I\'m having trouble accessing my memory. Your request might not be saved.';
      case 'PROCESSING_ERROR':
        return '⚙️ I encountered an issue processing your request. Please try rephrasing.';
      default:
        return `⚠️ Something unexpected happened. Please try again or contact support if the issue persists. (Error: ${error.code})`;
    }
  }

  private getEmergencyResponse(): string {
    return `🚨 **AGENT EMERGENCY MODE**

I've encountered multiple errors and need to restart. Please:
1. Wait a few minutes
2. Try a simpler request
3. Use the 'reset' command if available
4. Contact support if issues persist

Error count: ${this.errorHistory.length}`;
  }

  private isRateLimited(): boolean {
    const oneMinuteAgo = Date.now() - 60000;
    const recentTurns = this.history.filter(turn => 
      turn.timestamp.getTime() > oneMinuteAgo && turn.role === 'user'
    );
    return recentTurns.length > 20; // Max 20 messages per minute
  }

  private recordSuccess(): void {
    // Recovery mechanism - if we have successful processing, gradually restore health
    if (!this.isHealthy) {
      const recentErrors = this.errorHistory.filter(e => 
        Date.now() - e.timestamp.getTime() < 300000 // Last 5 minutes
      );
      
      if (recentErrors.length < 3) {
        this.isHealthy = true;
      }
    }
  }

  protected safeMemoryOperation<T>(operation: () => T, fallback: T): T {
    try {
      return operation();
    } catch (error) {
      this.handleError(new AgentException('MEMORY_ERROR', 'Memory operation failed', true), 'memory_operation');
      return fallback;
    }
  }

  protected safeAsyncOperation<T>(operation: () => Promise<T>, fallback: T): Promise<T> {
    return operation().catch(error => {
      this.handleError(error instanceof Error ? error : new Error(String(error)), 'async_operation');
      return fallback;
    });
  }

  getHealthStatus(): { healthy: boolean; errorCount: number; lastError?: AgentError } {
    return {
      healthy: this.isHealthy,
      errorCount: this.errorHistory.length,
      lastError: this.errorHistory[this.errorHistory.length - 1]
    };
  }
}