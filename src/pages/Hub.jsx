import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowRight, Plug, BrainCircuit, Baseline, Flag, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import TechFeed from '../components/TechFeed';
import SnippetModal from '../components/SnippetModal';
import CommandPalette from '../components/CommandPalette';
import '../index.css';

function Hub() {
  const { t } = useTranslation();
  const [activeSnippet, setActiveSnippet] = useState(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  
  const allTools = [
    {
      id: 'npm-verify',
      name: t('hub.tools.npm_verify.name', 'OSV Dependency Scanner'),
      description: t('hub.tools.npm_verify.description', 'Detect vulnerable packages and supply-chain risks.'),
      icon: <ShieldAlert size={20} />,
      path: '/npm-verify',
      status: 'stable',
      category: 'Security',
      tags: ['Node.js', 'Python', 'OSV']
    },
    {
      id: 'rag-sandbox',
      name: t('hub.tools.rag_sandbox.name', 'RAG Chunking Sandbox'),
      description: t('hub.tools.rag_sandbox.description', 'Test and optimize chunking strategies for embeddings.'),
      icon: <BrainCircuit size={20} />,
      path: '/rag-sandbox',
      status: 'beta',
      category: 'AI Engineering',
      tags: ['Embeddings']
    },
    {
      id: 'token-estimator',
      name: t('hub.tools.token_estimator.name', 'Token Estimator & Pricing'),
      description: t('hub.tools.token_estimator.description', 'Calculate LLM context size and costs across providers.'),
      icon: <Baseline size={20} />,
      path: '/token-estimator',
      status: 'stable',
      category: 'AI Engineering',
      tags: ['LLM', 'Pricing']
    },
    {
      id: 'cicd-builder',
      name: t('hub.tools.cicd_builder.name', 'Pipeline Architect'),
      description: t('hub.tools.cicd_builder.description', 'Production-ready CI/CD without learning DevOps.'),
      icon: <Plug size={24} />,
      path: '/cicd-builder',
      status: 'new',
      category: 'DevOps / CI/CD',
      tags: ['GitHub Actions', 'GitLab', 'Docker', 'Vercel']
    },
    {
      id: 'mcp-inspector',
      name: t('hub.tools.mcp_inspector.name', 'MCP Inspector'),
      description: t('hub.tools.mcp_inspector.description', 'Inspect and debug Model Context Protocol capabilities.'),
      icon: <Flag size={20} />,
      path: '/mcp',
      status: 'soon',
      category: 'MCP',
      tags: ['Context Protocol']
    }
  ];

  const featuredToolId = 'cicd-builder';
  const featuredTool = allTools.find(t => t.id === featuredToolId);
  const gridTools = allTools.filter(t => t.id !== featuredToolId);

  return (
    <div className="hub-container">
      
      <header className="hub-header">
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', letterSpacing: '-0.02em', fontWeight: 800 }}>
          Build fast. Ship like an engineer.
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto' }}>
          DevOps, AI and architecture tools made for vibecoders.
        </p>

        <div className="search-bar-hero">
          <Search className="search-bar-hero-icon" size={20} />
          <input 
            type="text" 
            placeholder="Search tools, snippets or commands..." 
            onClick={() => setIsCommandPaletteOpen(true)}
            readOnly
          />
          <div className="search-bar-hero-shortcut">⌘ K</div>
        </div>

        <div className="category-chips">
          {['CI/CD', 'AI', 'MCP', 'Docker', 'Git', 'Security'].map(cat => (
            <button key={cat} className="category-chip">{cat}</button>
          ))}
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', maxWidth: '1200px', margin: '0 auto' }}>

        {/* Compact Security Alert Banner */}
        <div style={{ 
          background: 'var(--surface-bg)', 
          border: '1px solid var(--danger)',
          borderRadius: 'var(--radius-lg)',
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShieldAlert size={18} style={{ color: 'var(--danger)' }} />
            <span style={{ color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: 500 }}>
              <span style={{ color: 'var(--danger)', marginRight: '0.5rem' }}>SECURITY ALERT</span>
              NPM supply-chain attack affecting 40 packages.
            </span>
          </div>
          <Link to="/npm-verify" style={{ color: 'var(--danger)', fontSize: '0.875rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            View affected packages <ArrowRight size={14} />
          </Link>
        </div>

        {/* Featured Tool */}
        {featuredTool && (
          <Link to={featuredTool.path} className="card featured-tool-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ background: 'var(--surface-bg)', border: '1px solid var(--surface-border)', padding: '0.75rem', borderRadius: '12px' }}>
                  {featuredTool.icon}
                </div>
                <div className="tool-category-badge" style={{ marginBottom: 0 }}>FEATURED TOOL</div>
              </div>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{featuredTool.name}</h2>
              <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '500px' }}>
                {featuredTool.description}
              </p>
              <div className="tool-tags">
                {featuredTool.tags?.map(tag => (
                  <span key={tag} className="tool-tag">{tag}</span>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
              <div className="button outline" style={{ pointerEvents: 'none' }}>
                Build a Pipeline <ArrowRight size={16} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <span>Health Score</span>
                <span>·</span>
                <span>Visual Editor</span>
              </div>
            </div>
          </Link>
        )}

        {/* Tools Grid */}
        <div>
          <h2 style={{ fontSize: '1.125rem', marginBottom: '1.5rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--surface-border)', paddingBottom: '0.75rem' }}>
            ALL TOOLS
          </h2>
          <div className="tools-grid">
            {gridTools.map(tool => (
              tool.status !== 'soon' ? (
                <Link to={tool.path} key={tool.id} className="tool-card card">
                  <div className="tool-card-icon">
                    {tool.icon}
                    <span className={`tool-status-badge ${tool.status}`}>
                      {tool.status.charAt(0).toUpperCase() + tool.status.slice(1)}
                    </span>
                  </div>
                  <div className="tool-card-content">
                    <span className="tool-category-badge">{tool.category}</span>
                    <h3>{tool.name}</h3>
                    <p>{tool.description}</p>
                    {tool.tags && (
                      <div className="tool-tags">
                        {tool.tags.map(tag => <span key={tag} className="tool-tag">{tag}</span>)}
                      </div>
                    )}
                  </div>
                  <div className="tool-card-action">
                    <span>Open tool</span>
                    <ArrowRight size={16} />
                  </div>
                </Link>
              ) : (
                <div key={tool.id} className="tool-card card" style={{ opacity: 0.7, cursor: 'not-allowed' }}>
                  <div className="tool-card-icon">
                    {tool.icon}
                    <span className={`tool-status-badge ${tool.status}`}>Soon</span>
                  </div>
                  <div className="tool-card-content">
                    <span className="tool-category-badge">{tool.category}</span>
                    <h3>{tool.name}</h3>
                    <p>{tool.description}</p>
                    {tool.tags && (
                      <div className="tool-tags">
                        {tool.tags.map(tag => <span key={tag} className="tool-tag">{tag}</span>)}
                      </div>
                    )}
                  </div>
                  <div className="tool-card-action">
                    <span>Coming soon</span>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>

        {/* Dev Briefing (TechFeed now renders horizontally) */}
        <TechFeed />

      </div>

      <SnippetModal 
        snippetId={activeSnippet} 
        onClose={() => setActiveSnippet(null)} 
      />
      <CommandPalette 
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSnippetSelect={(id) => { setIsCommandPaletteOpen(false); setActiveSnippet(id); }}
      />
    </div>
  );
}

export default Hub;
