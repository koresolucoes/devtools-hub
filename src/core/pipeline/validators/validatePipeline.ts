import type { PipelineIR, ValidationResult } from '../types';

export function validatePipeline(ir: PipelineIR): ValidationResult {
  const issues: string[] = [];
  if (ir.deploy === 'none' && !ir.containerize && !ir.testing && !ir.linting) {
    issues.push('Pipeline does not run any tasks (no tests, lint, docker, or deploy).');
  }
  if (ir.containerize && !ir.dockerRegistry) {
    issues.push('Docker containerization enabled but no registry selected.');
  }
  if (ir.deploy === 'vercel' && ir.containerize) {
    issues.push('Conflict: Vercel deployment usually conflicts with raw Docker containerization.');
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}
