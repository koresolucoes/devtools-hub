import { ProjectFileSummary } from '../../../core/project/types';

export interface RepositoryMetadata {
  name: string;
  owner: string;
  defaultBranch: string;
  url: string;
}

export interface RepositoryProvider {
  getMetadata(): Promise<RepositoryMetadata>;
  getTree(): Promise<ProjectFileSummary[]>;
  readFile(path: string): Promise<string | null>;
}
