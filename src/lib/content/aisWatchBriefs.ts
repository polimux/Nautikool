import type { AisTrafficScenario } from '$lib/domain/nmea';
import { buildAisWatchBrief, summarizeAisTraffic } from '$lib/domain/nmea';
import { h323ElinaHankoApproachAisScenario, h323ElinaTallinnFerryLaneAisScenario } from './nmeaNetworks';

export const h323ElinaFogBankAisScenario: AisTrafficScenario = {
  id: 'ais-scenario:h323-elina-fog-bank-watch-brief',
  title: 'H-323 Elina fog-bank AIS watch brief drill',
  vesselId: 'vessel:h323-elina',
  area: 'Archipelago Sea / restricted-visibility coastal leg',
  description:
    'A static drill for turning a noisy AIS picture into a calm cockpit handover when visibility is closing down and family crew attention is limited.',
  targets: [
    {
      mmsi: '230999201',
      name: 'Archipelago Cargo Example',
      targetClass: 'class-a',
      rangeNm: 4.7,
      bearingDegrees: 96,
      cogDegrees: 275,
      sogKn: 12.8,
      cpaNm: 0.42,
      tcpaMinutes: 18,
      ageSeconds: 22,
      notes: [
        'Commercial target is close enough to force a pre-emptive skipper decision before visibility becomes worse.',
        'Teaching point: in fog risk, avoid delaying the COLREG decision until the target is visually obvious.'
      ]
    },
    {
      mmsi: '230999202',
      name: 'Local Motorboat Example',
      targetClass: 'class-b',
      rangeNm: 1.1,
      bearingDegrees: 18,
      cogDegrees: 160,
      sogKn: 15.5,
      ageSeconds: 35,
      notes: [
        'Close fast small craft has no CPA/TCPA in the snapshot.',
        'Teaching point: use compass-bearing trend and sound/visual lookout instead of waiting for better AIS data.'
      ]
    },
    {
      mmsi: '230999203',
      name: 'Old Harbour Taxi Symbol Example',
      targetClass: 'class-b',
      rangeNm: 2.2,
      bearingDegrees: 205,
      cogDegrees: 40,
      sogKn: 0.1,
      cpaNm: 1.6,
      tcpaMinutes: 30,
      ageSeconds: 540,
      notes: [
        'Stale symbol is deliberately less important than the fresh close targets.',
        'Teaching point: mark stale AIS as unreliable, then return attention to the current close-quarters picture.'
      ]
    }
  ],
  assumptions: [
    'This is training content for restricted-visibility cockpit handover, not live navigation advice.',
    'Sound signals, safe speed, lookout and early harbour/bailout decisions remain outside AIS and must be briefed separately.',
    'The watch brief should be readable aloud by tired crew without hiding the conservative safety limitations.'
  ],
  contentVersion: '2026-07-09.ais-fog-bank-watch-brief-v1'
};

export const coreAisWatchBriefDrills = [
  h323ElinaHankoApproachAisScenario,
  h323ElinaTallinnFerryLaneAisScenario,
  h323ElinaFogBankAisScenario
].map((scenario) => ({
  scenario,
  summary: summarizeAisTraffic(scenario),
  brief: buildAisWatchBrief(scenario)
}));

export const h323ElinaFogBankAisSummary = summarizeAisTraffic(h323ElinaFogBankAisScenario);
export const h323ElinaFogBankAisBrief = buildAisWatchBrief(h323ElinaFogBankAisScenario);
