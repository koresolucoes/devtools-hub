import { useTranslation } from 'react-i18next';
import '../index.css';

export default function Terms() {
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
          TERMOS DE USO DO DEVSHUB
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
          Última atualização: 10 de agosto de 2026
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '1.05rem' }}>
        <p>Estes Termos de Uso regulam o acesso e a utilização do DevsHub.</p>
        <p>Ao utilizar o DevsHub, você declara ter lido e concordado com estes Termos.</p>

        <section>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '1.5rem' }}>1. RESPONSÁVEL PELO SERVIÇO</h2>
          <p>O DevsHub é operado por:</p>
          <div style={{ background: 'var(--surface-bg)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--surface-border)', marginTop: '1rem' }}>
            <strong>LUCIANO NICOLAS QUIROZ GUTIERREZ DESENVOLVIMENTO DE SOFTWARE LTDA</strong><br/>
            Nome fantasia: Kore Serviços de Tecnologia<br/>
            CNPJ: 63.135.423/0001-39<br/>
            Rua Pais Leme, 215, Conj. 1713<br/>
            Pinheiros, São Paulo/SP<br/>
            CEP 05424-150<br/>
            Brasil<br/>
            <br/>
            Contato: <strong>privacidade@koresolucoes.com.br</strong>
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '1.5rem' }}>2. FINALIDADE DO DEVSHUB</h2>
          <p>O DevsHub oferece ferramentas destinadas a auxiliar desenvolvedores na criação, análise, validação, aprendizado e manutenção de software e infraestrutura.</p>
          <p>As funcionalidades podem incluir ferramentas relacionadas a:</p>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>CI/CD;</li>
            <li>GitHub Actions;</li>
            <li>GitLab CI;</li>
            <li>Docker;</li>
            <li>dependências de software;</li>
            <li>vulnerabilidades;</li>
            <li>inteligência artificial;</li>
            <li>RAG;</li>
            <li>MCP;</li>
            <li>estimativas de tokens e custos;</li>
            <li>snippets e configurações;</li>
            <li>conteúdo técnico e Developer Intelligence.</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '1.5rem' }}>3. USO DAS FERRAMENTAS</h2>
          <p>Os resultados gerados pelo DevsHub devem ser considerados como auxílio técnico.</p>
          <p>O usuário é responsável por revisar e testar configurações, código, comandos, templates e demais resultados antes de utilizá-los em ambientes reais ou de produção.</p>
          <p>O DevsHub não garante que todo resultado:</p>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>esteja livre de erros;</li>
            <li>seja adequado ao ambiente específico do usuário;</li>
            <li>esteja atualizado em relação a todos os serviços de terceiros;</li>
            <li>elimine todos os riscos de segurança;</li>
            <li>produza determinado resultado operacional ou financeiro.</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '1.5rem' }}>4. RESPONSABILIDADE DO USUÁRIO</h2>
          <p>O usuário é responsável pelos dados, código e informações submetidos às ferramentas.</p>
          <p>O usuário não deverá utilizar o DevsHub para:</p>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>violar leis ou direitos de terceiros;</li>
            <li>realizar acesso não autorizado a sistemas;</li>
            <li>distribuir malware ou código malicioso;</li>
            <li>explorar vulnerabilidades contra terceiros sem autorização;</li>
            <li>obter, expor ou comercializar credenciais de terceiros;</li>
            <li>violar direitos autorais, marcas ou propriedade intelectual;</li>
            <li>comprometer ou tentar comprometer a infraestrutura do DevsHub;</li>
            <li>executar automações abusivas ou que prejudiquem a disponibilidade do serviço.</li>
          </ul>
          <p>Ferramentas de segurança são disponibilizadas para atividades legítimas de análise, desenvolvimento e proteção de sistemas.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '1.5rem' }}>5. SEGREDOS, TOKENS E CREDENCIAIS</h2>
          <p>Salvo quando uma ferramenta indicar expressamente outra finalidade, o usuário não deve inserir credenciais reais, chaves privadas, tokens de produção, senhas ou outros segredos em campos que não tenham sido projetados especificamente para esse tratamento.</p>
          <p>Ao gerar exemplos de configuração envolvendo secrets ou environment variables, o DevsHub poderá utilizar referências e placeholders em vez dos valores reais.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '1.5rem' }}>6. PROPRIEDADE INTELECTUAL</h2>
          <p>A estrutura, identidade, interfaces, software próprio, design e conteúdo original do DevsHub pertencem à Kore Serviços de Tecnologia ou são utilizados mediante licença aplicável.</p>
          <p>Código, bibliotecas, marcas, repositórios e conteúdo pertencentes a terceiros permanecem sujeitos às respectivas licenças e direitos de seus titulares.</p>
          <p>Templates e snippets disponibilizados para utilização poderão possuir termos ou licenças específicos quando indicado.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '1.5rem' }}>7. CONTEÚDO DE TERCEIROS</h2>
          <p>O DevsHub poderá exibir informações provenientes de serviços externos como GitHub, Hacker News e outras fontes.</p>
          <p>A Kore Serviços de Tecnologia não controla a disponibilidade, conteúdo ou políticas desses serviços.</p>
          <p>Links externos são fornecidos para conveniência e referência.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '1.5rem' }}>8. DISPONIBILIDADE</h2>
          <p>O DevsHub poderá sofrer interrupções devido a manutenção, atualizações, falhas de infraestrutura, dependências de terceiros ou outros fatores técnicos.</p>
          <p>Não é garantida disponibilidade contínua ou ininterrupta do serviço.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '1.5rem' }}>9. ALTERAÇÕES NO SERVIÇO</h2>
          <p>O DevsHub poderá alterar, adicionar, substituir ou descontinuar funcionalidades.</p>
          <p>Recursos identificados como Alpha, Beta, Experimental ou Preview poderão apresentar comportamento instável ou sofrer alterações frequentes.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '1.5rem' }}>10. LIMITAÇÃO DE RESPONSABILIDADE</h2>
          <p>Na extensão permitida pela legislação aplicável, a Kore Serviços de Tecnologia não será responsável por prejuízos decorrentes exclusivamente da utilização de código, configurações ou recomendações sem a devida validação técnica pelo usuário.</p>
          <p>Nada nestes Termos exclui responsabilidades que não possam ser legalmente excluídas ou limitadas.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '1.5rem' }}>11. PRIVACIDADE</h2>
          <p>O tratamento de dados pessoais relacionado ao DevsHub é descrito na Política de Privacidade.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '1.5rem' }}>12. ALTERAÇÕES DESTES TERMOS</h2>
          <p>Estes Termos poderão ser atualizados para refletir alterações legais, técnicas ou funcionais.</p>
          <p>A data da versão mais recente será informada no início deste documento.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '1.5rem' }}>13. LEGISLAÇÃO</h2>
          <p>Estes Termos são regidos pelas leis da República Federativa do Brasil.</p>
          <p>Eventuais controvérsias serão solucionadas conforme as regras de competência previstas na legislação brasileira, preservados os direitos e foros assegurados ao consumidor quando aplicáveis.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '1.5rem' }}>14. CONTATO</h2>
          <p>Questões relacionadas a estes Termos poderão ser encaminhadas para:</p>
          <p><strong>privacidade@koresolucoes.com.br</strong></p>
        </section>
      </div>
    </div>
  );
}
