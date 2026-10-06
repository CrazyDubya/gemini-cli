#!/usr/bin/env node

import { DungeonMasterAgent } from './src/use-cases/1-DungeonMaster.js';
import { DebuggerDuckAgent } from './src/use-cases/2-DebuggerDuck.js';
import { TimeParadoxResolverAgent } from './src/use-cases/3-TimeParadoxResolver.js';
import { DreamInterpreterAgent } from './src/use-cases/4-DreamInterpreter.js';
import { QuantumDecisionAgent } from './src/use-cases/5-QuantumDecision.js';
import { CulinaryAlchemistAgent } from './src/use-cases/6-CulinaryAlchemist.js';
import { MemoryPalaceAgent } from './src/use-cases/7-MemoryPalace.js';
import { GitTimeTravelAgent } from './src/use-cases/8-GitTimeTravel.js';
import { ImposterSyndromeCoachAgent } from './src/use-cases/9-ImposterSyndrome.js';
import { CodePoetAgent } from './src/use-cases/10-CodePoet.js';
import { LegacyCodeMediumAgent } from './src/use-cases/11-LegacyCodeMedium.js';
import { ZenMasterAgent } from './src/use-cases/12-ZenMaster.js';

async function testDungeonMaster() {
  console.log('\n=== 1. Dungeon Master Test ===');
  const dm = new DungeonMasterAgent();
  
  let response = await dm.processInput('I look around the tavern');
  console.log('1. Player: I look around the tavern');
  console.log('   DM:', response.substring(0, 200) + '...');
  
  response = await dm.processInput('I approach the bartender');
  console.log('2. Player: I approach the bartender');
  console.log('   DM:', response.substring(0, 200) + '...');
  
  response = await dm.processInput('I ask about rumors');
  console.log('3. Player: I ask about rumors');
  console.log('   DM:', response.substring(0, 200) + '...');
  
  response = await dm.processInput('I order a drink');
  console.log('4. Player: I order a drink');
  console.log('   DM:', response.substring(0, 200) + '...');
  
  response = await dm.processInput('I listen to the other patrons');
  console.log('5. Player: I listen to the other patrons');
  console.log('   DM:', response.substring(0, 200) + '...');
}

async function testDebuggerDuck() {
  console.log('\n=== 2. Debugger Duck Test ===');
  const duck = new DebuggerDuckAgent();
  
  let response = await duck.processInput('My loop is running infinitely');
  console.log('1. Dev: My loop is running infinitely');
  console.log('   Duck:', response.substring(0, 200) + '...');
  
  response = await duck.processInput('I have a counter variable');
  console.log('2. Dev: I have a counter variable');
  console.log('   Duck:', response.substring(0, 200) + '...');
  
  response = await duck.processInput('How do I increment it?');
  console.log('3. Dev: How do I increment it?');
  console.log('   Duck:', response.substring(0, 200) + '...');
  
  response = await duck.processInput('What about the condition?');
  console.log('4. Dev: What about the condition?');
  console.log('   Duck:', response.substring(0, 200) + '...');
  
  response = await duck.processInput('I see the issue now');
  console.log('5. Dev: I see the issue now');
  console.log('   Duck:', response.substring(0, 200) + '...');
}

async function testTimeParadox() {
  console.log('\n=== 3. Time Paradox Resolver Test ===');
  const paradox = new TimeParadoxResolverAgent();
  
  let response = await paradox.processInput('What if I prevent my own birth?');
  console.log('1. User: What if I prevent my own birth?');
  console.log('   Agent:', response.substring(0, 200) + '...');
  
  response = await paradox.processInput('How do parallel timelines work?');
  console.log('2. User: How do parallel timelines work?');
  console.log('   Agent:', response.substring(0, 200) + '...');
  
  response = await paradox.processInput('What is the grandfather paradox?');
  console.log('3. User: What is the grandfather paradox?');
  console.log('   Agent:', response.substring(0, 200) + '...');
  
  response = await paradox.processInput('Can I change the future?');
  console.log('4. User: Can I change the future?');
  console.log('   Agent:', response.substring(0, 200) + '...');
  
  response = await paradox.processInput('What about the butterfly effect?');
  console.log('5. User: What about the butterfly effect?');
  console.log('   Agent:', response.substring(0, 200) + '...');
}

async function testDreamInterpreter() {
  console.log('\n=== 4. Dream Interpreter Test ===');
  const dream = new DreamInterpreterAgent();
  
  let response = await dream.processInput('I dreamed of flying over mountains');
  console.log('1. User: I dreamed of flying over mountains');
  console.log('   Agent:', response.substring(0, 200) + '...');
  
  response = await dream.processInput('There was a dragon in my dream');
  console.log('2. User: There was a dragon in my dream');
  console.log('   Agent:', response.substring(0, 200) + '...');
  
  response = await dream.processInput('I was lost in a maze');
  console.log('3. User: I was lost in a maze');
  console.log('   Agent:', response.substring(0, 200) + '...');
  
  response = await dream.processInput('I found treasure in my dream');
  console.log('4. User: I found treasure in my dream');
  console.log('   Agent:', response.substring(0, 200) + '...');
  
  response = await dream.processInput('I was chased by shadows');
  console.log('5. User: I was chased by shadows');
  console.log('   Agent:', response.substring(0, 200) + '...');
}

async function testQuantumDecision() {
  console.log('\n=== 5. Quantum Decision Engine Test ===');
  const quantum = new QuantumDecisionAgent();
  
  let response = await quantum.processInput('Should I accept this job offer?');
  console.log('1. User: Should I accept this job offer?');
  console.log('   Agent:', response.substring(0, 200) + '...');
  
  response = await quantum.processInput('What are the risks of investing?');
  console.log('2. User: What are the risks of investing?');
  console.log('   Agent:', response.substring(0, 200) + '...');
  
  response = await quantum.processInput('How do I choose between two paths?');
  console.log('3. User: How do I choose between two paths?');
  console.log('   Agent:', response.substring(0, 200) + '...');
  
  response = await quantum.processInput('What if I make the wrong choice?');
  console.log('4. User: What if I make the wrong choice?');
  console.log('   Agent:', response.substring(0, 200) + '...');
  
  response = await quantum.processInput('How do probabilities work?');
  console.log('5. User: How do probabilities work?');
  console.log('   Agent:', response.substring(0, 200) + '...');
}

async function testCulinaryAlchemist() {
  console.log('\n=== 6. Culinary Alchemist Test ===');
  const chef = new CulinaryAlchemistAgent();
  
  let response = await chef.processInput('tomatoes, basil, mozzarella');
  console.log('1. User: tomatoes, basil, mozzarella');
  console.log('   Agent:', response.substring(0, 200) + '...');
  
  response = await chef.processInput('chicken, garlic, rosemary');
  console.log('2. User: chicken, garlic, rosemary');
  console.log('   Agent:', response.substring(0, 200) + '...');
  
  response = await chef.processInput('chocolate, vanilla, cream');
  console.log('3. User: chocolate, vanilla, cream');
  console.log('   Agent:', response.substring(0, 200) + '...');
  
  response = await chef.processInput('apples, cinnamon, sugar');
  console.log('4. User: apples, cinnamon, sugar');
  console.log('   Agent:', response.substring(0, 200) + '...');
  
  response = await chef.processInput('salmon, dill, lemon');
  console.log('5. User: salmon, dill, lemon');
  console.log('   Agent:', response.substring(0, 200) + '...');
}

async function testMemoryPalace() {
  console.log('\n=== 7. Memory Palace Architect Test ===');
  const palace = new MemoryPalaceAgent();
  
  let response = await palace.processInput('Remember my birthday is in December');
  console.log('1. User: Remember my birthday is in December');
  console.log('   Agent:', response.substring(0, 200) + '...');
  
  response = await palace.processInput('Store my API key starts with sk-');
  console.log('2. User: Store my API key starts with sk-');
  console.log('   Agent:', response.substring(0, 200) + '...');
  
  response = await palace.processInput('Save my meeting at 3 PM tomorrow');
  console.log('3. User: Save my meeting at 3 PM tomorrow');
  console.log('   Agent:', response.substring(0, 200) + '...');
  
  response = await palace.processInput('Remember to buy milk');
  console.log('4. User: Remember to buy milk');
  console.log('   Agent:', response.substring(0, 200) + '...');
  
  response = await palace.processInput('Store my phone number 555-1234');
  console.log('5. User: Store my phone number 555-1234');
  console.log('   Agent:', response.substring(0, 200) + '...');
}

async function testGitTimeTravel() {
  console.log('\n=== 8. Git Time Travel Guide Test ===');
  const git = new GitTimeTravelAgent();
  
  let response = await git.processInput('Show me the history of this file');
  console.log('1. User: Show me the history of this file');
  console.log('   Agent:', response.substring(0, 200) + '...');
  
  response = await git.processInput('Who last modified this function?');
  console.log('2. User: Who last modified this function?');
  console.log('   Agent:', response.substring(0, 200) + '...');
  
  response = await git.processInput('What changed in commit abc123?');
  console.log('3. User: What changed in commit abc123?');
  console.log('   Agent:', response.substring(0, 200) + '...');
  
  response = await git.processInput('When was this bug introduced?');
  console.log('4. User: When was this bug introduced?');
  console.log('   Agent:', response.substring(0, 200) + '...');
  
  response = await git.processInput('Find the origin of this code');
  console.log('5. User: Find the origin of this code');
  console.log('   Agent:', response.substring(0, 200) + '...');
}

async function testImposterCoach() {
  console.log('\n=== 9. Imposter Syndrome Coach Test ===');
  const coach = new ImposterSyndromeCoachAgent();
  
  let response = await coach.processInput('I feel like I dont belong here');
  console.log('1. User: I feel like I dont belong here');
  console.log('   Agent:', response.substring(0, 200) + '...');
  
  response = await coach.processInput('Everyone else seems so much smarter');
  console.log('2. User: Everyone else seems so much smarter');
  console.log('   Agent:', response.substring(0, 200) + '...');
  
  response = await coach.processInput('I got lucky to get this job');
  console.log('3. User: I got lucky to get this job');
  console.log('   Agent:', response.substring(0, 200) + '...');
  
  response = await coach.processInput('I dont understand this code');
  console.log('4. User: I dont understand this code');
  console.log('   Agent:', response.substring(0, 200) + '...');
  
  response = await coach.processInput('How do I overcome this feeling?');
  console.log('5. User: How do I overcome this feeling?');
  console.log('   Agent:', response.substring(0, 200) + '...');
}

async function testCodePoet() {
  console.log('\n=== 10. Code Poet Test ===');
  const poet = new CodePoetAgent();
  
  let response = await poet.processInput('Write a poem about functions');
  console.log('1. User: Write a poem about functions');
  console.log('   Agent:', response.substring(0, 200) + '...');
  
  response = await poet.processInput('Poem about loops');
  console.log('2. User: Poem about loops');
  console.log('   Agent:', response.substring(0, 200) + '...');
  
  response = await poet.processInput('Write about variables');
  console.log('3. User: Write about variables');
  console.log('   Agent:', response.substring(0, 200) + '...');
  
  response = await poet.processInput('Poem about arrays');
  console.log('4. User: Poem about arrays');
  console.log('   Agent:', response.substring(0, 200) + '...');
  
  response = await poet.processInput('Write about debugging');
  console.log('5. User: Write about debugging');
  console.log('   Agent:', response.substring(0, 200) + '...');
}

async function testLegacyMedium() {
  console.log('\n=== 11. Legacy Code Medium Test ===');
  const medium = new LegacyCodeMediumAgent();
  
  let response = await medium.processInput('Why is this code so complex?');
  console.log('1. User: Why is this code so complex?');
  console.log('   Agent:', response.substring(0, 200) + '...');
  
  response = await medium.processInput('Who wrote this spaghetti code?');
  console.log('2. User: Who wrote this spaghetti code?');
  console.log('   Agent:', response.substring(0, 200) + '...');
  
  response = await medium.processInput('What does this function do?');
  console.log('3. User: What does this function do?');
  console.log('   Agent:', response.substring(0, 200) + '...');
  
  response = await medium.processInput('Why are there so many globals?');
  console.log('4. User: Why are there so many globals?');
  console.log('   Agent:', response.substring(0, 200) + '...');
  
  response = await medium.processInput('How do I refactor this?');
  console.log('5. User: How do I refactor this?');
  console.log('   Agent:', response.substring(0, 200) + '...');
}

async function testZenMaster() {
  console.log('\n=== 12. Zen Master Test ===');
  const zen = new ZenMasterAgent();
  
  let response = await zen.processInput('I am stuck on this bug');
  console.log('1. User: I am stuck on this bug');
  console.log('   Agent:', response.substring(0, 200) + '...');
  
  response = await zen.processInput('Why is coding so frustrating?');
  console.log('2. User: Why is coding so frustrating?');
  console.log('   Agent:', response.substring(0, 200) + '...');
  
  response = await zen.processInput('What is the meaning of null?');
  console.log('3. User: What is the meaning of null?');
  console.log('   Agent:', response.substring(0, 200) + '...');
  
  response = await zen.processInput('How do I find inner peace?');
  console.log('4. User: How do I find inner peace?');
  console.log('   Agent:', response.substring(0, 200) + '...');
  
  response = await zen.processInput('What is the true nature of functions?');
  console.log('5. User: What is the true nature of functions?');
  console.log('   Agent:', response.substring(0, 200) + '...');
}

async function runAllTests() {
  await testDungeonMaster();
  await testDebuggerDuck();
  await testTimeParadox();
  await testDreamInterpreter();
  await testQuantumDecision();
  await testCulinaryAlchemist();
  await testMemoryPalace();
  await testGitTimeTravel();
  await testImposterCoach();
  await testCodePoet();
  await testLegacyMedium();
  await testZenMaster();
  
  console.log('\n=== All tests completed ===');
}

runAllTests().catch(console.error);