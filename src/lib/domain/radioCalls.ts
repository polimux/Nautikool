export type RadioCallUrgency = 'routine' | 'safety' | 'urgency' | 'distress';

export interface RadioCallSituation {
  id: string;
  title: string;
  area: string;
  vesselName: string;
  callSign?: string;
  mmsi?: string;
  position: string;
  urgency: RadioCallUrgency;
  trigger: string;
  immediateRisk: string;
  requestedHelp: string;
  fallbackAction: string;
  crewNote: string;
}

export interface RadioCallCard {
  situationId: string;
  title: string;
  area: string;
  urgency: RadioCallUrgency;
  channel: string;
  callPrefix: string;
  readAloud: string[];
  skipperPrompts: string[];
  limitations: string[];
}

const urgencyRank: Record<RadioCallUrgency, number> = {
  routine: 0,
  safety: 1,
  urgency: 2,
  distress: 3
};

export function getRadioCallPrefix(urgency: RadioCallUrgency): string {
  switch (urgency) {
    case 'distress':
      return 'MAYDAY MAYDAY MAYDAY';
    case 'urgency':
      return 'PAN-PAN PAN-PAN PAN-PAN';
    case 'safety':
      return 'SECURITE SECURITE SECURITE';
    case 'routine':
      return 'Routine call';
  }
}

export function buildRadioCallCard(situation: RadioCallSituation): RadioCallCard {
  const callPrefix = getRadioCallPrefix(situation.urgency);
  const vesselIdentity = [situation.vesselName, situation.callSign, situation.mmsi].filter(Boolean).join(' / ');

  return {
    situationId: situation.id,
    title: `${situation.title} radio call card`,
    area: situation.area,
    urgency: situation.urgency,
    channel: situation.urgency === 'routine' ? 'working channel after contact' : 'VHF channel 16 or DSC first if appropriate',
    callPrefix,
    readAloud: [
      callPrefix,
      `This is ${vesselIdentity}.`,
      `Position: ${situation.position}.`,
      `Situation: ${situation.trigger}.`,
      `Risk: ${situation.immediateRisk}.`,
      `Request: ${situation.requestedHelp}.`,
      `Fallback: ${situation.fallbackAction}.`
    ],
    skipperPrompts: [
      'Confirm position from plotter and a second source before transmitting if time allows.',
      'Keep the first call short; prepare details for the follow-up exchange.',
      situation.crewNote
    ],
    limitations: [
      'This is SRC training content, not legal advice or a substitute for the radio regulations applicable to the vessel and area.',
      'Use distress or urgency only when the real situation justifies it; do not practise live emergency phrases on air.',
      'A VHF call supports seamanship decisions but does not replace lookout, COLREG action or immediate boat handling.'
    ]
  };
}

export function sortRadioCallCardsByUrgency(cards: RadioCallCard[]): RadioCallCard[] {
  return [...cards].sort((left, right) => urgencyRank[right.urgency] - urgencyRank[left.urgency]);
}
