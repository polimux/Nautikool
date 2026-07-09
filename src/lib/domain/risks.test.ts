import { describe, expect, it } from 'vitest';
import { turkuToParnuFamilyPassagePlan } from '$lib/content/passagePlans';
import {
  turkuToParnuModerateRiskAssessment,
  turkuToParnuModerateRiskInput,
  turkuToParnuNightCrossingRiskAssessment,
  turkuToParnuNightCrossingRiskInput
} from '$lib/content/riskAssessments';
import { h323ElinaVesselProfile } from '$lib/content/vesselProfiles';
import type { RiskAssessmentInput } from './types';
import { assessPassageRisk } from './risks';

describe('risk assessment engine', () => {
  it('classifies the starter Baltic family passage as a yellow planning decision', () => {
    expect(turkuToParnuModerateRiskAssessment.level).toBe('yellow');
    expect(turkuToParnuModerateRiskAssessment.canDepart).toBe(true);
    expect(turkuToParnuModerateRiskAssessment.summary.openWaterLegs).toBe(1);
    expect(turkuToParnuModerateRiskAssessment.summary.highSeverityHazards).toBe(1);
    expect(turkuToParnuModerateRiskAssessment.summary.cautionFindings).toBeGreaterThanOrEqual(4);
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

  it('warns when a likely night leg has no recorded night experience', () => {
    expect(turkuToParnuModerateRiskAssessment.findings.map((finding) => finding.id)).toContain(
      'risk:night-leg-without-night-experience'
    );
  });

  it('warns on limited visibility and keeps the night crossing scenario yellow', () => {
    expect(turkuToParnuNightCrossingRiskAssessment.level).toBe('yellow');
    expect(turkuToParnuNightCrossingRiskAssessment.canDepart).toBe(true);
    expect(turkuToParnuNightCrossingRiskAssessment.findings.map((finding) => finding.id)).toContain(
      'risk:restricted-visibility-caution'
    );
    expect(turkuToParnuNightCrossingRiskAssessment.findings.map((finding) => finding.id)).toContain(
      'risk:night-leg-without-night-experience'
    );
  });

  it('escalates very poor visibility to red for exposed family passage planning', () => {
    const assessment = assessPassageRisk({
      ...turkuToParnuNightCrossingRiskInput,
      weather: {
        ...turkuToParnuNightCrossingRiskInput.weather,
        visibilityNm: 1.5
      }
    });

    expect(assessment.level).toBe('red');
    expect(assessment.canDepart).toBe(false);
    expect(assessment.findings.map((finding) => finding.id)).toContain('risk:restricted-visibility-no-go');
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
    expect(turkuToParnuNightCrossingRiskInput.assumptions.some((assumption) => assumption.id.includes('night'))).toBe(true);
  });
});
