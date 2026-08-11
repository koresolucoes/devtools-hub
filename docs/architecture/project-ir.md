# ProjectIR Architecture

## Concept
The `ProjectIR` (Intermediate Representation) is the central semantic model of a repository in DevsHub. It abstracts away the raw file contents into a structured, unified format that all DevsHub tools (Pipeline Architect, Rules Engine, OSV Scanner, etc.) can consume.

## Core Structure
```typescript
interface ProjectIR {
  identity: {
    name?: string
    repository?: string
    defaultBranch?: string
  }
  languages: DetectedTechnology[]
  frameworks: DetectedTechnology[]
  runtime: {
    node?: string
    python?: string
  }
  packageManagers: PackageManagerInfo[]
  manifests: ProjectManifest[]
  scripts: Record<string, string>
  dependencies: Dependency[]
  infrastructure: {
    docker?: DockerProjectInfo
    ci?: CIProjectInfo
    deployment?: DeploymentInfo
  }
  quality: {
    tests?: TestInfo[]
    linters?: LinterInfo[]
    typechecking?: TypecheckInfo[]
  }
  environment: {
    declaredVariables: EnvironmentVariable[]
  }
  databases: DetectedTechnology[]
  ai: {
    providers: DetectedTechnology[]
    sdkDependencies: Dependency[]
    mcp?: MCPProjectInfo
    agentConfig?: AgentProjectInfo
  }
  files: ProjectFileSummary[]
  findings: Finding[]
  metadata: {
    analyzedAt: string
    analyzerVersion: string
  }
}
```

## Guiding Principles
1. **Evidence-based**: Every detected technology must be backed by evidence (e.g., a specific file or dependency).
2. **Deterministic**: No LLM guessing. Parsing package.json, Dockerfile, etc. must yield predictable results.
3. **Reusable**: The ProjectIR is built once per session/analysis and shared across the DevsHub UI context.
