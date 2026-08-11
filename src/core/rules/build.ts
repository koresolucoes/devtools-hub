import type { ProjectIR } from '../project/types';
import type { CheckResult } from '../checks/types';

export function runBuildRules(ir: ProjectIR): CheckResult[] {
  const results: CheckResult[] = [];
  const needsBuild = ir.frameworks.some(f => ['nextjs', 'vite', 'react', 'vue', 'svelte', 'nuxt'].includes(f.id));

  if (needsBuild) {
    if (!ir.scripts || !ir.scripts['build']) {
      results.push({
        id: `BUILD001-FAIL`,
        ruleId: 'BUILD001',
        title: 'Missing Build Script',
        category: 'build',
        status: 'fail',
        weight: 100,
        confidence: 'high',
        evidence: [{
          source: 'ProjectIR',
          message: 'Frontend framework detected but no build script found in manifest'
        }],
        finding: {
          id: 'BUILD001',
          title: 'Missing Build Script',
          description: 'A frontend framework was detected, but no "build" script is configured in package.json.',
          severity: 'high',
          category: 'build',
          impact: 'The project cannot be compiled for production deployment.',
          remediation: {
            summary: 'Add a build script to package.json for your framework.',
            steps: ['Add "build" script mapped to your framework builder (e.g. "next build" or "vite build")']
          },
          evidence: [{
            source: 'ProjectIR',
            message: 'Frontend framework detected but no build script found in manifest'
          }]
        }
      });
    } else {
      results.push({
        id: `BUILD001-PASS`,
        ruleId: 'BUILD001',
        title: 'Build Script configured',
        category: 'build',
        status: 'pass',
        weight: 100,
        confidence: 'high',
        evidence: [{
          source: 'ProjectIR',
          message: 'Build script found for frontend framework'
        }]
      });
    }
  } else {
    results.push({
      id: `BUILD001-NA`,
      ruleId: 'BUILD001',
      title: 'Build Script',
      category: 'build',
      status: 'not-applicable',
      weight: 0,
      confidence: 'high',
      evidence: [{
        source: 'ProjectIR',
        message: 'No frontend framework detected requiring a build script'
      }]
    });
  }

  return results;
}
