import type { ProjectIR } from '../project/types';

export type Severity = 'critical' | 'high' | 'moderate' | 'low' | 'info';

export interface Finding {
  ruleId: string;
  title: string;
  description: string;
  severity: Severity;
  evidence: string;
  remediation?: string;
}

export interface Rule {
  id: string;
  name: string;
  description: string;
  severity: Severity;
  evaluate: (ir: ProjectIR) => Finding | null;
}
