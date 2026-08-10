import { useState, useEffect } from 'react';
import { Baseline, Cpu, Calculator, DollarSign } from 'lucide-react';
import { encode } from 'gpt-tokenizer';
import '../index.css';

function TokenEstimator() {
  const [prompt, setPrompt] = useState('');
  const [tokenCount, setTokenCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  // GPT-4o Pricing (approximate, e.g. $5.00 per 1M input tokens)
  const PRICE_PER_1M_TOKENS = 5.00; 

  useEffect(() => {
    setCharCount(prompt.length);
    // Encode the text into tokens
    const tokens = encode(prompt);
    setTokenCount(tokens.length);
  }, [prompt]);

  const estimatedCost = ((tokenCount / 1000000) * PRICE_PER_1M_TOKENS).toFixed(5);

  return (
    <div className="tool-container">
      <header className="header" style={{ marginBottom: '2rem', marginTop: '1rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          <Baseline size={42} />
          Token Estimator
        </h1>
        <p>Valide o tamanho de System Prompts e calcule os custos da API na hora.</p>
      </header>

      <div className="card p-4 mb-4" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div className="stat-box">
          <Cpu size={24} />
          <div>
            <h4>Tokens Totais</h4>
            <span className="stat-value">{tokenCount.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="stat-box">
          <Calculator size={24} />
          <div>
            <h4>Caracteres</h4>
            <span className="stat-value">{charCount.toLocaleString()}</span>
          </div>
        </div>

        <div className="stat-box">
          <DollarSign size={24} />
          <div>
            <h4>Custo Estimado (GPT-4o Input)</h4>
            <span className="stat-value">${estimatedCost}</span>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="section-title mb-4">Seu Prompt (Contexto)</h3>
        <textarea 
          className="text-input" 
          style={{ height: '400px' }}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Cole seu System Prompt, texto de RAG, ou contexto gigante aqui para analisar..."
        />
        <div className="stats-bar mt-2">
          <span>O modelo padrão utilizado na contagem é o tokenizer da família GPT-3.5/GPT-4 (cl100k_base).</span>
        </div>
      </div>
    </div>
  );
}

export default TokenEstimator;
