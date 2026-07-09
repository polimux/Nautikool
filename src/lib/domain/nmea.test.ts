import { describe, expect, it } from 'vitest';
import {
  h323ElinaNmeaNetworkProfile,
  h323ElinaNmeaNetworkSummary
} from '$lib/content/nmeaNetworks';
import { summarizeNmeaNetwork } from './nmea';


describe('NMEA/AIS network readiness', () => {
  it('summarizes the H-323 Elina network profile for cockpit readiness', () => {
    expect(h323ElinaNmeaNetworkProfile.vesselId).toBe('vessel:h323-elina');
    expect(h323ElinaNmeaNetworkSummary.installedDevices).toBe(4);
    expect(h323ElinaNmeaNetworkSummary.criticalDevices).toBe(3);
    expect(h323ElinaNmeaNetworkSummary.transmitPgns).toBeGreaterThanOrEqual(4);
    expect(h323ElinaNmeaNetworkSummary.receivePgns).toBeGreaterThanOrEqual(4);
  });

  it('keeps network power documentation visible as a warning', () => {
    expect(h323ElinaNmeaNetworkSummary.findings.map((finding) => finding.id)).toContain(
      'nmea:power-injection-unknown'
    );
    expect(h323ElinaNmeaNetworkSummary.warnings).toBe(1);
    expect(h323ElinaNmeaNetworkSummary.blockers).toBe(0);
  });

  it('flags invalid backbone termination as a blocker', () => {
    const assessment = summarizeNmeaNetwork({
      ...h323ElinaNmeaNetworkProfile,
      backbone: {
        ...h323ElinaNmeaNetworkProfile.backbone,
        terminatorCount: 1,
        powerInjectionKnown: true
      }
    });

    expect(assessment.blockers).toBe(1);
    expect(assessment.findings.map((finding) => finding.id)).toContain('nmea:terminators-invalid');
  });

  it('flags missing GNSS position source before DSC or AIS-dependent workflows are trusted', () => {
    const assessment = summarizeNmeaNetwork({
      ...h323ElinaNmeaNetworkProfile,
      devices: h323ElinaNmeaNetworkProfile.devices.map((device) =>
        device.id === 'nmea-device:em-trak-b953'
          ? {
              ...device,
              pgns: device.pgns.filter((capability) => capability.pgn !== 129029)
            }
          : device
      ),
      backbone: {
        ...h323ElinaNmeaNetworkProfile.backbone,
        powerInjectionKnown: true
      }
    });

    expect(assessment.blockers).toBe(1);
    expect(assessment.findings.map((finding) => finding.id)).toContain('nmea:position-source-missing');
  });

  it('preserves skipper-facing PGN explanations in the content profile', () => {
    const b953 = h323ElinaNmeaNetworkProfile.devices.find((device) => device.id === 'nmea-device:em-trak-b953');
    const aisClassB = b953?.pgns.find((capability) => capability.pgn === 129039);

    expect(aisClassB?.userValue).toContain('small-craft AIS targets');
    expect(h323ElinaNmeaNetworkProfile.assumptions.some((assumption) => assumption.includes('skipper language'))).toBe(
      true
    );
  });
});
