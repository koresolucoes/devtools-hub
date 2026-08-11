import { ProjectFileSummary } from '../../project/types';

export interface RepositoryFile {
  path: string;
  content: string | null;
}

export interface DetectorContext {
  tree: ProjectFileSummary[];
  files: Map<string, RepositoryFile>;
}
