import type { PipelineIR, PipelineHealthStats } from '../types';

export function calculateHealthScore(ir: PipelineIR): PipelineHealthStats {
  let secScore = 50, relScore = 50, perfScore = 50, mainScore = 50;
  const securityReasons: string[] = [];
  const reliabilityReasons: string[] = [];
  const performanceReasons: string[] = [];
  const maintainabilityReasons: string[] = [];

  // Security (30%)
  if (ir.permissions && ir.permissions.contents === 'read') {
    secScore += 30;
    securityReasons.push('✓ Read-only contents permission');
  } else {
    securityReasons.push('⚠ Write permissions detected');
  }
  
  if (ir.envVars.every(v => v.scope !== 'global' || v.type !== 'Secret')) {
    secScore += 20;
    securityReasons.push('✓ Secrets scoped locally (Least-privilege)');
  } else {
    securityReasons.push('⚠ Global secrets detected');
  }

  // Reliability (30%)
  if (ir.linting) { relScore += 20; reliabilityReasons.push('✓ Linting step active'); }
  else { reliabilityReasons.push('⚠ No linting step configured'); }
  if (ir.testing) { relScore += 20; reliabilityReasons.push('✓ Test suite active'); }
  else { reliabilityReasons.push('⚠ No testing step configured'); }
  if (ir.runtimeStrategy === 'matrix') { relScore += 10; reliabilityReasons.push('✓ Matrix testing configured'); }
  else { reliabilityReasons.push('⚠ Single runtime execution'); }

  // Performance (20%)
  if (ir.caching) { perfScore += 30; performanceReasons.push('✓ Dependency caching active'); }
  else { performanceReasons.push('⚠ No dependency caching'); }
  if (ir.concurrency) { perfScore += 20; performanceReasons.push('✓ Concurrency cancellation active'); }
  else { performanceReasons.push('⚠ No concurrency limits'); }

  // Maintainability (20%)
  if (['pnpm', 'uv', 'bun'].includes(ir.packageManager)) {
    mainScore += 30;
    maintainabilityReasons.push('✓ Modern/Fast package manager detected');
  } else {
    maintainabilityReasons.push('⚠ Legacy package manager');
  }
  if (ir.containerize && ir.dockerPlatforms.includes(',')) {
    mainScore += 20;
    maintainabilityReasons.push('✓ Multi-arch Docker build setup');
  } else if (ir.containerize) {
    maintainabilityReasons.push('⚠ Single-arch Docker build');
  } else {
    maintainabilityReasons.push('✓ Standard deployment strategy');
  }

  // Clamp 0-100
  secScore = Math.min(100, Math.max(0, secScore));
  relScore = Math.min(100, Math.max(0, relScore));
  perfScore = Math.min(100, Math.max(0, perfScore));
  mainScore = Math.min(100, Math.max(0, mainScore));

  const finalScore = Math.round((secScore * 0.3) + (relScore * 0.3) + (perfScore * 0.2) + (mainScore * 0.2));

  let ratingLabel = 'Needs Improvement';
  if (finalScore >= 90) ratingLabel = 'Production Ready';
  else if (finalScore >= 75) ratingLabel = 'Good Quality';
  else if (finalScore >= 60) ratingLabel = 'Fair';

  return {
    score: finalScore,
    ratingLabel,
    breakdown: {
      security: { score: secScore, reasons: securityReasons },
      reliability: { score: relScore, reasons: reliabilityReasons },
      performance: { score: perfScore, reasons: performanceReasons },
      maintainability: { score: mainScore, reasons: maintainabilityReasons }
    }
  };
}
