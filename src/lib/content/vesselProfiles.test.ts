import { describe, expect, it } from 'vitest';
import { coreVesselProfiles, getVesselProfileById, h323ElinaVesselProfile } from './vesselProfiles';

describe('vessel profile content registry', () => {
  it('contains the H-323 Elina reference profile', () => {
    expect(coreVesselProfiles.map((profile) => profile.id)).toEqual(['vessel:h323-elina']);
    expect(getVesselProfileById('vessel:h323-elina')).toBe(h323ElinaVesselProfile);
  });

  it('records the H-323 identity and core dimensions', () => {
    expect(h323ElinaVesselProfile.name).toBe('Elina');
    expect(h323ElinaVesselProfile.formerNames).toContain('Vicious 2.0');
    expect(h323ElinaVesselProfile.dimensions.loaMeters).toBe(9.85);
    expect(h323ElinaVesselProfile.dimensions.beamMeters).toBe(2.56);
    expect(h323ElinaVesselProfile.dimensions.draftMeters).toBe(1.45);
  });

  it('keeps navigation and communication equipment explicit', () => {
    const equipmentNames = h323ElinaVesselProfile.equipment.map((item) => item.name);

    expect(equipmentNames).toContain('Raymarine Ray90 fixed VHF/DSC radio');
    expect(equipmentNames).toContain('em-trak B953 AIS transponder with splitter');
    expect(equipmentNames).toContain('Raymarine Axiom+ 9 chartplotter');
    expect(equipmentNames).toContain('Orca Core 2 navigation computer');
  });

  it('does not hide unverified capacities behind false precision', () => {
    expect(h323ElinaVesselProfile.tanks?.fuelLiters).toBeUndefined();
    expect(h323ElinaVesselProfile.batteries?.notes).toContain('need confirmation');
    expect(h323ElinaVesselProfile.assumptions.map((assumption) => assumption.safetyImpact)).toContain('high');
  });
});
