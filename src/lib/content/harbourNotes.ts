import { h323ElinaVesselProfile } from './vesselProfiles';
import {
  assessHarbourNote,
  summarizeHarbourNotebook,
  type HarbourNote
} from '$lib/domain/harbours';

export const h323ElinaTurkuParnuHarbourNotes: HarbourNote[] = [
  {
    id: 'harbour:h323-elina:turku',
    name: 'Turku guest harbour / departure area',
    country: 'Finland',
    area: 'Archipelago Sea',
    role: 'home',
    vesselFit: {
      maxDraftMeters: 2.2,
      alongsideOrBox: 'guest berth or marina berth to be confirmed locally',
      confidence: 'medium'
    },
    sourceFreshness: 'stale',
    approach: {
      pilotage: 'Use the marked fairway and treat ferry/commercial traffic as the main workload driver before the family crew is settled.',
      hazards: ['dense archipelago traffic', 'ferries', 'narrow fairway exits'],
      nightArrival: 'unknown',
      depthMeters: 2.2,
      shelter: 'sheltered'
    },
    facilities: [
      { type: 'water', available: 'unknown', note: 'Confirm before filling tanks for the family passage.' },
      { type: 'groceries', available: true, note: 'Use as the last predictable provisioning point before the archipelago shakedown.' },
      { type: 'repair', available: 'unknown', note: 'Record nearest chandlery or mechanic before departure.' }
    ],
    skipperNotes: [
      'Use Turku as the systems reset: diesel, water, battery charging, paper charts, crew briefing and weather printout.',
      'Do not leave the dock until the first bailout harbour and first two VHF/phone contacts are available offline.'
    ],
    verificationPrompts: [
      'Confirm berth exit, fuel availability and opening hours on the departure morning.',
      'Mark the first two bailout harbours on the paper chart before casting off.'
    ],
    safetyLimitations: ['This is a static planning note, not a live harbour directory.']
  },
  {
    id: 'harbour:h323-elina:nauvo',
    name: 'Nauvo / Nagu guest harbour',
    country: 'Finland',
    area: 'Archipelago Sea',
    role: 'planned-stop',
    vesselFit: {
      maxDraftMeters: 2.0,
      alongsideOrBox: 'guest harbour berth to be verified',
      confidence: 'medium'
    },
    sourceFreshness: 'unknown',
    approach: {
      pilotage: 'Short first-day stop for crew shakedown; keep arrival conservative and avoid turning the first leg into a fatigue exercise.',
      hazards: ['local ferry traffic', 'summer harbour congestion', 'narrow final approach'],
      nightArrival: 'avoid',
      depthMeters: 2.0,
      shelter: 'sheltered'
    },
    facilities: [
      { type: 'berth', available: 'unknown', note: 'Call ahead in high season.' },
      { type: 'groceries', available: true, note: 'Useful top-up stop for snacks and breakfast.' },
      { type: 'sauna', available: 'unknown', note: 'Treat sauna as optional morale bonus, not a planning assumption.' }
    ],
    skipperNotes: [
      'Use Nauvo as the go/no-go reset for the longer outer-archipelago leg.',
      'After mooring, debrief crew comfort, seasickness, lookout discipline and engine confidence.'
    ],
    verificationPrompts: [
      'Confirm guest berth availability before leaving Turku if this is the committed first stop.',
      'Check whether the final approach remains comfortable in the forecast wind direction.'
    ],
    safetyLimitations: ['Do not rely on this note for live berth availability or current harbour fees.']
  },
  {
    id: 'harbour:h323-elina:hanko-east',
    name: 'Hanko eastern harbour',
    country: 'Finland',
    area: 'Gulf of Finland west entrance',
    role: 'planned-stop',
    vesselFit: {
      maxDraftMeters: 2.5,
      alongsideOrBox: 'guest berth; exact berth and depth to be assigned locally',
      confidence: 'medium'
    },
    sourceFreshness: 'stale',
    approach: {
      pilotage: 'Treat Hanko as the last major Finnish decision point before any open Gulf of Finland crossing.',
      hazards: ['commercial traffic', 'exposed approach in onshore wind', 'fatigue after Nauvo leg'],
      nightArrival: 'unknown',
      vhfChannel: 'harbour contact to be verified',
      depthMeters: 2.5,
      shelter: 'coastal'
    },
    facilities: [
      { type: 'berth', available: 'unknown', note: 'Reserve or call ahead during summer.' },
      { type: 'fuel', available: 'unknown', note: 'Verify fuel berth before using Hanko as the final fuel stop.' },
      { type: 'water', available: 'unknown', note: 'Top up before crossing if available.' }
    ],
    skipperNotes: [
      'Use Hanko for the hard crossing decision: weather, visibility, ship traffic, crew rest and fallback harbour choice.',
      'Prepare the SRC/VHF, AIS watch and engine-spares plan before departure.'
    ],
    verificationPrompts: [
      'Verify harbour contact, approach depth and fuel before committing to the next leg.',
      'Check current forecast and visibility for the whole crossing window, not just departure.'
    ],
    safetyLimitations: ['Static Hanko note must be refreshed with current harbour and weather information.']
  },
  {
    id: 'harbour:h323-elina:dirhami',
    name: 'Dirhami',
    country: 'Estonia',
    area: 'Estonian north-west coast',
    role: 'bailout',
    vesselFit: {
      maxDraftMeters: 1.8,
      alongsideOrBox: 'small harbour berth suitability to be verified',
      confidence: 'low'
    },
    sourceFreshness: 'unknown',
    approach: {
      pilotage: 'Possible conservative landfall instead of continuing toward Haapsalu, but only if charts, weather and harbour facts are current.',
      hazards: ['unknown berth availability', 'shallower local waters', ' lee-shore risk depending on wind'],
      nightArrival: 'avoid',
      depthMeters: 1.8,
      shelter: 'coastal'
    },
    facilities: [
      { type: 'berth', available: 'unknown', note: 'Do not treat as guaranteed bailout without contact.' },
      { type: 'fuel', available: 'unknown', note: 'No fuel assumption for passage planning.' },
      { type: 'groceries', available: 'unknown', note: 'Carry food reserve from Hanko.' }
    ],
    skipperNotes: [
      'Use only as a verified decision harbour, not as a vague chart label.',
      'Keep enough daylight margin to reject the harbour and continue to an alternative if conditions look wrong.'
    ],
    verificationPrompts: [
      'Confirm current depths, entrance marks and harbour contact before listing Dirhami as a bailout.',
      'Check wind direction against the approach and exit plan.'
    ],
    safetyLimitations: ['Named bailout harbours are prompts for verification, not promises of shelter.']
  },
  {
    id: 'harbour:h323-elina:kardla',
    name: 'Kärdla',
    country: 'Estonia',
    area: 'Hiiumaa north coast',
    role: 'decision-point',
    vesselFit: {
      maxDraftMeters: 2.0,
      alongsideOrBox: 'guest berth to be verified',
      confidence: 'low'
    },
    sourceFreshness: 'unknown',
    approach: {
      pilotage: 'Alternative landfall if the plan shifts toward Hiiumaa; reassess total distance and onward route before using it as a split.',
      hazards: ['route deviation', 'exposed final approach', 'unknown berth status'],
      nightArrival: 'avoid',
      depthMeters: 2.0,
      shelter: 'open-approach'
    },
    facilities: [
      { type: 'berth', available: 'unknown', note: 'Call or verify online before departure.' },
      { type: 'water', available: 'unknown', note: 'Do not assume services after a long crossing.' },
      { type: 'public-transport', available: 'unknown', note: 'Record crew travel options only after verification.' }
    ],
    skipperNotes: [
      'Useful as a planning alternative, but it changes the geometry of the Pärnu route.',
      'Brief the family on why a deviation to Hiiumaa may be safer than pushing for the original stop.'
    ],
    verificationPrompts: [
      'Verify route distance from Hanko and the next-day leg before choosing Kärdla.',
      'Confirm whether the approach is sensible in the forecast sea state.'
    ],
    safetyLimitations: ['A decision-point harbour must be re-scored with the active passage plan.']
  },
  {
    id: 'harbour:h323-elina:haapsalu',
    name: 'Haapsalu',
    country: 'Estonia',
    area: 'West Estonia archipelago approaches',
    role: 'planned-stop',
    vesselFit: {
      maxDraftMeters: 2.0,
      alongsideOrBox: 'guest harbour berth to be confirmed',
      confidence: 'medium'
    },
    sourceFreshness: 'stale',
    approach: {
      pilotage: 'Treat the shallow approach as a separate pilotage task after the open-water leg; do not arrive mentally spent.',
      hazards: ['shallow channels', 'fatigue after crossing', 'night-arrival risk'],
      nightArrival: 'avoid',
      vhfChannel: 'harbour contact to be verified',
      depthMeters: 2.0,
      shelter: 'coastal'
    },
    facilities: [
      { type: 'berth', available: 'unknown', note: 'Reservation recommended before using as committed stop.' },
      { type: 'water', available: 'unknown', note: 'Verify after landfall.' },
      { type: 'groceries', available: true, note: 'Likely useful reprovisioning stop after crossing; confirm opening times.' }
    ],
    skipperNotes: [
      'The harbour is not the end of the risk: the shallow approach must be briefed before departure from Hanko.',
      'Keep one rested person for pilotage and depth monitoring on arrival.'
    ],
    verificationPrompts: [
      'Confirm current approach guidance and shallow-channel depths.',
      'Check whether ETA gives daylight for the final pilotage section.'
    ],
    safetyLimitations: ['Static approach notes never replace current charts and local notices.']
  },
  {
    id: 'harbour:h323-elina:virtsu-area',
    name: 'Virtsu / Muhu decision area',
    country: 'Estonia',
    area: 'Väinameri and Muhu approaches',
    role: 'bailout',
    vesselFit: {
      maxDraftMeters: undefined,
      alongsideOrBox: 'exact harbour choice required before use',
      confidence: 'low'
    },
    sourceFreshness: 'unknown',
    approach: {
      pilotage: 'Use this as a route-split decision area, not a single verified harbour, until a specific berth and approach are selected.',
      hazards: ['undefined harbour choice', 'shallow water', 'ferry routes'],
      nightArrival: 'unknown',
      shelter: 'coastal'
    },
    facilities: [
      { type: 'berth', available: 'unknown', note: 'Pick and verify the actual harbour before departure.' },
      { type: 'fuel', available: 'unknown', note: 'No fuel assumption.' },
      { type: 'public-transport', available: 'unknown', note: 'Could matter if crew change is needed; verify separately.' }
    ],
    skipperNotes: [
      'Good example of a notebook item that is still too vague for a committed route pack.',
      'Before leaving Haapsalu, replace this decision area with one named harbour or delete it from the plan.'
    ],
    verificationPrompts: [
      'Select a specific harbour with depth, contact, approach and berth notes.',
      'Check ferry traffic and shallow-water pilotage before the family crew is tired.'
    ],
    safetyLimitations: ['A geographic area is not a bailout harbour until a specific safe berth is verified.']
  },
  {
    id: 'harbour:h323-elina:parnu',
    name: 'Pärnu',
    country: 'Estonia',
    area: 'Gulf of Riga north-east corner',
    role: 'destination',
    vesselFit: {
      maxDraftMeters: 2.2,
      alongsideOrBox: 'destination berth to be reserved or confirmed',
      confidence: 'medium'
    },
    sourceFreshness: 'stale',
    approach: {
      pilotage: 'Final destination approach after a long coastal day; keep the last two hours low-workload and daylight if possible.',
      hazards: ['shallow approach areas', 'fatigue', 'local traffic'],
      nightArrival: 'unknown',
      vhfChannel: 'harbour contact to be verified',
      depthMeters: 2.2,
      shelter: 'coastal'
    },
    facilities: [
      { type: 'berth', available: 'unknown', note: 'Confirm monthly or stopover berth before arrival.' },
      { type: 'water', available: 'unknown', note: 'Useful after the passage; verify locally.' },
      { type: 'groceries', available: true, note: 'Destination reprovisioning likely available ashore.' },
      { type: 'sauna', available: 'unknown', note: 'Record only after confirming the marina facility.' }
    ],
    skipperNotes: [
      'Treat Pärnu as a destination logistics item as well as a harbour: berth duration, keys, shore power, water and travel connection.',
      'If the Haapsalu to Pärnu leg runs late, prefer a verified intermediate stop over a tired night arrival.'
    ],
    verificationPrompts: [
      'Confirm berth, depth, entry instructions and after-hours arrival procedure.',
      'Check final approach ETA against daylight and crew freshness.'
    ],
    safetyLimitations: ['Destination notes must be refreshed before relying on services or berth availability.']
  }
];

export const h323ElinaHarbourFindings = h323ElinaTurkuParnuHarbourNotes.flatMap((note) =>
  assessHarbourNote(note, h323ElinaVesselProfile.dimensions.draftMeters)
);

export const h323ElinaHarbourSummary = summarizeHarbourNotebook(
  h323ElinaTurkuParnuHarbourNotes,
  h323ElinaVesselProfile.dimensions.draftMeters
);

export function getHarbourNoteById(id: string): HarbourNote | undefined {
  return h323ElinaTurkuParnuHarbourNotes.find((note) => note.id === id);
}
