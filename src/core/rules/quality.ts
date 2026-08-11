import type { Rule, Finding } from './types';
import type { ProjectIR } from '../project/types';

export const QUALITY001: Rule = {
  id: 'QUALITY001',
  name: 'No automated tests detected',
  description: 'The project does not have an automated test suite configured.',
  severity: 'high',
  category: 'quality',
  evaluate: (ir: ProjectIR): Finding | null => {
    if (ir.languages.length === 0) return null; // Skip if we don't know the stack
    
    if (ir.quality.tests.length === 0 && (!ir.scripts || (!ir.scripts['test'] || ir.scripts['test'] === 'echo "Error: no test specified" && exit 1'))) {
      return {
        id: `QUALITY001-${Date.now()}`,
        ruleId: 'QUALITY001',
        title: 'Missing Test Suite',
        description: 'No testing framework or test script was detected in the project configuration.',
        severity: 'high',
        category: 'quality',
        confidence: 'high',
        impact: 'Regressions may go unnoticed. Hard to refactor code safely.',
        evidence: [{
          source: 'ProjectIR',
          message: 'No test tools found and no valid test script in manifest'
        }],
        remediation: {
          summary: 'Install a testing framework (like Vitest or Jest for Node, Pytest for Python) and configure a test script.',
          type: 'instruction',
          affectedFiles: ['package.json'],
          instructions: ['Install testing framework', 'Add test script'],
          verification: ['npm test']
        }
      };
    }
    return null;
  }
};

export const QUALITY002: Rule = {
  id: 'QUALITY002',
  name: 'No linting detected',
  description: 'The project does not have static analysis or linting configured.',
  severity: 'medium',
  category: 'quality',
  evaluate: (ir: ProjectIR): Finding | null => {
    if (ir.languages.length === 0) return null;
    
    if (ir.quality.linters.length === 0 && (!ir.scripts || !ir.scripts['lint'])) {
      return {
        id: `QUALITY002-${Date.now()}`,
        ruleId: 'QUALITY002',
        title: 'Missing Linter',
        description: 'No linting tool or script was detected in the project configuration.',
        severity: 'medium',
        category: 'quality',
        confidence: 'high',
        impact: 'Code style inconsistencies and potential bugs that could be caught by static analysis.',
        evidence: [{
          source: 'ProjectIR',
          message: 'No linting tools found and no lint script in manifest'
        }],
        remediation: {
          summary: 'Install a linter (like ESLint or Ruff) to enforce code quality.',
          type: 'instruction',
          affectedFiles: ['package.json'],
          instructions: ['Install linter', 'Configure rules'],
          verification: ['npm run lint']
        }
      };
    }
    return null;
  }
};
