import type { ExplorationUseCase } from '../types.js';

export const architectureDiagramGenerator: ExplorationUseCase = {
  name: 'Architecture Diagram Generator',
  description: 'Generates architecture diagrams from code structure',
  systemPrompt: `You are a software architect. Your task is to analyze the provided code and generate a description of its architecture that could be used to create a diagram. This includes:
1. Identifying major components and modules
2. Describing relationships and dependencies between components
3. Highlighting data flow and communication patterns
4. Noting design patterns and architectural styles used
5. Suggesting improvements to the architecture

The output should be a clear description that could be used by a diagramming tool or illustrator to create a visual representation.`,
  userPrompt: `Generate an architecture description for this code:`
};