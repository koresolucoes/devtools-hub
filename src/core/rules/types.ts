import type { Evidence, Confidence } from '../project/types';

export type FindingSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type FindingCategory = 'build' | 'security' | 'quality' | 'ci' | 'deployment' | 'environment' | 'maintainability';

export interface Remediation {
  summary: string;
  type?: 'instruction' | 'file-create' | 'file-update' | 'dependency-change' | 'workflow-change';
  affectedFiles?: string[];
  instructions?: string[];
  verification?: string[];
  steps?: string[];
}

export interface Finding {
  id: string;
  title: string;
  description: string;
  severity: FindingSeverity;
  category: FindingCategory;
  impact: string;
  remediation: Remediation;
  evidence: Evidence[];
  ruleId?: string;
  confidence?: Confidence;
}
