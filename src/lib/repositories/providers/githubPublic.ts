import type { ProjectFileSummary } from '../../../core/project/types';
import { RepositoryMetadata, RepositoryProvider } from './types';

export function parseGitHubUrl(input: string): { owner: string; repo: string } {
  let urlStr = input.trim();
  if (!urlStr.startsWith('http://') && !urlStr.startsWith('https://')) {
    urlStr = 'https://' + urlStr;
  }
  let url: URL;
  try {
    url = new URL(urlStr);
  } catch (e) {
    throw new Error('Invalid URL format');
  }

  if (url.hostname !== 'github.com') {
    throw new Error('Only github.com URLs are supported');
  }

  const parts = url.pathname.split('/').filter(Boolean);
  if (parts.length < 2) {
    throw new Error('Invalid GitHub repository URL');
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
  
  // Accept optional token for rate limits if passed by env/config later
  private headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json'
  };

  constructor(inputUrl: string) {
    const { owner, repo } = parseGitHubUrl(inputUrl);
    this.owner = owner;
    this.repo = repo;
  }

  async getMetadata(): Promise<RepositoryMetadata> {
    const res = await fetch(`https://api.github.com/repos/${this.owner}/${this.repo}`, {
      headers: this.headers
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch repository metadata: ${res.statusText}`);
    }

    const data = await res.json();
    this.defaultBranch = data.default_branch;

    return {
      name: data.name,
      owner: data.owner.login,
      defaultBranch: data.default_branch,
      url: data.html_url
    };
  }

  async getTree(): Promise<ProjectFileSummary[]> {
    if (!this.defaultBranch) {
      await this.getMetadata();
    }

    const res = await fetch(`https://api.github.com/repos/${this.owner}/${this.repo}/git/trees/${this.defaultBranch}?recursive=1`, {
      headers: this.headers
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch repository tree: ${res.statusText}`);
    }

    const data = await res.json();
    return data.tree
      .filter((item: any) => item.type === 'blob')
      .map((item: any) => ({
        path: item.path,
        size: item.size
      }));
  }

  async readFile(path: string): Promise<string | null> {
    if (!this.defaultBranch) {
      await this.getMetadata();
    }

    const res = await fetch(`https://raw.githubusercontent.com/${this.owner}/${this.repo}/${this.defaultBranch}/${path}`);
    
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to read file ${path}: ${res.statusText}`);
    }

    return await res.text();
  }
}
