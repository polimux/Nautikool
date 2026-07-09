import { describe, expect, it } from 'vitest';
import { h323ElinaTurkuParnuLaunchPacket } from '$lib/content/launchPackets';
import { buildWatchKickoff, h323ElinaTurkuParnuFirstWatchKickoff, type WatchKickoffInput } from './watchKickoffs';

const input: WatchKickoffInput = {
  id: 'watch-kickoff:test',
  title: 'Test watch kickoff',
  launchPacket: h323ElinaTurkuParnuLaunchPacket,
  watchName: 'First family watch',
  watchDurationMinutes: 60,
  crewEnergyPrompt: 'Crew says green, yellow or red for energy and attention',
  navigationPrompts: ['Confirm first waypoint', 'Name the next bailout harbour'],
  trafficPrompts: ['Compare visual lookout with AIS'],
  engineeringPrompts: ['Check cooling water and charging confidence'],
  taskCards: [
    {
      id: 'watch-task:position',
      title: 'Write first position',
      owner: 'Lookout',
      cadence: 'within-15-minutes',
      required: true,
      readAloud: 'Write time, position source and next waypoint'
    },
    {
      id: 'watch-task:route-gate',
      title: 'Route gate review',
      owner: 'Skipper',
      cadence: 'before-open-water',
      required: true,
      readAloud: 'Say wind, visibility, engine confidence and abort harbour'
    }
  ],
  handoverTriggers: ['traffic uncertainty', 'engine confidence changes'],
  limitations: ['Test watch kickoff limitation.']
};

describe('watch kickoffs', () => {
  it('blocks watch start when the launch packet is blocked', () => {
    const kickoff = buildWatchKickoff(input);

    expect(kickoff.status).toBe('blocked');
    expect(kickoff.canStartWatch).toBe(false);
    expect(kickoff.openBlockerCount).toBeGreaterThan(0);
    expect(kickoff.firstTask).toBe('Write first position');
  });

  it('builds timer cards from watch tasks and launch-packet underway actions', () => {
    const kickoff = buildWatchKickoff(input);

    expect(kickoff.timerCards.join(' ')).toContain('within-15-minutes');
    expect(kickoff.timerCards.join(' ')).toContain('before-open-water');
    expect(kickoff.timerCards.join(' ')).toContain('Reassess wind');
  });

  it('publishes the H-323 Elina first-watch kickoff as scenario content', () => {
    expect(h323ElinaTurkuParnuFirstWatchKickoff.vesselName).toBe('Elina');
    expect(h323ElinaTurkuParnuFirstWatchKickoff.passageTitle).toContain('Turku to Pärnu');
    expect(h323ElinaTurkuParnuFirstWatchKickoff.readAloudBrief.join(' ')).toContain('family watch');
    expect(h323ElinaTurkuParnuFirstWatchKickoff.timerCards.join(' ')).toContain('handheld VHF');
    expect(h323ElinaTurkuParnuFirstWatchKickoff.handoverLines.join(' ')).toContain('bailout decision');
  });

  it('keeps static limitation wording visible', () => {
    const kickoff = buildWatchKickoff(input);

    expect(kickoff.limitations.join(' ')).toContain('static crew-briefing prompts');
    expect(kickoff.limitations.join(' ')).toContain('not live lookout');
  });
});
