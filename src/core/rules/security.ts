import type { Rule, Finding, RuleContext } from './types';
import type { ProjectIR, Evidence } from '../project/types';

export const SECURITY001: Rule = {
  id: 'SECURITY001',
  name: 'Known vulnerable direct dependency',
  description: 'The project depends on packages with known critical or high vulnerabilities.',
  severity: 'critical',
  category: 'security',
  evaluate: (_ir: ProjectIR, context?: RuleContext): Finding | null => {
    if (!context?.vulnerabilities || context.vulnerabilities.length === 0) return null;

    const criticalOrHigh = context.vulnerabilities.filter(
      v => v.severity === 'critical' || v.severity === 'high'
    );

    if (criticalOrHigh.length === 0) return null;

    const evidence: Evidence[] = criticalOrHigh.map(v => ({
      source: 'OSV Scanner',
      file: v.ecosystem === 'npm' ? 'package.json' : 'requirements.txt',
      message: `${v.packageName}@${v.installedVersion} has ${v.severity.toUpperCase()} vulnerability: ${v.id}`,
      value: `${v.packageName}@${v.installedVersion}`
    }));

    const instructions = criticalOrHigh.map(v => 
      v.fixedVersion 
        ? `Update ${v.packageName} to version ${v.fixedVersion} to resolve ${v.id}.`
        : `Monitor or replace ${v.packageName} (no fix available for ${v.id}).`
    );

    return {
      id: 'F-SEC-001',
      ruleId: 'SECURITY001',
      severity: 'critical',
      category: 'security',
      title: `Critical supply-chain vulnerabilities found in ${criticalOrHigh.length} packages`,
      description: 'Your project relies on dependencies with publicly disclosed critical or high severity vulnerabilities. This poses a significant security risk.',
      evidence,
      impact: 'Attackers could exploit these vulnerabilities to compromise the application, exfiltrate data, or execute arbitrary code.',
      confidence: 'high',
      remediation: {
        summary: 'Update the vulnerable dependencies to their patched versions.',
        type: 'dependency-change',
        affectedFiles: [...new Set(evidence.map(e => e.file).filter((f): f is string => !!f))],
        instructions,
        verification: [
          'Run `npm audit` or equivalent to verify dependencies.',
          'Re-run DevsHub analysis to ensure the score improves.'
        ]
      }
    };
  }
};
