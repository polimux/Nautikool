import { describe, expect, it } from 'vitest';
import {
  h323ElinaTripLogDebrief,
  h323ElinaTripLogSummary,
  h323ElinaTurkuParnuTripLog
} from '$lib/content/tripLogs';
import { buildTripLogDebrief, summarizeTripLog, type TripLogEntry } from './tripLogs';

describe('trip logbook domain', () => {
  it('summarizes trip entries into skipper-facing debrief metrics', () => {
    const summary = summarizeTripLog(h323ElinaTurkuParnuTripLog);

    expect(summary.entryCount).toBe(4);
    expect(summary.maintenanceNotes).toBe(1);
    expect(summary.lessonCount).toBe(1);
    expect(summary.cautionEntries).toBe(1);
    expect(summary.blockerEntries).toBe(1);
    expect(summary.firstCriticalEntry).toBe('Archipelago motor-sail and lookout rotation');
    expect(summary.engineHoursDelta).toBe(3.2);
    expect(summary.followUps).toHaveLength(2);
  });

  it('does not treat missing operational positions as complete log data', () => {
    const entries: TripLogEntry[] = [
      {
        id: 'trip-log:test:no-position',
        vesselId: 'vessel:test',
        timestamp: '2026-07-26T10:00:00+03:00',
        entryType: 'underway',
        title: 'Traffic decision without position',
        summary: 'The log captures the decision but not enough position context for later review.',
        severity: 'caution',
        tags: ['test']
      },
      {
        id: 'trip-log:test:lesson-no-position-ok',
        vesselId: 'vessel:test',
        timestamp: '2026-07-26T11:00:00+03:00',
        entryType: 'lesson',
        title: 'General crew lesson',
        summary: 'A lesson may be useful without a precise navigation position.',
        severity: 'info',
        tags: ['lesson']
      }
    ];

    expect(summarizeTripLog(entries).missingPositionEntries).toBe(1);
  });

  it('builds compact debrief lines that keep follow-ups visible', () => {
    const debrief = buildTripLogDebrief(h323ElinaTurkuParnuTripLog);

    expect(debrief[0]).toContain('4 log entries');
    expect(debrief[1]).toContain('3.2 h');
    expect(debrief.join(' ')).toContain('Primary diesel filter spare still missing');
    expect(debrief.join(' ')).toContain('All operational entries include a position');
  });

  it('publishes realistic H-323 Elina trip logbook content for the Turku to Pärnu family passage', () => {
    expect(h323ElinaTripLogSummary.entryCount).toBe(4);
    expect(h323ElinaTripLogSummary.blockerEntries).toBe(1);
    expect(h323ElinaTripLogSummary.debriefPrompts).toContain(
      'Which maintenance, spare or equipment issue must be closed before the next leg?'
    );
    expect(h323ElinaTripLogDebrief.join(' ')).toContain('Buy and label the exact primary diesel filter');
    expect(h323ElinaTurkuParnuTripLog.map((entry) => entry.tags).flat()).toContain('family-crew');
  });
});
