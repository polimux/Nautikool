import type { AisTrafficScenario, AisWatchBrief } from './nmea';

export type AisDebriefFocus = 'traffic-picture' | 'crew-communication' | 'colreg-decision' | 'data-quality';
export type AisDebriefSeverity = 'learning' | 'caution' | 'critical';

export interface AisDebriefLesson {
  id: string;
  focus: AisDebriefFocus;
  severity: AisDebriefSeverity;
  title: string;
  observation: string;
  skipperQuestion: string;
}

export interface AisWatchDebrief {
  scenarioId: string;
  title: string;
  area: string;
  headline: string;
  lessons: AisDebriefLesson[];
  positiveSignals: string[];
  followUpDrill: string;
  safetyNote: string;
}

function lesson(
  id: string,
  focus: AisDebriefFocus,
  severity: AisDebriefSeverity,
  title: string,
  observation: string,
  skipperQuestion: string
): AisDebriefLesson {
  return { id, focus, severity, title, observation, skipperQuestion };
}

export function buildAisWatchDebrief(scenario: AisTrafficScenario, brief: AisWatchBrief): AisWatchDebrief {
  const lessons: AisDebriefLesson[] = [];
  const positiveSignals: string[] = [];

  if (brief.immediateActions.length > 0) {
    lessons.push(
      lesson(
        `${scenario.id}:debrief:immediate-action`,
        'colreg-decision',
        'critical',
        'Immediate action was not optional',
        `${brief.immediateActions.length} immediate AIS action(s) required skipper ownership before continuing the original plan.`,
        'Did the skipper take the watch early enough, and was the avoiding action early, obvious and based on lookout rather than AIS alone?'
      )
    );
  } else {
    positiveSignals.push('No immediate AIS action was generated; the drill can focus on routine watch discipline.');
  }

  if (brief.soonActions.length > 1) {
    lessons.push(
      lesson(
        `${scenario.id}:debrief:handover-load`,
        'crew-communication',
        'caution',
        'Handover load needs compression',
        `${brief.soonActions.length} soon-action items compete for limited cockpit attention.`,
        'Could the watch keeper repeat the top two priorities without rereading the screen?'
      )
    );
  } else if (brief.soonActions.length === 1) {
    positiveSignals.push('The soon-action queue is short enough to brief clearly before the next decision point.');
  }

  const staleOrUnreliableLine = brief.watchHandover.find((line) =>
    line.toLowerCase().includes('stale') || line.toLowerCase().includes('unreliable')
  );
  if (staleOrUnreliableLine) {
    lessons.push(
      lesson(
        `${scenario.id}:debrief:data-quality`,
        'data-quality',
        'caution',
        'AIS freshness changed the trust level',
        'The handover included stale or unreliable target language, so the crew should not treat every symbol as current truth.',
        'Which target needed visual confirmation before being downgraded, ignored or used for a manoeuvre decision?'
      )
    );
  }

  if (brief.watchHandover.some((line) => line.includes('Confirm the traffic picture visually'))) {
    positiveSignals.push('The brief preserves the core seamanship rule: AIS prompts action, but lookout confirms the situation.');
  }

  return {
    scenarioId: scenario.id,
    title: `${scenario.title} debrief`,
    area: scenario.area,
    headline:
      lessons.some((item) => item.severity === 'critical')
        ? 'Debrief: urgent traffic required skipper-led decision review.'
        : 'Debrief: use the scenario to reinforce calm watch discipline.',
    lessons,
    positiveSignals,
    followUpDrill:
      lessons.length > 0
        ? 'Repeat the scenario with one target hidden and ask crew to verbalise bearing trend, first action and fallback harbour decision.'
        : 'Repeat the scenario as a five-minute routine watch handover and compare AIS picture with visual bearing checks.',
    safetyNote:
      'AIS debriefs are training artefacts. They must not be used as proof that a past or future manoeuvre was safe, legal or sufficient under COLREGs.'
  };
}
