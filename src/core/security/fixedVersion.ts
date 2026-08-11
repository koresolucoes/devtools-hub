import type { OSVVulnerability } from './types';

export function findRecommendedFixedVersion(vuln: OSVVulnerability, resolvedVersion: string, packageName: string, ecosystem: string): string | undefined {
  if (!vuln.affected) return undefined;

  const targetMajor = resolvedVersion.split('.')[0];

  for (const affected of vuln.affected) {
    if (affected.package.name === packageName && affected.package.ecosystem.toLowerCase() === ecosystem.toLowerCase()) {
      if (affected.ranges) {
        for (const range of affected.ranges) {
          if (range.type === 'SEMVER') {
            const fixedEvent = range.events.find(e => e.fixed);
            if (fixedEvent && fixedEvent.fixed) {
              const fixedMajor = fixedEvent.fixed.split('.')[0];
              // Only recommend a fix if it is in the same major line.
              // Otherwise, recommending a downgrade (e.g. 10.x to 3.x) is wrong, 
              // and an upgrade across majors might break things.
              if (fixedMajor === targetMajor) {
                return fixedEvent.fixed;
              }
            }
          }
        }
      }
    }
  }

  return undefined;
}
