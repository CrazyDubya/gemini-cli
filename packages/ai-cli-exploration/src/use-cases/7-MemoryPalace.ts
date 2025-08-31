/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseAIAgent } from '../core/BaseAIAgent.js';

interface Room {
  name: string;
  items: Map<string, string>;
  connections: string[];
}

export class MemoryPalaceAgent extends BaseAIAgent {
  private palace: Map<string, Room> = new Map();
  private currentRoom: string = 'entrance';

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
    }
    
    return this.buildRoom(input);
  }

  private storeMemory(input: string): string {
    const item = input.replace(/remember|store/gi, '').trim();
    const room = this.palace.get(this.currentRoom)!;
    const key = `item_${room.items.size}`;
    
    const vividImage = this.createVividImage(item);
    room.items.set(key, vividImage);
    
    return `🏛️ MEMORY STORED IN ${room.name.toUpperCase()}:

I've placed "${item}" in your palace as:
${vividImage}

Location: ${this.currentRoom} - ${this.describePosition(room.items.size)}

To recall, simply walk through this room in your mind and you'll see ${vividImage.split('.')[0]}.`;
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

  private recallMemory(input: string): string {
    const searchTerm = input.replace(/recall|find/gi, '').trim().toLowerCase();
    let found: string[] = [];
    
    this.palace.forEach((room, roomName) => {
      room.items.forEach((item) => {
        if (item.toLowerCase().includes(searchTerm)) {
          found.push(`In ${room.name}: ${item}`);
        }
      });
    });
    
    return found.length > 0 
      ? `🔍 MEMORIES FOUND:\n\n${found.join('\n')}`
      : '🤔 No matching memories. Try exploring your palace or storing new ones.';
  }

  private tourPalace(): string {
    const rooms = Array.from(this.palace.keys());
    return `🏛️ YOUR MEMORY PALACE:

${rooms.map(r => {
  const room = this.palace.get(r)!;
  return `📍 ${room.name}: ${room.items.size} memories stored`;
}).join('\n')}

Current location: ${this.currentRoom}

Your palace grows with each memory stored.`;
  }

  private buildRoom(input: string): string {
    const roomName = `room_${this.palace.size}`;
    const description = this.generateRoomDescription();
    
    this.palace.set(roomName, {
      name: description,
      items: new Map(),
      connections: [this.currentRoom],
    });
    
    return `🏗️ NEW ROOM CREATED: ${description}

This space is ready to hold your memories. What would you like to remember here?`;
  }

  private generateRoomDescription(): string {
    const rooms = ['Celestial Observatory', 'Underwater Grotto', 'Crystal Cave', 'Floating Garden', 'Mirror Maze'];
    return rooms[Math.floor(Math.random() * rooms.length)];
  }

  generatePrompt(): string {
    return this.getSystemPrompt();
  }
}