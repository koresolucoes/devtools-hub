import { ProjectFileSummary } from '../project/types';
import { minimatch } from 'minimatch';

/**
 * Defines which files DevsHub needs to fetch to analyze a repository accurately.
 */
export const RELEVANT_FILE_PATTERNS = [
  // NODE
  'package.json',
  'package-lock.json',
  'pnpm-lock.yaml',
  'yarn.lock',
  'bun.lock',
  'bun.lockb',

  // PYTHON
  'requirements.txt',
  'pyproject.toml',
  'uv.lock',
  'poetry.lock',
  'Pipfile',
  'Pipfile.lock',

  // DOCKER
  'Dockerfile',
  'Dockerfile.*',
  'docker-compose.yml',
  'docker-compose.yaml',
  'compose.yml',
  'compose.yaml',

  // CI
  '.github/workflows/*.yml',
  '.github/workflows/*.yaml',
  '.gitlab-ci.yml',

  // DEPLOYMENT
  'vercel.json',
  'netlify.toml',
  'railway.json',
  'render.yaml',

  // LANGUAGE / BUILD
  'tsconfig.json',
  'jsconfig.json',
  'vite.config.*',
  'next.config.*',

  // QUALITY
  'eslint.*',
  'oxlint*',
  'biome.*',
  'prettier.*',
  'vitest.*',
  'jest.*',
  'playwright.*',
  'cypress.*',

  // RUNTIME
  '.nvmrc',
  '.node-version',
  '.python-version',

  // ENVIRONMENT
  '.env.example',
  '.env.template',
  '.env.sample',

  // AI / AGENT
  'AGENTS.md',
  'CLAUDE.md',
  '.github/agents/**',
  '.github/skills/**',
  '.agents/**',
  '.claude/**'
];

export function filterRelevantFiles(tree: ProjectFileSummary[]): ProjectFileSummary[] {
  return tree.filter(file => {
    // Prohibited files
    if (
      file.path.includes('node_modules/') ||
      file.path.includes('dist/') ||
      file.path.includes('build/') ||
      file.path.includes('coverage/') ||
      file.path.includes('vendor/') ||
      file.path.includes('.git/') ||
      file.path.endsWith('.pem') ||
      file.path.endsWith('.key') ||
      file.path.includes('id_rsa') ||
      file.path.includes('id_ed25519') ||
      file.path.includes('credentials') ||
      file.path.startsWith('secrets.') ||
      // Exclude real env files (allow .env.example etc which are in the patterns)
      (file.path.includes('.env') && !file.path.endsWith('.example') && !file.path.endsWith('.template') && !file.path.endsWith('.sample'))
    ) {
      return false;
    }

    return RELEVANT_FILE_PATTERNS.some(pattern => minimatch(file.path, pattern, { matchBase: true }));
  });
}
