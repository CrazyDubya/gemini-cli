#!/usr/bin/env tsx
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { ZenMasterAgent } from './src/use-cases/12-ZenMaster.js';
import { DebuggerDuckAgent } from './src/use-cases/2-DebuggerDuck.js';

async function testZenMaster() {
  console.log('\n=== Testing Zen Master with Real AI ===');
  const zen = new ZenMasterAgent();
  
  try {
    const response = await zen.processInput('Why is debugging so frustrating?');
    console.log('Question: Why is debugging so frustrating?');
    console.log('Response:', response);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function testDebuggerDuck() {
  console.log('\n=== Testing Debugger Duck with Real AI ===');
  const duck = new DebuggerDuckAgent();
  
  try {
    const response = await duck.processInput('My code is throwing an undefined is not a function error');
    console.log('Question: My code is throwing an undefined is not a function error');
    console.log('Response:', response);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function runTests() {
  // Check if API key is available
  const apiKey = process.env['GEMINI_API_KEY'] || process.env['GOOGLE_API_KEY'];
  if (!apiKey) {
    console.log('No API key found. Please set GEMINI_API_KEY or GOOGLE_API_KEY environment variable.');
    console.log('Using fallback hardcoded responses...');
  }
  
  await testZenMaster();
  await testDebuggerDuck();
  
  console.log('\n=== Tests completed ===');
}

runTests().catch(console.error);
