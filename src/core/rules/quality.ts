import type { ProjectIR } from '../project/types';
import type { CheckResult } from '../checks/types';

export function runQualityRules(ir: ProjectIR): CheckResult[] {
  const results: CheckResult[] = [];

  if (ir.languages.length === 0) {
    results.push({
      id: `QUALITY001-NA`,
      ruleId: 'QUALITY001',
      title: 'Missing Test Suite',
      category: 'quality',
      status: 'not-applicable',
      weight: 0,
      confidence: 'high',
      evidence: [{
        source: 'ProjectIR',
        message: 'No programming languages detected.'
      }]
    });
    results.push({
      id: `QUALITY002-NA`,
      ruleId: 'QUALITY002',
      title: 'Missing Linter',
      category: 'quality',
      status: 'not-applicable',
      weight: 0,
      confidence: 'high',
      evidence: [{
        source: 'ProjectIR',
        message: 'No programming languages detected.'
      }]
    });
    return results;
  }

  // QUALITY001
  if (ir.quality.tests.length === 0 && (!ir.scripts || (!ir.scripts['test'] || ir.scripts['test'] === 'echo "Error: no test specified" && exit 1'))) {
    results.push({
      id: `QUALITY001-FAIL`,
      ruleId: 'QUALITY001',
      title: 'Missing Test Suite',
      category: 'quality',
      status: 'fail',
      weight: 100,
      confidence: 'high',
      evidence: [{
        source: 'ProjectIR',
        message: 'No test tools found and no valid test script in manifest'
      }],
      finding: {
        id: 'QUALITY001',
        title: 'Missing Test Suite',
        description: 'No testing framework or test script was detected in the project configuration.',
        severity: 'high',
        category: 'quality',
        impact: 'Regressions may go unnoticed. Hard to refactor code safely.',
        remediation: {
          summary: 'Install a testing framework (like Vitest or Jest for Node, Pytest for Python) and configure a test script.',
          steps: ['Install testing framework', 'Add test script']
        },
        evidence: [{
          source: 'ProjectIR',
          message: 'No test tools found and no valid test script in manifest'
        }]
      }
    });
  } else {
    results.push({
      id: `QUALITY001-PASS`,
      ruleId: 'QUALITY001',
      title: 'Test Suite configured',
      category: 'quality',
      status: 'pass',
      weight: 100,
      confidence: 'high',
      evidence: [{
        source: 'ProjectIR',
        message: 'Test tool or script found'
      }]
    });
  }

  // QUALITY002
  if (ir.quality.linters.length === 0 && (!ir.scripts || !ir.scripts['lint'])) {
    results.push({
      id: `QUALITY002-FAIL`,
      ruleId: 'QUALITY002',
      title: 'Missing Linter',
      category: 'quality',
      status: 'fail',
      weight: 100,
      confidence: 'high',
      evidence: [{
        source: 'ProjectIR',
        message: 'No linting tools found and no lint script in manifest'
      }],
      finding: {
        id: 'QUALITY002',
        title: 'Missing Linter',
        description: 'No linting tool or script was detected in the project configuration.',
        severity: 'medium',
        category: 'quality',
        impact: 'Code style inconsistencies and potential bugs that could be caught by static analysis.',
        remediation: {
          summary: 'Install a linter (like ESLint or Ruff) to enforce code quality.',
          steps: ['Install linter', 'Configure rules']
        },
        evidence: [{
          source: 'ProjectIR',
          message: 'No linting tools found and no lint script in manifest'
        }]
      }
    });
  } else {
    results.push({
      id: `QUALITY002-PASS`,
      ruleId: 'QUALITY002',
      title: 'Linter configured',
      category: 'quality',
      status: 'pass',
      weight: 100,
      confidence: 'high',
      evidence: [{
        source: 'ProjectIR',
        message: 'Lint tool or script found'
      }]
    });
  }

  return results;
}
