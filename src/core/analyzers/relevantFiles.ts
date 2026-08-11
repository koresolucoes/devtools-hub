/**
 * Defines which files DevsHub needs to fetch to analyze a repository accurately.
 */
export const RELEVANT_FILE_PATTERNS = [
  'package.json',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  'bun.lockb',
  'requirements.txt',
  'pyproject.toml',
  'Pipfile',
  'Pipfile.lock',
  '.github/workflows/*.yml',
  '.github/workflows/*.yaml',
  '.gitlab-ci.yml',
  'Dockerfile',
  'docker-compose.yml',
  'docker-compose.yaml',
  'vitest.config.ts',
  'vitest.config.js',
  'jest.config.js',
  'jest.config.ts',
  'tsconfig.json',
  '.eslintrc.js',
  '.eslintrc.json',
  'eslint.config.js'
];
