import { DetectedTechnology } from '../../project/types';
import { DetectorContext } from './types';

export function detectDeployments(ctx: DetectorContext): DetectedTechnology[] {
  const deployments: DetectedTechnology[] = [];

  if (ctx.files.has('vercel.json')) {
    deployments.push({
      id: 'vercel',
      name: 'Vercel',
      category: 'deployment',
      confidence: 'high',
      evidence: [{ source: 'vercel.json', message: 'Found vercel.json' }]
    });
  }

  if (ctx.files.has('netlify.toml')) {
    deployments.push({
      id: 'netlify',
      name: 'Netlify',
      category: 'deployment',
      confidence: 'high',
      evidence: [{ source: 'netlify.toml', message: 'Found netlify.toml' }]
    });
  }

  if (ctx.files.has('railway.json')) {
    deployments.push({
      id: 'railway',
      name: 'Railway',
      category: 'deployment',
      confidence: 'high',
      evidence: [{ source: 'railway.json', message: 'Found railway.json' }]
    });
  }

  if (ctx.files.has('render.yaml')) {
    deployments.push({
      id: 'render',
      name: 'Render',
      category: 'deployment',
      confidence: 'high',
      evidence: [{ source: 'render.yaml', message: 'Found render.yaml' }]
    });
  }

  return deployments;
}
