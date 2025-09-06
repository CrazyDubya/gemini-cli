/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface GitCommit {
  hash: string;
  shortHash: string;
  message: string;
  author: string;
  email: string;
  date: Date;
  filesChanged: number;
  insertions: number;
  deletions: number;
}

export interface GitBlameInfo {
  line: number;
  hash: string;
  author: string;
  date: Date;
  content: string;
}

export interface GitConflictInfo {
  file: string;
  conflicts: Array<{
    startLine: number;
    endLine: number;
    ourContent: string[];
    theirContent: string[];
  }>;
}

export class GitIntegration {
  private repoPath: string;

  constructor(repoPath: string = process.cwd()) {
    this.repoPath = repoPath;
  }

  async isGitRepository(): Promise<boolean> {
    try {
      await execAsync('git rev-parse --git-dir', { cwd: this.repoPath });
      return true;
    } catch {
      return false;
    }
  }

  async getCommitHistory(maxCount = 50): Promise<GitCommit[]> {
    if (!(await this.isGitRepository())) {
      return [];
    }

    try {
      // Get basic commit info first
      const { stdout } = await execAsync(
        `git log --oneline -${maxCount}`,
        { cwd: this.repoPath }
      );

      // Parse simple format and get details for each
      const lines = stdout.trim().split('\n').filter(line => line.length > 0);
      const commits: GitCommit[] = [];
      
      for (const line of lines.slice(0, Math.min(maxCount, 20))) {
        const [hash, ...messageParts] = line.split(' ');
        const message = messageParts.join(' ');
        
        // Get detailed info for each commit
        try {
          const detailsResult = await execAsync(
            `git show --format="%an|%ae|%ad" --name-only --date=iso ${hash}`,
            { cwd: this.repoPath }
          );
          
          const detailLines = detailsResult.stdout.trim().split('\n');
          const [author, email, date] = detailLines[0].split('|');
          const filesChanged = detailLines.slice(1).filter(f => f.length > 0).length;
          
          commits.push({
            hash: hash,
            shortHash: hash.substring(0, 7),
            message: message,
            author: author || 'Unknown',
            email: email || '',
            date: new Date(date || Date.now()),
            filesChanged: filesChanged,
            insertions: 0, // Will calculate separately if needed
            deletions: 0   // Will calculate separately if needed
          });
        } catch {
          // Skip commits that can't be parsed
        }
      }

      return commits;
    } catch (error) {
      console.warn('Failed to get commit history:', error);
      return [];
    }
  }

  async getCurrentBranch(): Promise<string> {
    try {
      const { stdout } = await execAsync('git branch --show-current', { cwd: this.repoPath });
      return stdout.trim();
    } catch {
      return 'unknown';
    }
  }

  async getBranches(): Promise<{ current: string; all: string[] }> {
    try {
      const { stdout } = await execAsync('git branch', { cwd: this.repoPath });
      const branches = stdout
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => line.replace(/^\*\s*/, ''));
      
      const current = await this.getCurrentBranch();
      return { current, all: branches };
    } catch {
      return { current: 'unknown', all: [] };
    }
  }

  async getFileBlame(filePath: string): Promise<GitBlameInfo[]> {
    try {
      const { stdout } = await execAsync(
        `git blame --porcelain "${filePath}"`,
        { cwd: this.repoPath }
      );

      return this.parseBlameOutput(stdout);
    } catch (error) {
      console.warn(`Failed to get blame for ${filePath}:`, error);
      return [];
    }
  }

  async getChangedFiles(): Promise<string[]> {
    try {
      const { stdout } = await execAsync('git diff --name-only HEAD', { cwd: this.repoPath });
      return stdout.trim().split('\n').filter(line => line.length > 0);
    } catch {
      return [];
    }
  }

  async getStagedFiles(): Promise<string[]> {
    try {
      const { stdout } = await execAsync('git diff --cached --name-only', { cwd: this.repoPath });
      return stdout.trim().split('\n').filter(line => line.length > 0);
    } catch {
      return [];
    }
  }

  async getConflictedFiles(): Promise<string[]> {
    try {
      const { stdout } = await execAsync('git diff --name-only --diff-filter=U', { cwd: this.repoPath });
      return stdout.trim().split('\n').filter(line => line.length > 0);
    } catch {
      return [];
    }
  }

  async analyzeConflicts(filePath: string): Promise<GitConflictInfo | null> {
    try {
      const { stdout } = await execAsync(`cat "${filePath}"`, { cwd: this.repoPath });
      return this.parseConflictMarkers(filePath, stdout);
    } catch {
      return null;
    }
  }

  async getCommitStats(hash: string): Promise<{ files: number; insertions: number; deletions: number }> {
    try {
      const { stdout } = await execAsync(
        `git show --stat --format="" ${hash}`,
        { cwd: this.repoPath }
      );

      const lines = stdout.trim().split('\n');
      const summaryLine = lines[lines.length - 1];
      
      if (summaryLine.includes('file')) {
        const match = summaryLine.match(/(\d+) file.*?(\d+) insertion.*?(\d+) deletion/);
        if (match) {
          return {
            files: parseInt(match[1], 10),
            insertions: parseInt(match[2], 10),
            deletions: parseInt(match[3], 10)
          };
        }
      }

      return { files: 0, insertions: 0, deletions: 0 };
    } catch {
      return { files: 0, insertions: 0, deletions: 0 };
    }
  }

  async searchCommits(searchTerm: string, maxCount = 20): Promise<GitCommit[]> {
    try {
      const { stdout } = await execAsync(
        `git log --grep="${searchTerm}" --oneline -${maxCount}`,
        { cwd: this.repoPath }
      );

      const hashes = stdout
        .trim()
        .split('\n')
        .filter(line => line.length > 0)
        .map(line => line.split(' ')[0]);

      // Get detailed info for each commit
      const commits: GitCommit[] = [];
      for (const hash of hashes) {
        const commit = await this.getCommitDetails(hash);
        if (commit) commits.push(commit);
      }

      return commits;
    } catch {
      return [];
    }
  }

  async getCommitDetails(hash: string): Promise<GitCommit | null> {
    try {
      const { stdout } = await execAsync(
        `git show --format="%H|%h|%s|%an|%ae|%ad" --name-only ${hash}`,
        { cwd: this.repoPath }
      );

      const lines = stdout.trim().split('\n');
      const [commitInfo] = lines[0].split('|');
      const [fullHash, shortHash, message, author, email, date] = lines[0].split('|');
      
      const stats = await this.getCommitStats(hash);

      return {
        hash: fullHash,
        shortHash: shortHash,
        message: message,
        author: author,
        email: email,
        date: new Date(date),
        filesChanged: stats.files,
        insertions: stats.insertions,
        deletions: stats.deletions
      };
    } catch {
      return null;
    }
  }

  private parseCommitHistory(stdout: string): GitCommit[] {
    const commits: GitCommit[] = [];
    const lines = stdout.split('\n');
    let i = 0;

    while (i < lines.length) {
      if (lines[i].includes('|')) {
        const [hash, shortHash, message, author, email, date] = lines[i].split('|');
        
        // Skip the blank line
        i++;
        
        // Parse file changes
        let filesChanged = 0;
        let insertions = 0;
        let deletions = 0;
        
        while (i < lines.length && lines[i] && !lines[i].includes('|')) {
          const parts = lines[i].split('\t');
          if (parts.length >= 3) {
            filesChanged++;
            insertions += parseInt(parts[0], 10) || 0;
            deletions += parseInt(parts[1], 10) || 0;
          }
          i++;
        }

        commits.push({
          hash,
          shortHash,
          message,
          author,
          email,
          date: new Date(date),
          filesChanged,
          insertions,
          deletions
        });
      } else {
        i++;
      }
    }

    return commits;
  }

  private parseBlameOutput(stdout: string): GitBlameInfo[] {
    const lines = stdout.split('\n');
    const blameInfo: GitBlameInfo[] = [];
    let currentHash = '';
    let currentAuthor = '';
    let currentDate = '';
    let lineNumber = 0;

    for (const line of lines) {
      if (line.match(/^[0-9a-f]{40}/)) {
        const parts = line.split(' ');
        currentHash = parts[0];
        lineNumber = parseInt(parts[2], 10);
      } else if (line.startsWith('author ')) {
        currentAuthor = line.replace('author ', '');
      } else if (line.startsWith('author-time ')) {
        const timestamp = parseInt(line.replace('author-time ', ''), 10);
        currentDate = new Date(timestamp * 1000).toISOString();
      } else if (line.startsWith('\t')) {
        const content = line.substring(1);
        blameInfo.push({
          line: lineNumber,
          hash: currentHash,
          author: currentAuthor,
          date: new Date(currentDate),
          content
        });
      }
    }

    return blameInfo;
  }

  private parseConflictMarkers(filePath: string, content: string): GitConflictInfo {
    const lines = content.split('\n');
    const conflicts: GitConflictInfo['conflicts'] = [];
    let inConflict = false;
    let conflictStart = 0;
    let ourContent: string[] = [];
    let theirContent: string[] = [];
    let inOurSection = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.startsWith('<<<<<<<')) {
        inConflict = true;
        conflictStart = i;
        ourContent = [];
        theirContent = [];
        inOurSection = true;
      } else if (line.startsWith('=======') && inConflict) {
        inOurSection = false;
      } else if (line.startsWith('>>>>>>>') && inConflict) {
        conflicts.push({
          startLine: conflictStart + 1,
          endLine: i + 1,
          ourContent: [...ourContent],
          theirContent: [...theirContent]
        });
        inConflict = false;
      } else if (inConflict) {
        if (inOurSection) {
          ourContent.push(line);
        } else {
          theirContent.push(line);
        }
      }
    }

    return {
      file: filePath,
      conflicts
    };
  }
}