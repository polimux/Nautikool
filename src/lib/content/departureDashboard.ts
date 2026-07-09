import { departureReadinessTemplate } from '$lib/content/checklistTemplates';
import { h323ElinaTurkuParnuHarbourDepartureGate } from '$lib/content/harbourDepartureGates';
import { h323ElinaMaintenanceSummary } from '$lib/content/maintenanceTasks';
import { h323ElinaNmeaNetworkSummary } from '$lib/content/nmeaNetworks';
import { turkuToParnuFamilyPassagePlan } from '$lib/content/passagePlans';
import { coreRiskAssessments } from '$lib/content/riskAssessments';
import { h323ElinaSpareSummary } from '$lib/content/spareRequirements';
import { h323ElinaTripLogSummary } from '$lib/content/tripLogs';
import { h323ElinaVesselProfile } from '$lib/content/vesselProfiles';
import { createChecklistRun, summarizeChecklistRun } from '$lib/domain/checklists';
import { buildDepartureDashboard, type DepartureDashboardInput } from '$lib/domain/departureDashboard';

const h323ElinaDashboardChecklistRun = createChecklistRun(departureReadinessTemplate, {
  id: 'checklist-run:h323-elina:turku-parnu-dashboard-static',
  vesselId: h323ElinaVesselProfile.id,
  passageId: turkuToParnuFamilyPassagePlan.id,
  startedAt: '2026-07-26T05:30:00+03:00'
});

export const h323ElinaTurkuParnuDepartureDashboardInput: DepartureDashboardInput = {
  id: 'departure-dashboard:h323-elina:turku-parnu-family',
  title: 'H-323 Elina Turku to Pärnu pre-departure dashboard',
  vesselName: h323ElinaVesselProfile.name,
  passageTitle: turkuToParnuFamilyPassagePlan.title,
  checklistSummary: summarizeChecklistRun(departureReadinessTemplate, h323ElinaDashboardChecklistRun),
  riskAssessments: coreRiskAssessments,
  maintenanceSummary: h323ElinaMaintenanceSummary,
  spareSummary: h323ElinaSpareSummary,
  nmeaSummary: h323ElinaNmeaNetworkSummary,
  tripLogSummary: h323ElinaTripLogSummary,
  harbourGate: h323ElinaTurkuParnuHarbourDepartureGate,
  assumptions: [
    'Static dashboard content for product development, not live sailing advice.',
    'Checklist state intentionally starts open so the dashboard cannot appear green without real preparation.',
    'Risk, maintenance, spares, network, logbook and harbour-gate slices are aggregated conservatively: any blocker keeps the dashboard no-go.',
    'The skipper must still verify live forecast, local notices, crew readiness, harbour availability and vessel condition before departure.'
  ]
};

export const h323ElinaTurkuParnuDepartureDashboard = buildDepartureDashboard(
  h323ElinaTurkuParnuDepartureDashboardInput
);

export const coreDepartureDashboards = [h323ElinaTurkuParnuDepartureDashboard];
