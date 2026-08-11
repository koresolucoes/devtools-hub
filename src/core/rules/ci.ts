import type { ProjectIR } from '../project/types';
import type { CheckResult } from '../checks/types';

export function runCIRules(ir: ProjectIR): CheckResult[] {
  const results: CheckResult[] = [];

  // CI001
  if (ir.infrastructure.ci.length === 0) {
    results.push({
      id: `CI001-FAIL`,
      ruleId: 'CI001',
      title: 'Missing Continuous Integration',
      category: 'ci',
      status: 'fail',
      weight: 100,
      confidence: 'high',
      evidence: [{
        source: 'ProjectIR',
        message: 'No workflow files found in standard locations'
      }],
      finding: {
        id: 'CI001',
        title: 'Missing Continuous Integration',
        description: 'No CI tool like GitHub Actions or GitLab CI was detected.',
        severity: 'low',
        category: 'ci',
        impact: 'Manual deployments or untested code merging into default branch.',
        remediation: {
          summary: 'Use Pipeline Architect to generate a CI workflow for your stack.',
          steps: ['Generate workflow', 'Commit to repository']
        },
        evidence: [{
          source: 'ProjectIR',
          message: 'No workflow files found in standard locations'
        }]
      }
    });
  } else {
    results.push({
      id: `CI001-PASS`,
      ruleId: 'CI001',
      title: 'Continuous Integration configured',
      category: 'ci',
      status: 'pass',
      weight: 100,
      confidence: 'high',
      evidence: [{
        source: 'ProjectIR',
        message: 'CI workflows detected'
      }]
    });
  }

  // CI003
  const ghActions = ir.infrastructure.ci.find(c => c.provider === 'github_actions');
  if (ghActions) {
    if (!ghActions.hasConcurrency) {
      results.push({
        id: `CI003-FAIL`,
        ruleId: 'CI003',
        title: 'Missing Concurrency Cancellation',
        category: 'ci',
        status: 'fail',
        weight: 100,
        confidence: 'high',
        evidence: [{
          source: 'ProjectIR',
          message: 'No concurrency block found in GitHub Actions workflows.'
        }],
        finding: {
          id: 'CI003',
          title: 'Missing Concurrency Cancellation',
          description: 'GitHub Actions workflow lacks concurrency configuration for redundant runs.',
          severity: 'low',
          category: 'ci',
          impact: 'Wastes CI minutes and slows down development by running redundant jobs when new commits are pushed.',
          remediation: {
            summary: 'Add a concurrency block to your GitHub Actions workflow.',
            steps: ['Add concurrency group based on branch/PR reference.', 'Enable cancel-in-progress to stop redundant runs.']
          },
          evidence: [{
            source: 'ProjectIR',
            message: 'No concurrency block found in GitHub Actions workflows.'
          }]
        }
      });
    } else {
      results.push({
        id: `CI003-PASS`,
        ruleId: 'CI003',
        title: 'Concurrency Cancellation configured',
        category: 'ci',
        status: 'pass',
        weight: 100,
        confidence: 'high',
        evidence: [{
          source: 'ProjectIR',
          message: 'Concurrency block found in GitHub Actions workflows.'
        }]
      });
    }
  } else {
    results.push({
      id: `CI003-NA`,
      ruleId: 'CI003',
      title: 'Missing Concurrency Cancellation',
      category: 'ci',
      status: 'not-applicable',
      weight: 0,
      confidence: 'high',
      evidence: [{
        source: 'ProjectIR',
        message: 'Not using GitHub Actions.'
      }]
    });
  }

  return results;
}
