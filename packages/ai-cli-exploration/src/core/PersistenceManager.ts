/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { promises as fs } from 'fs';
import { join } from 'path';
import { BaseAIAgent } from './BaseAIAgent.js';
import type { ConversationTurn } from './BaseAIAgent.js';

export interface PersistentState {
  agentType: string;
  memory: Record<string, unknown>;
  history: ConversationTurn[];
  customData?: Record<string, unknown>;
  lastSaved: Date;
  version: string;
}

export class PersistenceManager {
  private dataDir: string;
  private readonly version = '1.0.0';

  constructor(baseDir: string = '.ai-cli-data') {
    this.dataDir = join(process.cwd(), baseDir);
  }

  async ensureDataDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
    } catch (error) {
      console.warn(`Warning: Could not create data directory: ${error}`);
    }
  }

  async saveAgentState(agentId: string, agent: BaseAIAgent, customData?: Record<string, unknown>): Promise<void> {
    try {
      await this.ensureDataDirectory();
      
      const state: PersistentState = {
        agentType: agent.constructor.name,
        memory: this.serializeMap((agent as any).memory || new Map()),
        history: (agent as any).history || [],
        customData: customData || {},
        lastSaved: new Date(),
        version: this.version
      };

      const filePath = join(this.dataDir, `${agentId}.json`);
      await fs.writeFile(filePath, JSON.stringify(state, null, 2), 'utf-8');
    } catch (error) {
      throw new Error(`Failed to save agent state: ${error}`);
    }
  }

  async loadAgentState(agentId: string): Promise<PersistentState | null> {
    try {
      const filePath = join(this.dataDir, `${agentId}.json`);
      const data = await fs.readFile(filePath, 'utf-8');
      const state: PersistentState = JSON.parse(data);
      
      // Version compatibility check
      if (state.version !== this.version) {
        console.warn(`Warning: State version mismatch for ${agentId}. Expected ${this.version}, got ${state.version}`);
      }
      
      return state;
    } catch (error) {
      if ((error as any).code === 'ENOENT') {
        return null; // File doesn't exist
      }
      throw new Error(`Failed to load agent state: ${error}`);
    }
  }

  async restoreAgentState(agent: BaseAIAgent, state: PersistentState): Promise<void> {
    try {
      // Restore memory
      const memory = this.deserializeMap(state.memory);
      (agent as any).memory = memory;
      
      // Restore history with date conversion
      const history = state.history.map(turn => ({
        ...turn,
        timestamp: new Date(turn.timestamp)
      }));
      (agent as any).history = history;
      
    } catch (error) {
      throw new Error(`Failed to restore agent state: ${error}`);
    }
  }

  async deleteAgentState(agentId: string): Promise<void> {
    try {
      const filePath = join(this.dataDir, `${agentId}.json`);
      await fs.unlink(filePath);
    } catch (error) {
      if ((error as any).code !== 'ENOENT') {
        throw new Error(`Failed to delete agent state: ${error}`);
      }
    }
  }

  async listSavedStates(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.dataDir);
      return files
        .filter(file => file.endsWith('.json'))
        .map(file => file.replace('.json', ''));
    } catch (error) {
      return []; // Directory doesn't exist or is empty
    }
  }

  async getStateInfo(agentId: string): Promise<{ lastSaved: Date; agentType: string } | null> {
    try {
      const state = await this.loadAgentState(agentId);
      if (!state) return null;
      
      return {
        lastSaved: new Date(state.lastSaved),
        agentType: state.agentType
      };
    } catch (error) {
      return null;
    }
  }

  async exportAllStates(): Promise<Record<string, PersistentState>> {
    const savedStates = await this.listSavedStates();
    const allStates: Record<string, PersistentState> = {};
    
    for (const agentId of savedStates) {
      const state = await this.loadAgentState(agentId);
      if (state) {
        allStates[agentId] = state;
      }
    }
    
    return allStates;
  }

  async importStates(states: Record<string, PersistentState>): Promise<void> {
    for (const [agentId, state] of Object.entries(states)) {
      await this.saveAgentState(agentId, { constructor: { name: state.agentType } } as any, state.customData);
    }
  }

  async cleanup(maxAge: number = 30 * 24 * 60 * 60 * 1000): Promise<number> {
    const savedStates = await this.listSavedStates();
    let cleanedCount = 0;
    
    for (const agentId of savedStates) {
      const info = await this.getStateInfo(agentId);
      if (info && Date.now() - info.lastSaved.getTime() > maxAge) {
        await this.deleteAgentState(agentId);
        cleanedCount++;
      }
    }
    
    return cleanedCount;
  }

  private serializeMap(map: Map<string, unknown>): Record<string, unknown> {
    const obj: Record<string, unknown> = {};
    for (const [key, value] of map.entries()) {
      obj[key] = value;
    }
    return obj;
  }

  private deserializeMap(obj: Record<string, unknown>): Map<string, unknown> {
    const map = new Map<string, unknown>();
    for (const [key, value] of Object.entries(obj)) {
      map.set(key, value);
    }
    return map;
  }

  getDataDirectory(): string {
    return this.dataDir;
  }
}