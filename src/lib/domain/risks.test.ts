import { describe, expect, it } from 'vitest';
import { turkuToParnuFamilyPassagePlan } from '$lib/content/passagePlans';
import { turkuToParnuModerateRiskAssessment, turkuToParnuModerateRiskInput } from '$lib/content/riskAssessments';
import { h323ElinaVesselProfile } from '$lib/content/vesselProfiles';
import type { RiskAssessmentInput } from './types';
import { assessPassageRisk } from './risks';

describe('risk assessment engine', () => {
  it('classifies the starter Baltic family passage as a yellow planning decision', () => {
    expect(turkuToParnuModerateRiskAssessment.level).toBe('yellow');
    expect(turkuToParnuModerateRiskAssessment.canDepart).toBe(true);
    expect(turkuToParnuModerateRiskAssessment.summary.openWaterLegs).toBe(1);
    expect(turkuToParnuModerateRiskAssessment.summary.highSeverityHazards).toBe(1);
    expect(turkuToParnuModerateRiskAssessment.summary.cautionFindings).toBeGreaterThanOrEqual(3);
  });

  it('escalates Baltic wind above the agreed small-yacht limit to red', () => {
    const input: RiskAssessmentInput = {
      ...turkuToParnuModerateRiskInput,
      weather: {
        ...turkuToParnuModerateRiskInput.weather,
        sustainedWindKn: 20,
        gustKn: 26
      }
    };

    const assessment = assessPassageRisk(input);

    expect(assessment.level).toBe('red');
    expect(assessment.canDepart).toBe(false);
    expect(assessment.findings.map((finding) => finding.id)).toContain('risk:baltic-wind-no-go');
  });

  it('treats stale forecasts as a no-go input', () => {
    const assessment = assessPassageRisk({
      ...turkuToParnuModerateRiskInput,
      weather: {
        ...turkuToParnuModerateRiskInput.weather,
        forecastAgeHours: 13
      }
    });

    expect(assessment.level).toBe('red');
    expect(assessment.summary.noGoFindings).toBeGreaterThanOrEqual(1);
    expect(assessment.findings.map((finding) => finding.id)).toContain('risk:weather-forecast-stale');
  });

  it('does not allow missing critical vessel equipment to stay green', () => {
    const vesselWithoutVhf = {
      ...h323ElinaVesselProfile,
      equipment: h323ElinaVesselProfile.equipment.map((item) =>
        item.id === 'equipment:fixed-vhf-dsc' ? { ...item, installed: false } : item
      )
    };

    const assessment = assessPassageRisk({
      ...turkuToParnuModerateRiskInput,
      vessel: vesselWithoutVhf
    });

    expect(assessment.level).toBe('red');
    expect(assessment.summary.missingCriticalEquipment).toBe(1);
    expect(assessment.findings.map((finding) => finding.id)).toContain('risk:vessel-critical-equipment-missing');
  });

  it('keeps the static content linked to the H-323 Turku to Pärnu plan', () => {
    expect(turkuToParnuModerateRiskInput.passage.id).toBe(turkuToParnuFamilyPassagePlan.id);
    expect(turkuToParnuModerateRiskInput.vessel.id).toBe('vessel:h323-elina');
    expect(turkuToParnuModerateRiskInput.assumptions.some((assumption) => assumption.safetyImpact === 'high')).toBe(true);
  });
});
