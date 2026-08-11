import type { Rule, Finding } from './types';
import type { ProjectIR } from '../project/types';

export const SECURITY001: Rule = {
  id: 'SECURITY001',
  name: 'Known vulnerable direct dependency',
  description: 'The project depends on a package with known critical vulnerabilities.',
  severity: 'critical',
  category: 'security',
  evaluate: (_ir: ProjectIR): Finding | null => {
    // OSV scanning will populate vulnerabilities.
    // For now, if we had vulnerabilities in ProjectIR (which we don't by design yet),
    // or if we rely on a separate engine, we'd check here.
    // In this MVP, OSV results are handled independently. We'll return null for the rules engine
    // unless vulnerabilities are injected.
    return null;
  }
};
