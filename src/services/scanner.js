import { DEPENDENCY_PARSERS } from '../core/dependencies/index';

// OSV API endpoint
const OSV_API_URL = 'https://api.osv.dev/v1/querybatch';

export function extractDependencies(textContent, fileName = 'package.json') {
  const parser = DEPENDENCY_PARSERS[fileName];
  if (!parser) {
    console.error(`No parser found for ${fileName}`);
    return [];
  }
  return parser.parse(textContent);
}

/**
 * Scan dependencies against OSV database
 */
export async function scanDependencies(dependencies) {
  const queries = dependencies.map(dep => ({
    package: {
      name: dep.name,
      ecosystem: dep.ecosystem
    },
    version: dep.version
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
    let maxSeverity = 'UNKNOWN';
    const severityScores = { 'CRITICAL': 5, 'HIGH': 4, 'MODERATE': 3, 'MEDIUM': 3, 'LOW': 2, 'UNKNOWN': 1 };
    
    result.vulns.forEach(vuln => {
      let currentSeverity = 'UNKNOWN';

      if (vuln.database_specific && vuln.database_specific.severity) {
        currentSeverity = vuln.database_specific.severity.toUpperCase();
      } else if (vuln.severity) {
        const cvss = vuln.severity.find(s => s.type === 'CVSS_V3' || s.type === 'CVSS_V4');
        if (cvss && cvss.score) {
          // Parse score string for base score if possible, or just default to HIGH if it has a vector
          // Actually, OSV sometimes provides `score` as the vector string. 
          // We can't parse it trivially, so if CVSS exists but no specific severity is there, 
          // we might just keep UNKNOWN, or try to guess. Let's just keep UNKNOWN if we can't parse it.
        }
      }

      if (severityScores[currentSeverity] > severityScores[maxSeverity]) {
        maxSeverity = currentSeverity;
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
