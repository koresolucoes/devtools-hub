import { GitHubPublicRepositoryProvider } from '../lib/repositories/providers/githubPublic';
import { analyzeRepository } from './analyzers/repositoryAnalyzer';
import { runChecks } from './checks/runChecks';
import { calculateProjectHealth, ProjectHealth } from './scoring/projectHealth';
import { ProjectIR } from './project/types';
import { CheckResult } from './checks/types';
import { DependencyVulnerability } from './security/types';
import { scanDependencies } from './security/osvClient';

export interface AnalyzeProjectOptions {
  dependencySecurity?: boolean;
  onProgress?: (stage: string, progress: number) => void;
}

export interface AnalysisResult {
  project: ProjectIR;
  checks: CheckResult[];
  health: ProjectHealth;
}

export async function analyzeProject(repositoryUrl: string, options: AnalyzeProjectOptions = { dependencySecurity: true }): Promise<AnalysisResult> {
  const onProgress = options.onProgress || (() => {});
  
  onProgress('ANALYZING_REPOSITORY', 10);
  const provider = new GitHubPublicRepositoryProvider(repositoryUrl);
  const project = await analyzeRepository(provider);
  
  let vulnerabilities: DependencyVulnerability[] = [];
  
  if (options.dependencySecurity !== false && project.dependencies.length > 0) {
    try {
      onProgress('SCANNING_SECURITY', 50);
      vulnerabilities = await scanDependencies(project.dependencies);
    } catch (e) {
      project.analysis.warnings.push('Failed to run OSV dependency scanner. Security rules will have incomplete data.');
    }
  }

  onProgress('EVALUATING_RULES', 75);
  const checks = runChecks(project, { vulnerabilities });
  
  onProgress('CALCULATING_HEALTH', 90);
  const health = calculateProjectHealth(project, checks);
  
  onProgress('COMPLETE', 100);

  return {
    project,
    checks,
    health
  };
}
