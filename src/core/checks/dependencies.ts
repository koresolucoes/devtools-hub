import { ProjectIR } from '../project/types';
import { CheckResult } from './types';

export function runDependencyChecks(ir: ProjectIR): CheckResult[] {
  const results: CheckResult[] = [];

  const lockfiles = ir.packageManagers.flatMap(pm => 
    pm.evidence.filter(e => e.source.includes('lock'))
  );

  // DEP001: Lockfile exists
  if (lockfiles.length > 0) {
    results.push({
      id: 'DEP001',
      category: 'dependencies',
      status: 'pass',
      evidence: lockfiles.map(l => ({ source: l.source, message: 'Lockfile detected' }))
    });
  } else {
    results.push({
      id: 'DEP001',
      category: 'dependencies',
      status: 'fail',
      finding: {
        id: 'DEP001',
        title: 'Missing Lockfile',
        severity: 'high',
        description: 'No lockfile (e.g. package-lock.json, yarn.lock, poetry.lock) was found in the repository.',
        impact: 'Builds are non-deterministic and security scans may produce inaccurate results based on semver ranges.',
        remediation: 'Commit your package manager lockfile to version control.'
      }
    });
  }

  // DEP002: Declared dependencies resolve in lockfile
  // (We check if ir.dependencies contains direct dependencies with resolved versions)
  const directDeps = ir.dependencies.filter(d => d.direct);
  const unresolved = directDeps.filter(d => !d.resolvedVersion);

  if (directDeps.length === 0) {
    results.push({ id: 'DEP002', category: 'dependencies', status: 'not-applicable' });
  } else if (unresolved.length === 0) {
    results.push({
      id: 'DEP002',
      category: 'dependencies',
      status: 'pass',
      evidence: [{ source: 'dependencies', message: 'All direct dependencies are resolved' }]
    });
  } else if (unresolved.length > 0 && lockfiles.length > 0) {
    results.push({
      id: 'DEP002',
      category: 'dependencies',
      status: 'fail',
      finding: {
        id: 'DEP002',
        title: 'Unresolved Direct Dependencies',
        severity: 'moderate',
        description: `Found ${unresolved.length} direct dependencies not present in the lockfile (e.g., ${unresolved[0].name}).`,
        impact: 'The lockfile is out of sync with package manifests, potentially leading to build failures.',
        remediation: 'Run your package manager install command to regenerate the lockfile and commit it.'
      }
    });
  } else {
    results.push({ id: 'DEP002', category: 'dependencies', status: 'unknown' });
  }

  // DEP005: Lockfile format supported
  // (Currently our parser supports package-lock.json v2/v3, and partially others)
  const hasNpmLock = lockfiles.some(l => l.source === 'package-lock.json');
  if (hasNpmLock) {
    results.push({
      id: 'DEP005',
      category: 'dependencies',
      status: 'pass',
      evidence: [{ source: 'package-lock.json', message: 'Supported lockfile format detected' }]
    });
  } else {
    results.push({
      id: 'DEP005',
      category: 'dependencies',
      status: 'not-applicable'
    });
  }

  return results;
}
