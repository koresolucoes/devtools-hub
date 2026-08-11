import type { Rule, Finding } from './types';
import type { ProjectIR } from '../project/types';

export const BUILD001: Rule = {
  id: 'BUILD001',
  name: 'Missing build script for frontend framework',
  description: 'Frameworks like Next.js and Vite require a build step for production.',
  severity: 'high',
  evaluate: (_ir: ProjectIR): Finding | null => {
    // In a full implementation, we'd check if 'next build' or 'vite build' exists.
    return null;
  }
};
