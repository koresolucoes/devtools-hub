import { useState } from 'react';
import { Flag, Play, Copy, Check, Plus, Trash2, Settings, Terminal, Box } from 'lucide-react';
import '../index.css';

function CICDBuilder() {
  const [platform, setPlatform] = useState('github'); // github, gitlab
  const [language, setLanguage] = useState('node'); // node, python
  const [deploy, setDeploy] = useState('none'); // none, vercel, docker
  const [copied, setCopied] = useState(false);

  // New features
  const [triggers, setTriggers] = useState({ push: true, pr: true, cron: false });
  const [caching, setCaching] = useState(true);
  const [linting, setLinting] = useState(false);
  const [envVars, setEnvVars] = useState([]); // {key: '', value: ''}

  const addEnvVar = () => setEnvVars([...envVars, { key: '', value: '' }]);
  const updateEnvVar = (index, field, val) => {
    const newVars = [...envVars];
    newVars[index][field] = val;
    setEnvVars(newVars);
  };
  const removeEnvVar = (index) => {
    setEnvVars(envVars.filter((_, i) => i !== index));
  };

  const generateGitHubYAML = () => {
    let yaml = `name: CI/CD Pipeline\n\non:\n`;
    if (triggers.push) yaml += `  push:\n    branches: [ "main" ]\n`;
    if (triggers.pr) yaml += `  pull_request:\n    branches: [ "main" ]\n`;
    if (triggers.cron) yaml += `  schedule:\n    - cron: '0 0 * * *' # Midnight daily\n`;

    const validEnvVars = envVars.filter(e => e.key.trim() !== '');
    if (validEnvVars.length > 0) {
      yaml += `\nenv:\n`;
      validEnvVars.forEach(e => {
        yaml += `  ${e.key}: ${e.value}\n`;
      });
    }

    yaml += `\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n`;
    yaml += `    - name: Checkout Repository\n      uses: actions/checkout@v3\n`;

    if (language === 'node') {
      yaml += `\n    - name: Setup Node.js\n      uses: actions/setup-node@v3\n      with:\n        node-version: '18.x'\n`;
      if (caching) yaml += `        cache: 'npm'\n`;
      
      yaml += `\n    - name: Install Dependencies\n      run: npm ci\n`;
      
      if (linting) {
        yaml += `\n    - name: Run Linter\n      run: npm run lint\n`;
      }
      yaml += `\n    - name: Build Project\n      run: npm run build --if-present\n`;
      yaml += `\n    - name: Run Tests\n      run: npm test\n`;
    } else if (language === 'python') {
      yaml += `\n    - name: Setup Python\n      uses: actions/setup-python@v4\n      with:\n        python-version: '3.10'\n`;
      if (caching) yaml += `        cache: 'pip'\n`;
      
      yaml += `\n    - name: Install Dependencies\n      run: |\n        python -m pip install --upgrade pip\n        if [ -f requirements.txt ]; then pip install -r requirements.txt; fi\n`;
      
      if (linting) {
        yaml += `\n    - name: Run Linter (flake8)\n      run: |\n        pip install flake8\n        flake8 .\n`;
      }
      yaml += `\n    - name: Run Tests (pytest)\n      run: |\n        pip install pytest\n        pytest\n`;
    }

    if (deploy === 'vercel') {
      yaml += `\n    - name: Deploy to Vercel\n      uses: amondnet/vercel-action@v20\n      with:\n        vercel-token: \${{ secrets.VERCEL_TOKEN }}\n        vercel-org-id: \${{ secrets.ORG_ID}}\n        vercel-project-id: \${{ secrets.PROJECT_ID}}\n        vercel-args: '--prod'\n`;
    } else if (deploy === 'docker') {
      yaml += `\n    - name: Login to DockerHub\n      uses: docker/login-action@v2\n      with:\n        username: \${{ secrets.DOCKERHUB_USERNAME }}\n        password: \${{ secrets.DOCKERHUB_TOKEN }}\n`;
      yaml += `\n    - name: Build and push Docker image\n      uses: docker/build-push-action@v4\n      with:\n        push: true\n        tags: user/app:latest\n`;
    }

    return yaml;
  };

  const generateGitLabYAML = () => {
    let yaml = `stages:\n  - test\n`;
    if (deploy !== 'none') yaml += `  - deploy\n`;

    const validEnvVars = envVars.filter(e => e.key.trim() !== '');
    if (validEnvVars.length > 0) {
      yaml += `\nvariables:\n`;
      validEnvVars.forEach(e => {
        yaml += `  ${e.key}: "${e.value}"\n`;
      });
    }

    if (caching) {
      yaml += `\ncache:\n  paths:\n`;
      if (language === 'node') yaml += `    - .npm/\n`;
      if (language === 'python') yaml += `    - .cache/pip\n`;
    }

    yaml += `\ntest-job:\n  stage: test\n`;
    if (language === 'node') {
      yaml += `  image: node:18\n`;
      if (caching) yaml += `  before_script:\n    - npm config set cache .npm --global\n`;
      yaml += `  script:\n    - npm ci\n`;
      if (linting) yaml += `    - npm run lint\n`;
      yaml += `    - npm test\n`;
    } else if (language === 'python') {
      yaml += `  image: python:3.10\n`;
      yaml += `  script:\n    - pip install -r requirements.txt\n`;
      if (linting) yaml += `    - pip install flake8 && flake8 .\n`;
      yaml += `    - pytest\n`;
    }

    if (!triggers.push && !triggers.pr) {
       yaml += `  rules:\n    - if: $CI_PIPELINE_SOURCE == "schedule"\n`;
    }

    if (deploy === 'vercel') {
      yaml += `\ndeploy-vercel:\n  stage: deploy\n  image: node:18\n  script:\n    - npm i -g vercel\n    - vercel pull --yes --environment=production --token=$VERCEL_TOKEN\n    - vercel build --prod --token=$VERCEL_TOKEN\n    - vercel deploy --prebuilt --prod --token=$VERCEL_TOKEN\n`;
    } else if (deploy === 'docker') {
      yaml += `\ndeploy-docker:\n  stage: deploy\n  image: docker:20.10.16\n  services:\n    - docker:20.10.16-dind\n  script:\n    - docker build -t user/app:latest .\n    - docker push user/app:latest\n`;
    }

    return yaml;
  };

  const generateYAML = () => {
    return platform === 'github' ? generateGitHubYAML() : generateGitLabYAML();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateYAML());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="tool-container" style={{ maxWidth: '1200px' }}>
      <header className="header" style={{ marginBottom: '2rem', marginTop: '1rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Flag size={32} />
          Pipeline Configurator
        </h1>
        <p>Gerador avançado de templates CI/CD com caching, linting e environment variables.</p>
      </header>

      <div className="rag-layout" style={{ gridTemplateColumns: '400px 1fr' }}>
        
        {/* Sidebar Configuradora */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card p-4">
            <h3 className="section-title"><Settings size={18}/> Basics & Stack</h3>
            
            <div className="form-group mb-4">
              <label>Platform</label>
              <div className="options-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <button className={`option-btn ${platform === 'github' ? 'active' : ''}`} onClick={() => setPlatform('github')}>GitHub Actions</button>
                <button className={`option-btn ${platform === 'gitlab' ? 'active' : ''}`} onClick={() => setPlatform('gitlab')}>GitLab CI</button>
              </div>
            </div>

            <div className="form-group mb-0">
              <label>Language Stack</label>
              <div className="options-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <button className={`option-btn ${language === 'node' ? 'active' : ''}`} onClick={() => setLanguage('node')}>Node.js</button>
                <button className={`option-btn ${language === 'python' ? 'active' : ''}`} onClick={() => setLanguage('python')}>Python</button>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="section-title"><Play size={18}/> Workflow Triggers</h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input type="checkbox" checked={triggers.push} onChange={(e) => setTriggers({...triggers, push: e.target.checked})} /> Push to main
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input type="checkbox" checked={triggers.pr} onChange={(e) => setTriggers({...triggers, pr: e.target.checked})} /> Pull Requests
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input type="checkbox" checked={triggers.cron} onChange={(e) => setTriggers({...triggers, cron: e.target.checked})} /> Scheduled (Cron)
              </label>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="section-title"><Box size={18}/> Build Options</h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input type="checkbox" checked={caching} onChange={(e) => setCaching(e.target.checked)} /> Enable Dependency Caching
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input type="checkbox" checked={linting} onChange={(e) => setLinting(e.target.checked)} /> Add Linting Step
              </label>
            </div>

            <label>Deployment Target</label>
            <div className="options-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
              <button className={`option-btn ${deploy === 'none' ? 'active' : ''}`} onClick={() => setDeploy('none')}>None</button>
              <button className={`option-btn ${deploy === 'vercel' ? 'active' : ''}`} onClick={() => setDeploy('vercel')}>Vercel</button>
              <button className={`option-btn ${deploy === 'docker' ? 'active' : ''}`} onClick={() => setDeploy('docker')}>Docker</button>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="section-title"><Terminal size={18}/> Environment Variables</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Adicione variáveis injetadas em todo o pipeline. Ex: DB_URL, API_KEY.
            </p>
            
            {envVars.map((env, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input 
                  type="text" 
                  placeholder="Key (e.g. PORT)" 
                  className="text-input" 
                  style={{ flex: 1, padding: '0.5rem' }}
                  value={env.key} 
                  onChange={(e) => updateEnvVar(i, 'key', e.target.value)} 
                />
                <input 
                  type="text" 
                  placeholder="Value / $\{{ secrets.X \}}" 
                  className="text-input" 
                  style={{ flex: 2, padding: '0.5rem' }}
                  value={env.value} 
                  onChange={(e) => updateEnvVar(i, 'value', e.target.value)} 
                />
                <button 
                  className="button outline" 
                  style={{ padding: '0.5rem', borderColor: 'var(--surface-border)' }}
                  onClick={() => removeEnvVar(i)}
                  title="Remove"
                >
                  <Trash2 size={16} style={{ color: 'var(--danger)' }} />
                </button>
              </div>
            ))}

            <button 
              className="button outline mt-2" 
              style={{ width: '100%', display: 'flex', justifyContent: 'center', borderStyle: 'dashed' }}
              onClick={addEnvVar}
            >
              <Plus size={16} /> Add Variable
            </button>
          </div>
        </div>

        {/* YAML Preview Area */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '600px' }}>
          <div className="content-header" style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--surface-border)', background: 'var(--surface-bg)' }}>
            <h3 className="mb-0" style={{ fontSize: '1rem', fontFamily: 'monospace', color: 'var(--accent-secondary)' }}>
              {platform === 'github' ? '.github/workflows/ci.yml' : '.gitlab-ci.yml'}
            </h3>
            <button className="button primary" onClick={handleCopy} style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
              {copied ? <Check size={16} /> : <Copy size={16} />} 
              {copied ? 'Copiado!' : 'Copy YAML'}
            </button>
          </div>
          <div style={{ flex: 1, padding: '1.5rem', background: 'var(--bg-color)', overflowY: 'auto' }}>
            <pre className="yaml-preview" style={{ padding: 0, margin: 0, background: 'transparent' }}>
              <code>{generateYAML()}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CICDBuilder;
