import { useState, useEffect } from 'react';
import { Baseline, Cpu, Calculator, DollarSign, ArrowRight } from 'lucide-react';
import { encode } from 'gpt-tokenizer';
import { Link } from 'react-router-dom';
import { tools } from '../data/contentModel';
import { MODEL_REGISTRY } from '../core/registries/models';
import '../index.css';

function TokenEstimator() {
  const toolData = tools.find(t => t.slug === 'token-estimator');
  const [prompt, setPrompt] = useState('');
  const [tokenCount, setTokenCount] = useState(0); // Exact OpenAI
  const [estimatedTokens, setEstimatedTokens] = useState(0); // Char / 4
  const [charCount, setCharCount] = useState(0);

  const [selectedModel, setSelectedModel] = useState('gpt4o');
  const activeModel = MODEL_REGISTRY[selectedModel];
  const PRICE_PER_1M_TOKENS = activeModel.inputPricePerMillion;

  useEffect(() => {
    setCharCount(prompt.length);
    setEstimatedTokens(Math.ceil(prompt.length / 4));
    // Encode the text into tokens using OpenAI tokenizer
    const tokens = encode(prompt);
    setTokenCount(tokens.length);
  }, [prompt]);

  const displayTokenCount = activeModel.provider === 'OpenAI' ? tokenCount : estimatedTokens;
  const estimatedCost = ((displayTokenCount / 1000000) * PRICE_PER_1M_TOKENS).toFixed(5);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": toolData.name,
    "applicationCategory": "DeveloperApplication",
    "description": toolData.seoDescription,
    "offers": {
      "@type": "Offer",
      "price": "0"
    }
  };

  return (
    <div className="tool-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1rem' }}>
      <title>{toolData.seoTitle}</title>
      <meta name="description" content={toolData.seoDescription} />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>

      <header className="header" style={{ marginBottom: '3rem', marginTop: '2rem', textAlign: 'center' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontSize: '2.5rem' }}>
          <Baseline size={42} />
          {toolData.name}
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>{toolData.shortDescription}</p>
      </header>

      <section className="tool-interface" style={{ marginBottom: '4rem' }}>
        <div className="card p-4 mb-4" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="stat-box">
            <Cpu size={24} />
            <div>
              <h4>{activeModel.provider === 'OpenAI' ? 'Exact Tokens' : 'Estimated Tokens (~4 chars)'}</h4>
              <span className="stat-value">{displayTokenCount.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="stat-box">
            <Calculator size={24} />
            <div>
              <h4>Characters</h4>
              <span className="stat-value">{charCount.toLocaleString()}</span>
            </div>
          </div>

          <div className="stat-box">
            <DollarSign size={24} />
            <div>
              <h4>Estimated Cost ({activeModel.name} Input)</h4>
              <span className="stat-value">${estimatedCost}</span>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <h3 className="section-title mb-4">Your Prompt Context</h3>
          <textarea 
            className="text-input" 
            style={{ height: '400px' }}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Paste your System Prompt, RAG chunks, or large context here to analyze..."
          />
          <div className="stats-bar mt-2" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>
              Tokenizer: {activeModel.tokenizer} | Pricing:{' '}
              {activeModel.status === 'verified' ? `verified on ${activeModel.verifiedAt}` : 'unverified assumption'}
            </span>
            <select className="text-input" value={selectedModel} onChange={e => setSelectedModel(e.target.value)} style={{ padding: '0.4rem', width: '200px' }}>
              {Object.entries(MODEL_REGISTRY).map(([k, m]) => <option key={k} value={k}>{m.name}</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* AEO & SEO Semantic Content */}
      <article className="tool-semantic-content" style={{ borderTop: '1px solid var(--surface-border)', paddingTop: '3rem', color: 'var(--text-secondary)' }}>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>What is {toolData.name}?</h2>
        <p style={{ marginBottom: '2rem', lineHeight: '1.6' }}>{toolData.longDescription}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Supported Ecosystems</h3>
            <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.6' }}>
              {toolData.supportedStacks.map(stack => <li key={stack}>{stack}</li>)}
            </ul>
          </div>
          
          <div>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Key Features</h3>
            <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.6' }}>
              {toolData.features.map(feat => <li key={feat}>{feat}</li>)}
            </ul>
          </div>
        </div>

        {toolData.faqs && toolData.faqs.length > 0 && (
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Frequently Asked Questions</h2>
            {toolData.faqs.map((faq, idx) => (
              <div key={idx} style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{faq.q}</h4>
                <p>{faq.a}</p>
              </div>
            ))}
          </section>
        )}

        {toolData.relatedTools && toolData.relatedTools.length > 0 && (
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Related Tools</h2>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {toolData.relatedTools.map(slug => {
                const rt = tools.find(t => t.slug === slug);
                if (!rt) return null;
                return (
                  <Link key={slug} to={`/tools/${slug}`} className="card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 1.5rem' }}>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{rt.name}</span>
                    <ArrowRight size={16} />
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}

export default TokenEstimator;
