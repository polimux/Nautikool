import { describe, expect, it } from 'vitest';
import {
  coreAisWatchDebriefs,
  h323ElinaFogBankAisDebrief,
  h323ElinaFogBankDebriefScenarioNotes
} from '$lib/content/aisDebriefs';
import { h323ElinaFogBankAisBrief, h323ElinaFogBankAisScenario } from '$lib/content/aisWatchBriefs';
import { buildAisWatchDebrief } from './aisDebriefs';

describe('AIS watch debriefs', () => {
  it('builds a skipper-facing debrief from an AIS watch brief', () => {
    const debrief = buildAisWatchDebrief(h323ElinaFogBankAisScenario, h323ElinaFogBankAisBrief);

    expect(debrief.scenarioId).toBe('ais-scenario:h323-elina-fog-bank-watch-brief');
    expect(debrief.headline).toContain('urgent traffic');
    expect(debrief.lessons.map((lesson) => lesson.focus)).toContain('colreg-decision');
    expect(debrief.lessons.map((lesson) => lesson.focus)).toContain('data-quality');
    expect(debrief.positiveSignals.join(' ')).toContain('AIS prompts action');
    expect(debrief.safetyNote).toContain('COLREGs');
  });

  it('keeps fog-bank debrief content practical for family crew training', () => {
    expect(h323ElinaFogBankAisDebrief.title).toContain('fog-bank');
    expect(h323ElinaFogBankAisDebrief.followUpDrill).toContain('bearing trend');
    expect(h323ElinaFogBankDebriefScenarioNotes.join(' ')).toContain('fallback');
    expect(h323ElinaFogBankDebriefScenarioNotes.join(' ')).toContain('stale');
  });

  it('registers debriefs for all AIS watch brief drills', () => {
    expect(coreAisWatchDebriefs.length).toBeGreaterThanOrEqual(3);
    expect(coreAisWatchDebriefs.every((item) => item.debrief.scenarioId === item.scenario.id)).toBe(true);
    expect(coreAisWatchDebriefs.every((item) => item.debrief.safetyNote.includes('training'))).toBe(true);
  });
});
