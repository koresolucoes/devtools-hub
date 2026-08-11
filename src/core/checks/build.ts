import type { ProjectIR } from '../project/types';
import type { CheckResult } from './types';

export function runBuildChecks(ir: ProjectIR): CheckResult[] {
  const results: CheckResult[] = [];

  // BUILD001: Build command exists when required
  const hasBuildScript = ir.scripts && ir.scripts['build'];
  if (hasBuildScript) {
    results.push({
      id: 'BUILD001',
      category: 'build',
      status: 'pass',
      evidence: [{ source: 'package.json', message: 'Build script detected', value: ir.scripts['build'] }]
    });
  } else {
    // Determine if a build script is actually required (e.g. for frontend frameworks)
    const needsBuild = ir.frameworks.some(f => ['React', 'Angular', 'Vue', 'Next.js', 'Nuxt'].includes(f.name));
    results.push({
      id: 'BUILD001',
      category: 'build',
      status: needsBuild ? 'fail' : 'not-applicable',
      finding: needsBuild ? {
        id: 'BUILD001',
        title: 'Missing Build Command',
        category: 'build',
        severity: 'high',
        description: 'A frontend framework was detected but no build command was found.',
        impact: 'The project cannot be built for production deployment.',
        remediation: 'Add a "build" script to your package.json.'
      } : undefined
    });
  }

  // BUILD002: Build tool detected when expected
  const buildTools = [
    ...ir.languages, ...ir.frameworks, ...ir.runtimes, ...ir.databases, ...ir.infrastructure.deployments
  ].filter(t => t.category === 'buildTool' || t.name === 'Vite' || t.name === 'Webpack' || t.name === 'Angular CLI');

  if (buildTools.length > 0) {
    results.push({
      id: 'BUILD002',
      category: 'build',
      status: 'pass',
      evidence: buildTools.map(bt => ({ source: 'Dependencies', message: 'Build tool detected', value: bt.name }))
    });
  } else {
    results.push({
      id: 'BUILD002',
      category: 'build',
      status: hasBuildScript ? 'fail' : 'not-applicable',
      finding: hasBuildScript ? {
        id: 'BUILD002',
        title: 'Missing Build Tool Configuration',
        category: 'build',
        severity: 'medium',
        description: 'A build script is present, but no standard build tool could be confidently detected.',
        impact: 'The build process might be custom or rely on globally installed tools, reducing portability.',
        remediation: 'Declare your build tools in your package.json devDependencies.'
      } : undefined
    });
  }

  // BUILD003: Framework/build-tool combination recognized
  if (buildTools.length > 0 && ir.frameworks.length > 0) {
    results.push({
      id: 'BUILD003',
      category: 'build',
      status: 'pass',
      evidence: [{ source: 'Analysis', message: `Recognized combination: ${ir.frameworks.map(f=>f.name).join(', ')} with ${buildTools.map(b=>b.name).join(', ')}` }]
    });
  } else {
    results.push({
      id: 'BUILD003',
      category: 'build',
      status: 'not-applicable'
    });
  }

  return results;
}
