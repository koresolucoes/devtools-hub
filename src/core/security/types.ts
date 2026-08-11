// No imports needed from project/types for now, wait, I need to check what is imported.

export interface OSVQuery {
  package: {
    name: string;
    ecosystem: string;
  };
  version?: string;
}

export interface OSVBatchResponse {
  results: {
    vulns?: OSVSlimVulnerability[];
  }[];
}

export interface OSVSlimVulnerability {
  id: string;
  modified: string;
}

export interface OSVRangeEvent {
  introduced?: string;
  fixed?: string;
  last_affected?: string;
  limit?: string;
}

export interface OSVRange {
  type: 'SEMVER' | 'ECOSYSTEM' | 'GIT';
  events: OSVRangeEvent[];
}

export interface OSVAffectedPackage {
  package: {
    ecosystem: string;
    name: string;
  };
  ranges?: OSVRange[];
  versions?: string[];
}

export interface OSVVulnerability {
  id: string;
  summary?: string;
  details?: string;
  aliases?: string[];
  modified: string;
  published: string;
  database_specific?: {
    severity?: string;
    [key: string]: any;
  };
  severity?: {
    type: 'CVSS_V3' | 'CVSS_V4';
    score: string;
  }[];
  affected?: OSVAffectedPackage[];
  references?: {
    type: string;
    url: string;
  }[];
}

export interface DependencyVulnerability {
  advisoryId: string;
  packageName: string;
  resolvedVersion: string;
  ecosystem: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'unknown';
  direct: boolean;
  dev: boolean;
  transitive: boolean;
  summary: string;
  sourceUrl?: string;
  fixedVersion?: string;
}

export interface SecurityScanSummary {
  status: 'complete' | 'partial' | 'failed' | 'skipped';
  totalDependencies: number;
  resolvedDependencies: number;
  scannedDependencies: number;
  unresolvedDependencies: number;
  directDependencies: number;
  transitiveDependencies: number;
  advisoriesFound: number;
  affectedPackages: number;
}
