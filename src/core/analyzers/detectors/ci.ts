import { CIInfo } from '../../project/types';
import { DetectorContext } from './types';

export function detectCI(ctx: DetectorContext): CIInfo[] {
  const ci: CIInfo[] = [];

  const ghWorkflows = Array.from(ctx.files.keys()).filter(k => k.startsWith('.github/workflows/'));
  if (ghWorkflows.length > 0) {
    ci.push({
      name: 'GitHub Actions',
      provider: 'github_actions',
      workflows: ghWorkflows
    });
  }

  if (ctx.files.has('.gitlab-ci.yml')) {
    ci.push({
      name: 'GitLab CI',
      provider: 'gitlab_ci',
      workflows: ['.gitlab-ci.yml']
    });
  }

  return ci;
}
