import type { Evidence, Confidence } from '../project/types';

export type FindingSeverity = 'critical' | 'high' | 'medium' | 'moderate' | 'low' | 'info' | 'unknown';

export type FindingCategory = 'build' | 'security' | 'quality' | 'ci' | 'deployment' | 'environment' | 'maintainability' | 'architecture' | 'dependencies';

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
  category?: FindingCategory;
  impact: string;
  remediation: Remediation | string;
  evidence?: Evidence[];
  ruleId?: string;
  confidence?: Confidence;
}
