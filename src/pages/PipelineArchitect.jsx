import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Sparkles, 
  Settings2, 
  Zap, 
  Trash2, 
  FileText, 
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
  ChevronDown,
  Plus
} from 'lucide-react';
import { PIPELINE_PRESETS } from '../data/presets';
import { buildPipelineIR, compileToGitHubYAML, compileToGitLabYAML, calculateHealthScore, generateSecretChecklist, generateDotEnvExample, explainPipeline, validatePipeline } from "../core/pipeline/index";
import { tools } from '../data/contentModel';
import { Link } from 'react-router-dom';
import '../index.css';
import { motion } from 'framer-motion';

export default function PipelineArchitect() {
  const { t } = useTranslation('pipeline_architect');
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
    proSettings: { strategy: 'recommended', dockerRegistry: 'ghcr' },
    envVars: [
      { key: 'VERCEL_TOKEN', value: '${{ secrets.VERCEL_TOKEN }}', type: 'Secret', scope: 'deploy' }
    ],
    matrixNodeVersions: ['20.x', '22.x'],
    matrixPythonVersions: ['3.11', '3.12']
  });

  const [vibePrompt, setVibePrompt] = useState("I'm building a Next.js app using pnpm. I want to test on PRs and deploy to Vercel.");
  const [isArchitecting, setIsArchitecting] = useState(false);

  const resolvedPackageManager = useMemo(() => {
    if (config.packageManager !== 'auto') return config.packageManager;
    return config.language === 'node' ? 'npm' : 'pip';
  }, [config.packageManager, config.language]);

  const resolvedConfig = useMemo(() => ({
    ...config,
    packageManager: resolvedPackageManager
  }), [config, resolvedPackageManager]);

  const pipelineIR = useMemo(() => buildPipelineIR(resolvedConfig), [resolvedConfig]);
  const generatedYAML = useMemo(() => compileToGitHubYAML(pipelineIR), [pipelineIR]);
  const gitlabYAML = useMemo(() => compileToGitLabYAML(pipelineIR), [pipelineIR]);
  
  const healthStats = useMemo(() => calculateHealthScore(pipelineIR), [pipelineIR]);
  const validation = useMemo(() => validatePipeline(pipelineIR), [pipelineIR]);
  const explanation = useMemo(() => explainPipeline(pipelineIR), [pipelineIR]);
  
  const secretsChecklist = useMemo(() => generateSecretChecklist(pipelineIR), [pipelineIR]);
  const dotEnvExample = useMemo(() => generateDotEnvExample(pipelineIR), [pipelineIR]);

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

  return (
    <div className="tool-container" style={{ maxWidth: '1350px', margin: '0 auto', padding: '0 1rem' }}>
      <header className="header" style={{ marginBottom: '1rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '2rem' }}>
            <Zap style={{ color: 'var(--accent)' }} size={32} />
            {t('title')}
          </h1>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <button className={`button ${activeMode === 'vibe' ? 'primary' : 'outline'}`} onClick={() => setActiveMode('vibe')}><Sparkles size={18} /> {t('vibe_mode')}</button>
        <button className={`button ${activeMode === 'builder' ? 'primary' : 'outline'}`} onClick={() => setActiveMode('builder')}><Settings2 size={18} /> {t('builder_mode')}</button>
        <button className={`button ${activeMode === 'pro' ? 'primary' : 'outline'}`} onClick={() => setActiveMode('pro')}><Cpu size={18} /> {t('pro_mode')}</button>
      </div>

      <div className="rag-layout" style={{ gridTemplateColumns: '460px 1fr' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {activeMode === 'builder' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="card p-4">
                <h3 className="section-title"><Layers size={18}/> {t('stack')}</h3>
                <div className="input-group">
                  <label>{t('language')}</label>
                  <div className="options-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    <button className={`option-btn ${config.language === 'node' ? 'active' : ''}`} onClick={() => setConfig({...config, language: 'node', packageManager: 'auto'})}>Node.js</button>
                    <button className={`option-btn ${config.language === 'python' ? 'active' : ''}`} onClick={() => setConfig({...config, language: 'python', packageManager: 'auto'})}>Python</button>
                  </div>
                </div>
                <div className="input-group">
                  <label>{t('package_manager')}</label>
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
                <h3 className="section-title"><Box size={18}/> {t('build_deploy')}</h3>
                <div className="input-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input type="checkbox" checked={config.caching} onChange={(e) => setConfig({...config, caching: e.target.checked})} /> {t('dependency_caching')}
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input type="checkbox" checked={config.linting} onChange={(e) => setConfig({...config, linting: e.target.checked})} /> {t('run_linter')}
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input type="checkbox" checked={config.testing} onChange={(e) => setConfig({...config, testing: e.target.checked})} /> {t('run_tests')}
                  </label>
                </div>
                <div className="form-group mb-3">
                  <label>{t('containerize')}</label>
                  <div className="segmented-control">
                    <button className={`option-btn ${!config.containerize ? 'active' : ''}`} onClick={() => setConfig({...config, containerize: false})}>{t('no')}</button>
                    <button className={`option-btn ${config.containerize ? 'active' : ''}`} onClick={() => setConfig({...config, containerize: true})}>{t('yes')}</button>
                  </div>
                </div>
                <div className="form-group mb-0">
                  <label>{t('deployment_target')}</label>
                  <div className="segmented-control">
                    <button className={`option-btn ${config.deploy === 'none' ? 'active' : ''}`} onClick={() => setConfig({...config, deploy: 'none'})}>{t('none')}</button>
                    <button className={`option-btn ${config.deploy === 'vercel' ? 'active' : ''}`} onClick={() => setConfig({...config, deploy: 'vercel'})}>Vercel</button>
                  </div>
                </div>
              </div>

              <div className="card p-4">
                <h3 className="section-title"><Lock size={18}/> {t('scoped_secrets')}</h3>
                <div className="secrets-list">
                  {config.envVars.map((env, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                      <input type="text" placeholder="Key (PORT)" className="text-input" style={{ flex: 1, padding: '0.4rem' }} value={env.key} onChange={(e) => updateEnvVar(i, 'key', e.target.value)} />
                      <select className="text-input" value={env.type} onChange={(e) => updateEnvVar(i, 'type', e.target.value)} style={{ width: '90px', padding: '0.4rem' }}>
                        <option value="Secret">Secret</option><option value="Variable">Var</option>
                      </select>
                      <button className="button outline" style={{ padding: '0.4rem' }} onClick={() => removeEnvVar(i)}><Trash2 size={16} /></button>
                    </div>
                  ))}
                  <button className="button outline mt-2 w-100" onClick={addEnvVar}><Plus size={16} /> {t('add_variable')}</button>
                </div>
              </div>
            </motion.div>
          )}

          {activeMode === 'pro' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-4">
              <h3 className="section-title"><Cpu size={18}/> {t('pro_settings')}</h3>
              <div className="input-group">
                <label>{t('runtime_strategy')}</label>
                <select className="text-input" value={config.proSettings.strategy} onChange={e => setConfig({...config, proSettings: {...config.proSettings, strategy: e.target.value}})}>
                  <option value="recommended">{t('recommended_lts')}</option>
                  <option value="matrix">{t('matrix_testing')}</option>
                </select>
              </div>
              <div className="form-group mb-3">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" checked={config.concurrency} onChange={(e) => setConfig({...config, concurrency: e.target.checked})} />
                  {t('concurrency_cancellation')}
                </label>
              </div>
              {config.containerize && (
                <div style={{ padding: '1rem', background: 'var(--surface-bg)', borderRadius: '8px', border: '1px solid var(--surface-border)' }}>
                  <h4 style={{ fontSize: '0.85rem', marginBottom: '0.75rem', color: 'var(--accent)' }}>{t('docker_buildx_options')}</h4>
                  <div className="input-group" style={{ marginBottom: '0.5rem' }}>
                    <label style={{ fontSize: '0.75rem' }}>{t('platforms')}</label>
                    <input type="text" className="text-input w-100" value={config.dockerPlatforms} onChange={(e) => setConfig({...config, dockerPlatforms: e.target.value})} />
                  </div>
                  <div className="input-group mb-0">
                    <label style={{ fontSize: '0.75rem' }}>{t('registry')}</label>
                    <select className="text-input" style={{ fontSize: '0.8rem', padding: '0.3rem' }} value={config.proSettings.dockerRegistry} onChange={e => setConfig({...config, proSettings: {...config.proSettings, dockerRegistry: e.target.value}})}>
                      <option value="ghcr">GHCR</option><option value="dockerhub">{t('docker_hub')}</option>
                    </select>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '650px' }}>
          <div className="content-header" style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--surface-border)', background: 'var(--surface-bg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="tabs" style={{ display: 'flex', gap: '0.5rem' }}>
              <button className={`button ${activeTab === 'yaml' ? 'primary' : 'outline'}`} onClick={() => setActiveTab('yaml')} style={{ padding: '0.35rem 0.85rem', fontSize: '0.85rem' }}><FileText size={15} /> {t('yaml')}</button>
              <button className={`button ${activeTab === 'graph' ? 'primary' : 'outline'}`} onClick={() => setActiveTab('graph')} style={{ padding: '0.35rem 0.85rem', fontSize: '0.85rem' }}><Activity size={15} /> {t('graph')}</button>
              <button className={`button ${activeTab === 'secrets' ? 'primary' : 'outline'}`} onClick={() => setActiveTab('secrets')} style={{ padding: '0.35rem 0.85rem', fontSize: '0.85rem' }}><Lock size={15} /> {t('secrets')}</button>
              <button className={`button ${activeTab === 'explain' ? 'primary' : 'outline'}`} onClick={() => setActiveTab('explain')} style={{ padding: '0.35rem 0.85rem', fontSize: '0.85rem' }}><HelpCircle size={15} /> {t('explain')}</button>
            </div>
            <div style={{ position: 'relative' }}>
              <button className="button primary" onClick={() => setExportMenuOpen(!exportMenuOpen)}>{t('export')} <ChevronDown size={15} /></button>
              {exportMenuOpen && (
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', background: 'var(--surface-bg)', border: '1px solid var(--surface-border)', borderRadius: '8px', zIndex: 10, width: '220px', padding: '0.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                  <button className="button outline w-100" onClick={() => copyToClipboard(generatedYAML)}>{t('copy_yaml')}</button>
                  <button className="button outline w-100" onClick={() => downloadFile('ci.yml', generatedYAML)}>{t('download_workflow')}</button>
                  <button className="button outline w-100" onClick={() => copyToClipboard(gitlabYAML)}>{t('convert_gitlab')}</button>
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
