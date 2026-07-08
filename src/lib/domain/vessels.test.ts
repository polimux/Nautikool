import { describe, expect, it } from 'vitest';
import type { VesselProfile } from './types';
import {
  getVesselEquipmentByCategory,
  hasInstalledEquipment,
  missingCriticalEquipment,
  summarizeVesselProfile,
  validateVesselProfile
} from './vessels';
import { h323ElinaVesselProfile } from '$lib/content/vesselProfiles';

describe('vessel profile readiness logic', () => {
  it('groups installed equipment by operational category', () => {
    const communicationItems = getVesselEquipmentByCategory(h323ElinaVesselProfile, 'communication');
    const navigationItems = getVesselEquipmentByCategory(h323ElinaVesselProfile, 'navigation');

    expect(communicationItems.map((item) => item.id)).toContain('equipment:fixed-vhf-dsc');
    expect(navigationItems.map((item) => item.id)).toContain('equipment:ais-transponder');
    expect(navigationItems.map((item) => item.id)).toContain('equipment:plotter');
  });

  it('finds installed equipment by stable identifier', () => {
    expect(hasInstalledEquipment(h323ElinaVesselProfile, 'equipment:fixed-vhf-dsc')).toBe(true);
    expect(hasInstalledEquipment(h323ElinaVesselProfile, 'equipment:ais-transponder')).toBe(true);
    expect(hasInstalledEquipment(h323ElinaVesselProfile, 'equipment:unknown')).toBe(false);
  });

  it('keeps the H-323 reference profile usable for safety-sensitive planning', () => {
    const summary = summarizeVesselProfile(h323ElinaVesselProfile);

    expect(summary.installedEquipmentCount).toBeGreaterThanOrEqual(9);
    expect(summary.criticalEquipmentCount).toBeGreaterThanOrEqual(8);
    expect(summary.missingCriticalEquipmentCount).toBe(0);
    expect(summary.blockerCount).toBe(0);
    expect(summary.assumptionCount).toBeGreaterThanOrEqual(3);
  });

  it('creates blockers for missing critical equipment and incomplete dimensions', () => {
    const unsafeProfile: VesselProfile = {
      ...h323ElinaVesselProfile,
      dimensions: { loaMeters: 9.85 },
      equipment: h323ElinaVesselProfile.equipment.map((item) =>
        item.id === 'equipment:liferaft' ? { ...item, installed: false } : item
      )
    };

    expect(missingCriticalEquipment(unsafeProfile).map((item) => item.id)).toContain('equipment:liferaft');
    expect(validateVesselProfile(unsafeProfile).map((finding) => finding.id)).toContain(
      'finding:vessel-dimensions-incomplete'
    );
    expect(validateVesselProfile(unsafeProfile).map((finding) => finding.id)).toContain(
      'finding:missing-critical:equipment:liferaft'
    );
  });
});
