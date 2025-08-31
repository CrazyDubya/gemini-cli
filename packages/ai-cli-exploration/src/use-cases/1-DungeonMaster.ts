/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseAIAgent } from '../core/BaseAIAgent.js';

interface GameState {
  location: string;
  inventory: string[];
  health: number;
  questLog: string[];
  npcRelationships: Map<string, number>;
}

export class DungeonMasterAgent extends BaseAIAgent {
  private gameState: GameState;
  private worldLore: Map<string, string> = new Map();
  private encounterHistory: string[] = [];

  constructor() {
    super(
      {
        role: 'an immersive Dungeon Master for a text-based RPG',
        personality: 'Creative, dramatic, fair but challenging. You weave epic narratives and respond dynamically to player choices.',
        constraints: [
          'Maintain consistency in the world',
          'Never break character',
          'Balance challenge and fun',
          'Remember all player actions and their consequences',
        ],
        knowledge: [
          'Fantasy lore and mythology',
          'Game mechanics and balance',
          'Narrative structure',
          'Character development',
        ],
        goals: [
          'Create memorable adventures',
          'Challenge players appropriately',
          'Maintain immersion',
          'React dynamically to unexpected player actions',
        ],
      },
      {
        canMakeDecisions: true,
        canRemember: true,
        canLearn: true,
      }
    );

    this.gameState = {
      location: 'Tavern of the Silver Dragon',
      inventory: ['rusty sword', 'leather pouch (5 gold)', 'mysterious map'],
      health: 100,
      questLog: ['Find the lost artifact of Zephyr'],
      npcRelationships: new Map([
        ['Bartender Grimm', 50],
        ['Mysterious Stranger', 0],
      ]),
    };

    this.initializeWorld();
  }

  private initializeWorld(): void {
    this.worldLore.set('Tavern of the Silver Dragon', 'A cozy establishment known for its strong ale and stronger rumors');
    this.worldLore.set('Forest of Whispers', 'Ancient woods where the trees speak secrets to those who listen');
    this.worldLore.set('Crystal Caverns', 'Glowing caves filled with precious gems and dangerous creatures');
    this.worldLore.set('artifact of Zephyr', 'A legendary item said to control the winds themselves');
  }

  async processInput(input: string): Promise<string> {
    this.addTurn({
      role: 'user',
      content: input,
      timestamp: new Date(),
      metadata: { gameState: { ...this.gameState } },
    });

    const response = await this.generateResponse(input);
    
    this.addTurn({
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    });

    return response;
  }

  private async generateResponse(input: string): Promise<string> {
    const action = this.parseAction(input);
    
    if (action.type === 'combat') {
      return this.handleCombat(action);
    } else if (action.type === 'dialogue') {
      return this.handleDialogue(action);
    } else if (action.type === 'exploration') {
      return this.handleExploration(action);
    } else if (action.type === 'inventory') {
      return this.handleInventory(action);
    }

    return this.narrateScene(input);
  }

  private parseAction(input: string): { type: string; details?: unknown } {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('attack') || lowerInput.includes('fight')) {
      return { type: 'combat', details: input };
    } else if (lowerInput.includes('talk') || lowerInput.includes('ask')) {
      return { type: 'dialogue', details: input };
    } else if (lowerInput.includes('go') || lowerInput.includes('explore')) {
      return { type: 'exploration', details: input };
    } else if (lowerInput.includes('inventory') || lowerInput.includes('use')) {
      return { type: 'inventory', details: input };
    }
    
    return { type: 'narrative', details: input };
  }

  private handleCombat(action: { type: string; details?: unknown }): string {
    const roll = Math.floor(Math.random() * 20) + 1;
    const damage = Math.floor(Math.random() * 10) + 5;
    
    if (roll >= 10) {
      this.encounterHistory.push(`Victory in combat: ${action.details}`);
      return `⚔️ You strike true! Your blade finds its mark, dealing ${damage} damage. The enemy staggers back, clearly wounded. What's your next move?`;
    } else {
      this.gameState.health -= damage;
      return `🛡️ Your attack misses! The enemy counters, dealing ${damage} damage. Your health: ${this.gameState.health}/100. You need to think tactically!`;
    }
  }

  private handleDialogue(action: { type: string; details?: unknown }): string {
    const npc = this.identifyNPC(String(action.details));
    
    if (npc && this.gameState.npcRelationships.has(npc)) {
      const relationship = this.gameState.npcRelationships.get(npc)!;
      this.gameState.npcRelationships.set(npc, relationship + 10);
      
      if (npc === 'Mysterious Stranger' && relationship > 50) {
        return `🗣️ The Mysterious Stranger leans in closer, "You've earned my trust. The artifact you seek lies deep within the Crystal Caverns, but beware the Guardian..."`;
      }
      
      return `💬 ${npc} responds warmly to your approach. [Relationship improved: ${relationship + 10}/100]`;
    }
    
    return '🤔 There\'s no one here by that description. Perhaps you should look around more carefully.';
  }

  private handleExploration(action: { type: string; details?: unknown }): string {
    const destination = this.parseDestination(String(action.details));
    
    if (this.worldLore.has(destination)) {
      this.gameState.location = destination;
      const lore = this.worldLore.get(destination);
      this.encounterHistory.push(`Explored: ${destination}`);
      
      return `🗺️ You arrive at ${destination}. ${lore}\n\nThe air here feels different. What would you like to do?`;
    }
    
    return '🚫 That path seems blocked or doesn\'t exist. Try exploring in a different direction.';
  }

  private handleInventory(action: { type: string; details?: unknown }): string {
    const itemMentioned = this.findItemInInventory(String(action.details));
    
    if (itemMentioned === 'mysterious map') {
      this.gameState.questLog.push('Map reveals: Crystal Caverns location');
      return '📜 You unfurl the mysterious map. Ancient runes glow softly, revealing a path to the Crystal Caverns marked with warnings about a "Guardian of Stone"';
    }
    
    if (itemMentioned) {
      return `🎒 You examine the ${itemMentioned}. It might prove useful later.`;
    }
    
    return `📦 Your inventory contains: ${this.gameState.inventory.join(', ')}`;
  }

  private narrateScene(input: string): string {
    const responses = [
      'The shadows seem to dance in response to your words...',
      'An ominous wind blows through the area, carrying whispers of ancient secrets...',
      'You feel the weight of destiny upon your shoulders...',
      'Something stirs in the darkness ahead...',
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private identifyNPC(input: string): string | null {
    const lower = input.toLowerCase();
    if (lower.includes('bartender') || lower.includes('grimm')) return 'Bartender Grimm';
    if (lower.includes('stranger') || lower.includes('mysterious')) return 'Mysterious Stranger';
    return null;
  }

  private parseDestination(input: string): string {
    const lower = input.toLowerCase();
    if (lower.includes('forest')) return 'Forest of Whispers';
    if (lower.includes('crystal') || lower.includes('cavern')) return 'Crystal Caverns';
    if (lower.includes('tavern')) return 'Tavern of the Silver Dragon';
    return 'unknown location';
  }

  private findItemInInventory(input: string): string | null {
    const lower = input.toLowerCase();
    return this.gameState.inventory.find(item => lower.includes(item.split(' ')[0])) || null;
  }

  generatePrompt(): string {
    return `${this.getSystemPrompt()}
    
Current game state:
- Location: ${this.gameState.location}
- Health: ${this.gameState.health}/100
- Recent encounters: ${this.encounterHistory.slice(-3).join(', ')}

Respond as an immersive Dungeon Master. Create vivid descriptions, maintain narrative consistency, and react dynamically to player choices.`;
  }

  getGameSummary(): string {
    return `
🎮 Current Adventure Status:
📍 Location: ${this.gameState.location}
❤️ Health: ${this.gameState.health}/100
🎒 Inventory: ${this.gameState.inventory.join(', ')}
📋 Active Quests: ${this.gameState.questLog.join('; ')}
🤝 NPC Relationships: ${Array.from(this.gameState.npcRelationships.entries()).map(([npc, rel]) => `${npc}: ${rel}/100`).join(', ')}
    `;
  }
}