#!/usr/bin/env node
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import chalk from 'chalk';
import { DungeonMasterAgent } from './use-cases/1-DungeonMaster.js';
import { DebuggerDuckAgent } from './use-cases/2-DebuggerDuck.js';
import { TimeParadoxResolverAgent } from './use-cases/3-TimeParadoxResolver.js';
import { DreamInterpreterAgent } from './use-cases/4-DreamInterpreter.js';
import { QuantumDecisionAgent } from './use-cases/5-QuantumDecision.js';
import { CulinaryAlchemistAgent } from './use-cases/6-CulinaryAlchemist.js';
import { MemoryPalaceAgent } from './use-cases/7-MemoryPalace.js';
import { GitTimeTravelAgent } from './use-cases/8-GitTimeTravel.js';
import { ImposterSyndromeCoachAgent } from './use-cases/9-ImposterSyndrome.js';
import { CodePoetAgent } from './use-cases/10-CodePoet.js';
import { LegacyCodeMediumAgent } from './use-cases/11-LegacyCodeMedium.js';
import { ZenMasterAgent } from './use-cases/12-ZenMaster.js';

interface UseCase {
  id: number;
  title: string;
  description: string;
  category: string;
  agent: any;
  demo: () => Promise<void>;
}

class AICliShowcase {
  private useCases: UseCase[] = [
    {
      id: 1,
      title: '🎲 Interactive Dungeon Master',
      description: 'AI-powered text RPG with dynamic storytelling, persistent world state, and adaptive narrative',
      category: 'Gaming/Entertainment',
      agent: new DungeonMasterAgent(),
      demo: () => this.demoDungeonMaster(),
    },
    {
      id: 2,
      title: '🦆 Rubber Duck Debugger++',
      description: 'Enhanced rubber duck that asks Socratic questions and detects bug patterns',
      category: 'Development/Debugging',
      agent: new DebuggerDuckAgent(),
      demo: () => this.demoDebuggerDuck(),
    },
    {
      id: 3,
      title: '⏰ Time Paradox Resolver',
      description: 'Temporal mechanics consultant for analyzing timeline changes and paradoxes',
      category: 'Sci-Fi/Simulation',
      agent: new TimeParadoxResolverAgent(),
      demo: () => this.demoTimeParadox(),
    },
    {
      id: 4,
      title: '🌙 Dream Interpreter',
      description: 'Jungian dream analysis combining symbolism, archetypes, and psychology',
      category: 'Psychology/Wellness',
      agent: new DreamInterpreterAgent(),
      demo: () => this.demoDreamInterpreter(),
    },
    {
      id: 5,
      title: '⚛️ Quantum Decision Engine',
      description: 'Evaluates all decision branches simultaneously using quantum superposition metaphors',
      category: 'Decision Making',
      agent: new QuantumDecisionAgent(),
      demo: () => this.demoQuantumDecision(),
    },
    {
      id: 6,
      title: '🧪 Culinary Alchemist',
      description: 'Transforms ingredients through molecular gastronomy and ancient cooking wisdom',
      category: 'Culinary/Creative',
      agent: new CulinaryAlchemistAgent(),
      demo: () => this.demoCulinaryAlchemist(),
    },
    {
      id: 7,
      title: '🏛️ Memory Palace Architect',
      description: 'Builds navigable mental spaces for memory storage using method of loci',
      category: 'Learning/Memory',
      agent: new MemoryPalaceAgent(),
      demo: () => this.demoMemoryPalace(),
    },
    {
      id: 8,
      title: '🕐 Git Time Travel Guide',
      description: 'Navigate repository history like a time traveler with archaeological insights',
      category: 'Version Control',
      agent: new GitTimeTravelAgent(),
      demo: () => this.demoGitTimeTravel(),
    },
    {
      id: 9,
      title: '💪 Imposter Syndrome Coach',
      description: 'Realistic encouragement and perspective for developers doubting themselves',
      category: 'Mental Health',
      agent: new ImposterSyndromeCoachAgent(),
      demo: () => this.demoImposterCoach(),
    },
    {
      id: 10,
      title: '📜 Code Poet Laureate',
      description: 'Transforms code concepts into beautiful poetry and verse',
      category: 'Creative/Education',
      agent: new CodePoetAgent(),
      demo: () => this.demoCodePoet(),
    },
    {
      id: 11,
      title: '👻 Legacy Code Medium',
      description: 'Channels the spirits of developers past to understand ancient codebases',
      category: 'Legacy Systems',
      agent: new LegacyCodeMediumAgent(),
      demo: () => this.demoLegacyMedium(),
    },
    {
      id: 12,
      title: '☯️ Zen Master of Programming',
      description: 'Teaches programming wisdom through koans, paradoxes, and meditation',
      category: 'Philosophy/Wisdom',
      agent: new ZenMasterAgent(),
      demo: () => this.demoZenMaster(),
    },
  ];

  async run(): Promise<void> {
    this.printHeader();
    this.printOverview();
    
    console.log(chalk.cyan('\n🤖 Running demonstrations for all 12 AI CLI use cases...\n'));
    
    for (const useCase of this.useCases) {
      await this.demonstrateUseCase(useCase);
    }
    
    this.printSummary();
  }

  private printHeader(): void {
    console.log(chalk.bold.magenta('\n' + '='.repeat(80)));
    console.log(chalk.bold.magenta('     AI CLI EXPLORATION - 12 Unexpected Use Cases for Gemini CLI'));
    console.log(chalk.bold.magenta('='.repeat(80)));
  }

  private printOverview(): void {
    console.log(chalk.yellow('\n📋 Overview:'));
    console.log('This showcases how an AI CLI like Gemini can be repurposed in creative ways.');
    console.log('Each use case demonstrates unique personality, context, and interaction patterns.\n');
    
    console.log(chalk.green('🔧 Common AI Components:'));
    console.log('  • BaseAIAgent with personality and context management');
    console.log('  • Conversation history and compression');
    console.log('  • Memory and learning capabilities');
    console.log('  • Decision-making and pattern recognition');
    console.log('  • Dynamic prompt generation');
  }

  private async demonstrateUseCase(useCase: UseCase): Promise<void> {
    console.log(chalk.bold.blue(`\n${'-'.repeat(70)}`));
    console.log(chalk.bold.cyan(`${useCase.id}. ${useCase.title}`));
    console.log(chalk.gray(`   Category: ${useCase.category}`));
    console.log(chalk.white(`   ${useCase.description}`));
    console.log(chalk.bold.blue(`${'-'.repeat(70)}`));
    
    try {
      await useCase.demo();
    } catch (error) {
      console.log(chalk.red(`   ❌ Error: ${error}`));
    }
  }

  private async demoDungeonMaster(): Promise<void> {
    const dm = this.useCases[0].agent as DungeonMasterAgent;
    const response = await dm.processInput("I look around the tavern");
    console.log(chalk.green('   Sample Interaction:'));
    console.log(chalk.white(`   Player: "I look around the tavern"`));
    console.log(chalk.yellow(`   DM: ${response.substring(0, 200)}...`));
    console.log(chalk.cyan(dm.getGameSummary()));
  }

  private async demoDebuggerDuck(): Promise<void> {
    const duck = this.useCases[1].agent as DebuggerDuckAgent;
    const response = await duck.processInput("My loop isn't working correctly");
    console.log(chalk.green('   Sample Interaction:'));
    console.log(chalk.white(`   Dev: "My loop isn't working correctly"`));
    console.log(chalk.yellow(`   Duck: ${response.substring(0, 200)}...`));
    console.log(chalk.cyan(duck.getDebugStats()));
  }

  private async demoTimeParadox(): Promise<void> {
    const paradox = this.useCases[2].agent as TimeParadoxResolverAgent;
    const response = await paradox.processInput("What if I prevent a major invention?");
    console.log(chalk.green('   Sample Interaction:'));
    console.log(chalk.white(`   User: "What if I prevent a major invention?"`));
    console.log(chalk.yellow(`   Agent: ${response.substring(0, 250)}...`));
    console.log(chalk.cyan(paradox.getTemporalReport()));
  }

  private async demoDreamInterpreter(): Promise<void> {
    const dream = this.useCases[3].agent as DreamInterpreterAgent;
    const response = await dream.processInput("I dreamed I was flying over water");
    console.log(chalk.green('   Sample Interpretation:'));
    console.log(chalk.yellow(`   ${response.substring(0, 300)}...`));
  }

  private async demoQuantumDecision(): Promise<void> {
    const quantum = this.useCases[4].agent as QuantumDecisionAgent;
    const response = await quantum.processInput("Should I refactor or ship as-is?");
    console.log(chalk.green('   Quantum Analysis:'));
    console.log(chalk.yellow(`   ${response.substring(0, 300)}...`));
  }

  private async demoCulinaryAlchemist(): Promise<void> {
    const chef = this.useCases[5].agent as CulinaryAlchemistAgent;
    const response = await chef.processInput("chicken, lemon, thyme");
    console.log(chalk.green('   Alchemical Transformation:'));
    console.log(chalk.yellow(`   ${response.substring(0, 250)}...`));
  }

  private async demoMemoryPalace(): Promise<void> {
    const palace = this.useCases[6].agent as MemoryPalaceAgent;
    const response = await palace.processInput("remember API key starts with sk-");
    console.log(chalk.green('   Memory Stored:'));
    console.log(chalk.yellow(`   ${response.substring(0, 250)}...`));
  }

  private async demoGitTimeTravel(): Promise<void> {
    const git = this.useCases[7].agent as GitTimeTravelAgent;
    const response = await git.processInput("git blame this mess");
    console.log(chalk.green('   Git Archaeology:'));
    console.log(chalk.yellow(`   ${response.substring(0, 300)}...`));
  }

  private async demoImposterCoach(): Promise<void> {
    const coach = this.useCases[8].agent as ImposterSyndromeCoachAgent;
    const response = await coach.processInput("Everyone seems to know more than me");
    console.log(chalk.green('   Reality Check:'));
    console.log(chalk.yellow(`   ${response.substring(0, 300)}...`));
  }

  private async demoCodePoet(): Promise<void> {
    const poet = this.useCases[9].agent as CodePoetAgent;
    const response = await poet.processInput("Write a poem about recursion");
    console.log(chalk.green('   Code Poetry:'));
    console.log(chalk.yellow(`   ${response.substring(0, 200)}...`));
  }

  private async demoLegacyMedium(): Promise<void> {
    const medium = this.useCases[10].agent as LegacyCodeMediumAgent;
    const response = await medium.processInput("Why is this code so complex?");
    console.log(chalk.green('   Channeling Response:'));
    console.log(chalk.yellow(`   ${response.substring(0, 300)}...`));
  }

  private async demoZenMaster(): Promise<void> {
    const zen = this.useCases[11].agent as ZenMasterAgent;
    const response = await zen.processInput("I have a bug I can't fix");
    console.log(chalk.green('   Zen Wisdom:'));
    console.log(chalk.yellow(`   ${response.substring(0, 250)}...`));
  }

  private printSummary(): void {
    console.log(chalk.bold.yellow('\n' + '='.repeat(80)));
    console.log(chalk.bold.yellow('                           SUMMARY'));
    console.log(chalk.bold.yellow('='.repeat(80)));
    
    console.log(chalk.white('\n🎯 Key Innovations:'));
    console.log('  1. AI agents with persistent personality and context');
    console.log('  2. Domain-specific knowledge and interaction patterns');
    console.log('  3. Stateful conversations with memory and learning');
    console.log('  4. Creative problem-solving through unique perspectives');
    console.log('  5. Emotional and psychological support capabilities');
    
    console.log(chalk.cyan('\n💡 Potential Applications:'));
    console.log('  • Interactive education and training');
    console.log('  • Mental health and wellness support');
    console.log('  • Creative writing and ideation');
    console.log('  • Complex decision-making assistance');
    console.log('  • Legacy system understanding');
    console.log('  • Gamification of development tasks');
    
    console.log(chalk.green('\n✨ Why This Matters:'));
    console.log('  • Shows AI CLI tools can go beyond code generation');
    console.log('  • Demonstrates personality-driven interactions');
    console.log('  • Explores emotional and creative AI applications');
    console.log('  • Makes complex concepts accessible through metaphor');
    console.log('  • Provides support beyond technical assistance');
    
    console.log(chalk.magenta('\n🚀 Next Steps:'));
    console.log('  • Integrate with actual Gemini API for real AI responses');
    console.log('  • Add persistent storage for long-term memory');
    console.log('  • Create plugin system for custom agents');
    console.log('  • Build conversation branching and context switching');
    console.log('  • Implement multi-agent conversations');
    
    console.log(chalk.bold.magenta('\n' + '='.repeat(80)));
    console.log(chalk.bold.magenta('              END OF AI CLI EXPLORATION SHOWCASE'));
    console.log(chalk.bold.magenta('='.repeat(80) + '\n'));
  }
}

async function main(): Promise<void> {
  const showcase = new AICliShowcase();
  await showcase.run();
}

main().catch(console.error);