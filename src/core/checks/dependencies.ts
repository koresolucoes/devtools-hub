import { ProjectIR } from '../project/types';
import { CheckResult } from './types';

export function runDependencyChecks(ir: ProjectIR): CheckResult[] {
  const results: CheckResult[] = [];

  const lockfiles = ir.packageManagers.flatMap(pm => 
    pm.evidence.filter(e => e.source.includes('lock') || e.source.includes('yarn.lock') || e.source.includes('pnpm-lock.yaml') || e.source.includes('bun.lockb'))
  );

  const explicitIntent = ir.packageManagers.flatMap(pm => 
    pm.evidence.filter(e => e.source === 'package.json#packageManager')
  );

  // DEP003: Canonical package manager determined
  const hasMultipleLocks = lockfiles.length > 1;
  const hasExplicitIntent = explicitIntent.length > 0;
  
  if (hasExplicitIntent) {
    results.push({
      id: 'DEP003',
      category: 'dependencies',
      status: 'pass',
      evidence: [{ source: 'package.json', message: 'Canonical package manager specified', value: explicitIntent[0].value }]
    });
  } else if (hasMultipleLocks) {
    results.push({
      id: 'DEP003',
      category: 'dependencies',
      status: 'fail',
      finding: {
        id: 'DEP003',
        title: 'Ambiguous Package Manager',
        category: 'dependencies',
        severity: 'high',
        description: 'Multiple lockfiles were found and no packageManager field was set in package.json to establish canonical intent.',
        impact: 'Dependency resolution may vary across environments, causing non-deterministic builds.',
        remediation: 'Set the "packageManager" field in package.json (e.g. "packageManager": "npm@10.0.0").'
      }
    });
  } else if (lockfiles.length === 1) {
    results.push({
      id: 'DEP003',
      category: 'dependencies',
      status: 'pass',
      evidence: [{ source: lockfiles[0].source, message: 'Canonical package manager inferred from lockfile' }]
    });
  } else {
    results.push({ id: 'DEP003', category: 'dependencies', status: 'unknown' });
  }

  // DEP004: No conflicting root dependency graphs
  if (hasMultipleLocks) {
    results.push({
      id: 'DEP004',
      category: 'dependencies',
      status: 'fail',
      finding: {
        id: 'DEP004',
        title: 'Conflicting Dependency Graphs',
        category: 'dependencies',
        severity: 'moderate',
        description: 'Multiple lockfiles exist in the repository (e.g., package-lock.json and bun.lockb).',
        impact: 'Updates in one package manager may not sync to the other, creating hidden dependency skew.',
        remediation: 'Delete the unused lockfiles and standardise on a single package manager.'
      }
    });
  } else {
    results.push({
      id: 'DEP004',
      category: 'dependencies',
      status: lockfiles.length === 1 ? 'pass' : 'not-applicable'
    });
  }

  // DEP005: Canonical lockfile format supported
  const hasNpmLock = lockfiles.some(l => l.source === 'package-lock.json');
  if (hasNpmLock || hasExplicitIntent && explicitIntent[0].value?.includes('npm')) {
    results.push({
      id: 'DEP005',
      category: 'dependencies',
      status: 'pass',
      evidence: [{ source: 'parser', message: 'Canonical lockfile parser supported' }]
    });
  } else if (lockfiles.length > 0) {
    results.push({
      id: 'DEP005',
      category: 'dependencies',
      status: 'unknown',
      finding: {
        id: 'DEP005',
        title: 'Unsupported Lockfile Format',
        category: 'dependencies',
        severity: 'medium',
        description: 'The canonical package manager lockfile format is not fully supported for exact dependency graph extraction.',
        impact: 'Deep security and dependency analysis coverage will be reduced.',
        remediation: 'Currently, package-lock.json provides the highest analysis fidelity.'
      }
    });
  } else {
    results.push({ id: 'DEP005', category: 'dependencies', status: 'not-applicable' });
  }

  // DEP006: Direct dependency resolution coverage
  const directDeps = ir.dependencies.filter(d => d.direct);
  const unresolved = directDeps.filter(d => !d.resolvedVersion);

  if (directDeps.length === 0) {
    results.push({ id: 'DEP006', category: 'dependencies', status: 'not-applicable' });
  } else if (unresolved.length === 0) {
    results.push({
      id: 'DEP006',
      category: 'dependencies',
      status: 'pass',
      evidence: [{ source: 'dependencies', message: 'All direct dependencies are resolved' }]
    });
  } else if (lockfiles.length > 0) {
    results.push({
      id: 'DEP006',
      category: 'dependencies',
      status: 'fail',
      finding: {
        id: 'DEP006',
        title: 'Unresolved Direct Dependencies',
        category: 'dependencies',
        severity: 'high',
        description: `Found ${unresolved.length} direct dependencies not present in the lockfile (e.g., ${unresolved[0].name}).`,
        impact: 'The lockfile is out of sync with package manifests, potentially leading to build failures.',
        remediation: 'Run your package manager install command to regenerate the lockfile and commit it.'
      }
    });
  } else {
    results.push({ id: 'DEP006', category: 'dependencies', status: 'unknown' });
  }

  return results;
}
