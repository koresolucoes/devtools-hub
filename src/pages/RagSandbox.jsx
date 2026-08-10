import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Settings, FileText, SplitSquareVertical } from 'lucide-react';
import { splitText } from '../services/textSplitter';
import '../index.css';

const DEFAULT_TEXT = `O RAG (Retrieval-Augmented Generation) é uma técnica de Inteligência Artificial que conecta grandes modelos de linguagem (LLMs) a bases de dados externas.
Para funcionar corretamente, documentos muito longos precisam ser divididos em pequenos blocos chamados "chunks". O Chunk Size define o tamanho máximo de caracteres (ou tokens) de cada bloco.
Já o Chunk Overlap define a sobreposição, ou seja, quantos caracteres do final do bloco anterior serão repetidos no início do próximo bloco. Isso garante que o contexto entre os blocos não seja perdido caso uma frase importante seja cortada no meio.
Nesta ferramenta visual, você pode testar diferentes configurações e ver exatamente como os seus dados seriam processados antes de enviar para um banco vetorial.`;

function RagSandbox() {
  const [text, setText] = useState(DEFAULT_TEXT);
  const [chunkSize, setChunkSize] = useState(250);
  const [chunkOverlap, setChunkOverlap] = useState(50);
  const [separator, setSeparator] = useState(' ');
  const [chunks, setChunks] = useState([]);

  useEffect(() => {
    // Generate chunks whenever text or settings change
    const actualSeparator = separator === '\\n' ? '\n' : separator;
    const newChunks = splitText(text, Number(chunkSize), Number(chunkOverlap), actualSeparator);
    setChunks(newChunks);
  }, [text, chunkSize, chunkOverlap, separator]);

  return (
    <div className="rag-container">
      <header className="header" style={{ marginBottom: '2rem', marginTop: '1rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          <BrainCircuit size={42} />
          RAG Chunking Sandbox
        </h1>
        <p>Visualize como seus documentos são particionados para Bancos Vetoriais e IA.</p>
      </header>

      <div className="rag-layout">
        {/* Painel Esquerdo: Input & Settings */}
        <div className="rag-sidebar">
          <div className="card p-4 mb-4">
            <h3 className="section-title"><Settings size={20}/> Configurações</h3>
            
            <div className="form-group">
              <label>Chunk Size (Caracteres)</label>
              <input 
                type="range" 
                min="50" max="1000" step="10" 
                value={chunkSize} 
                onChange={(e) => setChunkSize(e.target.value)} 
                className="slider"
              />
              <span className="slider-value">{chunkSize}</span>
            </div>

            <div className="form-group">
              <label>Chunk Overlap (Caracteres)</label>
              <input 
                type="range" 
                min="0" max={Math.max(1, chunkSize - 1)} step="5" 
                value={chunkOverlap} 
                onChange={(e) => setChunkOverlap(e.target.value)} 
                className="slider"
              />
              <span className="slider-value">{chunkOverlap}</span>
            </div>

            <div className="form-group">
              <label>Separator (Separador Padrão)</label>
              <select value={separator} onChange={(e) => setSeparator(e.target.value)} className="select-input">
                <option value=" ">Espaço (Palavras)</option>
                <option value="\\n">Quebra de Linha</option>
                <option value=". ">Ponto final</option>
                <option value="">Nenhum (Força bruta)</option>
              </select>
            </div>
          </div>

          <div className="card p-4 input-panel">
            <h3 className="section-title"><FileText size={20}/> Texto Original</h3>
            <textarea 
              className="text-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Cole seu texto longo aqui..."
            />
            <div className="stats-bar">
              <span>{text.length} caracteres</span>
            </div>
          </div>
        </div>

        {/* Painel Direito: Output Visualizer */}
        <div className="rag-content card">
          <div className="content-header">
            <h3 className="section-title mb-0"><SplitSquareVertical size={20}/> Chunk Visualizer</h3>
            <div className="badge success">{chunks.length} Chunks gerados</div>
          </div>
          
          <div className="chunks-container">
            {chunks.length === 0 ? (
              <p className="text-secondary text-center mt-4">Digite algum texto para ver os chunks.</p>
            ) : (
              chunks.map((chunk, idx) => (
                <motion.div 
                  key={chunk.id} 
                  className="chunk-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className="chunk-header">
                    <span className="chunk-id">Chunk #{idx + 1}</span>
                    <span className="chunk-size">{chunk.text.length} chars</span>
                  </div>
                  <div className="chunk-body">
                    {chunk.isOverlapStart && (
                      <span className="overlap start" title="Sobreposição do chunk anterior">
                        {chunk.overlapStartText}
                      </span>
                    )}
                    <span className="main-text">{chunk.mainText}</span>
                    {chunk.isOverlapEnd && (
                      <span className="overlap end" title="Sobreposição que irá para o próximo chunk">
                        {chunk.overlapEndText}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RagSandbox;
