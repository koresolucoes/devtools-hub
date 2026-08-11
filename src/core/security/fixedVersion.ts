import type { OSVVulnerability } from './types';

function compareSemVer(v1: string, v2: string): number {
  const parse = (v: string) => {
    const clean = v.startsWith('v') ? v.slice(1) : v;
    const parts = clean.split(/[-+]/)[0].split('.').map(s => parseInt(s, 10) || 0);
    return [parts[0] || 0, parts[1] || 0, parts[2] || 0];
  };
  const [m1, i1, p1] = parse(v1);
  const [m2, i2, p2] = parse(v2);
  if (m1 !== m2) return m1 - m2;
  if (i1 !== i2) return i1 - i2;
  return p1 - p2;
}

export function findRecommendedFixedVersion(vuln: OSVVulnerability, resolvedVersion: string, packageName: string, ecosystem: string): string | undefined {
  if (!vuln.affected) return undefined;

  for (const affected of vuln.affected) {
    if (affected.package.name === packageName && affected.package.ecosystem.toLowerCase() === ecosystem.toLowerCase()) {
      if (affected.ranges) {
        for (const range of affected.ranges) {
          if (range.type === 'SEMVER') {
            let currentIntroduced = '0.0.0';
            let currentFixed: string | undefined = undefined;

            // Events are typically ordered: [introduced, fixed, introduced, fixed...]
            for (let i = 0; i < range.events.length; i++) {
              const event = range.events[i];
              
              if (event.introduced !== undefined) {
                currentIntroduced = event.introduced === '0' ? '0.0.0' : event.introduced;
                currentFixed = undefined;
              } else if (event.fixed !== undefined) {
                currentFixed = event.fixed;
              }

              // Check if we are at the end of an interval (next event is introduced or end of array)
              const isEndOfInterval = i === range.events.length - 1 || range.events[i + 1].introduced !== undefined;
              
              if (isEndOfInterval) {
                const isAfterOrEqualIntroduced = compareSemVer(resolvedVersion, currentIntroduced) >= 0;
                const isBeforeFixed = currentFixed ? compareSemVer(resolvedVersion, currentFixed) < 0 : true;

                if (isAfterOrEqualIntroduced && isBeforeFixed) {
                  return currentFixed; // Found the specific fix for this vulnerable interval
                }
              }
            }
          }
        }
      }
    }
  }

  return undefined;
}
