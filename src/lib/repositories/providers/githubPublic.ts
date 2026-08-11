import type { ProjectFileSummary } from '../../../core/project/types';
import { RepositoryMetadata, RepositoryProvider, RepositoryTree } from './types';
import { 
  RepositoryNotFoundError, 
  RepositoryRateLimitError, 
  RepositoryAccessError, 
  getErrorMessage 
} from '../../../core/errors';

export interface GitHubTreeItem {
  path: string;
  mode: string;
  type: string;
  sha: string;
  size?: number;
  url: string;
}

export interface GitHubTreeResponse {
  sha: string;
  url: string;
  tree: GitHubTreeItem[];
  truncated: boolean;
}

export interface GitHubRepositoryResponse {
  name: string;
  owner: { login: string };
  default_branch: string;
  html_url: string;
  private: boolean;
  archived: boolean;
  id: number;
}

export function parseGitHubUrl(input: string): { owner: string; repo: string } {
  let urlStr = input.trim();
  
  if (urlStr.endsWith('.git')) {
    urlStr = urlStr.slice(0, -4);
  }

  // Handle owner/repo format
  if (!urlStr.includes('://') && urlStr.split('/').length === 2) {
    urlStr = 'https://github.com/' + urlStr;
  } else if (!urlStr.startsWith('http://') && !urlStr.startsWith('https://')) {
    urlStr = 'https://' + urlStr;
  }
  
  let url: URL;
  try {
    url = new URL(urlStr);
  } catch (e) {
    throw new RepositoryAccessError('Invalid URL format');
  }

  if (url.hostname !== 'github.com') {
    throw new RepositoryAccessError('Only github.com URLs are supported');
  }

  const parts = url.pathname.split('/').filter(Boolean);
  if (parts.length < 2) {
    throw new RepositoryAccessError('Invalid GitHub repository URL');
  }

  // Reject deep links
  if (parts.length > 2) {
    throw new RepositoryAccessError('Provide a repository root URL, not a deep link (e.g. tree, issues).');
  }

  return {
    owner: parts[0],
    repo: parts[1]
  };
}

export class GitHubPublicRepositoryProvider implements RepositoryProvider {
  private owner: string;
  private repo: string;
  private defaultBranch: string | null = null;
  
  private headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json'
  };

  constructor(inputUrl: string) {
    const { owner, repo } = parseGitHubUrl(inputUrl);
    this.owner = owner;
    this.repo = repo;
  }

  private handleApiError(res: Response, fallbackMessage: string): never {
    if (res.status === 404) {
      throw new RepositoryNotFoundError(this.owner, this.repo);
    }
    if (res.status === 403 || res.status === 429) {
      const resetStr = res.headers.get('x-ratelimit-reset');
      let resetTime: Date | undefined;
      if (resetStr) {
        resetTime = new Date(parseInt(resetStr) * 1000);
      }
      throw new RepositoryRateLimitError(
        `GitHub API rate limit reached. ${resetTime ? `Resets at ${resetTime.toLocaleTimeString()}` : 'Try again later.'}`, 
        resetTime
      );
    }
    throw new RepositoryAccessError(`${fallbackMessage}: HTTP ${res.status} ${res.statusText}`);
  }

  async getMetadata(): Promise<RepositoryMetadata> {
    try {
      const res = await fetch(`https://api.github.com/repos/${this.owner}/${this.repo}`, {
        headers: this.headers
      });

      if (!res.ok) {
        this.handleApiError(res, 'Failed to fetch repository metadata');
      }

      const data = await res.json() as GitHubRepositoryResponse;
      this.defaultBranch = data.default_branch;

      return {
        name: data.name,
        owner: data.owner.login,
        defaultBranch: data.default_branch,
        url: data.html_url,
        isPrivate: data.private,
        isArchived: data.archived,
        id: data.id
      };
    } catch (e) {
      if (e instanceof RepositoryNotFoundError || e instanceof RepositoryRateLimitError || e instanceof RepositoryAccessError) {
        throw e;
      }
      throw new RepositoryAccessError(`Failed to fetch metadata: ${getErrorMessage(e)}`);
    }
  }

  async getTree(): Promise<RepositoryTree> {
    if (!this.defaultBranch) {
      await this.getMetadata();
    }

    try {
      const res = await fetch(`https://api.github.com/repos/${this.owner}/${this.repo}/git/trees/${this.defaultBranch}?recursive=1`, {
        headers: this.headers
      });

      if (!res.ok) {
        this.handleApiError(res, 'Failed to fetch repository tree');
      }

      const data = await res.json() as GitHubTreeResponse;
      
      const files: ProjectFileSummary[] = data.tree
        .filter(item => item.type === 'blob' && item.path)
        .map(item => ({
          path: item.path,
          size: item.size
        }));

      return {
        files,
        truncated: data.truncated === true
      };
    } catch (e) {
      if (e instanceof RepositoryNotFoundError || e instanceof RepositoryRateLimitError || e instanceof RepositoryAccessError) {
        throw e;
      }
      throw new RepositoryAccessError(`Failed to fetch tree: ${getErrorMessage(e)}`);
    }
  }

  async readFile(path: string): Promise<string | null> {
    if (!this.defaultBranch) {
      await this.getMetadata();
    }

    try {
      const res = await fetch(`https://raw.githubusercontent.com/${this.owner}/${this.repo}/${this.defaultBranch}/${path}`);
      
      if (!res.ok) {
        if (res.status === 404) return null;
        if (res.status === 403 || res.status === 429) {
          throw new RepositoryRateLimitError('GitHub API rate limit reached while reading file.');
        }
        throw new RepositoryAccessError(`Failed to read file ${path}: HTTP ${res.status}`);
      }

      return await res.text();
    } catch (e) {
      if (e instanceof RepositoryRateLimitError || e instanceof RepositoryAccessError) {
        throw e;
      }
      throw new RepositoryAccessError(`Failed to read file ${path}: ${getErrorMessage(e)}`);
    }
  }
}
