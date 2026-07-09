import { turkuToParnuFamilyPassagePlan } from './passagePlans';
import { analyzePassageWorkload, type PassageWorkloadPolicy } from '$lib/domain/passageWorkload';

export const h323FamilyBalticWorkloadPolicy: PassageWorkloadPolicy = {
  id: 'policy:h323-family-baltic-workload',
  title: 'H-323 family Baltic workload policy',
  targetMaxDayLegNm: 50,
  hardMaxDayLegNm: 65,
  maxComfortableDayHours: 10,
  maxExposedContinuousHours: 12,
  requireBailoutForEveryLeg: true,
  familyCrew: true,
  policyNotes: [
    'Use 50 nm as the normal family day-leg target, not as a promise that every 50 nm leg is comfortable.',
    'Any leg above 65 nm needs either a split route or a deliberate overnight/open-water watch plan.',
    'For the H-323 Elina Turku to Pärnu plan, the Hanko to Haapsalu crossing is intentionally kept as a blocker until a fresh weather window, watch rotation and bailout decision are written down.',
    'A green workload result would still only mean the static plan fits the policy; it is not live weather, traffic or harbour advice.'
  ]
};

export const h323ElinaTurkuParnuWorkload = analyzePassageWorkload(
  turkuToParnuFamilyPassagePlan,
  h323FamilyBalticWorkloadPolicy
);
