import type { ProjectIR } from '../project/types';
import type { CheckResult } from './types';
import type { AnalysisContext } from './runChecks';

export function runSecurityChecks(ir: ProjectIR, context: AnalysisContext): CheckResult[] {
  const { vulnerabilities } = context;
  const results: CheckResult[] = [];

  // SEC001: Dependency vulnerability scan completed.
  if (ir.dependencies.length > 0) {
    results.push({
      id: 'SEC001',
      category: 'security',
      status: 'pass',
      evidence: [{ source: 'OSV', message: `Scanned ${ir.dependencies.length} dependencies.` }]
    });
  } else {
    results.push({ id: 'SEC001', category: 'security', status: 'not-applicable' });
  }

  if (ir.dependencies.length === 0) {
    return results;
  }

  // Group vulnerabilities to analyze severity
  let hasCriticalProd = false;
  let hasHighProd = false;
  let hasCriticalOrHighDirect = false;

  const packageVulns = new Map<string, typeof vulnerabilities>();

  for (const v of vulnerabilities) {
    // Unique key: package@version
    const key = `${v.packageName}@${v.resolvedVersion || 'unknown'}`;
    if (!packageVulns.has(key)) {
      packageVulns.set(key, []);
    }
    packageVulns.get(key)!.push(v);

    const isProd = !v.dev;
    const isDirect = v.direct;

    if (v.severity === 'critical') {
      if (isProd) hasCriticalProd = true;
      if (isDirect && (v.severity === 'critical' || v.severity === 'high')) hasCriticalOrHighDirect = true;
    } else if (v.severity === 'high') {
      if (isProd) hasHighProd = true;
      if (isDirect) hasCriticalOrHighDirect = true;
    }
  }

  // SEC002: No critical production advisories.
  if (hasCriticalProd) {
    results.push({
      id: 'SEC002',
      category: 'security',
      status: 'fail',
      finding: {
        id: 'SEC002',
        title: 'Critical Production Vulnerabilities',
        severity: 'critical',
        description: 'Critical vulnerabilities were found in production dependencies.',
        impact: 'Attackers can likely compromise the production application.',
        remediation: 'Immediately update the affected production dependencies to patched versions.'
      }
    });
  } else {
    results.push({ id: 'SEC002', category: 'security', status: 'pass' });
  }

  // SEC003: No high production advisories.
  if (hasHighProd) {
    results.push({
      id: 'SEC003',
      category: 'security',
      status: 'fail',
      finding: {
        id: 'SEC003',
        title: 'High Production Vulnerabilities',
        severity: 'high',
        description: 'High severity vulnerabilities were found in production dependencies.',
        impact: 'Elevated risk of production exploit.',
        remediation: 'Update the affected production dependencies.'
      }
    });
  } else {
    results.push({ id: 'SEC003', category: 'security', status: 'pass' });
  }

  // SEC004: No critical/high direct dependency advisories.
  if (hasCriticalOrHighDirect) {
    results.push({
      id: 'SEC004',
      category: 'security',
      status: 'fail',
      finding: {
        id: 'SEC004',
        title: 'Direct Dependency Vulnerabilities',
        severity: 'high',
        description: 'Critical or High severity vulnerabilities were found in direct dependencies.',
        impact: 'Directly imported code is vulnerable, increasing exploitability risk.',
        remediation: 'Update the direct dependencies in your package.json.'
      }
    });
  } else {
    results.push({ id: 'SEC004', category: 'security', status: 'pass' });
  }

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

    const evidences = Array.from(packageVulns.entries()).map(([pkgKey, vulns]) => {
      // pkgKey is "name@version"
      const isProd = vulns.some(v => !v.dev);
      const isDirect = vulns.some(v => v.direct);
      return {
        message: `${vulns.length} advisory(ies)`,
        value: pkgKey,
        source: 'OSV',
        path: `${isProd ? 'Production' : 'Development'} · ${isDirect ? 'Direct' : 'Transitive'}`
      };
    });

    // We push a 'not-applicable' check status, but attach the summary finding.
    // This allows it to show in the UI without artificially skewing the numeric score further.
    results.push({
      id: 'SEC_SUMMARY',
      category: 'security',
      status: 'unknown',
      finding: {
        id: 'SECURITY_SUMMARY',
        title: `${packageVulns.size} affected package versions (${vulnerabilities.length} advisories)`,
        description: 'The project uses dependencies with known security vulnerabilities.',
        severity: highestSeverity,
        impact: 'Varies by advisory. Review affected packages.',
        remediation: 'Update affected dependencies to their safe versions.',
        evidence: evidences
      }
    });
  }

  return results;
}
