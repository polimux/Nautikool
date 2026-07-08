import type { PassageLegEta, PassagePlan, PassagePlanSummary } from './types';

export function calculateLegHours(distanceNm: number, plannedSpeedKn: number): number {
  if (distanceNm <= 0) {
    throw new Error('Leg distance must be greater than zero nautical miles.');
  }

  if (plannedSpeedKn <= 0) {
    throw new Error('Planned speed must be greater than zero knots.');
  }

  return distanceNm / plannedSpeedKn;
}

export function calculatePassageLegEtas(plan: PassagePlan): PassageLegEta[] {
  return plan.legs.map((leg) => ({
    legId: leg.id,
    hours: calculateLegHours(leg.distanceNm, leg.plannedSpeedKn)
  }));
}

export function summarizePassagePlan(plan: PassagePlan): PassagePlanSummary {
  const legEtas = calculatePassageLegEtas(plan);

  return {
    totalDistanceNm: plan.legs.reduce((total, leg) => total + leg.distanceNm, 0),
    totalPlannedHours: legEtas.reduce((total, eta) => total + eta.hours, 0),
    openWaterLegs: plan.legs.filter((leg) => leg.exposure === 'open-water').length,
    highSeverityHazards: plan.legs.flatMap((leg) => leg.hazards).filter((hazard) => hazard.severity === 'high').length,
    daylightCriticalLegs: plan.legs.filter((leg) => leg.daylightPreferred).length,
    bailoutHarbourCount: plan.legs.reduce((total, leg) => total + leg.bailoutHarbours.length, 0)
  };
}
