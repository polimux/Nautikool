import {
  assessMaintenanceTasks,
  summarizeMaintenanceReadiness,
  type MaintenanceTask
} from '$lib/domain/maintenance';

export const h323ElinaMaintenanceTasks: MaintenanceTask[] = [
  {
    id: 'maintenance:h323-elina:yanmar-engine-oil',
    vesselId: 'vessel:h323-elina',
    system: 'engine',
    title: 'Yanmar 2GM15 engine oil and gearbox oil check',
    whyItMatters:
      'A family coastal passage should not start with unknown lubrication state on the inboard or shaft-drive gearbox.',
    lastCompletedAt: '2026-06-24',
    dueAt: '2026-07-24',
    severity: 'caution',
    skipperAction: 'Check oil level cold, inspect for milkiness or metal particles and record engine hours before departure.',
    evidence: ['Dipstick level verified', 'Gearbox oil checked', 'Bilge under engine dry'],
    tags: ['yanmar', 'pre-departure', 'engine']
  },
  {
    id: 'maintenance:h323-elina:raw-water-impeller',
    vesselId: 'vessel:h323-elina',
    system: 'cooling',
    title: 'Raw-water cooling flow and impeller spare',
    whyItMatters:
      'Motoring through archipelago channels or harbour approaches requires immediate confidence in cooling-water flow.',
    lastCompletedAt: '2026-06-22',
    dueAt: '2026-07-22',
    severity: 'blocker',
    skipperAction: 'Start the engine at berth, confirm exhaust water flow within seconds and place the impeller spare with tools.',
    evidence: ['Cooling-water flow observed', 'Spare impeller onboard', 'Pump cover tool onboard'],
    tags: ['cooling', 'yanmar', 'spares']
  },
  {
    id: 'maintenance:h323-elina:fuel-filter-bowl',
    vesselId: 'vessel:h323-elina',
    system: 'fuel',
    title: 'Fuel filter bowl and diesel shut-off check',
    whyItMatters:
      'A blocked filter or unknown shut-off valve can turn a routine harbour approach into an engine-failure drill.',
    status: 'due-soon',
    severity: 'caution',
    skipperAction: 'Inspect the primary filter bowl, confirm spare filter availability and point out the fuel shut-off to crew.',
    evidence: ['Primary filter visually checked', 'Spare filter onboard', 'Fuel shut-off location briefed'],
    tags: ['diesel', 'fuel', 'crew-brief']
  },
  {
    id: 'maintenance:h323-elina:liferaft-service-date',
    vesselId: 'vessel:h323-elina',
    system: 'safety',
    title: 'Liferaft service date and stowage decision',
    whyItMatters:
      'Cold Baltic water and family crew require the raft to be in service, reachable and not buried under cruising gear.',
    status: 'unknown',
    severity: 'blocker',
    skipperAction: 'Record service date, capacity and stowage location; if unknown, treat offshore or night legs as no-go.',
    evidence: ['Service label photographed', 'Capacity recorded', 'Stowage accessible from cockpit or companionway'],
    tags: ['liferaft', 'cold-water', 'family-crew']
  },
  {
    id: 'maintenance:h323-elina:fire-extinguishers',
    vesselId: 'vessel:h323-elina',
    system: 'safety',
    title: 'Fire extinguishers pressure and access check',
    whyItMatters:
      'Engine, galley and electrical faults need immediate response without searching lockers under stress.',
    dueAt: '2026-08-15',
    severity: 'caution',
    skipperAction: 'Check pressure indicators, expiry dates and access; brief one crew member on locations before casting off.',
    evidence: ['Pressure green', 'Expiry date acceptable', 'Locations briefed'],
    tags: ['fire', 'safety', 'briefing']
  },
  {
    id: 'maintenance:h323-elina:vhf-dsc-position',
    vesselId: 'vessel:h323-elina',
    system: 'navigation',
    title: 'Ray90 DSC position input and radio check',
    whyItMatters:
      'A DSC distress alert is much weaker if the radio has no current GNSS position or the crew cannot verify it.',
    status: 'unknown',
    severity: 'blocker',
    skipperAction: 'Confirm Ray90 displays current position from SeaTalkNG/NMEA, then make a routine radio check where appropriate.',
    evidence: ['Current position visible on VHF', 'MMSI checked', 'Radio check logged'],
    tags: ['vhf', 'dsc', 'gnss', 'src']
  },
  {
    id: 'maintenance:h323-elina:battery-terminals',
    vesselId: 'vessel:h323-elina',
    system: 'electrical',
    title: 'Battery terminals, main switch and charging path',
    whyItMatters:
      'Navigation electronics, VHF, AIS and bilge pump depend on a known 12 V baseline before leaving shore power.',
    dueAt: '2026-07-18',
    severity: 'caution',
    skipperAction: 'Inspect terminals, label main switch states and verify charging from alternator or shore-power charger.',
    evidence: ['Terminals tight', 'Switch positions labelled', 'Charging voltage observed'],
    tags: ['12v', 'battery', 'charging']
  },
  {
    id: 'maintenance:h323-elina:standing-rig-visible-check',
    vesselId: 'vessel:h323-elina',
    system: 'rig',
    title: 'Standing rigging deck-level visual check',
    whyItMatters:
      'A basic pre-passage rig inspection catches missing split pins, opened tape or obvious strand damage before load increases.',
    lastCompletedAt: '2026-07-01',
    dueAt: '2026-07-26',
    severity: 'caution',
    skipperAction: 'Walk the deck, check terminals, split pins, turnbuckles and halyard chafe before the first longer leg.',
    evidence: ['Split pins present', 'No broken strands visible', 'Halyards free and not chafed'],
    tags: ['rig', 'deck-check', 'pre-passage']
  }
];

export const h323ElinaMaintenanceFindings = assessMaintenanceTasks(h323ElinaMaintenanceTasks, {
  asOf: '2026-07-26',
  dueSoonDays: 14
});

export const h323ElinaMaintenanceSummary = summarizeMaintenanceReadiness(h323ElinaMaintenanceTasks, {
  asOf: '2026-07-26',
  dueSoonDays: 14
});
