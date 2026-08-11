import type { PipelineIR } from '../types';

export function compileToGitHubYAML(ir: PipelineIR): string {
  let yaml = `name: Pipeline Architect Workflow\n\n`;

  yaml += `on:\n`;
  if (ir.triggers.push) yaml += `  push:\n    branches: [ "main" ]\n`;
  if (ir.triggers.pr) yaml += `  pull_request:\n    branches: [ "main" ]\n`;
  if (ir.triggers.cron) yaml += `  schedule:\n    - cron: '0 3 * * 1'\n`;

  if (ir.permissions && Object.keys(ir.permissions).length > 0) {
    yaml += `\npermissions:\n`;
    Object.entries(ir.permissions).forEach(([k, v]) => { yaml += `  ${k}: ${v}\n`; });
  }

  if (ir.concurrency) {
    yaml += `\nconcurrency:\n  group: \${{ github.workflow }}-\${{ github.ref }}\n  cancel-in-progress: true\n`;
  }

  const globalVars = ir.envVars.filter(e => e.scope === 'global' && e.key);
  if (globalVars.length > 0) {
    yaml += `\nenv:\n`;
    globalVars.forEach(v => {
      let valStr = v.type === 'Secret' ? `\${{ secrets.${v.key} }}` : v.value;
      yaml += `  ${v.key}: ${valStr}\n`;
    });
  }

  yaml += `\njobs:\n  build:\n    runs-on: ubuntu-latest\n`;

  if (ir.runtimeStrategy === 'matrix') {
    const versions = ir.language === 'node' ? ir.matrixNodeVersions : ir.matrixPythonVersions;
    const versionKey = ir.language === 'node' ? 'node-version' : 'python-version';
    yaml += `    strategy:\n      matrix:\n        ${versionKey}: [${versions.map(v => `'${v}'`).join(', ')}]\n`;
  }

  yaml += `    steps:\n`;

  ir.steps.forEach(step => {
    yaml += `    - name: ${step.name}\n`;
    if (step.uses) yaml += `      uses: ${step.uses}\n`;
    if (step.with) {
      yaml += `      with:\n`;
      Object.entries(step.with).forEach(([k, v]) => { yaml += `        ${k}: ${v}\n`; });
    }
    if (step.env) {
      yaml += `      env:\n`;
      Object.entries(step.env).forEach(([k, v]) => { yaml += `        ${k}: ${v}\n`; });
    }
    if (step.run) {
      if (step.run.includes('\n')) {
        yaml += `      run: |\n`;
        step.run.split('\n').forEach(line => { yaml += `        ${line}\n`; });
      } else {
        yaml += `      run: ${step.run}\n`;
      }
    }
    yaml += `\n`;
  });

  return yaml.trimEnd() + '\n';
}
