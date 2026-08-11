import { useParams } from 'react-router-dom';
import { briefing } from '../data/contentModel';
import { Calendar } from 'lucide-react';
import '../index.css';

function BriefingDetail() {
  const { slug } = useParams();
  const briefingData = briefing.find(b => b.slug === slug);

  if (!briefingData) {
    return <div style={{ padding: '4rem', textAlign: 'center' }}>Briefing not found.</div>;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": briefingData.title,
    "description": briefingData.summary,
    "datePublished": briefingData.date
  };

  return (
    <div className="tool-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
      <title>{briefingData.title}</title>
      <meta name="description" content={briefingData.summary} />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>

      <header className="header" style={{ marginBottom: '3rem', marginTop: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Calendar size={16} />
          {briefingData.date}
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          {briefingData.title}
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>{briefingData.summary}</p>
      </header>

      <main style={{ marginBottom: '4rem' }}>
        <article className="tool-semantic-content" style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
          {briefingData.items.map((item, idx) => (
            <div key={idx} style={{ marginBottom: '3rem', paddingBottom: '3rem', borderBottom: '1px solid var(--surface-border)' }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <span className="badge">{item.source}</span>
                <span className="badge">{item.category}</span>
              </div>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>{item.title}</h2>
              <p style={{ marginBottom: '1.5rem' }}>{item.description}</p>
              
              <div style={{ background: 'var(--surface-bg)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--surface-border)' }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Why it matters</h3>
                <p style={{ margin: 0 }}>{item.whyItMatters}</p>
              </div>
              
              <div style={{ marginTop: '1.5rem' }}>
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="button outline">
                  Source Repository ↗
                </a>
              </div>
            </div>
          ))}
        </article>
      </main>
    </div>
  );
}

export default BriefingDetail;
