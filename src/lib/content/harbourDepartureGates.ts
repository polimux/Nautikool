import { h323ElinaTurkuParnuHarbourRoutePack } from './harbourNotes';
import {
  createHarbourDepartureGate,
  type HarbourDepartureGateRequirement
} from '$lib/domain/harbourDepartureGates';

export const h323ElinaTurkuParnuHarbourGateRequirements: HarbourDepartureGateRequirement[] = [
  {
    id: 'harbour-gate:h323-elina:committed-contact',
    label: 'Committed-stop contact method',
    scope: 'committed-stops',
    priority: 'required',
    verificationPrompt:
      'Write the current phone or VHF contact for Nauvo, Hanko, Haapsalu and Pärnu into the offline route pack before leaving Turku.',
    evidenceKeywords: ['contact', 'availability']
  },
  {
    id: 'harbour-gate:h323-elina:draft-depth',
    label: 'Draft and approach depth margin',
    scope: 'committed-stops',
    priority: 'required',
    verificationPrompt:
      'Check charted depths, harbour soundings and water-level notes for every committed stop against Elina’s 1.45 m draft.',
    evidenceKeywords: ['depth', 'draft', 'water level']
  },
  {
    id: 'harbour-gate:h323-elina:daylight-arrival',
    label: 'Daylight arrival posture',
    scope: 'route',
    priority: 'required',
    verificationPrompt:
      'Mark which committed stops are daylight-only and set a turn-back or split decision before the final safe daylight arrival window closes.',
    evidenceKeywords: ['daylight', 'night']
  },
  {
    id: 'harbour-gate:h323-elina:bailout-harbour',
    label: 'Named bailout harbour with contact',
    scope: 'alternates',
    priority: 'required',
    verificationPrompt:
      'Promote at least one bailout from a vague chart option to a named harbour with contact, depth, approach and rejection plan.',
    evidenceKeywords: ['bailout', 'alternative', 'shelter']
  },
  {
    id: 'harbour-gate:h323-elina:destination-logistics',
    label: 'Destination berth and after-hours logistics',
    scope: 'committed-stops',
    priority: 'recommended',
    verificationPrompt:
      'Confirm Pärnu berth, after-hours arrival, keys, shore power, water and onward travel before treating the destination as solved.',
    evidenceKeywords: ['berth', 'after-hours', 'destination']
  }
];

export const h323ElinaTurkuParnuHarbourDepartureGate = createHarbourDepartureGate({
  title: 'H-323 Elina Turku to Pärnu harbour departure gate',
  routePack: h323ElinaTurkuParnuHarbourRoutePack,
  requirements: h323ElinaTurkuParnuHarbourGateRequirements
});
