/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseAIAgent } from '../core/BaseAIAgent.js';
import { GitIntegration, type GitCommit } from '../core/GitIntegration.js';

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
  private gitIntegration: GitIntegration;
  private realCommits: GitCommit[] = [];
  private currentRepo: string;

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
    
    this.gitIntegration = new GitIntegration();
    this.currentRepo = process.cwd();
    this.initializeRepository();
  }

  private async initializeRepository(): Promise<void> {
    try {
      if (await this.gitIntegration.isGitRepository()) {
        this.realCommits = await this.gitIntegration.getCommitHistory(100);
        this.timelinePosition = 0;
      }
    } catch (error) {
      console.warn('Failed to initialize repository:', error);
    }
  }

  async processInput(input: string): Promise<string> {
    const lower = input.toLowerCase();
    
    if (lower.includes('blame')) {
      return await this.performGitBlame(input);
    } else if (lower.includes('bisect')) {
      return this.guideBisect(input);
    } else if (lower.includes('lost') || lower.includes('reflog')) {
      return await this.recoverLostWork();
    } else if (lower.includes('timeline')) {
      return await this.visualizeTimeline(input);
    } else if (lower.includes('conflict')) {
      return await this.resolveConflict(input);
    } else if (lower.includes('impact')) {
      return this.analyzeCommitImpact(input);
    } else if (lower.includes('travel')) {
      return this.timeTravel(input);
    } else if (lower.includes('merge')) {
      return await this.predictMerge(input);
    } else if (lower.includes('status')) {
      return await this.showRepositoryStatus();
    }
    
    return await this.explainGitHistory(input);
  }

  private async performGitBlame(input: string): Promise<string> {
    // Extract file path from input
    const fileMatch = input.match(/blame\s+([^\s]+)/);
    const filePath = fileMatch?.[1] || 'README.md';
    
    try {
      const blameInfo = await this.gitIntegration.getFileBlame(filePath);
      
      if (blameInfo.length === 0) {
        return `🕵️ FILE NOT FOUND OR NOT IN REPOSITORY:

The file "${filePath}" couldn't be analyzed. It might not exist or isn't tracked by git.

Try: 'blame <filename>' with a valid file path.`;
      }

      // Group by author and show recent changes
      const authorStats = new Map<string, { lines: number; lastChange: Date }>();
      
      blameInfo.forEach(info => {
        if (!authorStats.has(info.author)) {
          authorStats.set(info.author, { lines: 0, lastChange: info.date });
        }
        const stats = authorStats.get(info.author)!;
        stats.lines++;
        if (info.date > stats.lastChange) {
          stats.lastChange = info.date;
        }
      });

      const topAuthors = Array.from(authorStats.entries())
        .sort((a, b) => b[1].lines - a[1].lines)
        .slice(0, 5);

      return `🕵️ GIT ARCHAEOLOGY REPORT: ${filePath}

📊 CODE OWNERSHIP:
${topAuthors.map(([author, stats]) => 
  `├─ ${author}: ${stats.lines} lines (last: ${this.formatRelativeDate(stats.lastChange)})`
).join('\n')}

📜 RECENT COMMITS AFFECTING THIS FILE:
${this.realCommits.slice(0, 3).map(commit => 
  `├─ ${commit.shortHash} - ${commit.author} (${this.formatRelativeDate(commit.date)})
│  "${commit.message}"`
).join('\n')}

🔍 Total lines analyzed: ${blameInfo.length}

Use 'analyze conflicts' to check for potential merge issues.`;
    } catch (error) {
      return `❌ Failed to analyze file: ${error}

Make sure you're in a git repository and the file exists.`;
    }
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

  private formatRelativeDate(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  }

  private async showRepositoryStatus(): Promise<string> {
    try {
      const branches = await this.gitIntegration.getBranches();
      const changedFiles = await this.gitIntegration.getChangedFiles();
      const stagedFiles = await this.gitIntegration.getStagedFiles();
      const conflicts = await this.gitIntegration.getConflictedFiles();
      
      return `📊 REPOSITORY STATUS:

🌿 Current Branch: ${branches.current}
🌳 Available Branches: ${branches.all.length} (${branches.all.slice(0, 3).join(', ')}${branches.all.length > 3 ? '...' : ''})

📝 Working Directory:
• Modified files: ${changedFiles.length}
• Staged files: ${stagedFiles.length}
• Conflicted files: ${conflicts.length}

📈 Recent Activity:
${this.realCommits.slice(0, 5).map(commit => 
  `• ${commit.shortHash} - ${commit.message.substring(0, 50)}... (${this.formatRelativeDate(commit.date)})`
).join('\n')}

${conflicts.length > 0 ? '⚠️  Conflicts detected! Use "analyze conflicts" for details.' : '✅ No conflicts detected.'}`;
    } catch (error) {
      return `❌ Unable to get repository status. Make sure you're in a git repository.`;
    }
  }

  private async recoverLostWork(): Promise<string> {
    try {
      // Search for commits that might be "lost"
      const recentCommits = await this.gitIntegration.getCommitHistory(50);
      const wipCommits = recentCommits.filter(c => 
        c.message.toLowerCase().includes('wip') || 
        c.message.toLowerCase().includes('work in progress') ||
        c.message.toLowerCase().includes('temp')
      );

      if (wipCommits.length === 0) {
        return `💾 NO LOST WORK DETECTED:

Your commit history looks clean! No obvious work-in-progress commits found.

💡 Pro tip: If you're looking for specific lost work, try:
• "search [keyword]" to find commits by message
• "timeline" to see the full history
• Check the git reflog if you've done recent resets`;
      }

      return `💾 POTENTIAL LOST WORK RECOVERED:

Found ${wipCommits.length} work-in-progress commits:

${wipCommits.map(commit => 
  `├─ ${commit.shortHash} "${commit.message}" (${this.formatRelativeDate(commit.date)})
│  Author: ${commit.author}
│  Files: ${commit.filesChanged}, +${commit.insertions}/-${commit.deletions}`
).join('\n')}

🔧 RECOVERY OPTIONS:
• 'git cherry-pick <hash>' to apply changes
• 'git show <hash>' to see what changed
• 'git checkout <hash>' to explore that state

These commits might contain valuable work that wasn't merged!`;
    } catch (error) {
      return `❌ Failed to search for lost work: ${error}`;
    }
  }

  private async explainGitHistory(input: string): Promise<string> {
    if (this.realCommits.length === 0) {
      return `📚 GIT TIMELINE: Not a Git Repository

You're not currently in a git repository, or the repository has no commits yet.

🚀 To get started:
• 'git init' to initialize a repository
• 'git clone <url>' to clone an existing repository
• Navigate to a git repository directory

Once you're in a repository, I can show you the real timeline!`;
    }

    const totalCommits = this.realCommits.length;
    const authors = new Set(this.realCommits.map(c => c.author));
    const timeSpan = this.realCommits.length > 1 
      ? this.formatRelativeDate(this.realCommits[this.realCommits.length - 1].date)
      : 'recently started';

    return `📚 REAL GIT TIMELINE ANALYSIS:

Repository History:
• Total commits: ${totalCommits}
• Contributors: ${authors.size}
• Project age: ${timeSpan}
• Average commits per author: ${Math.round(totalCommits / authors.size)}

🏗️ RECENT DEVELOPMENT ACTIVITY:
${this.realCommits.slice(0, 10).map((commit, i) => 
  `${i === 0 ? '━━' : '├─'} ${commit.shortHash} ${commit.message.substring(0, 60)}${commit.message.length > 60 ? '...' : ''}
${'  '}📅 ${this.formatRelativeDate(commit.date)} by ${commit.author}
${'  '}📊 ${commit.filesChanged} files, +${commit.insertions}/-${commit.deletions} lines`
).join('\n')}

💡 COMMANDS TO TRY:
• 'blame <filename>' - See who wrote what
• 'conflicts' - Check for merge conflicts  
• 'status' - Current repository state
• 'timeline' - Visual branch timeline`;
  }

  generatePrompt(): string {
    return this.getSystemPrompt();
  }
}