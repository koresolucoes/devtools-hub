import type { ProjectIR, RepositoryContext } from './types';

/**
 * Creates an empty, valid ProjectIR with default unknown values.
 * This ensures the object always conforms to the schema.
 */
export function createEmptyProjectIR(repo: RepositoryContext): ProjectIR {
  return {
    schemaVersion: '1',
    repository: repo,
    technologies: [],
    dependencies: [],
    
    primaryLanguage: 'unknown',
    packageManager: 'unknown',
    frameworks: [],
    
    ciTool: 'none',
    deployTarget: 'unknown',
    
    hasTests: false,
    hasLinting: false,
    hasTypeChecking: false
  };
}
