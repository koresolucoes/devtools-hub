import type { Dependency, DependencyParser } from './types';

export const packageJsonParser: DependencyParser = {
  filename: 'package.json',
  parse(content: string): Dependency[] {
    try {
      const parsed = JSON.parse(content);
      const deps: Dependency[] = [];

      if (parsed.dependencies) {
        for (const [name, version] of Object.entries(parsed.dependencies)) {
          deps.push({ 
            name, 
            ecosystem: 'npm', 
            declaredRange: version as string,
            resolutionStatus: 'unresolved',
            direct: true, 
            dev: false, 
            transitive: false,
            source: 'package.json' 
          });
        }
      }

      if (parsed.devDependencies) {
        for (const [name, version] of Object.entries(parsed.devDependencies)) {
          deps.push({ 
            name, 
            ecosystem: 'npm', 
            declaredRange: version as string,
            resolutionStatus: 'unresolved',
            direct: true, 
            dev: true, 
            transitive: false,
            source: 'package.json' 
          });
        }
      }

      return deps;
    } catch {
      return [];
    }
  }
};
