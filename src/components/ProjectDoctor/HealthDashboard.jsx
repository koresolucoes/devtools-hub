import React from 'react';
import { Shield, ShieldAlert, ShieldCheck, Activity, CheckCircle, AlertTriangle, AlertCircle, HelpCircle } from 'lucide-react';
import styles from './HealthDashboard.module.css';

const HealthGauge = ({ score, confidence }) => {
  let color = 'var(--danger)';
  if (score >= 80) color = 'var(--success)';
  else if (score >= 50) color = 'var(--warning)';

  const offset = 283 - (283 * score) / 100;

  return (
    <div className={styles.gaugeContainer}>
      <svg className={styles.gauge} viewBox="0 0 100 100">
        <circle className={styles.gaugeBg} cx="50" cy="50" r="45" />
        <circle 
          className={styles.gaugeFill} 
          cx="50" cy="50" r="45" 
          style={{ strokeDashoffset: offset, stroke: color }} 
        />
      </svg>
      <div className={styles.gaugeText}>
        <span className={styles.gaugeScore}>{score}</span>
        <span className={styles.gaugeLabel}>/ 100</span>
      </div>
      {confidence < 70 && (
        <div className={styles.confidenceWarning} title="Low analysis confidence due to missing or unsupported files">
          <HelpCircle size={14} /> Low Confidence
        </div>
      )}
    </div>
  );
};

const CategoryScore = ({ name, result }) => {
  let icon = <CheckCircle size={20} color="var(--success)" />;
  let valueColor = 'var(--success)';
  
  if (result.status === 'insufficient-data') {
    icon = <HelpCircle size={20} color="var(--text-tertiary)" />;
    valueColor = 'var(--text-tertiary)';
  } else if (result.score < 50) {
    icon = <AlertCircle size={20} color="var(--danger)" />;
    valueColor = 'var(--danger)';
  } else if (result.score < 80) {
    icon = <AlertTriangle size={20} color="var(--warning)" />;
    valueColor = 'var(--warning)';
  }

  return (
    <div className={styles.categoryCard}>
      <div className={styles.categoryHeader}>
        {icon}
        <span className={styles.categoryName}>{name}</span>
      </div>
      <div className={styles.categoryValue} style={{ color: valueColor }}>
        {result.status === 'insufficient-data' ? 'N/A' : `${result.score}%`}
      </div>
    </div>
  );
};

export default function HealthDashboard({ health, project }) {
  return (
    <div className={styles.dashboard}>
      <div className={styles.mainScore}>
        <h3>Project Health</h3>
        <HealthGauge score={health.score} confidence={health.confidence} />
        <p className={styles.scoreDescription}>
          Based on architecture, dependencies, security, and quality rules.
        </p>
      </div>

      <div className={styles.categories}>
        <CategoryScore name="Quality" result={health.categories.quality} />
        <CategoryScore name="Security" result={health.categories.security} />
        <CategoryScore name="Build" result={health.categories.build} />
        <CategoryScore name="Deployment" result={health.categories.deployment} />
        <CategoryScore name="CI / CD" result={health.categories.ci} />
        <CategoryScore name="Maintainability" result={health.categories.maintainability} />
      </div>
    </div>
  );
}
