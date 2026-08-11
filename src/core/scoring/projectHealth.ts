import type { ProjectIR } from '../project/types';
import type { Finding } from '../rules/types';

export interface HealthCategoryResult {
  score: number;
  status: 'scored' | 'insufficient-data';
}

export interface ProjectHealth {
  score: number;
  rating: 'excellent' | 'good' | 'warning' | 'critical';
  confidence: number;
  categories: {
    build: HealthCategoryResult;
    security: HealthCategoryResult;
    quality: HealthCategoryResult;
    ci: HealthCategoryResult;
    deployment: HealthCategoryResult;
    maintainability: HealthCategoryResult;
  };
}

export function calculateProjectHealth(ir: ProjectIR, findings: Finding[]): ProjectHealth {
  // Weights (Relative)
  const WEIGHTS = {
    build: 20,
    security: 25,
    quality: 15,
    ci: 15,
    deployment: 10,
    maintainability: 15
  };

  const categories: Record<keyof typeof WEIGHTS, HealthCategoryResult> = {
    build: { score: 100, status: 'scored' },
    security: { score: 100, status: 'scored' },
    quality: { score: 100, status: 'scored' },
    ci: { score: 100, status: 'scored' },
    deployment: { score: 100, status: 'scored' },
    maintainability: { score: 100, status: 'scored' }
  };

  // Determine insufficient data
  if (!ir.manifests.length && !ir.scripts.build) categories.build.status = 'insufficient-data';
  if (!ir.infrastructure.ci) categories.ci.status = 'insufficient-data';
  if (!ir.infrastructure.deployments.length) categories.deployment.status = 'insufficient-data';
  if (ir.dependencies.length === 0) categories.security.status = 'insufficient-data';
  if (ir.quality.tests.length === 0 && ir.quality.linters.length === 0) categories.quality.status = 'insufficient-data';

  // Penalties
  for (const finding of findings) {
    const cat = finding.category as keyof typeof categories;
    if (categories[cat]) {
      let penalty = 0;
      switch (finding.severity) {
        case 'critical': penalty = 50; break;
        case 'high': penalty = 30; break;
        case 'medium': penalty = 15; break;
        case 'low': penalty = 5; break;
        case 'info': penalty = 0; break;
      }
      categories[cat].score = Math.max(0, categories[cat].score - penalty);
      // If we got a finding, we force status to scored as we have evidence
      categories[cat].status = 'scored';
    }
  }

  let totalScore = 0;
  let totalWeight = 0;

  for (const [key, catResult] of Object.entries(categories)) {
    const cat = key as keyof typeof WEIGHTS;
    if (catResult.status === 'scored') {
      totalScore += catResult.score * WEIGHTS[cat];
      totalWeight += WEIGHTS[cat];
    }
  }

  // Normalize final score to 100 based on active weights
  const finalScore = totalWeight > 0 ? (totalScore / totalWeight) : 100;

  let confidence = 100;
  if (ir.analysis.partial) confidence -= 20;
  if (ir.languages.length === 0) confidence -= 30;
  if (ir.analysis.warnings.length > 0) confidence -= 10;
  
  // Decrease confidence based on how many categories are insufficient
  const insufficientCount = Object.values(categories).filter(c => c.status === 'insufficient-data').length;
  confidence -= (insufficientCount * 5);

  confidence = Math.max(0, Math.min(100, confidence));

  let rating: ProjectHealth['rating'] = 'excellent';
  if (finalScore < 50) rating = 'critical';
  else if (finalScore < 75) rating = 'warning';
  else if (finalScore < 90) rating = 'good';

  return {
    score: Math.round(finalScore),
    rating,
    confidence: Math.round(confidence),
    categories
  };
}
