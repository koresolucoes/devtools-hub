import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Activity, ArrowRight, ShieldAlert, GitBranch, 
  Terminal, Package, Box, Layers, RefreshCcw, CheckCircle, Search
} from 'lucide-react';
import { analyzeProject } from '../core/analyzeProject';
import HealthDashboard from '../components/ProjectDoctor/HealthDashboard';
import FindingsList from '../components/ProjectDoctor/FindingsList';
import styles from './ProjectDoctor.module.css';

export default function ProjectDoctor() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialUrl = searchParams.get('url') || '';
  
  const [url, setUrl] = useState(initialUrl);
  const [status, setStatus] = useState('IDLE'); // IDLE, ANALYZING, SUCCESS, ERROR
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('findings'); // findings, architecture

  useEffect(() => {
    if (initialUrl && status === 'IDLE') {
      handleAnalyze(initialUrl);
    }
  }, []);

  const handleAnalyze = async (repoUrl) => {
    if (!repoUrl) return;
    
    setSearchParams({ url: repoUrl });
    setStatus('ANALYZING');
    setError(null);
    setResult(null);
    setLoadingLogs([]);

    try {
      const analysisResult = await analyzeProject(repoUrl, {
        dependencySecurity: true,
        onProgress: (stage, progress) => {
          let message = '';
          switch (stage) {
            case 'ANALYZING_REPOSITORY': message = '[System] Initializing DevsHub Project Doctor engine...\n[Network] Fetching repository metadata...'; break;
            case 'SCANNING_SECURITY': message = '[Scanner] Cross-referencing OSV vulnerability database...'; break;
            case 'EVALUATING_RULES': message = '[Analyzer] Detecting languages, frameworks, and tools...\n[Rules] Evaluating health checks...'; break;
            case 'CALCULATING_HEALTH': message = '[Engine] Finalizing project IR and generating remediation...'; break;
            case 'COMPLETE': message = '[System] Analysis complete.'; break;
            default: message = `[System] Progress: ${progress}%`;
          }
          if (message) {
            message.split('\n').forEach(msg => {
              setLoadingLogs(prev => [...prev, msg]);
            });
          }
        }
      });
      setResult(analysisResult);
      setStatus('SUCCESS');
    } catch (err) {
      setError(err.message || 'Failed to analyze repository');
      setStatus('ERROR');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAnalyze(url);
  };

  const [loadingLogs, setLoadingLogs] = useState([]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.hero}>
          <div className={styles.heroBadge}>
            <Activity size={16} /> DevsHub Project Doctor
          </div>
          <h1 className={styles.title}>Ship with confidence.</h1>
          <p className={styles.subtitle}>
            Paste your GitHub repository. We'll analyze your stack, dependencies, CI/CD, and architecture to ensure it's ready for production. 
            <strong> Vibe code fast. We make sure it actually ships.</strong>
          </p>
        </div>

        <div className={styles.searchContainer}>
          <div className={styles.inputWrapper}>
            <GitBranch className={styles.inputIcon} size={20} />
            <input 
              type="text" 
              className={styles.input} 
              placeholder="https://github.com/owner/repo"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={status === 'ANALYZING'}
            />
            <button 
              className={styles.analyzeButton} 
              onClick={() => handleAnalyze(url)}
              disabled={!url || status === 'ANALYZING'}
            >
              {status === 'ANALYZING' ? <RefreshCcw className="spin" size={18} /> : 'Analyze'}
              {status !== 'ANALYZING' && <ArrowRight size={18} />}
            </button>
          </div>
          <p className={styles.privacyNotice}>
            <ShieldAlert size={14} /> Analysis runs securely in your browser. No code is stored.
          </p>
        </div>
      </header>

      <main className={styles.main}>
        {status === 'ANALYZING' && (
          <div className={styles.loadingState}>
            <Terminal size={48} className={styles.loadingIcon} style={{ animation: 'pulse 2s infinite' }} />
            <h2>Analyzing Repository...</h2>
            <div className={styles.terminalContainer}>
              {loadingLogs.map((log, index) => (
                <div key={index} className={styles.terminalLog}>
                  <span style={{ color: 'var(--success)' }}>➜</span> {log}
                </div>
              ))}
              <div className={styles.terminalCursor}>_</div>
            </div>
          </div>
        )}

        {status === 'ERROR' && (
          <div className={styles.errorState}>
            <ShieldAlert size={48} className={styles.errorIcon} />
            <h2>Analysis Failed</h2>
            <p>{error}</p>
            <button className={styles.retryButton} onClick={() => handleAnalyze(url)}>Try Again</button>
          </div>
        )}

        {status === 'SUCCESS' && result && (
          <div className={styles.resultsContainer}>
            <div className={styles.projectSummary}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Files</span>
                <span className={styles.summaryValue}>{result.project.files.length}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Dependencies</span>
                <span className={styles.summaryValue}>{result.project.dependencies.length}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Frameworks & Tools</span>
                <span className={styles.summaryValue}>{result.project.frameworks.length}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Coverage</span>
                <span className={styles.summaryValue}>{result.health.coverage?.checkCoverage ?? 100}%</span>
              </div>
            </div>

            <HealthDashboard health={result.health} project={result.project} />
            
            <div className={styles.tabs}>
              <button 
                className={`${styles.tab} ${activeTab === 'findings' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('findings')}
              >
                Findings ({result.checks.filter(c => c.finding).length})
              </button>
              <button 
                className={`${styles.tab} ${activeTab === 'architecture' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('architecture')}
              >
                Architecture Stack
              </button>
            </div>

            <div className={styles.tabContent}>
              {activeTab === 'findings' && (
                <FindingsList findings={result.checks.filter(c => c.finding).map(c => c.finding)} />
              )}

              {activeTab === 'architecture' && (
                <div className={styles.architectureStack}>
                  <div className={styles.stackCard}>
                    <h3><Terminal size={18}/> Languages</h3>
                    <div className={styles.tags}>
                      {result.project.languages.map(l => <span key={l.name} className={styles.tag}>{l.name}</span>)}
                    </div>
                  </div>
                  <div className={styles.stackCard}>
                    <h3><Box size={18}/> Frameworks</h3>
                    <div className={styles.tags}>
                      {result.project.frameworks.map(f => <span key={f.name} className={styles.tag}>{f.name}</span>)}
                    </div>
                  </div>
                  <div className={styles.stackCard}>
                    <h3><Package size={18}/> Package Managers</h3>
                    <div className={styles.tags}>
                      {result.project.packageManagers.map(p => <span key={p.name} className={styles.tag}>{p.name}</span>)}
                    </div>
                  </div>
                  <div className={styles.stackCard}>
                    <h3><Layers size={18}/> CI / CD & Docker</h3>
                    <div className={styles.tags}>
                      {result.project.infrastructure.ci.map(c => <span key={c.name} className={styles.tag}>{c.name}</span>)}
                      {result.project.infrastructure.docker?.hasDockerfile && <span className={styles.tag}>Docker</span>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
