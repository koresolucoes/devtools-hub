import { Terminal, Database, Server, GitBranch } from 'lucide-react';

export default function SnippetsSidebar({ onSnippetClick }) {
  const snippets = [
    {
      category: 'Docker & Infra',
      icon: <Server size={14} />,
      items: [
        { title: 'Node 20 Multi-stage', id: 'node-multi-stage' },
        { title: 'Nginx Reverse Proxy', id: 'nginx-proxy' }
      ]
    },
    {
      category: 'Git Hardcore',
      icon: <GitBranch size={14} />,
      items: [
        { title: 'Interactive Rebase', id: 'interactive-rebase' },
        { title: 'Recover from Reflog', id: 'recover-reflog' }
      ]
    },
    {
      category: 'AI & MCP Configs',
      icon: <Database size={14} />,
      items: [
        { title: 'Python MCP Server', id: 'mcp-python' },
        { title: 'Node MCP Client', id: 'mcp-node' }
      ]
    }
  ];

  return (
    <aside className="snippets-sidebar">
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <Terminal size={18} /> Quick Snippets
        </h3>
        
        {snippets.map((group, idx) => (
          <div key={idx} className="snippet-group">
            <h4>{group.category}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {group.items.map((item, iIdx) => (
                <button 
                  key={iIdx} 
                  className="snippet-link"
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}
                  onClick={() => onSnippetClick(item.id)}
                >
                  {group.icon}
                  {item.title}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
