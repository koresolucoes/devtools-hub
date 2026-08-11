import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plug, Flag, ShieldAlert, BrainCircuit, Baseline, BookOpen, Box, GitBranch, Database, Server, X, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { tools, guides, templates } from '../data/contentModel';

export default function CommandPalette({ isOpen, onClose, onSnippetSelect }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  
  const getIcon = (slug) => {
    switch(slug) {
      case 'project-doctor': return <Activity size={16} />;
      case 'osv-dependency-scanner': return <ShieldAlert size={16} />;
      case 'rag-chunking-sandbox': return <BrainCircuit size={16} />;
      case 'token-estimator': return <Baseline size={16} />;
      case 'pipeline-architect': return <Plug size={16} />;
      default: return <Flag size={16} />;
    }
  };

  const items = [
    ...tools.map(t => ({ id: t.slug, title: t.name, type: 'Tool', path: `/tools/${t.slug}`, icon: getIcon(t.slug) })),
    ...guides.map(g => ({ id: g.slug, title: g.title, type: 'Guide', path: `/guides/${g.slug}`, icon: <BookOpen size={16} /> })),
    ...templates.map(tmp => ({ id: tmp.slug, title: tmp.title, type: 'Template', path: `/templates/${tmp.slug}`, icon: <Box size={16} /> })),
    
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
    if (['Tool', 'Guide', 'Template'].includes(item.type)) {
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
            placeholder={t('command_palette.search_placeholder', 'Search tools, snippets or commands...')} 
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
