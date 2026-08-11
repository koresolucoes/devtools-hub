import { describe, it, expect } from 'vitest';
import { analyzeRepository } from '../analyzers/repositoryAnalyzer';
import { runChecks } from '../checks/runChecks';
import { calculateProjectHealth } from '../scoring/projectHealth';
import { RepositoryProvider, RepositoryMetadata, RepositoryTree } from '../../lib/repositories/providers/types';
import fs from 'fs/promises';
import path from 'path';

class LocalFixtureProvider implements RepositoryProvider {
  constructor(private fixturePath: string) {}

  async getMetadata(): Promise<RepositoryMetadata> {
    return {
      name: 'koregastro2',
      owner: 'koresolucoes',
      defaultBranch: 'main',
      url: 'https://github.com/koresolucoes/koregastro2'
    };
  }

  async getTree(): Promise<RepositoryTree> {
    const files: any[] = [];
    
    // Simulate recursive readdir
    async function walk(dir: string, base: string = '') {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const relPath = base ? `${base}/${entry.name}` : entry.name;
        if (entry.isDirectory()) {
          await walk(path.join(dir, entry.name), relPath);
        } else {
          files.push({ path: relPath, size: 100 });
        }
      }
    }
    
    try {
      await walk(this.fixturePath);
    } catch {
      // ignore
    }

    return { files, truncated: false };
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

describe('KoreGastro2 Regression Suite', () => {
  it('correctly handles edge cases like Node native test runner and multiple lockfiles', async () => {
    const provider = new LocalFixtureProvider(path.resolve(__dirname, '../../../tests/fixtures/repos/koregastro2'));
    const ir = await analyzeRepository(provider);
    const checks = runChecks(ir, { 
      vulnerabilities: [],
      securitySummary: {
        status: 'skipped',
        totalDependencies: ir.dependencies.length,
        resolvedDependencies: 0,
        queriedDependencies: 0,
        successfulQueries: 0,
        failedQueries: 0,
        affectedPackageVersions: 0,
        advisories: 0
      }
    });
    const health = calculateProjectHealth(ir, checks);

    // QUALITY: Should detect Node Test Runner and tsc
    const tests = ir.quality.tests.tools;
    const typecheckers = ir.quality.typecheckers;

    expect(tests.some(t => t.id === 'node-test-runner')).toBe(true);
    expect(typecheckers.some(t => t.id === 'typescript')).toBe(true);

    // FRAMEWORKS: Should detect Angular and separate Vite
    const frameworks = ir.frameworks.filter(f => f.category === 'framework');
    const buildTools = ir.frameworks.filter(f => f.category === 'buildTool');
    
    expect(frameworks.some(f => f.id === 'angular')).toBe(true);
    expect(buildTools.some(f => f.id === 'vite')).toBe(true);

    // ARCHITECTURE: Should detect multiple lockfiles
    const archChecks = checks.filter(c => c.category === 'architecture');
    const lockfileConflict = archChecks.find(c => c.id === 'ARCH001');
    expect(lockfileConflict?.status).toBe('fail'); // because package-lock.json and bun.lock exist

    // COVERAGE: Should compute a valid coverage
    expect(health.coverage.checkCoverage).toBeGreaterThan(0);
    expect(health.coverage.checkCoverage).toBeLessThanOrEqual(100);
  });
});
