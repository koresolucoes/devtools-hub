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
    results.push({
      id: 'DEPLOY001',
      category: 'deployment',
      status: 'not-applicable'
    });
  }

  // If there are deployments, run further checks. Otherwise, they are N/A.
  if (deployments.length > 0) {
    const hasBuildScript = Object.keys(ir.scripts).some(k => k.includes('build'));
    
    // DEPLOY002: Build command exists
    if (hasBuildScript || ir.frameworks.some(f => f.category === 'buildTool')) {
      results.push({
        id: 'DEPLOY002',
        category: 'deployment',
        status: 'pass',
        evidence: [{ source: 'package.json scripts or buildTool', message: 'Build command or tool detected' }]
      });
    } else {
      results.push({
        id: 'DEPLOY002',
        category: 'deployment',
        status: 'fail',
        finding: {
          id: 'DEPLOY002',
          title: 'Missing Build Configuration for Deployment',
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

  return results;
}
