import '../index.css';

export default function Cookies() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem' }}>
      <header style={{ marginBottom: '3rem', borderBottom: '1px solid var(--surface-border)', paddingBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          POLÍTICA DE COOKIES
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
          Última atualização: 10 de agosto de 2026
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '1.05rem' }}>
        <p>Esta Política explica como o DevsHub utiliza cookies e tecnologias semelhantes.</p>

        <section>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '1.5rem' }}>1. O QUE SÃO COOKIES?</h2>
          <p>Cookies são pequenos arquivos ou identificadores armazenados ou acessados durante a utilização de um site.</p>
          <p>Eles podem permitir funcionalidades essenciais, preservar preferências, melhorar desempenho ou produzir informações sobre utilização da plataforma.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '1.5rem' }}>2. CATEGORIAS</h2>
          <p>O DevsHub poderá utilizar as seguintes categorias:</p>
          
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>COOKIES NECESSÁRIOS</h3>
          <p>São utilizados para funções essenciais de segurança, funcionamento, navegação ou preferências indispensáveis.</p>
          <p>Quando estritamente necessários para a prestação do serviço solicitado, não dependem de consentimento.</p>
          
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>COOKIES DE FUNCIONALIDADE</h3>
          <p>Podem ser utilizados para lembrar determinadas escolhas e preferências do usuário.</p>
          
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>COOKIES ANALÍTICOS</h3>
          <p>Quando utilizados, ajudam a entender de forma agregada como o DevsHub é utilizado, como páginas acessadas, desempenho e ocorrência de erros.</p>
          
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>COOKIES DE TERCEIROS</h3>
          <p>Determinadas funcionalidades poderão depender de serviços externos que utilizem suas próprias tecnologias.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '1.5rem' }}>3. COOKIES NÃO ESSENCIAIS</h2>
          <p>Quando o DevsHub utilizar cookies ou tecnologias não essenciais cuja base aplicável seja o consentimento, o usuário deverá poder:</p>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>aceitar;</li>
            <li>rejeitar;</li>
            <li>configurar suas preferências.</li>
          </ul>
          <p>A recusa de cookies não essenciais não deverá impedir a utilização das funcionalidades essenciais do DevsHub.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '1.5rem' }}>4. GERENCIAMENTO</h2>
          <p>O usuário poderá alterar suas preferências através do mecanismo de gerenciamento de cookies disponibilizado no site, quando aplicável.</p>
          <p>Também é possível utilizar os controles do navegador para bloquear ou excluir cookies.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '1.5rem' }}>5. ALTERAÇÕES</h2>
          <p>Esta Política poderá ser atualizada caso novas tecnologias ou fornecedores sejam incorporados ao DevsHub.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '1.5rem' }}>6. CONTATO</h2>
          <p>Dúvidas relacionadas a cookies e privacidade:</p>
          <p><strong>privacidade@koresolucoes.com.br</strong></p>
        </section>
      </div>
    </div>
  );
}
