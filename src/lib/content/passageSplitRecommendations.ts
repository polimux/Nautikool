import { turkuToParnuFamilyPassagePlan } from './passagePlans';
import {
  recommendPassageSplits,
  type PassageSplitScenario
} from '$lib/domain/passageSplitRecommendations';

export const h323ElinaTurkuParnuSplitScenarios: PassageSplitScenario[] = [
  {
    legId: 'leg:hanko-to-haapsalu',
    title: 'Hanko to Haapsalu conservative split options',
    stops: [
      {
        name: 'Dirhami',
        reason:
          'Turns the Hanko to Haapsalu commitment into a shorter Estonian landfall decision before fatigue and darkness compound the open-water workload.',
        approxDistanceFromStartNm: 55,
        approachNote:
          'Treat as a weather- and daylight-dependent landfall; confirm current charted approach, harbour status and shelter before departure.',
        skipperCheck:
          'Before passing the practical return point, ask: is the crew still warm, fed, seasickness-free and able to keep an AIS/radar/visual watch?'
      },
      {
        name: 'Kärdla',
        reason:
          'Alternative Hiiumaa-side landfall if wind angle, sea state or traffic makes the direct Haapsalu route too optimistic.',
        approachNote:
          'Use only with a deliberately chosen Hiiumaa route, checked harbour approach and daylight or well-briefed arrival plan.',
        skipperCheck:
          'Confirm the route change does not create a harder lee-shore, night-entry or fuel-margin problem than continuing.'
      }
    ],
    notes: [
      'The split is not a recommendation to depart in marginal weather; it is a way to avoid pretending the direct 86 nm leg is a normal family day leg.',
      'If the split harbour is not clearly usable before departure, downgrade the leg to a harbour-day or sheltered-training decision.'
    ]
  },
  {
    legId: 'leg:haapsalu-to-parnu',
    title: 'Haapsalu to Pärnu early-stop option',
    stops: [
      {
        name: 'Virtsu / Muhu decision area',
        reason:
          'Creates an early conservative decision point before the final coastal leg becomes a tired shallow-water approach to Pärnu.',
        approxDistanceFromStartNm: 24,
        approachNote:
          'Confirm the exact harbour choice, depths, ferry traffic, wind exposure and local approach notes rather than treating the area as one generic bailout.',
        skipperCheck:
          'If the crew is already tired before the Virtsu/Muhu decision area, stop early instead of turning the Pärnu approach into the hardest part of the day.'
      }
    ],
    notes: [
      'The final leg is below the hard workload limit but above the preferred 50 nm target, so it needs a named early-stop decision.',
      'Protect the last two hours: one rested adult should be available for navigation, lookout and harbour-entry support.'
    ]
  },
  {
    legId: 'leg:nauvo-to-hanko',
    title: 'Nauvo to Hanko fatigue fallback',
    stops: [
      {
        name: 'Kasnäs',
        reason:
          'Keeps the second day inside a conservative archipelago rhythm if weather, family energy or the first-day shakedown exposes issues.',
        approxDistanceFromStartNm: 22,
        approachNote:
          'Use as a positive planned stop, not only as a failure fallback; check berth availability and wind shelter before leaving Nauvo.',
        skipperCheck:
          'At the Kasnäs decision point, decide from crew energy and forecast trend, not from the desire to keep the original timetable.'
      }
    ],
    notes: [
      'This leg is inside the 50 nm target but still deserves an explicit fatigue fallback because it follows the shakedown day.',
      'A short day here may make the later Gulf of Finland decision safer.'
    ]
  }
];

export const h323ElinaTurkuParnuSplitRecommendations = recommendPassageSplits(
  turkuToParnuFamilyPassagePlan,
  h323ElinaTurkuParnuSplitScenarios,
  {
    targetMaxDayLegNm: 50,
    hardMaxDayLegNm: 65
  }
);

export const corePassageSplitRecommendations = [h323ElinaTurkuParnuSplitRecommendations];
