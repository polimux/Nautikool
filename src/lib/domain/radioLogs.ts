import type { RadioCallCard, RadioCallUrgency } from './radioCalls';

export type RadioLogEntryType = 'sent' | 'received' | 'decision' | 'training';

export interface RadioLogEntry {
  id: string;
  timestamp: string;
  area: string;
  channel: string;
  entryType: RadioLogEntryType;
  urgency: RadioCallUrgency;
  vesselName: string;
  situationTitle: string;
  position?: string;
  summary: string;
  actionTaken: string;
  crewRoles: string[];
  followUpAt?: string;
  tags: string[];
}

export interface RadioLogBrief {
  entryCount: number;
  sentCalls: number;
  receivedCalls: number;
  decisionNotes: number;
  trainingNotes: number;
  highestUrgency: RadioCallUrgency;
  firstCriticalEntry: string;
  missingPositionEntries: number;
  followUpCount: number;
  readBackChecklist: string[];
}

export interface RadioLogHandoverBrief {
  title: string;
  headline: string;
  highestUrgency: RadioCallUrgency;
  criticalLines: string[];
  positionPrompts: string[];
  followUpLines: string[];
  crewRoleLines: string[];
  limitations: string[];
}

const urgencyRank: Record<RadioCallUrgency, number> = {
  routine: 0,
  safety: 1,
  urgency: 2,
  distress: 3
};

export const radioLogReadBackChecklist = [
  'UTC or local time with zone',
  'VHF channel or DSC/voice path',
  'Own vessel identity',
  'Position source or reason position was not available',
  'Message summary and requested assistance',
  'Action taken by helm, lookout and radio operator',
  'Follow-up time or condition'
];

export const radioLogHandoverLimitations = [
  'This is a cockpit handover and training aid, not proof that a live radio transmission was correct.',
  'Before any real distress, urgency or safety call, copy the current position from GNSS or a plotted fix.',
  'Boat handling, lookout and collision avoidance remain the first priority while the log is being read.'
];

function sortByUrgencyThenTime(left: RadioLogEntry, right: RadioLogEntry): number {
  const urgencyDelta = urgencyRank[right.urgency] - urgencyRank[left.urgency];

  if (urgencyDelta !== 0) {
    return urgencyDelta;
  }

  return right.timestamp.localeCompare(left.timestamp);
}

function isPositionSensitive(entry: RadioLogEntry): boolean {
  return entry.entryType !== 'received' && entry.urgency !== 'routine';
}

export function createRadioLogEntryFromCard(
  card: RadioCallCard,
  options: {
    id: string;
    timestamp: string;
    entryType?: RadioLogEntryType;
    position?: string;
    summary?: string;
    actionTaken: string;
    crewRoles: string[];
    followUpAt?: string;
    tags?: string[];
  }
): RadioLogEntry {
  return {
    id: options.id,
    timestamp: options.timestamp,
    area: card.area,
    channel: card.channel,
    entryType: options.entryType ?? 'training',
    urgency: card.urgency,
    vesselName:
      card.readAloud
        .find((line) => line.startsWith('This is '))
        ?.replace('This is ', '')
        .replace('.', '') ?? 'Unknown vessel',
    situationTitle: card.title,
    position: options.position,
    summary: options.summary ?? card.readAloud.slice(0, 4).join(' / '),
    actionTaken: options.actionTaken,
    crewRoles: options.crewRoles,
    followUpAt: options.followUpAt,
    tags: [
      'radio-log',
      card.urgency,
      ...card.area
        .toLowerCase()
        .split(/\s*\/\s*|\s+/)
        .filter(Boolean),
      ...(options.tags ?? [])
    ]
  };
}

export function summarizeRadioLog(entries: RadioLogEntry[]): RadioLogBrief {
  const sortedByUrgency = [...entries].sort(sortByUrgencyThenTime);
  const highestUrgency = sortedByUrgency[0]?.urgency ?? 'routine';
  const missingPositionEntries = entries.filter(
    (entry) => isPositionSensitive(entry) && !entry.position
  ).length;

  return {
    entryCount: entries.length,
    sentCalls: entries.filter((entry) => entry.entryType === 'sent').length,
    receivedCalls: entries.filter((entry) => entry.entryType === 'received').length,
    decisionNotes: entries.filter((entry) => entry.entryType === 'decision').length,
    trainingNotes: entries.filter((entry) => entry.entryType === 'training').length,
    highestUrgency,
    firstCriticalEntry: sortedByUrgency[0]?.summary ?? 'No radio log entries available',
    missingPositionEntries,
    followUpCount: entries.filter((entry) => Boolean(entry.followUpAt)).length,
    readBackChecklist: radioLogReadBackChecklist
  };
}

export function findRadioLogEntriesNeedingFollowUp(entries: RadioLogEntry[]): RadioLogEntry[] {
  return entries.filter((entry) => Boolean(entry.followUpAt));
}

export function buildRadioLogHandoverBrief(
  entries: RadioLogEntry[],
  options: { title: string; audience?: string }
): RadioLogHandoverBrief {
  const summary = summarizeRadioLog(entries);
  const sortedEntries = [...entries].sort(sortByUrgencyThenTime);
  const positionSensitiveEntries = entries.filter(isPositionSensitive);
  const crewRoleLines = Array.from(new Set(entries.flatMap((entry) => entry.crewRoles)));

  return {
    title: options.title,
    headline: `${summary.entryCount} radio log entries for ${options.audience ?? 'the next watch'}; highest urgency is ${summary.highestUrgency}.`,
    highestUrgency: summary.highestUrgency,
    criticalLines: sortedEntries.slice(0, 3).map((entry) => {
      const position = entry.position ? ` Position: ${entry.position}.` : ' Position: copy before transmitting.';

      return `${entry.urgency.toUpperCase()} · ${entry.situationTitle}: ${entry.summary}${position} Action: ${entry.actionTaken}`;
    }),
    positionPrompts: positionSensitiveEntries.map((entry) => {
      const source = entry.position ?? 'missing position source - copy GNSS, charted fix or MOB waypoint before any live call';

      return `${entry.situationTitle}: ${source}`;
    }),
    followUpLines: entries
      .filter((entry) => Boolean(entry.followUpAt))
      .map((entry) => `${entry.situationTitle}: follow up ${entry.followUpAt}`),
    crewRoleLines,
    limitations: radioLogHandoverLimitations
  };
}
