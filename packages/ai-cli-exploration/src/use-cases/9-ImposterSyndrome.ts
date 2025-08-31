/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseAIAgent } from '../core/BaseAIAgent.js';

export class ImposterSyndromeCoachAgent extends BaseAIAgent {
  private achievements: string[] = [];
  private impostorThoughts: Map<string, string> = new Map();

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
  }

  async processInput(input: string): Promise<string> {
    const lower = input.toLowerCase();
    
    if (lower.includes("don't know") || lower.includes('not sure')) {
      return this.handleUncertainty();
    } else if (lower.includes('everyone') || lower.includes('better')) {
      return this.handleComparison();
    } else if (lower.includes('failed') || lower.includes('mistake')) {
      return this.reframeFail(input);
    }
    
    return this.provideReassurance(input);
  }

  private handleUncertainty(): string {
    return `🤝 REALITY CHECK:

"I don't know" is the beginning of wisdom, not the end of credibility.

Fun facts:
• Senior devs Google basic syntax daily
• That "expert" has 47 Stack Overflow tabs open
• The person who wrote the documentation doesn't understand it either
• npm install failing? You're in good company with literally everyone

Your uncertainty means you're aware of complexity. That's expertise, not impostor syndrome.

Real imposters say: "Oh that's easy, I'll have it done in an hour"
Real developers say: "Let me research that and get back to you"`;
  }

  private handleComparison(): string {
    return `📊 COMPARISON DETOX:

Stop comparing your behind-the-scenes to everyone else's highlight reel.

The Truth:
• That "genius" developer: Broke production 3 times last month
• The "rockstar": Copy-pastes from their own old projects
• The "10x developer": Just has 10x more time due to no life balance
• That perfect GitHub profile: 90% of those are "Initial commit"

You're comparing:
- Your struggles vs. Their victories
- Your learning vs. Their performance
- Your honesty vs. Their marketing

Remember: Everyone's code is held together by comments saying "// TODO: fix this properly"`;
  }

  private reframeFail(input: string): string {
    this.achievements.push(`Learned from: ${input}`);
    
    return `💪 FAILURE REFRAMED:

You didn't fail. You collected data.

What you call "mistakes":
• Tested an hypothesis that didn't work (that's science!)
• Found one of the 10,000 ways that doesn't work (Edison approved)
• Created a learning opportunity (MBA schools charge $200k for those)
• Proved you're trying things beyond your comfort zone (growth!)

Industry Secret: Every senior dev has:
- Deleted a production database
- Pushed API keys to GitHub  
- Spent 6 hours on a missing semicolon
- Googled "how to exit vim" multiple times

You're not an impostor. You're a developer. That's literally the job.`;
  }

  private provideReassurance(input: string): string {
    return `🌟 IMPOSTOR SYNDROME ANTIDOTE:

Your feeling is valid AND incorrect. Here's why:

1. You're aware of what you don't know (Dunning-Kruger says you're competent)
2. You care about quality (bad developers don't)
3. You're still learning (stagnant people don't feel like impostors)
4. You're here seeking growth (impostors hide)

Reminder Calibration:
✓ You've solved problems you once thought impossible
✓ Past you would be impressed by current you
✓ You know more than you did yesterday
✓ Someone, somewhere, considers you an expert

The tech industry truth: We're all making it up as we go, held together by Stack Overflow, coffee, and collective denial.

You belong here. Full stop.`;
  }

  generatePrompt(): string {
    return this.getSystemPrompt();
  }
}