# DevsHub Technical Roadmap

## 1. Current Architecture
DevsHub is currently a collection of independent developer tools (Pipeline Architect, OSV Scanner, RAG Sandbox, Token Estimator, etc.) built with React, Vite, React Router, and i18next. 
The tools share a frontend shell but lack a unifying data model. Data such as dependencies, frameworks, and pricing are often hardcoded in the UI components.

## 2. Current Technical Debt
- **Lack of automated tests**: No testing infrastructure (Vitest/Playwright).
- **Hardcoded logic**: Pricing, action versions, and package manager assumptions are embedded in components.
- **Fragmented Context**: Users must re-enter their stack information across different tools.
- **Missing TypeScript**: Core domain logic is in JS, lacking type safety for complex IR transformations.
- **Unverified Claims**: Some features promised in the UI/marketing do not have a robust underlying implementation.

## 3. Product Architecture
The North Star is: "Vibe code fast. DevsHub makes sure it actually ships."
DevsHub will transition into a Project Intelligence platform comprising:
- **Project Context (ProjectIR)**: A unified intermediate representation of a repository.
- **Rules Engine**: A deterministic engine to evaluate the ProjectIR for security, CI, and build issues.
- **Remediation Engine**: Generates patches and agent prompts to fix identified issues.
- **Specialized Dev Tools**: The existing tools (Pipeline, OSV, Token Lab) will plug into the shared Project Context.

## 4. ProjectIR Design
The `ProjectIR` is the core semantic representation of a user's repository. It standardizes the stack, frameworks, package managers, CI/CD, Docker configurations, and quality/testing setups into a single serializable object.
*See [project-ir.md](./architecture/project-ir.md) for details.*

## 5. Rules Engine Design
The Rules Engine runs deterministic checks against the `ProjectIR` to produce Findings. Each rule is atomic, categorized (Security, Build, CI, etc.), and generates actionable remediations when it fails.
*See [rules-engine.md](./architecture/rules-engine.md) for details.*

## 6. Repository Analyzer Design
The Repository Analyzer is responsible for detecting the stack and populating the `ProjectIR`. It works client-side (for public repos initially) and relies on specific files (`package.json`, `Dockerfile`, `.github/workflows/`, etc.) to infer the stack deterministically. 

## 7. Remediation Design
Findings will generate `Remediation` objects that describe how to fix an issue (e.g., file-update, dependency-change). These remediations can be exported as structured prompts for AI coding agents (Codex, Claude Code, Cursor).

## 8. Security Model
- **Deterministic First**: No unnecessary AI/LLM calls for things that can be parsed.
- **Client-Side Parsing**: Keeping parsing local when possible.
- **Minimal Access**: Only request necessary files, avoiding secrets and `.env` contents.

## 9. Phased Roadmap
*See [ROADMAP_CHECKLIST.md](../ROADMAP_CHECKLIST.md) for the detailed phase checklist.*

## 10. Testing Strategy
- Core domain logic (ProjectIR, Rules Engine, Analyzers) will be heavily tested with Vitest.
- Golden/Snapshot tests for pipeline generation.
- No UI testing initially, focus purely on core correctness.

## 11. Migration Plan
- Introduce TypeScript gradually in `src/core/`.
- Move existing logic (like `pipelineIR.js`) into the new core structure gracefully.
- Do not break existing tools; connect them to ProjectIR incrementally.

## 12. Acceptance Criteria for MVP
- `ProjectIR` successfully builds from a public GitHub repo URL.
- The `Project Doctor` UI displays Health Score and Findings.
- A remediation can be copied for a Coding Agent.
- All core logic is unit tested.
