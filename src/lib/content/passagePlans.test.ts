import { describe, expect, it } from 'vitest';
import { corePassagePlans, getPassagePlanById, turkuToParnuFamilyPassagePlan } from './passagePlans';

describe('starter passage plan content', () => {
  it('contains the Turku to Pärnu family H-323 passage sample', () => {
    expect(corePassagePlans.map((plan) => plan.id)).toEqual(['passage-plan:turku-to-parnu-family-h323']);
    expect(getPassagePlanById(turkuToParnuFamilyPassagePlan.id)).toBe(turkuToParnuFamilyPassagePlan);
  });

  it('keeps the sample assumption-backed and conservative', () => {
    expect(turkuToParnuFamilyPassagePlan.assumptions.length).toBeGreaterThanOrEqual(3);
    expect(turkuToParnuFamilyPassagePlan.assumptions.map((assumption) => assumption.safetyImpact)).toContain('high');
    expect(turkuToParnuFamilyPassagePlan.legs.every((leg) => leg.bailoutHarbours.length > 0)).toBe(true);
    expect(turkuToParnuFamilyPassagePlan.legs.every((leg) => leg.crewNotes.length > 0)).toBe(true);
  });

  it('models the Hanko to Haapsalu leg as the main open-water risk', () => {
    const openWaterLegs = turkuToParnuFamilyPassagePlan.legs.filter((leg) => leg.exposure === 'open-water');

    expect(openWaterLegs).toHaveLength(1);
    expect(openWaterLegs[0].id).toBe('leg:hanko-to-haapsalu');
    expect(openWaterLegs[0].hazards.some((hazard) => hazard.severity === 'high')).toBe(true);
  });
});
