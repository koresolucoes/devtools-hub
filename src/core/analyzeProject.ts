import { GitHubPublicRepositoryProvider } from '../lib/repositories/providers/githubPublic';
import { analyzeRepository } from './analyzers/repositoryAnalyzer';
import { runRules } from './rules';
import { calculateProjectHealth, ProjectHealth } from './scoring/projectHealth';
import { ProjectIR } from './project/types';
import { Finding, DependencyVulnerability } from './rules/types';
// @ts-ignore
import { scanDependencies } from '../services/scanner';

export interface AnalyzeProjectOptions {
  dependencySecurity?: boolean;
}

export interface AnalysisResult {
  project: ProjectIR;
  findings: Finding[];
  health: ProjectHealth;
}

export async function analyzeProject(repositoryUrl: string, options: AnalyzeProjectOptions = { dependencySecurity: true }): Promise<AnalysisResult> {
  const provider = new GitHubPublicRepositoryProvider(repositoryUrl);
  
  const project = await analyzeRepository(provider);
  
  let vulnerabilities: DependencyVulnerability[] = [];
  
  if (options.dependencySecurity !== false && project.dependencies.length > 0) {
    try {
      const scanResults = await scanDependencies(project.dependencies);
      for (const res of scanResults) {
        for (const detail of res.details) {
          vulnerabilities.push({
            id: detail.id,
            packageName: res.name,
            installedVersion: res.version,
            // Best effort since ecosystem is not explicitly passed back in formatVulnerabilities
            ecosystem: project.dependencies.find(d => d.name === res.name)?.ecosystem || 'npm',
            severity: res.severity as any,
            summary: detail.summary,
            fixedVersion: detail.fixedIn !== 'Desconhecida' ? detail.fixedIn : undefined,
            sourceUrl: detail.url
          });
        }
      }
    } catch (e) {
      project.analysis.warnings.push('Failed to run OSV dependency scanner. Security rules will have incomplete data.');
    }
  }

  const findings = runRules(project, { vulnerabilities });
  const health = calculateProjectHealth(project, findings);

  return {
    project,
    findings,
    health
  };
}
