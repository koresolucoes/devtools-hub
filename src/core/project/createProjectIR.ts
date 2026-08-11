import type { ProjectIR, RepositoryContext } from './types';

/**
 * Creates an empty, valid ProjectIR with default unknown values.
 * This ensures the object always conforms to the schema.
 */
export function createEmptyProjectIR(repo: RepositoryContext): ProjectIR {
  return {
    schemaVersion: '1',
    repository: repo,
    
    languages: [],
    frameworks: [],
    runtimes: [],
    packageManagers: [],
    
    manifests: [],
    scripts: {},
    dependencies: [],
    
    infrastructure: {
      ci: [],
      deployments: []
    },
    
    quality: {
      tests: { tools: [], commands: [], files: [] },
      linters: [],
      typecheckers: []
    },
    
    environment: {
      declaredVariables: [],
      sourceFiles: []
    },
    
    databases: [],
    
    ai: {
      providers: [],
      sdkDependencies: []
    },
    
    files: [],
    
    analysis: {
      partial: false,
      warnings: [],
      analyzedAt: new Date().toISOString(),
      analyzerVersion: '1.0.0'
    }
  };
}
