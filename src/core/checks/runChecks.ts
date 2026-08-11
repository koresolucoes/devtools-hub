import type { ProjectIR } from '../project/types';
import type { CheckResult } from './types';
import type { DependencyVulnerability, SecurityScanSummary } from '../security/types';
import { runSecurityChecks } from './security';
import { runBuildChecks } from './build';
import { runQualityChecks } from './quality';
import { runArchitectureChecks } from './architecture';
import { runDependencyChecks } from './dependencies';
import { runDeploymentChecks } from './deployment';
import { runCIRules } from '../rules/ci';

export interface AnalysisContext {
  vulnerabilities: DependencyVulnerability[];
  securitySummary: SecurityScanSummary;
}

export function runChecks(ir: ProjectIR, context: AnalysisContext): CheckResult[] {
  const results: CheckResult[] = [];

  // Run new explicit checks
  results.push(...runSecurityChecks(ir, context));
  results.push(...runQualityChecks(ir));
  results.push(...runArchitectureChecks(ir));
  results.push(...runDependencyChecks(ir));
  results.push(...runDeploymentChecks(ir));
  results.push(...runBuildChecks(ir));

  // Legacy rules being converted
  results.push(...runCIRules(ir));

  return results;
}
