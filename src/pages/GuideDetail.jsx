import { useParams, Link } from 'react-router-dom';
import { guides, tools } from '../data/contentModel';
import { ArrowRight, BookOpen } from 'lucide-react';
import '../index.css';

function GuideDetail() {
  const { slug } = useParams();
  const guideData = guides.find(g => g.slug === slug);

  if (!guideData) {
    return <div style={{ padding: '4rem', textAlign: 'center' }}>Guide not found.</div>;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": guideData.title,
    "description": guideData.summary,
    "articleSection": guideData.category
  };

  return (
    <div className="tool-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
      <title>{guideData.title} — DevsHub Guides</title>
      <meta name="description" content={guideData.summary} />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>

      <header className="header" style={{ marginBottom: '3rem', marginTop: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <BookOpen size={16} />
          {guideData.category}
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          {guideData.title}
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>{guideData.summary}</p>
      </header>

      <main style={{ marginBottom: '4rem' }}>
        <article className="tool-semantic-content" style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
          <p>{guideData.content}</p>
          <p><i>(More content can be loaded via MDX or API in the future)</i></p>
        </article>
      </main>

      {guideData.relatedTools && guideData.relatedTools.length > 0 && (
        <section style={{ borderTop: '1px solid var(--surface-border)', paddingTop: '3rem', marginBottom: '4rem' }}>
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', fontSize: '1.25rem' }}>Related Tools</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {guideData.relatedTools.map(tSlug => {
              const rt = tools.find(t => t.slug === tSlug);
              if (!rt) return null;
              return (
                <Link key={tSlug} to={`/tools/${tSlug}`} className="card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 1.5rem' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{rt.name}</span>
                  <ArrowRight size={16} />
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

export default GuideDetail;
