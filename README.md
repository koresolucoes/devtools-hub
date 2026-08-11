# DevsHub

> **"Vibe code fast. DevsHub makes sure it actually ships."**

DevsHub is a platform engineered for vibe coders, AI engineers, and developers utilizing coding agents (Codex, Claude, Cursor, Copilot). It transforms raw LLM-generated code into structurally sound, production-ready applications. 

DevsHub is not a chatbot. It is a deterministic Analysis Engine coupled with an extensible Rules Engine that deeply understands your repository, spots what's missing, and generates execution plans tailored to your AI coding agents.

## Features

- **Project Intelligence (ProjectIR)**: Normalizes arbitrary repositories into a standardized Intermediate Representation, providing deterministic facts about the codebase.
- **Repository Analyzer**: Detects languages, package managers, frameworks, CI setups, and quality gates with precision.
- **Rules Engine**: Applies static checks (Quality, CI, Build, Security) to identify gaps before you hit production.
- **Dependency Security**: Scans your `package.json` and `requirements.txt` against the Google OSV API.
- **Pipeline Architect**: Auto-generates GitHub Actions and GitLab CI configurations based on your tech stack.
- **Token Estimator**: Analyzes prompts and provides exact (OpenAI) and estimated (Char/4) token usage and cost for 2026 AI models.

## Development Setup

### Requirements
- Node.js 20.x or higher
- npm (or pnpm/yarn/bun)

### Quick Start
```bash
# Clone the repository
git clone https://github.com/koresolucoes/devtools-hub.git
cd devtools-hub

# Install dependencies
npm install

# Run the development server
npm run dev
```

### Quality Gates

Ensure everything is correct before committing:
```bash
# Run tests
npm test

# Check test coverage
npm run test:coverage

# Run linter
npm run lint

# Check TypeScript types
npm run typecheck

# Build for production
npm run build
```

## Architecture

DevsHub leverages a modular Core Architecture:
- `src/core/project`: Builds the `ProjectIR`.
- `src/core/analyzers`: Implements stack detectors.
- `src/core/rules`: Holds Rule Packs for code validation.
- `src/core/dependencies`: Handles OSV parsing logic.
- `src/core/pipeline`: Generates CI/CD configurations.

## License

All rights reserved by Koresolucoes.
