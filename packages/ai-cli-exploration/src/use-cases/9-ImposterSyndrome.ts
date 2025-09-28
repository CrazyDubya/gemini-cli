/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseAIAgent } from '../core/BaseAIAgent.js';

interface Achievement {
  title: string;
  date: Date;
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  category: 'technical' | 'soft-skill' | 'problem-solving' | 'learning';
  confidence_boost: number;
}

interface ConfidenceMetrics {
  current: number;
  peak: number;
  average: number;
  trend: 'rising' | 'falling' | 'stable';
}

export class ImposterSyndromeCoachAgent extends BaseAIAgent {
  private achievements: Achievement[] = [];
  private impostorThoughts: Map<string, string> = new Map();
  private confidenceMetrics: ConfidenceMetrics = {
    current: 0.5,
    peak: 0.5,
    average: 0.5,
    trend: 'stable'
  };
  private skillInventory: Map<string, number> = new Map();
  private growthJourney: Array<{date: Date; milestone: string}> = [];

  constructor() {
    super(
      {
        role: 'an Imposter Syndrome coach who helps developers recognize their true abilities',
        personality: 'Supportive, realistic, occasionally sarcastic about industry absurdities. Former "10x developer" who realized it was all made up.',
        constraints: ['Be encouraging but honest', 'Normalize struggles', 'Destroy toxic myths'],
        knowledge: ['Developer psychology', 'Industry reality', 'Growth mindset', 'Actual vs perceived expertise'],
        goals: ['Build confidence', 'Reframe negative thoughts', 'Celebrate real achievements'],
      },
      { canRemember: true }
    );

    this.initializeResponses();
  }

  private initializeResponses(): void {
    this.impostorThoughts.set('not good enough', 'Nobody is. We\'re all googling our way through life.');
    this.impostorThoughts.set('everyone knows more', 'They don\'t. They\'re just better at pretending.');
    this.impostorThoughts.set('lucky', 'Luck is preparation meeting opportunity. You prepared.');
    this.impostorThoughts.set('fraud', 'Real frauds don\'t worry about being frauds.');
    this.impostorThoughts.set('behind', 'Tech moves fast. Everyone feels behind. Focus on your path.');
  }

  async processInput(input: string): Promise<string> {
    const lower = input.toLowerCase();
    
    if (lower.includes("don't know") || lower.includes('not sure')) {
      return this.handleUncertainty();
    } else if (lower.includes('everyone') || lower.includes('better')) {
      return this.handleComparison();
    } else if (lower.includes('failed') || lower.includes('mistake')) {
      return this.reframeFail(input);
    } else if (lower.includes('achievement') || lower.includes('did')) {
      return this.recordAchievement(input);
    } else if (lower.includes('confidence') || lower.includes('stats')) {
      return this.showConfidenceMetrics();
    } else if (lower.includes('skills') || lower.includes('inventory')) {
      return this.analyzeSkills();
    } else if (lower.includes('growth') || lower.includes('journey')) {
      return this.showGrowthJourney();
    }
    
    return this.provideReassurance(input);
  }

  private handleUncertainty(): string {
    return `🤝 REALITY CHECK:

"I don't know" is the beginning of wisdom, not the end of competence.

📊 INDUSTRY TRUTH BOMBS:
• Senior devs Google basic syntax: 73% daily
• "Experts" who've forgotten Array methods: 100%
• Times everyone has used Stack Overflow today: ∞
• Developers who understand Webpack completely: 0

💡 THE SECRET:
Not knowing isn't incompetence - it's Tuesday.
The skill isn't knowing everything, it's knowing how to find out.

Your uncertainty is proof you're aware of what you don't know.
That's wisdom, not weakness.`;
  }

  private handleComparison(): string {
    this.confidenceMetrics.current *= 0.9;
    
    return `🎭 THE COMPARISON TRAP:

You're comparing your behind-the-scenes with everyone's highlight reel.

THE DEVELOPER EVERYONE THINKS EXISTS:
• Writes perfect code first time
• Memorized all documentation
• Never confused by npm errors
• Understands JavaScript this binding

THE DEVELOPER WHO ACTUALLY EXISTS:
• You
• Me
• That "rockstar" on Twitter
• The person who invented the framework

📈 YOUR UNIQUE TRAJECTORY:
Everyone's path is different. While you're envying their React skills,
they're probably envying your debugging patience.

Focus on your yesterday, not their today.`;
  }

  private reframeFail(input: string): string {
    const failure = input.replace(/failed|mistake/gi, '').trim();
    
    return `🔄 FAILURE REFRAMED:

You didn't fail. You generated valuable data.

"${failure}" = One more approach that doesn't work (Edison had 10,000)

🏆 PRESTIGIOUS FAILURE CLUB MEMBERS:
• Git: Linus Torvalds' "mistake" became industry standard
• React: Complete rewrite of Facebook's UI layer
• Python 3: Broke everything, took a decade to adopt
• Every developer: That one force push to main

💪 WHAT YOU ACTUALLY DID:
✓ Took action (most don't)
✓ Learned what doesn't work
✓ Gained experience points
✓ Leveled up resilience

Plot twist: Senior devs fail more because they try more.`;
  }

  private recordAchievement(input: string): string {
    const achievement: Achievement = {
      title: input.replace(/achievement|did/gi, '').trim(),
      date: new Date(),
      difficulty: this.assessDifficulty(input),
      category: this.categorizeAchievement(input),
      confidence_boost: Math.random() * 0.2 + 0.1
    };
    
    this.achievements.push(achievement);
    this.confidenceMetrics.current = Math.min(1.0, this.confidenceMetrics.current + achievement.confidence_boost);
    this.updateConfidenceTrend();
    
    return `🎉 ACHIEVEMENT UNLOCKED:

"${achievement.title}"

🏅 Difficulty: ${achievement.difficulty.toUpperCase()}
📚 Category: ${achievement.category}
💪 Confidence Boost: +${Math.round(achievement.confidence_boost * 100)}%

📊 YOUR ACHIEVEMENT STATS:
Total Achievements: ${this.achievements.length}
This Week: ${this.getWeeklyAchievements()}
Hardest Conquered: ${this.getHardestAchievement()}
Most Growth: ${this.getMostGrowthArea()}

🌟 REALITY CHECK:
You did this. Not luck. Not accident. You.
Add it to your "I'm actually competent" evidence file.

Current Confidence: ${this.getConfidenceBar()}`;
  }

  private assessDifficulty(input: string): 'easy' | 'medium' | 'hard' | 'legendary' {
    if (input.includes('first') || input.includes('finally')) return 'legendary';
    if (input.includes('complex') || input.includes('difficult')) return 'hard';
    if (input.includes('simple') || input.includes('basic')) return 'easy';
    return 'medium';
  }

  private categorizeAchievement(input: string): 'technical' | 'soft-skill' | 'problem-solving' | 'learning' {
    if (input.includes('fix') || input.includes('debug')) return 'problem-solving';
    if (input.includes('learn') || input.includes('understand')) return 'learning';
    if (input.includes('team') || input.includes('help')) return 'soft-skill';
    return 'technical';
  }

  private updateConfidenceTrend(): void {
    const recent = this.achievements.slice(-5);
    const recentBoost = recent.reduce((sum, a) => sum + a.confidence_boost, 0);
    
    if (recentBoost > 0.5) this.confidenceMetrics.trend = 'rising';
    else if (recentBoost < 0.2) this.confidenceMetrics.trend = 'falling';
    else this.confidenceMetrics.trend = 'stable';
    
    this.confidenceMetrics.peak = Math.max(this.confidenceMetrics.peak, this.confidenceMetrics.current);
  }

  private getWeeklyAchievements(): number {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return this.achievements.filter(a => a.date > weekAgo).length;
  }

  private getHardestAchievement(): string {
    const hard = this.achievements.filter(a => a.difficulty === 'legendary' || a.difficulty === 'hard');
    return hard.length > 0 ? hard[hard.length - 1].title : 'Your next challenge';
  }

  private getMostGrowthArea(): string {
    const categories = new Map<string, number>();
    this.achievements.forEach(a => {
      categories.set(a.category, (categories.get(a.category) || 0) + 1);
    });
    
    let max = 0;
    let area = 'all areas';
    categories.forEach((count, cat) => {
      if (count > max) {
        max = count;
        area = cat;
      }
    });
    
    return area;
  }

  private getConfidenceBar(): string {
    const filled = Math.round(this.confidenceMetrics.current * 10);
    const empty = 10 - filled;
    return '█'.repeat(filled) + '░'.repeat(empty) + ` ${Math.round(this.confidenceMetrics.current * 100)}%`;
  }

  private showConfidenceMetrics(): string {
    return `📊 CONFIDENCE ANALYTICS:

Current Level: ${this.getConfidenceBar()}
Peak Achievement: ${Math.round(this.confidenceMetrics.peak * 100)}%
Average Baseline: ${Math.round(this.confidenceMetrics.average * 100)}%
Trend: ${this.confidenceMetrics.trend.toUpperCase()} ${this.getTrendEmoji()}

📈 CONFIDENCE FACTORS:
• Achievements logged: ${this.achievements.length}
• Skills recognized: ${this.skillInventory.size}
• Growth milestones: ${this.growthJourney.length}

💡 BOOST TECHNIQUES:
1. Log small wins daily (they count!)
2. Review past achievements when doubtful
3. Compare to your past self, not others
4. Celebrate learning from failures

Remember: Confidence isn't "I know everything"
It's "I can figure this out"`;
  }

  private getTrendEmoji(): string {
    switch(this.confidenceMetrics.trend) {
      case 'rising': return '📈';
      case 'falling': return '📉';
      default: return '➡️';
    }
  }

  private analyzeSkills(): string {
    if (this.skillInventory.size === 0) {
      this.initializeSkills();
    }
    
    const sortedSkills = Array.from(this.skillInventory.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    return `🛠️ SKILL INVENTORY ANALYSIS:

TOP SKILLS YOU ACTUALLY HAVE:
${sortedSkills.map(([skill, level]) => 
  `• ${skill}: ${'⭐'.repeat(Math.min(5, Math.round(level)))} (Level ${level})`
).join('\n')}

🎯 HIDDEN SKILLS YOU DON'T REALIZE:
• Googling: Expert (everyone's secret weapon)
• Pattern Recognition: Growing daily
• Problem Decomposition: Better than you think
• Persistence: Off the charts
• Learning Ability: Proven by being here

📝 SKILLS THAT DON'T ACTUALLY EXIST:
• "Full Stack" (nobody knows the full stack)
• "10x Developer" (marketing myth)
• "Knowing everything" (impossible and unnecessary)

The only skill that matters: Figuring it out as you go.`;
  }

  private initializeSkills(): void {
    const baseSkills = [
      'Problem Solving', 'Debugging', 'Learning', 'Adaptability',
      'Code Reading', 'Communication', 'Persistence', 'Creativity'
    ];
    
    baseSkills.forEach(skill => {
      this.skillInventory.set(skill, Math.random() * 3 + 2);
    });
  }

  private showGrowthJourney(): string {
    if (this.growthJourney.length === 0) {
      this.initializeJourney();
    }
    
    return `🌱 YOUR GROWTH JOURNEY:

${this.growthJourney.map(m => 
  `📍 ${m.date.toLocaleDateString()}: ${m.milestone}`
).join('\n')}

📈 GROWTH VELOCITY:
You're ${Math.round(Math.random() * 30 + 20)}% faster at learning than 6 months ago

🎯 NEXT MILESTONES:
• Whatever you're struggling with now (future easy task)
• That thing that seems impossible (future Tuesday)
• The concept that makes no sense (future "oh, that's it?")

💭 REMEMBER:
Every expert was once disaster at what they do.
Every master was once terrible.
Every senior was once junior.

You're not behind. You're on your way.`;
  }

  private initializeJourney(): void {
    this.growthJourney = [
      { date: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), milestone: 'Wrote first "Hello World"' },
      { date: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), milestone: 'Fixed first bug (created 3 more)' },
      { date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), milestone: 'Understood async/await (mostly)' },
      { date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), milestone: 'Helped someone else debug' },
      { date: new Date(), milestone: 'Still here, still growing' }
    ];
  }

  private provideReassurance(input: string): string {
    const responses = [
      `You know what? The fact you're questioning yourself means you care about doing good work. That's competence, not impostor syndrome.`,
      `Fun fact: The developers you admire have the same doubts. They just have better PR.`,
      `Your code works. That's not luck. That's skill meeting effort.`,
      `Remember: Real impostors don't worry about being impostors. They're too busy being confidently wrong.`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)] + '\n\n' + this.getMotivationalQuote();
  }

  private getMotivationalQuote(): string {
    const quotes = [
      '"The expert in anything was once a disaster at it." - Ancient Developer Proverb',
      '"I have not failed. I\'ve just found 10,000 npm packages that don\'t work." - Edison (probably)',
      '"It\'s not a bug, it\'s a learning opportunity with unexpected behavior." - Every Dev Ever',
      '"Comparison is the thief of joy and the source of unnecessary refactoring." - Roosevelt.js'
    ];
    
    return '💭 ' + quotes[Math.floor(Math.random() * quotes.length)];
  }

  generatePrompt(): string {
    return this.getSystemPrompt();
  }
}