import { packageJsonParser } from './packageJson';
import { requirementsTxtParser } from './requirementsTxt';

export * from './types';

export const DEPENDENCY_PARSERS = {
  'package.json': packageJsonParser,
  'requirements.txt': requirementsTxtParser
};
