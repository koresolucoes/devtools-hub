// OSV API endpoint
const OSV_API_URL = 'https://api.osv.dev/v1/querybatch';

export function extractDependencies(textContent, fileName = 'package.json') {
  const deps = [];
  
  let ecosystem = 'npm';
  if (fileName.includes('requirements.txt') || fileName.includes('pyproject.toml') || fileName.includes('Pipfile')) {
    ecosystem = 'PyPI';
  } else if (fileName.includes('composer.json') || fileName.includes('composer.lock')) {
    ecosystem = 'Packagist';
  } else if (fileName.includes('Gemfile')) {
    ecosystem = 'RubyGems';
  }

  if (fileName.endsWith('.json')) {
    try {
      const jsonContent = JSON.parse(textContent);
      const rawDeps = {};
      if (jsonContent.dependencies) Object.assign(rawDeps, jsonContent.dependencies);
      if (jsonContent.devDependencies) Object.assign(rawDeps, jsonContent.devDependencies);
      
      if (jsonContent.packages) {
        for (const [path, pkg] of Object.entries(jsonContent.packages)) {
          if (path && pkg.name && pkg.version) rawDeps[pkg.name] = pkg.version;
        }
      } else if (jsonContent.dependencies && jsonContent.lockfileVersion) {
        for (const [name, pkg] of Object.entries(jsonContent.dependencies)) {
          rawDeps[name] = pkg.version;
        }
      }

      for (const [name, version] of Object.entries(rawDeps)) {
        const cleanMatch = version.match(/(\d+\.\d+\.\d+)/);
        const cleanVersion = cleanMatch ? cleanMatch[1] : version.replace(/[\^~>=<]/g, '').trim();
        if (name && cleanVersion) deps.push({ name, version: cleanVersion, ecosystem });
      }
    } catch(e) {
      console.error('Invalid JSON', e);
    }
  } else if (fileName.includes('requirements.txt')) {
    const lines = textContent.split('\n');
    for (const line of lines) {
      const cleanLine = line.split('#')[0].trim();
      if (!cleanLine) continue;
      const match = cleanLine.match(/^([a-zA-Z0-9_\-]+).*?([0-9\.]+)$/);
      if (match) {
        deps.push({ name: match[1], version: match[2], ecosystem });
      }
    }
  }

  return deps;
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
      if (vuln.severity) {
        const cvss = vuln.severity.find(s => s.type === 'CVSS_V3');
        if (cvss) {
          const scoreMatch = cvss.score.match(/CVSS:3.\d\/.*?\/.*?(?:[A-Z]:[A-Z]+\/)*.*?/);
        }
      }
      
      if (vuln.database_specific && vuln.database_specific.severity) {
        const sev = vuln.database_specific.severity.toUpperCase();
        if (severityScores[sev] > severityScores[maxSeverity]) {
          maxSeverity = sev;
        }
      } else {
        // Keeps UNKNOWN if no specific severity found
        if (severityScores['UNKNOWN'] > severityScores[maxSeverity]) {
          maxSeverity = 'UNKNOWN';
        }
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
