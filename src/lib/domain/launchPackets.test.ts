import { describe, expect, it } from 'vitest';
import { h323ElinaTurkuParnuLaunchPacket } from '$lib/content/launchPackets';
import { h323ElinaTurkuParnuDepartureBrief } from '$lib/content/departureBriefs';
import { buildLaunchPacket, type LaunchPacketInput } from './launchPackets';

const baseInput: LaunchPacketInput = {
  id: 'launch-packet:test',
  title: 'Test launch packet',
  brief: h323ElinaTurkuParnuDepartureBrief,
  departureWindowLabel: 'test daylight departure window',
  crewRoles: [
    { name: 'Skipper', role: 'Navigation and go/no-go', readAloudDuty: 'confirms first waypoint' },
    { name: 'Crew', role: 'Lookout and log', readAloudDuty: 'confirms bailout harbour' }
  ],
  berthDepartureActions: [
    {
      id: 'action:required-before-berth',
      label: 'Close blockers before leaving berth',
      owner: 'Skipper',
      due: 'before-leaving-berth',
      required: true
    }
  ],
  openWaterActions: [
    {
      id: 'action:required-open-water',
      label: 'Reassess before exposed water',
      owner: 'Skipper',
      due: 'before-open-water',
      required: true
    }
  ],
  firstWatchActions: [
    {
      id: 'action:first-watch-log',
      label: 'Log first watch state',
      owner: 'Crew',
      due: 'during-first-watch',
      required: false
    }
  ],
  emergencyReferenceLines: ['MOB: point, shout, mark position and throw flotation.'],
  paperPackItems: ['Departure brief', 'Radio card'],
  limitations: ['Test limitation.']
};

describe('launch packets', () => {
  it('blocks leaving the berth when the underlying departure brief is no-go', () => {
    const packet = buildLaunchPacket(baseInput);

    expect(packet.status).toBe('blocked');
    expect(packet.canLeaveBerth).toBe(false);
    expect(packet.openRequiredActionCount).toBe(2);
    expect(packet.firstAction).toBe('Close blockers before leaving berth');
  });

  it('keeps crew roles, emergency references and paper pack visible for cockpit handover', () => {
    const packet = buildLaunchPacket(baseInput);

    expect(packet.crewRoleCount).toBe(2);
    expect(packet.paperPackCount).toBe(2);
    expect(packet.cockpitChecklist.join(' ')).toContain('Emergency reference');
    expect(packet.briefingLines.join(' ')).toContain('Crew read-back');
  });

  it('publishes the H-323 Elina Turku to Pärnu launch packet as product content', () => {
    expect(h323ElinaTurkuParnuLaunchPacket.vesselName).toBe('Elina');
    expect(h323ElinaTurkuParnuLaunchPacket.passageTitle).toContain('Turku to Pärnu');
    expect(h323ElinaTurkuParnuLaunchPacket.crewRoles.map((role) => role.name)).toEqual([
      'Philipp',
      'Father',
      'Son'
    ]);
    expect(h323ElinaTurkuParnuLaunchPacket.emergencyReferenceLines.join(' ')).toContain('Mayday');
  });

  it('keeps static and live-condition limitations explicit', () => {
    const packet = buildLaunchPacket(baseInput);

    expect(packet.limitations.join(' ')).toContain('static cockpit preparation');
    expect(packet.limitations.join(' ')).toContain('live navigation');
    expect(packet.briefingLines.at(-1)).toContain('live condition differs');
  });
});
