export interface DetectedTechnology {
  name: string;
  version?: string;
  ecosystem: 'node' | 'python' | 'docker' | 'unknown';
  evidence: string[]; // e.g., ["Found package.json", "react in dependencies"]
}

export interface Dependency {
  name: string;
  version: string;
  type: 'production' | 'development' | 'peer';
}

export interface EnvironmentVariable {
  key: string;
  value?: string;
  type: 'Secret' | 'Variable';
  scope: 'global' | 'deploy' | 'test';
}

export interface RepositoryContext {
  provider: 'github' | 'gitlab' | 'local';
  owner: string;
  repo: string;
  defaultBranch: string;
  url: string;
}

/**
 * Project Intermediate Representation (ProjectIR)
 * Source of truth for all tools (Pipeline, Project Doctor, OSV Scanner)
 */
export interface ProjectIR {
  schemaVersion: '1';
  repository: RepositoryContext;
  technologies: DetectedTechnology[];
  dependencies: Dependency[];
  
  // High-level normalized facts
  primaryLanguage: 'node' | 'python' | 'go' | 'rust' | 'unknown';
  packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun' | 'pip' | 'poetry' | 'uv' | 'unknown';
  frameworks: string[]; // e.g. ["react", "nextjs", "vite"]
  
  // Execution context
  ciTool: 'github_actions' | 'gitlab_ci' | 'none';
  deployTarget: 'vercel' | 'docker' | 'unknown';
  
  hasTests: boolean;
  hasLinting: boolean;
  hasTypeChecking: boolean;
}
