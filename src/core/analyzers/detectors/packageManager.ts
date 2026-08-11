import { PackageManagerInfo, Evidence } from '../../project/types';
import { DetectorContext } from './types';

export function detectPackageManagers(ctx: DetectorContext): PackageManagerInfo[] {
  const managers: PackageManagerInfo[] = [];

  // 1. Check Node package managers
  let nodeEvidence: Evidence[] = [];
  let nodeManagerName: PackageManagerInfo['name'] | null = null;
  let nodeManagerVersion: string | undefined;

  const packageJson = ctx.files.get('package.json');
  if (packageJson?.content) {
    try {
      const pkg = JSON.parse(packageJson.content);
      if (pkg.packageManager) {
        const [name, version] = pkg.packageManager.split('@');
        if (['npm', 'yarn', 'pnpm', 'bun'].includes(name)) {
          nodeManagerName = name as PackageManagerInfo['name'];
          nodeManagerVersion = version;
          nodeEvidence.push({
            source: 'package.json',
            value: pkg.packageManager,
            message: 'Declared in packageManager field'
          });
        }
      }
    } catch (e) {
      // ignore
    }
  }

  // Look for lockfiles
  const nodeLockfiles: Record<string, PackageManagerInfo['name']> = {
    'package-lock.json': 'npm',
    'yarn.lock': 'yarn',
    'pnpm-lock.yaml': 'pnpm',
    'bun.lockb': 'bun',
    'bun.lock': 'bun'
  };

  for (const [lockfile, name] of Object.entries(nodeLockfiles)) {
    if (ctx.files.has(lockfile)) {
      if (!nodeManagerName) {
        nodeManagerName = name;
      }
      nodeEvidence.push({
        source: lockfile,
        message: `Found ${lockfile}`
      });
    }
  }

  if (nodeManagerName) {
    managers.push({
      name: nodeManagerName,
      version: nodeManagerVersion,
      confidence: nodeEvidence.length > 1 || nodeManagerVersion ? 'high' : 'medium',
      evidence: nodeEvidence
    });
  }

  // 2. Check Python package managers
  let pythonEvidence: Evidence[] = [];
  let pythonManagerName: PackageManagerInfo['name'] | null = null;

  if (ctx.files.has('poetry.lock')) {
    pythonManagerName = 'poetry';
    pythonEvidence.push({ source: 'poetry.lock', message: 'Found poetry.lock' });
  } else if (ctx.files.has('uv.lock')) {
    pythonManagerName = 'uv';
    pythonEvidence.push({ source: 'uv.lock', message: 'Found uv.lock' });
  } else if (ctx.files.has('Pipfile')) {
    pythonManagerName = 'pip';
    pythonEvidence.push({ source: 'Pipfile', message: 'Found Pipfile' });
  } else if (ctx.files.has('requirements.txt')) {
    pythonManagerName = 'pip';
    pythonEvidence.push({ source: 'requirements.txt', message: 'Found requirements.txt' });
  }

  if (pythonManagerName) {
    managers.push({
      name: pythonManagerName,
      confidence: pythonEvidence.length > 0 ? 'high' : 'medium',
      evidence: pythonEvidence
    });
  }

  return managers;
}
