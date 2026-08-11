import { GitHubPublicRepositoryProvider } from '../lib/repositories/providers/githubPublic';
import { analyzeRepository } from './analyzers/repositoryAnalyzer';
import { runRules } from './rules';
import { calculateProjectHealth, ProjectHealth } from './scoring/projectHealth';
import { ProjectIR } from './project/types';
import { Finding } from './rules/types';

export interface AnalysisResult {
  project: ProjectIR;
  findings: Finding[];
  health: ProjectHealth;
}

export async function analyzeProject(repositoryUrl: string): Promise<AnalysisResult> {
  const provider = new GitHubPublicRepositoryProvider(repositoryUrl);
  
  const project = await analyzeRepository(provider);
  const findings = runRules(project);
  const health = calculateProjectHealth(project, findings);

  return {
    project,
    findings,
    health
  };
}
