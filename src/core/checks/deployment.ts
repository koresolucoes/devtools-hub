import { ProjectIR } from '../project/types';
import { CheckResult } from './types';

export function runDeploymentChecks(ir: ProjectIR): CheckResult[] {
  const results: CheckResult[] = [];
  const deployments = ir.infrastructure.deployments;

  // DEPLOY001: Deployment target detected
  if (deployments.length > 0) {
    results.push({
      id: 'DEPLOY001',
      category: 'deployment',
      status: 'pass',
      evidence: deployments.map(d => ({ source: d.evidence[0]?.source || 'config', message: `Detected ${d.name}` }))
    });
  } else {
    results.push({ id: 'DEPLOY001', category: 'deployment', status: 'not-applicable' });
  }

  // DEPLOY002: Build capability detected
  if (deployments.length > 0) {
    const hasBuildScript = Object.keys(ir.scripts).some(k => k.includes('build'));
    const hasBuildTool = ir.languages.some(l => l.category === 'buildTool') || ir.frameworks.some(f => f.category === 'buildTool' || f.name === 'Vite' || f.name === 'Webpack');
    
    if (hasBuildScript || hasBuildTool) {
      results.push({
        id: 'DEPLOY002',
        category: 'deployment',
        status: 'pass',
        evidence: [{ source: 'package.json/frameworks', message: 'Build capability detected' }]
      });
    } else {
      results.push({
        id: 'DEPLOY002',
        category: 'deployment',
        status: 'fail',
        finding: {
          id: 'DEPLOY002',
          title: 'Missing Build Configuration for Deployment',
          category: 'deployment',
          severity: 'moderate',
          description: 'A deployment target was detected, but no build script or build tool was found.',
          impact: 'Deployments may fail if the platform cannot build the project.',
          remediation: 'Ensure a build script is defined if required by your deployment platform.'
        }
      });
    }
  } else {
    results.push({ id: 'DEPLOY002', category: 'deployment', status: 'not-applicable' });
  }

  // DEPLOY003: Deployment config parseable
  if (deployments.length > 0) {
    const parseableEvidence = deployments.flatMap(d => d.evidence.filter(e => e.message.includes('valid') || e.message.includes('parsed') || !e.message.includes('error')));
    if (parseableEvidence.length > 0) {
      results.push({
        id: 'DEPLOY003',
        category: 'deployment',
        status: 'pass',
        evidence: [{ source: 'analyzer', message: 'Deployment configuration is parseable' }]
      });
    } else {
      results.push({ id: 'DEPLOY003', category: 'deployment', status: 'unknown' });
    }
  } else {
    results.push({ id: 'DEPLOY003', category: 'deployment', status: 'not-applicable' });
  }

  // DEPLOY004: Expected environment declarations available
  if (deployments.length > 0) {
    if (ir.environment.declaredVariables.length > 0) {
      results.push({
        id: 'DEPLOY004',
        category: 'deployment',
        status: 'pass',
        evidence: [{ source: 'environment', message: `Found ${ir.environment.declaredVariables.length} environment declarations` }]
      });
    } else {
      results.push({ id: 'DEPLOY004', category: 'deployment', status: 'unknown' });
    }
  } else {
    results.push({ id: 'DEPLOY004', category: 'deployment', status: 'not-applicable' });
  }

  // DEPLOY005: Runtime/platform combination recognized
  if (deployments.length > 0) {
    if (ir.runtimes.length > 0 || ir.frameworks.length > 0) {
      results.push({
        id: 'DEPLOY005',
        category: 'deployment',
        status: 'pass',
        evidence: [{ source: 'analyzer', message: 'Runtime/platform combination recognized' }]
      });
    } else {
      results.push({ id: 'DEPLOY005', category: 'deployment', status: 'unknown' });
    }
  } else {
    results.push({ id: 'DEPLOY005', category: 'deployment', status: 'not-applicable' });
  }

  return results;
}
