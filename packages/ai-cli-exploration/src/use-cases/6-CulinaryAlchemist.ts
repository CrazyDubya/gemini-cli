/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseAIAgent } from '../core/BaseAIAgent.js';

export class CulinaryAlchemistAgent extends BaseAIAgent {
  private flavorCompounds: Map<string, string[]> = new Map();
  private transformations: string[] = [];

  constructor() {
    super(
      {
        role: 'a culinary alchemist who transforms ingredients through scientific and magical processes',
        personality: 'Eccentric genius chef. Speaks of cooking as molecular transformation and ancient art.',
        constraints: ['Safe combinations only', 'Respect dietary restrictions', 'Balance innovation with edibility'],
        knowledge: ['Molecular gastronomy', 'Food chemistry', 'Ancient cooking techniques', 'Flavor pairing science'],
        goals: ['Create unexpected harmonies', 'Transform the mundane into extraordinary', 'Reveal hidden flavor dimensions'],
      },
      { canMakeDecisions: true, canRemember: true }
    );

    this.initializeFlavors();
  }

  private initializeFlavors(): void {
    this.flavorCompounds.set('umami', ['mushroom', 'tomato', 'parmesan', 'soy']);
    this.flavorCompounds.set('sweet', ['caramel', 'vanilla', 'honey', 'fruit']);
    this.flavorCompounds.set('bitter', ['coffee', 'chocolate', 'kale', 'grapefruit']);
  }

  async processInput(input: string): Promise<string> {
    const ingredients = this.extractIngredients(input);
    const alchemy = this.performCulinaryAlchemy(ingredients);
    
    return `🧪 CULINARY ALCHEMY TRANSFORMATION:

Base Elements: ${ingredients.join(' + ')}

Alchemical Process:
${alchemy.process}

Molecular Transformation:
${alchemy.transformation}

Flavor Profile Achieved:
${alchemy.profile}

✨ Secret Technique: ${alchemy.secret}

Serving suggestion: ${alchemy.presentation}`;
  }

  private extractIngredients(input: string): string[] {
    const words = input.toLowerCase().split(/[,\s]+/);
    return words.filter(w => w.length > 2).slice(0, 5);
  }

  private performCulinaryAlchemy(ingredients: string[]): any {
    const processes = ['Maillard reaction at 180°C', 'Spherification with sodium alginate', 'Sous vide at 56.5°C for 2 hours', 'Liquid nitrogen flash freeze'];
    const profiles = ['Umami explosion with subtle sweet undertones', 'Bitter-sweet harmony with acidic brightness', 'Savory depth with aromatic complexity'];
    const secrets = ['Add a whisper of smoked paprika', 'Finish with microplaned frozen butter', 'Infuse with lavender smoke'];
    const presentations = ['Serve on heated volcanic stone', 'Present in edible gold leaf nest', 'Float on aromatic fog'];

    return {
      process: processes[Math.floor(Math.random() * processes.length)],
      transformation: `${ingredients[0]} molecules bind with ${ingredients[1] || 'air'} creating new compound`,
      profile: profiles[Math.floor(Math.random() * profiles.length)],
      secret: secrets[Math.floor(Math.random() * secrets.length)],
      presentation: presentations[Math.floor(Math.random() * presentations.length)],
    };
  }

  generatePrompt(): string {
    return this.getSystemPrompt();
  }
}