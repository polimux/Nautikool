import type { VesselEquipmentCategory, VesselProfile, VesselReadinessFinding } from './types';

export function getVesselEquipmentByCategory(
  profile: VesselProfile,
  category: VesselEquipmentCategory
) {
  return profile.equipment.filter((item) => item.category === category);
}

export function hasInstalledEquipment(profile: VesselProfile, equipmentId: string): boolean {
  return profile.equipment.some((item) => item.id === equipmentId && item.installed);
}

export function missingCriticalEquipment(profile: VesselProfile) {
  return profile.equipment.filter((item) => item.critical && !item.installed);
}

export function validateVesselProfile(profile: VesselProfile): VesselReadinessFinding[] {
  const findings: VesselReadinessFinding[] = [];

  if (!profile.dimensions.loaMeters || !profile.dimensions.beamMeters || !profile.dimensions.draftMeters) {
    findings.push({
      id: 'finding:vessel-dimensions-incomplete',
      severity: 'blocker',
      text: 'LOA, beam and draft are required before a vessel profile can support passage planning.'
    });
  }

  if (!profile.engine) {
    findings.push({
      id: 'finding:vessel-engine-missing',
      severity: 'warning',
      text: 'Engine data is missing; engine-related checklists cannot be vessel-specific.'
    });
  }

  const missingCritical = missingCriticalEquipment(profile);
  for (const item of missingCritical) {
    findings.push({
      id: `finding:missing-critical:${item.id}`,
      severity: 'blocker',
      text: `Critical equipment is not marked as installed: ${item.name}.`
    });
  }

  if (!hasInstalledEquipment(profile, 'equipment:fixed-vhf-dsc')) {
    findings.push({
      id: 'finding:fixed-vhf-dsc-missing',
      severity: 'warning',
      text: 'No installed fixed VHF/DSC radio is recorded for coastal passage communication planning.'
    });
  }

  if (!hasInstalledEquipment(profile, 'equipment:ais-transponder')) {
    findings.push({
      id: 'finding:ais-transponder-missing',
      severity: 'info',
      text: 'No AIS transponder is recorded; traffic awareness content should not assume own-ship AIS transmission.'
    });
  }

  return findings;
}

export function summarizeVesselProfile(profile: VesselProfile) {
  const installedEquipment = profile.equipment.filter((item) => item.installed);
  const criticalEquipment = profile.equipment.filter((item) => item.critical);
  const findings = validateVesselProfile(profile);

  return {
    installedEquipmentCount: installedEquipment.length,
    criticalEquipmentCount: criticalEquipment.length,
    missingCriticalEquipmentCount: missingCriticalEquipment(profile).length,
    blockerCount: findings.filter((finding) => finding.severity === 'blocker').length,
    warningCount: findings.filter((finding) => finding.severity === 'warning').length,
    assumptionCount: profile.assumptions.length
  };
}
