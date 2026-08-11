import { DetectedTechnology } from '../../project/types';
import { DetectorContext } from './types';

export function detectRuntimes(ctx: DetectorContext): DetectedTechnology[] {
  const runtimes: DetectedTechnology[] = [];

  // Node.js
  let nodeVersion: string | undefined;
  let nodeEvidence = [];

  const nvmrc = ctx.files.get('.nvmrc');
  if (nvmrc?.content) {
    nodeVersion = nvmrc.content.trim();
    nodeEvidence.push({ source: '.nvmrc', value: nodeVersion, message: 'Found .nvmrc file' });
  } else {
    const nodeVersionFile = ctx.files.get('.node-version');
    if (nodeVersionFile?.content) {
      nodeVersion = nodeVersionFile.content.trim();
      nodeEvidence.push({ source: '.node-version', value: nodeVersion, message: 'Found .node-version file' });
    }
  }

  const packageJson = ctx.files.get('package.json');
  if (packageJson?.content) {
    try {
      const pkg = JSON.parse(packageJson.content);
      if (pkg.engines?.node) {
        nodeVersion = pkg.engines.node;
        nodeEvidence.push({ source: 'package.json', value: pkg.engines.node, message: 'Found node engine in package.json' });
      }
    } catch (e) {
      // Ignore parse error
    }
  }

  if (nodeEvidence.length > 0 || packageJson) {
    runtimes.push({
      id: 'node',
      name: 'Node.js',
      category: 'runtime',
      version: nodeVersion,
      confidence: nodeEvidence.length > 0 ? 'high' : 'medium',
      evidence: nodeEvidence.length > 0 ? nodeEvidence : [{ source: 'package.json', message: 'Inferred Node.js from package.json existence' }]
    });
  }

  // Python
  let pythonVersion: string | undefined;
  let pythonEvidence = [];

  const pythonVersionFile = ctx.files.get('.python-version');
  if (pythonVersionFile?.content) {
    pythonVersion = pythonVersionFile.content.trim();
    pythonEvidence.push({ source: '.python-version', value: pythonVersion, message: 'Found .python-version file' });
  }

  // Very naive pyproject.toml check for version if it exists
  const pyproject = ctx.files.get('pyproject.toml');
  if (pyproject?.content) {
    const match = pyproject.content.match(/python\s*=\s*"([^"]+)"/);
    if (match) {
      pythonVersion = match[1];
      pythonEvidence.push({ source: 'pyproject.toml', value: pythonVersion, message: 'Found python version in pyproject.toml' });
    }
  }

  if (pythonEvidence.length > 0 || pyproject || ctx.files.has('requirements.txt')) {
    runtimes.push({
      id: 'python',
      name: 'Python',
      category: 'runtime',
      version: pythonVersion,
      confidence: pythonEvidence.length > 0 ? 'high' : 'medium',
      evidence: pythonEvidence.length > 0 ? pythonEvidence : [{ source: 'requirements.txt', message: 'Inferred Python runtime from manifest' }]
    });
  }

  return runtimes;
}
