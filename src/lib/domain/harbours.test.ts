import { describe, expect, it } from 'vitest';
import {
  getHarbourNoteById,
  h323ElinaHarbourFindings,
  h323ElinaHarbourSummary,
  h323ElinaTurkuParnuHarbourNotes,
  h323ElinaTurkuParnuHarbourRoutePack
} from '$lib/content/harbourNotes';
import {
  assessHarbourNote,
  createHarbourRoutePack,
  getHarbourNoteStatus,
  summarizeHarbourNotebook,
  type HarbourNote
} from './harbours';

const baseHarbour: HarbourNote = {
  id: 'harbour:test',
  name: 'Test Harbour',
  country: 'Testonia',
  area: 'Unit Test Bay',
  role: 'planned-stop',
  vesselFit: {
    maxDraftMeters: 2.5,
    alongsideOrBox: 'test berth',
    confidence: 'high'
  },
  sourceFreshness: 'current',
  approach: {
    pilotage: 'Follow the tested approach and keep a lookout.',
    hazards: ['unit-test rocks'],
    nightArrival: 'suitable',
    vhfChannel: 'VHF 12',
    depthMeters: 2.5,
    shelter: 'sheltered'
  },
  facilities: [{ type: 'berth', available: true, note: 'Test berth available.' }],
  skipperNotes: ['Use this harbour to test notebook logic.'],
  verificationPrompts: ['Confirm the test harbour before departure.'],
  safetyLimitations: ['Test note only.']
};

describe('harbour notebook', () => {
  it('marks a complete fresh harbour note as ready', () => {
    expect(getHarbourNoteStatus(baseHarbour, 1.45)).toBe('ready');
    expect(assessHarbourNote(baseHarbour, 1.45)).toEqual([]);
  });

  it('escalates unknown source freshness and missing depth as blockers', () => {
    const findings = assessHarbourNote(
      {
        ...baseHarbour,
        sourceFreshness: 'unknown',
        vesselFit: { ...baseHarbour.vesselFit, maxDraftMeters: undefined },
        approach: { ...baseHarbour.approach, depthMeters: undefined }
      },
      1.45
    );

    expect(findings.filter((finding) => finding.severity === 'blocker')).toHaveLength(2);
    expect(findings.map((finding) => finding.text).join(' ')).toContain('unknown');
    expect(findings.map((finding) => finding.text).join(' ')).toContain('no recorded depth');
  });

  it('blocks planned stops that should avoid night arrival', () => {
    const status = getHarbourNoteStatus(
      {
        ...baseHarbour,
        approach: { ...baseHarbour.approach, nightArrival: 'avoid' }
      },
      1.45
    );

    expect(status).toBe('incomplete');
  });

  it('summarizes H-323 Elina harbour notes without false offline confidence', () => {
    expect(h323ElinaTurkuParnuHarbourNotes).toHaveLength(8);
    expect(h323ElinaHarbourSummary.harbourCount).toBe(8);
    expect(h323ElinaHarbourSummary.readyCount).toBe(0);
    expect(h323ElinaHarbourSummary.incompleteCount).toBeGreaterThan(0);
    expect(h323ElinaHarbourSummary.blockerFindings).toBeGreaterThan(0);
    expect(h323ElinaHarbourSummary.firstAction).toContain('Verify');
  });

  it('keeps named split and destination harbour content available for the route pack', () => {
    const dirhami = getHarbourNoteById('harbour:h323-elina:dirhami');
    const parnu = getHarbourNoteById('harbour:h323-elina:parnu');

    expect(dirhami?.role).toBe('bailout');
    expect(dirhami?.skipperNotes.join(' ')).toContain('verified decision harbour');
    expect(parnu?.role).toBe('destination');
    expect(parnu?.verificationPrompts.join(' ')).toContain('after-hours arrival procedure');
  });

  it('includes cockpit-readable offline brief lines for every harbour', () => {
    const summary = summarizeHarbourNotebook(h323ElinaTurkuParnuHarbourNotes, 1.45);

    expect(summary.offlineBrief).toHaveLength(h323ElinaTurkuParnuHarbourNotes.length);
    expect(summary.offlineBrief[0]).toContain('Turku');
    expect(summary.offlineBrief.join(' ')).toContain('contact not recorded');
    expect(h323ElinaHarbourFindings.some((finding) => finding.skipperAction.includes('daylight'))).toBe(true);
  });

  it('builds a harbour route pack with committed stops and alternates', () => {
    const pack = createHarbourRoutePack('Test route pack', [baseHarbour, { ...baseHarbour, id: 'harbour:bailout', name: 'Bailout Cove', role: 'bailout' }], 1.45);

    expect(pack.status).toBe('ready');
    expect(pack.committedStops).toHaveLength(1);
    expect(pack.alternateStops).toHaveLength(1);
    expect(pack.readAloudBrief[0]).toContain('1 committed stops and 1 alternates');
    expect(pack.safetyLimitations.join(' ')).toContain('not live berth availability');
  });

  it('publishes the H-323 Elina Turku to Pärnu harbour route pack as blocked until verified', () => {
    expect(h323ElinaTurkuParnuHarbourRoutePack.status).toBe('blocked');
    expect(h323ElinaTurkuParnuHarbourRoutePack.committedStops.map((stop) => stop.name)).toContain('Pärnu');
    expect(h323ElinaTurkuParnuHarbourRoutePack.alternateStops.map((stop) => stop.name)).toContain('Dirhami');
    expect(h323ElinaTurkuParnuHarbourRoutePack.verificationQueue[0]).toContain('Verify');
    expect(h323ElinaTurkuParnuHarbourRoutePack.readAloudBrief.join(' ')).toContain('First committed-stop blocker');
  });
});
