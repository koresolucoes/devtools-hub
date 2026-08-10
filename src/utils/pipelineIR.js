import { ACTION_REGISTRY } from '../data/actionRegistry';

/**
 * Transforms UI configuration into a normalized Pipeline Intermediate Representation (Pipeline IR) AST.
 */
export function buildPipelineIR(config) {
  const {
    platform = 'github',
    language = 'node', // 'node' | 'python'
    packageManager = language === 'node' ? 'npm' : 'pip', 
    runtimeStrategy = 'recommended', // 'recommended' | 'matrix'
    nodeVersion = '20.x',
    pythonVersion = '3.11',
    triggers = { push: true, pr: true, cron: false },
    caching = true,
    linting = true,
    testing = true,
    containerize = false,
    dockerRegistry = 'ghcr', 
    dockerImage = 'user/app',
    dockerPlatforms = 'linux/amd64',
    dockerTagStrategy = 'latest',
    deploy = 'none', // 'none' | 'vercel'
    concurrency = true,
    envVars = [], // { key, value, type, scope }
    matrixNodeVersions = ['20.x', '22.x'],
    matrixPythonVersions = ['3.11', '3.12']
  } = config;

  // Build steps array
  const steps = [];

  steps.push({
    id: 'checkout',
    name: 'Checkout Repository',
    uses: ACTION_REGISTRY.checkout.uses
  });

  // Runtime Setup
  const isMatrix = runtimeStrategy === 'matrix';

  if (language === 'node') {
    const nodeSetup = {
      id: 'setup-node',
      name: `Setup Node.js (${packageManager})`,
      uses: ACTION_REGISTRY.setupNode.uses,
      with: {
        'node-version': isMatrix ? '${{ matrix.node-version }}' : nodeVersion
      }
    };
    if (caching && ['npm', 'pnpm', 'yarn'].includes(packageManager)) {
      nodeSetup.with.cache = packageManager;
    }
    steps.push(nodeSetup);

    if (packageManager === 'pnpm') {
      steps.splice(1, 0, { id: 'setup-pnpm', name: 'Setup pnpm', uses: 'pnpm/action-setup@v3', with: { version: '9' } });
    } else if (packageManager === 'bun') {
      steps.splice(1, 0, { id: 'setup-bun', name: 'Setup Bun', uses: 'oven-sh/setup-bun@v2', with: { 'bun-version': 'latest' } });
    }
  } else if (language === 'python') {
    const pythonSetup = {
      id: 'setup-python',
      name: `Setup Python (${packageManager})`,
      uses: ACTION_REGISTRY.setupPython.uses,
      with: {
        'python-version': isMatrix ? '${{ matrix.python-version }}' : pythonVersion
      }
    };
    if (caching && ['pip', 'poetry', 'pipenv'].includes(packageManager)) {
      pythonSetup.with.cache = packageManager;
    }
    steps.push(pythonSetup);

    if (packageManager === 'uv') {
      steps.push({ id: 'setup-uv', name: 'Setup uv', uses: 'astral-sh/setup-uv@v5', with: { 'enable-cache': caching } });
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
      with: { push: true, tags: tagValue, platforms: dockerPlatforms, cache: 'type=gha' }
    });
  }

  // Deployment
  if (deploy === 'vercel') {
    const deployEnvVars = envVars.filter(v => v.scope === 'deploy' && v.key);
    const stepEnv = {};
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
  const permissions = { contents: 'read' };
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

export function compileToGitHubYAML(ir) {
  let yaml = `name: Pipeline Architect Workflow\n\n`;

  yaml += `on:\n`;
  if (ir.triggers.push) yaml += `  push:\n    branches: [ "main" ]\n`;
  if (ir.triggers.pr) yaml += `  pull_request:\n    branches: [ "main" ]\n`;
  if (ir.triggers.cron) yaml += `  schedule:\n    - cron: '0 3 * * 1'\n`;

  if (ir.permissions && Object.keys(ir.permissions).length > 0) {
    yaml += `\npermissions:\n`;
    Object.entries(ir.permissions).forEach(([k, v]) => { yaml += `  ${k}: ${v}\n`; });
  }

  if (ir.concurrency) {
    yaml += `\nconcurrency:\n  group: \${{ github.workflow }}-\${{ github.ref }}\n  cancel-in-progress: true\n`;
  }

  const globalVars = ir.envVars.filter(e => e.scope === 'global' && e.key);
  if (globalVars.length > 0) {
    yaml += `\nenv:\n`;
    globalVars.forEach(v => {
      let valStr = v.type === 'Secret' ? `\${{ secrets.${v.key} }}` : v.value;
      yaml += `  ${v.key}: ${valStr}\n`;
    });
  }

  yaml += `\njobs:\n  build:\n    runs-on: ubuntu-latest\n`;

  if (ir.runtimeStrategy === 'matrix') {
    const versions = ir.language === 'node' ? ir.matrixNodeVersions : ir.matrixPythonVersions;
    const versionKey = ir.language === 'node' ? 'node-version' : 'python-version';
    yaml += `    strategy:\n      matrix:\n        ${versionKey}: [${versions.map(v => `'${v}'`).join(', ')}]\n`;
  }

  yaml += `    steps:\n`;

  ir.steps.forEach(step => {
    yaml += `    - name: ${step.name}\n`;
    if (step.uses) yaml += `      uses: ${step.uses}\n`;
    if (step.with) {
      yaml += `      with:\n`;
      Object.entries(step.with).forEach(([k, v]) => { yaml += `        ${k}: ${v}\n`; });
    }
    if (step.env) {
      yaml += `      env:\n`;
      Object.entries(step.env).forEach(([k, v]) => { yaml += `        ${k}: ${v}\n`; });
    }
    if (step.run) {
      if (step.run.includes('\n')) {
        yaml += `      run: |\n`;
        step.run.split('\n').forEach(line => { yaml += `        ${line}\n`; });
      } else {
        yaml += `      run: ${step.run}\n`;
      }
    }
    yaml += `\n`;
  });

  return yaml.trimEnd() + '\n';
}

export function compileToGitLabYAML(ir) {
  let yaml = `stages:\n  - test\n`;
  if (ir.deploy !== 'none' || ir.containerize) yaml += `  - deploy\n`;
  // (Simple implementation omitted for brevity, keeping GitHub focus for now)
  return yaml;
}

export function calculateHealthScore(ir) {
  let secScore = 50, relScore = 50, perfScore = 50, mainScore = 50;
  const securityReasons = [];
  const reliabilityReasons = [];
  const performanceReasons = [];
  const maintainabilityReasons = [];

  // Security (30%)
  if (ir.permissions && ir.permissions.contents === 'read') {
    secScore += 30;
    securityReasons.push('✓ Read-only contents permission');
  } else {
    securityReasons.push('⚠ Write permissions detected');
  }
  
  if (ir.envVars.every(v => v.scope !== 'global' || v.type !== 'Secret')) {
    secScore += 20;
    securityReasons.push('✓ Secrets scoped locally (Least-privilege)');
  } else {
    securityReasons.push('⚠ Global secrets detected');
  }

  // Reliability (30%)
  if (ir.linting) { relScore += 20; reliabilityReasons.push('✓ Linting step active'); }
  else { reliabilityReasons.push('⚠ No linting step configured'); }
  if (ir.testing) { relScore += 20; reliabilityReasons.push('✓ Test suite active'); }
  else { reliabilityReasons.push('⚠ No testing step configured'); }
  if (ir.runtimeStrategy === 'matrix') { relScore += 10; reliabilityReasons.push('✓ Matrix testing configured'); }
  else { reliabilityReasons.push('⚠ Single runtime execution'); }

  // Performance (20%)
  if (ir.caching) { perfScore += 30; performanceReasons.push('✓ Dependency caching active'); }
  else { performanceReasons.push('⚠ No dependency caching'); }
  if (ir.concurrency) { perfScore += 20; performanceReasons.push('✓ Concurrency cancellation active'); }
  else { performanceReasons.push('⚠ No concurrency limits'); }

  // Maintainability (20%)
  if (['pnpm', 'uv', 'bun'].includes(ir.packageManager)) {
    mainScore += 30;
    maintainabilityReasons.push('✓ Modern/Fast package manager detected');
  } else {
    maintainabilityReasons.push('⚠ Legacy package manager');
  }
  if (ir.containerize && ir.dockerPlatforms.includes(',')) {
    mainScore += 20;
    maintainabilityReasons.push('✓ Multi-arch Docker build setup');
  } else if (ir.containerize) {
    maintainabilityReasons.push('⚠ Single-arch Docker build');
  } else {
    maintainabilityReasons.push('✓ Standard deployment strategy');
  }

  // Clamp 0-100
  secScore = Math.min(100, secScore);
  relScore = Math.min(100, relScore);
  perfScore = Math.min(100, perfScore);
  mainScore = Math.min(100, mainScore);

  const finalScore = Math.round((secScore * 0.3) + (relScore * 0.3) + (perfScore * 0.2) + (mainScore * 0.2));

  let ratingLabel = 'Needs Improvement';
  if (finalScore >= 90) ratingLabel = 'Production Ready';
  else if (finalScore >= 75) ratingLabel = 'Good Quality';
  else if (finalScore >= 60) ratingLabel = 'Fair';

  return {
    score: finalScore,
    ratingLabel,
    breakdown: {
      security: { score: secScore, reasons: securityReasons },
      reliability: { score: relScore, reasons: reliabilityReasons },
      performance: { score: perfScore, reasons: performanceReasons },
      maintainability: { score: mainScore, reasons: maintainabilityReasons }
    }
  };
}

export function validatePipeline(ir) {
  const issues = [];
  if (ir.deploy === 'none' && !ir.containerize && !ir.testing && !ir.linting) {
    issues.push('Pipeline does not run any tasks (no tests, lint, docker, or deploy).');
  }
  if (ir.containerize && !ir.dockerRegistry) {
    issues.push('Docker containerization enabled but no registry selected.');
  }
  if (ir.deploy === 'vercel' && ir.containerize) {
    issues.push('Conflict: Vercel deployment usually conflicts with raw Docker containerization.');
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

export function explainPipeline(ir) {
  const steps = [];
  steps.push(`1. This pipeline triggers automatically on ${ir.triggers.push ? 'Push' : ''} ${ir.triggers.push && ir.triggers.pr ? 'and' : ''} ${ir.triggers.pr ? 'Pull Requests' : ''}.`);
  if (ir.concurrency) steps.push(`2. It cancels outdated builds automatically to save CI minutes.`);
  steps.push(`3. It sets up the ${ir.language} environment using the ${ir.packageManager} package manager.`);
  if (ir.caching) steps.push(`4. It caches dependencies to speed up future runs.`);
  if (ir.linting) steps.push(`5. It runs a linter to ensure code style consistency.`);
  if (ir.testing) steps.push(`6. It executes the automated test suite.`);
  if (ir.containerize) steps.push(`7. It builds a Docker container and pushes it to ${ir.dockerRegistry.toUpperCase()}.`);
  if (ir.deploy === 'vercel') steps.push(`8. Finally, it deploys the application to Vercel.`);

  return steps;
}

export function generateSecretChecklist(ir) {
  const secrets = [];
  if (ir.deploy === 'vercel') secrets.push('VERCEL_TOKEN', 'VERCEL_ORG_ID', 'VERCEL_PROJECT_ID');
  if (ir.containerize) {
    if (ir.dockerRegistry === 'dockerhub') secrets.push('DOCKERHUB_USERNAME', 'DOCKERHUB_TOKEN');
  }
  ir.envVars.forEach(v => {
    if (v.type === 'Secret' && v.key && !secrets.includes(v.key)) secrets.push(v.key);
  });
  return secrets;
}

export function generateDotEnvExample(ir) {
  const lines = ['# Auto-generated .env.example by DevsHub CI/CD Copilot', ''];
  const secrets = generateSecretChecklist(ir);
  if (secrets.length > 0) {
    lines.push('# Required Repository Secrets');
    secrets.forEach(sec => lines.push(`${sec}=your_${sec.toLowerCase()}_here`));
    lines.push('');
  }
  if (ir.envVars.length > 0) {
    lines.push('# Environment Variables');
    ir.envVars.forEach(v => { if (v.key) lines.push(`${v.key}=${v.value || 'sample_value'}`); });
  }
  return lines.join('\n');
}
