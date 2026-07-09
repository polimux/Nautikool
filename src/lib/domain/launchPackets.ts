import type { DepartureSkipperBrief } from './departureBrief';

export type LaunchPacketStatus = 'ready' | 'caution' | 'blocked';

export interface LaunchPacketAction {
  id: string;
  label: string;
  owner: string;
  due: 'before-leaving-berth' | 'before-open-water' | 'during-first-watch' | 'after-arrival';
  required: boolean;
}

export interface LaunchPacketCrewRole {
  name: string;
  role: string;
  readAloudDuty: string;
}

export interface LaunchPacketInput {
  id: string;
  title: string;
  brief: DepartureSkipperBrief;
  departureWindowLabel: string;
  crewRoles: LaunchPacketCrewRole[];
  berthDepartureActions: LaunchPacketAction[];
  openWaterActions: LaunchPacketAction[];
  firstWatchActions: LaunchPacketAction[];
  emergencyReferenceLines: string[];
  paperPackItems: string[];
  limitations: string[];
}

export interface LaunchPacket {
  id: string;
  title: string;
  vesselName: string;
  passageTitle: string;
  status: LaunchPacketStatus;
  canLeaveBerth: boolean;
  departureWindowLabel: string;
  requiredActionCount: number;
  openRequiredActionCount: number;
  crewRoleCount: number;
  paperPackCount: number;
  firstAction: string;
  briefingLines: string[];
  cockpitChecklist: string[];
  crewRoles: LaunchPacketCrewRole[];
  actions: LaunchPacketAction[];
  emergencyReferenceLines: string[];
  limitations: string[];
}

function packetStatusFor(input: LaunchPacketInput, openRequiredActionCount: number): LaunchPacketStatus {
  if (!input.brief.canDepart || input.brief.status === 'no-go' || openRequiredActionCount > 0) {
    return 'blocked';
  }

  if (input.brief.status === 'caution') {
    return 'caution';
  }

  return 'ready';
}

function sortedActions(input: LaunchPacketInput): LaunchPacketAction[] {
  return [...input.berthDepartureActions, ...input.openWaterActions, ...input.firstWatchActions];
}

function buildCockpitChecklist(input: LaunchPacketInput, actions: LaunchPacketAction[]): string[] {
  const requiredActions = actions.filter((action) => action.required);

  return [
    `Read status aloud: ${input.brief.status.toUpperCase()} / ${input.brief.headline}`,
    `Close required launch actions: ${requiredActions.map((action) => action.label).join(' | ') || 'none'}`,
    `Assign crew roles: ${input.crewRoles.map((role) => `${role.name}=${role.role}`).join(' | ')}`,
    `Place paper pack in cockpit: ${input.paperPackItems.join(' | ')}`,
    `Emergency reference: ${input.emergencyReferenceLines[0] ?? 'MOB, Mayday and engine-stop references must be visible.'}`,
    'Write actual departure time, engine hours and first waypoint before leaving the berth.'
  ];
}

export function buildLaunchPacket(input: LaunchPacketInput): LaunchPacket {
  const actions = sortedActions(input);
  const requiredActionCount = actions.filter((action) => action.required).length;
  const openRequiredActionCount = input.brief.canDepart ? 0 : requiredActionCount;
  const status = packetStatusFor(input, openRequiredActionCount);
  const firstAction = actions.find((action) => action.required)?.label ?? input.brief.firstAction;
  const limitations = [
    'Launch packets are static cockpit preparation content, not live navigation, weather, traffic or harbour clearance.',
    'A blocked launch packet means the crew must stop and rebuild the departure decision before leaving the berth.',
    ...input.brief.limitations,
    ...input.limitations
  ];

  return {
    id: input.id,
    title: input.title,
    vesselName: input.brief.vesselName,
    passageTitle: input.brief.passageTitle,
    status,
    canLeaveBerth: status !== 'blocked',
    departureWindowLabel: input.departureWindowLabel,
    requiredActionCount,
    openRequiredActionCount,
    crewRoleCount: input.crewRoles.length,
    paperPackCount: input.paperPackItems.length,
    firstAction,
    briefingLines: [
      `${input.brief.vesselName} launch packet for ${input.brief.passageTitle}: ${status.toUpperCase()}.`,
      `Departure window: ${input.departureWindowLabel}.`,
      `First action before lines off: ${firstAction}`,
      `Crew read-back: ${input.crewRoles.map((role) => `${role.name} ${role.readAloudDuty}`).join('; ')}.`,
      'If any live condition differs from the packet, pause departure and rebuild the dashboard.'
    ],
    cockpitChecklist: buildCockpitChecklist(input, actions),
    crewRoles: input.crewRoles,
    actions,
    emergencyReferenceLines: input.emergencyReferenceLines,
    limitations
  };
}
