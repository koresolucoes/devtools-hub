import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, AlertTriangle, AlertCircle, HelpCircle } from 'lucide-react';
import styles from './HealthDashboard.module.css';

const HealthGauge = ({ score, confidence }) => {
  const { t } = useTranslation('project_doctor');
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
        <div className={styles.confidenceWarning} title={t('low_confidence')}>
          <HelpCircle size={14} /> {t('low_confidence')}
        </div>
      )}
    </div>
  );
};

const CategoryScore = ({ name, result }) => {
  const { t } = useTranslation('project_doctor');
  let icon = <CheckCircle size={20} color="var(--success)" />;
  let valueColor = 'var(--success)';
  
  if (result.score === null) {
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
        {result.score === null ? t('na') : `${result.score}%`}
      </div>
    </div>
  );
};

export default function HealthDashboard({ health }) {
  const { t } = useTranslation('project_doctor');
  let shipColor = 'var(--success)';
  let ShipIcon = CheckCircle;
  let shipText = t('ready_to_ship');
  
  if (health.shipStatus === 'not-ready') {
    shipColor = 'var(--danger)';
    ShipIcon = AlertCircle;
    shipText = t('not_ready');
  } else if (health.shipStatus === 'ready-with-warnings') {
    shipColor = 'var(--warning)';
    ShipIcon = AlertTriangle;
    shipText = t('ready_warnings');
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.mainScore}>
        <h3>{t('project_health')}</h3>
        <HealthGauge score={health.score} confidence={health.analysisConfidence} />
        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: shipColor, fontWeight: 'bold' }}>
          <ShipIcon size={20} />
          {shipText}
        </div>
        <p className={styles.scoreDescription}>
          {t('score_description', { coverage: health.coverage?.checkCoverage ?? 100 })}
        </p>
      </div>

      <div className={styles.categories}>
        <CategoryScore name={t('quality')} result={health.categories.quality} />
        <CategoryScore name={t('security')} result={health.categories.security} />
        <CategoryScore name={t('architecture')} result={health.categories.architecture} />
        <CategoryScore name={t('dependencies')} result={health.categories.dependencies} />
        <CategoryScore name={t('build')} result={health.categories.build} />
        <CategoryScore name={t('deployment_readiness')} result={health.categories.deployment} />
        <CategoryScore name={t('ci_cd')} result={health.categories.ci} />
      </div>
    </div>
  );
}
