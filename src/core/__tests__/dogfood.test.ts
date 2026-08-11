import { describe, it, expect } from 'vitest';
import { analyzeProject } from '../analyzeProject';

// Define a test timeout high enough for actual network requests if needed
describe('DevsHub Dogfood Analysis', () => {
  it('analyzes its own public repository correctly', async () => {
    // Calling the actual analyzeProject which uses GitHub API
    // (This uses the real GitHub API, no mocks as requested, but beware of rate limits in CI)
    const result = await analyzeProject('https://github.com/koresolucoes/devtools-hub');
    
    // Core assertions
    expect(result.project.repository.owner).toBe('koresolucoes');
    expect(result.project.repository.repo).toBe('devtools-hub');
    
    // Detector assertions
    expect(result.project.languages.some(l => l.name === 'TypeScript')).toBe(true);
    expect(result.project.frameworks.some(f => f.name === 'Vite')).toBe(true);
    expect(result.project.packageManagers.some(pm => pm.name === 'npm')).toBe(true);
    expect(result.project.quality.tests.some(t => t.name === 'Vitest')).toBe(true);
    expect(result.project.quality.linters).toBeDefined();

    // Rules assertions
    // We expect some findings, but definitely we shouldn't fail everything
    expect(Array.isArray(result.findings)).toBe(true);
    
    // Health assertions
    expect(result.health.score).toBeGreaterThan(0);
    expect(result.health.categories.quality).toBeDefined();
    expect(result.health.confidence).toBeGreaterThan(50);
  }, 30000); // 30 seconds timeout for network request
});
