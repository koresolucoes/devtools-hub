import { ProjectIR } from '../project/types';
import { CheckResult } from './types';

export function runArchitectureChecks(ir: ProjectIR): CheckResult[] {
  const results: CheckResult[] = [];

  // ARCH001: Package manager conflict
  // We check if we have multiple package manager lockfiles
  const lockfiles = new Set<string>();
  
  for (const pm of ir.packageManagers) {
    for (const ev of pm.evidence) {
      if (['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'bun.lock', 'bun.lockb'].includes(ev.source)) {
        lockfiles.add(ev.source);
      }
    }
  }

  if (lockfiles.size > 1) {
    const lockfileList = Array.from(lockfiles).join(' and ');
    results.push({
      id: 'ARCH001',
      category: 'architecture',
      status: 'fail',
      finding: {
        id: 'ARCH001',
        title: 'Multiple Package Manager Lockfiles',
        severity: 'medium',
        description: `Found conflicting root lockfiles: ${lockfileList}.`,
        impact: 'Different environments may resolve dependencies using different package managers, producing inconsistent dependency graphs.',
        remediation: 'Choose one package manager as canonical, remove stale lockfiles only after verifying project workflow.'
      },
      evidence: Array.from(lockfiles).map(l => ({ source: l, message: `Found ${l}` }))
    });
  } else if (lockfiles.size === 1) {
    results.push({
      id: 'ARCH001',
      category: 'architecture',
      status: 'pass'
    });
  } else {
    results.push({
      id: 'ARCH001',
      category: 'architecture',
      status: 'not-applicable'
    });
  }

  // ARCH003: Framework/build-tool combination understood.
  if (ir.frameworks.length > 0) {
    const frameworks = ir.frameworks.filter(f => f.category === 'framework');
    const buildTools = ir.frameworks.filter(f => f.category === 'buildTool');
    
    if (frameworks.length > 0 && buildTools.length > 0) {
      results.push({
        id: 'ARCH003',
        category: 'architecture',
        status: 'pass',
        evidence: [
          { source: frameworks[0].name, message: 'Detected Framework' },
          { source: buildTools[0].name, message: 'Detected Build Tool' }
        ]
      });
    } else {
      results.push({
        id: 'ARCH003',
        category: 'architecture',
        status: 'unknown'
      });
    }
  }

  return results;
}
