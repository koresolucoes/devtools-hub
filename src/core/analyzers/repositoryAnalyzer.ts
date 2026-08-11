import { ProjectFileSummary, ProjectIR, RepositoryContext } from '../project/types';
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
import { getErrorMessage } from '../errors';
import { packageJsonParser } from '../dependencies/packageJson';
import { requirementsTxtParser } from '../dependencies/requirementsTxt';
import { packageLockParser } from '../dependencies/packageLock';
import { resolveDependencies } from '../dependencies/resolveDependencies';
import type { Dependency } from '../project/types';

const MAX_ANALYZED_FILES = 60;
const MAX_FILE_SIZE_BYTES = 512 * 1024; // 512 KB
const MAX_TOTAL_ANALYSIS_BYTES = 3 * 1024 * 1024; // 3 MB
const MAX_CONCURRENCY = 5;

function prioritizeRelevantFiles(files: ProjectFileSummary[]): ProjectFileSummary[] {
  // Score files: lower number = higher priority
  const getScore = (path: string): number => {
    const isRoot = !path.includes('/');
    
    // Tier 1: Core manifests (root preferred)
    if (path.match(/^(package\.json|pyproject\.toml|requirements\.txt|pom\.xml|build\.gradle)$/)) return isRoot ? 1 : 2;
    // Tier 2: Lockfiles and environment config
    if (path.match(/^(package-lock\.json|yarn\.lock|pnpm-lock\.yaml|poetry\.lock|Pipfile\.lock|\.env.*)$/)) return isRoot ? 3 : 4;
    // Tier 3: Configs (tsconfig, vite, next, etc)
    if (path.match(/^.*\.(config|rc)\.(js|ts|json|cjs|mjs)$/) || path === 'tsconfig.json') return isRoot ? 5 : 6;
    // Tier 4: CI / CD and Docker
    if (path.startsWith('.github/workflows/') || path.startsWith('.gitlab-ci.yml')) return 7;
    if (path.match(/Dockerfile|docker-compose/)) return isRoot ? 8 : 9;
    
    // Default fallback
    return 20;
  };

  return [...files].sort((a, b) => getScore(a.path) - getScore(b.path));
}

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
  
  const treeResult = await provider.getTree();
  ir.files = treeResult.files;

  if (treeResult.truncated) {
    ir.analysis.partial = true;
    ir.analysis.warnings.push("GitHub returned a truncated repository tree.");
  }

  const relevantFiles = filterRelevantFiles(treeResult.files);
  const prioritizedFiles = prioritizeRelevantFiles(relevantFiles);

  const filesToFetch = prioritizedFiles.slice(0, MAX_ANALYZED_FILES);
  if (prioritizedFiles.length > MAX_ANALYZED_FILES) {
    ir.analysis.partial = true;
    ir.analysis.warnings.push(`Exceeded max analyzed files limit of ${MAX_ANALYZED_FILES}. Only first ${MAX_ANALYZED_FILES} files were fetched.`);
  }
  
  const ctx: DetectorContext = {
    tree: treeResult.files,
    files: new Map()
  };

  let totalBytes = 0;
  
  const declaredDeps: Dependency[] = [];
  const resolvedDeps: Dependency[] = [];
  
  // Chunking for concurrency limits
  for (let i = 0; i < filesToFetch.length; i += MAX_CONCURRENCY) {
    const chunk = filesToFetch.slice(i, i + MAX_CONCURRENCY);
    
    await Promise.all(chunk.map(async (file) => {
      // Check size before downloading
      if (file.size && file.size > MAX_FILE_SIZE_BYTES) {
        ir.analysis.warnings.push(`Skipped ${file.path}: Exceeds max file size (${file.size} bytes).`);
        return;
      }
      if (totalBytes >= MAX_TOTAL_ANALYSIS_BYTES) {
        ir.analysis.partial = true;
        return;
      }

      try {
        const content = await provider.readFile(file.path);
        if (content) {
          const size = new Blob([content]).size;
          totalBytes += size;

          if (totalBytes > MAX_TOTAL_ANALYSIS_BYTES) {
            ir.analysis.partial = true;
            ir.analysis.warnings.push(`Analysis stopped: Exceeded max total bytes limit (${MAX_TOTAL_ANALYSIS_BYTES}).`);
            return;
          }

          ctx.files.set(file.path, { path: file.path, content });
          
          if (file.path.endsWith('package.json')) {
            ir.manifests.push({ path: file.path, type: 'package.json' });
            try {
              const pkg = JSON.parse(content);
              ir.scripts = { ...ir.scripts, ...(pkg.scripts || {}) };
              declaredDeps.push(...packageJsonParser.parse(content));
            } catch(e) {}
          } else if (file.path.endsWith('package-lock.json')) {
            resolvedDeps.push(...packageLockParser.parse(content));
          } else if (file.path.endsWith('requirements.txt')) {
            ir.manifests.push({ path: file.path, type: 'requirements.txt' });
            declaredDeps.push(...requirementsTxtParser.parse(content));
          } else if (file.path.endsWith('pyproject.toml')) {
            ir.manifests.push({ path: file.path, type: 'pyproject.toml' });
          }
        }
      } catch (e: unknown) {
        ir.analysis.warnings.push(`Failed to read file ${file.path}: ${getErrorMessage(e)}`);
      }
    }));

    if (totalBytes >= MAX_TOTAL_ANALYSIS_BYTES) break;
  }
  
  ir.dependencies = resolveDependencies(declaredDeps, resolvedDeps);

  // Deduplicate dependencies that might have been parsed multiple times
  const depMap = new Map();
  for (const dep of ir.dependencies) {
    if (!depMap.has(dep.name)) {
      depMap.set(dep.name, dep);
    }
  }
  ir.dependencies = Array.from(depMap.values());

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
