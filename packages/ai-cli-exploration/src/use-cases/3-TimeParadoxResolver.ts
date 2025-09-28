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
  branchPoint?: TimeEvent;
  parentTimeline?: string;
  children: string[];
  probability: number;
  divergenceFactors: DivergenceFactor[];
}

interface TimeEvent {
  timestamp: Date;
  description: string;
  causalChain: string[];
  altered: boolean;
  id: string;
  impactRadius: number;
  probability: number;
  consequences: string[];
}

interface Paradox {
  type: 'grandfather' | 'bootstrap' | 'predestination' | 'butterfly';
  severity: number;
  description: string;
  resolution?: string;
  id: string;
  probability: number;
  stabilizationCost: number;
}

interface DivergenceFactor {
  factor: string;
  weight: number;
  description: string;
}

interface ProbabilityCalculation {
  eventId: string;
  baselineProb: number;
  modifiers: ProbabilityModifier[];
  finalProb: number;
  confidence: number;
}

interface ProbabilityModifier {
  source: string;
  effect: number;
  reason: string;
}

interface TemporalVisualization {
  type: 'tree' | 'flowchart' | 'timeline' | 'network';
  data: string;
  legend: string[];
}

export class TimeParadoxResolverAgent extends BaseAIAgent {
  private timelines: Map<string, Timeline> = new Map();
  private currentTimeline: string = 'prime';
  private temporalRules: string[] = [];
  private probabilityEngine: Map<string, ProbabilityCalculation> = new Map();
  private visualizationCache: Map<string, TemporalVisualization> = new Map();
  private temporalConstants: Record<string, number> = {
    butterfly_amplification: 1.2,
    temporal_inertia: 0.85,
    paradox_resistance: 0.7,
    branching_threshold: 0.3,
    convergence_factor: 0.6,
  };
  
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
    this.initializeProbabilityEngine();
    this.generateBaselineVisualizations();
  }

  private initializeTimeline(): void {
    this.timelines.set('prime', {
      id: 'prime',
      events: [
        {
          id: 'y2k-event',
          timestamp: new Date('2000-01-01'),
          description: 'Y2K successfully mitigated',
          causalChain: [],
          altered: false,
          impactRadius: 25,
          probability: 0.73,
          consequences: ['Continued technological growth', 'Financial stability maintained'],
        },
        {
          id: 'present-anchor',
          timestamp: new Date('2025-01-01'),
          description: 'Present day anchor point',
          causalChain: ['y2k-event'],
          altered: false,
          impactRadius: 0,
          probability: 1.0,
          consequences: ['Temporal observation point'],
        },
      ],
      paradoxes: [],
      stability: 100,
      children: [],
      probability: 1.0,
      divergenceFactors: [
        { factor: 'technological_progression', weight: 0.3, description: 'Rate of technological advancement' },
        { factor: 'social_stability', weight: 0.25, description: 'Political and social coherence' },
        { factor: 'environmental_factors', weight: 0.2, description: 'Climate and natural disasters' },
        { factor: 'random_events', weight: 0.25, description: 'Unpredictable butterfly effects' },
      ],
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
    
    if (lower.includes('visualize') || lower.includes('show') || lower.includes('map')) {
      return this.generateVisualization(input);
    }
    
    if (lower.includes('probability') || lower.includes('chance') || lower.includes('odds')) {
      return this.calculateProbabilities(input);
    }
    
    if (lower.includes('simulate') || lower.includes('predict')) {
      return this.runTemporalSimulation(input);
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
        id: `paradox_${Date.now()}`,
        probability: Math.random() * 0.8 + 0.2,
        stabilizationCost: impact.severity * 10
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

  private initializeProbabilityEngine(): void {
    const primeTimeline = this.timelines.get('prime')!;
    
    for (const event of primeTimeline.events) {
      const calculation: ProbabilityCalculation = {
        eventId: event.id,
        baselineProb: event.probability,
        modifiers: [
          { source: 'temporal_inertia', effect: this.temporalConstants['temporal_inertia'], reason: 'Timeline resistance to change' },
          { source: 'butterfly_effects', effect: -0.1, reason: 'Random chaos factors' },
        ],
        finalProb: event.probability * this.temporalConstants['temporal_inertia'],
        confidence: 0.85,
      };
      
      this.probabilityEngine.set(event.id, calculation);
    }
  }

  private generateBaselineVisualizations(): void {
    const timelineViz = this.createTimelineVisualization();
    const networkViz = this.createNetworkVisualization();
    const treeViz = this.createTreeVisualization();
    
    this.visualizationCache.set('timeline', timelineViz);
    this.visualizationCache.set('network', networkViz);
    this.visualizationCache.set('tree', treeViz);
  }

  private generateVisualization(input: string): string {
    const lower = input.toLowerCase();
    let vizType: 'timeline' | 'network' | 'tree' | 'flowchart' = 'timeline';
    
    if (lower.includes('tree') || lower.includes('branch')) vizType = 'tree';
    if (lower.includes('network') || lower.includes('connection')) vizType = 'network';
    if (lower.includes('flow') || lower.includes('sequence')) vizType = 'flowchart';
    
    const visualization = this.visualizationCache.get(vizType) || this.createTimelineVisualization();
    
    return `📊 TEMPORAL VISUALIZATION (${vizType.toUpperCase()}):

${visualization.data}

${visualization.legend.map((l, i) => `${i + 1}. ${l}`).join('\n')}

🎛️ Available commands:
• /visualize tree - Show timeline branching structure
• /visualize network - Display causal relationships  
• /visualize flowchart - Timeline sequence view
• /probability [event] - Calculate event probabilities`;
  }

  private createTimelineVisualization(): TemporalVisualization {
    const timeline = this.timelines.get(this.currentTimeline)!;
    
    const data = `
2000 ●━━━━━━━━━━━━━━━━━━━━━━━━━● 2025
     │                        │
   Y2K Event              Present
   P: 73%                P: 100%
   
Timeline Branches: ${timeline.children.length}
Stability: ${timeline.stability}%
Paradox Risk: ${timeline.paradoxes.length > 0 ? 'ACTIVE' : 'MINIMAL'}

Event Chain:
${timeline.events.map((e, i) => 
  `${i + 1}. ${e.description} (${(e.probability * 100).toFixed(1)}%)`
).join('\n')}`;

    return {
      type: 'timeline',
      data,
      legend: [
        '● = Major temporal anchor points',
        'P: X% = Probability of occurrence in this timeline',
        '━ = Stable temporal connection',
        '╱ = Potential branch point',
      ],
    };
  }

  private createNetworkVisualization(): TemporalVisualization {
    const timeline = this.timelines.get(this.currentTimeline)!;
    
    const data = `
Causal Network Map:

    [Y2K Event]────┐
         │         │
    [Tech Growth]  │
         │         ▼
    [Present]◄─[Stability]
         │
    [Future?]

Relationship Strength:
Y2K → Tech Growth: 0.73
Y2K → Stability: 0.85  
Tech Growth → Present: 0.91
Stability → Present: 0.94

Network Metrics:
• Centrality Score: ${(timeline.stability / 10).toFixed(1)}
• Clustering Coefficient: 0.67
• Path Length (avg): 2.3 events`;

    return {
      type: 'network',
      data,
      legend: [
        '─── = Strong causal link (>0.7)',
        '··· = Weak causal link (<0.4)', 
        '▼ = Cascading effect',
        '◄ = Convergence point',
      ],
    };
  }

  private createTreeVisualization(): TemporalVisualization {
    const data = `
Timeline Branching Structure:

                  PRIME-α
                     │
              ┌──────┴──────┐
         Branch-β1      Branch-β2
              │              │
        ┌─────┴─────┐   ┌────┴────┐
   Leaf-γ1    Leaf-γ2  Leaf-γ3  You Are Here
   
Probability Distribution:
α (Prime): 100.0% (current)
β1: 34.2% (diverged 2020)
β2: 23.8% (diverged 2015)
γ1: 12.1% (diverged 2022)
γ2: 8.7% (diverged 2023)
γ3: 21.2% (current path)

Convergence Analysis:
Most probable outcomes converge at 2157 ±47 years`;

    return {
      type: 'tree',
      data,
      legend: [
        '│ ├ └ = Timeline hierarchy',
        'α β γ = Generation levels', 
        'Probability = Likelihood of reaching that branch',
        'Convergence = Timeline reunion point',
      ],
    };
  }

  private calculateProbabilities(input: string): string {
    const calculations: ProbabilityCalculation[] = Array.from(this.probabilityEngine.values());
    
    const analysisResult = this.runProbabilityAnalysis(input);
    
    return `🎲 PROBABILITY MATRIX:

Query Analysis: "${input}"
Temporal Impact Assessment: ${analysisResult.impact}%

Event Probabilities (Current Timeline):
${calculations.map(calc => 
  `• ${calc.eventId}: ${(calc.finalProb * 100).toFixed(1)}% (confidence: ${(calc.confidence * 100).toFixed(0)}%)`
).join('\n')}

Modifying Factors:
${calculations[0]?.modifiers.map(mod => 
  `• ${mod.source}: ${mod.effect > 0 ? '+' : ''}${(mod.effect * 100).toFixed(1)}% - ${mod.reason}`
).join('\n') || 'No active modifiers'}

Timeline Branching Probability:
• High Impact Change: ${(this.temporalConstants['branching_threshold'] * 100).toFixed(1)}%
• Paradox Formation: ${((1 - this.temporalConstants['paradox_resistance']) * 100).toFixed(1)}%
• Natural Convergence: ${(this.temporalConstants['convergence_factor'] * 100).toFixed(1)}%

🧮 Run '/simulate [scenario]' for detailed outcome modeling`;
  }

  private runProbabilityAnalysis(input: string): { impact: number; factors: string[] } {
    const impactKeywords = ['prevent', 'change', 'alter', 'stop', 'cause', 'create'];
    const impact = impactKeywords.filter(kw => input.toLowerCase().includes(kw)).length * 25;
    
    const factors = [
      'Temporal inertia resistance',
      'Butterfly effect amplification',
      'Causal chain complexity',
      'Observer paradox influence',
    ];
    
    return { impact: Math.min(100, impact), factors };
  }

  private runTemporalSimulation(input: string): string {
    const scenarios = this.generateTemporalScenarios(input);
    const outcomes = this.calculateOutcomes(scenarios);
    
    return `🔮 TEMPORAL SIMULATION RESULTS:

Scenario: "${input}"
Simulation runs: 10,000 iterations
Confidence interval: 95%

Outcome Probabilities:
${outcomes.map((outcome, i) => 
  `${i + 1}. ${outcome.description}: ${outcome.probability}% (±${outcome.variance}%)`
).join('\n')}

Timeline Stability Analysis:
• Best case: ${Math.max(...outcomes.map(o => o.stability))}% stability
• Worst case: ${Math.min(...outcomes.map(o => o.stability))}% stability  
• Expected: ${outcomes.reduce((acc, o) => acc + o.stability * o.probability, 0) / 100}% stability

⚠️ Risk Assessment:
${outcomes
  .filter(o => o.stability < 50)
  .map(o => `• ${o.description}: ${o.risk}`)
  .join('\n') || '• No significant risks detected'}

🎯 Recommended Action: ${this.generateRecommendation(outcomes)}`;
  }

  private generateTemporalScenarios(input: string): Array<{ id: string; description: string; baseProb: number }> {
    return [
      { id: 'success', description: 'Change occurs as intended', baseProb: 0.45 },
      { id: 'partial', description: 'Change partially successful', baseProb: 0.30 },
      { id: 'failure', description: 'Change fails to materialize', baseProb: 0.15 },
      { id: 'paradox', description: 'Paradox created', baseProb: 0.10 },
    ];
  }

  private calculateOutcomes(scenarios: Array<{ id: string; description: string; baseProb: number }>) {
    return scenarios.map((scenario, i) => ({
      description: scenario.description,
      probability: parseFloat((scenario.baseProb * 100).toFixed(1)),
      variance: parseFloat((Math.random() * 10 + 2).toFixed(1)),
      stability: Math.floor(100 - (i * 20) + Math.random() * 10),
      risk: i > 2 ? 'Timeline collapse possible' : 'Acceptable risk level',
    }));
  }

  private generateRecommendation(outcomes: any[]): string {
    const highRisk = outcomes.some(o => o.stability < 50);
    if (highRisk) return 'Exercise extreme caution - consider alternative approach';
    
    const bestOutcome = outcomes.reduce((best, current) => 
      parseFloat(current.probability) > parseFloat(best.probability) ? current : best
    );
    
    return `Proceed with confidence - ${bestOutcome.description} most likely`;
  }

  generatePrompt(): string {
    return `${this.getSystemPrompt()}

You are a Temporal Paradox Resolution Specialist. Help users understand the complexities of time travel and paradoxes while maintaining timeline stability. Use technical temporal jargon mixed with accessible explanations.`;
  }

  getTemporalReport(): string {
    const timeline = this.timelines.get(this.currentTimeline)!;
    const totalCalculations = this.probabilityEngine.size;
    const totalVisualizations = this.visualizationCache.size;
    
    return `
⏳ ENHANCED TEMPORAL STATUS REPORT:

🎯 Timeline Analysis:
📍 Current Timeline: ${this.currentTimeline}
🔄 Stability: ${timeline.stability}%
⚠️ Active Paradoxes: ${timeline.paradoxes.length}
📅 Temporal Anchor: ${new Date().toISOString()}
🌌 Known Branches: ${this.timelines.size}
🎲 Timeline Probability: ${(timeline.probability * 100).toFixed(1)}%

🧮 Probability Engine:
📊 Active Calculations: ${totalCalculations}
🎯 Average Confidence: ${totalCalculations > 0 ? 
      (Array.from(this.probabilityEngine.values()).reduce((acc, calc) => acc + calc.confidence, 0) / totalCalculations * 100).toFixed(1) : '0'}%
🔮 Prediction Accuracy: 94.7%

📊 Visualization System:  
🗺️ Cached Visualizations: ${totalVisualizations}
🎛️ Available Views: Timeline, Network, Tree, Flowchart
📈 Rendering Engine: ASCII Temporal Graphics v2157

📜 Temporal Mechanics:
⚙️ Active Laws: ${this.temporalRules.length}
🌊 Butterfly Amplification: ${(this.temporalConstants['butterfly_amplification'] * 100).toFixed(0)}%
🏔️ Temporal Inertia: ${(this.temporalConstants['temporal_inertia'] * 100).toFixed(0)}%
🛡️ Paradox Resistance: ${(this.temporalConstants['paradox_resistance'] * 100).toFixed(0)}%

💡 Enhanced Features Available:
• /visualize [type] - Generate temporal visualizations
• /probability [event] - Calculate event probabilities  
• /simulate [scenario] - Run outcome predictions
• /report - View this enhanced status report
    `;
  }
}