import type { ChecklistCategory, ChecklistTemplate } from '$lib/domain/types';

export const departureReadinessTemplate: ChecklistTemplate = {
  id: 'checklist-template:departure-readiness-baltic-coastal',
  title: 'Departure readiness - Baltic coastal',
  category: 'departure',
  vesselSpecific: false,
  safetyCritical: true,
  contentVersion: '0.2.0',
  assumptions: [
    {
      id: 'assumption:forecast-current-for-departure-window',
      statement: 'The skipper has checked a current forecast for the planned departure window, including gusts and sea state.',
      source: 'user',
      confidence: 'medium',
      safetyImpact: 'high'
    },
    {
      id: 'assumption:route-reviewed-against-current-chart',
      statement: 'The route has been checked against current official chart information and local notices before departure.',
      source: 'user',
      confidence: 'medium',
      safetyImpact: 'high'
    }
  ],
  items: [
    {
      id: 'item:departure-weather-and-bailouts',
      text: 'Confirm wind, gusts, waves, visibility, daylight window and at least one bailout option.',
      helpText: 'Use a conservative threshold for first-season or singlehanded passages; unknown weather should not become a green departure.',
      required: true,
      warningIfSkipped: 'Departure weather, daylight and bailout options are safety-critical and should not be skipped.'
    },
    {
      id: 'item:departure-engine-ready',
      text: 'Check engine start, cooling water flow, fuel level and abnormal alarms before leaving the berth.',
      helpText: 'A coastal sailing passage still depends on engine availability for harbour manoeuvres and emergency options.',
      required: true,
      warningIfSkipped: 'Skipping the engine readiness check removes an important harbour and emergency safety margin.'
    },
    {
      id: 'item:departure-water-ingress',
      text: 'Check bilge, seacocks, stern gland area and any recent through-hull work for signs of water ingress.',
      helpText: 'Do this before the cockpit is busy; make the result explicit if the boat was recently serviced or modified.',
      required: true,
      warningIfSkipped: 'Skipping water-ingress checks can hide a developing flooding issue until underway.'
    },
    {
      id: 'item:departure-deck-and-rig',
      text: 'Walk the deck: halyards clear, sheets led correctly, reefing lines ready, fenders and mooring lines stowed after departure.',
      helpText: 'For short-handed sailing, prepare the first reef and headsail handling before the harbour exit.',
      required: true,
      warningIfSkipped: 'Skipping deck and rig preparation increases workload at the worst moment after departure.'
    },
    {
      id: 'item:departure-safety-brief',
      text: 'Brief crew on lifejackets, VHF/DSC, MOB actions, fire extinguisher locations and how to stop the boat.',
      helpText: 'For solo sailing, replace the crew brief with a self-check: PFD worn, tether ready, handheld VHF reachable.',
      required: true,
      warningIfSkipped: 'Skipping the safety brief weakens response quality during MOB, fire or medical events.'
    }
  ]
};

export const enginePreStartTemplate: ChecklistTemplate = {
  id: 'checklist-template:engine-pre-start-diesel-inboard',
  title: 'Engine pre-start - diesel inboard',
  category: 'engine',
  vesselSpecific: false,
  safetyCritical: true,
  contentVersion: '0.1.0',
  assumptions: [
    {
      id: 'assumption:engine-access-safe',
      statement: 'The engine compartment can be inspected safely before starting.',
      source: 'user',
      confidence: 'medium',
      safetyImpact: 'medium'
    }
  ],
  items: [
    {
      id: 'item:engine-bilge-and-leaks',
      text: 'Inspect bilge and engine pan for fuel, oil, coolant or unusual water before starting.',
      helpText: 'A quick smell and visual check catches many avoidable engine-room problems before they become underway failures.',
      required: true,
      warningIfSkipped: 'Skipping leak inspection may hide fuel, oil, coolant or water problems before engine start.'
    },
    {
      id: 'item:engine-raw-water-path',
      text: 'Confirm raw-water seacock open and strainer visually acceptable.',
      helpText: 'After starting, verify cooling water at the exhaust immediately.',
      required: true,
      warningIfSkipped: 'Skipping the raw-water path check risks overheating shortly after departure.'
    },
    {
      id: 'item:engine-fuel-and-battery',
      text: 'Confirm fuel level, battery switch position and instrument panel readiness.',
      helpText: 'This check supports both normal harbour manoeuvres and an immediate return if the departure is aborted.',
      required: true,
      warningIfSkipped: 'Skipping fuel and battery readiness can turn a minor delay into a loss-of-propulsion issue.'
    }
  ]
};

export const coreChecklistTemplates: ChecklistTemplate[] = [
  departureReadinessTemplate,
  enginePreStartTemplate
];

export function listChecklistTemplatesByCategory(category: ChecklistCategory): ChecklistTemplate[] {
  return coreChecklistTemplates.filter((template) => template.category === category);
}

export function getChecklistTemplateById(id: string): ChecklistTemplate | undefined {
  return coreChecklistTemplates.find((template) => template.id === id);
}
