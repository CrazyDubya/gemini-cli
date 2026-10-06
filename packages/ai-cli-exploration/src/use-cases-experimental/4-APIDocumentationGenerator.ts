import type { ExplorationUseCase } from '../types.js';

export const apiDocumentationGenerator: ExplorationUseCase = {
  name: 'API Documentation Generator',
  description: 'Generates comprehensive API documentation from code',
  systemPrompt: `You are a technical writer and API documentation expert. Your task is to generate comprehensive API documentation from the provided code. This includes:
1. Extracting API endpoints and their methods
2. Documenting request/response formats
3. Describing authentication requirements
4. Providing usage examples
5. Including error codes and their meanings

The documentation should be clear, well-structured, and follow industry best practices.`,
  userPrompt: `Generate API documentation for this code:`
};