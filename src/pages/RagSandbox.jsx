import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { BrainCircuit, Settings, FileText, SplitSquareVertical, ArrowRight } from 'lucide-react';
import { splitText } from '../services/textSplitter';
import { Link } from 'react-router-dom';
import { tools } from '../data/contentModel';
import '../index.css';

const DEFAULT_TEXT = `RAG (Retrieval-Augmented Generation) is an AI technique that connects Large Language Models (LLMs) to external databases.
To work correctly, very long documents need to be split into smaller blocks called "chunks". The Chunk Size defines the maximum length of characters (or tokens) for each block.
The Chunk Overlap defines how many characters from the end of the previous block will be repeated at the beginning of the next block. This ensures that context between blocks is not lost if an important sentence is cut in the middle.
In this visual tool, you can test different configurations and see exactly how your data would be processed before sending it to a vector database.`;

function RagSandbox() {
  const { t } = useTranslation('rag_sandbox');
  const toolData = tools.find(t => t.slug === 'rag-chunking-sandbox');
  const [text, setText] = useState(DEFAULT_TEXT);
  const [chunkSize, setChunkSize] = useState(250);
  const [chunkOverlap, setChunkOverlap] = useState(50);
  const [separator, setSeparator] = useState(' ');
  const [chunks, setChunks] = useState([]);

  useEffect(() => {
    // Generate chunks whenever text or settings change
    const actualSeparator = separator === '\\n' ? '\n' : separator;
    const newChunks = splitText(text, Number(chunkSize), Number(chunkOverlap), actualSeparator);
    setChunks(newChunks);
  }, [text, chunkSize, chunkOverlap, separator]);

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
    <div className="rag-container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1rem' }}>
      <title>{toolData.seoTitle}</title>
      <meta name="description" content={toolData.seoDescription} />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>

      <header className="header" style={{ marginBottom: '3rem', marginTop: '2rem', textAlign: 'center' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontSize: '2.5rem' }}>
          <BrainCircuit size={42} />
          {toolData.name}
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>{toolData.shortDescription}</p>
      </header>

      <section className="tool-interface" style={{ marginBottom: '4rem' }}>
        <div className="rag-layout">
          {/* Left Panel: Input & Settings */}
          <div className="rag-sidebar">
            <div className="card p-4 mb-4">
              <h3 className="section-title"><Settings size={20}/> {t('settings')}</h3>
              
              <div className="form-group">
                <label>{t('chunk_size')}</label>
                <input 
                  type="range" 
                  min="50" max="1000" step="10" 
                  value={chunkSize} 
                  onChange={(e) => setChunkSize(e.target.value)} 
                  className="slider"
                />
                <span className="slider-value">{chunkSize}</span>
              </div>

              <div className="form-group">
                <label>{t('chunk_overlap')}</label>
                <input 
                  type="range" 
                  min="0" max={Math.max(1, chunkSize - 1)} step="5" 
                  value={chunkOverlap} 
                  onChange={(e) => setChunkOverlap(e.target.value)} 
                  className="slider"
                />
                <span className="slider-value">{chunkOverlap}</span>
              </div>

              <div className="form-group">
                <label>{t('separator')}</label>
                <select value={separator} onChange={(e) => setSeparator(e.target.value)} className="select-input">
                  <option value=" ">{t('space')}</option>
                  <option value="\\n">{t('newline')}</option>
                  <option value=". ">{t('period')}</option>
                  <option value="">{t('none')}</option>
                </select>
              </div>
            </div>

            <div className="card p-4 input-panel">
              <h3 className="section-title"><FileText size={20}/> {t('original_text')}</h3>
              <textarea 
                className="text-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your long text here..."
              />
              <div className="stats-bar">
                <span>{text.length} {t('characters')}</span>
              </div>
            </div>
          </div>

          {/* Right Panel: Output Visualizer */}
          <div className="rag-content card">
            <div className="content-header">
              <h3 className="section-title mb-0"><SplitSquareVertical size={20}/> {t('chunk_visualizer')}</h3>
              <div className="badge success">{chunks.length} {t('chunks')}</div>
            </div>
            <div className="chunks-container">
              {chunks.length === 0 ? (
                <p className="text-secondary text-center mt-4">{t('type_some_text')}</p>
              ) : (
                chunks.map((chunk, idx) => (
                  <motion.div 
                    key={chunk.id} 
                    className="chunk-card"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <div className="chunk-header">
                      <span className="chunk-id">Chunk #{idx + 1}</span>
                      <span className="chunk-size">{chunk.text.length} chars</span>
                    </div>
                    <div className="chunk-body">
                      {chunk.isOverlapStart && (
                        <span className="overlap start" title="Overlap from previous chunk">
                          {chunk.overlapStartText}
                        </span>
                      )}
                      <span className="main-text">{chunk.mainText}</span>
                      {chunk.isOverlapEnd && (
                        <span className="overlap end" title="Overlap going to next chunk">
                          {chunk.overlapEndText}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
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

export default RagSandbox;
