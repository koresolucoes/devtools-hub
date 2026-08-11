import type { Dependency, DependencyParser } from './types';

export const packageLockParser: DependencyParser = {
  filename: 'package-lock.json',
  parse(content: string): Dependency[] {
    try {
      const parsed = JSON.parse(content);
      const deps: Dependency[] = [];
      
      if (parsed.lockfileVersion >= 2 && parsed.packages) {
        const root = parsed.packages[''];
        const directDeps = new Set(Object.keys(root?.dependencies || {}));
        const devDeps = new Set(Object.keys(root?.devDependencies || {}));
        
        for (const [path, pkg] of Object.entries(parsed.packages)) {
          if (path === '') continue; // Skip root
          
          if (!path.startsWith('node_modules/')) continue;
          
          const parts = path.split('node_modules/');
          const name = parts[parts.length - 1];
          
          const isTopLevel = path === `node_modules/${name}`;
          const isDirect = isTopLevel && (directDeps.has(name) || devDeps.has(name));
          const isDev = isDirect ? devDeps.has(name) : Boolean((pkg as any).dev);
          const isTransitive = !isDirect;
          
          deps.push({
            name,
            ecosystem: 'npm',
            resolvedVersion: (pkg as any).version as string,
            resolutionStatus: 'resolved',
            direct: isDirect,
            dev: isDev,
            transitive: isTransitive,
            source: 'package-lock.json',
            lockfile: 'package-lock.json',
            packagePath: path
          });
        }
      }
      
      return deps;
    } catch {
      return [];
    }
  }
};
