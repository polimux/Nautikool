import type { NmeaNetworkProfile } from '$lib/domain/nmea';
import { summarizeNmeaNetwork } from '$lib/domain/nmea';

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

export const h323ElinaNmeaNetworkSummary = summarizeNmeaNetwork(h323ElinaNmeaNetworkProfile);

export const coreNmeaNetworkProfiles: NmeaNetworkProfile[] = [h323ElinaNmeaNetworkProfile];

export function getNmeaNetworkProfileById(id: string): NmeaNetworkProfile | undefined {
  return coreNmeaNetworkProfiles.find((profile) => profile.id === id);
}
