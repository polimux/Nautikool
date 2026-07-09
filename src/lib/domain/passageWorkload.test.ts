import { describe, expect, it } from 'vitest';
import type { PassagePlan } from './types';
import { analyzePassageWorkload, type PassageWorkloadPolicy } from './passageWorkload';
import { h323ElinaTurkuParnuWorkload, h323FamilyBalticWorkloadPolicy } from '$lib/content/passageWorkload';
import { turkuToParnuFamilyPassagePlan } from '$lib/content/passagePlans';

const basePolicy: PassageWorkloadPolicy = {
  id: 'policy:test-family',
  title: 'Test family policy',
  targetMaxDayLegNm: 50,
  hardMaxDayLegNm: 65,
  maxComfortableDayHours: 10,
  maxExposedContinuousHours: 12,
  requireBailoutForEveryLeg: true,
  familyCrew: true,
  policyNotes: ['Test policy note.']
};

const easyPlan: PassagePlan = {
  id: 'plan:easy-day',
  title: 'Easy archipelago day',
  area: 'Archipelago Sea',
  contentVersion: 'test',
  assumptions: [],
  legs: [
    {
      id: 'leg:short-hop',
      from: 'Nauvo',
      to: 'Kasnäs',
      distanceNm: 24,
      plannedSpeedKn: 5,
      exposure: 'sheltered',
      daylightPreferred: true,
      hazards: [],
      bailoutHarbours: [{ name: 'Korpoström', note: 'Easy fallback in settled weather.' }],
      crewNotes: ['Use this as a relaxed family watch and pilotage drill.']
    }
  ]
};

describe('analyzePassageWorkload', () => {
  it('keeps a short sheltered leg green on static workload policy', () => {
    const summary = analyzePassageWorkload(easyPlan, basePolicy);

    expect(summary.canKeepFamilyWorkload).toBe(true);
    expect(summary.blockerFindings).toBe(0);
    expect(summary.cautionFindings).toBe(0);
    expect(summary.infoFindings).toBe(1);
    expect(summary.legs[0].highestSeverity).toBe('info');
  });

  it('blocks family day legs above the hard distance limit', () => {
    const summary = analyzePassageWorkload(turkuToParnuFamilyPassagePlan, basePolicy);
    const hankoCrossing = summary.legs.find((leg) => leg.legId === 'leg:hanko-to-haapsalu');

    expect(summary.canKeepFamilyWorkload).toBe(false);
    expect(hankoCrossing?.highestSeverity).toBe('blocker');
    expect(hankoCrossing?.findings.some((finding) => finding.kind === 'distance' && finding.severity === 'blocker')).toBe(true);
    expect(summary.firstAction).toContain('Split the leg');
  });

  it('warns when a longer exposed leg has only one bailout option recorded', () => {
    const summary = analyzePassageWorkload(turkuToParnuFamilyPassagePlan, basePolicy);
    const finalLeg = summary.legs.find((leg) => leg.legId === 'leg:haapsalu-to-parnu');

    expect(finalLeg?.findings.some((finding) => finding.kind === 'bailout' && finding.severity === 'caution')).toBe(true);
  });

  it('publishes an H-323 Elina workload card with the Hanko crossing held as a blocker', () => {
    expect(h323FamilyBalticWorkloadPolicy.targetMaxDayLegNm).toBe(50);
    expect(h323ElinaTurkuParnuWorkload.planId).toBe('passage-plan:turku-to-parnu-family-h323');
    expect(h323ElinaTurkuParnuWorkload.blockerFindings).toBeGreaterThan(0);
    expect(h323ElinaTurkuParnuWorkload.headline).toContain('workload blocker');
    expect(h323ElinaTurkuParnuWorkload.policyNotes.join(' ')).toContain('not live weather');
  });
});
