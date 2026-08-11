import type { ParsedDependency, DependencyParser } from './types';

export const packageJsonParser: DependencyParser = {
  filename: 'package.json',
  parse(content: string): ParsedDependency[] {
    try {
      const parsed = JSON.parse(content);
      const deps: ParsedDependency[] = [];

      if (parsed.dependencies) {
        for (const [name, version] of Object.entries(parsed.dependencies)) {
          deps.push({ name, version: version as string, ecosystem: 'npm' });
        }
      }

      if (parsed.devDependencies) {
        for (const [name, version] of Object.entries(parsed.devDependencies)) {
          deps.push({ name, version: version as string, ecosystem: 'npm' });
        }
      }

      return deps;
    } catch {
      return [];
    }
  }
};
