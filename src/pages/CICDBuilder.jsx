import { useState } from 'react';
import { Flag, Play, Copy, Check } from 'lucide-react';
import '../index.css';

function CICDBuilder() {
  const [platform, setPlatform] = useState('github'); // github, gitlab
  const [language, setLanguage] = useState('node'); // node, python
  const [deploy, setDeploy] = useState('none'); // none, vercel, docker
  const [copied, setCopied] = useState(false);

  const generateYAML = () => {
    let yaml = '';

    if (platform === 'github') {
      yaml += `name: CI/CD Pipeline
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
`;

      if (language === 'node') {
        yaml += `    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18.x'
    - run: npm ci
    - run: npm run build --if-present
    - run: npm test
`;
      } else if (language === 'python') {
        yaml += `    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.10'
    - run: |
        python -m pip install --upgrade pip
        pip install pytest
        if [ -f requirements.txt ]; then pip install -r requirements.txt; fi
    - run: pytest
`;
      }

      if (deploy === 'vercel') {
        yaml += `    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: \${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: \${{ secrets.ORG_ID}}
        vercel-project-id: \${{ secrets.PROJECT_ID}}
        vercel-args: '--prod'
`;
      } else if (deploy === 'docker') {
        yaml += `    - name: Build and push Docker image
      uses: docker/build-push-action@v4
      with:
        push: false # Set to true to push
        tags: user/app:latest
`;
      }
    } else {
      // GitLab CI
      yaml += `stages:
  - test
  - deploy

test-job:
  stage: test
`;
      if (language === 'node') {
        yaml += `  image: node:18
  script:
    - npm ci
    - npm test
`;
      } else if (language === 'python') {
        yaml += `  image: python:3.10
  script:
    - pip install -r requirements.txt
    - pytest
`;
      }

      if (deploy === 'vercel') {
        yaml += `
deploy-vercel:
  stage: deploy
  image: node:18
  script:
    - npm i -g vercel
    - vercel pull --yes --environment=production --token=$VERCEL_TOKEN
    - vercel build --prod --token=$VERCEL_TOKEN
    - vercel deploy --prebuilt --prod --token=$VERCEL_TOKEN
`;
      } else if (deploy === 'docker') {
        yaml += `
deploy-docker:
  stage: deploy
  image: docker:20.10.16
  services:
    - docker:20.10.16-dind
  script:
    - docker build -t user/app:latest .
`;
      }
    }

    return yaml;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateYAML());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="tool-container" style={{ maxWidth: '1000px' }}>
      <header className="header" style={{ marginBottom: '2rem', marginTop: '1rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          <Flag size={42} />
          CI/CD Pipeline Builder
        </h1>
        <p>Gere configurações de pipeline prontas para produção com poucos cliques.</p>
      </header>

      <div className="rag-layout" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="card p-4">
          <h3 className="section-title"><Play size={20}/> Configurações do Pipeline</h3>
          
          <div className="form-group mb-4">
            <label>1. Plataforma de CI/CD</label>
            <div className="options-grid">
              <button 
                className={`option-btn ${platform === 'github' ? 'active' : ''}`}
                onClick={() => setPlatform('github')}
              >
                GitHub Actions
              </button>
              <button 
                className={`option-btn ${platform === 'gitlab' ? 'active' : ''}`}
                onClick={() => setPlatform('gitlab')}
              >
                GitLab CI
              </button>
            </div>
          </div>

          <div className="form-group mb-4">
            <label>2. Stack Principal (Testes)</label>
            <div className="options-grid">
              <button 
                className={`option-btn ${language === 'node' ? 'active' : ''}`}
                onClick={() => setLanguage('node')}
              >
                Node.js (npm)
              </button>
              <button 
                className={`option-btn ${language === 'python' ? 'active' : ''}`}
                onClick={() => setLanguage('python')}
              >
                Python (PyTest)
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>3. Destino de Deploy (Opcional)</label>
            <div className="options-grid">
              <button 
                className={`option-btn ${deploy === 'none' ? 'active' : ''}`}
                onClick={() => setDeploy('none')}
              >
                Nenhum (Só Testar)
              </button>
              <button 
                className={`option-btn ${deploy === 'vercel' ? 'active' : ''}`}
                onClick={() => setDeploy('vercel')}
              >
                Vercel
              </button>
              <button 
                className={`option-btn ${deploy === 'docker' ? 'active' : ''}`}
                onClick={() => setDeploy('docker')}
              >
                Docker Build
              </button>
            </div>
          </div>
        </div>

        <div className="card p-4" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="content-header" style={{ padding: '0 0 1rem 0', marginBottom: '0', borderBottom: '1px solid var(--surface-border)' }}>
            <h3 className="section-title mb-0" style={{ border: 'none', padding: 0 }}>
              {platform === 'github' ? '.github/workflows/main.yml' : '.gitlab-ci.yml'}
            </h3>
            <button className="button outline" onClick={handleCopy} style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
              {copied ? <Check size={16} /> : <Copy size={16} />} 
              {copied ? 'Copiado!' : 'Copiar YAML'}
            </button>
          </div>
          <pre className="yaml-preview">
            <code>{generateYAML()}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

export default CICDBuilder;
