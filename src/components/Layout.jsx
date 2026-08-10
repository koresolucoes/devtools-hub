import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Wrench } from 'lucide-react';
import '../index.css';

function Layout() {
  const location = useLocation();
  const isHub = location.pathname === '/';

  return (
    <div className="layout">
      <nav className="navbar">
        <Link to="/" className="logo">
          <Wrench size={20} />
          DevTools Hub
        </Link>
        
        <div className="nav-links">
          {!isHub && (
            <Link to="/">
              <Home size={16} style={{ display: 'inline', marginRight: '0.25rem', verticalAlign: 'text-bottom' }} />
              Voltar ao Hub
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
