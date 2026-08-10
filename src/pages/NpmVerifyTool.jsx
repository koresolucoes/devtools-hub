import { useState } from 'react';
import FileUpload from '../components/FileUpload';
import VulnerabilityReport from '../components/VulnerabilityReport';
import { extractDependencies, scanDependencies } from '../services/scanner';
import { ShieldAlert } from 'lucide-react';
import '../index.css';

function NpmVerifyTool() {
  const [appState, setAppState] = useState('upload'); // 'upload', 'scanning', 'report', 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [totalScanned, setTotalScanned] = useState(0);

  const handleFileUpload = async (jsonContent, fileName) => {
    try {
      setAppState('scanning');
      
      const deps = extractDependencies(jsonContent);
      const depCount = Object.keys(deps).length;
      
      if (depCount === 0) {
        throw new Error('Não foram encontradas dependências válidas no arquivo.');
      }
      
      setTotalScanned(depCount);
      
      const results = await scanDependencies(deps);
      
      setVulnerabilities(results);
      setAppState('report');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Ocorreu um erro durante a verificação.');
      setAppState('error');
    }
  };

  const resetState = () => {
    setAppState('upload');
    setVulnerabilities([]);
    setTotalScanned(0);
    setErrorMsg('');
  };

  return (
    <div className="tool-container">
      <header className="header" style={{ marginTop: '2rem', textAlign: 'center' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          <ShieldAlert size={42} />
          NPM Verify
        </h1>
        <p>Verifique rapidamente se as dependências do seu projeto estão seguras contra vulnerabilidades.</p>
      </header>

      <main>
        {appState === 'upload' && (
          <FileUpload onFileUpload={handleFileUpload} />
        )}

        {appState === 'scanning' && (
          <div className="card loader-container">
            <div className="loader"></div>
            <h3>Analisando dependências...</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Consultando o banco de dados do Google OSV</p>
          </div>
        )}

        {appState === 'report' && (
          <VulnerabilityReport 
            vulnerabilities={vulnerabilities} 
            totalScanned={totalScanned} 
            onReset={resetState} 
          />
        )}

        {appState === 'error' && (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', marginTop: '2rem' }}>
            <h2 style={{ color: 'var(--danger)', marginBottom: '1rem' }}>Ops! Algo deu errado.</h2>
            <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>{errorMsg}</p>
            <button className="button" onClick={resetState}>Tentar Novamente</button>
          </div>
        )}
      </main>

      <footer style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        <p>Powered by <a href="https://osv.dev" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>OSV API</a>. Mantendo o ecossistema Open Source seguro.</p>
      </footer>
    </div>
  );
}

export default NpmVerifyTool;
