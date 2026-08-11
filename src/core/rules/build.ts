import type { Rule, Finding } from './types';
import type { ProjectIR } from '../project/types';

export const BUILD001: Rule = {
  id: 'BUILD001',
  name: 'Missing build script for frontend framework',
  description: 'Frameworks like Next.js and Vite require a build step for production.',
  severity: 'high',
  category: 'build',
  evaluate: (ir: ProjectIR): Finding | null => {
    const needsBuild = ir.frameworks.some(f => ['nextjs', 'vite', 'react', 'vue', 'svelte', 'nuxt'].includes(f.id));
    
    if (needsBuild && (!ir.scripts || !ir.scripts['build'])) {
      return {
        id: `BUILD001-${Date.now()}`,
        ruleId: 'BUILD001',
        title: 'Missing Build Script',
        description: 'A frontend framework was detected, but no "build" script is configured in package.json.',
        severity: 'high',
        category: 'build',
        confidence: 'high',
        impact: 'The project cannot be compiled for production deployment.',
        evidence: [{
          source: 'ProjectIR',
          message: 'Frontend framework detected but no build script found in manifest'
        }],
        remediation: {
          summary: 'Add a build script to package.json for your framework.',
          type: 'instruction',
          affectedFiles: ['package.json'],
          instructions: ['Add "build" script mapped to your framework builder (e.g. "next build" or "vite build")'],
          verification: ['npm run build']
        }
      };
    }
    return null;
  }
};
