import { describe, expect, it } from 'vitest';
import { recommendPassageSplits, type PassageSplitScenario } from './passageSplitRecommendations';
import { turkuToParnuFamilyPassagePlan } from '$lib/content/passagePlans';
import {
  h323ElinaTurkuParnuSplitRecommendations,
  h323ElinaTurkuParnuSplitScenarios
} from '$lib/content/passageSplitRecommendations';

const singleScenario: PassageSplitScenario = {
  legId: 'leg:hanko-to-haapsalu',
  title: 'Test Hanko split',
  stops: [
    {
      name: 'Dirhami',
      reason: 'Shorter landfall decision before the direct Haapsalu leg becomes a fatigue problem.',
      approxDistanceFromStartNm: 55,
      approachNote: 'Confirm harbour status and approach notes before departure.',
      skipperCheck: 'Stop early if the crew cannot keep a reliable watch.'
    }
  ],
  notes: ['Use as a planning split, not as permission to sail marginal weather.']
};

describe('recommendPassageSplits', () => {
  it('turns an over-long open-water family leg into a blocker recommendation', () => {
    const summary = recommendPassageSplits(turkuToParnuFamilyPassagePlan, [singleScenario], {
      targetMaxDayLegNm: 50,
      hardMaxDayLegNm: 65
    });

    expect(summary.blockerRecommendations).toBe(1);
    expect(summary.headline).toContain('route split blocker');
    expect(summary.recommendations[0].headline).toContain('needs a written split');
    expect(summary.recommendations[0].readAloudBrief.join(' ')).toContain('Dirhami');
  });

  it('keeps limitations explicit so split suggestions cannot look like live harbour advice', () => {
    const summary = recommendPassageSplits(turkuToParnuFamilyPassagePlan, [singleScenario], {
      targetMaxDayLegNm: 50,
      hardMaxDayLegNm: 65
    });

    expect(summary.recommendations[0].limitations.join(' ')).toContain('static planning aids');
    expect(summary.recommendations[0].limitations.join(' ')).toContain('weather');
    expect(summary.recommendations[0].limitations.join(' ')).toContain('harbour');
  });

  it('publishes H-323 Elina split content for the direct crossing and final coastal leg', () => {
    expect(h323ElinaTurkuParnuSplitScenarios.map((scenario) => scenario.legId)).toContain('leg:hanko-to-haapsalu');
    expect(h323ElinaTurkuParnuSplitScenarios.map((scenario) => scenario.legId)).toContain('leg:haapsalu-to-parnu');
    expect(h323ElinaTurkuParnuSplitRecommendations.recommendationCount).toBeGreaterThanOrEqual(3);
    expect(h323ElinaTurkuParnuSplitRecommendations.firstDecisionPoint).toContain('Decide');
  });

  it('rejects split scenarios for unknown passage legs', () => {
    expect(() =>
      recommendPassageSplits(
        turkuToParnuFamilyPassagePlan,
        [{ ...singleScenario, legId: 'leg:missing' }],
        { targetMaxDayLegNm: 50, hardMaxDayLegNm: 65 }
      )
    ).toThrow('does not exist');
  });
});
