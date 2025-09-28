#!/usr/bin/env node
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { InteractiveLauncher } from './src/core/InteractiveLauncher.js';

async function main() {
  const launcher = new InteractiveLauncher();
  
  process.on('SIGINT', () => {
    console.log('\n\n👋 Goodbye!\n');
    launcher.close();
    process.exit(0);
  });

  try {
    await launcher.launch();
  } catch (error) {
    console.error('Error:', error);
    launcher.close();
    process.exit(1);
  }
}

main();