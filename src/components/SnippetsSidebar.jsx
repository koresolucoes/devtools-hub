import { Terminal, Database, Server, GitBranch } from 'lucide-react';

export default function SnippetsSidebar() {
  const snippets = [
    {
      category: 'Docker & Infra',
      icon: <Server size={14} />,
      items: [
        { title: 'Node 20 Multi-stage', link: '#' },
        { title: 'Nginx Reverse Proxy', link: '#' },
        { title: 'PostgreSQL init.sql', link: '#' }
      ]
    },
    {
      category: 'Git Hardcore',
      icon: <GitBranch size={14} />,
      items: [
        { title: 'Interactive Rebase', link: '#' },
        { title: 'Recover from Reflog', link: '#' },
        { title: 'Squash Commits', link: '#' }
      ]
    },
    {
      category: 'AI & MCP Configs',
      icon: <Database size={14} />,
      items: [
        { title: 'Python MCP Server', link: '#' },
        { title: 'Node MCP Client', link: '#' },
        { title: 'FAISS Vector Store', link: '#' }
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
                <a key={iIdx} href={item.link} className="snippet-link">
                  {group.icon}
                  {item.title}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
