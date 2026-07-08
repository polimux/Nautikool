import type { VesselProfile } from '$lib/domain/types';

export const h323ElinaVesselProfile: VesselProfile = {
  id: 'vessel:h323-elina',
  name: 'Elina',
  formerNames: ['Vicious 2.0'],
  type: 'H-323 sailing yacht',
  flag: 'Germany',
  registrationNumber: '129055-A',
  callSign: 'DH5891',
  mmsi: '211257390',
  dimensions: {
    loaMeters: 9.85,
    beamMeters: 2.56,
    draftMeters: 1.45
  },
  rig: {
    type: 'masthead sloop',
    mainsail: 'slab-reefed mainsail',
    headsails: ['self-tacking jib', 'genoa'],
    downwindSails: ['spinnaker'],
    reefingNotes: 'Prepare the first reef before exposed Baltic legs when sustained wind or gust spread is marginal.'
  },
  engine: {
    make: 'Yanmar',
    model: '2GM15',
    type: 'diesel-inboard',
    powerHp: 15,
    drive: 'shaft',
    fuelType: 'diesel',
    checks: [
      'Check bilge and engine pan for diesel, oil, coolant or unusual water.',
      'Confirm raw-water seacock open and cooling water flow immediately after start.',
      'Confirm fuel level and battery switch position before leaving the berth.',
      'Listen for abnormal startup noise and verify alarms clear.'
    ]
  },
  tanks: {
    notes: 'Tank capacities should be confirmed from the boat documents or direct measurement before fuel-range calculations are trusted.'
  },
  batteries: {
    chargingSources: ['shore power', 'engine alternator', 'solar charging'],
    notes: 'Battery capacities and switching layout still need confirmation before low-battery risk rules become authoritative.'
  },
  equipment: [
    {
      id: 'equipment:fixed-vhf-dsc',
      name: 'Raymarine Ray90 fixed VHF/DSC radio',
      category: 'communication',
      installed: true,
      critical: true,
      notes: 'Supports harbour, traffic and distress communication planning; GPS source and DSC setup must be verified onboard.'
    },
    {
      id: 'equipment:ais-transponder',
      name: 'em-trak B953 AIS transponder with splitter',
      category: 'navigation',
      installed: true,
      critical: true,
      notes: 'Supports own-ship AIS transmission and traffic awareness for Gulf of Finland crossings.'
    },
    {
      id: 'equipment:plotter',
      name: 'Raymarine Axiom+ 9 chartplotter',
      category: 'navigation',
      installed: true,
      critical: true,
      notes: 'Primary cockpit display for route monitoring, AIS display and approach cross-checking.'
    },
    {
      id: 'equipment:orca-core',
      name: 'Orca Core 2 navigation computer',
      category: 'navigation',
      installed: true,
      critical: false,
      notes: 'Useful secondary navigation and planning system; not the only source of safe navigation.'
    },
    {
      id: 'equipment:gps-antenna',
      name: 'em-trak GPS100 external GPS antenna',
      category: 'navigation',
      installed: true,
      critical: true,
      notes: 'Dedicated GPS source for AIS; physical installation and sky view should be checked.'
    },
    {
      id: 'equipment:liferaft',
      name: '4-person liferaft',
      category: 'safety',
      installed: true,
      critical: true,
      notes: 'Container versus valise storage and service date should be made explicit before open-water legs.'
    },
    {
      id: 'equipment:lifejackets',
      name: 'Automatic lifejackets with tethers',
      category: 'safety',
      installed: true,
      critical: true,
      notes: 'Quantity, cartridge dates, crotch straps and light status should be checked before each passage.'
    },
    {
      id: 'equipment:fire-extinguishers',
      name: 'Fire extinguishers',
      category: 'safety',
      installed: true,
      critical: true,
      notes: 'Locations and service dates should be part of the crew safety brief.'
    },
    {
      id: 'equipment:primary-anchor',
      name: 'Primary anchor and rode',
      category: 'ground-tackle',
      installed: true,
      critical: true,
      notes: 'Anchor, shackles and rode length are relevant for bailout and waiting decisions.'
    },
    {
      id: 'equipment:ibc-documents',
      name: 'Registration, insurance and radio documents',
      category: 'documents',
      installed: true,
      critical: true,
      notes: 'Keep IBS, insurance, MMSI/callsign paperwork and crew list available offline and printable.'
    }
  ],
  assumptions: [
    {
      id: 'assumption:h323-elina-user-supplied-core-data',
      statement: 'Core identity, dimensions and radio identifiers are based on the skipper-supplied H-323 data.',
      source: 'user',
      confidence: 'high',
      safetyImpact: 'medium'
    },
    {
      id: 'assumption:h323-elina-capacities-not-yet-confirmed',
      statement: 'Fuel, water and battery capacities are intentionally not used for range or endurance decisions until verified onboard.',
      source: 'user',
      confidence: 'high',
      safetyImpact: 'high'
    },
    {
      id: 'assumption:h323-elina-equipment-installed-before-passage',
      statement: 'Navigation and communication equipment is treated as installed for product modelling, but installation quality and commissioning checks remain separate checklist items.',
      source: 'user',
      confidence: 'medium',
      safetyImpact: 'high'
    }
  ],
  notes:
    'Reference Baltic coastal cruiser profile for Nautikool MVP content: small enough for conservative crew workload decisions, equipped enough to support AIS/VHF-aware passage planning.',
  audit: {
    createdAt: '2026-07-09T00:13:00+02:00',
    updatedAt: '2026-07-09T00:13:00+02:00',
    version: 1
  }
};

export const coreVesselProfiles: VesselProfile[] = [h323ElinaVesselProfile];

export function getVesselProfileById(id: string): VesselProfile | undefined {
  return coreVesselProfiles.find((profile) => profile.id === id);
}
