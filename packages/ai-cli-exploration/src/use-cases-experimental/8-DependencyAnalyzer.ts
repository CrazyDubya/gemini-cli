import type { ExplorationUseCase } from '../types.js';

export const dependencyAnalyzer: ExplorationUseCase = {
  name: 'Dependency Analyzer',
  description: 'Analyzes project dependencies and generates a dependency report',
  systemPrompt: `You are a dependency management expert. Your task is to analyze the provided project's dependencies and generate a comprehensive report. This includes:
1. Listing all direct and transitive dependencies
2. Identifying outdated or deprecated dependencies
3. Detecting potential security vulnerabilities in dependencies
4. Analyzing dependency licenses for compliance
5. Suggesting alternatives for problematic dependencies

The report should help maintainers understand their dependency landscape and make informed decisions.`,
  userPrompt: `Analyze the dependencies in this project:`
};