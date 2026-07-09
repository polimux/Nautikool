import { describe, expect, it } from 'vitest';
import {
  h323ElinaSpareFindings,
  h323ElinaSpareRequirements,
  h323ElinaSpareSummary
} from '$lib/content/spareRequirements';
import { assessSpareRequirements, summarizeSpareReadiness, type SpareRequirement } from './spares';

const baseSpare: SpareRequirement = {
  id: 'spare:test',
  vesselId: 'vessel:test',
  system: 'engine',
  title: 'Test spare',
  whyItMatters: 'It keeps the test vessel from pretending a locker is prepared.',
  priority: 'critical',
  status: 'onboard',
  minimumQuantity: 1,
  onboardQuantity: 1,
  usedFor: ['test failure'],
  relatedMaintenanceTaskIds: ['maintenance:test'],
  skipperAction: 'Check the test spare.',
  tags: ['test']
};

describe('spare readiness', () => {
  it('escalates missing and unknown critical spares as blockers', () => {
    const findings = assessSpareRequirements([
      { ...baseSpare, id: 'spare:missing', status: 'missing' },
      { ...baseSpare, id: 'spare:unknown', status: 'unknown' }
    ]);

    expect(findings).toHaveLength(2);
    expect(findings.every((finding) => finding.severity === 'blocker')).toBe(true);
    expect(findings.map((finding) => finding.status)).toEqual(['missing', 'unknown']);
  });

  it('treats insufficient quantities as findings even when a spare is marked onboard', () => {
    const findings = assessSpareRequirements([
      { ...baseSpare, priority: 'recommended', minimumQuantity: 6, onboardQuantity: 2 }
    ]);

    expect(findings).toHaveLength(1);
    expect(findings[0].status).toBe('insufficient');
    expect(findings[0].severity).toBe('caution');
  });

  it('summarizes the H-323 Elina spare kit without creating false departure confidence', () => {
    expect(h323ElinaSpareRequirements).toHaveLength(8);
    expect(h323ElinaSpareSummary.spareCount).toBe(8);
    expect(h323ElinaSpareSummary.criticalSpares).toBe(4);
    expect(h323ElinaSpareSummary.canDepart).toBe(false);
    expect(h323ElinaSpareSummary.blockerFindings).toBeGreaterThanOrEqual(3);
    expect(h323ElinaSpareSummary.firstBlocker).toContain('Raw-water impeller service kit');
    expect(h323ElinaSpareSummary.systemsCovered).toContain('cooling');
    expect(h323ElinaSpareSummary.systemsCovered).toContain('navigation');
  });

  it('keeps maintenance links and skipper actions visible for practical preparation', () => {
    const fuelSpare = h323ElinaSpareRequirements.find((spare) => spare.id === 'spare:h323-elina:primary-fuel-filter');
    const fuelFinding = h323ElinaSpareFindings.find((finding) => finding.spareId === 'spare:h323-elina:primary-fuel-filter');

    expect(fuelSpare?.relatedMaintenanceTaskIds).toContain('maintenance:h323-elina:fuel-filter-bowl');
    expect(fuelSpare?.usedFor.join(' ')).toContain('harbour approach');
    expect(fuelFinding?.skipperAction).toContain('Buy the exact primary-filter element');
  });

  it('returns a green summary only when critical blocker findings are closed', () => {
    const prepared = h323ElinaSpareRequirements.map((spare) => ({
      ...spare,
      status: 'onboard' as const,
      onboardQuantity: Math.max(spare.minimumQuantity, spare.onboardQuantity ?? spare.minimumQuantity)
    }));
    const summary = summarizeSpareReadiness(prepared);

    expect(summary.canDepart).toBe(true);
    expect(summary.blockerFindings).toBe(0);
    expect(summary.cautionFindings).toBe(0);
  });
});
