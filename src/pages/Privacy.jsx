import '../index.css';

export default function Privacy() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem' }}>
      <header style={{ marginBottom: '3rem', borderBottom: '1px solid var(--surface-border)', paddingBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          POLÍTICA DE PRIVACIDADE DO DEVSHUB
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
          Última atualização: 10 de agosto de 2026
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '1.05rem' }}>
        <p>A proteção da privacidade dos usuários faz parte dos princípios de desenvolvimento do DevsHub.</p>
        <p>Esta Política explica como dados pessoais podem ser tratados durante a utilização da plataforma.</p>

        <section>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '1.5rem' }}>1. CONTROLADOR</h2>
          <p>O controlador dos dados pessoais tratados diretamente pelo DevsHub é:</p>
          <div style={{ background: 'var(--surface-bg)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--surface-border)', marginTop: '1rem' }}>
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
            Canal de privacidade: <strong>privacidade@koresolucoes.com.br</strong>
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '1.5rem' }}>2. DADOS QUE PODEMOS TRATAR</h2>
          <p>Dependendo da funcionalidade utilizada, poderão ser tratados:</p>
          
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>a) Dados técnicos de acesso</h3>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>endereço IP;</li>
            <li>data e horário de acesso;</li>
            <li>informações básicas sobre navegador e dispositivo;</li>
            <li>logs técnicos;</li>
            <li>informações necessárias à segurança e funcionamento da aplicação.</li>
          </ul>

          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>b) Dados enviados voluntariamente pelo usuário</h3>
          <p>Quando uma ferramenta permitir que o usuário forneça informações, poderão ser processados os dados inseridos pelo próprio usuário. Isso poderá incluir, conforme a ferramenta:</p>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>configurações;</li>
            <li>manifests;</li>
            <li>listas de dependências;</li>
            <li>código ou trechos de código;</li>
            <li>prompts;</li>
            <li>arquivos técnicos;</li>
            <li>nomes de variáveis;</li>
            <li>informações de projeto.</li>
          </ul>
          <p>O usuário deve evitar incluir dados pessoais ou credenciais que não sejam necessários para a utilização da ferramenta.</p>

          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>c) Dados de comunicação</h3>
          <p>Caso o usuário entre em contato com a Kore Serviços de Tecnologia, poderão ser tratados:</p>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>nome;</li>
            <li>e-mail;</li>
            <li>conteúdo da mensagem;</li>
            <li>demais informações fornecidas voluntariamente.</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '1.5rem' }}>3. FINALIDADES</h2>
          <p>Os dados poderão ser utilizados para:</p>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>disponibilizar e operar as ferramentas;</li>
            <li>processar solicitações do usuário;</li>
            <li>garantir segurança e prevenir abuso;</li>
            <li>diagnosticar erros;</li>
            <li>melhorar desempenho e experiência;</li>
            <li>responder contatos e solicitações;</li>
            <li>cumprir obrigações legais;</li>
            <li>proteger direitos da Kore Serviços de Tecnologia ou de terceiros;</li>
            <li>produzir estatísticas agregadas sobre utilização do serviço.</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '1.5rem' }}>4. BASES LEGAIS</h2>
          <p>O tratamento poderá ocorrer, conforme o caso, com fundamento em:</p>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>execução de contrato ou procedimentos relacionados ao serviço solicitado;</li>
            <li>cumprimento de obrigação legal ou regulatória;</li>
            <li>legítimo interesse, quando aplicável e respeitados os direitos do titular;</li>
            <li>exercício regular de direitos;</li>
            <li>consentimento, quando exigido.</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '1.5rem' }}>5. DADOS INSERIDOS NAS FERRAMENTAS</h2>
          <p>A forma como informações inseridas nas ferramentas são processadas pode variar de acordo com cada funcionalidade. Sempre que tecnicamente possível e compatível com a funcionalidade, o DevsHub busca minimizar a coleta e retenção de informações.</p>
          <p>O usuário não deverá enviar segredos, senhas, chaves privadas, tokens de produção ou dados pessoais desnecessários.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '1.5rem' }}>6. COMPARTILHAMENTO</h2>
          <p>Dados poderão ser processados por fornecedores responsáveis pela infraestrutura ou funcionamento do serviço, estritamente quando necessário. Isso pode incluir serviços de:</p>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>hospedagem;</li>
            <li>infraestrutura cloud;</li>
            <li>segurança;</li>
            <li>APIs utilizadas por determinadas ferramentas.</li>
          </ul>
          <p>Esses fornecedores poderão atuar como operadores ou controladores independentes, dependendo do serviço.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '1.5rem' }}>7. SERVIÇOS E CONTEÚDO DE TERCEIROS</h2>
          <p>O DevsHub poderá integrar ou apresentar dados provenientes de serviços como GitHub, Hacker News e outras APIs.</p>
          <p>Ao acessar diretamente um site externo, o tratamento de dados realizado naquele ambiente será regido pelas políticas do respectivo terceiro.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '1.5rem' }}>8. TRANSFERÊNCIA INTERNACIONAL</h2>
          <p>Alguns fornecedores tecnológicos utilizados pelo DevsHub poderão armazenar ou processar informações fora do Brasil. Quando aplicável, transferências internacionais de dados deverão observar os requisitos da legislação brasileira de proteção de dados.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '1.5rem' }}>9. RETENÇÃO</h2>
          <p>Os dados serão mantidos somente durante o período necessário para as finalidades que justificaram seu tratamento ou conforme exigido para cumprimento de obrigações legais, segurança e exercício regular de direitos.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '1.5rem' }}>10. SEGURANÇA</h2>
          <p>A Kore Serviços de Tecnologia adota medidas técnicas e administrativas compatíveis com a natureza do serviço para reduzir riscos de acesso não autorizado, perda, destruição, alteração, divulgação ou tratamento inadequado.</p>
          <p>Nenhum sistema conectado à internet pode garantir risco zero.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '1.5rem' }}>11. DIREITOS DOS TITULARES</h2>
          <p>Nos termos da legislação aplicável, o titular poderá solicitar, quando cabível:</p>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>confirmação da existência de tratamento;</li>
            <li>acesso aos dados pessoais;</li>
            <li>correção de dados incompletos ou incorretos;</li>
            <li>anonimização, bloqueio ou eliminação nas hipóteses legais;</li>
            <li>portabilidade, quando aplicável;</li>
            <li>informações sobre compartilhamento;</li>
            <li>eliminação de dados tratados com consentimento, observadas as exceções legais;</li>
            <li>revogação do consentimento;</li>
            <li>oposição ao tratamento quando cabível.</li>
          </ul>
          <p>Solicitações poderão ser enviadas para: <strong>privacidade@koresolucoes.com.br</strong></p>
          <p>Poderemos solicitar informações necessárias para confirmar a identidade do solicitante e proteger os dados contra acesso indevido.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '1.5rem' }}>12. CRIANÇAS E ADOLESCENTES</h2>
          <p>O DevsHub é uma plataforma técnica destinada principalmente a desenvolvedores e profissionais de tecnologia e não é direcionado especificamente a crianças. Não buscamos deliberadamente coletar dados pessoais de crianças.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '1.5rem' }}>13. COOKIES</h2>
          <p>Informações sobre cookies e tecnologias semelhantes estão disponíveis na Política de Cookies do DevsHub.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '1.5rem' }}>14. ALTERAÇÕES</h2>
          <p>Esta Política poderá ser atualizada em razão de alterações legais, técnicas ou operacionais. A data da versão mais recente será sempre indicada no início do documento.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '1.5rem' }}>15. CONTATO</h2>
          <p>Para questões relacionadas a privacidade e proteção de dados:</p>
          <p>
            Kore Serviços de Tecnologia<br/>
            CNPJ: 63.135.423/0001-39<br/>
            <strong>privacidade@koresolucoes.com.br</strong>
          </p>
        </section>
      </div>
    </div>
  );
}
