export const tools = [
  {
    slug: 'project-doctor',
    id: 'project-doctor',
    name: 'Project Doctor',
    shortDescription: 'Project intelligence and shipping layer for AI-assisted developers.',
    longDescription: 'Paste your repository. DevsHub understands it. Finds what is wrong. Explains why. Generates the fix. Prepares the context for your coding agent.',
    icon: 'Activity',
    status: 'beta',
    category: 'Project Intelligence',
    tags: ['Architecture', 'Health', 'Agents'],
    supportedStacks: ['Node.js', 'Python', 'GitHub', 'GitLab'],
    seoTitle: 'Project Doctor — Vibe code fast. We make sure it actually ships.',
    seoDescription: 'Paste your repository. Find out what is wrong, why, and how to fix it.',
    features: [
      'Architecture Discovery',
      'Rules Engine Evaluation',
      'Evidence-based Health Score',
      'Agent Context Generation'
    ],
    faqs: [
      { q: 'What does Project Doctor do?', a: 'It analyzes your repository to find architecture, security, CI/CD, and quality issues.' }
    ],
    relatedTools: ['pipeline-architect', 'osv-dependency-scanner']
  },
  {
    slug: 'pipeline-architect',
    id: 'cicd-builder',
    name: 'CI/CD Pipeline Architect',
    shortDescription: 'Production-ready CI/CD without learning DevOps.',
    longDescription: 'Generate production-ready GitHub Actions and GitLab CI pipelines with intelligent caching, secrets handling, validation and health scoring.',
    icon: 'Plug',
    status: 'new',
    category: 'DevOps / CI/CD',
    tags: ['GitHub Actions', 'Docker'],
    supportedStacks: ['Node.js', 'Python', 'Docker', 'Vercel', 'Next.js'],
    seoTitle: 'CI/CD Pipeline Architect — Generate GitHub Actions & GitLab CI',
    seoDescription: 'Generate production-ready GitHub Actions and GitLab CI pipelines with intelligent caching, secrets handling, and validation.',
    features: [
      'Visual Pipeline Editor',
      'Health Scoring System',
      'Secrets Intelligence',
      'Multi-platform support (GitHub, GitLab)'
    ],
    faqs: [
      { q: 'What does Pipeline Architect do?', a: 'It visually generates robust, production-ready CI/CD pipelines based on your stack.' },
      { q: 'How does Pipeline Health Score work?', a: 'It evaluates your pipeline against best practices like caching, security scanning, and step timeouts.' }
    ],
    relatedTools: ['osv-dependency-scanner', 'project-doctor']
  },
  {
    slug: 'osv-dependency-scanner',
    id: 'npm-verify',
    name: 'OSV Dependency Scanner',
    shortDescription: 'Detect vulnerable packages and supply-chain risks.',
    longDescription: 'DevsHub OSV Dependency Scanner analyzes project dependencies against known open-source vulnerability data and helps identify affected package versions.',
    icon: 'ShieldAlert',
    status: 'stable',
    category: 'Security',
    tags: ['Node.js', 'Python'],
    supportedStacks: ['Node.js', 'Python'],
    seoTitle: 'OSV Dependency Scanner — Detect Vulnerable Packages',
    seoDescription: 'Scan your package.json or requirements.txt for known vulnerabilities using the OSV database.',
    features: [
      'Instant vulnerability detection',
      'Support for multiple lockfile formats',
      'Severity categorization'
    ],
    faqs: [
      { q: 'Which ecosystems are supported?', a: 'Currently Node.js (package.json, package-lock.json, pnpm-lock.yaml) and Python (requirements.txt).' }
    ],
    relatedTools: ['pipeline-architect']
  },
  {
    slug: 'rag-chunking-sandbox',
    id: 'rag-sandbox',
    name: 'RAG Chunking Sandbox',
    shortDescription: 'Test and optimize chunking strategies for embeddings.',
    longDescription: 'Interactively test how different text chunking strategies affect your Retrieval-Augmented Generation (RAG) context and embeddings.',
    icon: 'BrainCircuit',
    status: 'beta',
    category: 'AI Engineering',
    tags: ['Embeddings'],
    supportedStacks: ['OpenAI', 'LangChain', 'LlamaIndex'],
    seoTitle: 'RAG Chunking Sandbox — Test Embedding Strategies',
    seoDescription: 'Optimize text chunking strategies for your RAG applications. Visually inspect overlaps and token boundaries.',
    features: [
      'Visual chunk boundary inspection',
      'Overlap configuration',
      'Token counting integration'
    ],
    faqs: [
      { q: 'Why is chunking important for RAG?', a: 'Optimal chunking ensures that your LLM receives contextually complete information without exceeding token limits.' }
    ],
    relatedTools: ['token-estimator']
  },
  {
    slug: 'token-estimator',
    id: 'token-estimator',
    name: 'Token Estimator & Pricing',
    pt_name: 'Calculadora e Estimador de Tokens',
    es_name: 'Calculadora y Estimador de Tokens',
    shortDescription: 'Calculate LLM context size and costs across providers.',
    pt_shortDescription: 'Calcule o tamanho do contexto e os custos de LLMs em vários provedores.',
    es_shortDescription: 'Calcule el tamaño del contexto y los costos de LLM en varios proveedores.',
    longDescription: 'Estimate token counts for text prompts and calculate costs across various LLM providers including OpenAI, Anthropic, and Google Gemini.',
    pt_longDescription: 'Estime a contagem de tokens para prompts de texto e calcule os custos em vários provedores de LLM, incluindo OpenAI, Anthropic e Google Gemini.',
    es_longDescription: 'Estime el recuento de tokens para prompts de texto y calcule los costos en varios proveedores de LLM, incluyendo OpenAI, Anthropic y Google Gemini.',
    icon: 'Baseline',
    status: 'stable',
    category: 'AI Engineering',
    tags: ['LLM'],
    supportedStacks: ['OpenAI', 'Anthropic', 'Gemini'],
    seoTitle: 'LLM Token Estimator & Pricing Calculator',
    pt_seoTitle: 'Estimador de Tokens LLM e Calculadora de Preços',
    es_seoTitle: 'Estimador de Tokens LLM y Calculadora de Precios',
    seoDescription: 'Calculate token counts and estimate costs for OpenAI, Anthropic, and Gemini models instantly.',
    pt_seoDescription: 'Calcule a contagem de tokens e estime os custos para os modelos da OpenAI, Anthropic e Gemini instantaneamente.',
    es_seoDescription: 'Calcule el recuento de tokens y estime los costos para los modelos de OpenAI, Anthropic y Gemini instantáneamente.',
    features: [
      'Live token counting',
      'Multi-model pricing estimates',
      'Instant comparisons'
    ],
    pt_features: [
      'Contagem de tokens em tempo real',
      'Estimativas de preços de vários modelos',
      'Comparações instantâneas'
    ],
    es_features: [
      'Conteo de tokens en tiempo real',
      'Estimaciones de precios de varios modelos',
      'Comparaciones instantáneas'
    ],
    faqs: [
      { q: 'Are token counts exact?', a: 'We use standard tokenizers like cl100k_base to give highly accurate estimates, though final API counts may vary slightly.' }
    ],
    pt_faqs: [
      { q: 'As contagens de tokens são exatas?', a: 'Usamos tokenizadores padrão como cl100k_base para fornecer estimativas altamente precisas, embora as contagens finais da API possam variar ligeiramente.' }
    ],
    es_faqs: [
      { q: '¿Son exactos los recuentos de tokens?', a: 'Utilizamos tokenizadores estándar como cl100k_base para proporcionar estimaciones altamente precisas, aunque los recuentos finales de la API pueden variar ligeramente.' }
    ],
    relatedTools: ['rag-chunking-sandbox']
  },
  {
    slug: 'mcp-inspector',
    id: 'mcp-inspector',
    name: 'MCP Inspector',
    shortDescription: 'Inspect and debug Model Context Protocol capabilities.',
    longDescription: 'A debugging and inspection tool for servers implementing the Model Context Protocol (MCP).',
    icon: 'Flag',
    status: 'soon',
    category: 'MCP',
    tags: ['Context Protocol'],
    supportedStacks: ['MCP'],
    seoTitle: 'MCP Inspector — Debug Model Context Protocol Servers',
    seoDescription: 'Inspect and test capabilities of your Model Context Protocol (MCP) servers.',
    features: [],
    faqs: [],
    relatedTools: []
  }
];

export const guides = [
  {
    slug: 'github-actions-pnpm',
    title: 'GitHub Actions with pnpm',
    summary: 'How to correctly cache and setup pnpm in GitHub Actions to speed up your CI.',
    content: '...',
    category: 'CI/CD',
    relatedTools: ['pipeline-architect']
  },
  {
    slug: 'dependency-security',
    title: 'How OSV vulnerability scanning works',
    summary: 'Understanding the Open Source Vulnerability (OSV) database and how to secure your supply chain.',
    category: 'Security',
    relatedTools: ['osv-dependency-scanner']
  }
];

export const templates = [
  {
    slug: 'github-actions-nextjs-vercel',
    title: 'Next.js → Vercel',
    summary: 'Production-ready CI/CD pipeline for Next.js applications with caching, linting, tests and Vercel deployment.',
    stack: ['Next.js', 'pnpm', 'Vercel'],
    category: 'CI/CD',
    status: 'PRODUCTION',
    tag: 'POPULAR',
    flow: ['PR', 'Test', 'Build', 'Vercel'],
    features: ['Tests', 'Cache', 'Production deploy'],
    relatedTools: ['pipeline-architect']
  },
  {
    slug: 'github-actions-node-docker',
    title: 'Node.js → Docker',
    summary: 'Build, test and publish a production Docker image.',
    stack: ['Node.js', 'Docker', 'GHCR'],
    category: 'CI/CD',
    status: 'PRODUCTION',
    flow: ['Test', 'Build', 'Push', 'GHCR'],
    features: ['Buildx', 'Layer cache', 'SHA tags'],
    relatedTools: ['pipeline-architect']
  },
  {
    slug: 'github-actions-python-docker',
    title: 'Python → Docker',
    summary: 'Build, test and containerize Python applications efficiently.',
    stack: ['Python', 'Docker', 'GHCR'],
    category: 'CI/CD',
    status: 'PRODUCTION',
    tag: 'NEW',
    flow: ['Lint', 'Test', 'Build', 'Push'],
    features: ['pytest', 'Poetry caching', 'Multi-stage build'],
    relatedTools: ['pipeline-architect']
  },
  {
    slug: 'github-actions-fastapi-docker',
    title: 'FastAPI → Docker',
    summary: 'Optimized Docker build pipeline for FastAPI backends.',
    stack: ['FastAPI', 'Python', 'Docker'],
    category: 'Docker',
    status: 'PRODUCTION',
    flow: ['Test', 'Build', 'Push', 'Deploy'],
    features: ['Uvicorn', 'Slim image', 'Security scan'],
    relatedTools: ['pipeline-architect']
  },
  {
    slug: 'github-actions-node-ghcr',
    title: 'Node.js → GHCR',
    summary: 'Push Node.js services directly to GitHub Container Registry.',
    stack: ['Node.js', 'Docker', 'GHCR'],
    category: 'Deploy',
    status: 'STARTER',
    flow: ['Build', 'Tag', 'Push', 'GHCR'],
    features: ['Automated tags', 'Registry auth', 'Multi-arch'],
    relatedTools: ['pipeline-architect']
  },
  {
    slug: 'github-actions-nextjs-docker',
    title: 'Next.js → Docker',
    summary: 'Standalone Next.js Docker build pipeline for custom hosting.',
    stack: ['Next.js', 'Docker', 'Actions'],
    category: 'Docker',
    status: 'PRODUCTION',
    flow: ['Build', 'Standalone', 'Push', 'Deploy'],
    features: ['Output standalone', 'Alpine image', 'Env vars'],
    relatedTools: ['pipeline-architect']
  }
];

export const briefing = [
  {
    slug: '2026-08-10',
    title: 'Developer Intelligence — August 10, 2026',
    summary: 'Human-like writing tools are gaining traction among AI developers. See today\'s top signals.',
    date: '2026-08-10',
    items: [
      {
        source: 'GitHub Trending',
        category: 'AI',
        title: 'human-writing',
        description: 'Human-like writing tools are gaining traction among AI developers.',
        whyItMatters: 'Developers are increasingly exploring tooling that post-processes LLM output and changes recognizable model writing patterns.',
        language: 'Python',
        stars: '2.2k',
        url: '#'
      }
    ]
  }
];
