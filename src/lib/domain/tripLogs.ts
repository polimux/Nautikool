export type TripLogEntryType =
  | 'departure'
  | 'underway'
  | 'arrival'
  | 'incident'
  | 'maintenance'
  | 'lesson';

export type TripLogSeverity = 'info' | 'caution' | 'blocker';

export interface TripLogEntry {
  id: string;
  vesselId: string;
  passagePlanId?: string;
  timestamp: string;
  entryType: TripLogEntryType;
  title: string;
  summary: string;
  position?: string;
  weather?: {
    windKn?: number;
    gustKn?: number;
    waveMeters?: number;
    visibility?: 'good' | 'reduced' | 'poor';
    note?: string;
  };
  engineHours?: number;
  sailSetup?: string;
  crewState?: string;
  actionTaken?: string;
  severity: TripLogSeverity;
  followUp?: string;
  tags: string[];
}

export interface TripLogSummary {
  entryCount: number;
  incidentCount: number;
  maintenanceNotes: number;
  lessonCount: number;
  cautionEntries: number;
  blockerEntries: number;
  missingPositionEntries: number;
  firstCriticalEntry?: string;
  engineHoursDelta?: number;
  followUps: string[];
  debriefPrompts: string[];
}

export const tripLogDebriefPrompts = [
  'What changed between the passage plan and the real passage?',
  'Which navigation, weather or traffic assumption was wrong or incomplete?',
  'Which maintenance, spare or equipment issue must be closed before the next leg?',
  'What should the skipper brief differently for the same crew next time?'
];

function sortByTimestamp(entries: TripLogEntry[]): TripLogEntry[] {
  return [...entries].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

export function summarizeTripLog(entries: TripLogEntry[]): TripLogSummary {
  const orderedEntries = sortByTimestamp(entries);
  const engineHourEntries = orderedEntries
    .map((entry) => entry.engineHours)
    .filter((hours): hours is number => hours !== undefined);
  const engineHoursDelta =
    engineHourEntries.length >= 2
      ? Number((engineHourEntries[engineHourEntries.length - 1] - engineHourEntries[0]).toFixed(1))
      : undefined;
  const criticalEntries = orderedEntries.filter(
    (entry) => entry.severity === 'blocker' || entry.severity === 'caution'
  );

  return {
    entryCount: entries.length,
    incidentCount: entries.filter((entry) => entry.entryType === 'incident').length,
    maintenanceNotes: entries.filter((entry) => entry.entryType === 'maintenance').length,
    lessonCount: entries.filter((entry) => entry.entryType === 'lesson').length,
    cautionEntries: entries.filter((entry) => entry.severity === 'caution').length,
    blockerEntries: entries.filter((entry) => entry.severity === 'blocker').length,
    missingPositionEntries: entries.filter(
      (entry) => entry.entryType !== 'lesson' && entry.entryType !== 'maintenance' && !entry.position
    ).length,
    firstCriticalEntry: criticalEntries[0]?.title,
    engineHoursDelta,
    followUps: orderedEntries
      .filter((entry) => entry.followUp)
      .map((entry) => `${entry.title}: ${entry.followUp}`),
    debriefPrompts: tripLogDebriefPrompts
  };
}

export function buildTripLogDebrief(entries: TripLogEntry[]): string[] {
  const summary = summarizeTripLog(entries);
  const lines = [
    `${summary.entryCount} log entries, ${summary.incidentCount} incidents, ${summary.maintenanceNotes} maintenance notes and ${summary.lessonCount} lessons recorded.`,
    summary.engineHoursDelta !== undefined
      ? `Engine-hour delta: ${summary.engineHoursDelta} h.`
      : 'Engine-hour delta unknown: record start and arrival engine hours next time.',
    summary.firstCriticalEntry
      ? `First item to review: ${summary.firstCriticalEntry}.`
      : 'No caution or blocker entry recorded.',
    summary.missingPositionEntries > 0
      ? `${summary.missingPositionEntries} operational entries need a position source before this log is complete.`
      : 'All operational entries include a position or context source.'
  ];

  if (summary.followUps.length > 0) {
    lines.push(`Follow-ups: ${summary.followUps.join(' | ')}`);
  }

  return lines;
}
