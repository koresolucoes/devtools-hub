import { ACTION_REGISTRY } from '../registries/actions';
import type { PipelineConfig, PipelineIR, PipelineStep, PipelinePermissions } from './types';

/**
 * Transforms UI configuration into a normalized Pipeline Intermediate Representation (Pipeline IR) AST.
 */
export function buildPipelineIR(config: PipelineConfig): PipelineIR {
  const platform = config.platform || 'github';
  const language = config.language || 'node';
  const packageManager = config.packageManager && config.packageManager !== 'auto' ? config.packageManager : (language === 'node' ? 'npm' : 'pip');
  const runtimeStrategy = config.runtimeStrategy || 'recommended';
  const nodeVersion = config.nodeVersion || '20.x';
  const pythonVersion = config.pythonVersion || '3.11';
  const triggers = config.triggers || { push: true, pr: true, cron: false };
  const caching = config.caching !== undefined ? config.caching : true;
  const linting = config.linting !== undefined ? config.linting : true;
  const testing = config.testing !== undefined ? config.testing : true;
  const containerize = config.containerize || false;
  const dockerRegistry = config.dockerRegistry || 'ghcr';
  const dockerImage = config.dockerImage || 'user/app';
  const dockerPlatforms = config.dockerPlatforms || 'linux/amd64';
  const dockerTagStrategy = config.dockerTagStrategy || 'latest';
  const deploy = config.deploy || 'none';
  const concurrency = config.concurrency !== undefined ? config.concurrency : true;
  const envVars = config.envVars || [];
  const matrixNodeVersions = config.matrixNodeVersions || ['20.x', '22.x'];
  const matrixPythonVersions = config.matrixPythonVersions || ['3.11', '3.12'];

  const steps: PipelineStep[] = [];

  steps.push({
    id: 'checkout',
    name: 'Checkout Repository',
    uses: ACTION_REGISTRY.checkout.uses
  });

  const isMatrix = runtimeStrategy === 'matrix';

  if (language === 'node') {
    const nodeSetup: PipelineStep = {
      id: 'setup-node',
      name: `Setup Node.js (${packageManager})`,
      uses: ACTION_REGISTRY.setupNode.uses,
      with: {
        'node-version': isMatrix ? '${{ matrix.node-version }}' : nodeVersion
      }
    };
    if (caching && ['npm', 'pnpm', 'yarn'].includes(packageManager)) {
      if (nodeSetup.with) nodeSetup.with.cache = packageManager;
    }
    steps.push(nodeSetup);

    if (packageManager === 'pnpm') {
      steps.splice(1, 0, { id: 'setup-pnpm', name: 'Setup pnpm', uses: 'pnpm/action-setup@v3', with: { version: '9' } });
    } else if (packageManager === 'bun') {
      steps.splice(1, 0, { id: 'setup-bun', name: 'Setup Bun', uses: 'oven-sh/setup-bun@v2', with: { 'bun-version': 'latest' } });
    }
  } else if (language === 'python') {
    const pythonSetup: PipelineStep = {
      id: 'setup-python',
      name: `Setup Python (${packageManager})`,
      uses: ACTION_REGISTRY.setupPython.uses,
      with: {
        'python-version': isMatrix ? '${{ matrix.python-version }}' : pythonVersion
      }
    };
    if (caching && ['pip', 'poetry', 'pipenv'].includes(packageManager)) {
      if (pythonSetup.with) pythonSetup.with.cache = packageManager;
    }
    steps.push(pythonSetup);

    if (packageManager === 'uv') {
      steps.push({ id: 'setup-uv', name: 'Setup uv', uses: 'astral-sh/setup-uv@v5', with: { 'enable-cache': caching ? 'true' : 'false' } });
    }
  }

  // Dependencies
  let installCmd = 'npm ci';
  if (language === 'node') {
    if (packageManager === 'pnpm') installCmd = 'pnpm install --frozen-lockfile';
    else if (packageManager === 'yarn') installCmd = 'yarn install --immutable';
    else if (packageManager === 'bun') installCmd = 'bun install --frozen-lockfile';
  } else if (language === 'python') {
    if (packageManager === 'uv') installCmd = 'uv sync';
    else if (packageManager === 'poetry') installCmd = 'poetry install';
    else if (packageManager === 'pipenv') installCmd = 'pipenv install --dev';
    else installCmd = 'python -m pip install --upgrade pip && if [ -f requirements.txt ]; then pip install -r requirements.txt; fi';
  }
  steps.push({ id: 'install-deps', name: 'Install Dependencies', run: installCmd });

  // Linting
  if (linting) {
    let lintCmd = 'npm run lint';
    if (language === 'node') {
      if (packageManager === 'pnpm') lintCmd = 'pnpm run lint';
      else if (packageManager === 'yarn') lintCmd = 'yarn lint';
      else if (packageManager === 'bun') lintCmd = 'bun run lint';
    } else if (language === 'python') {
      if (packageManager === 'uv') lintCmd = 'uv run ruff check .';
      else if (packageManager === 'poetry') lintCmd = 'poetry run flake8 .';
      else lintCmd = 'pip install flake8 && flake8 .';
    }
    steps.push({ id: 'lint', name: 'Run Linter', run: lintCmd });
  }

  // Testing
  if (testing) {
    let testCmd = 'npm test';
    if (language === 'node') {
      if (packageManager === 'pnpm') testCmd = 'pnpm test';
      else if (packageManager === 'yarn') testCmd = 'yarn test';
      else if (packageManager === 'bun') testCmd = 'bun test';
    } else if (language === 'python') {
      if (packageManager === 'uv') testCmd = 'uv run pytest';
      else if (packageManager === 'poetry') testCmd = 'poetry run pytest';
      else testCmd = 'pip install pytest && pytest';
    }
    steps.push({ id: 'test', name: 'Run Test Suite', run: testCmd });
  }

  // Containerize
  if (containerize) {
    if (dockerPlatforms.includes(',')) {
      steps.push({ id: 'setup-qemu', name: 'Set up QEMU for multi-arch build', uses: 'docker/setup-qemu-action@v3' });
    }

    steps.push({ id: 'setup-buildx', name: 'Set up Docker Buildx', uses: ACTION_REGISTRY.dockerBuildx.uses });

    let usernameSecret = '${{ secrets.DOCKERHUB_USERNAME }}';
    let tokenSecret = '${{ secrets.DOCKERHUB_TOKEN }}';
    let registryServer = '';

    if (dockerRegistry === 'ghcr') {
      registryServer = 'ghcr.io';
      usernameSecret = '${{ github.actor }}';
      tokenSecret = '${{ secrets.GITHUB_TOKEN }}';
    }

    steps.push({
      id: 'docker-login',
      name: `Login to ${dockerRegistry.toUpperCase()}`,
      uses: ACTION_REGISTRY.dockerLogin.uses,
      with: { ...(registryServer ? { registry: registryServer } : {}), username: usernameSecret, password: tokenSecret }
    });

    let tagValue = `${dockerImage}:${dockerTagStrategy === 'sha' ? '${{ github.sha }}' : 'latest'}`;
    steps.push({
      id: 'docker-build',
      name: 'Build and Push Docker Image',
      uses: ACTION_REGISTRY.dockerBuildPush.uses,
      with: { push: 'true', tags: tagValue, platforms: dockerPlatforms, 'cache-from': 'type=gha', 'cache-to': 'type=gha,mode=max' }
    });
  }

  // Deployment
  if (deploy === 'vercel') {
    const deployEnvVars = envVars.filter(v => v.scope === 'deploy' && v.key);
    const stepEnv: Record<string, string> = {};
    deployEnvVars.forEach(v => { stepEnv[v.key] = v.type === 'Secret' ? `\${{ secrets.${v.key} }}` : v.value; });

    steps.push({
      id: 'deploy-vercel',
      name: 'Deploy to Vercel',
      uses: ACTION_REGISTRY.vercel.uses,
      with: {
        'vercel-token': '${{ secrets.VERCEL_TOKEN }}',
        'vercel-org-id': '${{ secrets.VERCEL_ORG_ID }}',
        'vercel-project-id': '${{ secrets.VERCEL_PROJECT_ID }}',
        'vercel-args': '--prod'
      },
      env: Object.keys(stepEnv).length > 0 ? stepEnv : undefined
    });
  }

  // Calculate Permissions
  const permissions: PipelinePermissions = { contents: 'read' };
  if (containerize && dockerRegistry === 'ghcr') {
    permissions.packages = 'write';
  }

  return {
    platform,
    language,
    packageManager,
    runtimeStrategy,
    nodeVersion,
    pythonVersion,
    triggers,
    caching,
    linting,
    testing,
    containerize,
    dockerRegistry,
    dockerImage,
    dockerPlatforms,
    dockerTagStrategy,
    deploy,
    concurrency,
    permissions,
    envVars,
    matrixNodeVersions,
    matrixPythonVersions,
    steps
  };
}
