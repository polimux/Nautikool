import { buildLaunchPacket, type LaunchPacketInput } from '$lib/domain/launchPackets';
import { h323ElinaTurkuParnuDepartureBrief } from './departureBriefs';

export const h323ElinaTurkuParnuLaunchPacketInput: LaunchPacketInput = {
  id: 'launch-packet:h323-elina:turku-parnu-family',
  title: 'H-323 Elina Turku to Pärnu launch packet',
  brief: h323ElinaTurkuParnuDepartureBrief,
  departureWindowLabel: '26 July 2026 family-crew start, daylight-first conservative Baltic plan',
  crewRoles: [
    {
      name: 'Philipp',
      role: 'Skipper, navigation, final go/no-go and reefing decisions',
      readAloudDuty: 'confirms dashboard status, first waypoint, VHF channel plan and abort phrase'
    },
    {
      name: 'Father',
      role: 'Lookout, log prompts and harbour-contact backup when rested',
      readAloudDuty: 'reads the first two route risks and confirms bailout harbour names'
    },
    {
      name: 'Son',
      role: 'Timed simple checks, hydration reminder and non-critical cockpit observations',
      readAloudDuty: 'confirms lifejacket, handheld VHF location and stop phrase'
    }
  ],
  berthDepartureActions: [
    {
      id: 'launch-action:close-dashboard-blockers',
      label: 'Close dashboard blockers before lines off: harbour gate, critical spares, maintenance and checklist items',
      owner: 'Skipper',
      due: 'before-leaving-berth',
      required: true
    },
    {
      id: 'launch-action:write-live-state',
      label: 'Write actual departure time, engine hours, fuel confidence, barometer and forecast timestamp on the paper copy',
      owner: 'Skipper',
      due: 'before-leaving-berth',
      required: true
    },
    {
      id: 'launch-action:crew-readback',
      label: 'Crew reads back stop phrase, MOB first actions, liferaft/handheld VHF location and first bailout harbour',
      owner: 'All crew',
      due: 'before-leaving-berth',
      required: true
    }
  ],
  openWaterActions: [
    {
      id: 'launch-action:open-water-reassessment',
      label: 'Reassess wind, gusts, visibility, crew energy and engine confidence before committing to exposed open water',
      owner: 'Skipper + lookout',
      due: 'before-open-water',
      required: true
    },
    {
      id: 'launch-action:vfh-ais-crosscheck',
      label: 'Confirm Ray90 DSC position, AIS target path and paper fallback before using electronics as traffic support',
      owner: 'Skipper',
      due: 'before-open-water',
      required: true
    }
  ],
  firstWatchActions: [
    {
      id: 'launch-action:first-watch-log',
      label: 'Log first waypoint, sail setup, sea state and crew state during the first watch instead of waiting for fatigue',
      owner: 'Father with skipper confirmation',
      due: 'during-first-watch',
      required: false
    },
    {
      id: 'launch-action:family-energy-check',
      label: 'Run a family energy check before the plan drifts beyond the 50 nm day-leg target',
      owner: 'Skipper',
      due: 'during-first-watch',
      required: false
    }
  ],
  emergencyReferenceLines: [
    'MOB: point, shout, press MOB/mark position, throw flotation, keep visual contact, start recovery checklist.',
    'Mayday rehearsal: vessel Elina, MMSI/callsign from ship documents, position from trusted GNSS, nature of distress, people onboard.',
    'Engine confidence loss: stay in safe water, reduce commitments, identify nearest verified bailout harbour, prepare Pan-Pan if safety deteriorates.'
  ],
  paperPackItems: [
    'Printable departure skipper brief',
    'Harbour departure gate and bailout harbour notes',
    'SRC/VHF radio call cards',
    'Engine and spares readiness notes',
    'Paper route with first two waypoints and abort harbours marked'
  ],
  limitations: [
    'Use this packet as a final cockpit handover only after updating live weather, notices, harbour availability and vessel state.',
    'Family-crew tasks are deliberately conservative; no training task overrides lookout, navigation or boat handling.'
  ]
};

export const h323ElinaTurkuParnuLaunchPacket = buildLaunchPacket(h323ElinaTurkuParnuLaunchPacketInput);

export const coreLaunchPackets = [h323ElinaTurkuParnuLaunchPacket];
