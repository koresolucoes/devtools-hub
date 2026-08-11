import type { RepositoryFile } from '../../lib/repositories/providers/githubPublic';
import type { ProjectIR } from '../project/types';
import { createEmptyProjectIR } from '../project/createProjectIR';
import { detectNodeEcosystem, detectCI } from './detectors/node';

export function analyzeRepository(files: RepositoryFile[], repoContext = { provider: 'local', owner: 'unknown', repo: 'unknown', defaultBranch: 'main', url: '' }): ProjectIR {
  const ir = createEmptyProjectIR(repoContext as any);
  
  const ctx = { files };

  detectNodeEcosystem(ctx, ir);
  detectCI(ctx, ir);
  
  return ir;
}
