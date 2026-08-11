import type { ProjectIR } from '../project/types';
import type { Finding } from '../rules/types';

export interface ProjectHealth {
  score: number;
  rating: 'excellent' | 'good' | 'warning' | 'critical';
  confidence: number;
  categories: {
    build: number;
    security: number;
    quality: number;
    ci: number;
    deployment: number;
    maintainability: number;
  };
}

export function calculateProjectHealth(ir: ProjectIR, findings: Finding[]): ProjectHealth {
  // Weights (Sum = 100)
  const WEIGHTS = {
    build: 20,
    security: 25,
    quality: 15,
    ci: 15,
    deployment: 10,
    maintainability: 15
  };

  const categories = {
    build: 100,
    security: 100,
    quality: 100,
    ci: 100,
    deployment: 100,
    maintainability: 100
  };

  // Penalties
  for (const finding of findings) {
    const cat = finding.category as keyof typeof categories;
    if (categories[cat] !== undefined) {
      let penalty = 0;
      switch (finding.severity) {
        case 'critical': penalty = 50; break;
        case 'high': penalty = 30; break;
        case 'medium': penalty = 15; break;
        case 'low': penalty = 5; break;
        case 'info': penalty = 0; break;
      }
      categories[cat] = Math.max(0, categories[cat] - penalty);
    }
  }

  let totalScore = 0;
  for (const [cat, score] of Object.entries(categories)) {
    totalScore += score * (WEIGHTS[cat as keyof typeof WEIGHTS] / 100);
  }

  let confidence = 100;
  if (ir.analysis.partial) confidence -= 20;
  if (ir.languages.length === 0) confidence -= 30;
  if (ir.analysis.warnings.length > 0) confidence -= 10;

  confidence = Math.max(0, Math.min(100, confidence));

  let rating: ProjectHealth['rating'] = 'excellent';
  if (totalScore < 50) rating = 'critical';
  else if (totalScore < 75) rating = 'warning';
  else if (totalScore < 90) rating = 'good';

  return {
    score: Math.round(totalScore),
    rating,
    confidence: Math.round(confidence),
    categories
  };
}
