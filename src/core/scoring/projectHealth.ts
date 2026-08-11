import type { ProjectIR } from '../project/types';
import type { CheckResult } from '../checks/types';
import type { SecurityScanSummary } from '../security/types';

export interface HealthCategoryResult {
  score: number | null;
  coverage: number;
  confidence: number;
  checksPassed: number;
  checksFailed: number;
  checksUnknown: number;
  checksNotApplicable: number;
}

export interface SecurityRiskSummary {
  risk: 'none' | 'low' | 'moderate' | 'high' | 'critical';
  criticalProduction: number;
  highProduction: number;
  moderateProduction: number;
  criticalDevelopment: number;
  highDevelopment: number;
  directAffected: number;
  transitiveAffected: number;
}

export interface CoverageMetrics {
  checkCoverage: number;
  repositoryCoverage: number;
  dependencyCoverage: number;
  securityCoverage: number;
}

export interface ProjectHealth {
  score: number;
  rating: 'excellent' | 'good' | 'warning' | 'critical';
  analysisConfidence: number;
  coverage: CoverageMetrics;
  shipStatus: 'ready' | 'ready-with-warnings' | 'not-ready' | 'unknown';
  securityRisk: SecurityRiskSummary;
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

export function calculateProjectHealth(ir: ProjectIR, checks: CheckResult[], securitySummary?: SecurityScanSummary): ProjectHealth {
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

  // Calculate SecurityRiskSummary from SEC_SUMMARY finding if present
  let hasConfirmedCriticalProductionVuln = false;
  let hasConfirmedHighProductionVuln = false;
  
  const riskSummary: SecurityRiskSummary = {
    risk: 'none',
    criticalProduction: 0,
    highProduction: 0,
    moderateProduction: 0,
    criticalDevelopment: 0,
    highDevelopment: 0,
    directAffected: 0,
    transitiveAffected: 0
  };

  const secSummaryCheck = checks.find(c => c.id === 'SEC_SUMMARY');
  if (secSummaryCheck && secSummaryCheck.finding) {
    const desc = secSummaryCheck.finding.description;
    const extractCount = (regex: RegExp) => {
      const match = desc.match(regex);
      return match ? parseInt(match[1], 10) : 0;
    };
    riskSummary.criticalProduction = extractCount(/- (\d+) critical production/);
    riskSummary.highProduction = extractCount(/- (\d+) high production/);
    riskSummary.criticalDevelopment = extractCount(/- (\d+) critical development/);
    riskSummary.directAffected = extractCount(/- (\d+) vulnerable direct dependencies/);
    riskSummary.transitiveAffected = extractCount(/- (\d+) vulnerable transitive dependencies/);
    
    if (riskSummary.criticalProduction > 0) {
      riskSummary.risk = 'critical';
      hasConfirmedCriticalProductionVuln = true;
    } else if (riskSummary.highProduction > 0 || riskSummary.criticalDevelopment > 0) {
      riskSummary.risk = 'high';
      hasConfirmedHighProductionVuln = true;
    } else if (riskSummary.directAffected > 0) {
      riskSummary.risk = 'moderate';
    } else if (riskSummary.transitiveAffected > 0) {
      riskSummary.risk = 'low';
    }
  }

  // Populate checks
  for (const check of checks) {
    if (check.id === 'SEC_SUMMARY') continue; // exclude summary from numeric average to prevent double counting
    const cat = categories[check.category as keyof typeof categories];
    if (cat) {
      if (check.status === 'pass') cat.checksPassed++;
      else if (check.status === 'fail') cat.checksFailed++;
      else if (check.status === 'unknown') cat.checksUnknown++;
      else if (check.status === 'not-applicable') cat.checksNotApplicable++;
    }
  }

  // Documented category weights
  const baseWeights: Record<keyof typeof categories, number> = {
    security: 25,
    quality: 15,
    dependencies: 15,
    build: 15,
    ci: 10,
    deployment: 10,
    architecture: 10,
    maintainability: 0 // Optional category not currently scored
  };

  let totalWeight = 0;
  let weightedScoreSum = 0;

  for (const [key, cat] of Object.entries(categories)) {
    const k = key as keyof typeof categories;
    const totalEvaluated = cat.checksPassed + cat.checksFailed;
    
    // Security score is special logic
    if (k === 'security') {
      cat.score = 100;
      if (riskSummary.risk === 'critical') cat.score = 0;
      else if (riskSummary.risk === 'high') cat.score = 40;
      else if (riskSummary.risk === 'moderate') cat.score = 70;
      else if (riskSummary.risk === 'low') cat.score = 90;
      
      // If we failed to scan, score is unknown
      if (cat.checksUnknown > 0) cat.score = null;
    } else if (totalEvaluated > 0) {
      cat.score = Math.round((cat.checksPassed / totalEvaluated) * 100);
    } else {
      cat.score = null;
    }

    if (totalEvaluated > 0 || cat.checksUnknown > 0) {
      cat.coverage = Math.round((totalEvaluated / (totalEvaluated + cat.checksUnknown)) * 100);
    }

    if (cat.score !== null) {
      totalWeight += baseWeights[k];
      weightedScoreSum += cat.score * baseWeights[k];
    }
  }

  const finalScore = totalWeight > 0 ? weightedScoreSum / totalWeight : 100;

  let rating: ProjectHealth['rating'] = 'excellent';
  if (finalScore < 50) rating = 'critical';
  else if (finalScore < 75) rating = 'warning';
  else if (finalScore < 90) rating = 'good';

  // Calculate separate coverages
  const globalTotalEvaluated = Object.values(categories).reduce((acc, cat) => acc + cat.checksPassed + cat.checksFailed, 0);
  const globalTotalUnknown = Object.values(categories).reduce((acc, cat) => acc + cat.checksUnknown, 0);
  const checkCoverage = (globalTotalEvaluated + globalTotalUnknown) > 0 
    ? Math.round((globalTotalEvaluated / (globalTotalEvaluated + globalTotalUnknown)) * 100) 
    : 100;

  let repositoryCoverage = 100;
  if (ir.analysis.metrics && ir.analysis.metrics.repositoryFiles > 0) {
    // Just a placeholder metric.
    repositoryCoverage = 90; 
  }

  const dependencyCoverage = categories.dependencies.coverage || 100;
  
  let securityCoverage = 100;
  if (categories.security.checksUnknown > 0) {
    securityCoverage = 0; // complete failure
  } else if (securitySummary && securitySummary.status === 'partial') {
    securityCoverage = securitySummary.resolvedDependencies > 0 ? 
      Math.round((securitySummary.successfulQueries / securitySummary.resolvedDependencies) * 100) : 0;
  }

  const coverage: CoverageMetrics = {
    checkCoverage,
    repositoryCoverage,
    dependencyCoverage,
    securityCoverage
  };

  let analysisConfidence = (checkCoverage + repositoryCoverage + dependencyCoverage + securityCoverage) / 4;
  if (ir.analysis.partial) analysisConfidence -= 20;
  if (ir.analysis.warnings.length > 0) analysisConfidence -= (ir.analysis.warnings.length * 5);
  analysisConfidence = Math.max(0, Math.min(100, Math.round(analysisConfidence)));

  let shipStatus: ProjectHealth['shipStatus'] = 'ready';
  if (hasConfirmedCriticalProductionVuln) {
    shipStatus = 'not-ready';
  } else if (hasConfirmedHighProductionVuln) {
    shipStatus = 'ready-with-warnings';
  } else if (finalScore < 75) {
    shipStatus = 'ready-with-warnings';
  }

  return {
    score: Math.round(finalScore),
    rating,
    analysisConfidence,
    coverage,
    shipStatus,
    securityRisk: riskSummary,
    categories
  };
}
