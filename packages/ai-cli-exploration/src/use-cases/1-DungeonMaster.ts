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
  maxHealth: number;
  level: number;
  experience: number;
  questLog: string[];
  npcRelationships: Map<string, number>;
  equipment: {
    weapon: string;
    armor: string;
    accessory: string;
  };
  skills: Map<string, number>;
}

interface CombatState {
  inCombat: boolean;
  enemy?: {
    name: string;
    health: number;
    maxHealth: number;
    attacks: string[];
    weaknesses: string[];
  };
  turnCount: number;
}

interface WorldNode {
  name: string;
  description: string;
  npcs: string[];
  items: string[];
  dangers: string[];
  connections: string[];
  discovered: boolean;
}

export class DungeonMasterAgent extends BaseAIAgent {
  private gameState: GameState;
  private worldLore: Map<string, string> = new Map();
  private encounterHistory: string[] = [];
  private combatLog: string[] = [];
  private savedGames: Map<string, GameState> = new Map();
  private combatState: CombatState = { inCombat: false, turnCount: 0 };
  private worldMap: Map<string, WorldNode> = new Map();
  private storyElements: {
    questHooks: string[];
    npcTemplates: string[];
    locationTypes: string[];
    treasureTypes: string[];
  };

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
      inventory: ['leather pouch (5 gold)', 'mysterious map'],
      health: 100,
      maxHealth: 100,
      level: 1,
      experience: 0,
      questLog: ['Find the lost artifact of Zephyr'],
      npcRelationships: new Map([
        ['Bartender Grimm', 50],
        ['Mysterious Stranger', 0],
      ]),
      equipment: {
        weapon: 'rusty sword',
        armor: 'leather vest',
        accessory: 'none',
      },
      skills: new Map([
        ['combat', 1],
        ['diplomacy', 1],
        ['exploration', 1],
        ['magic', 0],
      ]),
    };

    this.storyElements = {
      questHooks: [
        'A mysterious plague affecting the nearby village',
        'Strange lights seen in the abandoned tower',
        'Merchant caravans disappearing on the trade route',
        'Ancient ruins discovered after the earthquake',
        'A noble\'s daughter has gone missing',
        'Bandits demanding tribute from travelers',
      ],
      npcTemplates: [
        'Wise old hermit with ancient knowledge',
        'Desperate refugee fleeing danger',
        'Shady merchant with rare goods',
        'Battle-scarred veteran seeking redemption',
        'Young scholar researching forgotten lore',
        'Mysterious figure watching from the shadows',
      ],
      locationTypes: [
        'Forgotten Temple', 'Hidden Grove', 'Ancient Battlefield', 'Mystical Lake',
        'Crumbling Fortress', 'Enchanted Forest', 'Desert Oasis', 'Mountain Pass',
        'Underground City', 'Floating Island', 'Cursed Graveyard', 'Crystal Caves',
      ],
      treasureTypes: [
        'enchanted weapon', 'ancient tome', 'magical amulet', 'rare gemstone',
        'healing elixir', 'mysterious artifact', 'golden chalice', 'arcane focus',
      ],
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
    
    if (action.type === 'roll') {
      return this.handleDiceRoll(action);
    } else if (action.type === 'save') {
      return this.handleSaveLoad(action);
    } else if (action.type === 'worldgen') {
      return this.handleWorldGeneration(action);
    } else if (action.type === 'status') {
      return this.showCharacterStatus();
    } else if (action.type === 'equipment') {
      return this.handleEquipment(action);
    } else if (action.type === 'combat') {
      return this.handleAdvancedCombat(action);
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
    
    if (lowerInput.includes('roll') || lowerInput.includes('dice')) {
      return { type: 'roll', details: input };
    } else if (lowerInput.includes('save') || lowerInput.includes('load')) {
      return { type: 'save', details: input };
    } else if (lowerInput.includes('expand') || lowerInput.includes('generate')) {
      return { type: 'worldgen', details: input };
    } else if (lowerInput.includes('status') || lowerInput.includes('stats')) {
      return { type: 'status', details: input };
    } else if (lowerInput.includes('equip') || lowerInput.includes('wear')) {
      return { type: 'equipment', details: input };
    } else if (lowerInput.includes('attack') || lowerInput.includes('fight') || lowerInput.includes('cast')) {
      return { type: 'combat', details: input };
    } else if (lowerInput.includes('talk') || lowerInput.includes('ask')) {
      return { type: 'dialogue', details: input };
    } else if (lowerInput.includes('go') || lowerInput.includes('explore') || lowerInput.includes('venture')) {
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

  private handleDiceRoll(action: { type: string; details?: unknown }): string {
    const input = String(action.details).toLowerCase();
    const match = input.match(/d(\d+)/);
    const sides = match ? parseInt(match[1]) : 20;
    const roll = Math.floor(Math.random() * sides) + 1;
    
    let result = `🎲 Rolling D${sides}: ${roll}`;
    
    if (sides === 20) {
      if (roll === 20) result += ' - CRITICAL SUCCESS! 💫';
      else if (roll === 1) result += ' - CRITICAL FAILURE! 💀';
      else if (roll >= 15) result += ' - Great roll!';
      else if (roll <= 5) result += ' - Unfortunate...';
    }
    
    this.combatLog.push(`Rolled ${roll} on D${sides}`);
    return result;
  }

  private handleSaveLoad(action: { type: string; details?: unknown }): string {
    const input = String(action.details).toLowerCase();
    
    if (input.includes('save')) {
      const saveId = `save_${Date.now()}`;
      this.savedGames.set(saveId, JSON.parse(JSON.stringify(this.gameState)));
      return `💾 Game saved! Save ID: ${saveId}\nUse 'load ${saveId}' to restore this point.`;
    } else if (input.includes('load')) {
      const saveId = input.match(/save_\d+/)?.[0];
      if (saveId && this.savedGames.has(saveId)) {
        this.gameState = JSON.parse(JSON.stringify(this.savedGames.get(saveId)));
        return `📂 Game loaded from ${saveId}!\n${this.getGameSummary()}`;
      }
      return '❌ No save found with that ID.';
    }
    
    return '💾 Available saves: ' + Array.from(this.savedGames.keys()).join(', ');
  }

  // ===== MAJOR ENHANCEMENT 1: DYNAMIC WORLD GENERATION =====
  
  private handleWorldGeneration(action: { type: string; details?: unknown }): string {
    const input = String(action.details).toLowerCase();
    
    if (input.includes('location') || input.includes('area')) {
      return this.generateNewLocation();
    } else if (input.includes('quest') || input.includes('adventure')) {
      return this.generateQuest();
    } else if (input.includes('npc') || input.includes('character')) {
      return this.generateNPC();
    }
    
    return this.generateRandomWorldElement();
  }

  private generateNewLocation(): string {
    const locationType = this.storyElements.locationTypes[Math.floor(Math.random() * this.storyElements.locationTypes.length)];
    const locationName = this.createLocationName(locationType);
    
    const newLocation: WorldNode = {
      name: locationName,
      description: this.generateLocationDescription(locationType),
      npcs: this.generateLocationNPCs(),
      items: this.generateLocationItems(),
      dangers: this.generateLocationDangers(),
      connections: [this.gameState.location], // Connect to current location
      discovered: false,
    };
    
    this.worldMap.set(locationName, newLocation);
    this.worldLore.set(locationName, newLocation.description);
    
    return `🗺️ **NEW LOCATION DISCOVERED**

**${locationName}** (${locationType})
${newLocation.description}

🧭 **Notable Features:**
• NPCs: ${newLocation.npcs.join(', ')}
• Items: ${newLocation.items.join(', ')}
• Dangers: ${newLocation.dangers.join(', ')}

*This location has been added to your world map. You can now travel there by saying "go to ${locationName}"*`;
  }

  private createLocationName(type: string): string {
    const prefixes = ['Ancient', 'Lost', 'Forgotten', 'Hidden', 'Mystical', 'Cursed', 'Sacred', 'Ruined'];
    const suffixes = ['of the Ancients', 'of Shadows', 'of Whispers', 'of Echoes', 'of Stars', 'of Secrets'];
    
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    return `${prefix} ${type} ${suffix}`;
  }

  private generateLocationDescription(type: string): string {
    const descriptions: Record<string, string> = {
      'Forgotten Temple': 'Crumbling stone pillars reach toward a darkened sky, covered in strange glyphs that seem to shift when not directly observed.',
      'Hidden Grove': 'A peaceful clearing where ancient trees form a natural cathedral, their leaves whispering secrets of ages past.',
      'Ancient Battlefield': 'Weathered bones and rusted weapons dot this scarred landscape, where the echoes of long-forgotten conflicts still linger.',
      'Mystical Lake': 'Crystal-clear waters reflect more than just the sky - visions of other times and places sometimes appear in its depths.',
    };
    
    return descriptions[type] || `A mysterious ${type.toLowerCase()} that holds secrets waiting to be discovered.`;
  }

  private generateLocationNPCs(): string[] {
    const count = Math.floor(Math.random() * 3) + 1;
    const npcs = [];
    
    for (let i = 0; i < count; i++) {
      const template = this.storyElements.npcTemplates[Math.floor(Math.random() * this.storyElements.npcTemplates.length)];
      npcs.push(template);
    }
    
    return npcs;
  }

  private generateLocationItems(): string[] {
    const count = Math.floor(Math.random() * 3) + 1;
    const items = [];
    
    for (let i = 0; i < count; i++) {
      const treasure = this.storyElements.treasureTypes[Math.floor(Math.random() * this.storyElements.treasureTypes.length)];
      items.push(treasure);
    }
    
    return items;
  }

  private generateLocationDangers(): string[] {
    const dangers = ['Ancient traps', 'Hostile creatures', 'Unstable magic', 'Puzzling riddles', 'Environmental hazards', 'Cursed objects'];
    const count = Math.floor(Math.random() * 2) + 1;
    
    return dangers.slice(0, count);
  }

  private generateQuest(): string {
    const hook = this.storyElements.questHooks[Math.floor(Math.random() * this.storyElements.questHooks.length)];
    const reward = this.storyElements.treasureTypes[Math.floor(Math.random() * this.storyElements.treasureTypes.length)];
    const location = Array.from(this.worldMap.keys())[Math.floor(Math.random() * this.worldMap.size)] || 'a distant land';
    
    const questId = `Quest-${Date.now()}`;
    this.gameState.questLog.push(questId);
    
    return `📜 **NEW QUEST GENERATED**

**Quest: ${questId}**
${hook}

🎯 **Objective:** Investigate this matter and resolve the situation
📍 **Location:** ${location}
🏆 **Reward:** ${reward} + experience

*This quest has been added to your quest log*`;
  }

  private generateNPC(): string {
    const template = this.storyElements.npcTemplates[Math.floor(Math.random() * this.storyElements.npcTemplates.length)];
    const names = ['Alaric', 'Brenna', 'Caspian', 'Dara', 'Erwin', 'Freya', 'Garrett', 'Hilda'];
    const name = names[Math.floor(Math.random() * names.length)];
    const relationship = Math.floor(Math.random() * 100);
    
    this.gameState.npcRelationships.set(name, relationship);
    
    return `👤 **NEW NPC ENCOUNTERED**

**${name}**
${template}

💝 **Relationship:** ${relationship}/100
🗨️ **First Impression:** "${this.generateNPCQuote()}"

*You can now interact with ${name} by saying "talk to ${name}"*`;
  }

  private generateNPCQuote(): string {
    const quotes = [
      "I've been waiting for someone like you.",
      "These are dangerous times, traveler.",
      "I have information you might find useful.",
      "The road ahead is treacherous.",
      "Strange things have been happening lately.",
      "You look like someone who can handle themselves."
    ];
    
    return quotes[Math.floor(Math.random() * quotes.length)];
  }

  private generateRandomWorldElement(): string {
    const elements = ['location', 'quest', 'npc'];
    const choice = elements[Math.floor(Math.random() * elements.length)];
    
    switch (choice) {
      case 'location': return this.generateNewLocation();
      case 'quest': return this.generateQuest();
      case 'npc': return this.generateNPC();
      default: return 'The world shifts around you, but nothing new emerges just yet...';
    }
  }

  // ===== MAJOR ENHANCEMENT 2: ADVANCED COMBAT SYSTEM =====
  
  private handleAdvancedCombat(action: { type: string; details?: unknown }): string {
    const input = String(action.details).toLowerCase();
    
    if (!this.combatState.inCombat) {
      return this.initiateCombat(input);
    }
    
    return this.processCombatAction(input);
  }

  private initiateCombat(input: string): string {
    const enemies = [
      { name: 'Shadow Wolf', health: 60, maxHealth: 60, attacks: ['bite', 'howl', 'pounce'], weaknesses: ['light magic', 'silver'] },
      { name: 'Stone Golem', health: 120, maxHealth: 120, attacks: ['crush', 'rock throw', 'earthquake'], weaknesses: ['water', 'precision strikes'] },
      { name: 'Dark Mage', health: 80, maxHealth: 80, attacks: ['fireball', 'drain life', 'teleport'], weaknesses: ['silence', 'holy magic'] },
      { name: 'Giant Spider', health: 70, maxHealth: 70, attacks: ['poison bite', 'web trap', 'leap'], weaknesses: ['fire', 'loud noises'] },
    ];
    
    const enemy = enemies[Math.floor(Math.random() * enemies.length)];
    
    this.combatState = {
      inCombat: true,
      enemy: enemy,
      turnCount: 1,
    };
    
    return `⚔️ **COMBAT INITIATED!**

A ${enemy.name} appears! (${enemy.health}/${enemy.maxHealth} HP)

🎯 **Combat Options:**
• **attack [weapon]** - Use your equipped weapon
• **cast [spell]** - Use magic (if you have mana)
• **defend** - Reduce incoming damage
• **item [name]** - Use an item from inventory
• **flee** - Attempt to escape

💡 **Enemy Weaknesses:** ${enemy.weaknesses.join(', ')}

What's your move?`;
  }

  private processCombatAction(input: string): string {
    if (!this.combatState.enemy) return 'Combat error - no enemy found!';
    
    let playerAction = '';
    let playerDamage = 0;
    let enemyDamage = 0;
    
    // Player turn
    if (input.includes('attack')) {
      const weaponBonus = this.getWeaponDamage();
      const skillBonus = this.gameState.skills.get('combat') || 1;
      const roll = Math.floor(Math.random() * 20) + 1;
      
      playerDamage = Math.floor(Math.random() * 15) + 5 + weaponBonus + skillBonus;
      
      if (roll >= 15) {
        playerDamage *= 2;
        playerAction = `🎯 **CRITICAL HIT!** Your ${this.gameState.equipment.weapon} strikes true for ${playerDamage} damage!`;
      } else if (roll >= 10) {
        playerAction = `⚔️ You hit with your ${this.gameState.equipment.weapon} for ${playerDamage} damage!`;
      } else {
        playerDamage = 0;
        playerAction = '😓 Your attack misses!';
      }
      
    } else if (input.includes('cast')) {
      const magicSkill = this.gameState.skills.get('magic') || 0;
      if (magicSkill === 0) {
        playerAction = '🚫 You don\'t know any spells yet!';
      } else {
        playerDamage = Math.floor(Math.random() * 12) + magicSkill * 3;
        playerAction = `✨ You cast a spell for ${playerDamage} magical damage!`;
      }
      
    } else if (input.includes('defend')) {
      playerAction = '🛡️ You take a defensive stance, reducing incoming damage!';
      enemyDamage = Math.floor(enemyDamage * 0.5);
      
    } else if (input.includes('item')) {
      const healingItems = this.gameState.inventory.filter(item => item.includes('potion') || item.includes('elixir'));
      if (healingItems.length > 0) {
        const healAmount = Math.floor(Math.random() * 30) + 20;
        this.gameState.health = Math.min(this.gameState.maxHealth, this.gameState.health + healAmount);
        playerAction = `🧪 You drink a ${healingItems[0]} and recover ${healAmount} HP!`;
        
        // Remove item
        const index = this.gameState.inventory.indexOf(healingItems[0]);
        this.gameState.inventory.splice(index, 1);
      } else {
        playerAction = '🎒 No usable items available!';
      }
      
    } else if (input.includes('flee')) {
      const escapeRoll = Math.floor(Math.random() * 20) + 1;
      if (escapeRoll >= 12) {
        this.combatState = { inCombat: false, turnCount: 0 };
        return '🏃 You successfully escape from combat!';
      } else {
        playerAction = '🚫 You failed to escape!';
      }
    }
    
    // Apply player damage
    if (playerDamage > 0) {
      this.combatState.enemy.health -= playerDamage;
      
      // Check if enemy is defeated
      if (this.combatState.enemy.health <= 0) {
        const expGained = Math.floor(Math.random() * 50) + 25;
        this.gameState.experience += expGained;
        this.checkLevelUp();
        
        const loot = this.generateLoot();
        this.combatState = { inCombat: false, turnCount: 0 };
        
        return `🏆 **VICTORY!**

${playerAction}

The ${this.combatState.enemy?.name || 'enemy'} falls defeated!
💰 Experience gained: ${expGained}
${loot}

${this.checkLevelUp()}`;
      }
    }
    
    // Enemy turn (if still alive)
    if (this.combatState.enemy.health > 0) {
      const enemyAttack = this.combatState.enemy.attacks[Math.floor(Math.random() * this.combatState.enemy.attacks.length)];
      enemyDamage = Math.floor(Math.random() * 20) + 10;
      
      // Apply armor reduction
      const armorReduction = this.getArmorDefense();
      enemyDamage = Math.max(1, enemyDamage - armorReduction);
      
      this.gameState.health -= enemyDamage;
      
      let result = `${playerAction}

💥 The ${this.combatState.enemy.name} uses ${enemyAttack} for ${enemyDamage} damage!
❤️ Your HP: ${this.gameState.health}/${this.gameState.maxHealth}
👹 Enemy HP: ${this.combatState.enemy.health}/${this.combatState.enemy.maxHealth}`;
      
      // Check if player is defeated
      if (this.gameState.health <= 0) {
        this.combatState = { inCombat: false, turnCount: 0 };
        this.gameState.health = 1; // Don't actually kill the player
        result += '\n\n💀 **DEFEAT!** You collapse but manage to crawl away...';
      }
      
      this.combatState.turnCount++;
      return result + '\n\nWhat\'s your next move?';
    }
    
    return playerAction;
  }

  private getWeaponDamage(): number {
    const weaponBonuses: Record<string, number> = {
      'rusty sword': 1,
      'iron sword': 3,
      'enchanted sword': 5,
      'legendary blade': 8,
    };
    
    return weaponBonuses[this.gameState.equipment.weapon] || 0;
  }

  private getArmorDefense(): number {
    const armorDefense: Record<string, number> = {
      'leather vest': 1,
      'chain mail': 3,
      'plate armor': 5,
      'enchanted robes': 4,
    };
    
    return armorDefense[this.gameState.equipment.armor] || 0;
  }

  private checkLevelUp(): string {
    const expNeeded = this.gameState.level * 100;
    
    if (this.gameState.experience >= expNeeded) {
      this.gameState.level++;
      this.gameState.experience -= expNeeded;
      this.gameState.maxHealth += 10;
      this.gameState.health = this.gameState.maxHealth; // Full heal on level up
      
      // Improve a random skill
      const skills = Array.from(this.gameState.skills.keys());
      const skillToImprove = skills[Math.floor(Math.random() * skills.length)];
      this.gameState.skills.set(skillToImprove, this.gameState.skills.get(skillToImprove)! + 1);
      
      return `\n🌟 **LEVEL UP!** You are now level ${this.gameState.level}!
❤️ Max HP increased to ${this.gameState.maxHealth}
📈 ${skillToImprove} skill increased to ${this.gameState.skills.get(skillToImprove)}`;
    }
    
    return '';
  }

  // ===== ADDITIONAL FEATURES =====
  
  private showCharacterStatus(): string {
    const expNeeded = this.gameState.level * 100;
    const skillList = Array.from(this.gameState.skills.entries())
      .map(([skill, level]) => `${skill}: ${level}`)
      .join(', ');
    
    return `📊 **CHARACTER STATUS**

👤 **Level ${this.gameState.level} Adventurer**
❤️ **Health:** ${this.gameState.health}/${this.gameState.maxHealth}
⭐ **Experience:** ${this.gameState.experience}/${expNeeded}

🎒 **Equipment:**
• Weapon: ${this.gameState.equipment.weapon}
• Armor: ${this.gameState.equipment.armor}  
• Accessory: ${this.gameState.equipment.accessory}

🎯 **Skills:** ${skillList}

📍 **Current Location:** ${this.gameState.location}
📋 **Active Quests:** ${this.gameState.questLog.length}
🤝 **Known NPCs:** ${this.gameState.npcRelationships.size}`;
  }

  private handleEquipment(action: { type: string; details?: unknown }): string {
    const input = String(action.details).toLowerCase();
    
    // Find equipment in inventory
    const equipmentItems = this.gameState.inventory.filter(item => 
      item.includes('sword') || item.includes('armor') || item.includes('ring') || 
      item.includes('amulet') || item.includes('vest') || item.includes('mail')
    );
    
    if (equipmentItems.length === 0) {
      return '🎒 No equipment found in your inventory to equip.';
    }
    
    const itemToEquip = equipmentItems.find(item => input.includes(item.toLowerCase()));
    
    if (!itemToEquip) {
      return `🎒 Available equipment: ${equipmentItems.join(', ')}\n\nSay "equip [item name]" to equip it.`;
    }
    
    // Determine equipment type and equip
    let equipSlot = '';
    let oldItem = '';
    
    if (itemToEquip.includes('sword') || itemToEquip.includes('blade') || itemToEquip.includes('weapon')) {
      oldItem = this.gameState.equipment.weapon;
      this.gameState.equipment.weapon = itemToEquip;
      equipSlot = 'weapon';
    } else if (itemToEquip.includes('armor') || itemToEquip.includes('vest') || itemToEquip.includes('mail')) {
      oldItem = this.gameState.equipment.armor;
      this.gameState.equipment.armor = itemToEquip;
      equipSlot = 'armor';
    } else if (itemToEquip.includes('ring') || itemToEquip.includes('amulet') || itemToEquip.includes('accessory')) {
      oldItem = this.gameState.equipment.accessory;
      this.gameState.equipment.accessory = itemToEquip;
      equipSlot = 'accessory';
    }
    
    // Remove from inventory and add old item back
    const itemIndex = this.gameState.inventory.indexOf(itemToEquip);
    this.gameState.inventory.splice(itemIndex, 1);
    
    if (oldItem && oldItem !== 'none') {
      this.gameState.inventory.push(oldItem);
    }
    
    return `⚡ **EQUIPMENT UPDATED**

Equipped: ${itemToEquip} (${equipSlot})
${oldItem && oldItem !== 'none' ? `Previous ${equipSlot} (${oldItem}) returned to inventory` : ''}

${this.showCharacterStatus()}`;
  }

  generateLoot(): string {
    const loot = [
      'enchanted sword (+3 attack)',
      'healing potion (restore 50 HP)',
      'mysterious scroll of fireball',
      'bag of holding',
      'ring of protection (+2 defense)',
      'iron sword (+2 attack)',
      'chain mail (+3 defense)',
      'mana crystal',
      'ancient tome (+1 magic skill)',
      'lucky charm (+1 to all rolls)',
    ];
    const item = loot[Math.floor(Math.random() * loot.length)];
    this.gameState.inventory.push(item);
    return `🎁 You found: ${item}!`;
  }

  getGameSummary(): string {
    const skillList = Array.from(this.gameState.skills.entries())
      .map(([skill, level]) => `${skill}: ${level}`)
      .join(', ');

    return `
🎮 **ENHANCED ADVENTURE STATUS**
📍 Location: ${this.gameState.location}
👤 Level: ${this.gameState.level} (${this.gameState.experience} XP)
❤️ Health: ${this.gameState.health}/${this.gameState.maxHealth}

⚔️ Equipment:
• Weapon: ${this.gameState.equipment.weapon}
• Armor: ${this.gameState.equipment.armor}
• Accessory: ${this.gameState.equipment.accessory}

🎯 Skills: ${skillList}
🎒 Inventory: ${this.gameState.inventory.join(', ')}
📋 Active Quests: ${this.gameState.questLog.length}
🤝 NPC Relationships: ${this.gameState.npcRelationships.size}
🗺️ Known Locations: ${this.worldMap.size}
⚔️ Combat Status: ${this.combatState.inCombat ? 'IN COMBAT' : 'Peaceful'}

💡 **New Commands Available:**
• "generate location" - Create new areas
• "generate quest" - Create new adventures
• "generate npc" - Meet new characters
• "status" - View character details
• "equip [item]" - Manage equipment
• "attack/defend/cast/flee" - Advanced combat
    `;
  }
}