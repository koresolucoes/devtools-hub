import { describe, it, expect } from 'vitest';
import { analyzeProject } from '../analyzeProject';
import { analyzeRepository } from '../analyzers/repositoryAnalyzer';
import { RepositoryProvider, RepositoryMetadata, RepositoryTree } from '../../lib/repositories/providers/types';
import fs from 'fs/promises';
import path from 'path';

class LocalFixtureProvider implements RepositoryProvider {
  constructor(private fixturePath: string) {}

  async getMetadata(): Promise<RepositoryMetadata> {
    return {
      name: 'devtools-hub',
      owner: 'koresolucoes',
      defaultBranch: 'main',
      url: 'https://github.com/koresolucoes/devtools-hub'
    };
  }

  async getTree(): Promise<RepositoryTree> {
    return {
      files: [
        { path: 'package.json', size: 100 },
        { path: 'package-lock.json', size: 100 },
        { path: 'tsconfig.json', size: 100 },
        { path: 'src/main.ts', size: 100 }
      ],
      truncated: false
    };
  }

  async readFile(filePath: string): Promise<string | null> {
    try {
      const fullPath = path.join(this.fixturePath, filePath);
      return await fs.readFile(fullPath, 'utf-8');
    } catch {
      return null;
    }
  }
}

describe('DevsHub Dogfood Analysis', () => {
  it('analyzes the project using local fixtures', async () => {
    const provider = new LocalFixtureProvider(path.join(__dirname, 'fixtures/repos/devshub'));
    const ir = await analyzeRepository(provider);

    expect(ir.repository.owner).toBe('koresolucoes');
    expect(ir.repository.repo).toBe('devtools-hub');
    
    // Detector assertions
    expect(ir.languages.some(l => l.name === 'TypeScript')).toBe(true);
    expect(ir.packageManagers.some(pm => pm.name === 'npm')).toBe(true);
    expect(ir.dependencies.find(d => d.name === 'react')).toBeDefined();
    expect(ir.dependencies.find(d => d.name === 'vitest')).toBeDefined();
  });

  // Skip live github tests by default to prevent rate limits in CI
  it.skipIf(!process.env.RUN_LIVE_GITHUB_TESTS)('analyzes its own public repository correctly via GitHub API', async () => {
    const result = await analyzeProject('https://github.com/koresolucoes/devtools-hub', { dependencySecurity: false });
    
    expect(result.project.repository.owner).toBe('koresolucoes');
    expect(result.project.repository.repo).toBe('devtools-hub');
    expect(result.project.packageManagers.some(pm => pm.name === 'npm')).toBe(true);
    
    expect(Array.isArray(result.checks)).toBe(true);
    expect(result.health.score).toBeGreaterThan(0);
    expect(result.health.categories.quality).toBeDefined();
    expect(result.health.confidence).toBeGreaterThan(50);
  }, 30000);
});
