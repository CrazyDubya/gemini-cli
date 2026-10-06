import type { ExplorationUseCase } from '../types.js';

export const codeComplexityAnalyzer: ExplorationUseCase = {
  name: 'Code Complexity Analyzer',
  description: 'Analyzes code complexity and provides a detailed report',
  systemPrompt: `You are an expert code analyst. Your task is to analyze the provided code and generate a detailed report on its complexity. This includes:
1. Cyclomatic complexity
2. Cognitive complexity
3. Code duplication
4. Potential bottlenecks
5. Suggestions for improvement

The report should be structured and easy to understand, with specific examples from the code.`,
  userPrompt: `Analyze the complexity of this code:`
};