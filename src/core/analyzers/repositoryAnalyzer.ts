//
import { ProjectIR, RepositoryContext } from '../project/types';
import { createEmptyProjectIR } from '../project/createProjectIR';
import { filterRelevantFiles } from './relevantFiles';
import { RepositoryProvider } from '../../lib/repositories/providers/types';
import {
  DetectorContext,
  detectLanguages,
  detectRuntimes,
  detectPackageManagers,
  detectFrameworks,
  detectCI,
  detectQualityTools,
  detectDocker,
  detectDeployments,
  detectEnvironmentVariables
} from './detectors';

const MAX_ANALYZED_FILES = 50;

export async function analyzeRepository(provider: RepositoryProvider): Promise<ProjectIR> {
  const metadata = await provider.getMetadata();
  const repoContext: RepositoryContext = {
    provider: 'github',
    owner: metadata.owner,
    repo: metadata.name,
    defaultBranch: metadata.defaultBranch,
    url: metadata.url
  };

  const ir = createEmptyProjectIR(repoContext);
  
  const fullTree = await provider.getTree();
  ir.files = fullTree;

  const relevantFiles = filterRelevantFiles(fullTree);
  
  if (relevantFiles.length > MAX_ANALYZED_FILES) {
    ir.analysis.partial = true;
    ir.analysis.warnings.push(`Exceeded max analyzed files limit of ${MAX_ANALYZED_FILES}. Only first ${MAX_ANALYZED_FILES} will be fetched.`);
  }

  const filesToFetch = relevantFiles.slice(0, MAX_ANALYZED_FILES);
  
  const ctx: DetectorContext = {
    tree: fullTree,
    files: new Map()
  };

  for (const file of filesToFetch) {
    try {
      const content = await provider.readFile(file.path);
      ctx.files.set(file.path, { path: file.path, content });
      
      if (file.path === 'package.json' && content) {
        ir.manifests.push({ path: file.path, type: 'package.json' });
        try {
          const pkg = JSON.parse(content);
          ir.scripts = pkg.scripts || {};
        } catch(e) {}
      } else if (file.path === 'requirements.txt') {
        ir.manifests.push({ path: file.path, type: 'requirements.txt' });
      } else if (file.path === 'pyproject.toml') {
        ir.manifests.push({ path: file.path, type: 'pyproject.toml' });
      }
    } catch (e: any) {
      ir.analysis.warnings.push(`Failed to read file ${file.path}: ${e.message}`);
    }
  }

  // Orchestrate Detectors
  ir.languages = detectLanguages(ctx);
  ir.runtimes = detectRuntimes(ctx);
  ir.packageManagers = detectPackageManagers(ctx);
  ir.frameworks = detectFrameworks(ctx);
  
  const quality = detectQualityTools(ctx);
  ir.quality.tests = quality.tests;
  ir.quality.linters = quality.linters;
  ir.quality.typecheckers = quality.typecheckers;

  ir.infrastructure.ci = detectCI(ctx);
  ir.infrastructure.docker = detectDocker(ctx);
  ir.infrastructure.deployments = detectDeployments(ctx);

  const env = detectEnvironmentVariables(ctx);
  ir.environment.declaredVariables = env.declaredVariables;
  ir.environment.sourceFiles = env.sourceFiles;

  return ir;
}
