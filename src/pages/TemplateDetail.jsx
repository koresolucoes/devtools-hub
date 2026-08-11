import { useParams, Link } from 'react-router-dom';
import { templates, tools } from '../data/contentModel';
import { ArrowRight, Box } from 'lucide-react';
import '../index.css';

function TemplateDetail() {
  const { slug } = useParams();
  const templateData = templates.find(t => t.slug === slug);

  if (!templateData) {
    return <div style={{ padding: '4rem', textAlign: 'center' }}>Template not found.</div>;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": templateData.title,
    "description": templateData.summary,
    "articleSection": templateData.category
  };

  return (
    <div className="tool-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
      <title>{templateData.title} — DevsHub Templates</title>
      <meta name="description" content={templateData.summary} />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>

      <header className="header" style={{ marginBottom: '3rem', marginTop: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Box size={16} />
          {templateData.category}
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          {templateData.title}
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>{templateData.summary}</p>
        
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          {templateData.stack.map(s => (
            <span key={s} className="tool-tag">{s}</span>
          ))}
        </div>
      </header>

      <main style={{ marginBottom: '4rem' }}>
        <article className="tool-semantic-content" style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
          <p>This template is available directly in the Pipeline Architect.</p>
          <div style={{ marginTop: '2rem' }}>
            <Link to="/tools/pipeline-architect" className="button primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              Open in Pipeline Architect <ArrowRight size={16} />
            </Link>
          </div>
        </article>
      </main>

      {templateData.relatedTools && templateData.relatedTools.length > 0 && (
        <section style={{ borderTop: '1px solid var(--surface-border)', paddingTop: '3rem', marginBottom: '4rem' }}>
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', fontSize: '1.25rem' }}>Related Tools</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {templateData.relatedTools.map(tSlug => {
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

export default TemplateDetail;
