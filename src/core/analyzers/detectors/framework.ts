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

  // --- Frameworks ---

  // Angular
  if (deps['@angular/core']) {
    frameworks.push({
      id: 'angular',
      name: 'Angular',
      category: 'framework',
      version: deps['@angular/core'],
      confidence: 'high',
      evidence: [{ source: 'package.json', message: 'Detected @angular/core dependency' }]
    });
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

  // Nuxt
  if (deps['nuxt'] || ctx.files.has('nuxt.config.ts') || ctx.files.has('nuxt.config.js')) {
    frameworks.push({
      id: 'nuxt',
      name: 'Nuxt',
      category: 'framework',
      version: deps['nuxt'],
      confidence: 'high',
      evidence: [{ source: deps['nuxt'] ? 'package.json' : 'nuxt.config.*', message: 'Detected Nuxt configuration or dependency' }]
    });
  }
  
  // SvelteKit
  if (deps['@sveltejs/kit'] || ctx.files.has('svelte.config.js')) {
    frameworks.push({
      id: 'sveltekit',
      name: 'SvelteKit',
      category: 'framework',
      version: deps['@sveltejs/kit'],
      confidence: 'high',
      evidence: [{ source: deps['@sveltejs/kit'] ? 'package.json' : 'svelte.config.*', message: 'Detected SvelteKit configuration or dependency' }]
    });
  }

  // React (only if not Next.js, or just as a secondary framework)
  if (deps['react']) {
    frameworks.push({
      id: 'react',
      name: 'React',
      category: 'framework',
      version: deps['react'],
      confidence: deps['next'] ? 'medium' : 'high',
      evidence: [{ source: 'package.json', message: 'Detected react dependency' }]
    });
  }

  // Vue
  if (deps['vue']) {
    frameworks.push({
      id: 'vue',
      name: 'Vue',
      category: 'framework',
      version: deps['vue'],
      confidence: deps['nuxt'] ? 'medium' : 'high',
      evidence: [{ source: 'package.json', message: 'Detected vue dependency' }]
    });
  }

  // Svelte
  if (deps['svelte']) {
    frameworks.push({
      id: 'svelte',
      name: 'Svelte',
      category: 'framework',
      version: deps['svelte'],
      confidence: deps['@sveltejs/kit'] ? 'medium' : 'high',
      evidence: [{ source: 'package.json', message: 'Detected svelte dependency' }]
    });
  }

  // Express
  if (deps['express']) {
    frameworks.push({
      id: 'express',
      name: 'Express',
      category: 'framework',
      version: deps['express'],
      confidence: 'high',
      evidence: [{ source: 'package.json', message: 'Detected express dependency' }]
    });
  }

  // Fastify
  if (deps['fastify']) {
    frameworks.push({
      id: 'fastify',
      name: 'Fastify',
      category: 'framework',
      version: deps['fastify'],
      confidence: 'high',
      evidence: [{ source: 'package.json', message: 'Detected fastify dependency' }]
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

  // --- Python Frameworks ---
  const reqTxt = ctx.files.get('requirements.txt');
  if (reqTxt?.content) {
    if (reqTxt.content.toLowerCase().includes('fastapi')) {
      frameworks.push({
        id: 'fastapi',
        name: 'FastAPI',
        category: 'framework',
        confidence: 'high',
        evidence: [{ source: 'requirements.txt', message: 'Detected fastapi in requirements' }]
      });
    }
    if (reqTxt.content.toLowerCase().includes('flask')) {
      frameworks.push({
        id: 'flask',
        name: 'Flask',
        category: 'framework',
        confidence: 'high',
        evidence: [{ source: 'requirements.txt', message: 'Detected Flask in requirements' }]
      });
    }
    if (reqTxt.content.toLowerCase().includes('django')) {
      frameworks.push({
        id: 'django',
        name: 'Django',
        category: 'framework',
        confidence: 'high',
        evidence: [{ source: 'requirements.txt', message: 'Detected Django in requirements' }]
      });
    }
  }

  // --- Build Tools ---

  // Vite
  if (deps['vite'] || ctx.files.has('vite.config.ts') || ctx.files.has('vite.config.js')) {
    frameworks.push({
      id: 'vite',
      name: 'Vite',
      category: 'buildTool', // classified correctly as buildTool
      version: deps['vite'],
      confidence: 'high',
      evidence: [{ source: deps['vite'] ? 'package.json' : 'vite.config.*', message: 'Detected Vite configuration or dependency' }]
    });
  }

  // Webpack
  if (deps['webpack'] || ctx.files.has('webpack.config.js')) {
    frameworks.push({
      id: 'webpack',
      name: 'Webpack',
      category: 'buildTool',
      version: deps['webpack'],
      confidence: 'high',
      evidence: [{ source: deps['webpack'] ? 'package.json' : 'webpack.config.js', message: 'Detected Webpack' }]
    });
  }

  // --- Integrations / Tooling ---

  // AnalogJS
  if (deps['@analogjs/vite-plugin-angular']) {
    frameworks.push({
      id: 'analogjs',
      name: 'AnalogJS Vite Plugin',
      category: 'tooling',
      version: deps['@analogjs/vite-plugin-angular'],
      confidence: 'high',
      evidence: [{ source: 'package.json', message: 'Detected @analogjs/vite-plugin-angular' }]
    });
  }

  return frameworks;
}
