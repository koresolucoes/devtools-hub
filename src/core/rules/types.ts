import type { ProjectIR, Evidence, Confidence } from '../project/types';

export type FindingSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type FindingCategory = 'build' | 'security' | 'quality' | 'ci' | 'deployment' | 'environment' | 'maintainability';

export interface Remediation {
  summary: string;
  type: 'instruction' | 'file-create' | 'file-update' | 'dependency-change' | 'workflow-change';
  affectedFiles: string[];
  instructions: string[];
  verification: string[];
}

export interface Finding {
  id: string;
  ruleId: string;
  severity: FindingSeverity;
  category: FindingCategory;
  title: string;
  description: string;
  evidence: Evidence[];
  impact: string;
  confidence: Confidence;
  remediation?: Remediation;
}

export interface Rule {
  id: string;
  name: string;
  description: string;
  severity: FindingSeverity;
  category: FindingCategory;
  evaluate: (ir: ProjectIR) => Finding | null;
}
