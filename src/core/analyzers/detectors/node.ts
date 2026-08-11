import type { RepositoryFile } from '../../../lib/repositories/providers/githubPublic';
import type { ProjectIR, DetectedTechnology } from '../../project/types';

export interface DetectorContext {
  files: RepositoryFile[];
}

export function detectNodeEcosystem(ctx: DetectorContext, ir: ProjectIR): void {
  const pkgJsonFile = ctx.files.find(f => f.path === 'package.json');
  
  if (pkgJsonFile && pkgJsonFile.content) {
    ir.primaryLanguage = 'node';
    const tech: DetectedTechnology = {
      name: 'Node.js',
      ecosystem: 'node',
      evidence: ['Found package.json']
    };

    try {
      const pkg = JSON.parse(pkgJsonFile.content);
      if (pkg.engines && pkg.engines.node) {
        tech.version = pkg.engines.node;
        tech.evidence.push(`Engines specifies node ${pkg.engines.node}`);
      }
      
      // Frameworks
      const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
      
      if (allDeps['react']) ir.frameworks.push('react');
      if (allDeps['next']) ir.frameworks.push('nextjs');
      if (allDeps['vite']) ir.frameworks.push('vite');

      // Tests & Linting
      if (pkg.scripts) {
        if (pkg.scripts.test) ir.hasTests = true;
        if (pkg.scripts.lint) ir.hasLinting = true;
        if (pkg.scripts.typecheck || pkg.scripts['type-check']) ir.hasTypeChecking = true;
      }
    } catch {
      tech.evidence.push('package.json is invalid JSON');
    }

    ir.technologies.push(tech);

    // Package manager
    if (ctx.files.some(f => f.path === 'pnpm-lock.yaml')) ir.packageManager = 'pnpm';
    else if (ctx.files.some(f => f.path === 'yarn.lock')) ir.packageManager = 'yarn';
    else if (ctx.files.some(f => f.path === 'bun.lockb')) ir.packageManager = 'bun';
    else if (ctx.files.some(f => f.path === 'package-lock.json')) ir.packageManager = 'npm';
  }
}

export function detectCI(ctx: DetectorContext, ir: ProjectIR): void {
  const hasGitHubActions = ctx.files.some(f => f.path.startsWith('.github/workflows/'));
  const hasGitLabCI = ctx.files.some(f => f.path === '.gitlab-ci.yml');

  if (hasGitHubActions) ir.ciTool = 'github_actions';
  else if (hasGitLabCI) ir.ciTool = 'gitlab_ci';
}
