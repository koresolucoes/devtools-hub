import type { Dependency } from '../project/types';
import type { OSVQuery, OSVBatchResponse, OSVVulnerability, DependencyVulnerability } from './types';
import { normalizeSeverity } from './normalizeVulnerability';
import { findRecommendedFixedVersion } from './fixedVersion';

const OSV_API_URL = 'https://api.osv.dev/v1/querybatch';

export async function scanDependencies(dependencies: Dependency[]): Promise<DependencyVulnerability[]> {
  const queries: OSVQuery[] = [];
  const queryToDepMap: Record<number, Dependency> = {};

  let queryIndex = 0;
  for (const dep of dependencies) {
    if (dep.resolutionStatus === 'resolved' && dep.resolvedVersion) {
      queries.push({
        package: {
          name: dep.name,
          ecosystem: dep.ecosystem === 'npm' ? 'npm' : 'PyPI'
        },
        version: dep.resolvedVersion
      });
      queryToDepMap[queryIndex] = dep;
      queryIndex++;
    }
  }

  if (queries.length === 0) return [];

  const chunkSize = 500;
  const rawResults: { dep: Dependency; slimVulns: { id: string }[] }[] = [];

  for (let i = 0; i < queries.length; i += chunkSize) {
    const chunk = queries.slice(i, i + chunkSize);
    
    try {
      const response = await fetch(OSV_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queries: chunk })
      });

      if (!response.ok) {
        throw new Error(`OSV API responded with status: ${response.status}`);
      }

      const data: OSVBatchResponse = await response.json();
      
      for (let index = 0; index < data.results.length; index++) {
        const result = data.results[index];
        if (result.vulns && result.vulns.length > 0) {
          rawResults.push({
            dep: queryToDepMap[i + index],
            slimVulns: result.vulns
          });
        }
      }
    } catch (error) {
      console.error("Error querying OSV API:", error);
      throw error; // Will be caught by runChecks and marked as incomplete
    }
  }

  // Deduplicate detailed fetches
  const uniqueVulnIds = new Set<string>();
  for (const res of rawResults) {
    for (const v of res.slimVulns) {
      uniqueVulnIds.add(v.id);
    }
  }

  const detailedVulns = new Map<string, OSVVulnerability>();
  
  // Fetch details with limited concurrency (e.g. 6)
  const fetchDetail = async (id: string) => {
    try {
      const res = await fetch(`https://api.osv.dev/v1/vulns/${id}`);
      if (res.ok) {
        const data = await res.json();
        detailedVulns.set(id, data);
      }
    } catch (e) {
      console.error(`Failed to fetch OSV details for ${id}`);
    }
  };

  const idsToFetch = Array.from(uniqueVulnIds);
  const concurrency = 6;
  for (let i = 0; i < idsToFetch.length; i += concurrency) {
    const batch = idsToFetch.slice(i, i + concurrency);
    await Promise.all(batch.map(fetchDetail));
  }

  // Format final vulnerabilities
  const finalVulns: DependencyVulnerability[] = [];

  for (const res of rawResults) {
    for (const slim of res.slimVulns) {
      const detail = detailedVulns.get(slim.id);
      if (detail && res.dep.resolvedVersion) {
        const fixed = findRecommendedFixedVersion(detail, res.dep.resolvedVersion, res.dep.name, res.dep.ecosystem);
        
        finalVulns.push({
          advisoryId: detail.id,
          packageName: res.dep.name,
          resolvedVersion: res.dep.resolvedVersion,
          ecosystem: res.dep.ecosystem,
          severity: normalizeSeverity(detail),
          direct: res.dep.direct,
          dev: res.dep.dev,
          transitive: res.dep.transitive,
          summary: detail.summary || detail.id || 'Security vulnerability',
          sourceUrl: detail.references?.[0]?.url || `https://osv.dev/vulnerability/${detail.id}`,
          fixedVersion: fixed
        });
      }
    }
  }

  return finalVulns;
}
