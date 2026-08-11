import { useState, useMemo, useEffect } from 'react';
import { 
  Sparkles, 
  Settings2, 
  Zap, 
  ShieldCheck, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  Download, 
  FileText, 
  GitBranch, 
  Layers, 
  Activity, 
  Cpu, 
  Lock,
  ArrowRight,
  RefreshCw,
  Box,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { PIPELINE_PRESETS } from '../data/presets';
import { 
  buildPipelineIR, 
  compileToGitHubYAML, 
  compileToGitLabYAML, 
  calculateHealthScore, 
  generateSecretChecklist, 
  generateDotEnvExample,
  explainPipeline,
  validatePipeline
} from '../utils/pipelineIR';
import { tools } from '../data/contentModel';
import { Link } from 'react-router-dom';
import '../index.css';
import { motion } from 'framer-motion';

function PipelineArchitect() {
  const toolData = tools.find(t => t.slug === 'pipeline-architect');
  const [activeMode, setActiveMode] = useState('builder'); // 'vibe' | 'builder' | 'pro'
  const [activeTab, setActiveTab] = useState('yaml'); // 'yaml' | 'graph' | 'secrets' | 'explain'
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  
  const [config, setConfig] = useState({
    platform: 'github',
    language: 'node',
    packageManager: 'auto',
    runtimeStrategy: 'recommended',
    nodeVersion: '20.x',
    pythonVersion: '3.11',
    triggers: { push: true, pr: true, cron: false },
    caching: true,
    linting: true,
    testing: true,
    containerize: false,
    dockerRegistry: 'ghcr',
    dockerImage: 'user/app',
    dockerPlatforms: 'linux/amd64',
    dockerTagStrategy: 'sha',
    deploy: 'none',
    concurrency: true,
    envVars: [
      { key: 'VERCEL_TOKEN', value: '${{ secrets.VERCEL_TOKEN }}', type: 'Secret', scope: 'deploy' }
    ],
    matrixNodeVersions: ['20.x', '22.x'],
    matrixPythonVersions: ['3.11', '3.12']
  });

  const [copied, setCopied] = useState(false);
  const [vibePrompt, setVibePrompt] = useState("I'm building a Next.js app using pnpm. I want to test on PRs and deploy to Vercel.");
  const [isArchitecting, setIsArchitecting] = useState(false);

  // Auto-resolution for 'auto' package manager
  const resolvedPackageManager = useMemo(() => {
    if (config.packageManager !== 'auto') return config.packageManager;
    return config.language === 'node' ? 'npm' : 'pip';
  }, [config.packageManager, config.language]);

  const resolvedConfig = useMemo(() => ({
    ...config,
    packageManager: resolvedPackageManager
  }), [config, resolvedPackageManager]);

  // Derived IR & YAML
  const pipelineIR = useMemo(() => buildPipelineIR(resolvedConfig), [resolvedConfig]);
  const generatedYAML = useMemo(() => compileToGitHubYAML(pipelineIR), [pipelineIR]);
  const gitlabYAML = useMemo(() => compileToGitLabYAML(pipelineIR), [pipelineIR]);
  
  const healthStats = useMemo(() => calculateHealthScore(pipelineIR), [pipelineIR]);
  const validation = useMemo(() => validatePipeline(pipelineIR), [pipelineIR]);
  const explanation = useMemo(() => explainPipeline(pipelineIR), [pipelineIR]);
  
  const secretsChecklist = useMemo(() => generateSecretChecklist(pipelineIR), [pipelineIR]);
  const dotEnvExample = useMemo(() => generateDotEnvExample(pipelineIR), [pipelineIR]);

  // Handlers
  const handlePresetSelect = (presetId) => {
    const selected = PIPELINE_PRESETS.find(p => p.id === presetId);
    if (selected) {
      setConfig({ ...config, ...selected });
    }
  };

  const handleVibePrompt = () => {
    setIsArchitecting(true);
    setTimeout(() => {
      const lower = vibePrompt.toLowerCase();
      if (lower.includes('fastapi') || lower.includes('python')) {
        handlePresetSelect('fastapi-docker-uv');
      } else if (lower.includes('docker')) {
        handlePresetSelect('node-docker-ghcr');
      } else {
        handlePresetSelect('nextjs-vercel');
      }
      setIsArchitecting(false);
      setActiveMode('builder');
    }, 1000);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setExportMenuOpen(false);
  };

  const downloadFile = (filename, content) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExportMenuOpen(false);
  };

  const addEnvVar = () => setConfig({ ...config, envVars: [...config.envVars, { key: '', value: '', type: 'Secret', scope: 'global' }] });
  const updateEnvVar = (i, field, val) => {
    const newVars = [...config.envVars];
    newVars[i][field] = val;
    setConfig({ ...config, envVars: newVars });
  };
  const removeEnvVar = (i) => setConfig({ ...config, envVars: config.envVars.filter((_, idx) => idx !== i) });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": toolData.name,
    "applicationCategory": "DeveloperApplication",
    "description": toolData.seoDescription,
    "offers": {
      "@type": "Offer",
      "price": "0"
    }
  };

  return (
    <div className="tool-container" style={{ maxWidth: '1350px', margin: '0 auto', padding: '0 1rem' }}>
      <title>{toolData.seoTitle}</title>
      <meta name="description" content={toolData.seoDescription} />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>

      
      <header className="header" style={{ marginBottom: '1rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '2rem' }}>
            <Zap style={{ color: 'var(--accent)' }} size={32} />
            Pipeline Architect
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Copilot inteligente para engenharia de CI/CD. Zero YAML boilerplate.
          </p>
        </div>
        <select 
          className="text-input" 
          onChange={(e) => handlePresetSelect(e.target.value)}
          defaultValue=""
          style={{ width: '250px' }}
        >
          <option value="" disabled>Load Architecture Preset...</option>
          {PIPELINE_PRESETS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </header>

      {/* Health Score Dashboard */}
      <div className="card mb-4" style={{ padding: '1rem', background: 'var(--surface-bg)', border: '1px solid var(--surface-border)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
          
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: healthStats.score >= 80 ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 179, 8, 0.15)',
            border: `3px solid ${healthStats.score >= 80 ? 'var(--success, #22c55e)' : '#eab308'}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
          }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 'bold', color: healthStats.score >= 80 ? '#22c55e' : '#eab308' }}>
              {healthStats.score}
            </span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>/ 100</span>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Health Score: {healthStats.ratingLabel}</h3>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              {[
                { title: 'Security', data: healthStats.breakdown.security, color: '#38bdf8' },
                { title: 'Reliability', data: healthStats.breakdown.reliability, color: '#a78bfa' },
                { title: 'Performance', data: healthStats.breakdown.performance, color: '#4ade80' },
                { title: 'Maintainability', data: healthStats.breakdown.maintainability, color: '#f472b6' }
              ].map(cat => (
                <div key={cat.title}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.2rem' }}>
                    <strong style={{ color: cat.color }}>{cat.title}</strong>
                    <span>{cat.data.score}%</span>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${cat.data.score}%`, height: '100%', background: cat.color }}></div>
                  </div>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    {cat.data.reasons.map((r, i) => <span key={i} style={{ color: r.startsWith('⚠') ? '#eab308' : 'var(--text-secondary)' }}>{r}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <button className={`button ${activeMode === 'vibe' ? 'primary' : 'outline'}`} onClick={() => setActiveMode('vibe')}><Sparkles size={18} /> Vibe Mode</button>
        <button className={`button ${activeMode === 'builder' ? 'primary' : 'outline'}`} onClick={() => setActiveMode('builder')}><Settings2 size={18} /> Builder Mode</button>
        <button className={`button ${activeMode === 'pro' ? 'primary' : 'outline'}`} onClick={() => setActiveMode('pro')}><Cpu size={18} /> Pro Mode</button>
      </div>

      <div className="rag-layout" style={{ gridTemplateColumns: '460px 1fr' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* VIBE MODE */}
          {activeMode === 'vibe' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-4">
              <h3 className="section-title"><Sparkles size={18}/> AI Pipeline Architect</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Describe what you are building. DevsHub will analyze your needs and engineer the optimal pipeline decisions.
              </p>
              <textarea 
                className="text-input mb-3" 
                rows={5} 
                value={vibePrompt}
                onChange={(e) => setVibePrompt(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem', lineHeight: '1.5' }}
              />
              <button 
                className="button primary w-100" 
                onClick={handleVibePrompt}
                disabled={isArchitecting}
                style={{ justifyContent: 'center' }}
              >
                {isArchitecting ? <RefreshCw className="spin" size={18} /> : <Sparkles size={18} />} 
                {isArchitecting ? 'Architecting...' : 'Architect Pipeline'}
              </button>
            </motion.div>
          )}

          {/* BUILDER MODE */}
          {activeMode === 'builder' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div className="card p-4">
                <h3 className="section-title"><Layers size={18}/> Stack</h3>
                <div className="form-group mb-3">
                  <label>Language</label>
                  <div className="options-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    <button className={`option-btn ${config.language === 'node' ? 'active' : ''}`} onClick={() => setConfig({...config, language: 'node', packageManager: 'auto'})}>Node.js</button>
                    <button className={`option-btn ${config.language === 'python' ? 'active' : ''}`} onClick={() => setConfig({...config, language: 'python', packageManager: 'auto'})}>Python</button>
                  </div>
                </div>
                <div className="form-group mb-0">
                  <label>Package Manager</label>
                  <select className="text-input" value={config.packageManager} onChange={(e) => setConfig({...config, packageManager: e.target.value})} style={{ width: '100%' }}>
                    <option value="auto">Auto Detect ({config.language === 'node' ? 'npm' : 'pip'})</option>
                    {config.language === 'node' ? (
                      <><option value="pnpm">pnpm</option><option value="npm">npm</option><option value="yarn">yarn</option><option value="bun">bun</option></>
                    ) : (
                      <><option value="uv">uv (Fast)</option><option value="poetry">Poetry</option><option value="pip">pip</option></>
                    )}
                  </select>
                </div>
              </div>

              <div className="card p-4">
                <h3 className="section-title"><Box size={18}/> Build & Deploy</h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input type="checkbox" checked={config.caching} onChange={(e) => setConfig({...config, caching: e.target.checked})} /> Dependency Caching
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input type="checkbox" checked={config.linting} onChange={(e) => setConfig({...config, linting: e.target.checked})} /> Run Linter
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input type="checkbox" checked={config.testing} onChange={(e) => setConfig({...config, testing: e.target.checked})} /> Run Tests
                  </label>
                </div>

                <div className="form-group mb-3">
                  <label>Containerize (Docker)</label>
                  <div className="options-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    <button className={`option-btn ${!config.containerize ? 'active' : ''}`} onClick={() => setConfig({...config, containerize: false})}>No</button>
                    <button className={`option-btn ${config.containerize ? 'active' : ''}`} onClick={() => setConfig({...config, containerize: true})}>Yes</button>
                  </div>
                </div>

                <div className="form-group mb-0">
                  <label>Deployment Target</label>
                  <div className="options-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    <button className={`option-btn ${config.deploy === 'none' ? 'active' : ''}`} onClick={() => setConfig({...config, deploy: 'none'})}>None</button>
                    <button className={`option-btn ${config.deploy === 'vercel' ? 'active' : ''}`} onClick={() => setConfig({...config, deploy: 'vercel'})}>Vercel</button>
                  </div>
                </div>
              </div>

              <div className="card p-4">
                <h3 className="section-title"><Lock size={18}/> Scoped Secrets</h3>
                {config.envVars.map((env, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <input type="text" placeholder="Key (PORT)" className="text-input" style={{ flex: 1, padding: '0.4rem' }} value={env.key} onChange={(e) => updateEnvVar(i, 'key', e.target.value)} />
                    <select className="text-input" value={env.type} onChange={(e) => updateEnvVar(i, 'type', e.target.value)} style={{ width: '90px', padding: '0.4rem' }}>
                      <option value="Secret">Secret</option><option value="Variable">Var</option>
                    </select>
                    <select className="text-input" value={env.scope} onChange={(e) => updateEnvVar(i, 'scope', e.target.value)} style={{ width: '90px', padding: '0.4rem' }}>
                      <option value="global">Global</option><option value="deploy">Deploy</option><option value="test">Test</option>
                    </select>
                    <button className="button outline" style={{ padding: '0.4rem' }} onClick={() => removeEnvVar(i)}><Trash2 size={16} style={{ color: 'var(--danger)' }} /></button>
                  </div>
                ))}
                <button className="button outline mt-2 w-100" style={{ justifyContent: 'center', borderStyle: 'dashed' }} onClick={addEnvVar}><Plus size={16} /> Add Variable</button>
              </div>

            </motion.div>
          )}

          {/* PRO MODE */}
          {activeMode === 'pro' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-4">
              <h3 className="section-title"><Cpu size={18}/> Pro Settings</h3>
              
              <div className="form-group mb-3">
                <label>Runtime Strategy</label>
                <select className="text-input w-100" value={config.runtimeStrategy} onChange={(e) => setConfig({...config, runtimeStrategy: e.target.value})}>
                  <option value="recommended">Recommended LTS</option>
                  <option value="matrix">Matrix Testing (Multi-version)</option>
                </select>
              </div>

              <div className="form-group mb-3">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" checked={config.concurrency} onChange={(e) => setConfig({...config, concurrency: e.target.checked})} />
                  Concurrency Cancellation (`cancel-in-progress`)
                </label>
              </div>

              {config.containerize && (
                <div style={{ padding: '1rem', background: 'var(--surface-bg)', borderRadius: '8px', border: '1px solid var(--surface-border)' }}>
                  <h4 style={{ fontSize: '0.85rem', marginBottom: '0.75rem', color: 'var(--accent)' }}>Docker Buildx Options</h4>
                  <div className="form-group mb-2">
                    <label style={{ fontSize: '0.75rem' }}>Platforms</label>
                    <input type="text" className="text-input w-100" value={config.dockerPlatforms} onChange={(e) => setConfig({...config, dockerPlatforms: e.target.value})} />
                  </div>
                  <div className="form-group mb-0">
                    <label style={{ fontSize: '0.75rem' }}>Registry</label>
                    <select className="text-input w-100" value={config.dockerRegistry} onChange={(e) => setConfig({...config, dockerRegistry: e.target.value})}>
                      <option value="ghcr">GHCR</option><option value="dockerhub">Docker Hub</option>
                    </select>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Right Output Panel */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '650px' }}>
          
          {/* Validation Banner */}
          {validation.valid ? (
            <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#22c55e', fontSize: '0.85rem', fontWeight: 500, borderBottom: '1px solid rgba(34, 197, 94, 0.2)' }}>
              <CheckCircle2 size={16} /> Pipeline Configuration Valid
            </div>
          ) : (
            <div style={{ background: 'rgba(234, 179, 8, 0.1)', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#eab308', fontSize: '0.85rem', fontWeight: 500, borderBottom: '1px solid rgba(234, 179, 8, 0.2)' }}>
              <AlertCircle size={16} /> {validation.issues.length} Issues Detected: {validation.issues[0]}
            </div>
          )}

          <div className="content-header" style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--surface-border)', background: 'var(--surface-bg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className={`button ${activeTab === 'yaml' ? 'primary' : 'outline'}`} onClick={() => setActiveTab('yaml')} style={{ padding: '0.35rem 0.85rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><FileText size={15} /> YAML</button>
              <button className={`button ${activeTab === 'graph' ? 'primary' : 'outline'}`} onClick={() => setActiveTab('graph')} style={{ padding: '0.35rem 0.85rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Activity size={15} /> Graph</button>
              <button className={`button ${activeTab === 'secrets' ? 'primary' : 'outline'}`} onClick={() => setActiveTab('secrets')} style={{ padding: '0.35rem 0.85rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Lock size={15} /> Secrets</button>
              <button className={`button ${activeTab === 'explain' ? 'primary' : 'outline'}`} onClick={() => setActiveTab('explain')} style={{ padding: '0.35rem 0.85rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><HelpCircle size={15} /> Explain</button>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', position: 'relative' }}>
              <button className="button primary" onClick={() => setExportMenuOpen(!exportMenuOpen)} style={{ padding: '0.35rem 0.85rem', fontSize: '0.85rem' }}>
                Export <ChevronDown size={15} />
              </button>
              {exportMenuOpen && (
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', background: 'var(--surface-bg)', border: '1px solid var(--surface-border)', borderRadius: '8px', zIndex: 10, width: '220px', padding: '0.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                  <button className="button outline w-100" style={{ border: 'none', justifyContent: 'flex-start', padding: '0.5rem' }} onClick={() => copyToClipboard(generatedYAML)}>Copy YAML</button>
                  <button className="button outline w-100" style={{ border: 'none', justifyContent: 'flex-start', padding: '0.5rem' }} onClick={() => downloadFile('ci.yml', generatedYAML)}>Download workflow</button>
                  <div style={{ height: '1px', background: 'var(--surface-border)', margin: '0.25rem 0' }}></div>
                  <button className="button outline w-100" style={{ border: 'none', justifyContent: 'flex-start', padding: '0.5rem' }} onClick={() => copyToClipboard(`Update .github/workflows/ci.yml with the following:\n\n` + generatedYAML)}>Copy for Cursor</button>
                  <button className="button outline w-100" style={{ border: 'none', justifyContent: 'flex-start', padding: '0.5rem' }} onClick={() => copyToClipboard(gitlabYAML)}>Convert to GitLab CI (Preview)</button>
                </div>
              )}
            </div>
          </div>

          <div style={{ flex: 1, padding: '1.25rem', background: 'var(--bg-color)', overflowY: 'auto' }}>
            {activeTab === 'yaml' && <pre className="yaml-preview" style={{ margin: 0, background: 'transparent', fontSize: '0.85rem' }}><code>{generatedYAML}</code></pre>}
            
            {activeTab === 'graph' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1rem 0', alignItems: 'center' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Execution DAG Flow</h4>
                {pipelineIR.steps.map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '400px' }}>
                    <div style={{ width: '100%', padding: '0.85rem 1.25rem', background: 'var(--surface-bg)', border: '1px solid var(--surface-border)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{step.name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontFamily: 'monospace' }}>{step.uses ? step.uses.split('@')[0] : 'run'}</span>
                    </div>
                    {idx < pipelineIR.steps.length - 1 && <div style={{ width: '2px', height: '20px', background: 'var(--surface-border)', margin: '4px 0' }}></div>}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'secrets' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Lock size={16} style={{ color: 'var(--accent)' }}/> Required Secrets</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {secretsChecklist.map((sec, idx) => <span key={idx} className="badge" style={{ padding: '0.4rem 0.8rem', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent)', fontFamily: 'monospace' }}>{sec}</span>)}
                    {secretsChecklist.length === 0 && <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>None required.</span>}
                  </div>
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FileText size={16} style={{ color: 'var(--accent)' }}/> .env.example</h4>
                  <pre style={{ padding: '1rem', background: 'var(--surface-bg)', border: '1px solid var(--surface-border)', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'monospace' }}>{dotEnvExample}</pre>
                </div>
              </div>
            )}

            {activeTab === 'explain' && (
              <div style={{ padding: '1rem', background: 'var(--surface-bg)', borderRadius: '8px', border: '1px solid var(--surface-border)' }}>
                <h4 style={{ marginBottom: '1rem', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><HelpCircle size={18} /> How this pipeline works:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {explanation.map((exp, i) => (
                    <div key={i} style={{ fontSize: '0.9rem', lineHeight: '1.5', color: 'var(--text-primary)' }}>{exp}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid var(--surface-border)', background: 'var(--surface-bg)', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <span>GitHub Actions Auto-updated Engine</span>
            <span>✓ Least Privilege Scopes Applied</span>
          </div>

        </div>
      </div>

      {/* AEO & SEO Semantic Content */}
      <article className="tool-semantic-content" style={{ marginTop: '5rem', borderTop: '1px solid var(--surface-border)', paddingTop: '3rem', color: 'var(--text-secondary)' }}>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>What does {toolData.name} do?</h2>
        <p style={{ marginBottom: '2rem', lineHeight: '1.6' }}>{toolData.longDescription}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Supported Stacks</h3>
            <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.6' }}>
              {toolData.supportedStacks.map(stack => <li key={stack}>{stack}</li>)}
            </ul>
          </div>
          
          <div>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Key Features</h3>
            <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.6' }}>
              {toolData.features.map(feat => <li key={feat}>{feat}</li>)}
            </ul>
          </div>
        </div>

        {toolData.faqs && toolData.faqs.length > 0 && (
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Frequently Asked Questions</h2>
            {toolData.faqs.map((faq, idx) => (
              <div key={idx} style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{faq.q}</h4>
                <p>{faq.a}</p>
              </div>
            ))}
          </section>
        )}

        {toolData.relatedTools && toolData.relatedTools.length > 0 && (
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Related Tools</h2>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {toolData.relatedTools.map(slug => {
                const rt = tools.find(t => t.slug === slug);
                if (!rt) return null;
                return (
                  <Link key={slug} to={`/tools/${slug}`} className="card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 1.5rem' }}>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{rt.name}</span>
                    <ArrowRight size={16} />
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </article>

    </div>
  );
}

export default PipelineArchitect;
