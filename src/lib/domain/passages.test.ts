import { describe, expect, it } from 'vitest';
import { turkuToParnuFamilyPassagePlan } from '$lib/content/passagePlans';
import { calculateLegHours, calculatePassageLegEtas, summarizePassagePlan } from './passages';

describe('passage plan summary logic', () => {
  it('calculates leg hours from nautical miles and knots', () => {
    expect(calculateLegHours(50, 5)).toBe(10);
    expect(calculateLegHours(28, 5)).toBeCloseTo(5.6);
  });

  it('rejects invalid distance and speed inputs', () => {
    expect(() => calculateLegHours(0, 5)).toThrow('Leg distance must be greater than zero nautical miles.');
    expect(() => calculateLegHours(10, 0)).toThrow('Planned speed must be greater than zero knots.');
  });

  it('summarizes the Turku to Pärnu family passage sample', () => {
    const summary = summarizePassagePlan(turkuToParnuFamilyPassagePlan);

    expect(summary.totalDistanceNm).toBe(220);
    expect(summary.totalPlannedHours).toBe(44);
    expect(summary.openWaterLegs).toBe(1);
    expect(summary.highSeverityHazards).toBe(1);
    expect(summary.daylightCriticalLegs).toBe(3);
    expect(summary.bailoutHarbourCount).toBe(5);
  });

  it('keeps ETA rows tied to stable leg identifiers', () => {
    expect(calculatePassageLegEtas(turkuToParnuFamilyPassagePlan).map((eta) => eta.legId)).toEqual([
      'leg:turku-to-nauvo',
      'leg:nauvo-to-hanko',
      'leg:hanko-to-haapsalu',
      'leg:haapsalu-to-parnu'
    ]);
  });
});
