import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Activity, ArrowRight, ShieldAlert, GitBranch, 
  Terminal, Package, Box, Layers, RefreshCcw, Loader2, AlertCircle, Search
} from 'lucide-react';
import { analyzeProject } from '../core/analyzeProject';
import HealthDashboard from '../components/ProjectDoctor/HealthDashboard';
import FindingsList from '../components/ProjectDoctor/FindingsList';
import { useTranslation } from 'react-i18next';
import { tools } from '../data/contentModel';
import { getLocalizedField } from '../utils/i18nHelper';
import styles from './ProjectDoctor.module.css';

export default function ProjectDoctor() {
  const { t, i18n } = useTranslation('project_doctor');
  const toolData = tools.find(t => t.slug === 'project-doctor');
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
      <title>{getLocalizedField(toolData, 'seoTitle', i18n.language)}</title>
      <meta name="description" content={getLocalizedField(toolData, 'seoDescription', i18n.language)} />
      <header className={styles.header}>
        <div className={styles.hero}>
          <div className={styles.heroBadge}>
            <Activity size={16} /> {t('translation.hub.tools.project_doctor.name', 'DevsHub Project Doctor')}
          </div>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>{t('title')}</h1>
            <p className={styles.subtitle}>
              <Activity className={styles.pulseIcon} size={24} />
              <strong> {t('subtitle')}</strong>
            </p>
          </div>
        </div>

        <div className={styles.searchContainer}>
          <div className={styles.inputWrapper}>
            <GitBranch className={styles.inputIcon} size={20} />
            <input 
              type="text" 
              className={styles.input} 
              placeholder={t('analyze_placeholder')}
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
              {status === 'ANALYZING' ? <RefreshCcw className="spin" size={18} /> : t('analyze_button')}
              {status !== 'ANALYZING' && <ArrowRight size={18} />}
            </button>
          </div>
          <p className={styles.privacyNotice}>
            <ShieldAlert size={14} /> {t('privacy_notice', 'Analysis runs securely in your browser. No code is stored.')}
          </p>
        </div>
      </header>

      <main className={styles.main}>
        {status === 'ANALYZING' && (
          <div className={styles.loadingState}>
            <Loader2 className={styles.spinner} size={48} />
            <h2>{t('analyzing')}</h2>
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
            <AlertCircle size={48} className={styles.errorIcon} />
            <h2>{t('analysis_failed')}</h2>
            <p>{error}</p>
            <button className={styles.retryButton} onClick={() => handleAnalyze(url)}>{t('try_again')}</button>
          </div>
        )}

        {status === 'SUCCESS' && result && (
          <div className={styles.resultsContainer}>
            <div className={styles.projectSummary}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>{t('files')}</span>
                <span className={styles.summaryValue}>{result.project.files?.length || 0}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>{t('dependencies')}</span>
                <span className={styles.summaryValue}>{result.project.dependencies?.length || 0}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>{t('frameworks_tools')}</span>
                <span className={styles.summaryValue}>
                  {(result.project.infrastructure?.frameworks?.length || 0) + (result.project.infrastructure?.buildTools?.length || 0)}
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>{t('coverage')}</span>
                <span className={styles.summaryValue}>{result.health.coverage?.repositoryCoverage || 100}%</span>
              </div>
            </div>

            <HealthDashboard health={result.health} project={result.project} />
            
            <div className={styles.tabs}>
              <button 
                className={`${styles.tab} ${activeTab === 'findings' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('findings')}
              >
                {t('findings', 'Findings')} ({result.checks.filter(c => c.finding).length})
              </button>
              <button 
                className={`${styles.tab} ${activeTab === 'architecture' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('architecture')}
              >
                {t('architecture_stack', 'Architecture Stack')}
              </button>
            </div>

            <div className={styles.tabContent}>
              {activeTab === 'findings' && (
                <FindingsList findings={result.checks.filter(c => c.finding).map(c => c.finding)} />
              )}

              {activeTab === 'architecture' && (
                <div className={styles.architectureStack}>
                  <div className={styles.infraGroup}>
                    <h3><Terminal size={18}/> {t('languages')}</h3>
                    <div className={styles.tagList}>
                      {result.project.languages.map(l => <span key={l.name} className={styles.tag}>{l.name}</span>)}
                    </div>
                  </div>
                  <div className={styles.infraGroup}>
                    <h3><Box size={18}/> {t('frameworks')}</h3>
                    <div className={styles.tagList}>
                      {result.project.frameworks.map(f => <span key={f.name} className={styles.tag}>{f.name}</span>)}
                    </div>
                  </div>
                  <div className={styles.infraGroup}>
                    <h3><Package size={18}/> {t('package_managers')}</h3>
                    <div className={styles.tagList}>
                      {result.project.packageManagers.map(p => <span key={p.name} className={styles.tag}>{p.name}</span>)}
                    </div>
                  </div>
                  <div className={styles.infraGroup}>
                    <h3><Layers size={18}/> {t('ci_cd_docker')}</h3>
                    <div className={styles.tagList}>
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
