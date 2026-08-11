import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Search, ArrowRight, Check, Activity, Globe, Server, Terminal, Play, Layers, Triangle } from 'lucide-react';
import { templates } from '../data/contentModel';
import { useTranslation } from 'react-i18next';
import '../index.css';

const getStackIcon = (stack) => {
  const s = stack.toLowerCase();
  let url = '';
  if (s.includes('next')) url = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg';
  else if (s.includes('react')) url = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg';
  else if (s.includes('node')) url = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg';
  else if (s.includes('fastapi')) url = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg';
  else if (s.includes('python')) url = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg';
  else if (s.includes('docker')) url = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg';
  else if (s.includes('github') || s.includes('action') || s.includes('ghcr')) url = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg';
  else if (s.includes('vercel')) url = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg';
  
  if (url) {
    const isDarkLogo = s.includes('next') || s.includes('vercel') || s.includes('github') || s.includes('action') || s.includes('ghcr');
    return <img src={url} alt={stack} style={{ width: '14px', height: '14px', marginRight: '6px', filter: isDarkLogo ? 'invert(1)' : 'none' }} />;
  }
  return <Terminal size={14} style={{ marginRight: '6px' }} />;
};

export default function TemplatesIndex() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  
  const categories = ['All', 'CI/CD', 'Docker', 'Deploy'];
  
  const filteredTemplates = filter === 'All' 
    ? templates 
    : templates.filter(tmpl => tmpl.category === filter);

  // Collect unique stacks
  const allStacks = Array.from(new Set(templates.flatMap(tmpl => tmpl.stack))).sort();

  return (
    <div style={{ minHeight: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem 6rem', width: '100%' }}>
        
        {/* HERO */}
        <header style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem', color: 'var(--text-primary)', letterSpacing: '-0.02em', fontWeight: 800 }}>
            {t('templates_index.title', 'Architecture Templates')}
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '800px' }}>
            {t('templates_index.subtitle', 'Start from proven architecture, not a blank file. Production-ready blueprints for CI/CD, infrastructure and deployment.')}
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="search-bar-hero" style={{ margin: 0, maxWidth: '300px', flex: '1 1 auto', height: '42px' }}>
              <Search className="search-bar-hero-icon" size={18} />
              <input type="text" placeholder={t('templates_index.search', 'Search templates...')} />
            </div>
            
            <div className="category-chips" style={{ margin: 0 }}>
              {categories.map(cat => (
                <button 
                  key={cat} 
                  className={`category-chip ${filter === cat ? 'active' : ''}`}
                  onClick={() => setFilter(cat)}
                  style={filter === cat ? { background: 'var(--text-primary)', color: 'var(--surface-bg)', borderColor: 'var(--text-primary)' } : {}}
                >
                  {t(`templates_index.category_${cat.toLowerCase().replace('/', '')}`, cat)}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* TEMPLATES GRID */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
          gap: '2rem',
          marginBottom: '5rem'
        }}>
          {filteredTemplates.map(tmp => (
            <div key={tmp.slug} className="card" style={{ 
              display: 'flex', flexDirection: 'column', 
              padding: '1.5rem', borderRadius: '12px', 
              border: '1px solid var(--surface-border)', 
              background: 'var(--surface-bg)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}>
              
              {/* Header: Category and Status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase' }}>
                    {t(`templates.${tmp.slug}.category`, tmp.category)}
                  </div>
                  {tmp.status && (
                    <div style={{ fontSize: '0.65rem', border: '1px solid var(--surface-border)', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', letterSpacing: '0.05em' }}>
                      <Activity size={10} /> {t(`templates.status.${tmp.status.toLowerCase()}`, tmp.status)}
                    </div>
                  )}
                </div>
                {tmp.tag && (
                  <div style={{ fontSize: '0.7rem', background: tmp.tag === 'POPULAR' ? 'rgba(234, 179, 8, 0.1)' : 'rgba(59, 130, 246, 0.1)', color: tmp.tag === 'POPULAR' ? '#eab308' : '#3b82f6', padding: '2px 8px', borderRadius: '12px', fontWeight: 600, letterSpacing: '0.05em' }}>
                    {t(`templates.tag.${tmp.tag.toLowerCase()}`, tmp.tag)}
                  </div>
                )}
              </div>

              {/* Title & Summary */}
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>{t(`templates.${tmp.slug}.title`, tmp.title)}</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.5', minHeight: '44px' }}>
                {t(`templates.${tmp.slug}.summary`, tmp.summary)}
              </p>

              {/* Flowchart Preview */}
              {tmp.flow && (
                <div style={{ 
                  background: 'rgba(0,0,0,0.1)', 
                  border: '1px solid var(--surface-border)', 
                  borderRadius: '8px', 
                  padding: '1rem', 
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  {tmp.flow.map((step, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontFamily: 'monospace', background: 'var(--surface-bg)', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--surface-border)' }}>
                        {t(`templates.${tmp.slug}.flow.${idx}`, step)}
                      </span>
                      {idx < tmp.flow.length - 1 && <ArrowRight size={14} style={{ color: 'var(--text-secondary)' }} />}
                    </div>
                  ))}
                </div>
              )}

              {/* Stacks */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {tmp.stack?.map(s => (
                  <span key={s} style={{ display: 'flex', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'transparent', border: '1px solid var(--surface-border)', padding: '2px 10px', borderRadius: '12px' }}>
                    {getStackIcon(s)}
                    {s}
                  </span>
                ))}
              </div>

              {/* Features */}
              {tmp.features && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem', flexGrow: 1 }}>
                  {tmp.features.map((feat, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      <Check size={14} style={{ color: 'var(--accent)' }} /> {t(`templates.${tmp.slug}.features.${idx}`, feat)}
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto', flexWrap: 'wrap' }}>
                <Link to={`/templates/${tmp.slug}`} className="button outline" style={{ flex: '1', justifyContent: 'center', fontSize: '0.9rem', padding: '0.6rem', textAlign: 'center' }}>
                  {t('templates_index.view', 'View')}
                </Link>
                <button 
                  className="button primary" 
                  onClick={() => navigate('/tools/pipeline-architect')}
                  style={{ flex: '3', justifyContent: 'center', fontSize: '0.9rem', padding: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  {t('templates_index.customize', 'Customize in Pipeline Architect')} <ArrowRight size={14} />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* BROWSE BY STACK */}
        <section style={{ borderTop: '1px solid var(--surface-border)', paddingTop: '3rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
            {t('templates_index.browse_stack', 'Browse by stack')}
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', color: 'var(--text-secondary)' }}>
            {allStacks.map((s, idx) => (
              <span key={s} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link 
                  to={`/templates?stack=${s.toLowerCase()}`} 
                  style={{ color: 'inherit', textDecoration: 'none', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
                  onMouseLeave={(e) => e.target.style.color = 'inherit'}
                >
                  {getStackIcon(s)}
                  {s}
                </Link>
                {idx < allStacks.length - 1 && <span>·</span>}
              </span>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
