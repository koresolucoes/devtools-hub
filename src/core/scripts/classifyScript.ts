export type ScriptCapability = 
  | 'test' 
  | 'lint' 
  | 'typecheck' 
  | 'build' 
  | 'dev' 
  | 'e2e' 
  | 'format' 
  | 'deploy' 
  | 'unknown';

export function classifyPackageScript(name: string, command: string): ScriptCapability {
  const cmd = command.toLowerCase();
  
  // 1. Explicit Typecheck overrides
  if (cmd.includes('tsc --noemit') || cmd.includes('tsc -noemit') || cmd.includes('vue-tsc --noemit') || cmd.includes('svelte-check')) {
    return 'typecheck';
  }

  // 2. Explicit Lint overrides
  if (cmd.includes('eslint ') || cmd.includes('oxlint ') || cmd.includes('biome lint') || cmd.includes('prettier --check') || cmd.includes('stylelint ')) {
    return 'lint';
  }

  // 3. Name-based heuristics combined with command logic
  if (name.includes('typecheck')) {
    return 'typecheck';
  }

  if (name === 'test' || name.startsWith('test:')) {
    if (name.includes('e2e')) return 'e2e';
    return 'test';
  }

  if (name.includes('lint')) {
    if (cmd.includes('tsc')) return 'typecheck'; // sometimes people call lint:tsc
    return 'lint';
  }

  if (name === 'build' || name.startsWith('build:')) {
    return 'build';
  }

  if (name === 'dev' || name === 'start' || name === 'serve') {
    return 'dev';
  }

  if (name.includes('format') || name.includes('prettier')) {
    return 'format';
  }

  if (name.includes('deploy')) {
    return 'deploy';
  }

  // 4. Command-based fallbacks for tests
  if (cmd.includes('jest') || cmd.includes('vitest') || cmd.includes('pytest') || cmd.includes('node --test') || cmd.includes('bun test')) {
    return 'test';
  }
  
  if (cmd.includes('playwright') || cmd.includes('cypress')) {
    return 'e2e';
  }

  return 'unknown';
}
