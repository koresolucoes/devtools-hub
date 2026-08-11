import type { Dependency, DependencyParser } from './types';

export const requirementsTxtParser: DependencyParser = {
  filename: 'requirements.txt',
  parse(content: string): Dependency[] {
    const deps: Dependency[] = [];
    const lines = content.split('\n');

    for (let line of lines) {
      line = line.split('#')[0].trim();
      if (!line) continue;

      const parts = line.split(/==|>=|<=|~=|>|</);
      if (parts.length > 0) {
        const name = parts[0].trim();
        const match = line.match(/==([^;]+)/);
        const resolvedVersion = match ? match[1].trim() : undefined;
        
        deps.push({ 
          name, 
          ecosystem: 'PyPI', 
          declaredRange: line, 
          resolvedVersion,
          resolutionStatus: resolvedVersion ? 'resolved' : 'unresolved',
          direct: true, 
          dev: false, 
          transitive: false,
          source: 'requirements.txt' 
        });
      }
    }

    return deps;
  }
};
