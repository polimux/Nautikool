import type { PassagePlan } from '$lib/domain/types';

export const turkuToParnuFamilyPassagePlan: PassagePlan = {
  id: 'passage-plan:turku-to-parnu-family-h323',
  title: 'Turku to Pärnu - family H-323 coastal passage',
  vesselId: 'vessel:h323-elina',
  area: 'Baltic Sea: Archipelago Sea, Gulf of Finland and Gulf of Riga approaches',
  plannedDepartureDate: '2026-07-26',
  contentVersion: '0.1.0',
  assumptions: [
    {
      id: 'assumption:family-crew-day-leg-limit',
      statement: 'The skipper wants realistic family legs of roughly 50 nautical miles or less where possible.',
      source: 'user',
      confidence: 'high',
      safetyImpact: 'medium'
    },
    {
      id: 'assumption:h323-cruising-speed',
      statement: 'The H-323 planning speed is 5.0 knots unless local weather, sea state or engine use requires a conservative adjustment.',
      source: 'default',
      confidence: 'medium',
      safetyImpact: 'medium'
    },
    {
      id: 'assumption:baltic-weather-checked-before-each-leg',
      statement: 'Wind, gusts, wave height, visibility, thunderstorm risk and harbour availability are checked before every leg.',
      source: 'user',
      confidence: 'medium',
      safetyImpact: 'high'
    }
  ],
  legs: [
    {
      id: 'leg:turku-to-nauvo',
      from: 'Turku',
      to: 'Nauvo / Nagu guest harbour',
      distanceNm: 28,
      plannedSpeedKn: 5,
      exposure: 'sheltered',
      daylightPreferred: true,
      hazards: [
        {
          id: 'hazard:turku-archipelago-pilotage-load',
          text: 'Dense archipelago pilotage, ferry traffic and narrow marked channels increase workload at the beginning of the trip.',
          severity: 'medium'
        }
      ],
      bailoutHarbours: [
        {
          name: 'Airisto area',
          note: 'Use nearby archipelago harbours if crew, engine, weather or navigation workload does not feel settled after departure.'
        }
      ],
      crewNotes: [
        'Use this as a shakedown leg for the family crew before committing to longer legs.',
        'Assign one person to lookout and one person to chart or instrument cross-checking in the narrow sections.'
      ]
    },
    {
      id: 'leg:nauvo-to-hanko',
      from: 'Nauvo / Nagu guest harbour',
      to: 'Hanko eastern harbour',
      distanceNm: 48,
      plannedSpeedKn: 5,
      exposure: 'coastal',
      daylightPreferred: true,
      hazards: [
        {
          id: 'hazard:outer-archipelago-fatigue',
          text: 'Longer archipelago leg with mixed shelter and exposed sections; fatigue and attention management matter more than raw distance.',
          severity: 'medium'
        }
      ],
      bailoutHarbours: [
        {
          name: 'Kasnäs',
          note: 'Practical conservative stop if timing, wind angle or crew condition makes Hanko too much for one day.'
        }
      ],
      crewNotes: [
        'Prepare food and warm layers before the more exposed sections.',
        'Do not turn this into a night arrival unless the crew is fresh and the approach was briefed in daylight.'
      ]
    },
    {
      id: 'leg:hanko-to-haapsalu',
      from: 'Hanko',
      to: 'Haapsalu',
      distanceNm: 86,
      plannedSpeedKn: 5,
      exposure: 'open-water',
      daylightPreferred: false,
      hazards: [
        {
          id: 'hazard:gulf-of-finland-open-crossing',
          text: 'Open-water crossing with ship traffic, possible night hours and fewer immediate shelter options.',
          severity: 'high'
        }
      ],
      bailoutHarbours: [
        {
          name: 'Dirhami',
          note: 'Possible Estonian landfall option depending on route, weather and harbour suitability.'
        },
        {
          name: 'Kärdla',
          note: 'Alternative landfall if the plan shifts toward Hiiumaa in suitable conditions.'
        }
      ],
      crewNotes: [
        'Run this leg only with a fresh forecast and an explicit watch plan.',
        'Prepare SRC/VHF plan, AIS watch discipline, snacks and seasickness management before departure.'
      ]
    },
    {
      id: 'leg:haapsalu-to-parnu',
      from: 'Haapsalu',
      to: 'Pärnu',
      distanceNm: 58,
      plannedSpeedKn: 5,
      exposure: 'coastal',
      daylightPreferred: true,
      hazards: [
        {
          id: 'hazard:shallow-approaches-and-local-channels',
          text: 'Shallow approaches and local channels require careful pilotage, especially with fatigue after previous legs.',
          severity: 'medium'
        }
      ],
      bailoutHarbours: [
        {
          name: 'Virtsu area',
          note: 'Use a conservative intermediate stop if wind, timing or crew energy makes Pärnu too long.'
        }
      ],
      crewNotes: [
        'Plan the final approach for daylight if possible.',
        'Keep one crew member rested for the last two hours and harbour entry.'
      ]
    }
  ]
};

export const corePassagePlans: PassagePlan[] = [turkuToParnuFamilyPassagePlan];

export function getPassagePlanById(id: string): PassagePlan | undefined {
  return corePassagePlans.find((plan) => plan.id === id);
}
