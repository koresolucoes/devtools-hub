export type PipelinePlatform = 'github' | 'gitlab';
export type LanguageStack = 'node' | 'python';
export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun' | 'pip' | 'uv' | 'poetry' | 'pipenv' | 'auto';
export type RuntimeStrategy = 'recommended' | 'matrix';

export interface EnvironmentVariable {
  key: string;
  value: string;
  type: 'Secret' | 'Variable';
  scope: 'global' | 'deploy' | 'test';
}

export interface PipelineConfig {
  platform?: PipelinePlatform;
  language?: LanguageStack;
  packageManager?: PackageManager;
  runtimeStrategy?: RuntimeStrategy;
  nodeVersion?: string;
  pythonVersion?: string;
  triggers?: { push: boolean; pr: boolean; cron: boolean };
  caching?: boolean;
  linting?: boolean;
  testing?: boolean;
  containerize?: boolean;
  dockerRegistry?: string;
  dockerImage?: string;
  dockerPlatforms?: string;
  dockerTagStrategy?: string;
  deploy?: string;
  concurrency?: boolean;
  envVars?: EnvironmentVariable[];
  matrixNodeVersions?: string[];
  matrixPythonVersions?: string[];
}

export interface PipelineStep {
  id: string;
  name: string;
  uses?: string;
  run?: string;
  with?: Record<string, string | boolean | undefined>;
  env?: Record<string, string>;
}

export interface PipelinePermissions {
  contents?: string;
  packages?: string;
  [key: string]: string | undefined;
}

export interface PipelineIR {
  platform: PipelinePlatform;
  language: LanguageStack;
  packageManager: PackageManager;
  runtimeStrategy: RuntimeStrategy;
  nodeVersion: string;
  pythonVersion: string;
  triggers: { push: boolean; pr: boolean; cron: boolean };
  caching: boolean;
  linting: boolean;
  testing: boolean;
  containerize: boolean;
  dockerRegistry: string;
  dockerImage: string;
  dockerPlatforms: string;
  dockerTagStrategy: string;
  deploy: string;
  concurrency: boolean;
  permissions: PipelinePermissions;
  envVars: EnvironmentVariable[];
  matrixNodeVersions: string[];
  matrixPythonVersions: string[];
  steps: PipelineStep[];
}

export interface HealthScoreBreakdown {
  score: number;
  reasons: string[];
}

export interface PipelineHealthStats {
  score: number;
  ratingLabel: string;
  breakdown: {
    security: HealthScoreBreakdown;
    reliability: HealthScoreBreakdown;
    performance: HealthScoreBreakdown;
    maintainability: HealthScoreBreakdown;
  };
}

export interface ValidationResult {
  valid: boolean;
  issues: string[];
}
