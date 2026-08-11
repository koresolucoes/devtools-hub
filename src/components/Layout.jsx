import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Terminal, Search, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CookieBanner from './CookieBanner';
import '../index.css';

function Layout() {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const isHub = location.pathname === '/';

  const toggleLanguage = () => {
    const langs = ['en', 'pt', 'es'];
    const currentIndex = langs.findIndex(l => i18n.language.startsWith(l));
    const nextLang = langs[(currentIndex + 1) % langs.length] || 'en';
    i18n.changeLanguage(nextLang);
  };

  return (
    <div className="layout">
      <nav className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/" className="logo">
            <Terminal size={20} style={{ color: 'var(--text-primary)' }} />
            DevsHub
          </Link>
          
          <div className="nav-links" style={{ display: 'none' }}>
            {/* These are just visual anchors for the homepage or router links */}
            <Link to="/">{t('layout.nav.tools', 'Tools')}</Link>
            <Link to="/templates">{t('layout.nav.templates', 'Templates')}</Link>
            <Link to="/briefing">{t('layout.nav.briefing', 'Briefing')}</Link>
          </div>
          {/* Unhide nav-links on desktop */}
          <style>{`@media(min-width: 768px) { .nav-links { display: flex !important; } }`}</style>
        </div>

        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            <Search size={16} />
            <span style={{ fontFamily: 'monospace', background: 'var(--surface-bg)', border: '1px solid var(--surface-border)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>⌘ K</span>
          </div>

          <a href="https://github.com" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', display: 'flex' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4"></path></svg>
          </a>

          <button 
            onClick={toggleLanguage}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}
            title={i18n.language.startsWith('en') ? 'Switch to Portuguese' : 'Switch to English'}
          >
            <Globe size={18} />
          </button>
          
          {!isHub && (
            <Link to="/" className="button outline" style={{ padding: '0.4rem 0.8rem' }}>
              <Home size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
              {t('layout.back_to_hub', 'Hub')}
            </Link>
          )}
        </div>
      </nav>
      
      <main>
        <Outlet />
      </main>

      <footer style={{
        background: 'var(--surface-bg)',
        borderTop: '1px solid var(--surface-border)',
        padding: '4rem 2rem 2rem',
        marginTop: 'auto'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontWeight: 'bold', marginBottom: '1rem', fontSize: '1.1rem' }}>
                <Terminal size={18} /> DevsHub
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Tools, templates, and intelligence for developers who want to build fast and ship like engineers.
              </p>
            </div>
            
            <div>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Developer Tools</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li><Link to="/tools/pipeline-architect" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Pipeline Architect</Link></li>
                <li><Link to="/tools/osv-dependency-scanner" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>OSV Dependency Scanner</Link></li>
                <li><Link to="/tools/rag-chunking-sandbox" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>RAG Sandbox</Link></li>
                <li><Link to="/tools/token-estimator" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Token Estimator</Link></li>
              </ul>
            </div>

            <div>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('layout.footer.resources', 'Resources')}</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li><Link to="/guides" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>{t('layout.footer.guides', 'Guides & Tutorials')}</Link></li>
                <li><Link to="/templates" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>{t('layout.footer.templates', 'Architecture Templates')}</Link></li>
                <li><Link to="/briefing" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>{t('layout.footer.briefing', 'Developer Intelligence')}</Link></li>
              </ul>
            </div>

            <div>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('layout.footer.about', 'About')}</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li><a href="https://github.com/Koresolucoes" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>GitHub</a></li>
                <li><span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t('layout.footer.built_by', 'Built by Kore Soluções')}</span></li>
              </ul>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '2rem', borderTop: '1px solid var(--surface-border)', color: 'var(--text-secondary)', fontSize: '0.8rem', flexWrap: 'wrap', gap: '1rem' }}>
            <span>© 2026 DevsHub · Kore Serviços de Tecnologia</span>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>{t('layout.footer.terms', 'Terms')}</Link>
              <Link to="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>{t('layout.footer.privacy', 'Privacy')}</Link>
              <Link to="/cookies" style={{ color: 'inherit', textDecoration: 'none' }}>{t('layout.footer.cookies', 'Cookies')}</Link>
              <Link to="/legal" style={{ color: 'inherit', textDecoration: 'none' }}>{t('layout.footer.legal', 'Legal')}</Link>
              <span>CNPJ 63.135.423/0001-39</span>
            </div>
          </div>
        </div>
      </footer>
      <CookieBanner />
    </div>
  );
}

export default Layout;
