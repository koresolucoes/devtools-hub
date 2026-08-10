import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowRight, Plug, BrainCircuit, Baseline, Flag } from 'lucide-react';
import { motion } from 'framer-motion';
import AdBanner from '../components/AdBanner';
import SnippetsSidebar from '../components/SnippetsSidebar';
import TechFeed from '../components/TechFeed';
import '../index.css';

function Hub() {
  const tools = [
    {
      id: 'npm-verify',
      name: 'OSV Dependency Scanner',
      description: 'Análise de vulnerabilidades na supply chain do ecossistema Node.js (OSV API).',
      icon: <ShieldAlert size={32} />,
      path: '/npm-verify',
      status: 'active'
    },
    {
      id: 'rag-sandbox',
      name: 'RAG Chunking Sandbox',
      description: 'Cole seus textos e visualize como as estratégias de chunking quebram seus documentos para Bancos Vetoriais.',
      icon: <BrainCircuit size={32} />,
      path: '/rag-sandbox',
      status: 'active'
    },
    {
      id: 'token-estimator',
      name: 'Token Estimator & Pricing',
      description: 'Valide o tamanho de System Prompts gigantes e conte os tokens em diferentes modelos na hora.',
      icon: <Baseline size={32} />,
      path: '/token-estimator',
      status: 'active'
    },
    {
      id: 'cicd-builder',
      name: 'Pipeline Configurator',
      description: 'Gere configurações completas de pipeline YAML para GitHub Actions ou GitLab CI prontas para produção.',
      icon: <Flag size={32} />,
      path: '/cicd-builder',
      status: 'active'
    },
    {
      id: 'mcp-inspector',
      name: 'MCP Inspector',
      description: 'Conecte, debuge e teste as tools e resources do seu Model Context Protocol server localmente.',
      icon: <Plug size={32} />,
      path: '#',
      status: 'coming-soon'
    }
  ];

  return (
    <div className="hub-container" style={{ maxWidth: '100%', padding: '0' }}>
      <AdBanner />
      
      <header className="hub-header" style={{ marginBottom: '3rem', textAlign: 'left', padding: '0 2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Core Utilities & Architecture Sandbox</h1>
        <p style={{ margin: '0', maxWidth: '800px', fontSize: '1rem' }}>
          Zero-BS utilities, live data feeds, and technical references for modern software engineering.
        </p>
      </header>

      <div className="dashboard-layout">
        
        {/* Left Column: Snippets */}
        <SnippetsSidebar />

        {/* Center Column: Core Tools */}
        <div className="tools-grid">
          {tools.map(tool => (
            <div key={tool.id} className={`tool-card card ${tool.status}`}>
              <div className="tool-card-icon">
                {tool.icon}
              </div>
              <div className="tool-card-content">
                <h3>{tool.name}</h3>
                <p>{tool.description}</p>
              </div>
              {tool.status === 'active' ? (
                <Link to={tool.path} className="tool-card-action button outline">
                  Iniciar Ferramenta <ArrowRight size={16} />
                </Link>
              ) : (
                <button className="tool-card-action button" disabled>
                  Em Breve
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Right Column: HackerNews Feed */}
        <TechFeed />

      </div>
    </div>
  );
}

export default Hub;
