export type NmeaProtocol = 'nmea-0183' | 'nmea-2000' | 'seatalk-ng' | 'wifi' | 'unknown';

export type NmeaDeviceRole =
  | 'position-source'
  | 'ais-transponder'
  | 'vhf-dsc'
  | 'chartplotter'
  | 'navigation-app'
  | 'gateway'
  | 'power'
  | 'terminator'
  | 'unknown';

export interface NmeaPgnCapability {
  pgn: number;
  label: string;
  direction: 'transmit' | 'receive';
  userValue: string;
}

export interface NmeaNetworkDevice {
  id: string;
  name: string;
  role: NmeaDeviceRole;
  protocols: NmeaProtocol[];
  installed: boolean;
  critical: boolean;
  pgns: NmeaPgnCapability[];
  notes: string[];
}

export interface NmeaNetworkProfile {
  id: string;
  title: string;
  vesselId: string;
  description: string;
  devices: NmeaNetworkDevice[];
  backbone: {
    protocol: NmeaProtocol;
    terminatorCount?: number;
    powerInjectionKnown: boolean;
    notes: string[];
  };
  assumptions: string[];
  contentVersion: string;
}

export interface NmeaNetworkFinding {
  id: string;
  severity: 'info' | 'warning' | 'blocker';
  text: string;
  recommendation: string;
}

export interface NmeaNetworkSummary {
  installedDevices: number;
  criticalDevices: number;
  transmitPgns: number;
  receivePgns: number;
  warnings: number;
  blockers: number;
  findings: NmeaNetworkFinding[];
}

export type AisTargetClass = 'class-a' | 'class-b' | 'base-station' | 'unknown';

export interface AisTargetSnapshot {
  mmsi: string;
  name?: string;
  targetClass: AisTargetClass;
  rangeNm: number;
  bearingDegrees?: number;
  cogDegrees?: number;
  sogKn?: number;
  cpaNm?: number;
  tcpaMinutes?: number;
  ageSeconds: number;
  notes: string[];
}

export interface AisTrafficScenario {
  id: string;
  title: string;
  vesselId: string;
  area: string;
  description: string;
  targets: AisTargetSnapshot[];
  assumptions: string[];
  contentVersion: string;
}

export interface AisTrafficFinding {
  id: string;
  severity: 'info' | 'warning' | 'blocker';
  targetMmsi?: string;
  text: string;
  recommendation: string;
}

export interface AisTrafficSummary {
  targetCount: number;
  staleTargets: number;
  closeTargets: number;
  fastClosingTargets: number;
  warnings: number;
  blockers: number;
  findings: AisTrafficFinding[];
}

export interface AisTrafficSummaryOptions {
  staleAfterSeconds?: number;
  closeCpaNm?: number;
  fastClosingTcpaMinutes?: number;
}

function hasInstalledTransmitter(profile: NmeaNetworkProfile, pgns: number[]): boolean {
  return profile.devices.some(
    (device) =>
      device.installed &&
      device.pgns.some((capability) => capability.direction === 'transmit' && pgns.includes(capability.pgn))
  );
}

function hasInstalledReceiver(profile: NmeaNetworkProfile, pgns: number[]): boolean {
  return profile.devices.some(
    (device) =>
      device.installed &&
      device.pgns.some((capability) => capability.direction === 'receive' && pgns.includes(capability.pgn))
  );
}

function finding(
  id: string,
  severity: NmeaNetworkFinding['severity'],
  text: string,
  recommendation: string
): NmeaNetworkFinding {
  return { id, severity, text, recommendation };
}

function trafficFinding(
  id: string,
  severity: AisTrafficFinding['severity'],
  text: string,
  recommendation: string,
  targetMmsi?: string
): AisTrafficFinding {
  return { id, severity, text, recommendation, targetMmsi };
}

export const coreNmeaReferencePgns: NmeaPgnCapability[] = [
  {
    pgn: 129029,
    label: 'GNSS position data',
    direction: 'transmit',
    userValue: 'Feeds trustworthy position to DSC, AIS, plotter and navigation apps when the source is valid.'
  },
  {
    pgn: 129038,
    label: 'AIS Class A position report',
    direction: 'receive',
    userValue: 'Lets the cockpit system reason about commercial traffic and larger vessels.'
  },
  {
    pgn: 129039,
    label: 'AIS Class B position report',
    direction: 'receive',
    userValue: 'Lets the cockpit system reason about yacht and small-craft AIS targets.'
  },
  {
    pgn: 129026,
    label: 'COG and SOG rapid update',
    direction: 'transmit',
    userValue: 'Supports ETA, track monitoring and cross-checking whether the boat is making planned speed.'
  }
];

export function getDevicesByRole(profile: NmeaNetworkProfile, role: NmeaDeviceRole): NmeaNetworkDevice[] {
  return profile.devices.filter((device) => device.role === role);
}

export function getInstalledNetworkDevices(profile: NmeaNetworkProfile): NmeaNetworkDevice[] {
  return profile.devices.filter((device) => device.installed);
}

export function summarizeAisTraffic(
  scenario: AisTrafficScenario,
  options: AisTrafficSummaryOptions = {}
): AisTrafficSummary {
  const staleAfterSeconds = options.staleAfterSeconds ?? 180;
  const closeCpaNm = options.closeCpaNm ?? 0.5;
  const fastClosingTcpaMinutes = options.fastClosingTcpaMinutes ?? 20;
  const findings: AisTrafficFinding[] = [];

  for (const target of scenario.targets) {
    const targetLabel = target.name ? `${target.name} (${target.mmsi})` : target.mmsi;

    if (target.ageSeconds > staleAfterSeconds) {
      findings.push(
        trafficFinding(
          `ais:target-stale:${target.mmsi}`,
          'warning',
          `${targetLabel} has not updated for ${target.ageSeconds} seconds.`,
          'Treat the target as stale, intensify visual lookout and avoid making a close-quarters decision from old AIS data.',
          target.mmsi
        )
      );
    }

    if (target.cpaNm !== undefined && target.cpaNm <= closeCpaNm) {
      const isFastClosing =
        target.tcpaMinutes !== undefined && target.tcpaMinutes >= 0 && target.tcpaMinutes <= fastClosingTcpaMinutes;

      findings.push(
        trafficFinding(
          `ais:close-cpa:${target.mmsi}`,
          isFastClosing ? 'blocker' : 'warning',
          `${targetLabel} has planned CPA ${target.cpaNm} nm${
            target.tcpaMinutes !== undefined ? ` in ${target.tcpaMinutes} minutes` : ''
          }.`,
          isFastClosing
            ? 'Do not continue as planned; confirm visually, apply COLREGs early, alter course decisively if required and use VHF only as a support channel.'
            : 'Monitor bearing, CPA/TCPA trend and visual aspect; brief the watch before the target becomes urgent.',
          target.mmsi
        )
      );
    }

    if (target.rangeNm <= 2 && target.cpaNm === undefined) {
      findings.push(
        trafficFinding(
          `ais:close-target-without-cpa:${target.mmsi}`,
          'warning',
          `${targetLabel} is within ${target.rangeNm} nm but has no CPA/TCPA value in the snapshot.`,
          'Use visual bearings, compass bearing trend and conservative speed/course changes instead of assuming AIS has enough data.',
          target.mmsi
        )
      );
    }

    if (target.targetClass === 'class-a' && target.rangeNm <= 5) {
      findings.push(
        trafficFinding(
          `ais:class-a-nearby:${target.mmsi}`,
          'info',
          `${targetLabel} is a Class A target within ${target.rangeNm} nm.`,
          'Commercial traffic should be discussed early on watch, even when CPA currently looks acceptable.',
          target.mmsi
        )
      );
    }
  }

  const staleTargets = scenario.targets.filter((target) => target.ageSeconds > staleAfterSeconds).length;
  const closeTargets = scenario.targets.filter((target) => target.cpaNm !== undefined && target.cpaNm <= closeCpaNm).length;
  const fastClosingTargets = scenario.targets.filter(
    (target) =>
      target.cpaNm !== undefined &&
      target.cpaNm <= closeCpaNm &&
      target.tcpaMinutes !== undefined &&
      target.tcpaMinutes >= 0 &&
      target.tcpaMinutes <= fastClosingTcpaMinutes
  ).length;

  return {
    targetCount: scenario.targets.length,
    staleTargets,
    closeTargets,
    fastClosingTargets,
    warnings: findings.filter((item) => item.severity === 'warning').length,
    blockers: findings.filter((item) => item.severity === 'blocker').length,
    findings
  };
}

export function summarizeNmeaNetwork(profile: NmeaNetworkProfile): NmeaNetworkSummary {
  const installedDevices = getInstalledNetworkDevices(profile);
  const findings: NmeaNetworkFinding[] = [];

  if (profile.backbone.protocol === 'nmea-2000' || profile.backbone.protocol === 'seatalk-ng') {
    if (profile.backbone.terminatorCount === undefined) {
      findings.push(
        finding(
          'nmea:terminators-unknown',
          'warning',
          'Backbone terminator count is not recorded.',
          'Confirm one terminator at each physical end of the SeaTalkNG/NMEA2000 backbone before relying on network data.'
        )
      );
    } else if (profile.backbone.terminatorCount !== 2) {
      findings.push(
        finding(
          'nmea:terminators-invalid',
          'blocker',
          `Backbone has ${profile.backbone.terminatorCount} recorded terminator(s), expected 2.`,
          'Fix the backbone termination before troubleshooting sensors, AIS targets or plotter data.'
        )
      );
    }
  }

  if (!profile.backbone.powerInjectionKnown) {
    findings.push(
      finding(
        'nmea:power-injection-unknown',
        'warning',
        'Backbone power injection and fuse location are not recorded.',
        'Document the network power tee, fuse size and switch path so a dark network can be diagnosed underway.'
      )
    );
  }

  if (!hasInstalledTransmitter(profile, [129029, 129025])) {
    findings.push(
      finding(
        'nmea:position-source-missing',
        'blocker',
        'No installed position source is recorded for the network.',
        'Record which device provides GNSS position before treating DSC, AIS or ETA logic as reliable.'
      )
    );
  }

  if (!hasInstalledTransmitter(profile, [129038, 129039]) && !hasInstalledReceiver(profile, [129038, 129039])) {
    findings.push(
      finding(
        'nmea:ais-data-not-modelled',
        'warning',
        'AIS target data is not modelled on the network.',
        'Add the AIS transponder, gateway or plotter path that receives AIS Class A/B target reports.'
      )
    );
  }

  const missingCriticalDevices = profile.devices.filter((device) => device.critical && !device.installed);
  for (const device of missingCriticalDevices) {
    findings.push(
      finding(
        `nmea:critical-device-missing:${device.id}`,
        'blocker',
        `${device.name} is marked critical but not installed.`,
        'Do not use dependent navigation or distress workflows until this device is installed or the profile is corrected.'
      )
    );
  }

  return {
    installedDevices: installedDevices.length,
    criticalDevices: profile.devices.filter((device) => device.critical).length,
    transmitPgns: installedDevices.flatMap((device) => device.pgns).filter((capability) => capability.direction === 'transmit').length,
    receivePgns: installedDevices.flatMap((device) => device.pgns).filter((capability) => capability.direction === 'receive').length,
    warnings: findings.filter((item) => item.severity === 'warning').length,
    blockers: findings.filter((item) => item.severity === 'blocker').length,
    findings
  };
}
