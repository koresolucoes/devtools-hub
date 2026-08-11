import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { UploadCloud, FileJson, Link2, ArrowRight } from 'lucide-react';

export default function FileUpload({ onFileUpload }) {
  const { t } = useTranslation();
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
    
    // Accept package.json, requirements.txt
    if (file.name !== 'package.json' && file.name !== 'requirements.txt') {
      setError(t('error_unsupported_file'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      onFileUpload(e.target.result, file.name);
    };
    reader.onerror = () => {
      setError(t('error_reading_file'));
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
          throw new Error(t('error_incomplete_url'));
        }
      } catch (e) {
        throw new Error(t('error_invalid_url'));
      }

      let res;
      if (branch) {
        res = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/package.json`);
        if (!res.ok) throw new Error(t('error_package_json_not_found_branch', { branch }));
      } else {
        // Tenta main primeiro, depois master
        res = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/main/package.json`);
        if (!res.ok) {
          res = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/master/package.json`);
        }
      }

      if (!res.ok) {
        throw new Error(t('error_package_json_not_found'));
      }

      const textContent = await res.text();
      onFileUpload(textContent, 'package.json');
    } catch (err) {
      console.error(err);
      setError(err.message || t('error_github_fetch'));
    } finally {
      setIsLoadingGithub(false);
    }
  };

  return (
    <div className="card" style={{ padding: '2rem', marginTop: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>{t('verify_dependencies')}</h2>
      
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
        <p className="upload-text">{t('drag_drop')}</p>
        <p className="upload-subtext">{t('click_to_select')}</p>
        
        <input 
          ref={inputRef}
          type="file"
          accept=".json,.txt"
          onChange={handleChange}
          style={{ display: 'none' }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', margin: '2rem 0' }}>
        <div style={{ flex: 1, height: '1px', background: 'var(--surface-border)' }}></div>
        <span style={{ padding: '0 1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{t('or')}</span>
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
