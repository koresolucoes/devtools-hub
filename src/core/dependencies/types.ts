export interface ParsedDependency {
  name: string;
  version: string;
  ecosystem: 'npm' | 'PyPI';
}

export interface DependencyParser {
  filename: string;
  parse(content: string): ParsedDependency[];
}
