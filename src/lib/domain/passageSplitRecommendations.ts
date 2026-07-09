import type { PassageLeg, PassagePlan } from './types';
import { calculateLegHours } from './passages';

export type PassageSplitSeverity = 'info' | 'caution' | 'blocker';

export interface PassageSplitStop {
  name: string;
  reason: string;
  approxDistanceFromStartNm?: number;
  approachNote: string;
  skipperCheck: string;
}

export interface PassageSplitScenario {
  legId: string;
  title: string;
  stops: PassageSplitStop[];
  notes: string[];
}

export interface PassageSplitRecommendation {
  id: string;
  legId: string;
  from: string;
  to: string;
  originalDistanceNm: number;
  originalPlannedHours: number;
  severity: PassageSplitSeverity;
  headline: string;
  recommendedStops: PassageSplitStop[];
  decisionPoint: string;
  readAloudBrief: string[];
  limitations: string[];
}

export interface PassageSplitRecommendationSummary {
  id: string;
  planId: string;
  recommendationCount: number;
  blockerRecommendations: number;
  cautionRecommendations: number;
  firstDecisionPoint: string;
  headline: string;
  recommendations: PassageSplitRecommendation[];
}

function severityForLeg(leg: PassageLeg, hardMaxDayLegNm: number, targetMaxDayLegNm: number): PassageSplitSeverity {
  if (leg.distanceNm > hardMaxDayLegNm || leg.exposure === 'open-water') {
    return 'blocker';
  }

  if (leg.distanceNm > targetMaxDayLegNm || leg.daylightPreferred) {
    return 'caution';
  }

  return 'info';
}

function findLeg(plan: PassagePlan, legId: string): PassageLeg {
  const leg = plan.legs.find((candidate) => candidate.id === legId);

  if (!leg) {
    throw new Error(`Passage leg ${legId} does not exist in ${plan.id}.`);
  }

  return leg;
}

function fallbackDecisionPoint(leg: PassageLeg): string {
  const bailoutNames = leg.bailoutHarbours.map((harbour) => harbour.name).join(', ');

  return bailoutNames.length > 0
    ? `Before committing beyond the practical return point, confirm whether ${bailoutNames} still remains usable.`
    : 'Add at least one real bailout harbour before this leg can be treated as a usable plan.';
}

export function recommendPassageSplits(
  plan: PassagePlan,
  scenarios: PassageSplitScenario[],
  options: { targetMaxDayLegNm: number; hardMaxDayLegNm: number }
): PassageSplitRecommendationSummary {
  const recommendations = scenarios.map<PassageSplitRecommendation>((scenario) => {
    const leg = findLeg(plan, scenario.legId);
    const severity = severityForLeg(leg, options.hardMaxDayLegNm, options.targetMaxDayLegNm);
    const plannedHours = calculateLegHours(leg.distanceNm, leg.plannedSpeedKn);
    const firstStop = scenario.stops[0];
    const decisionPoint = firstStop
      ? `Decide for ${firstStop.name} before the crew is tired, before daylight margin is lost, and before the route becomes an open-ended commitment.`
      : fallbackDecisionPoint(leg);

    return {
      id: `${plan.id}:split:${leg.id}`,
      legId: leg.id,
      from: leg.from,
      to: leg.to,
      originalDistanceNm: leg.distanceNm,
      originalPlannedHours: plannedHours,
      severity,
      headline:
        severity === 'blocker'
          ? `${leg.from} to ${leg.to} needs a written split or watch-plan decision before departure.`
          : severity === 'caution'
            ? `${leg.from} to ${leg.to} should have an early-stop option briefed before departure.`
            : `${leg.from} to ${leg.to} has a usable conservative split note if conditions deteriorate.`,
      recommendedStops: scenario.stops,
      decisionPoint,
      readAloudBrief: [
        `${leg.from} to ${leg.to}: planned ${leg.distanceNm} nm / ${plannedHours.toFixed(1)} h at ${leg.plannedSpeedKn} kn.`,
        firstStop
          ? `Primary conservative split: ${firstStop.name} - ${firstStop.reason}`
          : 'No primary split harbour recorded yet.',
        decisionPoint
      ],
      limitations: [
        'Split suggestions are static planning aids; they do not verify harbour depth, berths, opening status, local notices, traffic, weather or sea state.',
        'The skipper must confirm current charts, pilotage notes, weather window, crew state and daylight before relying on any stop.'
      ]
    };
  });

  const blockers = recommendations.filter((item) => item.severity === 'blocker');
  const cautions = recommendations.filter((item) => item.severity === 'caution');

  return {
    id: `${plan.id}:split-recommendations`,
    planId: plan.id,
    recommendationCount: recommendations.length,
    blockerRecommendations: blockers.length,
    cautionRecommendations: cautions.length,
    firstDecisionPoint: recommendations[0]?.decisionPoint ?? 'No split recommendation recorded.',
    headline:
      blockers.length > 0
        ? `${blockers.length} route split blocker(s) need skipper decision before the passage plan is usable.`
        : cautions.length > 0
          ? `${cautions.length} route split caution(s) should be briefed before departure.`
          : 'Route split notes are available as conservative fallbacks.',
    recommendations
  };
}
