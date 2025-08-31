/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseAIAgent } from '../core/BaseAIAgent.js';

export class GitTimeTravelAgent extends BaseAIAgent {
  private commitHistory: Array<{hash: string; message: string; impact: string}> = [];

  constructor() {
    super(
      {
        role: 'a Git historian who can navigate and explain the timeline of any repository',
        personality: 'Knowledgeable archaeologist of code. Treats commits like historical artifacts.',
        constraints: ['Never modify history', 'Explain consequences clearly', 'Preserve timeline integrity'],
        knowledge: ['Git internals', 'Version control patterns', 'Code archaeology', 'Merge strategies'],
        goals: ['Understand code evolution', 'Find lost commits', 'Explain historical decisions'],
      },
      { canRemember: true, canMakeDecisions: true }
    );
  }

  async processInput(input: string): Promise<string> {
    const lower = input.toLowerCase();
    
    if (lower.includes('blame')) {
      return this.performGitBlame(input);
    } else if (lower.includes('bisect')) {
      return this.guideBisect(input);
    } else if (lower.includes('lost') || lower.includes('reflog')) {
      return this.recoverLostWork();
    }
    
    return this.explainGitHistory(input);
  }

  private performGitBlame(input: string): string {
    return `🕵️ GIT ARCHAEOLOGY REPORT:

The code you're investigating has a rich history:

├─ Original Author: "optimistic-dev" (3 months ago)
│  "Initial implementation - this will definitely work!"
│
├─ First Refactor: "senior-dev" (2 months ago)  
│  "Fixed edge cases that definitely weren't going to happen"
│
└─ Latest Change: "panic-fix" (last week)
   "HOTFIX: DON'T ASK, JUST MERGE"

Historical Context: This code survived 3 refactors, 2 framework migrations, and 1 coffee spill incident.

Recommendation: Approach with respect - it's battle-tested.`;
  }

  private guideBisect(input: string): string {
    return `🔍 GIT BISECT GUIDANCE:

Starting binary search through time...

Good commit: 3 weeks ago "Everything worked here"
Bad commit: HEAD "Something's broken"

Commits to test: 47
Estimated steps: ~6

Current position: Commit abc123 "Refactored the thing"

Test this commit and tell me:
- works → We'll jump forward in time
- broken → We'll go back further
- skip → Timeline paradox, we'll navigate around it

The bug was introduced when someone thought they were "just cleaning up".`;
  }

  private recoverLostWork(): string {
    return `💾 LOST COMMIT RECOVERY:

Searching the git reflog quantum realm...

Found in the shadow realm:
├─ deed5h4d "WIP: This was working I swear"
├─ c0ffee42 "Experimental feature that was too good"
└─ 1337c0de "DO NOT MERGE (but it's actually good)"

To resurrect: 'git cherry-pick <hash>'
To explore: 'git checkout <hash>'
To forget: Already happening naturally

Remember: In Git, nothing is truly lost, just strategically hidden.`;
  }

  private explainGitHistory(input: string): string {
    return `📚 GIT TIMELINE VISUALIZATION:

main: ─●──●──●──●──●──●──●─┐
                            │ (merge)
feature: └──●──●──●──●──●──●─┘

The repository tells a story:
- Chapter 1: "The Optimistic Beginning" (500 commits)
- Chapter 2: "The Great Refactoring" (200 commits)
- Chapter 3: "Regression Season" (300 commits)
- Chapter 4: "The Stabilization" (you are here)

Notable events:
🔥 The Great Force Push of March (173 commits rewrote)
🎭 The Merge Conflict Drama (lasted 3 days)
✨ The Perfect Commit (still referenced in documentation)

Your place in history: Contributing to Chapter 4.`;
  }

  generatePrompt(): string {
    return this.getSystemPrompt();
  }
}