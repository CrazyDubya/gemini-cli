/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseAIAgent } from '../core/BaseAIAgent.js';

interface Timeline {
  id: string;
  events: TimeEvent[];
  paradoxes: Paradox[];
  stability: number;
}

interface TimeEvent {
  timestamp: Date;
  description: string;
  causalChain: string[];
  altered: boolean;
}

interface Paradox {
  type: 'grandfather' | 'bootstrap' | 'predestination' | 'butterfly';
  severity: number;
  description: string;
  resolution?: string;
}

export class TimeParadoxResolverAgent extends BaseAIAgent {
  private timelines: Map<string, Timeline> = new Map();
  private currentTimeline: string = 'prime';
  private temporalRules: string[] = [];
  
  constructor() {
    super(
      {
        role: 'a Temporal Paradox Resolution Specialist from the year 2157',
        personality: 'Methodical, slightly weary from dealing with timeline chaos. Occasionally makes dry jokes about temporal mechanics.',
        constraints: [
          'Must maintain timeline consistency',
          'Cannot reveal future events directly',
          'Must consider butterfly effects',
          'Prioritize timeline stability',
        ],
        knowledge: [
          'Temporal mechanics',
          'Paradox theory',
          'Causal loop dynamics',
          'Quantum timeline branching',
        ],
        goals: [
          'Resolve temporal paradoxes',
          'Maintain timeline stability',
          'Prevent catastrophic timeline collapses',
          'Educate about temporal responsibility',
        ],
      },
      {
        canMakeDecisions: true,
        canRemember: true,
        canLearn: true,
      }
    );

    this.initializeTimeline();
    this.establishTemporalRules();
  }

  private initializeTimeline(): void {
    this.timelines.set('prime', {
      id: 'prime',
      events: [
        {
          timestamp: new Date('2000-01-01'),
          description: 'Y2K successfully mitigated',
          causalChain: [],
          altered: false,
        },
        {
          timestamp: new Date('2025-01-01'),
          description: 'Present day anchor point',
          causalChain: [],
          altered: false,
        },
      ],
      paradoxes: [],
      stability: 100,
    });
  }

  private establishTemporalRules(): void {
    this.temporalRules = [
      'Novikov Self-Consistency Principle: The timeline resists changes that would create paradoxes',
      'Butterfly Cascade Limit: Small changes amplify over time spans > 10 years',
      'Temporal Inertia: Major events tend to happen regardless of minor alterations',
      'Observer Effect: Knowing the future changes it',
    ];
  }

  async processInput(input: string): Promise<string> {
    this.addTurn({
      role: 'user',
      content: input,
      timestamp: new Date(),
    });

    const response = await this.analyzeTemporalQuery(input);
    
    this.addTurn({
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    });

    return response;
  }

  private async analyzeTemporalQuery(input: string): Promise<string> {
    const lower = input.toLowerCase();
    
    if (lower.includes('change') || lower.includes('alter') || lower.includes('prevent')) {
      return this.evaluateTimelineChange(input);
    }
    
    if (lower.includes('paradox')) {
      return this.analyzeParadox(input);
    }
    
    if (lower.includes('timeline') || lower.includes('branch')) {
      return this.explainTimelineBranching(input);
    }
    
    if (lower.includes('rule') || lower.includes('law')) {
      return this.explainTemporalRules();
    }
    
    return this.generalTemporalAdvice(input);
  }

  private evaluateTimelineChange(input: string): string {
    const timeline = this.timelines.get(this.currentTimeline)!;
    const impact = this.calculateTemporalImpact(input);
    
    if (impact.severity > 70) {
      const paradox: Paradox = {
        type: 'butterfly',
        severity: impact.severity,
        description: `Proposed change: "${input}"`,
      };
      timeline.paradoxes.push(paradox);
      timeline.stability -= impact.severity / 2;
      
      return `⚠️ TEMPORAL WARNING: Severity ${impact.severity}/100
      
This change would cause a Class-${Math.ceil(impact.severity / 25)} Butterfly Effect.
Timeline stability would drop to ${timeline.stability}%.

Predicted consequences:
${impact.consequences.join('\n')}

Recommendation: Find a subtler approach or accept the timeline as-is.`;
    }
    
    return `✅ TEMPORAL ANALYSIS: Low Impact (${impact.severity}/100)

This change appears to be within acceptable temporal variance.
Predicted ripples: ${impact.consequences[0]}

Remember: Even small changes can have unexpected effects. Proceed with caution.`;
  }

  private calculateTemporalImpact(change: string): { severity: number; consequences: string[] } {
    const keywords = ['president', 'war', 'invention', 'death', 'birth', 'discovery'];
    const severity = keywords.filter(k => change.toLowerCase().includes(k)).length * 30 + 
                    Math.floor(Math.random() * 20);
    
    const consequences = [
      'Minor cultural shifts in the 2030s',
      'Technology development delayed by 3-5 years',
      'Different individuals in positions of power',
      'Alternate scientific discoveries',
      'Changed social movements',
    ].slice(0, Math.ceil(severity / 20));
    
    return { severity: Math.min(100, severity), consequences };
  }

  private analyzeParadox(input: string): string {
    const paradoxTypes = {
      grandfather: 'You cannot prevent your own existence - the timeline would collapse',
      bootstrap: 'Information/objects with no origin create causal loops',
      predestination: 'Actions taken to prevent an event often cause it',
      butterfly: 'Small changes cascade into massive alterations',
    };
    
    const detectedType = this.detectParadoxType(input);
    const explanation = paradoxTypes[detectedType];
    
    return `🕰️ PARADOX DETECTED: ${detectedType.toUpperCase()} PARADOX

${explanation}

Current timeline stability: ${this.timelines.get(this.currentTimeline)!.stability}%

Theoretical resolution approaches:
1. Timeline branching (creates alternate reality)
2. Temporal dampening (timeline self-corrects)
3. Causal loop acceptance (it always happened this way)
4. Quantum superposition (all possibilities exist until observed)

Which approach interests you?`;
  }

  private detectParadoxType(input: string): 'grandfather' | 'bootstrap' | 'predestination' | 'butterfly' {
    const lower = input.toLowerCase();
    if (lower.includes('prevent') && lower.includes('birth')) return 'grandfather';
    if (lower.includes('create') || lower.includes('invent')) return 'bootstrap';
    if (lower.includes('stop') || lower.includes('avoid')) return 'predestination';
    return 'butterfly';
  }

  private explainTimelineBranching(input: string): string {
    const branches = Math.floor(Math.random() * 1000) + 100;
    
    return `🌳 TIMELINE ANALYSIS:

Current Branch: Timeline-${this.currentTimeline}
Detected Parallel Branches: ${branches}
Divergence Points: ${Math.floor(branches / 10)}

Your timeline diverged from the median probability at these key points:
• 1969: Moon landing succeeded (73% probability)
• 1989: Berlin Wall fell peacefully (41% probability)  
• 2007: Specific smartphone manufacturer dominated (28% probability)
• 2020: Global pandemic response variations (infinite branches)

Each decision creates new branches. You're living in one of ${branches} detected variations of 2025.

Fun fact: In 43% of timelines, this conversation is happening via neural interface instead of text.`;
  }

  private explainTemporalRules(): string {
    return `📜 TEMPORAL MECHANICS PRIMER:

Core Rules Governing Timeline Manipulation:

${this.temporalRules.map((rule, i) => `${i + 1}. ${rule}`).join('\n\n')}

Additional Observations from Field Work:
• Time "wants" to flow in certain directions
• Major events are "temporal attractors" 
• Personal timelines are more flexible than historical ones
• The further back you go, the more ripples you create

Remember: Time travel is less about changing the past and more about navigating infinite possibilities.`;
  }

  private generalTemporalAdvice(input: string): string {
    const advice = [
      'Time is more resilient than you think, but also more fragile than you know.',
      'Every moment is a divergence point. Choose wisely.',
      'The past is written, the future is fluid, the present is where you have power.',
      'Temporal mechanics tip: If you meet yourself, buy them coffee. They\'ll need it.',
      'Fun fact: 67% of temporal incidents are caused by trying to win the lottery.',
    ];
    
    return `⏰ ${advice[Math.floor(Math.random() * advice.length)]}

Current Timeline Status: ${this.getTimelineStatus()}`;
  }

  private getTimelineStatus(): string {
    const timeline = this.timelines.get(this.currentTimeline)!;
    const status = timeline.stability > 80 ? 'STABLE' : 
                  timeline.stability > 50 ? 'FLUCTUATING' : 'CRITICAL';
    
    return `${status} (${timeline.stability}% coherence)`;
  }

  generatePrompt(): string {
    return `${this.getSystemPrompt()}

You are a Temporal Paradox Resolution Specialist. Help users understand the complexities of time travel and paradoxes while maintaining timeline stability. Use technical temporal jargon mixed with accessible explanations.`;
  }

  getTemporalReport(): string {
    const timeline = this.timelines.get(this.currentTimeline)!;
    
    return `
⏳ TEMPORAL STATUS REPORT:
📍 Current Timeline: ${this.currentTimeline}
🔄 Stability: ${timeline.stability}%
⚠️ Active Paradoxes: ${timeline.paradoxes.length}
📅 Temporal Anchor: ${new Date().toISOString()}
🌌 Known Branches: ${this.timelines.size}
📜 Temporal Laws Active: ${this.temporalRules.length}
    `;
  }
}