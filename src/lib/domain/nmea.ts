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

export type AisWatchActionPriority = 'immediate' | 'soon' | 'monitor';

export interface AisWatchAction {
  id: string;
  priority: AisWatchActionPriority;
  targetMmsi?: string;
  label: string;
  reason: string;
  crewInstruction: string;
}

export interface AisTrafficSummary {
  targetCount: number;
  staleTargets: number;
  closeTargets: number;
  fastClosingTargets: number;
  warnings: number;
  blockers: number;
  findings: AisTrafficFinding[];
  watchActions: AisWatchAction[];
}

export interface AisTrafficSummaryOptions {
  staleAfterSeconds?: number;
  closeCpaNm?: number;
  fastClosingTcpaMinutes?: number;
}

export interface AisWatchBrief {
  scenarioId: string;
  title: string;
  area: string;
  headline: string;
  immediateActions: AisWatchAction[];
  soonActions: AisWatchAction[];
  monitorActions: AisWatchAction[];
  watchHandover: string[];
  limitations: string[];
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

function watchAction(
  id: string,
  priority: AisWatchActionPriority,
  label: string,
  reason: string,
  crewInstruction: string,
  targetMmsi?: string
): AisWatchAction {
  return { id, priority, label, reason, crewInstruction, targetMmsi };
}

function priorityRank(priority: AisWatchActionPriority): number {
  switch (priority) {
    case 'immediate':
      return 0;
    case 'soon':
      return 1;
    case 'monitor':
      return 2;
  }
}

function compactActionLine(action: AisWatchAction): string {
  return `${action.priority.toUpperCase()}: ${action.label} — ${action.crewInstruction}`;
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
  const watchActions: AisWatchAction[] = [];

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
      watchActions.push(
        watchAction(
          `ais-action:stale-target:${target.mmsi}`,
          'soon',
          'Treat stale AIS as unreliable',
          `${targetLabel} is older than the ${staleAfterSeconds} second freshness threshold.`,
          'Assign one crew member to visual lookout and use compass-bearing trend before assuming the symbol is clear.',
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
      watchActions.push(
        watchAction(
          `ais-action:close-cpa:${target.mmsi}`,
          isFastClosing ? 'immediate' : 'soon',
          isFastClosing ? 'Resolve close CPA now' : 'Brief close CPA target',
          `${targetLabel} is predicted inside ${closeCpaNm} nm${
            target.tcpaMinutes !== undefined ? ` in ${target.tcpaMinutes} minutes` : ''
          }.`,
          isFastClosing
            ? 'Skipper takes the watch, confirms the target visually, decides the COLREG action and makes any alteration early and obvious.'
            : 'Put the target on the watch handover, monitor CPA/TCPA trend and agree the first avoiding option before it becomes urgent.',
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
      watchActions.push(
        watchAction(
          `ais-action:no-cpa:${target.mmsi}`,
          'soon',
          'Establish visual bearing trend',
          `${targetLabel} is close but has no CPA/TCPA calculation.`,
          'Take two or more visual bearings, watch the aspect and avoid waiting for the plotter to invent a safe CPA.',
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
      watchActions.push(
        watchAction(
          `ais-action:class-a-monitor:${target.mmsi}`,
          'monitor',
          'Keep Class A target in the watch picture',
          `${targetLabel} is commercial traffic within five nautical miles.`,
          'Name the target during watch handover and keep checking visual aspect, bearing and CPA trend.',
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
    findings,
    watchActions: watchActions.sort((left, right) => priorityRank(left.priority) - priorityRank(right.priority))
  };
}

export function buildAisWatchBrief(
  scenario: AisTrafficScenario,
  options: AisTrafficSummaryOptions = {}
): AisWatchBrief {
  const summary = summarizeAisTraffic(scenario, options);
  const immediateActions = summary.watchActions.filter((action) => action.priority === 'immediate');
  const soonActions = summary.watchActions.filter((action) => action.priority === 'soon');
  const monitorActions = summary.watchActions.filter((action) => action.priority === 'monitor');
  const headline =
    immediateActions.length > 0
      ? `${immediateActions.length} immediate AIS action(s): skipper takes the watch before continuing the plan.`
      : soonActions.length > 0
        ? `${soonActions.length} AIS watch action(s) need briefing before the next decision point.`
        : 'AIS snapshot has no immediate action, but visual lookout and bearing checks remain active.';

  return {
    scenarioId: scenario.id,
    title: `${scenario.title} watch brief`,
    area: scenario.area,
    headline,
    immediateActions,
    soonActions,
    monitorActions,
    watchHandover: [
      `Traffic picture: ${summary.targetCount} AIS target(s), ${summary.closeTargets} close CPA target(s), ${summary.staleTargets} stale target(s).`,
      ...summary.watchActions.slice(0, 4).map(compactActionLine),
      'Confirm the traffic picture visually before any alteration; AIS is a prompt, not proof of right-of-way or safe clearance.'
    ],
    limitations: [
      'Static drill content is not live traffic advice.',
      'AIS may be delayed, absent, misconfigured or ignored by the other vessel.',
      'COLREG action must be early, obvious and based on lookout, bearings and the full situation.'
    ]
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
