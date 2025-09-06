#!/usr/bin/env node
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { ZenMasterAgent } from './src/use-cases/12-ZenMaster.js';
import { DebuggerDuckAgent } from './src/use-cases/2-DebuggerDuck.js';

async function demo() {
  console.log('=== AI CLI Exploration - Real AI Demo ===\n');
  
  // Check if API key is available
  const apiKey = process.env['GEMINI_API_KEY'] || process.env['GOOGLE_API_KEY'];
  if (!apiKey) {
    console.log('No API key found. Please set GEMINI_API_KEY or GOOGLE_API_KEY environment variable.');
    console.log('Example: export GEMINI_API_KEY=your-api-key-here\n');
    console.log('You can get a free API key from: https://aistudio.google.com/apikey\n');
    return;
  }
  
  console.log('Using real AI with API key...\n');
  
  // Test Zen Master
  console.log('1. Testing Zen Master Agent:');
  const zen = new ZenMasterAgent();
  const zenResponse = await zen.processInput('What is the meaning of null in programming?');
  console.log('Question: What is the meaning of null in programming?');
  console.log('Response:', zenResponse);
  console.log('');
  
  // Test Debugger Duck
  console.log('2. Testing Debugger Duck Agent:');
  const duck = new DebuggerDuckAgent();
  const duckResponse = await duck.processInput('My loop is running infinitely, how can I fix it?');
  console.log('Question: My loop is running infinitely, how can I fix it?');
  console.log('Response:', duckResponse);
  console.log('');
  
  console.log('=== Demo completed ===');
}

demo().catch(console.error);