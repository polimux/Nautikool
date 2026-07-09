import type { HarbourDepartureGate } from './harbourDepartureGates';
import type { MaintenanceReadinessSummary } from './maintenance';
import type { NmeaNetworkSummary } from './nmea';
import type { SpareReadinessSummary } from './spares';
import type { TripLogSummary } from './tripLogs';
import type { ChecklistRunSummary, RiskAssessment } from './types';

export type DepartureDashboardStatus = 'go' | 'caution' | 'no-go';
export type DepartureDashboardFindingSeverity = 'info' | 'caution' | 'blocker';
export type DepartureDashboardFindingSource =
  | 'checklist'
  | 'risk'
  | 'maintenance'
  | 'spares'
  | 'nmea-ais'
  | 'trip-log'
  | 'harbour';

export interface DepartureDashboardFinding {
  id: string;
  source: DepartureDashboardFindingSource;
  severity: DepartureDashboardFindingSeverity;
  title: string;
  skipperAction: string;
}

export interface DepartureDashboardInput {
  id: string;
  title: string;
  vesselName: string;
  passageTitle: string;
  checklistSummary: ChecklistRunSummary;
  riskAssessments: RiskAssessment[];
  maintenanceSummary: MaintenanceReadinessSummary;
  spareSummary: SpareReadinessSummary;
  nmeaSummary: NmeaNetworkSummary;
  tripLogSummary?: TripLogSummary;
  harbourGate?: HarbourDepartureGate;
  assumptions: string[];
}

export interface DepartureDashboardSummary {
  id: string;
  title: string;
  vesselName: string;
  passageTitle: string;
  status: DepartureDashboardStatus;
  readinessScore: number;
  blockerCount: number;
  cautionCount: number;
  infoCount: number;
  canDepart: boolean;
  headline: string;
  findings: DepartureDashboardFinding[];
  nextActions: string[];
  readAloudBrief: string[];
  assumptions: string[];
}

const statusRank: Record<DepartureDashboardStatus, number> = {
  go: 0,
  caution: 1,
  'no-go': 2
};

function mostConservativeStatus(statuses: DepartureDashboardStatus[]): DepartureDashboardStatus {
  return statuses.reduce<DepartureDashboardStatus>(
    (current, candidate) => (statusRank[candidate] > statusRank[current] ? candidate : current),
    'go'
  );
}

function finding(
  id: string,
  source: DepartureDashboardFindingSource,
  severity: DepartureDashboardFindingSeverity,
  title: string,
  skipperAction: string
): DepartureDashboardFinding {
  return { id, source, severity, title, skipperAction };
}

function uniqueActions(findings: DepartureDashboardFinding[]): string[] {
  return Array.from(new Set(findings.map((item) => item.skipperAction))).slice(0, 6);
}

function scorePenalty(findings: DepartureDashboardFinding[], checklistSummary: ChecklistRunSummary): number {
  const blockerPenalty = findings.filter((item) => item.severity === 'blocker').length * 18;
  const cautionPenalty = findings.filter((item) => item.severity === 'caution').length * 7;
  const openChecklistPenalty = checklistSummary.requiredOpenItems * 3 + checklistSummary.requiredSkippedItems * 4;

  return blockerPenalty + cautionPenalty + openChecklistPenalty;
}

function headlineFor(status: DepartureDashboardStatus, blockerCount: number, cautionCount: number): string {
  if (status === 'no-go') {
    return `${blockerCount} blocker(s) must be closed before this becomes a departure decision.`;
  }

  if (status === 'caution') {
    return `${cautionCount} caution(s) need skipper review before committing to the leg.`;
  }

  return 'No blockers found in the connected preparation slices; still verify live weather, lookout and local notices.';
}

export function buildDepartureDashboard(input: DepartureDashboardInput): DepartureDashboardSummary {
  const findings: DepartureDashboardFinding[] = [];

  if (input.checklistSummary.requiredOpenItems > 0 || input.checklistSummary.requiredSkippedItems > 0) {
    findings.push(
      finding(
        'dashboard:checklist-required-open',
        'checklist',
        'blocker',
        `${input.checklistSummary.requiredOpenItems} required checklist item(s) remain open and ${input.checklistSummary.requiredSkippedItems} required item(s) are skipped.`,
        'Close required checklist items or explicitly downgrade the passage plan before departure.'
      )
    );
  } else if (input.checklistSummary.openItems > 0) {
    findings.push(
      finding(
        'dashboard:checklist-open-caution',
        'checklist',
        'caution',
        `${input.checklistSummary.openItems} checklist item(s) are still open.`,
        'Review open checklist items and decide whether any should become blockers for this passage.'
      )
    );
  }

  for (const assessment of input.riskAssessments) {
    if (!assessment.canDepart) {
      findings.push(
        finding(
          `dashboard:risk-no-go:${assessment.id}`,
          'risk',
          'blocker',
          `${assessment.title} is red with ${assessment.summary.noGoFindings} no-go finding(s).`,
          assessment.findings.find((riskFinding) => riskFinding.severity === 'no-go')?.recommendation ??
            'Resolve the red risk assessment before departure.'
        )
      );
    } else if (assessment.level === 'yellow') {
      findings.push(
        finding(
          `dashboard:risk-caution:${assessment.id}`,
          'risk',
          'caution',
          `${assessment.title} is yellow with ${assessment.summary.cautionFindings} caution finding(s).`,
          assessment.findings.find((riskFinding) => riskFinding.severity === 'caution')?.recommendation ??
            'Brief the caution findings before committing to the leg.'
        )
      );
    }
  }

  if (!input.maintenanceSummary.canDepart) {
    findings.push(
      finding(
        'dashboard:maintenance-blocker',
        'maintenance',
        'blocker',
        input.maintenanceSummary.firstBlocker ?? 'Maintenance readiness has blocker findings.',
        input.maintenanceSummary.nextActions[0] ?? 'Close maintenance blockers before departure.'
      )
    );
  } else if (input.maintenanceSummary.cautionFindings > 0 || input.maintenanceSummary.unknownTasks > 0) {
    findings.push(
      finding(
        'dashboard:maintenance-caution',
        'maintenance',
        'caution',
        `${input.maintenanceSummary.cautionFindings} maintenance caution(s) and ${input.maintenanceSummary.unknownTasks} unknown task(s).`,
        input.maintenanceSummary.nextActions[0] ?? 'Review maintenance cautions before departure.'
      )
    );
  }

  if (!input.spareSummary.canDepart) {
    findings.push(
      finding(
        'dashboard:spares-blocker',
        'spares',
        'blocker',
        input.spareSummary.firstBlocker ?? 'Spare readiness has blocker findings.',
        input.spareSummary.nextActions[0] ?? 'Put critical spares onboard before departure.'
      )
    );
  } else if (input.spareSummary.cautionFindings > 0) {
    findings.push(
      finding(
        'dashboard:spares-caution',
        'spares',
        'caution',
        `${input.spareSummary.cautionFindings} spare-readiness caution(s).`,
        input.spareSummary.nextActions[0] ?? 'Check recommended spares and stowage before departure.'
      )
    );
  }

  if (input.nmeaSummary.blockers > 0) {
    findings.push(
      finding(
        'dashboard:nmea-blocker',
        'nmea-ais',
        'blocker',
        `${input.nmeaSummary.blockers} NMEA/AIS network blocker(s) found.`,
        input.nmeaSummary.findings.find((item) => item.severity === 'blocker')?.recommendation ??
          'Resolve network blockers so position, AIS and DSC data paths are trustworthy.'
      )
    );
  } else if (input.nmeaSummary.warnings > 0) {
    findings.push(
      finding(
        'dashboard:nmea-warning',
        'nmea-ais',
        'caution',
        `${input.nmeaSummary.warnings} NMEA/AIS network warning(s) found.`,
        input.nmeaSummary.findings.find((item) => item.severity === 'warning')?.recommendation ??
          'Verify network warnings before relying on cockpit data.'
      )
    );
  }

  if (input.harbourGate) {
    const harbourBlockers = input.harbourGate.findings.filter((item) => item.severity === 'blocker').length;
    const harbourCautions = input.harbourGate.findings.filter((item) => item.severity === 'caution').length;

    if (input.harbourGate.status === 'blocked') {
      findings.push(
        finding(
          'dashboard:harbour-gate-blocker',
          'harbour',
          'blocker',
          `${input.harbourGate.title} is blocked with ${harbourBlockers} harbour blocker(s).`,
          input.harbourGate.firstAction ?? 'Close harbour departure-gate blockers before casting off.'
        )
      );
    } else if (input.harbourGate.status === 'caution') {
      findings.push(
        finding(
          'dashboard:harbour-gate-caution',
          'harbour',
          'caution',
          `${input.harbourGate.title} has ${harbourCautions} harbour caution(s).`,
          input.harbourGate.firstAction ?? 'Review harbour cautions and alternates before committing to the route.'
        )
      );
    }
  }

  if (input.tripLogSummary && (input.tripLogSummary.blockerEntries > 0 || input.tripLogSummary.followUps.length > 0)) {
    findings.push(
      finding(
        'dashboard:trip-log-follow-up',
        'trip-log',
        input.tripLogSummary.blockerEntries > 0 ? 'blocker' : 'caution',
        `${input.tripLogSummary.followUps.length} trip-log follow-up(s) remain from the last leg.`,
        input.tripLogSummary.followUps[0] ?? 'Review last-leg blockers and lessons before using this as a fresh departure decision.'
      )
    );
  } else if (input.tripLogSummary && input.tripLogSummary.missingPositionEntries > 0) {
    findings.push(
      finding(
        'dashboard:trip-log-position-caution',
        'trip-log',
        'caution',
        `${input.tripLogSummary.missingPositionEntries} trip-log operational entry or entries are missing position context.`,
        'Complete the previous log positions so navigation lessons are not based on vague memory.'
      )
    );
  }

  const blockerCount = findings.filter((item) => item.severity === 'blocker').length;
  const cautionCount = findings.filter((item) => item.severity === 'caution').length;
  const infoCount = findings.filter((item) => item.severity === 'info').length;
  const status = mostConservativeStatus([
    blockerCount > 0 ? 'no-go' : 'go',
    cautionCount > 0 ? 'caution' : 'go'
  ]);
  const readinessScore = Math.max(0, 100 - scorePenalty(findings, input.checklistSummary));
  const nextActions = uniqueActions(findings);

  return {
    id: input.id,
    title: input.title,
    vesselName: input.vesselName,
    passageTitle: input.passageTitle,
    status,
    readinessScore,
    blockerCount,
    cautionCount,
    infoCount,
    canDepart: status !== 'no-go',
    headline: headlineFor(status, blockerCount, cautionCount),
    findings,
    nextActions,
    readAloudBrief: [
      `${input.vesselName} / ${input.passageTitle}: dashboard status ${status.toUpperCase()}, readiness score ${readinessScore}.`,
      headlineFor(status, blockerCount, cautionCount),
      nextActions[0] ? `First action: ${nextActions[0]}` : 'First action: verify live weather, crew state and local notices.',
      'This dashboard is a preparation aid, not a replacement for skipper judgement, lookout or live harbour and weather information.'
    ],
    assumptions: input.assumptions
  };
}
