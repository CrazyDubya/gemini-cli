/**
 * Simple test to verify the enhanced AI CLI system works
 */

import { DungeonMasterAgent } from './use-cases/1-DungeonMaster.js';
import { DebuggerDuckAgent } from './use-cases/2-DebuggerDuck.js';
import { MemoryPalaceAgent } from './use-cases/7-MemoryPalace.js';

console.log('🧪 Running Simple System Test...\n');

async function testAgent(agent: any, name: string, testInput: string): Promise<boolean> {
  try {
    console.log(`Testing ${name}...`);
    const response = await agent.safeProcessInput(testInput);
    console.log(`✅ ${name}: ${response.substring(0, 100)}...`);
    return true;
  } catch (error) {
    console.log(`❌ ${name}: ${error}`);
    return false;
  }
}

async function runTests() {
  const results = [];
  
  // Test Dungeon Master
  const dm = new DungeonMasterAgent();
  results.push(await testAgent(dm, 'Dungeon Master', 'start adventure'));
  
  // Test Debugger Duck  
  const duck = new DebuggerDuckAgent();
  results.push(await testAgent(duck, 'Debugger Duck', 'my code has a bug'));
  
  // Test Memory Palace
  const palace = new MemoryPalaceAgent();
  results.push(await testAgent(palace, 'Memory Palace', 'remember JavaScript arrays'));
  
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  console.log(`\n📊 Results: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All core functionality is working!');
  } else {
    console.log('⚠️  Some issues detected');
  }
}

runTests().catch(console.error);