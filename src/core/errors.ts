export class DevsHubError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DevsHubError';
  }
}

export class RepositoryNotFoundError extends DevsHubError {
  constructor(owner: string, repo: string) {
    super(`Repository not found: ${owner}/${repo}. It may be private or deleted.`);
    this.name = 'RepositoryNotFoundError';
  }
}

export class RepositoryRateLimitError extends DevsHubError {
  public resetTime?: Date;
  constructor(message?: string, resetTime?: Date) {
    super(message || 'GitHub API rate limit reached. Please try again later.');
    this.name = 'RepositoryRateLimitError';
    this.resetTime = resetTime;
  }
}

export class RepositoryAccessError extends DevsHubError {
  constructor(message: string) {
    super(message);
    this.name = 'RepositoryAccessError';
  }
}

export class RepositoryAnalysisLimitError extends DevsHubError {
  constructor(message: string) {
    super(message);
    this.name = 'RepositoryAnalysisLimitError';
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}
