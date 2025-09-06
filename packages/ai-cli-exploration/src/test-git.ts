/**
 * Test the enhanced Git Time Travel agent with real Git integration
 */

import { GitTimeTravelAgent } from './use-cases/8-GitTimeTravel.js';

async function testGitAgent() {
  console.log('🕐 Testing Enhanced Git Time Travel Agent...\n');
  
  const gitAgent = new GitTimeTravelAgent();
  
  const tests = [
    'status',
    'show me history',
    'blame package.json',
    'lost work'
  ];
  
  for (const test of tests) {
    try {
      console.log(`🔍 Test: "${test}"`);
      const response = await gitAgent.safeProcessInput(test);
      console.log(`✅ Response: ${response.substring(0, 200)}...\n`);
    } catch (error) {
      console.log(`❌ Error: ${error}\n`);
    }
  }
}

testGitAgent().catch(console.error);