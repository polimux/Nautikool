import { turkuToParnuFamilyPassagePlan } from '$lib/content/passagePlans';
import { h323ElinaVesselProfile } from '$lib/content/vesselProfiles';
import { assessPassageRisk } from '$lib/domain/risks';
import type { RiskAssessmentInput } from '$lib/domain/types';

export const turkuToParnuModerateRiskInput: RiskAssessmentInput = {
  id: 'risk-input:turku-to-parnu-family-moderate-baltic',
  title: 'Turku to Pärnu family passage - moderate Baltic planning scenario',
  passage: turkuToParnuFamilyPassagePlan,
  vessel: h323ElinaVesselProfile,
  weather: {
    sustainedWindKn: 15,
    gustKn: 21,
    waveHeightMeters: 1.1,
    visibilityNm: 6,
    thunderstormRisk: 'low',
    forecastAgeHours: 4
  },
  crew: {
    skipperExperienceNm: 1500,
    hasNightExperience: false,
    crewCount: 3,
    minorsOnBoard: 1,
    fatigueLevel: 'medium'
  },
  assumptions: [
    {
      id: 'assumption:risk-baltic-family-crew',
      statement:
        'The crew is modelled as one skipper, one adult crew member and one 15-year-old family crew member for conservative workload planning.',
      source: 'user',
      confidence: 'high',
      safetyImpact: 'medium'
    },
    {
      id: 'assumption:risk-moderate-weather-scenario',
      statement:
        'This is a static planning scenario, not a live forecast; it exists to test and demonstrate the risk rules.',
      source: 'default',
      confidence: 'high',
      safetyImpact: 'high'
    },
    {
      id: 'assumption:risk-leg-by-leg-go-decision',
      statement:
        'The route should be reassessed before each leg rather than treated as one irreversible multi-day go decision.',
      source: 'default',
      confidence: 'high',
      safetyImpact: 'high'
    }
  ]
};

export const turkuToParnuModerateRiskAssessment = assessPassageRisk(turkuToParnuModerateRiskInput);

export const coreRiskAssessmentInputs: RiskAssessmentInput[] = [turkuToParnuModerateRiskInput];
export const coreRiskAssessments = [turkuToParnuModerateRiskAssessment];

export function getRiskAssessmentInputById(id: string): RiskAssessmentInput | undefined {
  return coreRiskAssessmentInputs.find((input) => input.id === id);
}
