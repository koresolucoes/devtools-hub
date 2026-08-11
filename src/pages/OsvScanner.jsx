import { useState } from 'react';
import FileUpload from '../components/FileUpload';
import VulnerabilityReport from '../components/VulnerabilityReport';
import { scanDependencies } from '../core/security/osvClient';
import { packageJsonParser } from '../core/dependencies/packageJson';
import { packageLockParser } from '../core/dependencies/packageLock';
import { requirementsTxtParser } from '../core/dependencies/requirementsTxt';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { tools } from '../data/contentModel';
import '../index.css';

function OsvScanner() {
  const [appState, setAppState] = useState('upload'); // 'upload', 'scanning', 'report', 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [totalScanned, setTotalScanned] = useState(0);

  const toolData = tools.find(t => t.slug === 'osv-dependency-scanner');

  const handleFileUpload = async (jsonContent, fileName) => {
    try {
      setAppState('scanning');
      
      const extractDependencies = (content, fileName) => {
        if (fileName.endsWith('package.json')) return packageJsonParser.parse(content);
        if (fileName.endsWith('package-lock.json')) return packageLockParser.parse(content);
        if (fileName.endsWith('requirements.txt')) return requirementsTxtParser.parse(content);
        return [];
      };

      const deps = extractDependencies(jsonContent, fileName);
      const depCount = deps.length;
      
      if (depCount === 0) {
        throw new Error('No valid dependencies found in the file.');
      }
      
      setTotalScanned(depCount);
      
      const results = await scanDependencies(deps);
      
      setVulnerabilities(results);
      setAppState('report');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'An error occurred during verification.');
      setAppState('error');
    }
  };

  const resetState = () => {
    setAppState('upload');
    setVulnerabilities([]);
    setTotalScanned(0);
    setErrorMsg('');
  };

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

      <header className="header" style={{ marginTop: '2rem', textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontSize: '2.5rem' }}>
          <ShieldAlert size={42} />
          {toolData.name}
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>{toolData.shortDescription}</p>
      </header>

      <main>
        <section className="tool-interface" style={{ marginBottom: '4rem' }}>
          {appState === 'upload' && (
            <FileUpload onFileUpload={handleFileUpload} />
          )}

          {appState === 'scanning' && (
            <div className="card loader-container">
              <div className="loader"></div>
              <h3>Analyzing dependencies...</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Querying the Google OSV database</p>
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
              <h2 style={{ color: 'var(--danger)', marginBottom: '1rem' }}>Oops! Something went wrong.</h2>
              <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>{errorMsg}</p>
              <button className="button" onClick={resetState}>Try Again</button>
            </div>
          )}
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
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Accepted Inputs</h3>
              <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.6' }}>
                <li>package.json</li>
                <li>package-lock.json</li>
                <li>pnpm-lock.yaml</li>
                <li>requirements.txt</li>
                <li>pyproject.toml</li>
              </ul>
            </div>
          </div>

          <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Output</h3>
          <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.6', marginBottom: '3rem' }}>
            <li>Vulnerability ID</li>
            <li>Affected package</li>
            <li>Installed version</li>
            <li>Severity</li>
            <li>Recommended action</li>
          </ul>

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
      </main>
    </div>
  );
}

export default OsvScanner;
