import type { LaunchPacket, LaunchPacketAction } from './launchPackets';
import { h323ElinaTurkuParnuLaunchPacket } from '$lib/content/launchPackets';

export type WatchKickoffStatus = 'ready' | 'caution' | 'blocked';
export type WatchKickoffCadence = 'at-lines-off' | 'within-15-minutes' | 'within-30-minutes' | 'before-open-water' | 'hourly';

export interface WatchKickoffTask {
  id: string;
  title: string;
  owner: string;
  cadence: WatchKickoffCadence;
  required: boolean;
  readAloud: string;
}

export interface WatchKickoffInput {
  id: string;
  title: string;
  launchPacket: LaunchPacket;
  watchName: string;
  watchDurationMinutes: number;
  crewEnergyPrompt: string;
  navigationPrompts: string[];
  trafficPrompts: string[];
  engineeringPrompts: string[];
  taskCards: WatchKickoffTask[];
  handoverTriggers: string[];
  limitations: string[];
}

export interface WatchKickoff {
  id: string;
  title: string;
  vesselName: string;
  passageTitle: string;
  watchName: string;
  status: WatchKickoffStatus;
  canStartWatch: boolean;
  requiredTaskCount: number;
  openBlockerCount: number;
  watchDurationMinutes: number;
  firstTask: string;
  readAloudBrief: string[];
  timerCards: string[];
  handoverLines: string[];
  taskCards: WatchKickoffTask[];
  limitations: string[];
}

function statusFromLaunchPacket(packet: LaunchPacket, requiredTasks: number): WatchKickoffStatus {
  if (!packet.canLeaveBerth || packet.status === 'blocked') {
    return 'blocked';
  }

  if (packet.status === 'caution' || requiredTasks > 0) {
    return 'caution';
  }

  return 'ready';
}

function launchActionTimerCards(actions: LaunchPacketAction[]): string[] {
  return actions
    .filter((action) => action.due === 'during-first-watch' || action.due === 'before-open-water')
    .map((action) => `${action.due}: ${action.owner} — ${action.label}`);
}

export function buildWatchKickoff(input: WatchKickoffInput): WatchKickoff {
  const requiredTaskCount = input.taskCards.filter((task) => task.required).length;
  const status = statusFromLaunchPacket(input.launchPacket, requiredTaskCount);
  const openBlockerCount = input.launchPacket.canLeaveBerth ? 0 : requiredTaskCount + input.launchPacket.openRequiredActionCount;
  const firstTask = input.taskCards[0]?.title ?? input.launchPacket.firstAction;
  const limitationLines = [
    'Watch kickoff cards are static crew-briefing prompts, not live lookout, navigation, weather or engine monitoring.',
    'If the launch packet is blocked, the first watch must not start as a workaround for an unresolved departure decision.',
    ...input.limitations,
    ...input.launchPacket.limitations
  ];

  return {
    id: input.id,
    title: input.title,
    vesselName: input.launchPacket.vesselName,
    passageTitle: input.launchPacket.passageTitle,
    watchName: input.watchName,
    status,
    canStartWatch: status !== 'blocked',
    requiredTaskCount,
    openBlockerCount,
    watchDurationMinutes: input.watchDurationMinutes,
    firstTask,
    readAloudBrief: [
      `${input.watchName} kickoff for ${input.launchPacket.vesselName}: ${status.toUpperCase()}.`,
      `Watch duration target: ${input.watchDurationMinutes} minutes before formal handover or skipper reset.`,
      `First task: ${firstTask}.`,
      `Crew energy prompt: ${input.crewEnergyPrompt}.`,
      `Navigation prompts: ${input.navigationPrompts.join(' | ')}.`,
      `Traffic prompts: ${input.trafficPrompts.join(' | ')}.`,
      `Engineering prompts: ${input.engineeringPrompts.join(' | ')}.`
    ],
    timerCards: [
      ...input.taskCards.map((task) => `${task.cadence}: ${task.owner} — ${task.readAloud}`),
      ...launchActionTimerCards(input.launchPacket.actions)
    ],
    handoverLines: [
      `Handover trigger list: ${input.handoverTriggers.join(' | ')}.`,
      'Record actual position source, sail setup, engine state, crew energy and next bailout decision before the next watch takes over.',
      'Any uncertainty about traffic, weather, engine confidence or crew fatigue escalates to skipper immediately.'
    ],
    taskCards: input.taskCards,
    limitations: limitationLines
  };
}

export const h323ElinaTurkuParnuFirstWatchKickoffInput: WatchKickoffInput = {
  id: 'watch-kickoff:h323-elina:turku-parnu:first-watch',
  title: 'H-323 Elina Turku to Pärnu first-watch kickoff',
  launchPacket: h323ElinaTurkuParnuLaunchPacket,
  watchName: 'First daylight family watch after lines off',
  watchDurationMinutes: 90,
  crewEnergyPrompt:
    'Each crew member says green/yellow/red for energy, warmth, seasickness and attention before the route commits to exposed water',
  navigationPrompts: [
    'Confirm actual departure time, log position source and first waypoint on paper',
    'Name the next bailout harbour before leaving sheltered water',
    'Recheck distance remaining against the 50 nm family-day target'
  ],
  trafficPrompts: [
    'Compare visual lookout with AIS targets before trusting the screen',
    'Call out any ferry, fast craft or target without CPA/TCPA early',
    'Keep Ray90/handheld VHF location visible to the cockpit team'
  ],
  engineeringPrompts: [
    'Check cooling water, charging confidence and engine sound while still near bailout options',
    'Write fuel-confidence and engine-hour note before the first long motor-sail',
    'Escalate filter, belt, overheating or charging uncertainty before open water'
  ],
  taskCards: [
    {
      id: 'watch-task:first-position-log',
      title: 'Write first underway position and source',
      owner: 'Father with skipper confirmation',
      cadence: 'within-15-minutes',
      required: true,
      readAloud: 'Log time, position source, first waypoint and next bailout harbour while the crew is still fresh'
    },
    {
      id: 'watch-task:son-safety-loop',
      title: 'Run simple safety loop',
      owner: 'Son',
      cadence: 'within-30-minutes',
      required: false,
      readAloud: 'Confirm lifejackets, clipped-in policy if needed, water bottles and handheld VHF location'
    },
    {
      id: 'watch-task:open-water-gate',
      title: 'Skipper open-water gate',
      owner: 'Philipp',
      cadence: 'before-open-water',
      required: true,
      readAloud: 'Say wind, gusts, visibility, engine confidence, crew energy and abort harbour before committing offshore'
    },
    {
      id: 'watch-task:hourly-reset',
      title: 'Hourly cockpit reset',
      owner: 'All crew',
      cadence: 'hourly',
      required: false,
      readAloud: 'Repeat traffic, weather, route, engine and crew-energy scan; stop if the answer is not clear'
    }
  ],
  handoverTriggers: [
    'before exposed open-water commitment',
    'crew energy drops to yellow/red',
    'AIS/visual traffic picture disagrees',
    'engine confidence changes',
    'planned leg starts drifting beyond conservative daylight target'
  ],
  limitations: [
    'This first-watch content assumes the crew already completed the launch packet and still needs live weather, traffic and harbour verification.',
    'Family-crew learning tasks must stop immediately when lookout, navigation, reefing, engine care or collision avoidance needs attention.'
  ]
};

export const h323ElinaTurkuParnuFirstWatchKickoff = buildWatchKickoff(
  h323ElinaTurkuParnuFirstWatchKickoffInput
);

export const coreWatchKickoffs = [h323ElinaTurkuParnuFirstWatchKickoff];
