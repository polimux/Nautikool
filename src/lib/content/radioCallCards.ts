import { buildRadioCallCard, sortRadioCallCardsByUrgency, type RadioCallSituation } from '$lib/domain/radioCalls';

export const h323ElinaTallinnFerryLaneRadioSituation: RadioCallSituation = {
  id: 'radio:h323-elina:tallinn-ferry-lane-pan-pan',
  title: 'Tallinn ferry-lane loss of safe option',
  area: 'Gulf of Finland / Tallinn approach',
  vesselName: 'Elina',
  callSign: 'DH5891',
  mmsi: '211257390',
  position: 'North of Tallinn approach, exact position to be read from GNSS before transmission',
  urgency: 'urgency',
  trigger: 'H-323 sailing yacht is constrained by traffic, reduced sea room and a developing close-quarters situation near commercial ferry traffic',
  immediateRisk: 'Risk of being unable to keep clear early enough without external traffic coordination or immediate conservative manoeuvre',
  requestedHelp: 'Traffic information, acknowledgement from nearby traffic or assistance from the relevant traffic service as appropriate',
  fallbackAction: 'Reduce speed, hold outside the lane if possible, keep clear by early obvious alteration and prepare to divert or wait',
  crewNote: 'One crew member keeps visual lookout on the ferry or fast target while the skipper transmits.'
};

export const h323ElinaFogBankRadioSituation: RadioCallSituation = {
  id: 'radio:h323-elina:fog-bank-securite',
  title: 'Fog bank safety broadcast rehearsal',
  area: 'Hanko / outer approach',
  vesselName: 'Elina',
  callSign: 'DH5891',
  mmsi: '211257390',
  position: 'Outer approach in restricted visibility, exact position to be read from GNSS before transmission',
  urgency: 'safety',
  trigger: 'Small sailing yacht entering restricted visibility with stale AIS targets and limited visual confirmation',
  immediateRisk: 'Other traffic may not see the yacht early, and AIS target freshness is not sufficient for close-quarters decisions',
  requestedHelp: 'Safety information to nearby traffic and heightened lookout from vessels in the area',
  fallbackAction: 'Slow down, sound fog signals as required, post dedicated lookout and remain outside harbour traffic until the picture is clear',
  crewNote: 'Do not let the radio call distract from fog signals, speed reduction and visual/audible lookout.'
};

export const h323ElinaMobRadioSituation: RadioCallSituation = {
  id: 'radio:h323-elina:mob-mayday',
  title: 'MOB distress call rehearsal',
  area: 'Baltic coastal passage',
  vesselName: 'Elina',
  callSign: 'DH5891',
  mmsi: '211257390',
  position: 'MOB position from plotter mark / GNSS, read exact coordinates before transmission',
  urgency: 'distress',
  trigger: 'Person overboard from a small sailing yacht and immediate recovery is uncertain',
  immediateRisk: 'Person in the water, cold-water exposure, possible loss of visual contact and limited crew capacity',
  requestedHelp: 'Immediate assistance for person overboard recovery',
  fallbackAction: 'Press DSC distress if available, mark MOB, keep pointing, start recovery manoeuvre and prepare lifebuoy/recovery gear',
  crewNote: 'A crew member must keep pointing at the person in the water; the radio call must not break visual contact.'
};

export const coreRadioCallCards = sortRadioCallCardsByUrgency([
  buildRadioCallCard(h323ElinaTallinnFerryLaneRadioSituation),
  buildRadioCallCard(h323ElinaFogBankRadioSituation),
  buildRadioCallCard(h323ElinaMobRadioSituation)
]);

export const srcTrainingNotes = [
  'Practise emergency wording silently or in a classroom environment, not as a live transmission on channel 16.',
  'Before a real call, write or point to position, nature of distress/urgency, assistance required and people on board if time allows.',
  'For Baltic family passages, assign radio, lookout and helm roles before the first exposed leg so the call does not consume the whole cockpit.'
];
