/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseAIAgent } from '../core/BaseAIAgent.js';

interface Commit {
  hash: string;
  message: string;
  author: string;
  date: Date;
  impact: 'minor' | 'major' | 'breaking';
  files: string[];
  insertions: number;
  deletions: number;
}

interface Timeline {
  branch: string;
  commits: Commit[];
  mergePoints: Array<{from: string; to: string; commit: string}>;
}

interface ConflictResolution {
  file: string;
  ourChanges: string[];
  theirChanges: string[];
  suggestion: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export class GitTimeTravelAgent extends BaseAIAgent {
  private commitHistory: Commit[] = [];
  private timelines: Map<string, Timeline> = new Map();
  private conflictPatterns: Map<string, ConflictResolution[]> = new Map();
  private timelinePosition: number = 0;

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
    } else if (lower.includes('timeline')) {
      return this.visualizeTimeline(input);
    } else if (lower.includes('conflict')) {
      return this.resolveConflict(input);
    } else if (lower.includes('impact')) {
      return this.analyzeCommitImpact(input);
    } else if (lower.includes('travel')) {
      return this.timeTravel(input);
    } else if (lower.includes('merge')) {
      return this.predictMerge(input);
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
    const timeline = this.generateSampleTimeline();
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
  
  private generateSampleTimeline(): Timeline {
    return {
      branch: 'main',
      commits: [],
      mergePoints: []
    };
  }
  
  private visualizeTimeline(input: string): string {
    const branches = ['main', 'feature/awesome', 'hotfix/urgent', 'experiment/wild'];
    const timeline = this.createDetailedTimeline();
    
    return `🌳 ADVANCED TIMELINE VISUALIZATION:

${timeline}

⏰ TEMPORAL ANALYSIS:
📊 Commit Velocity: 12 commits/day (↑ 20% this week)
🔄 Merge Frequency: 3 merges/week
⚡ Hotfix Rate: 1.2 per sprint
🎯 Feature Completion: 85% on track

🔮 TIMELINE PREDICTIONS:
• Next conflict likely in 3 commits (feature branch divergence)
• Suggested merge window: Tomorrow 2-4 PM (low activity period)
• Risk zones: Files modified in 3+ active branches

📍 Current Position: Commit ${this.timelinePosition}/847
You can 'travel forward' or 'travel back' through time.`;
  }
  
  private createDetailedTimeline(): string {
    return `
    ┌─[main]──────●──●──●──●──●──●──●──●──●──●──●──┐
    │             ↑                                 │
    │         (yesterday)                           │ (merge pending)
    │                                               │
    ├─[feature]───●──●──●──●──●──●──●──●──●──●──●──┤
    │                        ↑                      │
    │                   (conflict zone)             │
    │                                               │
    ├─[hotfix]────────────●──●──●──●──●──●─────────┘
    │                          ↑
    │                     (critical fix)
    │
    └─[experiment]──●──●──●──● (abandoned)
    
    Legend: ● commit  ↑ notable event  ─ timeline flow`;
  }
  
  private resolveConflict(input: string): string {
    const conflict: ConflictResolution = {
      file: 'src/api/handler.js',
      ourChanges: ['Added error handling', 'Refactored response format'],
      theirChanges: ['Optimized query performance', 'Added caching layer'],
      suggestion: 'Merge both: Keep error handling with optimized queries',
      riskLevel: 'medium'
    };
    
    return `⚔️ CONFLICT RESOLUTION WIZARD:

📁 File: ${conflict.file}

🔵 YOUR CHANGES:
${conflict.ourChanges.map(c => `  • ${c}`).join('\n')}

🔴 THEIR CHANGES:
${conflict.theirChanges.map(c => `  • ${c}`).join('\n')}

🤝 AI-SUGGESTED RESOLUTION:
${conflict.suggestion}
⚠️ Risk Level: ${conflict.riskLevel.toUpperCase()}

📊 HISTORICAL PATTERN ANALYSIS:
Similar conflicts resolved: 23 times
Success rate: 87%
Usual approach: Combine both changes (65% of cases)

💡 SMART MERGE STRATEGY:
1. Keep performance optimizations (their changes)
2. Add error handling on top (your changes)
3. Test integration points thoroughly
4. Document the merge decision

Want me to generate the merged code? Say "merge smart".`;
  }
  
  private analyzeCommitImpact(input: string): string {
    const impacts = [
      { file: 'core/engine.js', risk: 'high', affected: 23 },
      { file: 'utils/helper.js', risk: 'low', affected: 3 },
      { file: 'api/routes.js', risk: 'medium', affected: 8 }
    ];
    
    return `💥 COMMIT IMPACT ANALYSIS:

🎯 Direct Impact:
${impacts.map(i => `  ${i.risk === 'high' ? '🔴' : i.risk === 'medium' ? '🟡' : '🟢'} ${i.file}
    Risk: ${i.risk} | Affects: ${i.affected} other files`).join('\n')}

🌊 Ripple Effects:
• Test coverage decrease: -2.3%
• Build time increase: +0.5s
• Bundle size change: +1.2KB
• Performance impact: Negligible

🔄 Dependency Chain:
core/engine.js → services/*.js → components/*.jsx → pages/*.tsx

⚡ CRITICAL PATHS AFFECTED:
1. User authentication flow
2. Data processing pipeline
3. API response handlers

📈 HISTORICAL COMPARISON:
Similar changes in the past:
• 70% required hotfixes within 48h
• 30% introduced subtle bugs found after 1 week

✅ RECOMMENDATIONS:
1. Add integration tests for affected paths
2. Run performance benchmarks
3. Consider feature flag for gradual rollout
4. Alert the on-call team about high-risk changes`;
  }
  
  private timeTravel(input: string): string {
    const direction = input.includes('forward') ? 'forward' : 'back';
    this.timelinePosition += direction === 'forward' ? 10 : -10;
    this.timelinePosition = Math.max(0, Math.min(847, this.timelinePosition));
    
    const commit = this.getCommitAtPosition(this.timelinePosition);
    
    return `⏰ TIME TRAVEL ACTIVATED:

${direction === 'forward' ? '⏩' : '⏪'} Traveling ${direction} in time...

📍 Arrived at: Commit #${this.timelinePosition}
📅 Date: ${commit.date}
👤 Author: ${commit.author}
💬 Message: "${commit.message}"

📝 COMMIT DETAILS:
• Files changed: ${commit.files}
• Insertions: +${commit.insertions}
• Deletions: -${commit.deletions}
• Impact: ${commit.impact}

🔍 HISTORICAL CONTEXT:
${this.getHistoricalContext(this.timelinePosition)}

🎮 CONTROLS:
• 'travel forward' - Jump 10 commits ahead
• 'travel back' - Jump 10 commits back
• 'travel to <hash>' - Jump to specific commit
• 'timeline' - See full visualization`;
  }
  
  private getCommitAtPosition(position: number): any {
    return {
      date: new Date(Date.now() - position * 86400000).toISOString().split('T')[0],
      author: ['alice', 'bob', 'charlie'][position % 3],
      message: ['Fixed critical bug', 'Added new feature', 'Refactored code'][position % 3],
      files: Math.floor(Math.random() * 10) + 1,
      insertions: Math.floor(Math.random() * 100) + 10,
      deletions: Math.floor(Math.random() * 50) + 5,
      impact: ['minor', 'major', 'breaking'][position % 3]
    };
  }
  
  private getHistoricalContext(position: number): string {
    const contexts = [
      'This was during the great refactoring sprint',
      'Part of the emergency hotfix marathon',
      'The calm before the deployment storm',
      'When everything actually worked for once'
    ];
    return contexts[position % contexts.length];
  }
  
  private predictMerge(input: string): string {
    return `🔮 MERGE PREDICTION ORACLE:

🎯 Analyzing branches: feature/awesome → main

📊 PREDICTION RESULTS:
• Conflict Probability: 73%
• Estimated Conflicts: 4 files
• Resolution Time: ~45 minutes
• Risk Level: MEDIUM-HIGH

⚠️ CONFLICT HOTSPOTS:
1. src/api/handler.js (95% chance)
   - Both branches modified error handling
2. package.json (80% chance)
   - Dependency version mismatches
3. src/components/Dashboard.tsx (60% chance)
   - UI components restructured differently
4. tests/integration.spec.js (40% chance)
   - Test cases overlap

🛡️ PREVENTIVE MEASURES:
1. Rebase feature branch now (reduce conflicts by 40%)
2. Communicate with team about handler.js changes
3. Run 'npm update' on both branches first
4. Create backup branch before merge attempt

⏰ OPTIMAL MERGE WINDOWS:
🟢 Best: Tomorrow 10 AM (team available, low commit activity)
🟡 Good: Today 4 PM (end of day, can fix overnight)
🔴 Avoid: Friday afternoon (nobody wants weekend fixes)

💡 Pro tip: Run 'conflict-check' before actual merge to preview issues.`;
  }

  generatePrompt(): string {
    return this.getSystemPrompt();
  }
}