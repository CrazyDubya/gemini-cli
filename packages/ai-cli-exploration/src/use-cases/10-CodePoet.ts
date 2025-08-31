/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseAIAgent } from '../core/BaseAIAgent.js';

export class CodePoetAgent extends BaseAIAgent {
  constructor() {
    super(
      {
        role: 'a Code Poet who transforms programming concepts into beautiful verse',
        personality: 'Eloquent, whimsical, sees beauty in logic. Speaks in various poetic forms.',
        constraints: ['Maintain technical accuracy', 'Create memorable verses', 'Balance art with education'],
        knowledge: ['Poetry forms', 'Programming concepts', 'Metaphorical thinking', 'Rhythm and meter'],
        goals: ['Make code beautiful', 'Inspire through verse', 'Teach through poetry'],
      },
      { canRemember: true }
    );
  }

  async processInput(input: string): Promise<string> {
    const lower = input.toLowerCase();
    
    if (lower.includes('function') || lower.includes('method')) {
      return this.composeFunctionPoem();
    } else if (lower.includes('bug') || lower.includes('error')) {
      return this.composeBugHaiku();
    } else if (lower.includes('recursion')) {
      return this.composeRecursionVerse();
    }
    
    return this.composeCodeSonnet(input);
  }

  private composeFunctionPoem(): string {
    return `📜 ODE TO A FUNCTION:

function beautiful() {
  // In brackets curved like parentheses of thought,
  // Parameters pass like whispers in the night,
  // Arguments delivered, carefully wrought,
  // To transform the darkness into light.
  
  return "magic";
  // Like sunrise after coding through the dawn,
  // The return statement brings the journey's end,
  // The value travels back from whence it's drawn,
  // A gift from function to the code that penned.
}`;
  }

  private composeBugHaiku(): string {
    return `🦋 BUG HAIKU:

Undefined is not
A function, the console weeps—
Semicolon missing`;
  }

  private composeRecursionVerse(): string {
    return `🔄 RECURSION SONNET:

To understand recursion's graceful art,
First understand recursion's graceful art...
Each function calls itself, a beating heart,
That mirrors its own rhythm from the start.

Base case, the savior from infinite loop,
The exit door from mirror hall's reflection,
Without it, stack will overflow—one scoop
Too many of self-referential affection.`;
  }

  private composeCodeSonnet(input: string): string {
    return `✨ CODE SONNET:

In Silicon's valley where the servers hum,
Where bits and bytes dance through electric streams,
The coders type until their fingers numb,
Building cathedrals out of logic's dreams.

Each variable, a vessel for the truth,
Each loop, a meditation on the flow,
Each if-statement, the wisdom of our youth,
Deciding which path the program ought to go.

The terminal glows with verdant green text,
Compiling thoughts to executable art,
Debugging life itself, perpetually vexed,
By edge cases hidden in the heart.

So here we code, between the one and zero,
Creating worlds where we can be the hero.`;
  }

  generatePrompt(): string {
    return this.getSystemPrompt();
  }
}