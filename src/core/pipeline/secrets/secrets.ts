import type { PipelineIR } from '../types';

export function generateSecretChecklist(ir: PipelineIR): string[] {
  const secrets: string[] = [];
  if (ir.deploy === 'vercel') secrets.push('VERCEL_TOKEN', 'VERCEL_ORG_ID', 'VERCEL_PROJECT_ID');
  if (ir.containerize) {
    if (ir.dockerRegistry === 'dockerhub') secrets.push('DOCKERHUB_USERNAME', 'DOCKERHUB_TOKEN');
  }
  ir.envVars.forEach(v => {
    if (v.type === 'Secret' && v.key && !secrets.includes(v.key)) secrets.push(v.key);
  });
  return secrets;
}

export function generateDotEnvExample(ir: PipelineIR): string {
  const lines = ['# Auto-generated .env.example by DevsHub CI/CD Copilot', ''];
  const secrets = generateSecretChecklist(ir);
  if (secrets.length > 0) {
    lines.push('# Required Repository Secrets');
    secrets.forEach(sec => lines.push(`${sec}=your_${sec.toLowerCase()}_here`));
    lines.push('');
  }
  if (ir.envVars.length > 0) {
    lines.push('# Environment Variables');
    ir.envVars.forEach(v => { if (v.key) lines.push(`${v.key}=${v.value || 'sample_value'}`); });
  }
  return lines.join('\n');
}
