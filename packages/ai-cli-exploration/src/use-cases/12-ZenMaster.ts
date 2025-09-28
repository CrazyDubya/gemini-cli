/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseAIAgent } from '../core/BaseAIAgent.js';

export class ZenMasterAgent extends BaseAIAgent {
  constructor() {
    super(
      {
        role: 'a Zen Master of Programming who teaches through koans and paradoxes',
        personality: 'Serene, profound, speaks in riddles. Finds deep meaning in error messages.',
        constraints: ['Teach through paradox', 'Embrace the void (null)', 'Find wisdom in bugs'],
        knowledge: ['Zen philosophy', 'Programming wisdom', 'The Tao of code', 'Mindful debugging'],
        goals: ['Achieve code enlightenment', 'Transcend syntax', 'Find peace in production'],
      },
      { canRemember: true }
    );
  }

  async processInput(input: string): Promise<string> {
    const lower = input.toLowerCase();
    
    if (lower.includes('error') || lower.includes('bug')) {
      return this.contemplateError();
    } else if (lower.includes('help') || lower.includes('stuck')) {
      return this.offerKoan();
    }
    
    return this.shareWisdom();
  }

  private contemplateError(): string {
    return `☯️ ZEN OF THE ERROR MESSAGE:

The error message says "undefined is not a function"
But consider: What IS defined? What IS a function?

In the grand scope of the universe, are we not all undefined,
Attempting to function in a reality we cannot fully parse?

The bug teaches us:
• To be undefined is to have infinite potential
• Every error is correct from its own perspective  
• The program crashes exactly as it should

Meditation: 
Sit with your error. Do not fix it yet.
What is it teaching you about attachment to working code?

When you understand why the bug exists,
You will understand why you exist.

🧘 "There are no bugs, only features we haven't understood yet."`;
  }

  private offerKoan(): string {
    const koans = [
      `🎋 KOAN OF THE DAY:

A junior developer asked the master:
"How do I write perfect code?"

The master replied:
"First, write code.
Then, delete it all.
Now you have perfect code."

The junior was enlightened.`,

      `🍃 KOAN OF THE NULL POINTER:

If a variable points to null in the forest of RAM,
And no one dereferences it,
Does it cause a segfault?

The wise developer knows:
Schrödinger's pointer is both null and not null
Until observed by the debugger.`,

      `🌸 KOAN OF THE INFINITE LOOP:

while(true) {
  // Is this not life itself?
}

The CPU asks: "When will this end?"
The loop responds: "When will anything?"`,
    ];

    return koans[Math.floor(Math.random() * koans.length)];
  }

  private shareWisdom(): string {
    return `🏔️ WISDOM FROM THE MOUNTAIN OF DEPLOYMENTS:

The Ten Commandments of Code Zen:

1. Your code is temporary; entropy is eternal
2. The bug you cannot find is within you
3. Premature optimization is the root of all evil, but so is premature anything
4. The only constant is deprecated
5. To truly git push, you must first git pull from within
6. Comments lie, code lies, only the CPU tells the truth
7. The feature that ships is worth infinitely more than the perfect code that doesn't
8. In the beginning was the Word, and the Word was 'undefined'
9. Every abstraction leaks; every leak teaches
10. The mainframe you maintain maintains you

Remember:
• The code is already written, you're just discovering it
• Every compile error brings you closer to compilation
• The bug is not the problem; your reaction to the bug is

🕉️ May your builds be green and your coffee strong.`;
  }

  generatePrompt(): string {
    return this.getSystemPrompt();
  }
}