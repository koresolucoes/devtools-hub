# DevsHub Roadmap Checklist

## Milestone 0 — Trust & Correctness
- [ ] Setup Vitest testing infrastructure (npm test, npm run test:watch, npm run test:coverage).
- [ ] Add basic golden tests for pipeline configurations.
- [ ] Introduce gradual TypeScript support for `src/core/`.
- [ ] Audit existing claims vs actual implementation (and correct UI/Marketing).
- [ ] Refactor OSV Scanner dependency detection to support accurate ecosystems (npm, PyPI).
- [ ] Fix severity fallback in OSV scanner (unknown should not default to HIGH).
- [ ] Move `pipelineIR.js` to `src/core/pipeline/` gracefully.
- [ ] Mark GitLab CI as "Preview" if paridade is lacking.
- [ ] Create `src/core/registries/actions.ts` to manage action versions securely.
- [ ] Create `src/core/registries/models.ts` to decouple Token Estimator pricing.
- [ ] Replace default Vite README with a proper product README.
- [ ] Ensure Cmd/Ctrl + K (Command Palette) works globally.

## Milestone 1 — ProjectIR
- [ ] Create `src/core/project/types.ts` and `createProjectIR.ts`.

## Milestone 2 — Repository Analyzer
- [ ] Create `repositoryAnalyzer.ts` and stack detectors (node, python, docker, etc.).

## Milestone 3 — Rules Engine
- [ ] Implement `src/core/rules/` with initial rule packs (CI, Build, Security, Quality).

## Milestone 4 — Project Health Score
- [ ] Implement `src/core/scoring/projectHealth.ts`.

## Milestone 5 — Project Doctor UI MVP
- [ ] Create public GitHub repo adapter.
- [ ] Build `/project-doctor` page with findings and score UI.

## Milestone 6 — Remediation Engine
- [ ] Implement Remediation object generation.
- [ ] Implement Agent Exporters (Codex, Claude, Cursor prompts).

## Milestone 7 — Project Context
- [ ] Create `ProjectContext.tsx` to share state across tools.

## Milestone 8 — Cross-Tool Intelligence
- [ ] Integrate Project Context into Pipeline Architect, OSV Scanner, Token Lab, etc.

## Milestone 9 — Templates as Pipeline Presets
- [ ] Update content model for templates to link to `presetId`.

## Milestone 10 — Command Palette Evolution
- [ ] Upgrade search index to combine tools, guides, templates, and project actions.

## Milestone 11 — Ship Check & Agent Readiness
- [ ] Implement "Ship Check" mode.
- [ ] Implement `src/core/agents/readiness.ts`.

## Milestone 12 & Beyond
- [ ] RAG Lab enhancements, AI Cost Lab, Developer Intelligence, User Workspaces, and more.
