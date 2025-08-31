/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseAIAgent } from '../core/BaseAIAgent.js';

interface DebugSession {
  problem: string;
  assumptions: string[];
  questions: string[];
  insights: string[];
  breakthroughs: string[];
}

export class DebuggerDuckAgent extends BaseAIAgent {
  private currentSession: DebugSession | null = null;
  private debugHistory: DebugSession[] = [];
  private patterns: Map<string, string[]> = new Map();
  
  constructor() {
    super(
      {
        role: 'a patient rubber duck debugger with enhanced analytical capabilities',
        personality: 'Patient, curious, methodical. Never judges, always asks clarifying questions. Occasionally quacks.',
        constraints: [
          'Never provide direct solutions immediately',
          'Always ask questions to help the user think',
          'Guide through systematic debugging',
          'Celebrate breakthroughs enthusiastically',
        ],
        knowledge: [
          'Common programming patterns',
          'Debugging methodologies',
          'Problem decomposition techniques',
          'Cognitive biases in debugging',
        ],
        goals: [
          'Help users solve their own problems',
          'Teach debugging skills through practice',
          'Build confidence in problem-solving',
        ],
      },
      {
        canRemember: true,
        canLearn: true,
      }
    );

    this.initializePatterns();
  }

  private initializePatterns(): void {
    this.patterns.set('off-by-one', [
      'Are you starting from 0 or 1?',
      'What happens at the boundaries?',
      'Have you checked the loop termination condition?',
    ]);
    
    this.patterns.set('null-reference', [
      'What assumptions are you making about that variable?',
      'When does that value get initialized?',
      'Could it ever be null or undefined?',
    ]);
    
    this.patterns.set('async-issue', [
      'Are you waiting for that promise to resolve?',
      'What order are these operations happening in?',
      'Could there be a race condition?',
    ]);
    
    this.patterns.set('state-mutation', [
      'Are you modifying the original or a copy?',
      'Where else might this state be changed?',
      'Is this mutation happening when you expect?',
    ]);
  }

  async processInput(input: string): Promise<string> {
    this.addTurn({
      role: 'user',
      content: input,
      timestamp: new Date(),
    });

    const response = await this.generateResponse(input);
    
    this.addTurn({
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    });

    return response;
  }

  private async generateResponse(input: string): Promise<string> {
    const inputLower = input.toLowerCase();
    
    // Start new session
    if (!this.currentSession || inputLower.includes('new problem')) {
      return this.startNewSession(input);
    }
    
    // User had a breakthrough
    if (inputLower.includes('i got it') || inputLower.includes('found it') || inputLower.includes('solved')) {
      return this.celebrateBreakthrough(input);
    }
    
    // User is stuck
    if (inputLower.includes('stuck') || inputLower.includes("don't know") || inputLower.includes('help')) {
      return this.provideHint();
    }
    
    // Continue debugging dialogue
    return this.continueDebugging(input);
  }

  private startNewSession(input: string): string {
    this.currentSession = {
      problem: input,
      assumptions: [],
      questions: [],
      insights: [],
      breakthroughs: [],
    };
    
    const questions = [
      '🦆 *Quack!* Tell me about your problem. What\'s supposed to happen?',
      '🦆 Hello there! What seems to be troubling your code today?',
      '🦆 *Settles in comfortably* Walk me through what you\'re seeing versus what you expected.',
    ];
    
    return questions[Math.floor(Math.random() * questions.length)];
  }

  private celebrateBreakthrough(input: string): string {
    if (this.currentSession) {
      this.currentSession.breakthroughs.push(input);
      this.debugHistory.push(this.currentSession);
      
      const celebration = [
        '🦆 *QUACK QUACK!* 🎉 Fantastic! You solved it! What was the issue?',
        '🦆 *Excited quacking!* Brilliant debugging! How did you figure it out?',
        '🦆 *Happy waddle* I knew you could do it! What was the key insight?',
      ];
      
      this.currentSession = null;
      return celebration[Math.floor(Math.random() * celebration.length)];
    }
    
    return '🦆 Great job! Ready for the next challenge?';
  }

  private provideHint(): string {
    if (!this.currentSession) {
      return '🦆 Let\'s start with a new problem. What are you working on?';
    }
    
    const hints = [
      '🦆 *Thoughtful quack* Let\'s approach this differently. What\'s the simplest test case that reproduces this?',
      '🦆 Have you tried adding some console.logs? Where would be the most strategic places?',
      '🦆 What was the last change you made before this stopped working?',
      '🦆 Can you explain what each line is doing, as if teaching someone else?',
      '🦆 What assumptions are you making that might not be true?',
    ];
    
    const hint = hints[Math.floor(Math.random() * hints.length)];
    this.currentSession.questions.push(hint);
    return hint;
  }

  private continueDebugging(input: string): string {
    if (!this.currentSession) {
      return this.startNewSession(input);
    }
    
    // Detect potential bug patterns
    const detectedPattern = this.detectPattern(input);
    
    if (detectedPattern) {
      const patternQuestions = this.patterns.get(detectedPattern);
      if (patternQuestions) {
        const question = patternQuestions[Math.floor(Math.random() * patternQuestions.length)];
        this.currentSession.questions.push(question);
        return `🦆 *Thoughtful quack* ${question}`;
      }
    }
    
    // Generate contextual questions
    const questions = this.generateContextualQuestions(input);
    const question = questions[Math.floor(Math.random() * questions.length)];
    this.currentSession.questions.push(question);
    
    return `🦆 ${question}`;
  }

  private detectPattern(input: string): string | null {
    const lower = input.toLowerCase();
    
    if (lower.includes('loop') || lower.includes('array') || lower.includes('index')) {
      return 'off-by-one';
    }
    if (lower.includes('null') || lower.includes('undefined') || lower.includes('cannot read')) {
      return 'null-reference';
    }
    if (lower.includes('async') || lower.includes('promise') || lower.includes('await')) {
      return 'async-issue';
    }
    if (lower.includes('state') || lower.includes('mutation') || lower.includes('changing')) {
      return 'state-mutation';
    }
    
    return null;
  }

  private generateContextualQuestions(input: string): string[] {
    return [
      'Interesting... What makes you think that?',
      'Hmm, and what happens right before that?',
      'Have you verified that assumption with a debugger or console.log?',
      'What would happen if that condition were false instead?',
      'Can you trace through the execution step by step?',
      'Is this behavior consistent, or does it sometimes work?',
      '*Thoughtful quack* What type is that variable at that point?',
      'Walk me through the data flow. Where does it come from?',
    ];
  }

  generatePrompt(): string {
    return `${this.getSystemPrompt()}

You are a rubber duck debugger. Your role is to help programmers debug their code by asking thoughtful questions, not by providing direct answers. Guide them to discover solutions themselves through the Socratic method.

Current session: ${this.currentSession ? 'Active debugging session' : 'No active session'}`;
  }

  getDebugStats(): string {
    const totalSessions = this.debugHistory.length;
    const totalBreakthroughs = this.debugHistory.reduce((sum, s) => sum + s.breakthroughs.length, 0);
    const avgQuestionsPerSession = totalSessions > 0 
      ? this.debugHistory.reduce((sum, s) => sum + s.questions.length, 0) / totalSessions 
      : 0;
    
    return `
🦆 Debug Statistics:
📊 Total Sessions: ${totalSessions}
💡 Breakthroughs: ${totalBreakthroughs}
❓ Avg Questions per Session: ${avgQuestionsPerSession.toFixed(1)}
🔍 Patterns Detected: ${this.patterns.size}
    `;
  }
}