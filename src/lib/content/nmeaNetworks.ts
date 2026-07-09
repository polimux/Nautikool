import type { AisTrafficScenario, NmeaNetworkProfile } from '$lib/domain/nmea';
import { summarizeAisTraffic, summarizeNmeaNetwork } from '$lib/domain/nmea';

export const h323ElinaNmeaNetworkProfile: NmeaNetworkProfile = {
  id: 'nmea-network:h323-elina-seatalkng',
  title: 'H-323 Elina SeaTalkNG / NMEA2000 readiness profile',
  vesselId: 'vessel:h323-elina',
  description:
    'A planning profile for documenting how Elina should share GNSS, AIS, plotter and VHF/DSC data before Baltic family passages.',
  backbone: {
    protocol: 'seatalk-ng',
    terminatorCount: 2,
    powerInjectionKnown: false,
    notes: [
      'SeaTalkNG is treated as the physical backbone with NMEA2000 adapters where required.',
      'Backbone power should be protected by a clearly labelled fuse and switch before the network is trusted for departure.',
      'Terminator count is modelled as correct for the target design, but the physical ends still need an onboard inspection.'
    ]
  },
  devices: [
    {
      id: 'nmea-device:em-trak-b953',
      name: 'em-trak B953 AIS transponder',
      role: 'ais-transponder',
      protocols: ['nmea-2000'],
      installed: true,
      critical: true,
      pgns: [
        {
          pgn: 129029,
          label: 'GNSS position data',
          direction: 'transmit',
          userValue: 'Provides AIS/DSC-grade position when its GPS antenna has a valid fix.'
        },
        {
          pgn: 129038,
          label: 'AIS Class A position report',
          direction: 'transmit',
          userValue: 'Makes larger commercial traffic visible to connected displays.'
        },
        {
          pgn: 129039,
          label: 'AIS Class B position report',
          direction: 'transmit',
          userValue: 'Makes yacht and small-craft AIS targets visible to connected displays.'
        },
        {
          pgn: 129026,
          label: 'COG and SOG rapid update',
          direction: 'transmit',
          userValue: 'Lets passage and risk logic compare planned speed against actual motion.'
        }
      ],
      notes: [
        'Confirm MMSI programming before transmitting AIS.',
        'Confirm external GPS antenna sky view and splitter/VHF antenna path.',
        'AIS target display on the Axiom should be checked before the first open-water leg.'
      ]
    },
    {
      id: 'nmea-device:raymarine-ray90',
      name: 'Raymarine Ray90 fixed VHF/DSC',
      role: 'vhf-dsc',
      protocols: ['seatalk-ng'],
      installed: true,
      critical: true,
      pgns: [
        {
          pgn: 129029,
          label: 'GNSS position data',
          direction: 'receive',
          userValue: 'Allows DSC distress and harbour calls to include a current position when the network feed is valid.'
        }
      ],
      notes: [
        'Verify that the Ray90 shows a current position without relying on a handset memory or stale internal state.',
        'Run a radio check and confirm ATIS/DSC configuration for the operating area.'
      ]
    },
    {
      id: 'nmea-device:raymarine-axiom-plus-9',
      name: 'Raymarine Axiom+ 9 chartplotter',
      role: 'chartplotter',
      protocols: ['seatalk-ng'],
      installed: true,
      critical: true,
      pgns: [
        {
          pgn: 129029,
          label: 'GNSS position data',
          direction: 'receive',
          userValue: 'Displays own-ship position for route monitoring and harbour approach cross-checks.'
        },
        {
          pgn: 129038,
          label: 'AIS Class A position report',
          direction: 'receive',
          userValue: 'Displays commercial traffic targets for CPA/TCPA discussion and watchkeeping.'
        },
        {
          pgn: 129039,
          label: 'AIS Class B position report',
          direction: 'receive',
          userValue: 'Displays yacht and small-craft targets during coastal crossings.'
        }
      ],
      notes: [
        'Confirm that AIS targets, own position and route data appear on the same operating profile.',
        'Do not treat autorouting as a replacement for leg-by-leg hazard review.'
      ]
    },
    {
      id: 'nmea-device:orca-core-2',
      name: 'Orca Core 2',
      role: 'navigation-app',
      protocols: ['wifi', 'nmea-2000'],
      installed: true,
      critical: false,
      pgns: [
        {
          pgn: 129029,
          label: 'GNSS position data',
          direction: 'receive',
          userValue: 'Supports secondary navigation and tablet-based cross-checking.'
        },
        {
          pgn: 129038,
          label: 'AIS Class A position report',
          direction: 'receive',
          userValue: 'Can expose traffic awareness to mobile devices when integration is configured.'
        },
        {
          pgn: 129039,
          label: 'AIS Class B position report',
          direction: 'receive',
          userValue: 'Can expose small-craft AIS awareness to mobile devices when integration is configured.'
        }
      ],
      notes: [
        'Useful as a second navigation layer, not the sole source of safe navigation.',
        'Confirm whether AIS is received through NMEA2000, Wi-Fi bridge or app-specific integration before relying on it.'
      ]
    }
  ],
  assumptions: [
    'This is a target/design profile, not proof that the physical network has been commissioned.',
    'The product should explain network readiness in skipper language: position source, AIS targets, VHF/DSC position and backbone health.',
    'AIS and NMEA data are advisory inputs; lookout, VHF watch, paper/plotter cross-checking and COLREG decisions remain skipper responsibilities.'
  ],
  contentVersion: '2026-07-09.nmea-elina-v1'
};

export const h323ElinaHankoApproachAisScenario: AisTrafficScenario = {
  id: 'ais-scenario:h323-elina-hanko-approach-traffic',
  title: 'H-323 Elina Hanko approach AIS traffic drill',
  vesselId: 'vessel:h323-elina',
  area: 'Hanko approach / Gulf of Finland edge',
  description:
    'A static training snapshot for discussing how a small Baltic cruiser should treat AIS during an approach with commercial traffic, small craft and one stale target.',
  targets: [
    {
      mmsi: '230999001',
      name: 'Baltic Ferry Example',
      targetClass: 'class-a',
      rangeNm: 4.2,
      bearingDegrees: 82,
      cogDegrees: 255,
      sogKn: 18.5,
      cpaNm: 0.3,
      tcpaMinutes: 14,
      ageSeconds: 28,
      notes: [
        'Fast commercial target used to force early COLREG and visual-bearing discussion.',
        'The correct product behaviour is to treat the close CPA as urgent, not as a panic instruction.'
      ]
    },
    {
      mmsi: '230999002',
      name: 'Archipelago Yacht Example',
      targetClass: 'class-b',
      rangeNm: 1.7,
      bearingDegrees: 34,
      cogDegrees: 190,
      sogKn: 5.2,
      ageSeconds: 45,
      notes: [
        'Close small-craft target without CPA/TCPA to teach that AIS can be incomplete.',
        'Watch should use visual bearing trend and avoid assuming the target has seen Elina.'
      ]
    },
    {
      mmsi: '230999003',
      name: 'Old Fishing Target Example',
      targetClass: 'class-b',
      rangeNm: 3.6,
      bearingDegrees: 140,
      cogDegrees: 15,
      sogKn: 0.4,
      cpaNm: 1.4,
      tcpaMinutes: 38,
      ageSeconds: 420,
      notes: [
        'Stale target included to prevent false confidence from old AIS positions.',
        'Training value: keep visual lookout even when the symbol looks harmless.'
      ]
    }
  ],
  assumptions: [
    'This is a static AIS training scenario, not live traffic information.',
    'CPA and TCPA are advisory; COLREG decisions require visual lookout, compass-bearing trend and early, obvious action.',
    'Small-craft AIS data may be delayed, absent, incorrectly configured or not monitored by the other vessel.'
  ],
  contentVersion: '2026-07-09.ais-hanko-approach-v1'
};

export const h323ElinaNmeaNetworkSummary = summarizeNmeaNetwork(h323ElinaNmeaNetworkProfile);
export const h323ElinaHankoApproachAisSummary = summarizeAisTraffic(h323ElinaHankoApproachAisScenario);

export const coreNmeaNetworkProfiles: NmeaNetworkProfile[] = [h323ElinaNmeaNetworkProfile];
export const coreAisTrafficScenarios: AisTrafficScenario[] = [h323ElinaHankoApproachAisScenario];

export function getNmeaNetworkProfileById(id: string): NmeaNetworkProfile | undefined {
  return coreNmeaNetworkProfiles.find((profile) => profile.id === id);
}

export function getAisTrafficScenarioById(id: string): AisTrafficScenario | undefined {
  return coreAisTrafficScenarios.find((scenario) => scenario.id === id);
}
