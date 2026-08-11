import type { Evidence, Confidence } from '../project/types';
import type { HealthCategory } from '../checks/types';

export type FindingSeverity = 'critical' | 'high' | 'medium' | 'moderate' | 'low' | 'info' | 'unknown';

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
  category: HealthCategory;
  impact: string;
  remediation: Remediation | string;
  evidence?: Evidence[];
  ruleId?: string;
  confidence?: Confidence;
}
