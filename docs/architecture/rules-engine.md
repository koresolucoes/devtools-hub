# Rules Engine Architecture

## Concept
The Rules Engine evaluates a `ProjectIR` against a set of predefined, deterministic rules. It identifies issues (Findings) and generates actionable solutions (Remediations).

## Core Models

### Finding
```typescript
type FindingSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info'

interface Finding {
  id: string
  ruleId: string
  severity: FindingSeverity
  category: string
  title: string
  description: string
  evidence: Evidence[]
  impact: string
  remediation?: Remediation
  confidence: 'high' | 'medium' | 'low'
  references?: Reference[]
}

interface Evidence {
  file?: string
  path?: string
  value?: string
  message: string
}
```

### Remediation
```typescript
interface Remediation {
  summary: string
  type: 'instruction' | 'file-create' | 'file-update' | 'dependency-change' | 'workflow-change'
  affectedFiles: string[]
  instructions: string[]
  patch?: string
  verification: string[]
}
```

## Rule Design
Rules are organized by category and use a stable ID format (e.g., `CI001`, `BUILD002`, `SEC001`).
Each rule exposes a `detect(projectIR: ProjectIR): Finding | null` method.

**Examples of Rules:**
- `CI001`: CI workflow missing.
- `QUALITY001`: No test script detected.
- `AI001`: LLM/model identifier hardcoded without configuration.
