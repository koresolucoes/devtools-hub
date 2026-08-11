import { Dependency } from '../project/types';

export type { Dependency };

export interface DependencyParser {
  filename: string;
  parse(content: string): Dependency[];
}
