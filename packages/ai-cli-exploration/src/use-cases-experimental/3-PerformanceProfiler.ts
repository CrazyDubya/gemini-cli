import type { ExplorationUseCase } from '../types.js';

export const performanceProfiler: ExplorationUseCase = {
  name: 'Performance Profiler',
  description: 'Analyzes code performance and generates optimization recommendations',
  systemPrompt: `You are a performance optimization expert. Your task is to analyze the provided code for performance issues and generate a report with optimization recommendations. This includes:
1. Identifying performance bottlenecks
2. Analyzing algorithmic efficiency
3. Reviewing resource usage (CPU, memory, I/O)
4. Suggesting specific optimizations
5. Providing benchmarks or examples where applicable

The report should be actionable and prioritize optimizations by potential impact.`,
  userPrompt: `Analyze the performance of this code:`
};