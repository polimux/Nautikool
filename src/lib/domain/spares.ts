import type { MaintenanceSeverity, MaintenanceSystem } from './maintenance';

export type SparePriority = 'critical' | 'recommended' | 'nice-to-have';
export type SpareStatus = 'onboard' | 'missing' | 'unknown';

export interface SpareRequirement {
  id: string;
  vesselId: string;
  system: MaintenanceSystem;
  title: string;
  whyItMatters: string;
  priority: SparePriority;
  status: SpareStatus;
  minimumQuantity: number;
  onboardQuantity?: number;
  usedFor: string[];
  relatedMaintenanceTaskIds: string[];
  stowage?: string;
  skipperAction: string;
  tags: string[];
}

export interface SpareFinding {
  spareId: string;
  system: MaintenanceSystem;
  severity: MaintenanceSeverity;
  status: SpareStatus | 'insufficient';
  text: string;
  skipperAction: string;
}

export interface SpareReadinessSummary {
  spareCount: number;
  criticalSpares: number;
  missingCriticalSpares: number;
  unknownCriticalSpares: number;
  cautionFindings: number;
  blockerFindings: number;
  systemsCovered: MaintenanceSystem[];
  canDepart: boolean;
  firstBlocker?: string;
  nextActions: string[];
}

function findingSeverity(spare: SpareRequirement, status: SpareFinding['status']): MaintenanceSeverity {
  if (spare.priority === 'critical' && (status === 'missing' || status === 'unknown' || status === 'insufficient')) {
    return 'blocker';
  }

  if (spare.priority === 'recommended' && status !== 'onboard') {
    return 'caution';
  }

  if (status === 'insufficient') {
    return 'caution';
  }

  return 'info';
}

function inferSpareFindingStatus(spare: SpareRequirement): SpareFinding['status'] | undefined {
  if (spare.status === 'missing' || spare.status === 'unknown') {
    return spare.status;
  }

  if (spare.onboardQuantity !== undefined && spare.onboardQuantity < spare.minimumQuantity) {
    return 'insufficient';
  }

  return undefined;
}

export function assessSpareRequirements(spares: SpareRequirement[]): SpareFinding[] {
  return spares
    .map((spare) => ({ spare, status: inferSpareFindingStatus(spare) }))
    .filter((result): result is { spare: SpareRequirement; status: SpareFinding['status'] } => result.status !== undefined)
    .map(({ spare, status }) => ({
      spareId: spare.id,
      system: spare.system,
      severity: findingSeverity(spare, status),
      status,
      text: `${spare.title} is ${status}: ${spare.whyItMatters}`,
      skipperAction: spare.skipperAction
    }))
    .filter((finding) => finding.severity !== 'info');
}

export function summarizeSpareReadiness(spares: SpareRequirement[]): SpareReadinessSummary {
  const findings = assessSpareRequirements(spares);
  const blockerFindings = findings.filter((finding) => finding.severity === 'blocker').length;
  const cautionFindings = findings.filter((finding) => finding.severity === 'caution').length;
  const systemsCovered = Array.from(new Set(spares.map((spare) => spare.system))).sort();

  return {
    spareCount: spares.length,
    criticalSpares: spares.filter((spare) => spare.priority === 'critical').length,
    missingCriticalSpares: findings.filter((finding) => finding.severity === 'blocker' && finding.status === 'missing').length,
    unknownCriticalSpares: findings.filter((finding) => finding.severity === 'blocker' && finding.status === 'unknown').length,
    cautionFindings,
    blockerFindings,
    systemsCovered,
    canDepart: blockerFindings === 0,
    firstBlocker: findings.find((finding) => finding.severity === 'blocker')?.text,
    nextActions: findings.map((finding) => finding.skipperAction)
  };
}
