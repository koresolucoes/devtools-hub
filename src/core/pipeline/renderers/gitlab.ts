import type { PipelineIR } from '../types';

export function compileToGitLabYAML(ir: PipelineIR): string {
  let yaml = `stages:\n  - test\n`;
  if (ir.deploy !== 'none' || ir.containerize) yaml += `  - deploy\n`;
  return yaml;
}
