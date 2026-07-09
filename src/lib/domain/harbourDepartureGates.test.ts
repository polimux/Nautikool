import { describe, expect, it } from 'vitest';
import {
  h323ElinaTurkuParnuHarbourDepartureGate,
  h323ElinaTurkuParnuHarbourGateRequirements
} from '$lib/content/harbourDepartureGates';
import { createHarbourRoutePack, type HarbourNote } from './harbours';
import { createHarbourDepartureGate, type HarbourDepartureGateRequirement } from './harbourDepartureGates';

const readyHarbour: HarbourNote = {
  id: 'harbour:ready-marina',
  name: 'Ready Marina',
  country: 'Testonia',
  area: 'Checked Bay',
  role: 'planned-stop',
  vesselFit: {
    maxDraftMeters: 3,
    alongsideOrBox: 'verified guest berth',
    confidence: 'high'
  },
  sourceFreshness: 'current',
  approach: {
    pilotage: 'Use the marked fairway and keep the leading line open.',
    hazards: ['cross traffic'],
    nightArrival: 'suitable',
    vhfChannel: 'VHF 12',
    depthMeters: 3,
    shelter: 'sheltered'
  },
  facilities: [{ type: 'berth', available: true, note: 'Berth confirmed for the test scenario.' }],
  skipperNotes: ['Ready harbour for green-gate testing.'],
  verificationPrompts: [
    'Confirm contact, berth availability, depth, daylight, night entry, bailout shelter and destination after-hours plan.'
  ],
  safetyLimitations: ['Training note only.']
};

const gateRequirements: HarbourDepartureGateRequirement[] = [
  {
    id: 'req:contacts',
    label: 'Contact and berth availability',
    scope: 'committed-stops',
    priority: 'required',
    verificationPrompt: 'Record contact and berth availability.',
    evidenceKeywords: ['contact', 'availability']
  },
  {
    id: 'req:depth',
    label: 'Depth margin',
    scope: 'committed-stops',
    priority: 'required',
    verificationPrompt: 'Record depth margin.',
    evidenceKeywords: ['depth']
  }
];

describe('harbour departure gates', () => {
  it('creates a ready gate when route pack and required verification topics are clean', () => {
    const routePack = createHarbourRoutePack(
      'Green route pack',
      [readyHarbour, { ...readyHarbour, id: 'harbour:ready-bailout', name: 'Ready Bailout', role: 'bailout' }],
      1.45
    );
    const gate = createHarbourDepartureGate({ title: 'Green harbour gate', routePack, requirements: gateRequirements });

    expect(gate.status).toBe('ready');
    expect(gate.usableAlternateCount).toBe(1);
    expect(gate.findings).toEqual([]);
    expect(gate.checklistItems.every((item) => item.coveredByRoutePack)).toBe(true);
  });

  it('blocks departure when committed-stop harbour blockers remain open', () => {
    const staleStop = { ...readyHarbour, id: 'harbour:stale-stop', name: 'Stale Stop', sourceFreshness: 'unknown' as const };
    const routePack = createHarbourRoutePack(
      'Blocked route pack',
      [staleStop, { ...readyHarbour, id: 'harbour:ready-bailout', name: 'Ready Bailout', role: 'bailout' }],
      1.45
    );
    const gate = createHarbourDepartureGate({ title: 'Blocked harbour gate', routePack, requirements: gateRequirements });

    expect(gate.status).toBe('blocked');
    expect(gate.findings[0].text).toContain('committed-stop harbour blocker');
    expect(gate.firstAction).toContain('Do not cast off');
  });

  it('warns when alternates exist but none are usable with contact recorded', () => {
    const bailoutWithoutContact: HarbourNote = {
      ...readyHarbour,
      id: 'harbour:bailout-no-contact',
      name: 'Bailout Without Contact',
      role: 'bailout',
      approach: { ...readyHarbour.approach, vhfChannel: undefined }
    };
    const routePack = createHarbourRoutePack('Caution route pack', [readyHarbour, bailoutWithoutContact], 1.45);
    const gate = createHarbourDepartureGate({ title: 'Caution harbour gate', routePack, requirements: gateRequirements });

    expect(gate.status).toBe('caution');
    expect(gate.usableAlternateCount).toBe(0);
    expect(gate.findings.map((finding) => finding.text).join(' ')).toContain('No alternate harbour');
  });

  it('publishes the H-323 Elina Turku to Pärnu harbour gate as blocked until harbour facts are refreshed', () => {
    expect(h323ElinaTurkuParnuHarbourGateRequirements).toHaveLength(5);
    expect(h323ElinaTurkuParnuHarbourDepartureGate.status).toBe('blocked');
    expect(h323ElinaTurkuParnuHarbourDepartureGate.committedStopCount).toBeGreaterThan(0);
    expect(h323ElinaTurkuParnuHarbourDepartureGate.alternateStopCount).toBeGreaterThan(0);
    expect(h323ElinaTurkuParnuHarbourDepartureGate.firstAction).toContain('Do not cast off');
    expect(h323ElinaTurkuParnuHarbourDepartureGate.readAloudBrief.join(' ')).toContain('current charts');
    expect(h323ElinaTurkuParnuHarbourDepartureGate.safetyLimitations.join(' ')).toContain('not live berth availability');
  });
});
