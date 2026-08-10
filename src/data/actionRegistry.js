// Internal registry with current stable versions for GitHub Actions and Docker integration
export const ACTION_REGISTRY = {
  checkout: {
    uses: 'actions/checkout@v6',
    description: 'Official checkout action for fetching repo source'
  },
  setupNode: {
    uses: 'actions/setup-node@v4',
    description: 'Setup Node.js environment with caching'
  },
  setupPython: {
    uses: 'actions/setup-python@v6',
    description: 'Setup Python environment with caching'
  },
  dockerLogin: {
    uses: 'docker/login-action@v4',
    description: 'Official Docker login action'
  },
  dockerBuildx: {
    uses: 'docker/setup-buildx-action@v3',
    description: 'Docker Buildx multi-platform build setup'
  },
  dockerBuildPush: {
    uses: 'docker/build-push-action@v7',
    description: 'Build and push Docker images using Buildx'
  },
  vercel: {
    uses: 'amondnet/vercel-action@v25',
    description: 'Deploy project to Vercel'
  }
};
