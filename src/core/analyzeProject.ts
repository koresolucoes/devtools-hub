import { GitHubPublicRepositoryProvider } from '../lib/repositories/providers/githubPublic';
import { analyzeRepository } from './analyzers/repositoryAnalyzer';
import { runChecks } from './checks/runChecks';
import { calculateProjectHealth, ProjectHealth } from './scoring/projectHealth';
import { ProjectIR } from './project/types';
import { CheckResult } from './checks/types';
import { DependencyVulnerability } from './security/types';
import { scanDependencies } from './security/osvClient';
import type { SecurityScanSummary } from './security/types';

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
  let securitySummary: SecurityScanSummary = {
    status: 'skipped',
    totalDependencies: project.dependencies.length,
    resolvedDependencies: 0,
    queriedDependencies: 0,
    successfulQueries: 0,
    failedQueries: 0,
    affectedPackageVersions: 0,
    advisories: 0
  };
  
  if (options.dependencySecurity !== false && project.dependencies.length > 0) {
    try {
      onProgress('SCANNING_SECURITY', 50);
      const scanResult = await scanDependencies(project.dependencies);
      vulnerabilities = scanResult.vulnerabilities;
      securitySummary = scanResult.summary;
    } catch (e) {
      project.analysis.warnings.push('Failed to run OSV dependency scanner. Security rules will have incomplete data.');
      securitySummary.status = 'failed';
    }
  }

  // Populate basic metrics
  project.analysis.metrics = {
    repositoryFiles: project.files.length, // Total files in tree
    relevantFiles: project.files.length, // Placeholder
    selectedFiles: project.files.length, // Placeholder
    fetchedFiles: project.files.length, // Placeholder
    skippedFiles: 0,
    analyzedBytes: 0 // Placeholder
  };

  onProgress('EVALUATING_RULES', 75);
  const checks = runChecks(project, { vulnerabilities, securitySummary });
  
  onProgress('CALCULATING_HEALTH', 90);
  const health = calculateProjectHealth(project, checks);
  
  onProgress('COMPLETE', 100);

  return {
    project,
    checks,
    health
  };
}
