import type { PipelineIR } from '../types';

export function explainPipeline(ir: PipelineIR): string[] {
  const steps: string[] = [];
  steps.push(`1. This pipeline triggers automatically on ${ir.triggers.push ? 'Push' : ''} ${ir.triggers.push && ir.triggers.pr ? 'and' : ''} ${ir.triggers.pr ? 'Pull Requests' : ''}.`);
  if (ir.concurrency) steps.push(`2. It cancels outdated builds automatically to save CI minutes.`);
  steps.push(`3. It sets up the ${ir.language} environment using the ${ir.packageManager} package manager.`);
  if (ir.caching) steps.push(`4. It caches dependencies to speed up future runs.`);
  if (ir.linting) steps.push(`5. It runs a linter to ensure code style consistency.`);
  if (ir.testing) steps.push(`6. It executes the automated test suite.`);
  if (ir.containerize) steps.push(`7. It builds a Docker container and pushes it to ${ir.dockerRegistry.toUpperCase()}.`);
  if (ir.deploy === 'vercel') steps.push(`8. Finally, it deploys the application to Vercel.`);

  return steps;
}
