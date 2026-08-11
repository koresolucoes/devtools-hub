import type { ProjectIR } from '../project/types';
import type { CheckResult } from '../checks/types';

export interface HealthCategoryResult {
  score: number | null;
  coverage: number;
  confidence: number;
  checksPassed: number;
  checksFailed: number;
  checksUnknown: number;
  checksNotApplicable: number;
}

export interface ProjectHealth {
  score: number;
  rating: 'excellent' | 'good' | 'warning' | 'critical';
  confidence: number;
  coverage: number;
  shipStatus: 'ready' | 'ready-with-warnings' | 'not-ready' | 'unknown';
  categories: {
    build: HealthCategoryResult;
    security: HealthCategoryResult;
    quality: HealthCategoryResult;
    ci: HealthCategoryResult;
    deployment: HealthCategoryResult;
    maintainability: HealthCategoryResult;
    architecture: HealthCategoryResult;
    dependencies: HealthCategoryResult;
  };
}

export function calculateProjectHealth(ir: ProjectIR, checks: CheckResult[]): ProjectHealth {
  const categories: Record<keyof ProjectHealth['categories'], HealthCategoryResult> = {
    build: createEmptyCategory(),
    security: createEmptyCategory(),
    quality: createEmptyCategory(),
    ci: createEmptyCategory(),
    deployment: createEmptyCategory(),
    maintainability: createEmptyCategory(),
    architecture: createEmptyCategory(),
    dependencies: createEmptyCategory()
  };

  function createEmptyCategory(): HealthCategoryResult {
    return { score: null, coverage: 0, confidence: 100, checksPassed: 0, checksFailed: 0, checksUnknown: 0, checksNotApplicable: 0 };
  }

  // Populate checks
  for (const check of checks) {
    const cat = categories[check.category as keyof typeof categories];
    if (cat) {
      if (check.status === 'pass') cat.checksPassed++;
      else if (check.status === 'fail') cat.checksFailed++;
      else if (check.status === 'unknown') cat.checksUnknown++;
      else if (check.status === 'not-applicable') cat.checksNotApplicable++;
    }
  }

  // Calculate scores per category
  let totalScore = 0;
  let totalCategoriesScored = 0;
  let hasConfirmedCriticalProductionVuln = false;

  for (const [, cat] of Object.entries(categories)) {
    const totalEvaluated = cat.checksPassed + cat.checksFailed;
    if (totalEvaluated > 0) {
      cat.score = Math.round((cat.checksPassed / totalEvaluated) * 100);
      cat.coverage = Math.round((totalEvaluated / (totalEvaluated + cat.checksUnknown)) * 100);
      totalScore += cat.score;
      totalCategoriesScored++;
    } else {
      cat.score = null;
      cat.coverage = 0;
    }
  }

  // Analyze checks for ship status
  for (const check of checks) {
    if (check.category === 'security' && check.status === 'fail' && check.finding?.severity === 'critical') {
      // Check if it's production (direct or transitive, but not dev)
      // Since we don't have deep context here in check finding, we can assume critical security failure affects shipStatus.
      // A more detailed implementation would inspect check.evidence.
      const isDevOnly = check.evidence?.every(e => e.path === 'devDependencies');
      if (!isDevOnly) {
        hasConfirmedCriticalProductionVuln = true;
      }
    }
  }

  const finalScore = totalCategoriesScored > 0 ? totalScore / totalCategoriesScored : 100;
  let rating: ProjectHealth['rating'] = 'excellent';
  if (finalScore < 50) rating = 'critical';
  else if (finalScore < 75) rating = 'warning';
  else if (finalScore < 90) rating = 'good';

  let confidence = 100;
  if (ir.analysis.partial) confidence -= 20;
  if (ir.analysis.warnings.length > 0) confidence -= (ir.analysis.warnings.length * 5);
  confidence = Math.max(0, Math.min(100, confidence));

  let shipStatus: ProjectHealth['shipStatus'] = 'ready';
  if (hasConfirmedCriticalProductionVuln) {
    shipStatus = 'not-ready';
  } else if (finalScore < 75) {
    shipStatus = 'ready-with-warnings';
  }

  return {
    score: Math.round(finalScore),
    rating,
    confidence,
    coverage: totalCategoriesScored > 0 ? 100 : 0, // Simplified global coverage for now
    shipStatus,
    categories
  };
}
