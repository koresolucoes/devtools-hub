import { describe, it, expect } from 'vitest';
import { analyzeRepository } from '../repositoryAnalyzer';
import type { RepositoryFile } from '../../../lib/repositories/providers/githubPublic';

describe('repositoryAnalyzer', () => {
  it('correctly detects the DevsHub project stack', () => {
    const files: RepositoryFile[] = [
      {
        path: 'package.json',
        content: JSON.stringify({
          dependencies: { react: '^18', vite: '^5' },
          devDependencies: { vitest: '^1' },
          scripts: { test: 'vitest', lint: 'eslint', typecheck: 'tsc' }
        })
      },
      {
        path: 'package-lock.json',
        content: '{}'
      },
      {
        path: '.github/workflows/ci.yml',
        content: 'name: CI'
      }
    ];

    const ir = analyzeRepository(files);

    expect(ir.primaryLanguage).toBe('node');
    expect(ir.packageManager).toBe('npm');
    expect(ir.frameworks).toContain('react');
    expect(ir.frameworks).toContain('vite');
    expect(ir.ciTool).toBe('github_actions');
    expect(ir.hasTests).toBe(true);
    expect(ir.hasLinting).toBe(true);
    expect(ir.hasTypeChecking).toBe(true);
  });
});
