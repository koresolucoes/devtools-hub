import type { Dependency } from '../project/types';
import type { OSVQuery, OSVBatchResponse, OSVVulnerability, DependencyVulnerability, SecurityScanSummary } from './types';
import { normalizeSeverity } from './normalizeVulnerability';
import { findRecommendedFixedVersion } from './fixedVersion';

const OSV_API_URL = 'https://api.osv.dev/v1/querybatch';

export async function scanDependencies(dependencies: Dependency[]): Promise<{ vulnerabilities: DependencyVulnerability[], summary: SecurityScanSummary }> {
  const summary: SecurityScanSummary = {
    status: 'complete',
    totalDependencies: dependencies.length,
    resolvedDependencies: 0,
    queriedDependencies: 0,
    successfulQueries: 0,
    failedQueries: 0,
    affectedPackageVersions: 0,
    advisories: 0
  };

  const uniqueQueries = new Map<string, { query: OSVQuery; deps: Dependency[] }>();

  for (const dep of dependencies) {
    if (dep.resolutionStatus === 'resolved' && dep.resolvedVersion) {
      summary.resolvedDependencies++;
      const key = `${dep.ecosystem}:${dep.name}:${dep.resolvedVersion}`;
      if (!uniqueQueries.has(key)) {
        uniqueQueries.set(key, {
          query: {
            package: {
              name: dep.name,
              ecosystem: dep.ecosystem === 'npm' ? 'npm' : 'PyPI'
            },
            version: dep.resolvedVersion
          },
          deps: []
        });
      }
      uniqueQueries.get(key)!.deps.push(dep);
    }
  }

  const queryItems = Array.from(uniqueQueries.values());
  const queries = queryItems.map(q => q.query);
  summary.queriedDependencies = queries.length;

  if (queries.length === 0) {
    summary.status = 'skipped';
    return { vulnerabilities: [], summary };
  }

  const chunkSize = 500;
  const rawResults: { deps: Dependency[]; slimVulns: { id: string }[] }[] = [];
  let apiFailed = false;

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
      summary.successfulQueries += chunk.length;
      
      for (let index = 0; index < data.results.length; index++) {
        const result = data.results[index];
        if (result.vulns && result.vulns.length > 0) {
          rawResults.push({
            deps: queryItems[i + index].deps,
            slimVulns: result.vulns
          });
        }
      }
    } catch (error) {
      console.error("Error querying OSV API:", error);
      summary.failedQueries += chunk.length;
      apiFailed = true;
    }
  }

  if (apiFailed) {
    summary.status = summary.successfulQueries > 0 ? 'partial' : 'failed';
  }

  // Deduplicate detailed fetches
  const uniqueVulnIds = new Set<string>();
  const affectedKeys = new Set<string>();

  for (const res of rawResults) {
    for (const dep of res.deps) {
      affectedKeys.add(`${dep.ecosystem}:${dep.name}:${dep.resolvedVersion}`);
    }
    for (const v of res.slimVulns) {
      uniqueVulnIds.add(v.id);
    }
  }
  
  summary.affectedPackageVersions = affectedKeys.size;
  summary.advisories = uniqueVulnIds.size;

  const detailedVulns = new Map<string, OSVVulnerability>();
  
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

  const finalVulns: DependencyVulnerability[] = [];

  for (const res of rawResults) {
    for (const slim of res.slimVulns) {
      const detail = detailedVulns.get(slim.id);
      if (detail) {
        for (const dep of res.deps) {
          if (dep.resolvedVersion) {
            const fixed = findRecommendedFixedVersion(detail, dep.resolvedVersion, dep.name, dep.ecosystem);
            
            finalVulns.push({
              advisoryId: detail.id,
              packageName: dep.name,
              resolvedVersion: dep.resolvedVersion,
              ecosystem: dep.ecosystem,
              severity: normalizeSeverity(detail),
              direct: dep.direct,
              dev: dep.dev,
              transitive: dep.transitive,
              summary: detail.summary || detail.id || 'Security vulnerability',
              sourceUrl: detail.references?.[0]?.url || `https://osv.dev/vulnerability/${detail.id}`,
              fixedVersion: fixed
            });
          }
        }
      }
    }
  }

  return { vulnerabilities: finalVulns, summary };
}
