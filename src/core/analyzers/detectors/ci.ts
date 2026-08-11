import { CIInfo } from '../../project/types';
import { DetectorContext } from './types';

export function detectCI(ctx: DetectorContext): CIInfo[] {
  const ci: CIInfo[] = [];

  const ghWorkflows = Array.from(ctx.files.keys()).filter(k => k.startsWith('.github/workflows/'));
  if (ghWorkflows.length > 0) {
    const actions = new Set<string>();
    const commands = new Set<string>();
    const triggers = new Set<string>();
    let hasConcurrency = false;

    for (const wf of ghWorkflows) {
      const content = ctx.files.get(wf)?.content;
      if (content) {
        const lines = content.split('\n').map(l => l.trim());
        let inOnBlock = false;
        
        for (const line of lines) {
          if (line.startsWith('uses:')) {
            const action = line.replace('uses:', '').trim().replace(/['"]/g, '');
            if (action) actions.add(action);
          } else if (line.startsWith('run:')) {
            const cmd = line.replace('run:', '').trim();
            if (cmd && !cmd.includes('|')) commands.add(cmd);
          } else if (line.startsWith('on:')) {
            inOnBlock = true;
            const inlineTrigger = line.replace('on:', '').trim();
            if (inlineTrigger && inlineTrigger !== '[' && inlineTrigger !== '{') {
              triggers.add(inlineTrigger.replace(/[[\]'"]/g, '').trim());
              inOnBlock = false;
            }
          } else if (inOnBlock && line && !line.startsWith('#') && !line.startsWith('env:') && !line.startsWith('jobs:') && !line.startsWith('concurrency:')) {
            if (line.endsWith(':')) {
              triggers.add(line.replace(':', '').trim());
            } else if (line.startsWith('-')) {
              triggers.add(line.replace('-', '').trim().replace(/['"]/g, ''));
            } else if (line.startsWith('jobs:') || line.startsWith('concurrency:')) {
              inOnBlock = false;
            }
          }
          if (line.startsWith('concurrency:')) {
            hasConcurrency = true;
          }
        }
      }
    }

    ci.push({
      name: 'GitHub Actions',
      provider: 'github_actions',
      workflows: ghWorkflows,
      actions: Array.from(actions),
      commands: Array.from(commands),
      triggers: Array.from(triggers),
      hasConcurrency
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
