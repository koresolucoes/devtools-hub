import type { ProjectIR } from '../project/types';
import type { CheckResult } from './types';
import type { DependencyVulnerability } from '../security/types';
import { runSecurityChecks } from './security';
import { runCIRules } from '../rules/ci';
import { runBuildRules } from '../rules/build';
import { runQualityRules } from '../rules/quality';

export interface AnalysisContext {
  vulnerabilities: DependencyVulnerability[];
}

export function runChecks(ir: ProjectIR, context: AnalysisContext): CheckResult[] {
  const results: CheckResult[] = [];

  // Run new explicit checks
  results.push(...runSecurityChecks(ir, context));

  // Run legacy rules that we adapt to return CheckResult or Finding
  // Temporarily, we will wrap legacy Finding[] into CheckResult[] inside the rule itself.
  
  // Actually, we should refactor them to return CheckResult[] directly.
  // For now, let's assume they return CheckResult[].
  results.push(...runCIRules(ir));
  results.push(...runBuildRules(ir));
  results.push(...runQualityRules(ir));

  return results;
}
