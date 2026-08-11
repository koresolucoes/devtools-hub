import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, Info, ArrowRight, Code, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from './FindingsList.module.css';

const SeverityBadge = ({ severity = 'unknown' }) => {
  let colorClass = styles.severityLow;
  let Icon = Info;
  
  if (severity === 'critical') {
    colorClass = styles.severityCritical;
    Icon = ShieldAlert;
  } else if (severity === 'high') {
    colorClass = styles.severityHigh;
    Icon = AlertTriangle;
  } else if (severity === 'moderate') {
    colorClass = styles.severityMedium;
    Icon = AlertTriangle;
  }

  return (
    <span className={`${styles.badge} ${colorClass}`}>
      <Icon size={14} /> {severity.toUpperCase()}
    </span>
  );
};

const FindingCard = ({ finding }) => {
  const { t } = useTranslation('project_doctor');
  const [copied, setCopied] = useState(false);

  const handleCopyAgentPrompt = () => {
    const remediationText = typeof finding.remediation === 'string' 
      ? finding.remediation 
      : finding.remediation?.summary || 'Fix the issue.';

    const prompt = `---
[PROJECT CONTEXT]
Please fix the following issue in my repository.

[ISSUE DETAILS]
- Finding: ${finding.title}
- Category: ${finding.category}
- Impact: ${finding.impact || 'N/A'}

[EVIDENCE]
${finding.evidence ? finding.evidence.map(e => `- ${e.value ? e.value + ': ' : ''}${e.message}`).join('\n') : 'N/A'}

[REMEDIATION CONSTRAINTS]
${remediationText}
---`;
    
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderRemediation = () => {
    if (!finding.remediation) return null;
    
    if (typeof finding.remediation === 'string') {
      return <p className={styles.remediationSummary}>{finding.remediation}</p>;
    }

    return (
      <>
        <p className={styles.remediationSummary}>{finding.remediation.summary}</p>
        {finding.remediation.steps && finding.remediation.steps.length > 0 && (
          <div className={styles.remediationSteps}>
            {finding.remediation.steps.map((inst, i) => (
              <div key={i} className={styles.step}>
                <div className={styles.stepNumber}>{i + 1}</div>
                <div className={styles.stepText}>{inst}</div>
              </div>
            ))}
          </div>
        )}
      </>
    );
  };

  return (
    <div className={styles.findingCard}>
      <div className={styles.findingHeader}>
        <div className={styles.findingTitleGroup}>
          <SeverityBadge severity={finding.severity} />
          <h4 className={styles.findingTitle}>{finding.title}</h4>
        </div>
        <span className={styles.findingCategory}>{(finding.category).toUpperCase()}</span>
      </div>
      
      <p className={styles.findingDescription}>{finding.description}</p>
      
      {finding.impact && (
        <div className={styles.impact}>
          <strong>{t('impact', 'Impact')}:</strong> {finding.impact}
        </div>
      )}

      {finding.evidence && finding.evidence.length > 0 && (
        <div className={styles.evidenceContainer}>
          <div className={styles.evidenceTitle}>{t('evidence', 'Evidence')}</div>
          <ul className={styles.evidenceList}>
            {finding.evidence.map((ev, idx) => (
              <li key={idx}>
                {ev.file && <code className={styles.evidenceFile}>{ev.file}</code>}
                {ev.value && <strong className={styles.evidenceValue}>{ev.value}</strong>}
                <span>{ev.message}</span>
                {ev.path && <span className={styles.evidencePath}>({ev.path})</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {finding.remediation && (
        <div className={styles.remediation}>
          <div className={styles.remediationHeader}>
            <Code size={16} /> {t('suggested_fix', 'Suggested Fix')}
          </div>
          {renderRemediation()}
          
          <button className={styles.exportAgentButton} onClick={handleCopyAgentPrompt}>
            {copied ? <Check size={14} /> : t('prepare_coding_agent', 'Prepare for Coding Agent')}
            {!copied && <ArrowRight size={14} />}
          </button>
        </div>
      )}
    </div>
  );
};

export default function FindingsList({ findings }) {
  const { t } = useTranslation('project_doctor');
  if (!findings || findings.length === 0) {
    return (
      <div className={styles.emptyState}>
        <ShieldAlert size={48} className={styles.emptyIcon} />
        <h3>{t('no_issues_found', 'No issues found!')}</h3>
        <p>{t('project_in_great_shape', 'Your project is in great shape.')}</p>
      </div>
    );
  }

  // Sort by severity (critical > high > moderate > low)
  const severityOrder = { critical: 0, high: 1, moderate: 2, low: 3, unknown: 4 };
  const sortedFindings = [...findings].sort((a, b) => (severityOrder[a.severity] || 4) - (severityOrder[b.severity] || 4));

  return (
    <div className={styles.list}>
      {sortedFindings.map(finding => (
        <FindingCard key={finding.id} finding={finding} />
      ))}
    </div>
  );
}
