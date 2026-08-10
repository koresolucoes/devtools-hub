import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowRight, Plug, BrainCircuit, Baseline, Flag } from 'lucide-react';
import { motion } from 'framer-motion';
import AdBanner from '../components/AdBanner';
import '../index.css';

function Hub() {
  const tools = [
    {
      id: 'npm-verify',
      name: 'NPM Verify',
      description: 'Análise de vulnerabilidades na supply chain do ecossistema Node.js (OSV API).',
      icon: <ShieldAlert size={32} />,
      path: '/npm-verify',
      status: 'active'
    },
    {
      id: 'mcp-inspector',
      name: 'MCP Inspector',
      description: 'Conecte, debuge e teste as tools e resources do seu Model Context Protocol server localmente.',
      icon: <Plug size={32} />,
      path: '#',
      status: 'coming-soon'
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
      name: 'Token Estimator',
      description: 'Valide o tamanho de System Prompts gigantes e conte os tokens em diferentes modelos na hora.',
      icon: <Baseline size={32} />,
      path: '/token-estimator',
      status: 'active'
    },
    {
      id: 'cicd-builder',
      name: 'CI/CD Pipeline Builder',
      description: 'Gere configurações completas de pipeline YAML para GitHub Actions ou GitLab CI prontas para produção.',
      icon: <Flag size={32} />,
      path: '/cicd-builder',
      status: 'active'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.2 } }
  };

  return (
    <div className="hub-container">
      <AdBanner />
      
      <motion.header 
        className="hub-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1>O Hub do Dev Moderno</h1>
        <p>Acelere seu fluxo de trabalho com ferramentas focadas em <b>IA, MCP, RAG</b> e Segurança.</p>
      </motion.header>

      <motion.div 
        className="tools-grid"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {tools.map(tool => (
          <motion.div 
            key={tool.id} 
            variants={itemVariants}
            className={`tool-card card ${tool.status}`}
          >
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
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default Hub;
