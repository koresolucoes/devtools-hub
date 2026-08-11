import { Link } from 'react-router-dom';
import { Box } from 'lucide-react';
import { templates } from '../data/contentModel';
import { useTranslation } from 'react-i18next';
import '../index.css';

export default function TemplatesIndex() {
  const { t } = useTranslation();
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Box size={32} /> {t('hub.popular_templates', 'Architecture Templates')}
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
          {t('templates_index.subtitle', 'Production-ready architecture blueprints and starter kits.')}
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {templates.map(tmp => (
          <Link to={`/templates/${tmp.slug}`} key={tmp.slug} className="card" style={{ padding: '1.5rem', borderRadius: '8px', textDecoration: 'none', color: 'inherit' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              {tmp.category}
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>{tmp.title}</h3>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.6' }}>{tmp.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
