import { Link } from 'react-router-dom';
import { Flame } from 'lucide-react';
import { briefing } from '../data/contentModel';
import { useTranslation } from 'react-i18next';
import '../index.css';

export default function BriefingIndex() {
  const { t } = useTranslation();
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Flame size={32} /> {t('tech_feed.developer_intelligence', 'Developer Intelligence')}
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
          {t('briefing_index.subtitle', 'Past briefings and analysis on what developers are building, discussing and shipping.')}
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {briefing.map(b => (
          <Link to={`/briefing/${b.slug}`} key={b.slug} className="card p-6" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              {b.date}
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>{b.title}</h3>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.6' }}>{b.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
