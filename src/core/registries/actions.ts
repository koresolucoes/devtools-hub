export interface ActionRegistryEntry {
  id: string;
  repository: string;
  recommendedVersion: string;
  uses: string;
  official: boolean;
  category: 'source' | 'runtime' | 'package-manager' | 'docker' | 'deployment';
  verifiedAt: string | null;
  source?: string;
}

export const ACTION_REGISTRY: Record<string, ActionRegistryEntry> = {
  checkout: {
    id: 'actions-checkout',
    repository: 'actions/checkout',
    recommendedVersion: 'v4',
    uses: 'actions/checkout@v4',
    official: true,
    category: 'source',
    verifiedAt: '2026-08-01',
    source: 'https://github.com/actions/checkout'
  },
  setupNode: {
    id: 'actions-setup-node',
    repository: 'actions/setup-node',
    recommendedVersion: 'v4',
    uses: 'actions/setup-node@v4',
    official: true,
    category: 'runtime',
    verifiedAt: '2026-08-01',
    source: 'https://github.com/actions/setup-node'
  },
  setupPython: {
    id: 'actions-setup-python',
    repository: 'actions/setup-python',
    recommendedVersion: 'v5',
    uses: 'actions/setup-python@v5',
    official: true,
    category: 'runtime',
    verifiedAt: '2026-08-01',
    source: 'https://github.com/actions/setup-python'
  },
  dockerLogin: {
    id: 'docker-login-action',
    repository: 'docker/login-action',
    recommendedVersion: 'v3',
    uses: 'docker/login-action@v3',
    official: true,
    category: 'docker',
    verifiedAt: '2026-08-01',
    source: 'https://github.com/docker/login-action'
  },
  dockerBuildPush: {
    id: 'docker-build-push-action',
    repository: 'docker/build-push-action',
    recommendedVersion: 'v6',
    uses: 'docker/build-push-action@v6',
    official: true,
    category: 'docker',
    verifiedAt: '2026-08-01',
    source: 'https://github.com/docker/build-push-action'
  },
  dockerBuildx: {
    id: 'docker-setup-buildx-action',
    repository: 'docker/setup-buildx-action',
    recommendedVersion: 'v3',
    uses: 'docker/setup-buildx-action@v3',
    official: true,
    category: 'docker',
    verifiedAt: '2026-08-01',
    source: 'https://github.com/docker/setup-buildx-action'
  },
  vercel: {
    id: 'vercel-action',
    repository: 'amondnet/vercel-action',
    recommendedVersion: 'v25',
    uses: 'amondnet/vercel-action@v25',
    official: false,
    category: 'deployment',
    verifiedAt: '2026-08-01',
    source: 'https://github.com/amondnet/vercel-action'
  }
};
