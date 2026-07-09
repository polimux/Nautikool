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
