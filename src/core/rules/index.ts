import { QUALITY001, QUALITY002 } from './quality';
import { CI001, CI002, CI003 } from './ci';
import { BUILD001 } from './build';
import { SECURITY001 } from './security';
import type { Rule, Finding, RuleContext } from './types';
import type { ProjectIR } from '../project/types';

export * from './types';

export const RULE_PACK: Rule[] = [
  QUALITY001,
  QUALITY002,
  CI001,
  CI002,
  CI003,
  BUILD001,
  SECURITY001
];

export function runRules(ir: ProjectIR, context?: RuleContext): Finding[] {
  const findings: Finding[] = [];
  
  for (const rule of RULE_PACK) {
    try {
      const result = rule.evaluate(ir, context);
      if (result) {
        findings.push(result);
      }
    } catch (e) {
      // Rule failed to evaluate safely. We log and ignore to prevent engine crash.
      console.warn(`Rule ${rule.id} failed to evaluate:`, e);
    }
  }

  return findings;
}
