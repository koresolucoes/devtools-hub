import type { ProjectIR } from '../project/types';
import type { CheckResult } from './types';
import type { AnalysisContext } from './runChecks';

export function runSecurityChecks(ir: ProjectIR, context: AnalysisContext): CheckResult[] {
  const { vulnerabilities } = context;
  const results: CheckResult[] = [];

  // DEP001: Lockfile present (Wait, this is a dependency check, but let's put it here or skip for now)
  // The user wanted specific check results.

  if (vulnerabilities.length === 0) {
    // If we have dependencies and no vulnerabilities, it's a pass.
    if (ir.dependencies.length > 0) {
      results.push({
        id: 'SEC001-PASS',
        ruleId: 'SEC001',
        category: 'security',
        title: 'Known vulnerabilities scan',
        status: 'pass',
        weight: 100,
        confidence: 'high',
        evidence: [{ message: 'No known vulnerabilities found in resolved dependencies.', source: 'OSV' }]
      });
    } else {
      results.push({
        id: 'SEC001-NA',
        ruleId: 'SEC001',
        category: 'security',
        title: 'Known vulnerabilities scan',
        status: 'not-applicable',
        weight: 100,
        confidence: 'high',
        evidence: [{ message: 'No dependencies found to scan.', source: 'OSV' }]
      });
    }
    return results;
  }

  // Group vulnerabilities by package
  const packageVulns = new Map<string, typeof vulnerabilities>();
  for (const v of vulnerabilities) {
    if (!packageVulns.has(v.packageName)) {
      packageVulns.set(v.packageName, []);
    }
    packageVulns.get(v.packageName)!.push(v);
  }

  // Determine highest severity
  let highestSeverity: 'critical' | 'high' | 'medium' | 'low' | 'info' = 'low';
  const severityRank = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1, 'info': 0, 'unknown': 1 };
  
  for (const v of vulnerabilities) {
    const rank = severityRank[v.severity as keyof typeof severityRank] || 1;
    if (rank > severityRank[highestSeverity as keyof typeof severityRank]) {
      highestSeverity = v.severity as any;
    }
  }

  // Format evidence per package
  const evidences = Array.from(packageVulns.entries()).map(([pkg, vulns]) => {
    return {
      message: `${vulns.length} advisory(ies) found`,
      value: pkg,
      source: 'OSV',
      path: vulns[0].dev ? 'devDependencies' : 'dependencies'
    };
  });

  results.push({
    id: 'SEC001-FAIL',
    ruleId: 'SEC001',
    category: 'security',
    title: 'Known vulnerabilities scan',
    status: 'fail',
    weight: 100,
    confidence: 'high',
    evidence: evidences,
    finding: {
      id: `SECURITY001`,
      title: `${packageVulns.size} packages have known vulnerabilities (${vulnerabilities.length} advisories)`,
      description: 'The project uses dependencies with known security vulnerabilities.',
      severity: highestSeverity,
      category: 'security',
      impact: 'Attackers could potentially exploit these vulnerabilities if the affected code paths are reachable in your application.',
      remediation: {
        summary: 'Update affected dependencies to their safe versions.',
        steps: ['Run `npm audit fix` or manually update versions in package.json to the fixed versions.', 'Check the OSV database links for each advisory for specific remediation steps.']
      },
      evidence: evidences
    }
  });

  return results;
}
