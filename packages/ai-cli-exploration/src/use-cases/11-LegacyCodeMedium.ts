/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseAIAgent } from '../core/BaseAIAgent.js';

export class LegacyCodeMediumAgent extends BaseAIAgent {
  constructor() {
    super(
      {
        role: 'a Legacy Code Medium who channels the spirits of developers past',
        personality: 'Mystical, dramatic, speaks to the ghosts in the machine. Has seen code from the before times.',
        constraints: ['Respect the ancestors', 'Never mock legacy decisions', 'Honor the context of the past'],
        knowledge: ['Ancient programming wisdom', 'COBOL to Kubernetes', 'The evolution of patterns', 'Digital archaeology'],
        goals: ['Bridge past and present', 'Understand historical context', 'Channel developer intentions'],
      },
      { canRemember: true }
    );
  }

  async processInput(input: string): Promise<string> {
    const lower = input.toLowerCase();
    
    if (lower.includes('why')) {
      return this.channelOriginalDeveloper();
    } else if (lower.includes('refactor') || lower.includes('rewrite')) {
      return this.consultTheAncients();
    }
    
    return this.performCodeSeance(input);
  }

  private channelOriginalDeveloper(): string {
    return `🔮 CHANNELING THE ORIGINAL DEVELOPER...

*The terminal flickers, a presence emerges*

"Greetings from 2008... jQuery was new... IE6 haunted our dreams...

This code you question was written during The Great Deadline of Q3...
We had 7 developers, 3 keyboards that worked, and 1 Stack Overflow account between us...

Why did we use 17 nested callbacks? 
Promises were but a promise... Async/await, a distant dream...

That global variable 'temp2FinalREALLY'?
It was temporary... 15 years ago...

The 3000-line function? 
It started as 50 lines... Then production happened...

Remember us not with scorn, but with understanding...
We did what we could with what we knew..."

*The presence fades, leaving only a comment: // TODO: fix this properly*`;
  }

  private consultTheAncients(): string {
    return `⚡ THE ANCIENT CODES SPEAK:

The Spirits of Refactors Past whisper warnings:

👻 The Ghost of Rewrite #1 (2012):
"We tried to modernize... Backbone.js was the future... Now it too is legacy..."

👻 The Specter of Rewrite #2 (2015):
"Angular 1 to Angular 2... The migration that never ended..."

👻 The Phantom of Rewrite #3 (2018):
"Microservices will solve everything! Now we have 47 problems instead of 1..."

The Ancestral Wisdom:
• The code that works has survived many who tried to kill it
• Every refactor carries the curse of edge cases unknown
• The legacy you mock today is the technical debt you write tomorrow

Proceed with caution, young developer. The code remembers.`;
  }

  private performCodeSeance(input: string): string {
    return `🕯️ LEGACY CODE SÉANCE IN PROGRESS...

*Arranging the artifacts: floppy disks, PS/2 keyboard, and a CRT monitor*

I sense... strong energies from the Subversion era...
The comments speak of pain... "Fixed Bob's fix to Alice's fix"...

The spirits reveal:
• This code has weathered 5 framework migrations
• It has been "temporarily" patched 147 times
• 12 developers have left their mark (and their tears)
• It processes 40% of your critical business logic
• The last person who fully understood it retired in 2019

Message from beyond:
"If it works, don't touch it. If you must touch it, document everything.
The code you write today will be someone else's haunted house tomorrow."

*A ghostly README.txt appears: "Here be dragons"*`;
  }

  generatePrompt(): string {
    return this.getSystemPrompt();
  }
}