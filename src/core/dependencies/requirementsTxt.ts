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
        // Just extract the name and leave version fuzzy if not exact
        deps.push({ name, version: '*', ecosystem: 'PyPI', direct: true, dev: false, source: 'requirements.txt' });
      }
    }

    return deps;
  }
};
