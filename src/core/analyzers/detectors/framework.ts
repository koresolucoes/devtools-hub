import { DetectedTechnology } from '../../project/types';
import { DetectorContext } from './types';

export function detectFrameworks(ctx: DetectorContext): DetectedTechnology[] {
  const frameworks: DetectedTechnology[] = [];

  // Parse package.json dependencies once
  let deps: Record<string, string> = {};
  const packageJson = ctx.files.get('package.json');
  if (packageJson?.content) {
    try {
      const pkg = JSON.parse(packageJson.content);
      deps = { ...pkg.dependencies, ...pkg.devDependencies };
    } catch (e) {
      // ignore
    }
  }

  // Next.js
  if (deps['next'] || ctx.files.has('next.config.js') || ctx.files.has('next.config.mjs')) {
    frameworks.push({
      id: 'nextjs',
      name: 'Next.js',
      category: 'framework',
      version: deps['next'],
      confidence: 'high',
      evidence: [{ source: deps['next'] ? 'package.json' : 'next.config.*', message: 'Detected Next.js configuration or dependency' }]
    });
  }

  // React
  if (deps['react']) {
    frameworks.push({
      id: 'react',
      name: 'React',
      category: 'framework',
      version: deps['react'],
      confidence: 'high',
      evidence: [{ source: 'package.json', message: 'Detected react dependency' }]
    });
  }

  // Vite
  if (deps['vite'] || ctx.files.has('vite.config.ts') || ctx.files.has('vite.config.js')) {
    frameworks.push({
      id: 'vite',
      name: 'Vite',
      category: 'framework',
      version: deps['vite'],
      confidence: 'high',
      evidence: [{ source: deps['vite'] ? 'package.json' : 'vite.config.*', message: 'Detected Vite configuration or dependency' }]
    });
  }
  
  // NestJS
  if (deps['@nestjs/core']) {
    frameworks.push({
      id: 'nestjs',
      name: 'NestJS',
      category: 'framework',
      version: deps['@nestjs/core'],
      confidence: 'high',
      evidence: [{ source: 'package.json', message: 'Detected @nestjs/core dependency' }]
    });
  }

  // Python Frameworks from requirements.txt
  const reqTxt = ctx.files.get('requirements.txt');
  if (reqTxt?.content) {
    if (reqTxt.content.includes('fastapi')) {
      frameworks.push({
        id: 'fastapi',
        name: 'FastAPI',
        category: 'framework',
        confidence: 'high',
        evidence: [{ source: 'requirements.txt', message: 'Detected fastapi in requirements' }]
      });
    }
    if (reqTxt.content.includes('Flask')) {
      frameworks.push({
        id: 'flask',
        name: 'Flask',
        category: 'framework',
        confidence: 'high',
        evidence: [{ source: 'requirements.txt', message: 'Detected Flask in requirements' }]
      });
    }
    if (reqTxt.content.includes('Django')) {
      frameworks.push({
        id: 'django',
        name: 'Django',
        category: 'framework',
        confidence: 'high',
        evidence: [{ source: 'requirements.txt', message: 'Detected Django in requirements' }]
      });
    }
  }

  return frameworks;
}
