/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseAIAgent } from '../core/BaseAIAgent.js';

interface Room {
  name: string;
  items: Map<string, MemoryItem>;
  connections: string[];
  theme?: string;
  visitCount: number;
}

interface MemoryItem {
  content: string;
  image: string;
  associations: string[];
  strength: number;
  created: Date;
  lastRecalled?: Date;
}

interface MemoryPath {
  rooms: string[];
  narrative: string;
}

export class MemoryPalaceAgent extends BaseAIAgent {
  private palace: Map<string, Room> = new Map();
  private currentRoom: string = 'entrance';
  private memoryPaths: Map<string, MemoryPath> = new Map();
  private associationNetwork: Map<string, Set<string>> = new Map();
  private memoryStrengthDecay = 0.95;

  constructor() {
    super(
      {
        role: 'a Memory Palace architect helping you build and navigate mnemonic spaces',
        personality: 'Patient guide with a flair for vivid imagery. Speaks in rich, memorable descriptions.',
        constraints: ['Create memorable associations', 'Use vivid imagery', 'Maintain spatial consistency'],
        knowledge: ['Method of loci', 'Mnemonic techniques', 'Spatial memory', 'Association principles'],
        goals: ['Build lasting memories', 'Create navigable mental spaces', 'Link information meaningfully'],
      },
      { canRemember: true }
    );

    this.initializePalace();
  }

  private initializePalace(): void {
    this.palace.set('entrance', {
      name: 'Grand Entrance Hall',
      items: new Map(),
      connections: ['library', 'garden', 'tower'],
      theme: 'classical',
      visitCount: 0
    });
    
    this.palace.set('library', {
      name: 'Ancient Library',
      items: new Map(),
      connections: ['entrance'],
      theme: 'knowledge',
      visitCount: 0
    });
    
    this.palace.set('garden', {
      name: 'Zen Garden',
      items: new Map(),
      connections: ['entrance'],
      theme: 'nature',
      visitCount: 0
    });
  }

  async processInput(input: string): Promise<string> {
    const lower = input.toLowerCase();
    
    if (lower.includes('remember') || lower.includes('store')) {
      return this.storeMemory(input);
    } else if (lower.includes('recall') || lower.includes('find')) {
      return this.recallMemory(input);
    } else if (lower.includes('tour') || lower.includes('explore')) {
      return this.tourPalace();
    } else if (lower.includes('path') || lower.includes('journey')) {
      return this.createMemoryPath(input);
    } else if (lower.includes('associate') || lower.includes('link')) {
      return this.createAssociation(input);
    } else if (lower.includes('strength') || lower.includes('reinforce')) {
      return this.reinforceMemories();
    } else if (lower.includes('navigate') || lower.includes('go to')) {
      return this.navigateToRoom(input);
    } else if (lower.includes('map')) {
      return this.showPalaceMap();
    }
    
    return this.buildRoom(input);
  }

  private storeMemory(input: string): string {
    const content = input.replace(/remember|store/gi, '').trim();
    const room = this.palace.get(this.currentRoom)!;
    const key = `memory_${Date.now()}`;
    
    const vividImage = this.createVividImage(content);
    const associations = this.generateAssociations(content);
    
    const memory: MemoryItem = {
      content,
      image: vividImage,
      associations,
      strength: 1.0,
      created: new Date(),
    };
    
    room.items.set(key, memory);
    room.visitCount++;
    
    associations.forEach(assoc => {
      if (!this.associationNetwork.has(content)) {
        this.associationNetwork.set(content, new Set());
      }
      this.associationNetwork.get(content)!.add(assoc);
    });
    
    return `🏛️ MEMORY ANCHORED IN ${room.name.toUpperCase()}:

📝 Content: "${content}"
🎨 Vivid Image: ${vividImage}
🔗 Associations: ${associations.join(', ')}
💪 Initial Strength: 100%
📍 Location: ${this.currentRoom} - ${this.describePosition(room.items.size)}

Your memory is now woven into the fabric of your palace. The more you recall it, the stronger it becomes.`;
  }

  private createVividImage(item: string): string {
    const images = [
      `a golden ${item} floating above a crystal pedestal`,
      `${item} written in fire on the ancient walls`,
      `a talking statue reciting "${item}" endlessly`,
      `${item} transformed into a magnificent tapestry`,
    ];
    return images[Math.floor(Math.random() * images.length)];
  }

  private describePosition(index: number): string {
    const positions = ['by the north window', 'near the ornate fireplace', 'under the chandelier', 'beside the marble column'];
    return positions[index % positions.length];
  }

  private generateAssociations(content: string): string[] {
    const words = content.split(' ').filter(w => w.length > 3);
    const associations: string[] = [];
    
    words.forEach(word => {
      const similar = this.findSimilarMemories(word);
      if (similar) associations.push(similar);
    });
    
    if (associations.length < 2) {
      associations.push(...['wisdom', 'knowledge', 'insight'].slice(0, 2 - associations.length));
    }
    
    return associations;
  }
  
  private findSimilarMemories(keyword: string): string | null {
    for (const [room, roomData] of this.palace.entries()) {
      for (const [key, memory] of roomData.items) {
        if (memory.content.toLowerCase().includes(keyword.toLowerCase())) {
          return memory.content.split(' ')[0];
        }
      }
    }
    return null;
  }

  private recallMemory(input: string): string {
    const searchTerm = input.replace(/recall|find/gi, '').trim().toLowerCase();
    let found: Array<{room: string, memory: MemoryItem}> = [];
    
    this.palace.forEach((room, roomName) => {
      room.items.forEach((memory) => {
        if (memory.content.toLowerCase().includes(searchTerm) ||
            memory.associations.some(a => a.toLowerCase().includes(searchTerm))) {
          found.push({room: room.name, memory});
          memory.lastRecalled = new Date();
          memory.strength = Math.min(1.0, memory.strength + 0.1);
        }
      });
    });
    
    if (found.length === 0) {
      return '🤔 No matching memories. Try exploring your palace or storing new ones.';
    }
    
    return `🔍 MEMORIES RECALLED:

${found.map(f => `📍 ${f.room}:
  📝 "${f.memory.content}"
  🎨 ${f.memory.image}
  💪 Strength: ${Math.round(f.memory.strength * 100)}%
  🔗 Links: ${f.memory.associations.join(', ')}`).join('\n\n')}

These memories have been reinforced by recall.`;
  }

  private tourPalace(): string {
    const totalMemories = Array.from(this.palace.values()).reduce((sum, room) => sum + room.items.size, 0);
    const strongestMemories = this.getStrongestMemories(3);
    
    return `🏛️ YOUR MEMORY PALACE:

${Array.from(this.palace.entries()).map(([key, room]) => {
  const avgStrength = room.items.size > 0 
    ? Array.from(room.items.values()).reduce((sum, m) => sum + m.strength, 0) / room.items.size 
    : 0;
  return `📍 ${room.name} (${room.theme || 'general'}):
    💾 Memories: ${room.items.size}
    💪 Avg Strength: ${Math.round(avgStrength * 100)}%
    👣 Visits: ${room.visitCount}
    🚪 Connected to: ${room.connections.join(', ')}`;
}).join('\n\n')}

📊 PALACE STATISTICS:
Total Memories: ${totalMemories}
Current Location: ${this.currentRoom}
Memory Paths Created: ${this.memoryPaths.size}

💎 STRONGEST MEMORIES:
${strongestMemories.map(m => `  • "${m.content}" (${Math.round(m.strength * 100)}%)`).join('\n')}`;
  }
  
  private getStrongestMemories(count: number): MemoryItem[] {
    const allMemories: MemoryItem[] = [];
    this.palace.forEach(room => {
      room.items.forEach(memory => allMemories.push(memory));
    });
    return allMemories.sort((a, b) => b.strength - a.strength).slice(0, count);
  }

  private buildRoom(input: string): string {
    const roomName = `room_${this.palace.size}`;
    const description = this.generateRoomDescription();
    const theme = this.extractTheme(input);
    
    this.palace.set(roomName, {
      name: description,
      items: new Map(),
      connections: [this.currentRoom],
      theme,
      visitCount: 0
    });
    
    const currentRoomData = this.palace.get(this.currentRoom)!;
    currentRoomData.connections.push(roomName);
    
    return `🏗️ NEW ROOM MANIFESTED: ${description}

🎨 Theme: ${theme}
🚪 Connected to: ${this.currentRoom}
✨ Special Properties: This room resonates with memories related to ${theme}

The architecture of your mind expands. What memories shall we anchor here?`;
  }
  
  private extractTheme(input: string): string {
    const themes = ['knowledge', 'emotions', 'skills', 'experiences', 'dreams', 'goals'];
    const words = input.toLowerCase().split(' ');
    for (const theme of themes) {
      if (words.some(w => w.includes(theme.substring(0, 4)))) {
        return theme;
      }
    }
    return themes[Math.floor(Math.random() * themes.length)];
  }

  private generateRoomDescription(): string {
    const rooms = ['Celestial Observatory', 'Underwater Grotto', 'Crystal Cave', 'Floating Garden', 'Mirror Maze', 'Cloud Library', 'Time Vault', 'Echo Chamber'];
    return rooms[Math.floor(Math.random() * rooms.length)];
  }
  
  private createMemoryPath(input: string): string {
    const pathName = `path_${this.memoryPaths.size}`;
    const rooms = this.selectPathRooms();
    const narrative = this.generatePathNarrative(rooms);
    
    this.memoryPaths.set(pathName, { rooms, narrative });
    
    return `🛤️ MEMORY PATH CREATED:

Journey: ${rooms.join(' → ')}

📖 Narrative Technique:
${narrative}

Walking this path will help you recall all memories in sequence. Each room triggers the next, creating an unbreakable chain of recall.`;
  }
  
  private selectPathRooms(): string[] {
    const allRooms = Array.from(this.palace.keys());
    const pathLength = Math.min(4, allRooms.length);
    const selected: string[] = [];
    
    for (let i = 0; i < pathLength; i++) {
      const room = allRooms[Math.floor(Math.random() * allRooms.length)];
      if (!selected.includes(room)) {
        selected.push(room);
      }
    }
    
    return selected;
  }
  
  private generatePathNarrative(rooms: string[]): string {
    const narratives = [
      'Follow the golden thread that connects each space',
      'Watch as memories flow like water from room to room',
      'Each doorway reveals a deeper layer of understanding',
      'The journey itself becomes the memory'
    ];
    return narratives[Math.floor(Math.random() * narratives.length)];
  }
  
  private createAssociation(input: string): string {
    const words = input.replace(/associate|link/gi, '').trim().split(' and ');
    if (words.length < 2) {
      return 'Please provide two items to associate, e.g., "associate apple and wisdom"';
    }
    
    const [item1, item2] = words.map(w => w.trim());
    
    if (!this.associationNetwork.has(item1)) {
      this.associationNetwork.set(item1, new Set());
    }
    if (!this.associationNetwork.has(item2)) {
      this.associationNetwork.set(item2, new Set());
    }
    
    this.associationNetwork.get(item1)!.add(item2);
    this.associationNetwork.get(item2)!.add(item1);
    
    const bridge = this.createAssociationBridge(item1, item2);
    
    return `🔗 ASSOCIATION CREATED:

${item1} ↔️ ${item2}

🌉 Mental Bridge:
${bridge}

This connection strengthens recall of both memories. When you think of one, the other will naturally follow.`;
  }
  
  private createAssociationBridge(item1: string, item2: string): string {
    const bridges = [
      `Imagine ${item1} transforming into ${item2} through a magical portal`,
      `${item1} and ${item2} dance together in an eternal waltz`,
      `A golden chain links ${item1} to ${item2} across space and time`,
      `${item1} whispers the secret of ${item2} to those who listen`
    ];
    return bridges[Math.floor(Math.random() * bridges.length)];
  }
  
  private reinforceMemories(): string {
    let reinforced = 0;
    let decayed = 0;
    
    this.palace.forEach(room => {
      room.items.forEach(memory => {
        const daysSinceRecall = memory.lastRecalled 
          ? (Date.now() - memory.lastRecalled.getTime()) / (1000 * 60 * 60 * 24)
          : (Date.now() - memory.created.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysSinceRecall < 1) {
          memory.strength = Math.min(1.0, memory.strength + 0.05);
          reinforced++;
        } else {
          memory.strength *= Math.pow(this.memoryStrengthDecay, daysSinceRecall);
          if (memory.strength < 0.3) decayed++;
        }
      });
    });
    
    return `💪 MEMORY REINFORCEMENT COMPLETE:

✨ Reinforced: ${reinforced} recent memories
📉 Decaying: ${decayed} memories need attention
💡 Tip: Regular recall prevents memory decay

Weak memories can be strengthened through:
• Active recall practice
• Creating new associations
• Walking memory paths
• Vivid re-imagination`;
  }
  
  private navigateToRoom(input: string): string {
    const targetRoom = input.replace(/navigate|go to/gi, '').trim().toLowerCase();
    
    for (const [key, room] of this.palace.entries()) {
      if (room.name.toLowerCase().includes(targetRoom) || key.includes(targetRoom)) {
        const currentRoomData = this.palace.get(this.currentRoom)!;
        
        if (!currentRoomData.connections.includes(key) && key !== this.currentRoom) {
          return `🚫 No direct path to ${room.name}. You're in ${currentRoomData.name}. 
Connected rooms: ${currentRoomData.connections.map(c => this.palace.get(c)!.name).join(', ')}`;
        }
        
        this.currentRoom = key;
        room.visitCount++;
        
        const memories = Array.from(room.items.values());
        const preview = memories.slice(0, 2).map(m => `• "${m.content}"`).join('\n');
        
        return `🚶 NAVIGATED TO ${room.name.toUpperCase()}:

🎨 Theme: ${room.theme || 'general'}
💾 Memories here: ${room.items.size}
🚪 Exits: ${room.connections.map(c => this.palace.get(c)!.name).join(', ')}

${memories.length > 0 ? `\n📜 Recent memories:\n${preview}` : '\n✨ This room awaits your memories...'}`;
      }
    }
    
    return `❓ Room not found. Available rooms: ${Array.from(this.palace.values()).map(r => r.name).join(', ')}`;
  }
  
  private showPalaceMap(): string {
    const map: string[] = ['🗺️ PALACE MAP:'];
    const visited = new Set<string>();
    
    const traverse = (roomKey: string, indent: number = 0) => {
      if (visited.has(roomKey)) return;
      visited.add(roomKey);
      
      const room = this.palace.get(roomKey)!;
      const prefix = '  '.repeat(indent);
      const marker = roomKey === this.currentRoom ? '📍' : '🚪';
      
      map.push(`${prefix}${marker} ${room.name} [${room.items.size} memories]`);
      
      room.connections.forEach(conn => {
        if (!visited.has(conn)) {
          traverse(conn, indent + 1);
        }
      });
    };
    
    traverse('entrance');
    
    map.push('\n🔗 ASSOCIATION NETWORK:');
    let assocCount = 0;
    this.associationNetwork.forEach((connections, item) => {
      if (connections.size > 0 && assocCount < 5) {
        map.push(`  ${item} ↔️ ${Array.from(connections).join(', ')}`);
        assocCount++;
      }
    });
    
    return map.join('\n');
  }

  generatePrompt(): string {
    return this.getSystemPrompt();
  }
}