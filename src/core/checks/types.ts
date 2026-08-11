import type { Evidence } from '../project/types';
import type { Finding } from '../rules/types';

export type CheckStatus = 'pass' | 'fail' | 'unknown' | 'not-applicable';

export type HealthCategory =
  | 'security'
  | 'dependencies'
  | 'quality'
  | 'build'
  | 'ci'
  | 'deployment'
  | 'architecture'
  | 'maintainability';

export interface CheckResult {
  id: string;
  ruleId?: string;
  category: HealthCategory;
  title?: string;
  status: CheckStatus;
  weight?: number;
  confidence?: 'high' | 'medium' | 'low';
  evidence?: Evidence[];
  finding?: Finding;
}
