import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plug, Flag, ShieldAlert, BrainCircuit, Baseline, GitBranch, Database, Server, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function CommandPalette({ isOpen, onClose, onSnippetSelect }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  
  const items = [
    { id: 'npm-verify', title: t('hub.tools.npm_verify.name', 'OSV Dependency Scanner'), type: 'Tool', path: '/npm-verify', icon: <ShieldAlert size={16} /> },
    { id: 'rag-sandbox', title: t('hub.tools.rag_sandbox.name', 'RAG Chunking Sandbox'), type: 'Tool', path: '/rag-sandbox', icon: <BrainCircuit size={16} /> },
    { id: 'token-estimator', title: t('hub.tools.token_estimator.name', 'Token Estimator & Pricing'), type: 'Tool', path: '/token-estimator', icon: <Baseline size={16} /> },
    { id: 'cicd-builder', title: t('hub.tools.cicd_builder.name', 'Pipeline Architect'), type: 'Tool', path: '/cicd-builder', icon: <Plug size={16} /> },
    { id: 'mcp-inspector', title: t('hub.tools.mcp_inspector.name', 'MCP Inspector'), type: 'Tool', path: '/mcp', icon: <Flag size={16} /> },
    
    // Snippets
    { id: 'node-multi-stage', title: 'Node 20 Multi-stage', type: 'Snippet', action: 'snippet', icon: <Server size={16} /> },
    { id: 'nginx-proxy', title: 'Nginx Reverse Proxy', type: 'Snippet', action: 'snippet', icon: <Server size={16} /> },
    { id: 'interactive-rebase', title: 'Interactive Rebase', type: 'Snippet', action: 'snippet', icon: <GitBranch size={16} /> },
    { id: 'recover-reflog', title: 'Recover from Reflog', type: 'Snippet', action: 'snippet', icon: <GitBranch size={16} /> },
    { id: 'mcp-python', title: 'Python MCP Server', type: 'Snippet', action: 'snippet', icon: <Database size={16} /> },
    { id: 'mcp-node', title: 'Node MCP Client', type: 'Snippet', action: 'snippet', icon: <Database size={16} /> }
  ];

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) || 
    item.type.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 10);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % (filteredItems.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + (filteredItems.length || 1)) % (filteredItems.length || 1));
      } else if (e.key === 'Enter' && filteredItems.length > 0) {
        e.preventDefault();
        handleSelect(filteredItems[selectedIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  const handleSelect = (item) => {
    if (item.type === 'Tool') {
      navigate(item.path);
    } else if (item.type === 'Snippet') {
      onSnippetSelect(item.id);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="command-palette-overlay" onClick={onClose}>
      <div className="command-palette-modal" onClick={e => e.stopPropagation()}>
        <div className="command-palette-input-wrap">
          <Search size={20} style={{ color: 'var(--text-secondary)' }} />
          <input 
            ref={inputRef}
            className="command-palette-input" 
            placeholder="Search tools, snippets or commands..." 
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
          />
          <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="command-palette-results">
          {filteredItems.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No results found for "{query}"
            </div>
          ) : (
            filteredItems.map((item, index) => (
              <div 
                key={item.id} 
                className={`command-palette-item ${index === selectedIndex ? 'selected' : ''}`}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="command-palette-item-icon">{item.icon}</div>
                <div className="command-palette-item-title">{item.title}</div>
                <div className="command-palette-item-type">{item.type}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
