import { Link } from 'react-router-dom';
import { Flame } from 'lucide-react';
import { briefing } from '../data/contentModel';
import { useTranslation } from 'react-i18next';
import { getLocalizedField } from '../utils/i18nHelper';
import '../index.css';

export default function BriefingIndex() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.split('-')[0];
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
          <Link to={`/briefing/${b.slug}`} key={b.slug} className="card" style={{ padding: '1.5rem', borderRadius: '8px', textDecoration: 'none', color: 'inherit' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              {getLocalizedField(b, 'date', lang)}
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>{getLocalizedField(b, 'title', lang)}</h3>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.6' }}>{getLocalizedField(b, 'summary', lang)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
