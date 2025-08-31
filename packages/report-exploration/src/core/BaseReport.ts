/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

export interface ReportMetadata {
  id: string;
  timestamp: Date;
  type: string;
  version: string;
  tags?: string[];
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

export interface ReportData {
  metadata: ReportMetadata;
  content: unknown;
  attachments?: Attachment[];
}

export interface Attachment {
  name: string;
  type: string;
  data: string | Buffer;
}

export interface ReportProcessor<T = unknown> {
  process(data: T): Promise<ReportData>;
  validate(data: T): boolean;
}

export interface ReportExporter {
  export(report: ReportData, format: string): Promise<string | Buffer>;
  supportedFormats(): string[];
}

export interface ReportStorage {
  save(report: ReportData): Promise<string>;
  load(id: string): Promise<ReportData>;
  query(filter: Partial<ReportMetadata>): Promise<ReportData[]>;
  delete(id: string): Promise<void>;
}

export class BaseReport {
  protected metadata: ReportMetadata;
  protected content: unknown;
  protected attachments: Attachment[] = [];
  protected storage?: ReportStorage;

  constructor(type: string, storage?: ReportStorage) {
    this.metadata = {
      id: this.generateId(),
      timestamp: new Date(),
      type,
      version: '1.0.0',
    };
    this.storage = storage;
  }

  protected generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  setContent(content: unknown): void {
    this.content = content;
  }

  addAttachment(attachment: Attachment): void {
    this.attachments.push(attachment);
  }

  setTag(tag: string): void {
    if (!this.metadata.tags) {
      this.metadata.tags = [];
    }
    this.metadata.tags.push(tag);
  }

  setPriority(priority: ReportMetadata['priority']): void {
    this.metadata.priority = priority;
  }

  async save(): Promise<string> {
    const reportData: ReportData = {
      metadata: this.metadata,
      content: this.content,
      attachments: this.attachments,
    };

    if (this.storage) {
      return this.storage.save(reportData);
    }

    const reportDir = path.join(os.tmpdir(), 'reports', this.metadata.type);
    await fs.mkdir(reportDir, { recursive: true });
    
    const filename = `${this.metadata.id}.json`;
    const filepath = path.join(reportDir, filename);
    
    await fs.writeFile(filepath, JSON.stringify(reportData, null, 2));
    return filepath;
  }

  toJSON(): ReportData {
    return {
      metadata: this.metadata,
      content: this.content,
      attachments: this.attachments,
    };
  }
}