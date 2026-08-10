import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowRight, Plug, BrainCircuit, Baseline, Flag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
import AdBanner from '../components/AdBanner';
import SnippetsSidebar from '../components/SnippetsSidebar';
import TechFeed from '../components/TechFeed';
import SnippetModal from '../components/SnippetModal';
import '../index.css';

function Hub() {
  const { t } = useTranslation();
  const [activeSnippet, setActiveSnippet] = useState(null);
  
  const tools = [
    {
      id: 'npm-verify',
      name: t('hub.tools.npm_verify.name'),
      description: t('hub.tools.npm_verify.description'),
      icon: <ShieldAlert size={20} />,
      path: '/npm-verify',
      status: 'active'
    },
    {
      id: 'rag-sandbox',
      name: t('hub.tools.rag_sandbox.name'),
      description: t('hub.tools.rag_sandbox.description'),
      icon: <BrainCircuit size={20} />,
      path: '/rag-sandbox',
      status: 'active'
    },
    {
      id: 'token-estimator',
      name: t('hub.tools.token_estimator.name'),
      description: t('hub.tools.token_estimator.description'),
      icon: <Baseline size={20} />,
      path: '/token-estimator',
      status: 'active'
    },
    {
      id: 'cicd-builder',
      name: t('hub.tools.cicd_builder.name'),
      description: t('hub.tools.cicd_builder.description'),
      icon: <Plug size={20} />,
      path: '/cicd-builder',
      status: 'active'
    },
    {
      id: 'mcp-inspector',
      name: t('hub.tools.mcp_inspector.name'),
      description: t('hub.tools.mcp_inspector.description'),
      icon: <Flag size={20} />,
      path: '/mcp',
      status: 'coming-soon'
    }
  ];

  return (
    <div className="hub-container">
      
      <header className="hub-header">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          {t('hub.title')}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          {t('hub.subtitle')}
        </p>
      </header>

      <div className="dashboard-layout">
        
        {/* Left Column: Snippets */}
        <SnippetsSidebar onSnippetClick={setActiveSnippet} />

        {/* Center Column: Core Tools */}
        <div className="tools-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Security Alert Banner */}
          <div className="card" style={{ 
            background: 'linear-gradient(to right, rgba(239, 68, 68, 0.1), transparent)', 
            border: '1px solid var(--danger)',
            padding: '1.5rem',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--danger)' }}></div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <ShieldAlert size={24} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h3 style={{ color: 'var(--danger)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>{t('hub.alert.title')}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: '1.5' }} dangerouslySetInnerHTML={{ __html: t('hub.alert.text') }} />
                <Link to="/npm-verify" className="button" style={{ background: 'var(--danger)', color: 'white', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  {t('hub.alert.button')} <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="tools-grid">
          {tools.map(tool => (
            <div key={tool.id} className={`tool-card card ${tool.status}`}>
              <div className="tool-card-icon">
                {tool.icon}
              </div>
              <div className="tool-card-content">
                <h3>{tool.name}</h3>
                <p>{tool.description}</p>
              </div>
              {tool.status === 'active' ? (
                <Link to={tool.path} className="tool-card-action button outline">
                  {t('hub.actions.start')} <ArrowRight size={16} />
                </Link>
              ) : (
                <button className="tool-card-action button" disabled>
                  {t('hub.actions.coming_soon')}
                </button>
              )}
            </div>
          ))}
        </div>
        </div>

        {/* Right Column: HackerNews Feed */}
        <TechFeed />

      </div>

      <SnippetModal 
        snippetId={activeSnippet} 
        onClose={() => setActiveSnippet(null)} 
      />
    </div>
  );
}

export default Hub;
