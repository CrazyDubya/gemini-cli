/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ReportData, ReportProcessor } from './BaseReport.js';

export interface PipelineStage<TIn = unknown, TOut = unknown> {
  name: string;
  execute(input: TIn): Promise<TOut>;
  canSkip?: (input: TIn) => boolean;
}

export class ReportPipeline<TInput = unknown> {
  private stages: PipelineStage[] = [];
  private errorHandlers: Map<string, (error: Error) => void> = new Map();

  addStage<T, U>(stage: PipelineStage<T, U>): this {
    this.stages.push(stage as PipelineStage);
    return this;
  }

  onError(stageName: string, handler: (error: Error) => void): this {
    this.errorHandlers.set(stageName, handler);
    return this;
  }

  async execute(input: TInput): Promise<unknown> {
    let result: unknown = input;

    for (const stage of this.stages) {
      if (stage.canSkip && stage.canSkip(result)) {
        continue;
      }

      try {
        result = await stage.execute(result);
      } catch (error) {
        const handler = this.errorHandlers.get(stage.name);
        if (handler) {
          handler(error as Error);
        } else {
          throw new Error(`Pipeline failed at stage ${stage.name}: ${error}`);
        }
      }
    }

    return result;
  }
}

export class ReportAggregator {
  private reports: ReportData[] = [];

  add(report: ReportData): void {
    this.reports.push(report);
  }

  aggregate(): ReportData {
    const aggregatedContent: Record<string, unknown> = {};
    const allTags = new Set<string>();
    let highestPriority: ReportData['metadata']['priority'] = 'low';

    for (const report of this.reports) {
      aggregatedContent[report.metadata.id] = report.content;
      
      if (report.metadata.tags) {
        report.metadata.tags.forEach(tag => allTags.add(tag));
      }

      if (report.metadata.priority) {
        highestPriority = this.getHigherPriority(highestPriority, report.metadata.priority);
      }
    }

    return {
      metadata: {
        id: `aggregate-${Date.now()}`,
        timestamp: new Date(),
        type: 'aggregate',
        version: '1.0.0',
        tags: Array.from(allTags),
        priority: highestPriority,
      },
      content: {
        reportCount: this.reports.length,
        reports: aggregatedContent,
        summary: this.generateSummary(),
      },
    };
  }

  private getHigherPriority(
    a: ReportData['metadata']['priority'],
    b: ReportData['metadata']['priority']
  ): ReportData['metadata']['priority'] {
    const priorities = ['low', 'medium', 'high', 'critical'];
    const aIndex = priorities.indexOf(a || 'low');
    const bIndex = priorities.indexOf(b || 'low');
    return priorities[Math.max(aIndex, bIndex)] as ReportData['metadata']['priority'];
  }

  private generateSummary(): Record<string, number> {
    const summary: Record<string, number> = {};
    
    for (const report of this.reports) {
      const type = report.metadata.type;
      summary[type] = (summary[type] || 0) + 1;
    }

    return summary;
  }
}