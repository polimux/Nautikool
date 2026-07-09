import { buildAisWatchDebrief } from '$lib/domain/aisDebriefs';
import { coreAisWatchBriefDrills, h323ElinaFogBankAisBrief, h323ElinaFogBankAisScenario } from './aisWatchBriefs';

export const h323ElinaFogBankAisDebrief = buildAisWatchDebrief(
  h323ElinaFogBankAisScenario,
  h323ElinaFogBankAisBrief
);

export const coreAisWatchDebriefs = coreAisWatchBriefDrills.map((drill) => ({
  scenario: drill.scenario,
  summary: drill.summary,
  brief: drill.brief,
  debrief: buildAisWatchDebrief(drill.scenario, drill.brief)
}));

export const h323ElinaFogBankDebriefScenarioNotes = [
  'Ask one crew member to describe the fresh commercial target without using the chartplotter name first.',
  'Ask another crew member to identify the stale or unreliable target and explain why it should not drive a manoeuvre.',
  'Close the drill by naming the first conservative fallback: reduce speed, increase lookout, hold outside harbour traffic or divert early.'
];
