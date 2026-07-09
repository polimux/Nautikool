import { buildTripLogDebrief, summarizeTripLog, type TripLogEntry } from '$lib/domain/tripLogs';

export const h323ElinaTurkuParnuTripLog: TripLogEntry[] = [
  {
    id: 'trip-log:h323-elina:turku-departure-brief',
    vesselId: 'vessel:h323-elina',
    passagePlanId: 'passage:turku-parnu-family-h323',
    timestamp: '2026-07-26T07:15:00+03:00',
    entryType: 'departure',
    title: 'Turku departure brief completed',
    summary:
      'Family crew briefed on day target, bailout harbours, lifejacket rule, cockpit clipping discipline and radio backup location.',
    position: 'Turku guest harbour berth before departure',
    weather: {
      windKn: 9,
      gustKn: 14,
      waveMeters: 0.3,
      visibility: 'good',
      note: 'Archipelago day-sail conditions; forecast age checked during breakfast.'
    },
    engineHours: 812.4,
    sailSetup: 'Main ready with reefing lines checked; genoa furled until clear of harbour traffic.',
    crewState: 'Father rested, son assigned lookout and log prompts, skipper fit for first leg.',
    actionTaken: 'Started trip log and confirmed first two bailout harbours on paper and plotter.',
    severity: 'info',
    tags: ['departure', 'family-crew', 'turku']
  },
  {
    id: 'trip-log:h323-elina:archipelago-motor-sail',
    vesselId: 'vessel:h323-elina',
    passagePlanId: 'passage:turku-parnu-family-h323',
    timestamp: '2026-07-26T11:40:00+03:00',
    entryType: 'underway',
    title: 'Archipelago motor-sail and lookout rotation',
    summary:
      'Narrow-sector pilotage required more helm concentration than planned; crew rotated lookout every 30 minutes and kept snacks/water in cockpit.',
    position: 'South of Airisto, clear of main ferry lane',
    weather: {
      windKn: 11,
      gustKn: 17,
      waveMeters: 0.5,
      visibility: 'good',
      note: 'Gusts higher in open gaps between islands.'
    },
    engineHours: 814.0,
    sailSetup: 'Main plus partly furled genoa; engine used through narrow marked channels.',
    crewState: 'Skipper workload high but controlled; son still engaged as lookout.',
    actionTaken: 'Reduced task load, delayed sail trim practice and kept pilotage as the main job.',
    severity: 'caution',
    followUp: 'Add a dedicated archipelago pilotage fatigue note to the next Turku-area passage plan.',
    tags: ['pilotage', 'fatigue', 'archipelago']
  },
  {
    id: 'trip-log:h323-elina:diesel-filter-reminder',
    vesselId: 'vessel:h323-elina',
    passagePlanId: 'passage:turku-parnu-family-h323',
    timestamp: '2026-07-26T15:20:00+03:00',
    entryType: 'maintenance',
    title: 'Primary diesel filter spare still missing',
    summary:
      'No engine symptom observed, but the spare-readiness blocker remains open and should not be forgotten after a successful motoring day.',
    engineHours: 815.1,
    actionTaken: 'Logged as post-arrival procurement item rather than treating the day as fully green.',
    severity: 'blocker',
    followUp: 'Buy and label the exact primary diesel filter before the next exposed leg.',
    tags: ['fuel', 'spares', 'maintenance']
  },
  {
    id: 'trip-log:h323-elina:hanko-arrival-lesson',
    vesselId: 'vessel:h323-elina',
    passagePlanId: 'passage:turku-parnu-family-h323',
    timestamp: '2026-07-26T18:10:00+03:00',
    entryType: 'lesson',
    title: 'Hanko arrival debrief lesson',
    summary:
      'The family crew handled the leg well, but the skipper should preserve energy by shortening the first day or adding an earlier stop if wind shifts make pilotage harder.',
    position: 'Hanko harbour after mooring',
    weather: {
      windKn: 13,
      gustKn: 18,
      waveMeters: 0.4,
      visibility: 'good',
      note: 'Arrival conditions manageable but fatigue was visible after mooring.'
    },
    engineHours: 815.6,
    sailSetup: 'Sails down before final harbour approach; engine only in harbour basin.',
    crewState: 'Crew tired but positive; son useful with fenders after a clear briefing.',
    actionTaken: 'Debriefed one thing to repeat and one thing to change before dinner.',
    severity: 'info',
    tags: ['arrival', 'debrief', 'hanko']
  }
];

export const h323ElinaTripLogSummary = summarizeTripLog(h323ElinaTurkuParnuTripLog);
export const h323ElinaTripLogDebrief = buildTripLogDebrief(h323ElinaTurkuParnuTripLog);
