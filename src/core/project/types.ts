export type Confidence = 'high' | 'medium' | 'low';

export interface Evidence {
  source: string;
  file?: string;
  path?: string;
  line?: number;
  value?: string;
  message: string;
}

export interface DetectedTechnology {
  id: string;
  name: string;
  category: 
    | 'language' 
    | 'framework' 
    | 'runtime' 
    | 'database' 
    | 'deployment' 
    | 'ci' 
    | 'testing' 
    | 'linting' 
    | 'typechecking' 
    | 'ai' 
    | 'agent' 
    | 'tooling';
  version?: string;
  confidence: Confidence;
  evidence: Evidence[];
}

export interface Dependency {
  name: string;
  version: string;
  ecosystem: 'npm' | 'PyPI';
  direct: boolean;
  dev: boolean;
  source: string;
  evidence?: Evidence[];
}

export interface PackageManagerInfo {
  name: 'npm' | 'yarn' | 'pnpm' | 'bun' | 'pip' | 'poetry' | 'uv' | 'unknown';
  version?: string;
  confidence: Confidence;
  evidence: Evidence[];
}

export interface ProjectManifest {
  path: string;
  type: 'package.json' | 'pyproject.toml' | 'requirements.txt';
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

export interface CIInfo {
  name: string;
  provider: 'github_actions' | 'gitlab_ci' | 'unknown';
  workflows: string[];
}

export interface DockerInfo {
  hasDockerfile: boolean;
  hasCompose: boolean;
  images: string[];
}

export interface MCPInfo {
  servers: string[];
}

export interface AgentInfo {
  name: string;
  type: 'claude' | 'cursor' | 'copilot' | 'custom';
}

export interface ProjectFileSummary {
  path: string;
  size?: number;
  type?: string;
}

/**
 * Project Intermediate Representation (ProjectIR)
 * Source of truth for all tools (Pipeline, Project Doctor, OSV Scanner)
 */
export interface ProjectIR {
  schemaVersion: '1';
  repository: RepositoryContext;
  
  languages: DetectedTechnology[];
  frameworks: DetectedTechnology[];
  runtimes: DetectedTechnology[];
  packageManagers: PackageManagerInfo[];
  
  manifests: ProjectManifest[];
  scripts: Record<string, string>;
  dependencies: Dependency[];
  
  infrastructure: {
    ci: CIInfo[];
    docker?: DockerInfo;
    deployments: DetectedTechnology[];
  };
  
  quality: {
    tests: DetectedTechnology[];
    linters: DetectedTechnology[];
    typecheckers: DetectedTechnology[];
  };
  
  environment: {
    declaredVariables: EnvironmentVariable[];
    sourceFiles: string[];
  };
  
  databases: DetectedTechnology[];
  
  ai: {
    providers: DetectedTechnology[];
    sdkDependencies: Dependency[];
    mcp?: MCPInfo;
    agents?: AgentInfo[];
  };
  
  files: ProjectFileSummary[];
  
  analysis: {
    partial: boolean;
    warnings: string[];
    analyzedAt: string;
    analyzerVersion: string;
  };
}
