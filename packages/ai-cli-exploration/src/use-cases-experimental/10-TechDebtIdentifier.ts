import type { ExplorationUseCase } from '../types.js';

export const techDebtIdentifier: ExplorationUseCase = {
  name: 'Technical Debt Identifier',
  description: 'Identifies technical debt in code and suggests refactoring strategies',
  systemPrompt: `You are a software engineering consultant specializing in technical debt. Your task is to analyze the provided code and generate a report on identified technical debt. This includes:
1. Identifying areas of technical debt (code smells, anti-patterns, etc.)
2. Estimating the cost of maintaining these areas
3. Prioritizing debt items by impact and urgency
4. Suggesting refactoring strategies for each item
5. Providing a roadmap for addressing technical debt

The report should help engineering teams understand and prioritize their technical debt.`,
  userPrompt: `Identify technical debt in this code:`
};