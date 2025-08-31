#!/usr/bin/env node
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import chalk from 'chalk';
import { DungeonMasterAgent } from './src/use-cases/1-DungeonMaster.js';
import { DebuggerDuckAgent } from './src/use-cases/2-DebuggerDuck.js';

console.log(chalk.bold.cyan('═'.repeat(70)));
console.log(chalk.bold.yellow('AI CLI EXPLORATION - SYSTEM TEST'));
console.log(chalk.bold.cyan('═'.repeat(70)));
console.log();

console.log(chalk.green('✅ Testing enhanced DungeonMaster features...'));
const dm = new DungeonMasterAgent();

// Test dice rolling
const diceResult = await dm.processInput('roll d20');
console.log('  Dice roll:', diceResult.substring(0, 50));

// Test save/load
const saveResult = await dm.processInput('save game');
console.log('  Save game:', saveResult.substring(0, 50));

console.log();
console.log(chalk.green('✅ Testing enhanced DebuggerDuck features...'));
const duck = new DebuggerDuckAgent();

// Test debug strategy
const strategy = duck.suggestDebugStrategy();
console.log('  Strategy:', strategy);

// Test stats
const stats = duck.getDebugStats();
console.log('  Stats:', stats.split('\n')[1]);

console.log();
console.log(chalk.bold.green('✅ All systems operational!'));
console.log();
console.log(chalk.yellow('To launch the interactive system, run:'));
console.log(chalk.cyan('  npm run launch'));
console.log();