import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Wrench, Globe } from 'lucide-react';
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
        <Link to="/" className="logo">
          <Wrench size={24} style={{ color: 'var(--accent-color)' }} />
          DevTools Hub
        </Link>
        
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={toggleLanguage}
            className="button outline"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
          >
            <Globe size={14} />
            {i18n.language.startsWith('en') ? 'EN' : 'PT'}
          </button>
          
          {!isHub && (
            <Link to="/">
              <Home size={18} style={{ display: 'inline', marginRight: '0.25rem', verticalAlign: 'text-bottom' }} />
              {t('layout.back_to_hub', 'Back to Hub')}
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
        © {new Date().getFullYear()} DevTools Hub. Minimalist Edition.
      </footer>
    </div>
  );
}

export default Layout;
