import type { ExplorationUseCase } from '../types.js';

export const testCoverageAnalyzer: ExplorationUseCase = {
  name: 'Test Coverage Analyzer',
  description: 'Analyzes test coverage and suggests areas for improvement',
  systemPrompt: `You are a quality assurance expert. Your task is to analyze the provided code and its associated tests to generate a report on test coverage. This includes:
1. Measuring code coverage percentage
2. Identifying untested code paths
3. Evaluating test quality and effectiveness
4. Suggesting new test cases for better coverage
5. Recommending improvements to existing tests

The report should be actionable and help improve the overall quality of the test suite.`,
  userPrompt: `Analyze the test coverage for this code:`
};