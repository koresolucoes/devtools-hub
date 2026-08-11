import type { ProjectIR } from '../project/types';
import type { CheckResult } from './types';
import type { AnalysisContext } from './runChecks';

export function runSecurityChecks(ir: ProjectIR, context: AnalysisContext): CheckResult[] {
  const { vulnerabilities, securitySummary } = context;
  const results: CheckResult[] = [];

  // SEC001: Dependency vulnerability scan completed.
  if (ir.dependencies.length > 0) {
    let status: 'pass' | 'fail' | 'unknown' = 'unknown';
    if (securitySummary.status === 'complete') status = 'pass';
    else if (securitySummary.status === 'failed') status = 'fail';

    results.push({
      id: 'SEC001',
      category: 'security',
      status,
      evidence: [{ source: 'OSV', message: `Scan status: ${securitySummary.status}. Scanned ${securitySummary.queriedDependencies} of ${securitySummary.resolvedDependencies} resolved dependencies.` }]
    });
  } else {
    results.push({ id: 'SEC001', category: 'security', status: 'not-applicable' });
  }

  if (ir.dependencies.length === 0 || securitySummary.status === 'failed') {
    return results;
  }

  // Group vulnerabilities to analyze severity
  let hasCriticalProd = false;
  let hasHighProd = false;
  let hasCriticalOrHighDirect = false;

  let criticalProdCount = 0;
  let highProdCount = 0;
  let criticalDevCount = 0;
  let directAffectedCount = 0;
  let transitiveAffectedCount = 0;

  const packageVulns = new Map<string, typeof vulnerabilities>();

  for (const v of vulnerabilities) {
    const key = `${v.packageName}@${v.resolvedVersion || 'unknown'}`;
    if (!packageVulns.has(key)) {
      packageVulns.set(key, []);
      if (v.direct) directAffectedCount++;
      else transitiveAffectedCount++;
    }
    packageVulns.get(key)!.push(v);

    const isProd = !v.dev;
    const isDirect = v.direct;

    if (v.severity === 'critical') {
      if (isProd) {
        hasCriticalProd = true;
        criticalProdCount++;
      } else {
        criticalDevCount++;
      }
      if (isDirect) hasCriticalOrHighDirect = true;
    } else if (v.severity === 'high') {
      if (isProd) {
        hasHighProd = true;
        highProdCount++;
      }
      if (isDirect) hasCriticalOrHighDirect = true;
    }
  }

  // SEC002: No critical production advisories.
  results.push({ id: 'SEC002', category: 'security', status: hasCriticalProd ? 'fail' : 'pass' });

  // SEC003: No high production advisories.
  results.push({ id: 'SEC003', category: 'security', status: hasHighProd ? 'fail' : 'pass' });

  // SEC004: No critical/high direct dependency advisories.
  results.push({ id: 'SEC004', category: 'security', status: hasCriticalOrHighDirect ? 'fail' : 'pass' });

  // Create a master summary finding if there are vulnerabilities
  if (vulnerabilities.length > 0) {
    let highestSeverity: 'critical' | 'high' | 'moderate' | 'low' | 'unknown' = 'unknown';
    const severityRank = { 'critical': 4, 'high': 3, 'moderate': 2, 'low': 1, 'unknown': 0 };
    
    for (const v of vulnerabilities) {
      const rank = severityRank[v.severity as keyof typeof severityRank] || 0;
      if (rank > severityRank[highestSeverity as keyof typeof severityRank]) {
        highestSeverity = v.severity as any;
      }
    }

    const description = `
Dependency Security

${securitySummary.affectedPackageVersions} affected package versions
${securitySummary.advisories} advisories

Breakdown:
- ${criticalProdCount} critical production
- ${highProdCount} high production
- ${criticalDevCount} critical development
- ${directAffectedCount} vulnerable direct dependencies
- ${transitiveAffectedCount} vulnerable transitive dependencies
    `.trim();

    results.push({
      id: 'SEC_SUMMARY',
      category: 'security',
      status: 'fail', // Map the aggregate to a failure so the finding appears
      finding: {
        id: 'DEPENDENCY_SECURITY',
        title: 'Dependency Security Vulnerabilities',
        category: 'security',
        description,
        severity: highestSeverity,
        impact: 'Varies by advisory. Review affected packages.',
        remediation: 'Update affected dependencies to their safe versions.'
      }
    });
  }

  return results;
}
