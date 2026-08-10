// OSV API endpoint
const OSV_API_URL = 'https://api.osv.dev/v1/querybatch';

/**
 * Extracts dependencies from package.json or package-lock.json
 */
export function extractDependencies(jsonContent) {
  const deps = {};
  
  if (jsonContent.dependencies) {
    Object.assign(deps, jsonContent.dependencies);
  }
  if (jsonContent.devDependencies) {
    Object.assign(deps, jsonContent.devDependencies);
  }
  
  // For package-lock.json v2/v3
  if (jsonContent.packages) {
    for (const [path, pkg] of Object.entries(jsonContent.packages)) {
      if (path && pkg.name && pkg.version) {
        deps[pkg.name] = pkg.version;
      }
    }
  } else if (jsonContent.dependencies && jsonContent.lockfileVersion) {
    // For package-lock.json v1
    for (const [name, pkg] of Object.entries(jsonContent.dependencies)) {
      deps[name] = pkg.version;
    }
  }

  // Clean up versions (remove ^, ~, >, etc.)
  const cleanedDeps = {};
  for (const [name, version] of Object.entries(deps)) {
    // Basic regex to strip semver ranges, keeping the base version
    // E.g., "^1.2.3" -> "1.2.3", "~1.2.x" -> "1.2.0" (simple fallback)
    const cleanMatch = version.match(/(\d+\.\d+\.\d+)/);
    if (cleanMatch) {
      cleanedDeps[name] = cleanMatch[1];
    } else {
      // If we can't parse it easily (like a git url), we might skip or keep as is
      cleanedDeps[name] = version.replace(/[\^~]/g, '');
    }
  }

  return cleanedDeps;
}

/**
 * Scan dependencies against OSV database
 */
export async function scanDependencies(dependencies) {
  const queries = Object.entries(dependencies).map(([name, version]) => ({
    package: {
      name,
      ecosystem: 'npm'
    },
    version
  }));

  // OSV limits batch size, usually 1000 is safe. We'll batch in chunks of 500 just in case.
  const chunkSize = 500;
  const results = [];

  for (let i = 0; i < queries.length; i += chunkSize) {
    const chunk = queries.slice(i, i + chunkSize);
    
    try {
      const response = await fetch(OSV_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ queries: chunk })
      });

      if (!response.ok) {
        throw new Error(`OSV API responded with status: ${response.status}`);
      }

      const data = await response.json();
      
      // Combine results with the original package names
      for (let index = 0; index < data.results.length; index++) {
        const result = data.results[index];
        if (result.vulns && result.vulns.length > 0) {
          // OSV querybatch only returns id and modified. We need to fetch full details.
          const fullVulns = await Promise.all(result.vulns.map(async (slimVuln) => {
            try {
              const detailRes = await fetch(`https://api.osv.dev/v1/vulns/${slimVuln.id}`);
              if (detailRes.ok) {
                return await detailRes.json();
              }
            } catch (e) {
              console.error(`Failed to fetch details for ${slimVuln.id}`, e);
            }
            return slimVuln; // fallback to slim version if fetch fails
          }));

          results.push({
            package: chunk[index].package.name,
            version: chunk[index].version,
            vulns: fullVulns
          });
        }
      }
    } catch (error) {
      console.error("Error querying OSV API:", error);
      throw error;
    }
  }

  return formatVulnerabilities(results);
}

/**
 * Format raw OSV vulnerabilities into a standardized format for our UI
 */
function formatVulnerabilities(rawResults) {
  return rawResults.map(result => {
    // Determine highest severity
    let maxSeverity = 'LOW';
    const severityScores = { 'CRITICAL': 4, 'HIGH': 3, 'MODERATE': 2, 'MEDIUM': 2, 'LOW': 1 };
    
    result.vulns.forEach(vuln => {
      // Look for CVSS score in database_specific or severity
      if (vuln.severity) {
        const cvss = vuln.severity.find(s => s.type === 'CVSS_V3');
        if (cvss) {
          // Parse score from vector if needed, or use severity type if available
          // (Simplified for this MVP)
          const scoreMatch = cvss.score.match(/CVSS:3.\d\/.*?\/.*?(?:[A-Z]:[A-Z]+\/)*.*?/); // complex, better to rely on database_specific if present
        }
      }
      
      if (vuln.database_specific && vuln.database_specific.severity) {
        const sev = vuln.database_specific.severity.toUpperCase();
        if (severityScores[sev] > severityScores[maxSeverity]) {
          maxSeverity = sev;
        }
      } else {
        // Fallback default
        maxSeverity = 'HIGH'; 
      }
    });

    if (maxSeverity === 'MEDIUM') maxSeverity = 'MODERATE';

    return {
      name: result.package,
      version: result.version,
      severity: maxSeverity.toLowerCase(),
      count: result.vulns.length,
      details: result.vulns.map(v => {
        // Encontrar a versão corrigida
        let fixedVersion = 'Desconhecida';
        if (v.affected) {
          for (const affected of v.affected) {
            if (affected.ranges) {
              for (const range of affected.ranges) {
                if (range.events) {
                  const fixedEvent = range.events.find(e => e.fixed);
                  if (fixedEvent) fixedVersion = fixedEvent.fixed;
                }
              }
            }
          }
        }
        
        const publishedDate = v.published ? new Date(v.published).toLocaleDateString('pt-BR') : 'Data não informada';
        
        return {
          id: v.id,
          summary: v.summary || v.id || 'Vulnerabilidade de segurança',
          details: v.details,
          url: v.references?.[0]?.url || `https://osv.dev/vulnerability/${v.id}`,
          fixedIn: fixedVersion,
          published: publishedDate
        };
      })
    };
  });
}
