import { ProjectIR } from '../project/types';
import { CheckResult } from './types';

export function runQualityChecks(ir: ProjectIR): CheckResult[] {
  const results: CheckResult[] = [];

  // QUALITY001: Testing Framework/Runner Configured
  const hasTestingTools = ir.quality.tests.tools.length > 0;
  const hasTestCommands = ir.quality.tests.commands.length > 0;
  const hasTestFiles = ir.quality.tests.files.length > 0;

  if (hasTestingTools || hasTestCommands || hasTestFiles) {
    results.push({
      id: 'QUALITY001',
      category: 'quality',
      status: 'pass',
      evidence: [
        ...(ir.quality.tests.tools.map(t => ({ source: t.name, message: 'Test framework detected' }))),
        ...(ir.quality.tests.commands.map(c => ({ source: 'package.json scripts', message: `Test command: ${c}` }))),
        ...(ir.quality.tests.files.slice(0, 2).map(f => ({ source: f, message: 'Test file found' })))
      ]
    });
  } else {
    results.push({
      id: 'QUALITY001',
      category: 'quality',
      status: 'fail',
      finding: {
        id: 'QUALITY001',
        title: 'Missing Test Suite',
        severity: 'high',
        description: 'No testing framework, test commands, or test files were detected.',
        impact: 'Lack of automated testing severely impacts long-term maintainability and confidence in refactoring.',
        remediation: 'Install a testing framework like Vitest, Jest, or use Node native test runner, and add tests to your project.'
      }
    });
  }

  // QUALITY002: Linter Configured
  // Must check if actual linter is found, not just a script named "lint"
  if (ir.quality.linters.length > 0) {
    results.push({
      id: 'QUALITY002',
      category: 'quality',
      status: 'pass',
      evidence: ir.quality.linters.map(l => ({ source: l.name, message: 'Linter configured' }))
    });
  } else {
    // If we classified a script as 'lint' but no tools were found, we could add evidence
    const hasLintScript = Object.keys(ir.scripts).some(k => k.includes('lint'));
    results.push({
      id: 'QUALITY002',
      category: 'quality',
      status: 'fail',
      finding: {
        id: 'QUALITY002',
        title: 'Missing Code Linter',
        severity: 'moderate',
        description: hasLintScript 
          ? 'A "lint" script was found but no actual linter (ESLint, Oxlint, Biome) was detected in dependencies or configuration.'
          : 'No linting tool is configured for this project.',
        impact: 'Code style and potential bugs may go unnoticed without automated linting.',
        remediation: 'Configure a linter such as ESLint, Biome, or Oxlint.'
      }
    });
  }

  // QUALITY003: Static type checking configured
  if (ir.quality.typecheckers.length > 0) {
    results.push({
      id: 'QUALITY003',
      category: 'quality',
      status: 'pass',
      evidence: ir.quality.typecheckers.map(t => ({ source: t.name, message: 'Typechecker configured' }))
    });
  } else {
    results.push({
      id: 'QUALITY003',
      category: 'quality',
      status: 'fail',
      finding: {
        id: 'QUALITY003',
        title: 'Missing Static Type Checking',
        severity: 'moderate',
        description: 'No static type checker (like TypeScript or Mypy) was found.',
        impact: 'Type-related bugs may reach production.',
        remediation: 'Adopt TypeScript for JS/TS projects or Mypy for Python projects.'
      }
    });
  }

  return results;
}
