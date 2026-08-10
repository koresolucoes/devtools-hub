import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Terminal, Search, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../index.css';

function Layout() {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const isHub = location.pathname === '/';

  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith('en') ? 'pt' : 'en';
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
            <Link to="/">Tools</Link>
            <Link to="/">Snippets</Link>
            <Link to="/">Briefing</Link>
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
        padding: '2rem',
        textAlign: 'center',
        borderTop: '1px solid var(--surface-border)',
        color: 'var(--text-secondary)',
        fontSize: '0.875rem',
        marginTop: 'auto'
      }}>
        © {new Date().getFullYear()} DevsHub. Built by Kore Soluções.
      </footer>
    </div>
  );
}

export default Layout;
