import React from 'react';
import { ShieldAlert, AlertTriangle, Info, ArrowRight, Code } from 'lucide-react';
import styles from './FindingsList.module.css';

const SeverityBadge = ({ severity }) => {
  let colorClass = styles.severityLow;
  let Icon = Info;
  
  if (severity === 'critical') {
    colorClass = styles.severityCritical;
    Icon = ShieldAlert;
  } else if (severity === 'high') {
    colorClass = styles.severityHigh;
    Icon = AlertTriangle;
  } else if (severity === 'medium') {
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
  const handleCopyAgentPrompt = () => {
    const prompt = `Please fix the following issue in my repository:
    
Issue: ${finding.title}
Category: ${finding.category}
Impact: ${finding.impact || 'N/A'}

Suggested Fix: ${finding.remediation.summary}
${finding.remediation.instructions ? '\nSteps:\n' + finding.remediation.instructions.map((i, idx) => `${idx + 1}. ${i}`).join('\n') : ''}
${finding.remediation.affectedFiles ? '\nAffected Files:\n' + finding.remediation.affectedFiles.join(', ') : ''}`;
    
    navigator.clipboard.writeText(prompt);
    alert('Copied prompt to clipboard!');
  };

  return (
    <div className={styles.findingCard}>
      <div className={styles.findingHeader}>
        <div className={styles.findingTitleGroup}>
          <SeverityBadge severity={finding.severity} />
          <h4 className={styles.findingTitle}>{finding.title}</h4>
        </div>
        <span className={styles.findingCategory}>{finding.category.toUpperCase()}</span>
      </div>
      
      <p className={styles.findingDescription}>{finding.description}</p>
      
      {finding.impact && (
        <div className={styles.impact}>
          <strong>Impact:</strong> {finding.impact}
        </div>
      )}

      {finding.evidence && finding.evidence.length > 0 && (
        <div className={styles.evidenceContainer}>
          <div className={styles.evidenceTitle}>Evidence</div>
          <ul className={styles.evidenceList}>
            {finding.evidence.map((ev, idx) => (
              <li key={idx}>
                {ev.file && <code className={styles.evidenceFile}>{ev.file}</code>}
                <span>{ev.message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {finding.remediation && (
        <div className={styles.remediation}>
          <div className={styles.remediationHeader}>
            <Code size={16} /> Suggested Fix
          </div>
          <p className={styles.remediationSummary}>{finding.remediation.summary}</p>
          
          {finding.remediation.instructions && finding.remediation.instructions.length > 0 && (
            <div className={styles.remediationSteps}>
              {finding.remediation.instructions.map((inst, i) => (
                <div key={i} className={styles.step}>
                  <div className={styles.stepNumber}>{i + 1}</div>
                  <div className={styles.stepText}>{inst}</div>
                </div>
              ))}
            </div>
          )}
          
          <button className={styles.exportAgentButton} onClick={handleCopyAgentPrompt}>
            Prepare for Coding Agent <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default function FindingsList({ findings }) {
  if (!findings || findings.length === 0) {
    return (
      <div className={styles.emptyState}>
        <ShieldAlert size={48} className={styles.emptyIcon} />
        <h3>No issues found!</h3>
        <p>Your project is in great shape.</p>
      </div>
    );
  }

  // Sort by severity (critical > high > medium > low)
  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  const sortedFindings = [...findings].sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return (
    <div className={styles.list}>
      {sortedFindings.map(finding => (
        <FindingCard key={finding.id} finding={finding} />
      ))}
    </div>
  );
}
