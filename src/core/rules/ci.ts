import type { Rule, Finding } from './types';
import type { ProjectIR } from '../project/types';

export const CI001: Rule = {
  id: 'CI001',
  name: 'No CI workflow detected',
  description: 'The project is not using Continuous Integration to validate changes.',
  severity: 'info',
  evaluate: (ir: ProjectIR): Finding | null => {
    if (ir.ciTool === 'none') {
      return {
        ruleId: 'CI001',
        title: 'Missing Continuous Integration',
        description: 'No CI tool like GitHub Actions or GitLab CI was detected.',
        severity: 'info',
        evidence: 'No workflow files found in standard locations',
        remediation: 'Use Pipeline Architect to generate a CI workflow for your stack.'
      };
    }
    return null;
  }
};

export const CI002: Rule = {
  id: 'CI002',
  name: 'CI Workflow references missing npm script',
  description: 'A script is called in CI but does not exist in package.json.',
  severity: 'high',
  evaluate: (_ir: ProjectIR): Finding | null => {
    // A simplified heuristic for now. In a full implementation, we would 
    // parse the AST of the CI workflow and compare against package.json scripts.
    // For this mock, we'll return null to represent everything is fine.
    return null;
  }
};
