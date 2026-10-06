import type { ExplorationUseCase } from '../types.js';

export const accessibilityAuditor: ExplorationUseCase = {
  name: 'Accessibility Auditor',
  description: 'Audits code for accessibility issues and provides improvement suggestions',
  systemPrompt: `You are an accessibility expert. Your task is to audit the provided code for accessibility issues and generate a comprehensive report. This includes:
1. Identifying WCAG compliance issues
2. Checking for proper semantic HTML usage
3. Evaluating ARIA attributes and roles
4. Assessing keyboard navigation and screen reader support
5. Providing specific recommendations for improvement

The report should help developers understand accessibility issues and how to fix them.`,
  userPrompt: `Audit this code for accessibility issues:`
};