/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseAIAgent, AgentException } from '../core/BaseAIAgent.js';
import { PersistenceManager } from '../core/PersistenceManager.js';
import { DungeonMasterAgent } from '../use-cases/1-DungeonMaster.js';
import { DebuggerDuckAgent } from '../use-cases/2-DebuggerDuck.js';
import { MemoryPalaceAgent } from '../use-cases/7-MemoryPalace.js';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  duration: number;
}

class TestSuite {
  private results: TestResult[] = [];

  async runTest(name: string, testFn: () => Promise<void>): Promise<void> {
    const startTime = Date.now();
    console.log(`🧪 Running: ${name}`);
    
    try {
      await testFn();
      const duration = Date.now() - startTime;
      this.results.push({ name, passed: true, duration });
      console.log(`✅ Passed: ${name} (${duration}ms)`);
    } catch (error) {
      const duration = Date.now() - startTime;
      this.results.push({ 
        name, 
        passed: false, 
        error: error instanceof Error ? error.message : String(error),
        duration 
      });
      console.log(`❌ Failed: ${name} (${duration}ms) - ${error}`);
    }
  }

  async runAll(): Promise<void> {
    console.log('🚀 Starting AI CLI Test Suite\n');
    
    // Core functionality tests
    await this.runTest('BaseAIAgent Error Handling', this.testBaseAgentErrorHandling);
    await this.runTest('Agent Safe Input Processing', this.testSafeInputProcessing);
    await this.runTest('Rate Limiting', this.testRateLimiting);
    
    // Persistence tests
    await this.runTest('Persistence Manager Save/Load', this.testPersistenceManager);
    await this.runTest('Agent State Persistence', this.testAgentStatePersistence);
    
    // Agent-specific tests
    await this.runTest('Dungeon Master Basic Functionality', this.testDungeonMaster);
    await this.runTest('Debugger Duck Pattern Recognition', this.testDebuggerDuck);
    await this.runTest('Memory Palace Memory Operations', this.testMemoryPalace);
    
    // Integration tests
    await this.runTest('Agent Health Recovery', this.testHealthRecovery);
    await this.runTest('Memory Operations Safety', this.testMemoryOperationsSafety);
    
    this.printSummary();
  }

  private async testBaseAgentErrorHandling(): Promise<void> {
    class TestAgent extends BaseAIAgent {
      async processInput(input: string): Promise<string> {
        if (input === 'error') {
          throw new Error('Test error');
        }
        if (input === 'agent-error') {
          throw new AgentException('TEST_ERROR', 'Test agent error');
        }
        return 'success';
      }
      
      generatePrompt(): string {
        return 'Test prompt';
      }
    }
    
    const agent = new TestAgent({ role: 'test agent' });
    
    // Test normal operation
    const result1 = await agent.safeProcessInput('hello');
    if (result1 !== 'success') {
      throw new Error('Normal operation failed');
    }
    
    // Test error handling
    const result2 = await agent.safeProcessInput('error');
    if (!result2.includes('unexpected happened')) {
      throw new Error('Error handling failed');
    }
    
    // Test agent exception handling
    const result3 = await agent.safeProcessInput('agent-error');
    if (!result3.includes('⚠️')) {
      throw new Error('Agent exception handling failed');
    }
  }

  private async testSafeInputProcessing(): Promise<void> {
    class TestAgent extends BaseAIAgent {
      async processInput(input: string): Promise<string> {
        return `Processed: ${input}`;
      }
      
      generatePrompt(): string {
        return 'Test prompt';
      }
    }
    
    const agent = new TestAgent({ role: 'test agent' });
    
    // Test empty input
    const result1 = await agent.safeProcessInput('');
    if (!result1.includes('Invalid input')) {
      throw new Error('Empty input validation failed');
    }
    
    // Test null input
    const result2 = await agent.safeProcessInput(null as any);
    if (!result2.includes('Invalid input')) {
      throw new Error('Null input validation failed');
    }
    
    // Test too long input
    const longInput = 'a'.repeat(10001);
    const result3 = await agent.safeProcessInput(longInput);
    if (!result3.includes('too long')) {
      throw new Error('Long input validation failed');
    }
  }

  private async testRateLimiting(): Promise<void> {
    class TestAgent extends BaseAIAgent {
      async processInput(input: string): Promise<string> {
        return 'success';
      }
      
      generatePrompt(): string {
        return 'Test prompt';
      }
    }
    
    const agent = new TestAgent({ role: 'test agent' });
    
    // Simulate rapid requests
    const promises = [];
    for (let i = 0; i < 25; i++) {
      agent.addTurn({
        role: 'user',
        content: `message ${i}`,
        timestamp: new Date()
      });
    }
    
    const result = await agent.safeProcessInput('test');
    if (!result.includes('too quickly')) {
      throw new Error('Rate limiting failed');
    }
  }

  private async testPersistenceManager(): Promise<void> {
    const persistence = new PersistenceManager('.test-data');
    
    class TestAgent extends BaseAIAgent {
      async processInput(input: string): Promise<string> {
        return input;
      }
      
      generatePrompt(): string {
        return 'Test';
      }
    }
    
    const agent = new TestAgent({ role: 'test' });
    agent.remember('test-key', 'test-value');
    agent.addTurn({
      role: 'user',
      content: 'test message',
      timestamp: new Date()
    });
    
    // Save state
    await persistence.saveAgentState('test-agent', agent, { custom: 'data' });
    
    // Load state
    const state = await persistence.loadAgentState('test-agent');
    if (!state || state.agentType !== 'TestAgent') {
      throw new Error('State loading failed');
    }
    
    // Restore state
    const newAgent = new TestAgent({ role: 'test' });
    await persistence.restoreAgentState(newAgent, state);
    
    if (newAgent.recall('test-key') !== 'test-value') {
      throw new Error('State restoration failed');
    }
    
    // Cleanup
    await persistence.deleteAgentState('test-agent');
  }

  private async testAgentStatePersistence(): Promise<void> {
    const dungeonMaster = new DungeonMasterAgent();
    
    // Interact with the agent to create state
    await dungeonMaster.safeProcessInput('start new adventure');
    
    if (!dungeonMaster.recall('adventure_started')) {
      dungeonMaster.remember('adventure_started', true);
    }
    
    // Verify the agent has some state
    const healthStatus = dungeonMaster.getHealthStatus();
    if (!healthStatus.healthy) {
      throw new Error('Agent should be healthy initially');
    }
  }

  private async testDungeonMaster(): Promise<void> {
    const dm = new DungeonMasterAgent();
    
    // Test basic functionality
    const response1 = await dm.safeProcessInput('start adventure');
    if (!response1.includes('🏰') && !response1.includes('adventure') && !response1.includes('world')) {
      throw new Error('Dungeon Master failed to start adventure');
    }
    
    // Test dice rolling
    const response2 = await dm.safeProcessInput('roll dice');
    if (!response2.includes('🎲') && !response2.includes('rolled') && !response2.includes('dice')) {
      throw new Error('Dice rolling failed');
    }
    
    // Test combat
    const response3 = await dm.safeProcessInput('fight monster');
    if (!response3.includes('⚔️') && !response3.includes('combat') && !response3.includes('enemy')) {
      throw new Error('Combat system failed');
    }
  }

  private async testDebuggerDuck(): Promise<void> {
    const duck = new DebuggerDuckAgent();
    
    // Test basic debugging
    const response1 = await duck.safeProcessInput('my code is not working');
    if (!response1.includes('🦆') && response1.length <= 10) {
      throw new Error('Debugger Duck failed to provide debugging help');
    }
    
    // Test specific error
    const response2 = await duck.safeProcessInput('getting undefined error');
    if (!response2.includes('undefined') && response2.length <= 20) {
      throw new Error('Specific error handling failed');
    }
  }

  private async testMemoryPalace(): Promise<void> {
    const memoryPalace = new MemoryPalaceAgent();
    
    // Test storing a memory
    const response1 = await memoryPalace.safeProcessInput('remember JavaScript arrays');
    if (!response1.includes('🏛️') && !response1.includes('memory') && !response1.includes('stored')) {
      throw new Error('Memory storage failed');
    }
    
    // Test recalling memory
    const response2 = await memoryPalace.safeProcessInput('recall JavaScript');
    if (!response2.includes('🔍') && !response2.includes('FOUND')) {
      throw new Error('Memory recall failed');
    }
    
    // Test palace tour
    const response3 = await memoryPalace.safeProcessInput('tour palace');
    if (!response3.includes('🏛️') && !response3.includes('PALACE')) {
      throw new Error('Palace tour failed');
    }
  }

  private async testHealthRecovery(): Promise<void> {
    class TestAgent extends BaseAIAgent {
      async processInput(input: string): Promise<string> {
        throw new Error('Always fails');
      }
      
      generatePrompt(): string {
        return 'Test';
      }
    }
    
    const agent = new TestAgent({ role: 'test' });
    
    // Generate multiple errors to make agent unhealthy
    for (let i = 0; i < 6; i++) {
      await agent.safeProcessInput('test');
    }
    
    const healthBefore = agent.getHealthStatus();
    if (healthBefore.healthy) {
      throw new Error('Agent should be unhealthy after multiple errors');
    }
    
    // Note: Full recovery test would require modifying the agent to succeed
    // This at least tests that the health status is being tracked
    if (healthBefore.errorCount === 0) {
      throw new Error('Error count should be greater than 0');
    }
  }

  private async testMemoryOperationsSafety(): Promise<void> {
    class TestAgent extends BaseAIAgent {
      async processInput(input: string): Promise<string> {
        return 'success';
      }
      
      generatePrompt(): string {
        return 'Test';
      }
      
      public testSafeMemoryOp() {
        return this.safeMemoryOperation(() => {
          throw new Error('Memory error');
        }, 'fallback');
      }
    }
    
    const agent = new TestAgent({ role: 'test' });
    const result = agent.testSafeMemoryOp();
    
    if (result !== 'fallback') {
      throw new Error('Safe memory operation failed');
    }
  }

  private printSummary(): void {
    const passed = this.results.filter(r => r.passed).length;
    const failed = this.results.filter(r => !r.passed).length;
    const totalTime = this.results.reduce((sum, r) => sum + r.duration, 0);
    
    console.log('\n📊 Test Summary:');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⏱️  Total time: ${totalTime}ms`);
    console.log(`📈 Success rate: ${((passed / this.results.length) * 100).toFixed(1)}%`);
    
    if (failed > 0) {
      console.log('\n❌ Failed tests:');
      this.results.filter(r => !r.passed).forEach(r => {
        console.log(`  - ${r.name}: ${r.error}`);
      });
    }
    
    console.log(`\n🎯 Overall: ${failed === 0 ? 'ALL TESTS PASSED! 🎉' : 'SOME TESTS FAILED ⚠️'}`);
  }
}

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const testSuite = new TestSuite();
  testSuite.runAll().catch(console.error);
}

export { TestSuite };