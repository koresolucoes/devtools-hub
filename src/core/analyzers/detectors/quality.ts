import { DetectedTechnology } from '../../project/types';
import { DetectorContext } from './types';
import { classifyPackageScript } from '../../scripts/classifyScript';

export function detectQualityTools(ctx: DetectorContext): { 
  tests: { tools: DetectedTechnology[], commands: string[], files: string[] }, 
  linters: DetectedTechnology[], 
  typecheckers: DetectedTechnology[] 
} {
  const tools: DetectedTechnology[] = [];
  const linters: DetectedTechnology[] = [];
  const typecheckers: DetectedTechnology[] = [];
  const testCommands: string[] = [];
  const testFiles: string[] = [];

  let deps: Record<string, string> = {};
  const packageJson = ctx.files.get('package.json');
  if (packageJson?.content) {
    try {
      const pkg = JSON.parse(packageJson.content);
      deps = { ...pkg.dependencies, ...pkg.devDependencies };
      
      if (pkg.scripts) {
        for (const [name, cmd] of Object.entries(pkg.scripts)) {
          const classification = classifyPackageScript(name, cmd as string);
          if (classification === 'test') {
            testCommands.push(cmd as string);
            
            // Check for Node native test runner
            if ((cmd as string).includes('node --test')) {
              tools.push({
                id: 'node-test-runner',
                name: 'Node.js Test Runner',
                category: 'testing',
                confidence: 'high',
                evidence: [{ source: 'package.json', message: 'Detected node --test command' }]
              });
            }
          }
        }
      }
    } catch (e) {
      // ignore
    }
  }

  // Find test files based on tree
  for (const file of ctx.tree) {
    const p = file.path;
    if (
      p.match(/\.test\.(js|jsx|ts|tsx|mjs|cjs)$/) || 
      p.match(/\.spec\.(js|jsx|ts|tsx|mjs|cjs)$/) ||
      p.includes('/tests/') || 
      p.includes('/__tests__/') || 
      p.includes('/test/')
    ) {
      if (!p.includes('node_modules')) {
        testFiles.push(p);
      }
    }
  }

  // Tools
  if (deps['vitest'] || ctx.files.has('vitest.config.ts') || ctx.files.has('vitest.config.js')) {
    tools.push({
      id: 'vitest',
      name: 'Vitest',
      category: 'testing',
      version: deps['vitest'],
      confidence: 'high',
      evidence: [{ source: 'package.json or vitest.config', message: 'Detected Vitest configuration or dependency' }]
    });
  }

  if (deps['jest'] || ctx.files.has('jest.config.ts') || ctx.files.has('jest.config.js')) {
    tools.push({
      id: 'jest',
      name: 'Jest',
      category: 'testing',
      version: deps['jest'],
      confidence: 'high',
      evidence: [{ source: 'package.json or jest.config', message: 'Detected Jest configuration or dependency' }]
    });
  }

  if (deps['playwright'] || deps['@playwright/test']) {
    tools.push({
      id: 'playwright',
      name: 'Playwright',
      category: 'testing',
      confidence: 'high',
      evidence: [{ source: 'package.json', message: 'Detected Playwright dependency' }]
    });
  }
  
  if (deps['cypress']) {
    tools.push({
      id: 'cypress',
      name: 'Cypress',
      category: 'testing',
      confidence: 'high',
      evidence: [{ source: 'package.json', message: 'Detected Cypress' }]
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

  // Python Linters from requirements
  const req = ctx.files.get('requirements.txt')?.content || '';
  if (req.includes('ruff')) {
    linters.push({ id: 'ruff', name: 'Ruff', category: 'linting', confidence: 'high', evidence: [{ source: 'requirements.txt', message: 'Detected Ruff' }] });
  }
  if (req.includes('flake8')) {
    linters.push({ id: 'flake8', name: 'Flake8', category: 'linting', confidence: 'high', evidence: [{ source: 'requirements.txt', message: 'Detected Flake8' }] });
  }
  if (req.includes('pylint')) {
    linters.push({ id: 'pylint', name: 'Pylint', category: 'linting', confidence: 'high', evidence: [{ source: 'requirements.txt', message: 'Detected Pylint' }] });
  }
  if (req.includes('pytest')) {
    tools.push({ id: 'pytest', name: 'Pytest', category: 'testing', confidence: 'high', evidence: [{ source: 'requirements.txt', message: 'Detected Pytest' }] });
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
  
  if (req.includes('mypy')) {
    typecheckers.push({ id: 'mypy', name: 'Mypy', category: 'typechecking', confidence: 'high', evidence: [{ source: 'requirements.txt', message: 'Detected Mypy' }] });
  }

  return { tests: { tools, commands: testCommands, files: testFiles }, linters, typecheckers };
}
