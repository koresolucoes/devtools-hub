import { DetectedTechnology } from '../../project/types';
import { DetectorContext } from './types';

export function detectQualityTools(ctx: DetectorContext): { tests: DetectedTechnology[], linters: DetectedTechnology[], typecheckers: DetectedTechnology[] } {
  const tests: DetectedTechnology[] = [];
  const linters: DetectedTechnology[] = [];
  const typecheckers: DetectedTechnology[] = [];

  let deps: Record<string, string> = {};
  const packageJson = ctx.files.get('package.json');
  if (packageJson?.content) {
    try {
      const pkg = JSON.parse(packageJson.content);
      deps = { ...pkg.dependencies, ...pkg.devDependencies };
    } catch (e) {
      // ignore
    }
  }

  // Tests
  if (deps['vitest'] || ctx.files.has('vitest.config.ts') || ctx.files.has('vitest.config.js')) {
    tests.push({
      id: 'vitest',
      name: 'Vitest',
      category: 'testing',
      version: deps['vitest'],
      confidence: 'high',
      evidence: [{ source: 'package.json or vitest.config', message: 'Detected Vitest configuration or dependency' }]
    });
  }

  if (deps['jest'] || ctx.files.has('jest.config.ts') || ctx.files.has('jest.config.js')) {
    tests.push({
      id: 'jest',
      name: 'Jest',
      category: 'testing',
      version: deps['jest'],
      confidence: 'high',
      evidence: [{ source: 'package.json or jest.config', message: 'Detected Jest configuration or dependency' }]
    });
  }

  if (deps['playwright'] || deps['@playwright/test']) {
    tests.push({
      id: 'playwright',
      name: 'Playwright',
      category: 'testing',
      confidence: 'high',
      evidence: [{ source: 'package.json', message: 'Detected Playwright dependency' }]
    });
  }

  // Linters
  if (deps['eslint'] || Array.from(ctx.files.keys()).some(k => k.includes('eslint'))) {
    linters.push({
      id: 'eslint',
      name: 'ESLint',
      category: 'linting',
      version: deps['eslint'],
      confidence: 'high',
      evidence: [{ source: 'package.json or eslint config', message: 'Detected ESLint configuration or dependency' }]
    });
  }

  if (deps['oxlint'] || Array.from(ctx.files.keys()).some(k => k.includes('oxlint'))) {
    linters.push({
      id: 'oxlint',
      name: 'Oxlint',
      category: 'linting',
      version: deps['oxlint'],
      confidence: 'high',
      evidence: [{ source: 'package.json or oxlint config', message: 'Detected Oxlint' }]
    });
  }

  if (deps['@biomejs/biome'] || ctx.files.has('biome.json')) {
    linters.push({
      id: 'biome',
      name: 'Biome',
      category: 'linting',
      version: deps['@biomejs/biome'],
      confidence: 'high',
      evidence: [{ source: 'biome.json', message: 'Detected Biome' }]
    });
  }

  // Typecheckers
  if (deps['typescript'] || ctx.files.has('tsconfig.json')) {
    typecheckers.push({
      id: 'typescript',
      name: 'TypeScript',
      category: 'typechecking',
      version: deps['typescript'],
      confidence: 'high',
      evidence: [{ source: 'tsconfig.json', message: 'Detected TypeScript' }]
    });
  }

  return { tests, linters, typecheckers };
}
