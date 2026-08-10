import { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { snippetsData } from '../data/snippets';
import '../index.css'; // Garantir que estilos globais apliquem

export default function SnippetModal({ snippetId, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!snippetId || !snippetsData[snippetId]) return null;

  const snippet = snippetsData[snippetId];

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content card" onClick={e => e.stopPropagation()}>
        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ 
              textTransform: 'uppercase', 
              fontSize: '0.65rem', 
              padding: '0.2rem 0.5rem', 
              background: 'var(--surface-bg)', 
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--surface-border)' 
            }}>
              {snippet.language}
            </span>
            {snippet.title}
          </h3>
          <button className="button" style={{ padding: '0.5rem' }} onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="code-container" style={{ position: 'relative' }}>
          <button 
            className="button outline" 
            style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', padding: '0.4rem', background: 'var(--bg-color)' }}
            onClick={handleCopy}
            title="Copiar código"
          >
            {copied ? <Check size={14} style={{ color: 'var(--accent-color)' }} /> : <Copy size={14} />}
          </button>
          
          <pre style={{ 
            background: 'var(--bg-color)', 
            padding: '1.5rem', 
            borderRadius: 'var(--radius-md)', 
            border: '1px solid var(--surface-border)',
            overflowX: 'auto',
            fontSize: '0.875rem',
            fontFamily: 'monospace',
            lineHeight: '1.5',
            color: 'var(--text-primary)'
          }}>
            <code>{snippet.code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
