import type { Rule, Finding } from './types';
import type { ProjectIR } from '../project/types';

export const QUALITY001: Rule = {
  id: 'QUALITY001',
  name: 'No automated tests detected',
  description: 'The project does not have an automated test suite configured.',
  severity: 'high',
  evaluate: (ir: ProjectIR): Finding | null => {
    if (ir.primaryLanguage === 'unknown') return null; // Skip if we don't know the stack
    
    if (!ir.hasTests) {
      return {
        ruleId: 'QUALITY001',
        title: 'Missing Test Suite',
        description: 'No testing framework or test script was detected in the project configuration.',
        severity: 'high',
        evidence: ir.primaryLanguage === 'node' ? 'No "test" script found in package.json' : 'No test configuration found',
        remediation: 'Install a testing framework (like vitest or jest for Node, pytest for Python) and configure a test script.'
      };
    }
    return null;
  }
};

export const QUALITY002: Rule = {
  id: 'QUALITY002',
  name: 'No linting detected',
  description: 'The project does not have static analysis or linting configured.',
  severity: 'moderate',
  evaluate: (ir: ProjectIR): Finding | null => {
    if (ir.primaryLanguage === 'unknown') return null;
    
    if (!ir.hasLinting) {
      return {
        ruleId: 'QUALITY002',
        title: 'Missing Linter',
        description: 'No linting tool or script was detected in the project configuration.',
        severity: 'moderate',
        evidence: 'No "lint" script or linter configuration found',
        remediation: 'Install a linter (like ESLint or Ruff) to enforce code quality.'
      };
    }
    return null;
  }
};
