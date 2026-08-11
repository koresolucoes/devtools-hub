import { ProjectFileSummary } from '../../../core/project/types';

export interface RepositoryMetadata {
  name: string;
  owner: string;
  defaultBranch: string;
  url: string;
  isPrivate?: boolean;
  isArchived?: boolean;
  id?: number;
}

export interface RepositoryTree {
  files: ProjectFileSummary[];
  truncated: boolean;
}

export interface RepositoryProvider {
  getMetadata(): Promise<RepositoryMetadata>;
  getTree(): Promise<RepositoryTree>;
  readFile(path: string): Promise<string | null>;
}
