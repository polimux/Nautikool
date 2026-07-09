import { describe, expect, it } from 'vitest';
import { h323ElinaTurkuParnuDepartureDashboard } from '$lib/content/departureDashboard';
import { h323ElinaMaintenanceSummary } from '$lib/content/maintenanceTasks';
import { h323ElinaNmeaNetworkSummary } from '$lib/content/nmeaNetworks';
import { coreRiskAssessments } from '$lib/content/riskAssessments';
import { h323ElinaSpareSummary } from '$lib/content/spareRequirements';
import { h323ElinaTripLogSummary } from '$lib/content/tripLogs';
import { buildDepartureDashboard, type DepartureDashboardInput } from './departureDashboard';
import type { ChecklistRunSummary } from './types';

const cleanChecklistSummary: ChecklistRunSummary = {
  status: 'complete',
  totalItems: 4,
  openItems: 0,
  doneItems: 4,
  skippedItems: 0,
  notApplicableItems: 0,
  requiredOpenItems: 0,
  requiredSkippedItems: 0,
  completionPercent: 100,
  canComplete: true,
  warnings: [],
  blockers: []
};

const baseInput: DepartureDashboardInput = {
  id: 'dashboard:test',
  title: 'Test dashboard',
  vesselName: 'Test boat',
  passageTitle: 'Test passage',
  checklistSummary: cleanChecklistSummary,
  riskAssessments: coreRiskAssessments.map((assessment) => ({
    ...assessment,
    level: 'green' as const,
    canDepart: true,
    findings: [],
    summary: {
      ...assessment.summary,
      noGoFindings: 0,
      cautionFindings: 0,
      infoFindings: 0
    }
  })),
  maintenanceSummary: {
    ...h323ElinaMaintenanceSummary,
    blockerFindings: 0,
    cautionFindings: 0,
    unknownTasks: 0,
    overdueTasks: 0,
    dueSoonTasks: 0,
    canDepart: true,
    firstBlocker: undefined,
    nextActions: []
  },
  spareSummary: {
    ...h323ElinaSpareSummary,
    blockerFindings: 0,
    cautionFindings: 0,
    missingCriticalSpares: 0,
    unknownCriticalSpares: 0,
    canDepart: true,
    firstBlocker: undefined,
    nextActions: []
  },
  nmeaSummary: {
    ...h323ElinaNmeaNetworkSummary,
    warnings: 0,
    blockers: 0,
    findings: []
  },
  tripLogSummary: {
    ...h323ElinaTripLogSummary,
    blockerEntries: 0,
    cautionEntries: 0,
    missingPositionEntries: 0,
    followUps: []
  },
  assumptions: ['test scenario']
};

describe('departure dashboard', () => {
  it('returns a green dashboard only when all connected slices are clean', () => {
    const dashboard = buildDepartureDashboard(baseInput);

    expect(dashboard.status).toBe('go');
    expect(dashboard.canDepart).toBe(true);
    expect(dashboard.findings).toHaveLength(0);
    expect(dashboard.readinessScore).toBe(100);
    expect(dashboard.readAloudBrief[3]).toContain('not a replacement for skipper judgement');
  });

  it('keeps open required checklist items as blockers even when other slices are clean', () => {
    const dashboard = buildDepartureDashboard({
      ...baseInput,
      checklistSummary: {
        ...cleanChecklistSummary,
        status: 'incomplete',
        openItems: 2,
        doneItems: 2,
        requiredOpenItems: 2,
        canComplete: false,
        completionPercent: 50,
        blockers: ['Required item is still open.']
      }
    });

    expect(dashboard.status).toBe('no-go');
    expect(dashboard.canDepart).toBe(false);
    expect(dashboard.findings[0].source).toBe('checklist');
    expect(dashboard.nextActions[0]).toContain('Close required checklist items');
  });

  it('aggregates red risk, maintenance, spares and NMEA blockers into one no-go dashboard', () => {
    const dashboard = buildDepartureDashboard({
      ...baseInput,
      riskAssessments: coreRiskAssessments,
      maintenanceSummary: h323ElinaMaintenanceSummary,
      spareSummary: h323ElinaSpareSummary,
      nmeaSummary: h323ElinaNmeaNetworkSummary
    });

    expect(dashboard.status).toBe('no-go');
    expect(dashboard.blockerCount).toBeGreaterThanOrEqual(3);
    expect(dashboard.findings.map((finding) => finding.source)).toContain('maintenance');
    expect(dashboard.findings.map((finding) => finding.source)).toContain('spares');
    expect(dashboard.findings.map((finding) => finding.source)).toContain('nmea-ais');
    expect(dashboard.headline).toContain('blocker');
  });

  it('publishes the H-323 Elina dashboard as user-facing scenario content', () => {
    expect(h323ElinaTurkuParnuDepartureDashboard.vesselName).toBe('Elina');
    expect(h323ElinaTurkuParnuDepartureDashboard.passageTitle).toContain('Turku to Pärnu');
    expect(h323ElinaTurkuParnuDepartureDashboard.status).toBe('no-go');
    expect(h323ElinaTurkuParnuDepartureDashboard.assumptions.join(' ')).toContain('not live sailing advice');
    expect(h323ElinaTurkuParnuDepartureDashboard.readAloudBrief[0]).toContain('Elina');
  });
});
