import { useState, useRef } from 'react';
import { UploadCloud, FileJson, Link2, ArrowRight } from 'lucide-react';

export default function FileUpload({ onFileUpload }) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const [githubUrl, setGithubUrl] = useState('');
  const [isLoadingGithub, setIsLoadingGithub] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (file) => {
    setError(null);
    if (!file) return;
    
    // Accept JSON, YAML, TOML, TXT
    if (!file.name.match(/\.(json|yaml|yml|toml|txt)$/) && file.name !== 'Pipfile') {
      setError('Por favor, selecione um arquivo suportado (package.json, lockfiles, requirements.txt, etc).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      onFileUpload(e.target.result, file.name);
    };
    reader.onerror = () => {
      setError('Erro ao ler o arquivo.');
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleGithubFetch = async (e) => {
    e.preventDefault();
    if (!githubUrl) return;

    setError(null);
    setIsLoadingGithub(true);

    try {
      let owner, repo, branch = null;

      try {
        let cleanUrl = githubUrl.trim();
        if (!cleanUrl.startsWith('http')) cleanUrl = 'https://' + cleanUrl;
        
        const urlObj = new URL(cleanUrl);
        const parts = urlObj.pathname.split('/').filter(Boolean);
        
        if (parts.length >= 2) {
          owner = parts[0];
          repo = parts[1];
          // Se o link for direto para um blob (ex: /blob/main/package.json)
          if (parts[2] === 'blob' && parts[3]) {
            branch = parts[3];
          }
        } else {
          throw new Error('URL incompleta.');
        }
      } catch (e) {
        throw new Error('URL inválida. Use o formato https://github.com/usuario/repositorio');
      }

      let res;
      if (branch) {
        res = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/package.json`);
        if (!res.ok) throw new Error(`package.json não encontrado na branch '${branch}'.`);
      } else {
        // Tenta main primeiro, depois master
        res = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/main/package.json`);
        if (!res.ok) {
          res = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/master/package.json`);
        }
      }

      if (!res.ok) {
        throw new Error('Não foi possível encontrar o package.json na branch main ou master deste repositório.');
      }

      const textContent = await res.text();
      onFileUpload(textContent, 'package.json');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Erro ao buscar dados do GitHub.');
    } finally {
      setIsLoadingGithub(false);
    }
  };

  return (
    <div className="card" style={{ padding: '2rem', marginTop: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Verifique suas dependências</h2>
      
      <div 
        className={`upload-area ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current.click()}
        style={{ marginBottom: '2rem' }}
      >
        <UploadCloud size={48} className="upload-icon" />
        <p className="upload-text">Arraste e solte o package.json aqui</p>
        <p className="upload-subtext">Ou clique para selecionar do seu computador</p>
        
        <input 
          ref={inputRef}
          type="file"
          accept=".json"
          onChange={handleChange}
          style={{ display: 'none' }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', margin: '2rem 0' }}>
        <div style={{ flex: 1, height: '1px', background: 'var(--surface-border)' }}></div>
        <span style={{ padding: '0 1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>OU</span>
        <div style={{ flex: 1, height: '1px', background: 'var(--surface-border)' }}></div>
      </div>

      <form onSubmit={handleGithubFetch} style={{ display: 'flex', gap: '0.5rem', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Link2 size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="url" 
            className="text-input" 
            placeholder="https://github.com/facebook/react" 
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            style={{ paddingLeft: '3rem' }}
            disabled={isLoadingGithub}
            required
          />
        </div>
        <button type="submit" className="button primary" disabled={isLoadingGithub || !githubUrl}>
          {isLoadingGithub ? 'Buscando...' : 'Escanear'} <ArrowRight size={16} />
        </button>
      </form>

      {error && (
        <div style={{ color: 'var(--danger)', marginTop: '1.5rem', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '8px' }}>
          {error}
        </div>
      )}
    </div>
  );
}
