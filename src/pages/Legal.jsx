import { useTranslation } from 'react-i18next';
import '../index.css';

export default function Legal() {
  const { t, i18n } = useTranslation('legal');
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem' }}>
      {i18n.language !== 'pt' && (
        <div style={{ background: 'rgba(255, 171, 0, 0.1)', color: '#ffab00', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid rgba(255, 171, 0, 0.3)' }}>
          {t('disclaimer')}
        </div>
      )}
      <header style={{ marginBottom: '3rem', borderBottom: '1px solid var(--surface-border)', paddingBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          AVISO LEGAL
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
          Última atualização: 10 de agosto de 2026
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '1.05rem' }}>
        <p>O DevsHub é uma plataforma de ferramentas e conteúdo técnico desenvolvida e mantida por:</p>
        
        <div style={{ background: 'var(--surface-bg)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--surface-border)' }}>
          <strong>LUCIANO NICOLAS QUIROZ GUTIERREZ DESENVOLVIMENTO DE SOFTWARE LTDA</strong><br/>
          Nome fantasia: Kore Serviços de Tecnologia<br/>
          CNPJ: 63.135.423/0001-39<br/>
          <br/>
          Endereço:<br/>
          Rua Pais Leme, 215, Conj. 1713<br/>
          Pinheiros, São Paulo/SP<br/>
          CEP 05424-150<br/>
          Brasil<br/>
          <br/>
          Contato: <strong>privacidade@koresolucoes.com.br</strong>
        </div>

        <section>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '1.5rem' }}>1. Sobre o DevsHub</h2>
          <p>O DevsHub disponibiliza ferramentas, utilitários, conteúdo técnico, templates, exemplos, referências e recursos relacionados a desenvolvimento de software, inteligência artificial, DevOps, CI/CD, segurança, Model Context Protocol (MCP), arquitetura de software e áreas relacionadas.</p>
          <p>O serviço poderá incluir, entre outros recursos:</p>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>geradores de configuração;</li>
            <li>ferramentas de análise;</li>
            <li>scanners de dependências;</li>
            <li>estimadores;</li>
            <li>sandboxes;</li>
            <li>templates;</li>
            <li>snippets;</li>
            <li>conteúdo editorial;</li>
            <li>informações provenientes de fontes públicas ou serviços de terceiros.</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '1.5rem' }}>2. Conteúdo técnico</h2>
          <p>As informações e resultados apresentados pelo DevsHub possuem caráter técnico e informativo.</p>
          <p>Embora sejam adotadas medidas para aumentar a qualidade e a confiabilidade das ferramentas, não é possível garantir que configurações, código, análises, estimativas, alertas de segurança ou outras saídas sejam adequados a todos os ambientes ou estejam livres de erros.</p>
          <p>Antes de utilizar qualquer resultado em produção, o usuário deve revisar, testar e validar sua aplicação no contexto específico do projeto.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '1.5rem' }}>3. Ferramentas de segurança</h2>
          <p>Resultados relacionados a vulnerabilidades, dependências, supply chain ou segurança não constituem auditoria de segurança completa.</p>
          <p>A ausência de alertas não significa que um projeto esteja livre de vulnerabilidades.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '1.5rem' }}>4. Conteúdo externo</h2>
          <p>O DevsHub poderá apresentar informações e links provenientes de GitHub, Hacker News, bases públicas, APIs ou outros serviços externos.</p>
          <p>Marcas, nomes, conteúdos e repositórios de terceiros pertencem aos respectivos titulares.</p>
          <p>A presença de um recurso no DevsHub não significa endosso, parceria ou associação entre a Kore Serviços de Tecnologia e o respectivo terceiro, salvo quando expressamente informado.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '1.5rem' }}>5. Alterações</h2>
          <p>Ferramentas, conteúdos e funcionalidades poderão ser adicionados, modificados ou removidos à medida que o DevsHub evolui.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '1.5rem' }}>6. Contato</h2>
          <p>Dúvidas relacionadas ao DevsHub ou a este Aviso Legal podem ser enviadas para:</p>
          <p><strong>privacidade@koresolucoes.com.br</strong></p>
        </section>
      </div>
    </div>
  );
}
