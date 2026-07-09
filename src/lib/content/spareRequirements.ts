import {
  assessSpareRequirements,
  summarizeSpareReadiness,
  type SpareRequirement
} from '$lib/domain/spares';

export const h323ElinaSpareRequirements: SpareRequirement[] = [
  {
    id: 'spare:h323-elina:raw-water-impeller-kit',
    vesselId: 'vessel:h323-elina',
    system: 'cooling',
    title: 'Raw-water impeller service kit',
    whyItMatters:
      'A blocked intake or failed impeller can stop the Yanmar during archipelago motoring or a harbour approach.',
    priority: 'critical',
    status: 'unknown',
    minimumQuantity: 1,
    usedFor: ['Yanmar 2GM15 cooling fault', 'weak exhaust water flow', 'post-blockage restart'],
    relatedMaintenanceTaskIds: ['maintenance:h323-elina:raw-water-impeller'],
    stowage: 'Engine spares box near companionway, not buried under cruising bags',
    skipperAction: 'Place one correct impeller, gasket and pump-cover tool in the engine spares box before departure.',
    tags: ['yanmar', 'cooling', 'critical-spare']
  },
  {
    id: 'spare:h323-elina:primary-fuel-filter',
    vesselId: 'vessel:h323-elina',
    system: 'fuel',
    title: 'Primary diesel fuel filter spare',
    whyItMatters:
      'A rough sea or low tank can stir sediment and turn a filter change into the difference between motoring and drifting.',
    priority: 'critical',
    status: 'missing',
    minimumQuantity: 1,
    usedFor: ['engine power loss', 'water or dirt in primary filter bowl', 'harbour approach recovery'],
    relatedMaintenanceTaskIds: ['maintenance:h323-elina:fuel-filter-bowl'],
    skipperAction: 'Buy the exact primary-filter element, label it and brief where the diesel shut-off and bleed tools are.',
    tags: ['diesel', 'fuel', 'engine']
  },
  {
    id: 'spare:h323-elina-alternator-belt',
    vesselId: 'vessel:h323-elina',
    system: 'engine',
    title: 'Alternator / water-pump belt',
    whyItMatters:
      'A failed belt can remove charging and cooling margin on a small inboard during a long family transfer leg.',
    priority: 'critical',
    status: 'unknown',
    minimumQuantity: 1,
    usedFor: ['belt squeal', 'charging fault', 'cooling warning after belt failure'],
    relatedMaintenanceTaskIds: ['maintenance:h323-elina:yanmar-engine-oil'],
    skipperAction: 'Confirm belt size from the fitted Yanmar setup and carry one spare with the required spanners.',
    tags: ['yanmar', 'belt', 'charging']
  },
  {
    id: 'spare:h323-elina:blade-fuses',
    vesselId: 'vessel:h323-elina',
    system: 'electrical',
    title: '12 V blade fuse assortment',
    whyItMatters:
      'VHF, AIS, plotter, cabin lights and bilge-pump circuits should not be lost for want of a small consumable.',
    priority: 'recommended',
    status: 'onboard',
    minimumQuantity: 10,
    onboardQuantity: 6,
    usedFor: ['Ray90 circuit', 'AIS circuit', 'SeaTalkNG converter', 'lighting or pump fault isolation'],
    relatedMaintenanceTaskIds: ['maintenance:h323-elina:battery-terminals', 'maintenance:h323-elina:vhf-dsc-position'],
    stowage: 'Dry labelled box close to switch panel',
    skipperAction: 'Top up 5 A, 10 A and 15 A fuses and label which circuits use each rating.',
    tags: ['12v', 'fuses', 'electronics']
  },
  {
    id: 'spare:h323-elina:vhf-backup-power',
    vesselId: 'vessel:h323-elina',
    system: 'navigation',
    title: 'Handheld VHF charged battery / backup radio',
    whyItMatters:
      'A cockpit-accessible backup radio reduces single-point failure if fixed VHF power or antenna wiring is lost.',
    priority: 'recommended',
    status: 'unknown',
    minimumQuantity: 1,
    usedFor: ['fixed VHF fault', 'cockpit harbour call', 'emergency backup if cabin access is unsafe'],
    relatedMaintenanceTaskIds: ['maintenance:h323-elina:vhf-dsc-position'],
    skipperAction: 'Charge the handheld VHF, verify channel selection and brief where it lives underway.',
    tags: ['vhf', 'src', 'backup']
  },
  {
    id: 'spare:h323-elina:softwood-plugs',
    vesselId: 'vessel:h323-elina',
    system: 'safety',
    title: 'Softwood plugs for seacocks and through-hulls',
    whyItMatters:
      'A leaking through-hull or hose failure needs an immediate mechanical plug, not a search through lockers.',
    priority: 'critical',
    status: 'onboard',
    minimumQuantity: 6,
    onboardQuantity: 6,
    usedFor: ['hose failure', 'seacock leak', 'emergency leak control'],
    relatedMaintenanceTaskIds: ['maintenance:h323-elina:liferaft-service-date'],
    stowage: 'Tied or taped near each relevant seacock plus one central spare bundle',
    skipperAction: 'Confirm each through-hull has a nearby plug and show crew the engine intake and toilet seacock locations.',
    tags: ['seacocks', 'leak', 'safety']
  },
  {
    id: 'spare:h323-elina:rig-tape-and-pins',
    vesselId: 'vessel:h323-elina',
    system: 'rig',
    title: 'Rig tape, split pins and seizing wire',
    whyItMatters:
      'Small rigging consumables prevent a loose pin, snagged tape or chafing edge from escalating during loaded sailing.',
    priority: 'recommended',
    status: 'onboard',
    minimumQuantity: 1,
    usedFor: ['turnbuckle pin replacement', 'sharp-edge taping', 'temporary seizing'],
    relatedMaintenanceTaskIds: ['maintenance:h323-elina:standing-rig-visible-check'],
    skipperAction: 'Keep pins, rig tape and seizing wire in a dry deck-repair pouch reachable before hoisting sail.',
    tags: ['rig', 'deck-check', 'repair']
  },
  {
    id: 'spare:h323-elina:nmea-drop-cable-and-terminator',
    vesselId: 'vessel:h323-elina',
    system: 'navigation',
    title: 'SeaTalkNG/NMEA2000 spare terminator and short spur cable',
    whyItMatters:
      'A small network fault can remove AIS or GPS from the plotter/VHF unless the skipper can isolate and replace simple parts.',
    priority: 'nice-to-have',
    status: 'unknown',
    minimumQuantity: 1,
    usedFor: ['AIS/GNSS network troubleshooting', 'temporary device isolation', 'adapter replacement'],
    relatedMaintenanceTaskIds: ['maintenance:h323-elina:vhf-dsc-position'],
    skipperAction: 'Carry one known-good terminator and short spur cable after the network installation is validated.',
    tags: ['nmea2000', 'seatalkng', 'ais']
  }
];

export const h323ElinaSpareFindings = assessSpareRequirements(h323ElinaSpareRequirements);
export const h323ElinaSpareSummary = summarizeSpareReadiness(h323ElinaSpareRequirements);
