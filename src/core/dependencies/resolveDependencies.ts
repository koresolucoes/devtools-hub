import type { Dependency } from './types';

export function resolveDependencies(declared: Dependency[], resolved: Dependency[]): Dependency[] {
  if (resolved.length === 0) {
    return declared;
  }

  const result: Dependency[] = [];
  const resolvedMap = new Map<string, Dependency>();

  // Map all resolved dependencies by their packagePath or name
  for (const dep of resolved) {
    if (dep.packagePath) {
      resolvedMap.set(dep.packagePath, dep);
    } else {
      resolvedMap.set(dep.name, dep);
    }
  }

  // Iterate over resolved dependencies to build the final list
  // We use the lockfile as the source of truth for what's actually installed.
  for (const dep of resolved) {
    // Check if this resolved dependency is a direct one declared in package.json
    let declaredRange: string | undefined;
    
    if (dep.direct) {
      const declaredDep = declared.find(d => d.name === dep.name);
      if (declaredDep) {
        declaredRange = declaredDep.declaredRange;
      }
    }

    result.push({
      ...dep,
      declaredRange
    });
  }

  // What if a dependency is in package.json but NOT in package-lock.json?
  // (e.g., failed to install, or we are analyzing an incomplete repo)
  for (const dec of declared) {
    const found = result.find(r => r.name === dec.name && r.direct);
    if (!found) {
      result.push(dec);
    }
  }

  return result;
}
