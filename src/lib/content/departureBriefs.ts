import { buildDepartureSkipperBrief, type DepartureSkipperBriefInput } from '$lib/domain/departureBrief';
import { h323ElinaTurkuParnuDepartureDashboard } from './departureDashboard';

export const h323ElinaTurkuParnuDepartureBriefInput: DepartureSkipperBriefInput = {
  id: 'departure-brief:h323-elina:turku-parnu-family-printable',
  title: 'H-323 Elina Turku to Pärnu printable skipper brief',
  dashboard: h323ElinaTurkuParnuDepartureDashboard,
  generatedAtLabel: 'Static rehearsal copy for 26 July 2026 planning',
  goNoGoQuestion:
    'Would I still take my father and 15-year-old son out if the next bailout harbour became unavailable and the wind increased by one Beaufort step?',
  routeFocus: [
    'Keep the first two days below about 50 nautical miles each; do not let the plan drift into a fatigue-driven long-leg recovery schedule.',
    'Treat the archipelago exit, Hanko area traffic and the open approach toward Pärnu as separate decisions rather than one continuous commitment.',
    'Mark bailout harbours on paper before departure and brief who calls the stop if visibility, engine confidence or crew energy deteriorates.'
  ],
  weatherCheckpoints: [
    'Compare at least two current forecasts for wind, gusts, wave height, thunderstorms and visibility before releasing lines.',
    'If sustained wind is near 20 kn, gusts exceed the family-crew limit, or thunderstorm risk is material, downgrade to harbour day or shorter sheltered leg.',
    'Write forecast timestamp and next update time on the brief so a stale forecast cannot look current in the cockpit.'
  ],
  crewAssignments: [
    'Skipper owns go/no-go, navigation and reefing decisions; father owns lookout/log prompts when rested; son gets simple timed checks and no safety-critical solo tasks.',
    'Use short watch blocks before fatigue appears; family crew should not learn the watch rhythm for the first time after dark or in ferry traffic.',
    'Agree one stop phrase before departure: "We are stopping early" is a safety decision, not a failure of the plan.'
  ],
  boatChecks: [
    'Close required checklist blockers, service-critical unknowns and missing critical spares before the dashboard may be treated as a real departure input.',
    'Record Yanmar engine hours, fuel confidence, raw-water flow, belt state, bilge state and emergency steering assumptions before leaving Turku.',
    'Put the impeller kit, primary diesel filter, fuses, softwood plugs and handheld VHF backup where tired crew can find them.'
  ],
  electronicsChecks: [
    'Confirm Ray90 DSC has a trusted GNSS position and that the em-trak AIS target path is visible on the cockpit display before using traffic drills as live support.',
    'Check SeaTalkNG/NMEA2000 terminators and network power before departure; a partial data display must not be mistaken for a healthy network.',
    'Keep paper route notes and handheld VHF ready because electronics are support tools, not the safety case.'
  ],
  printNotes: [
    'Paper copy must be re-marked after every meaningful forecast, route, crew or equipment change.',
    'This family-crew scenario is deliberately conservative and should not be used as live Baltic sailing advice without current local information.'
  ]
};

export const h323ElinaTurkuParnuDepartureBrief = buildDepartureSkipperBrief(
  h323ElinaTurkuParnuDepartureBriefInput
);

export const coreDepartureBriefs = [h323ElinaTurkuParnuDepartureBrief];
