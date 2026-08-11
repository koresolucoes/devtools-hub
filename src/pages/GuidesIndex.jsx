import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { guides } from '../data/contentModel';
import { useTranslation } from 'react-i18next';
import '../index.css';

export default function GuidesIndex() {
  const { t } = useTranslation();
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <BookOpen size={32} /> {t('hub.latest_guides', 'Guides & Tutorials')}
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
          {t('guides_index.subtitle', 'Deep-dive engineering guides for modern development workflows.')}
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {guides.map(g => (
          <Link to={`/guides/${g.slug}`} key={g.slug} className="card p-6" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              {g.category}
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>{g.title}</h3>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.6' }}>{g.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
