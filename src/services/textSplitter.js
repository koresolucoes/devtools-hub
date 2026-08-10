/**
 * Quebra um texto longo em chunks menores, respeitando o tamanho máximo e a sobreposição (overlap).
 * Simula o comportamento do CharacterTextSplitter do LangChain.
 *
 * @param {string} text - O texto a ser quebrado.
 * @param {number} chunkSize - O número máximo de caracteres por chunk.
 * @param {number} chunkOverlap - O número de caracteres a serem repetidos entre chunks adjacentes.
 * @param {string} separator - O separador padrão usado para tentar quebrar (default = " ").
 * @returns {Array<{text: string, isOverlapStart: boolean, isOverlapEnd: boolean, overlapStartText: string, overlapEndText: string}>} Array de chunks estruturados.
 */
export function splitText(text, chunkSize, chunkOverlap, separator = " ") {
  if (!text) return [];
  if (chunkSize <= 0) return [];
  if (chunkOverlap >= chunkSize) {
    chunkOverlap = chunkSize - 1; // Overlap cannot be >= chunk size
  }

  // Se o texto é menor que o chunk size, retorna tudo em 1 chunk
  if (text.length <= chunkSize) {
    return [{ text, isOverlapStart: false, isOverlapEnd: false, overlapStartText: "", overlapEndText: "" }];
  }

  const chunks = [];
  let i = 0;

  while (i < text.length) {
    let end = i + chunkSize;

    // Se estivermos no fim da string
    if (end >= text.length) {
      chunks.push(text.substring(i));
      break;
    }

    // Tentar encontrar o separador mais próximo antes do 'end' para não quebrar no meio de palavras
    // Procuramos o separador entre i + (chunkSize/2) e end.
    const searchArea = text.substring(i + Math.floor(chunkSize / 2), end);
    const lastSeparatorIndex = searchArea.lastIndexOf(separator);

    if (lastSeparatorIndex !== -1) {
      // Ajusta o fim para o separador (para não quebrar no meio da palavra)
      end = i + Math.floor(chunkSize / 2) + lastSeparatorIndex + separator.length;
    }

    const chunk = text.substring(i, end);
    chunks.push(chunk);

    // Avança o ponteiro, recuando o 'chunkOverlap' para criar a sobreposição
    i = end - chunkOverlap;
  }

  // Agora formatamos para que a UI saiba exatamente qual parte é overlap
  return chunks.map((chunk, index) => {
    let overlapStartText = "";
    let overlapEndText = "";
    
    // Se não for o primeiro, ele compartilha o início com o final do chunk anterior
    if (index > 0) {
      const prevChunk = chunks[index - 1];
      // A sobreposição no início deste chunk tem o tamanho de `chunkOverlap`
      // Mas por conta dos separadores, o overlap exato pode variar. 
      // Aproximação para a UI: pegamos os primeiros `chunkOverlap` caracteres.
      overlapStartText = chunk.substring(0, chunkOverlap);
    }

    // Se não for o último, ele compartilha o final com o início do próximo
    if (index < chunks.length - 1) {
      overlapEndText = chunk.substring(chunk.length - chunkOverlap);
    }

    return {
      id: `chunk-${index}`,
      text: chunk,
      overlapStartText,
      overlapEndText,
      mainText: chunk.substring(
        index > 0 ? chunkOverlap : 0, 
        index < chunks.length - 1 ? chunk.length - chunkOverlap : chunk.length
      ),
      isOverlapStart: index > 0,
      isOverlapEnd: index < chunks.length - 1
    };
  });
}
