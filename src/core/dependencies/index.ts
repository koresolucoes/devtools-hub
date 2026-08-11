import { packageJsonParser } from './packageJson';
import { packageLockParser } from './packageLock';
import { requirementsTxtParser } from './requirementsTxt';
import { resolveDependencies } from './resolveDependencies';
import type { DependencyParser } from './types';

export const DEPENDENCY_PARSERS: Record<string, DependencyParser> = {
  'package.json': packageJsonParser,
  'package-lock.json': packageLockParser,
  'requirements.txt': requirementsTxtParser
};

export { packageJsonParser, packageLockParser, requirementsTxtParser, resolveDependencies };
export type * from './types';
