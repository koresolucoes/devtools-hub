import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowRight, Search, BookOpen, Box, Flag, Plug, Baseline, BrainCircuit } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import TechFeed from '../components/TechFeed';
import SnippetModal from '../components/SnippetModal';
import CommandPalette from '../components/CommandPalette';
import { tools, guides, templates } from '../data/contentModel';
import '../index.css';

const getIcon = (slug) => {
  switch(slug) {
    case 'osv-dependency-scanner': return <ShieldAlert size={20} />;
    case 'rag-chunking-sandbox': return <BrainCircuit size={20} />;
    case 'token-estimator': return <Baseline size={20} />;
    case 'pipeline-architect': return <Plug size={24} />;
    default: return <Flag size={20} />;
  }
};

function Hub() {
  const { t } = useTranslation();
  const [activeSnippet, setActiveSnippet] = useState(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  
  const featuredToolSlug = 'pipeline-architect';
  const featuredTool = tools.find(t => t.slug === featuredToolSlug);
  const gridTools = tools.filter(t => t.slug !== featuredToolSlug);

  return (
    <div className="hub-container" style={{ padding: '0 1.5rem' }}>
      
      <header className="hub-header" style={{ marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', letterSpacing: '-0.02em', fontWeight: 800 }}>
          {t('hub.title', 'Build fast. Ship like an engineer.')}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto' }}>
          {t('hub.subtitle', 'DevOps, AI and architecture tools made for vibecoders.')}
        </p>

        <div className="search-bar-hero">
          <Search className="search-bar-hero-icon" size={20} />
          <input 
            type="text" 
            placeholder={t('hub.search', 'Search tools, snippets or commands...')} 
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
              <span style={{ color: 'var(--danger)', marginRight: '0.5rem' }}>{t('hub.security_alert', 'SECURITY ALERT')}</span>
              {t('hub.security_text', 'NPM supply-chain attack affecting 40 packages.')}
            </span>
          </div>
          <Link to="/tools/osv-dependency-scanner" style={{ color: 'var(--danger)', fontSize: '0.875rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {t('hub.security_button', 'View affected packages')} <ArrowRight size={14} />
          </Link>
        </div>

        {/* Featured Tool */}
        {featuredTool && (
          <Link to={`/tools/${featuredTool.slug}`} className="card featured-tool-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ background: 'var(--surface-bg)', border: '1px solid var(--surface-border)', padding: '0.75rem', borderRadius: '12px' }}>
                  {getIcon(featuredTool.slug)}
                </div>
                <div className="tool-category-badge" style={{ marginBottom: 0 }}>{t('hub.featured_tool', 'FEATURED TOOL')}</div>
              </div>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{featuredTool.name}</h2>
              <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '500px' }}>
                {featuredTool.shortDescription}
              </p>
              <div className="tool-tags">
                {featuredTool.features?.slice(0, 3).map(tag => (
                  <span key={tag} className="tool-tag">{tag}</span>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
              <div className="button outline" style={{ pointerEvents: 'none' }}>
                {t('hub.featured_action', 'Open Tool')} <ArrowRight size={16} />
              </div>
            </div>
          </Link>
        )}

        {/* Tools Grid */}
        <div>
          <h2 style={{ fontSize: '1.125rem', marginBottom: '1.5rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--surface-border)', paddingBottom: '0.75rem' }}>
            {t('hub.all_tools', 'ALL TOOLS')}
          </h2>
          <div className="tools-grid">
            {gridTools.map(tool => (
              tool.status !== 'soon' ? (
                <Link to={`/tools/${tool.slug}`} key={tool.slug} className="tool-card card">
                  <div className="tool-card-icon">
                    {getIcon(tool.slug)}
                    <span className={`tool-status-badge ${tool.status || 'stable'}`}>
                      {tool.status ? (tool.status.charAt(0).toUpperCase() + tool.status.slice(1)) : 'Stable'}
                    </span>
                  </div>
                  <div className="tool-card-content">
                    <span className="tool-category-badge">{tool.category || 'Tool'}</span>
                    <h3>{tool.name}</h3>
                    <p>{tool.shortDescription}</p>
                    {tool.supportedStacks && (
                      <div className="tool-tags">
                        {tool.supportedStacks.slice(0, 3).map(tag => <span key={tag} className="tool-tag">{tag}</span>)}
                      </div>
                    )}
                  </div>
                  <div className="tool-card-action">
                    <span>{t('hub.open_tool', 'Open tool')}</span>
                    <ArrowRight size={16} />
                  </div>
                </Link>
              ) : (
                <div key={tool.slug} className="tool-card card" style={{ opacity: 0.5, cursor: 'not-allowed', filter: 'grayscale(100%)' }}>
                  <div className="tool-card-icon" style={{ opacity: 0.5 }}>
                    {getIcon(tool.slug)}
                    <span className="tool-status-badge soon">{t('hub.soon', 'Soon')}</span>
                  </div>
                  <div className="tool-card-content">
                    <span className="tool-category-badge">{tool.category || 'Tool'}</span>
                    <h3>{tool.name}</h3>
                    <p>{tool.shortDescription}</p>
                  </div>
                  <div className="tool-card-action" style={{ opacity: 0.5 }}>
                    <span>{t('hub.coming_soon', 'Coming soon')}</span>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
        
        {/* Guides & Templates Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.125rem', marginBottom: '1.5rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--surface-border)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={18} /> {t('hub.latest_guides', 'LATEST GUIDES')}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {guides.slice(0, 3).map(g => (
                <Link to={`/guides/${g.slug}`} key={g.slug} className="card" style={{ padding: '1rem', borderRadius: '8px', textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>{g.category}</div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{g.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{g.summary}</p>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 style={{ fontSize: '1.125rem', marginBottom: '1.5rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--surface-border)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Box size={18} /> {t('hub.popular_templates', 'POPULAR TEMPLATES')}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {templates.slice(0, 3).map(t => (
                <Link to={`/templates/${t.slug}`} key={t.slug} className="card" style={{ padding: '1rem', borderRadius: '8px', textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>{t.category}</div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{t.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{t.summary}</p>
                </Link>
              ))}
            </div>
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
