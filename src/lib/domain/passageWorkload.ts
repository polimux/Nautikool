import type { PassageLeg, PassagePlan } from './types';
import { calculateLegHours } from './passages';

export type PassageWorkloadSeverity = 'info' | 'caution' | 'blocker';
export type PassageWorkloadFindingKind =
  | 'distance'
  | 'duration'
  | 'daylight'
  | 'open-water'
  | 'bailout'
  | 'crew-note';

export interface PassageWorkloadPolicy {
  id: string;
  title: string;
  targetMaxDayLegNm: number;
  hardMaxDayLegNm: number;
  maxComfortableDayHours: number;
  maxExposedContinuousHours: number;
  requireBailoutForEveryLeg: boolean;
  familyCrew: boolean;
  policyNotes: string[];
}

export interface PassageLegWorkloadFinding {
  id: string;
  legId: string;
  kind: PassageWorkloadFindingKind;
  severity: PassageWorkloadSeverity;
  text: string;
  skipperAction: string;
}

export interface PassageLegWorkload {
  legId: string;
  from: string;
  to: string;
  distanceNm: number;
  plannedHours: number;
  exposure: PassageLeg['exposure'];
  daylightPreferred: boolean;
  findingCount: number;
  highestSeverity: PassageWorkloadSeverity;
  findings: PassageLegWorkloadFinding[];
}

export interface PassageWorkloadSummary {
  id: string;
  planId: string;
  policyTitle: string;
  legCount: number;
  totalDistanceNm: number;
  totalPlannedHours: number;
  blockerFindings: number;
  cautionFindings: number;
  infoFindings: number;
  longestLegNm: number;
  longestLegHours: number;
  canKeepFamilyWorkload: boolean;
  headline: string;
  firstAction: string;
  legs: PassageLegWorkload[];
  policyNotes: string[];
}

function severityRank(severity: PassageWorkloadSeverity): number {
  return { info: 0, caution: 1, blocker: 2 }[severity];
}

function highestSeverity(findings: PassageLegWorkloadFinding[]): PassageWorkloadSeverity {
  return findings.reduce<PassageWorkloadSeverity>(
    (highest, finding) => (severityRank(finding.severity) > severityRank(highest) ? finding.severity : highest),
    'info'
  );
}

function finding(
  plan: PassagePlan,
  leg: PassageLeg,
  kind: PassageWorkloadFindingKind,
  severity: PassageWorkloadSeverity,
  text: string,
  skipperAction: string
): PassageLegWorkloadFinding {
  return {
    id: `${plan.id}:${leg.id}:workload:${kind}:${severity}`,
    legId: leg.id,
    kind,
    severity,
    text,
    skipperAction
  };
}

function analyzeLeg(plan: PassagePlan, leg: PassageLeg, policy: PassageWorkloadPolicy): PassageLegWorkload {
  const plannedHours = calculateLegHours(leg.distanceNm, leg.plannedSpeedKn);
  const findings: PassageLegWorkloadFinding[] = [];

  if (leg.distanceNm > policy.hardMaxDayLegNm) {
    findings.push(
      finding(
        plan,
        leg,
        'distance',
        'blocker',
        `${leg.from} to ${leg.to} is ${leg.distanceNm} nm, above the hard family day-leg limit of ${policy.hardMaxDayLegNm} nm.`,
        'Split the leg, add a rest harbour, or only run it with an explicit overnight/open-water watch plan.'
      )
    );
  } else if (leg.distanceNm > policy.targetMaxDayLegNm) {
    findings.push(
      finding(
        plan,
        leg,
        'distance',
        'caution',
        `${leg.from} to ${leg.to} is ${leg.distanceNm} nm, above the target family day-leg limit of ${policy.targetMaxDayLegNm} nm.`,
        'Brief the crew that this is a long day, start early, keep food ready and name a conservative bailout harbour.'
      )
    );
  }

  if (plannedHours > policy.maxComfortableDayHours) {
    findings.push(
      finding(
        plan,
        leg,
        'duration',
        plannedHours > policy.maxComfortableDayHours + 3 ? 'blocker' : 'caution',
        `${leg.from} to ${leg.to} plans at ${plannedHours.toFixed(1)} hours at ${leg.plannedSpeedKn} kn.`,
        'Do not treat the distance alone as acceptable; decide from expected hours, daylight, fatigue and arrival complexity.'
      )
    );
  }

  if (leg.daylightPreferred && plannedHours > policy.maxComfortableDayHours) {
    findings.push(
      finding(
        plan,
        leg,
        'daylight',
        'caution',
        `${leg.from} to ${leg.to} prefers daylight but is likely to consume most of the practical sailing day.`,
        'Plan a dawn-ready departure, pre-cook food and choose a bailout that still gives a daylight arrival.'
      )
    );
  }

  if (leg.exposure === 'open-water' && plannedHours > policy.maxExposedContinuousHours) {
    findings.push(
      finding(
        plan,
        leg,
        'open-water',
        'blocker',
        `${leg.from} to ${leg.to} is an exposed ${plannedHours.toFixed(1)} hour open-water leg.`,
        'Require fresh weather, VHF/DSC readiness, AIS watch discipline, seasickness preparation and a written watch rotation.'
      )
    );
  }

  if (policy.requireBailoutForEveryLeg && leg.bailoutHarbours.length === 0) {
    findings.push(
      finding(
        plan,
        leg,
        'bailout',
        'blocker',
        `${leg.from} to ${leg.to} has no bailout harbour recorded.`,
        'Add at least one realistic bailout harbour with entry notes before using this as a departure plan.'
      )
    );
  } else if (leg.bailoutHarbours.length === 1 && (leg.distanceNm > policy.targetMaxDayLegNm || leg.exposure !== 'sheltered')) {
    findings.push(
      finding(
        plan,
        leg,
        'bailout',
        'caution',
        `${leg.from} to ${leg.to} has only one bailout option recorded for a longer or exposed leg.`,
        'Add a second fallback or write the decision point where turning back is still easier than pressing on.'
      )
    );
  }

  if (policy.familyCrew && leg.crewNotes.length === 0) {
    findings.push(
      finding(
        plan,
        leg,
        'crew-note',
        'caution',
        `${leg.from} to ${leg.to} has no crew workload note.`,
        'Add food, warmth, lookout, helm rotation or rest guidance for the family crew.'
      )
    );
  }

  if (findings.length === 0) {
    findings.push(
      finding(
        plan,
        leg,
        'crew-note',
        'info',
        `${leg.from} to ${leg.to} fits the current family workload policy.`,
        'Still reassess live weather, crew state and harbour availability before departure.'
      )
    );
  }

  return {
    legId: leg.id,
    from: leg.from,
    to: leg.to,
    distanceNm: leg.distanceNm,
    plannedHours,
    exposure: leg.exposure,
    daylightPreferred: leg.daylightPreferred,
    findingCount: findings.length,
    highestSeverity: highestSeverity(findings),
    findings
  };
}

export function analyzePassageWorkload(plan: PassagePlan, policy: PassageWorkloadPolicy): PassageWorkloadSummary {
  const legs = plan.legs.map((leg) => analyzeLeg(plan, leg, policy));
  const findings = legs.flatMap((leg) => leg.findings);
  const blockers = findings.filter((item) => item.severity === 'blocker');
  const cautions = findings.filter((item) => item.severity === 'caution');
  const infos = findings.filter((item) => item.severity === 'info');
  const longestLegNm = Math.max(...legs.map((leg) => leg.distanceNm));
  const longestLegHours = Math.max(...legs.map((leg) => leg.plannedHours));
  const firstAction = blockers[0]?.skipperAction ?? cautions[0]?.skipperAction ?? 'Keep the leg plan, but reassess live conditions before departure.';

  return {
    id: `${plan.id}:workload:${policy.id}`,
    planId: plan.id,
    policyTitle: policy.title,
    legCount: legs.length,
    totalDistanceNm: legs.reduce((total, leg) => total + leg.distanceNm, 0),
    totalPlannedHours: legs.reduce((total, leg) => total + leg.plannedHours, 0),
    blockerFindings: blockers.length,
    cautionFindings: cautions.length,
    infoFindings: infos.length,
    longestLegNm,
    longestLegHours,
    canKeepFamilyWorkload: blockers.length === 0,
    headline:
      blockers.length > 0
        ? `${blockers.length} workload blocker(s) require route or watch-plan changes before departure.`
        : cautions.length > 0
          ? `${cautions.length} workload caution(s) require skipper briefing before departure.`
          : 'All legs fit the current workload policy on static plan data.',
    firstAction,
    legs,
    policyNotes: policy.policyNotes
  };
}
