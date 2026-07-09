import { describe, expect, it } from 'vitest';
import { coreRadioCallCards } from '$lib/content/radioCallCards';
import {
  h323ElinaRadioLogExamples,
  h323ElinaRadioLogFollowUps,
  h323ElinaRadioLogSummary
} from '$lib/content/radioLogs';
import {
  createRadioLogEntryFromCard,
  findRadioLogEntriesNeedingFollowUp,
  radioLogReadBackChecklist,
  summarizeRadioLog
} from './radioLogs';

describe('radio log entries', () => {
  it('creates a structured radio log entry from a call card without losing vessel identity', () => {
    const mobCard = coreRadioCallCards.find((card) => card.situationId === 'radio:h323-elina:mob-mayday');
    expect(mobCard).toBeDefined();

    const entry = createRadioLogEntryFromCard(mobCard!, {
      id: 'radio-log:test:mob',
      timestamp: '2026-07-26T09:00:00+03:00',
      position: 'MOB waypoint from plotter',
      actionTaken: 'Point, mark MOB, rehearse call silently and start recovery manoeuvre.',
      crewRoles: ['Skipper: helm', 'Crew: pointer']
    });

    expect(entry.vesselName).toContain('Elina');
    expect(entry.vesselName).toContain('DH5891');
    expect(entry.urgency).toBe('distress');
    expect(entry.tags).toContain('radio-log');
    expect(entry.tags).toContain('distress');
  });

  it('summarizes the H-323 radio log example pack for a cockpit handover', () => {
    expect(h323ElinaRadioLogSummary.entryCount).toBe(3);
    expect(h323ElinaRadioLogSummary.sentCalls).toBe(1);
    expect(h323ElinaRadioLogSummary.decisionNotes).toBe(1);
    expect(h323ElinaRadioLogSummary.trainingNotes).toBe(1);
    expect(h323ElinaRadioLogSummary.highestUrgency).toBe('distress');
    expect(h323ElinaRadioLogSummary.firstCriticalEntry).toContain('MOB Mayday rehearsal');
  });

  it('keeps position and follow-up prompts visible for safety-sensitive calls', () => {
    const summary = summarizeRadioLog(h323ElinaRadioLogExamples);

    expect(summary.missingPositionEntries).toBe(0);
    expect(summary.followUpCount).toBe(2);
    expect(summary.readBackChecklist).toContain('Position source or reason position was not available');
    expect(radioLogReadBackChecklist).toContain('Action taken by helm, lookout and radio operator');
  });

  it('returns only entries that still need follow-up', () => {
    const followUps = findRadioLogEntriesNeedingFollowUp(h323ElinaRadioLogExamples);

    expect(followUps).toEqual(h323ElinaRadioLogFollowUps);
    expect(followUps).toHaveLength(2);
    expect(followUps.map((entry) => entry.id)).toContain('radio-log:h323-elina:tallinn-traffic-decision');
  });
});
