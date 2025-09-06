#!/usr/bin/env node
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import chalk from 'chalk';
import readline from 'readline';
import { DungeonMasterAgent } from '../use-cases/1-DungeonMaster.js';
import { DebuggerDuckAgent } from '../use-cases/2-DebuggerDuck.js';
import { TimeParadoxResolverAgent } from '../use-cases/3-TimeParadoxResolver.js';
import { DreamInterpreterAgent } from '../use-cases/4-DreamInterpreter.js';
import { QuantumDecisionAgent } from '../use-cases/5-QuantumDecision.js';
import { CulinaryAlchemistAgent } from '../use-cases/6-CulinaryAlchemist.js';
import { MemoryPalaceAgent } from '../use-cases/7-MemoryPalace.js';
import { GitTimeTravelAgent } from '../use-cases/8-GitTimeTravel.js';
import { ImposterSyndromeCoachAgent } from '../use-cases/9-ImposterSyndrome.js';
import { CodePoetAgent } from '../use-cases/10-CodePoet.js';
import { LegacyCodeMediumAgent } from '../use-cases/11-LegacyCodeMedium.js';
import { ZenMasterAgent } from '../use-cases/12-ZenMaster.js';
import { BaseAIAgent } from '../core/BaseAIAgent.js';
import { spawn } from 'child_process';

interface AgentInfo {
  id: number;
  name: string;
  emoji: string;
  description: string;
  category: string;
  create: () => BaseAIAgent;
}

export class InteractiveLauncher {
  private agents: AgentInfo[] = [
    {
      id: 0,
      name: 'Original Gemini CLI',
      emoji: '💎',
      description: 'Launch the original Gemini CLI for code generation and development assistance',
      category: 'Development',
      create: () => null as any, // Special case
    },
    {
      id: 1,
      name: 'Dungeon Master',
      emoji: '🎲',
      description: 'Interactive text RPG with persistent world state',
      category: 'Gaming',
      create: () => new DungeonMasterAgent(),
    },
    {
      id: 2,
      name: 'Rubber Duck Debugger',
      emoji: '🦆',
      description: 'Socratic debugging assistant that helps you solve problems',
      category: 'Debugging',
      create: () => new DebuggerDuckAgent(),
    },
    {
      id: 3,
      name: 'Time Paradox Resolver',
      emoji: '⏰',
      description: 'Analyze timeline changes and temporal paradoxes',
      category: 'Sci-Fi',
      create: () => new TimeParadoxResolverAgent(),
    },
    {
      id: 4,
      name: 'Dream Interpreter',
      emoji: '🌙',
      description: 'Jungian dream analysis and symbolism interpretation',
      category: 'Psychology',
      create: () => new DreamInterpreterAgent(),
    },
    {
      id: 5,
      name: 'Quantum Decision Engine',
      emoji: '⚛️',
      description: 'Evaluate decisions using quantum superposition',
      category: 'Decision',
      create: () => new QuantumDecisionAgent(),
    },
    {
      id: 6,
      name: 'Culinary Alchemist',
      emoji: '🧪',
      description: 'Transform ingredients through molecular gastronomy',
      category: 'Culinary',
      create: () => new CulinaryAlchemistAgent(),
    },
    {
      id: 7,
      name: 'Memory Palace Architect',
      emoji: '🏛️',
      description: 'Build mental spaces for memory storage',
      category: 'Learning',
      create: () => new MemoryPalaceAgent(),
    },
    {
      id: 8,
      name: 'Git Time Travel Guide',
      emoji: '🕐',
      description: 'Navigate repository history like an archaeologist',
      category: 'Version Control',
      create: () => new GitTimeTravelAgent(),
    },
    {
      id: 9,
      name: 'Imposter Syndrome Coach',
      emoji: '💪',
      description: 'Realistic encouragement for developers',
      category: 'Mental Health',
      create: () => new ImposterSyndromeCoachAgent(),
    },
    {
      id: 10,
      name: 'Code Poet',
      emoji: '📜',
      description: 'Transform code into beautiful poetry',
      category: 'Creative',
      create: () => new CodePoetAgent(),
    },
    {
      id: 11,
      name: 'Legacy Code Medium',
      emoji: '👻',
      description: 'Channel the spirits of developers past',
      category: 'Legacy',
      create: () => new LegacyCodeMediumAgent(),
    },
    {
      id: 12,
      name: 'Zen Master',
      emoji: '☯️',
      description: 'Programming wisdom through koans and paradoxes',
      category: 'Philosophy',
      create: () => new ZenMasterAgent(),
    },
  ];

  private rl: readline.Interface;
  private currentAgent: BaseAIAgent | null = null;
  private sessionHistory: Map<string, BaseAIAgent> = new Map();

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  async launch(): Promise<void> {
    this.printWelcome();
    await this.showMainMenu();
  }

  private printWelcome(): void {
    console.clear();
    console.log(chalk.bold.cyan('╔═══════════════════════════════════════════════════════════════╗'));
    console.log(chalk.bold.cyan('║') + chalk.bold.yellow('           AI CLI EXPLORATION - INTERACTIVE LAUNCHER          ') + chalk.bold.cyan('║'));
    console.log(chalk.bold.cyan('║') + chalk.gray('                12 Unique AI Agents + Original CLI            ') + chalk.bold.cyan('║'));
    console.log(chalk.bold.cyan('╚═══════════════════════════════════════════════════════════════╝'));
    console.log();
  }

  private async showMainMenu(): Promise<void> {
    console.log(chalk.bold.white('\n📋 Available AI Agents:\n'));
    
    // Group by category
    const categories = new Map<string, AgentInfo[]>();
    this.agents.forEach(agent => {
      if (!categories.has(agent.category)) {
        categories.set(agent.category, []);
      }
      categories.get(agent.category)!.push(agent);
    });

    // Display by category
    categories.forEach((agents, category) => {
      console.log(chalk.bold.magenta(`\n${category}:`));
      agents.forEach(agent => {
        console.log(
          chalk.cyan(`  [${agent.id.toString().padStart(2, ' ')}] `) +
          chalk.white(`${agent.emoji}  ${agent.name.padEnd(25)} `) +
          chalk.gray(`- ${agent.description}`)
        );
      });
    });

    console.log(chalk.bold.yellow('\n\nCommands:'));
    console.log(chalk.green('  [number]  - Select an agent'));
    console.log(chalk.green('  [s]       - Show saved sessions'));
    console.log(chalk.green('  [q]       - Quit'));
    console.log();

    const answer = await this.prompt(chalk.cyan('Select an agent (0-12) or command: '));
    
    if (answer.toLowerCase() === 'q') {
      console.log(chalk.yellow('\n👋 Goodbye!\n'));
      process.exit(0);
    } else if (answer.toLowerCase() === 's') {
      await this.showSavedSessions();
    } else {
      const selection = parseInt(answer);
      if (selection >= 0 && selection <= 12) {
        await this.launchAgent(selection);
      } else {
        console.log(chalk.red('\n❌ Invalid selection. Please try again.\n'));
        await this.showMainMenu();
      }
    }
  }

  private async launchAgent(id: number): Promise<void> {
    const agentInfo = this.agents[id];
    
    if (id === 0) {
      // Launch original Gemini CLI
      console.log(chalk.cyan('\n🚀 Launching original Gemini CLI...\n'));
      const gemini = spawn('npm', ['start'], {
        cwd: '/root/repo',
        stdio: 'inherit',
        shell: true,
      });
      
      gemini.on('close', (code) => {
        console.log(chalk.yellow(`\n✨ Gemini CLI exited with code ${code}\n`));
        this.showMainMenu();
      });
      
      return;
    }

    // Launch AI agent
    console.clear();
    console.log(chalk.bold.cyan('═'.repeat(70)));
    console.log(chalk.bold.yellow(`${agentInfo.emoji}  ${agentInfo.name.toUpperCase()}`));
    console.log(chalk.gray(agentInfo.description));
    console.log(chalk.bold.cyan('═'.repeat(70)));
    console.log();
    console.log(chalk.gray('Type your message, or use these commands:'));
    console.log(chalk.green('  /help    - Show agent-specific help'));
    console.log(chalk.green('  /reset   - Reset conversation'));
    console.log(chalk.green('  /save    - Save this session'));
    console.log(chalk.green('  /menu    - Return to main menu'));
    console.log(chalk.green('  /exit    - Quit application'));
    console.log();

    // Check for saved session
    const sessionKey = `agent_${id}`;
    if (this.sessionHistory.has(sessionKey)) {
      const resume = await this.prompt(chalk.yellow('Resume previous session? (y/n): '));
      if (resume.toLowerCase() === 'y') {
        this.currentAgent = this.sessionHistory.get(sessionKey)!;
        console.log(chalk.green('✅ Previous session restored!\n'));
      } else {
        this.currentAgent = agentInfo.create();
      }
    } else {
      this.currentAgent = agentInfo.create();
    }

    await this.runAgentSession(agentInfo);
  }

  private async runAgentSession(agentInfo: AgentInfo): Promise<void> {
    while (true) {
      const input = await this.prompt(chalk.cyan('\nYou: '));
      
      if (input.startsWith('/')) {
        const handled = await this.handleCommand(input, agentInfo);
        if (handled === 'menu') {
          await this.showMainMenu();
          return;
        } else if (handled === 'exit') {
          process.exit(0);
        }
      } else {
        try {
          const response = await this.currentAgent!.safeProcessInput(input);
          console.log(chalk.yellow(`\n${agentInfo.emoji}  Agent: `) + chalk.white(response));
        } catch (error) {
          console.log(chalk.red(`\n❌ Error: ${error}`));
        }
      }
    }
  }

  private async handleCommand(command: string, agentInfo: AgentInfo): Promise<string | void> {
    switch (command.toLowerCase()) {
      case '/help':
        console.log(chalk.green('\n📖 Agent Help:'));
        console.log(chalk.white(this.currentAgent!.getSystemPrompt()));
        break;
      
      case '/reset':
        this.currentAgent!.reset();
        console.log(chalk.green('✅ Conversation reset!'));
        break;
      
      case '/save':
        this.sessionHistory.set(`agent_${agentInfo.id}`, this.currentAgent!);
        console.log(chalk.green('✅ Session saved!'));
        break;
      
      case '/menu':
        return 'menu';
      
      case '/exit':
        console.log(chalk.yellow('\n👋 Goodbye!\n'));
        return 'exit';
      
      default:
        console.log(chalk.red('❌ Unknown command'));
    }
  }

  private async showSavedSessions(): Promise<void> {
    if (this.sessionHistory.size === 0) {
      console.log(chalk.yellow('\n📭 No saved sessions\n'));
    } else {
      console.log(chalk.green('\n💾 Saved Sessions:'));
      this.sessionHistory.forEach((_, key) => {
        const agentId = parseInt(key.split('_')[1]);
        const agent = this.agents[agentId];
        console.log(chalk.cyan(`  • ${agent.emoji}  ${agent.name}`));
      });
    }
    
    await this.prompt(chalk.gray('\nPress Enter to continue...'));
    await this.showMainMenu();
  }

  private prompt(question: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer);
      });
    });
  }

  close(): void {
    this.rl.close();
  }
}

// Main entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  const launcher = new InteractiveLauncher();
  launcher.launch().catch(console.error);
}