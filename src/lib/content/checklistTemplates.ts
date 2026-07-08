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

export const nightArrivalTemplate: ChecklistTemplate = {
  id: 'checklist-template:night-arrival-baltic-guest-harbour',
  title: 'Night arrival - Baltic guest harbour',
  category: 'night',
  vesselSpecific: false,
  safetyCritical: true,
  contentVersion: '0.1.0',
  assumptions: [
    {
      id: 'assumption:night-arrival-approach-identified',
      statement: 'The destination approach, leading lights, sector lights and final berth or waiting area have been identified before darkness.',
      source: 'user',
      confidence: 'medium',
      safetyImpact: 'high'
    },
    {
      id: 'assumption:night-arrival-crew-fatigue-managed',
      statement: 'The skipper has considered fatigue, watch handover quality and whether a daylight bailout harbour is safer.',
      source: 'user',
      confidence: 'medium',
      safetyImpact: 'high'
    }
  ],
  items: [
    {
      id: 'item:night-arrival-approach-brief',
      text: 'Brief the final approach: charted hazards, leading lines, sector lights, waypoint sequence, no-go areas and abort point.',
      helpText: 'Do the mental rehearsal before entering the harbour approach, not when lights and traffic are already competing for attention.',
      required: true,
      warningIfSkipped: 'Skipping the night approach brief increases the risk of wrong-light fixation, shallow-water error or late abort decisions.'
    },
    {
      id: 'item:night-arrival-cockpit-light-discipline',
      text: 'Set cockpit light discipline: dim screens, preserve night vision, keep one red/low light available and avoid headlamp glare.',
      helpText: 'Night vision is part of situational awareness; protect it before the close-quarters phase starts.',
      required: true,
      warningIfSkipped: 'Skipping light discipline can reduce night vision during pilotage and harbour manoeuvres.'
    },
    {
      id: 'item:night-arrival-engine-and-gear-ready',
      text: 'Prepare engine, fenders, mooring lines, boat hook and handheld VHF before the final approach.',
      helpText: 'At night, avoid sending crew forward late; prepare the boat while there is still room and time.',
      required: true,
      warningIfSkipped: 'Skipping arrival gear preparation increases deck workload and communication errors in the dark.'
    },
    {
      id: 'item:night-arrival-traffic-and-vhf',
      text: 'Check AIS, visual traffic, harbour VHF channel or phone number, and agree who watches outside versus instruments.',
      helpText: 'The instrument watcher should support, not replace, visual lookout and skipper pilotage decisions.',
      required: true,
      warningIfSkipped: 'Skipping traffic and communication planning weakens situational awareness during the harbour approach.'
    },
    {
      id: 'item:night-arrival-bailout-or-hold',
      text: 'Confirm the bailout or holding option if the berth is unclear, the crew is tired, visibility drops or the approach does not match the plan.',
      helpText: 'A safe wait outside or a simpler harbour is often better than forcing a tired night entry.',
      required: true,
      warningIfSkipped: 'Skipping the bailout decision can make an unsafe night arrival feel like the only option.'
    }
  ]
};

export const heavyWeatherDepartureTemplate: ChecklistTemplate = {
  id: 'checklist-template:heavy-weather-departure-defensive',
  title: 'Heavy-weather departure - defensive go/no-go',
  category: 'heavy-weather',
  vesselSpecific: false,
  safetyCritical: true,
  contentVersion: '0.1.0',
  assumptions: [
    {
      id: 'assumption:heavy-weather-latest-forecast-reviewed',
      statement: 'The skipper has reviewed a current forecast, gust spread, sea state, trend and harbour-exit conditions immediately before deciding.',
      source: 'user',
      confidence: 'medium',
      safetyImpact: 'high'
    },
    {
      id: 'assumption:heavy-weather-crew-and-boat-fit',
      statement: 'Crew fitness, seasickness risk, reefing capability, engine reliability and bailout options are known before departure.',
      source: 'user',
      confidence: 'medium',
      safetyImpact: 'high'
    }
  ],
  items: [
    {
      id: 'item:heavy-weather-no-go-thresholds',
      text: 'State explicit no-go thresholds for sustained wind, gusts, waves, visibility, harbour exit and crew fatigue before lines are slipped.',
      helpText: 'If the numbers are vague, the decision is not ready. Conservative thresholds are part of the plan, not a lack of courage.',
      required: true,
      warningIfSkipped: 'Skipping explicit no-go thresholds makes it easier to rationalize an unsafe departure.'
    },
    {
      id: 'item:heavy-weather-reef-before-exit',
      text: 'Rig the first reef, prepare the second reef if available, and confirm headsail reduction before leaving sheltered water.',
      helpText: 'Do the reefing work while the boat is controlled; do not wait until the first exposed leg if the forecast is already marginal.',
      required: true,
      warningIfSkipped: 'Skipping reef preparation increases workload and broach risk after the harbour exit.'
    },
    {
      id: 'item:heavy-weather-deck-secured',
      text: 'Secure deck, cockpit, anchor, lockers, dinghy, loose lines and below-deck heavy items for knockdown-level movement.',
      helpText: 'A small loose item can become a serious distraction when the boat is heeled, wet and noisy.',
      required: true,
      warningIfSkipped: 'Skipping deck and cabin securing can create avoidable hazards once conditions deteriorate.'
    },
    {
      id: 'item:heavy-weather-crew-tether-plan',
      text: 'Agree lifejacket, tether, jackline, companionway and cockpit movement rules before the crew gets wet or tired.',
      helpText: 'Movement rules must be simple enough to follow under stress, especially with family or inexperienced crew.',
      required: true,
      warningIfSkipped: 'Skipping tether and movement rules weakens MOB prevention during the highest-risk phase.'
    },
    {
      id: 'item:heavy-weather-turn-back-point',
      text: 'Define a turn-back point and bailout harbour that remain reachable if the harbour exit or first exposed leg is worse than expected.',
      helpText: 'The best heavy-weather plan usually contains a dignified way not to continue.',
      required: true,
      warningIfSkipped: 'Skipping a turn-back point can trap the skipper into continuing because the alternative was never prepared.'
    }
  ]
};

export const mobImmediateActionsTemplate: ChecklistTemplate = {
  id: 'checklist-template:mob-immediate-actions-underway',
  title: 'MOB immediate actions - underway',
  category: 'emergency',
  vesselSpecific: false,
  safetyCritical: true,
  contentVersion: '0.1.0',
  assumptions: [
    {
      id: 'assumption:mob-equipment-location-known',
      statement: 'Crew know where the lifebuoy, throwing line, recovery gear, VHF/DSC controls and engine controls are located.',
      source: 'user',
      confidence: 'medium',
      safetyImpact: 'high'
    },
    {
      id: 'assumption:mob-position-can-be-marked',
      statement: 'The boat has a practical way to mark the MOB position using plotter, MOB button, GPS, handheld VHF or immediate written bearing/time.',
      source: 'user',
      confidence: 'medium',
      safetyImpact: 'high'
    }
  ],
  items: [
    {
      id: 'item:mob-shout-point-throw',
      text: 'Shout "man overboard", point continuously at the person and throw flotation immediately.',
      helpText: 'One crew member pointing is navigation data; losing visual contact is often the hardest problem to recover from.',
      required: true,
      warningIfSkipped: 'Skipping the shout, point and throw action can lose both visual contact and immediate flotation support.'
    },
    {
      id: 'item:mob-press-mark-position',
      text: 'Press MOB or otherwise mark position, time and approximate bearing while the person is still in sight.',
      helpText: 'Do not wait for a perfect entry; imperfect position information is better than none.',
      required: true,
      warningIfSkipped: 'Skipping position marking removes a critical fallback if visual contact is lost.'
    },
    {
      id: 'item:mob-control-boat',
      text: 'Control the boat: prevent accidental gybe, start engine when safe, assign lookout and prepare recovery side.',
      helpText: 'Keep lines clear of the propeller and avoid creating a second casualty while manoeuvring.',
      required: true,
      warningIfSkipped: 'Skipping boat-control setup can turn a recovery into a collision, propeller or second-MOB incident.'
    },
    {
      id: 'item:mob-distress-call-decision',
      text: 'Make an early distress or urgency call decision by DSC/VHF if recovery is not immediate and controlled.',
      helpText: 'In cold Baltic water, delay is dangerous; outside help should be called early rather than after exhaustion sets in.',
      required: true,
      warningIfSkipped: 'Skipping the distress-call decision can delay rescue support beyond the useful recovery window.'
    },
    {
      id: 'item:mob-recovery-and-aftercare',
      text: 'Prepare physical recovery, hypothermia response and post-recovery medical monitoring before the person reaches the boat.',
      helpText: 'Getting alongside is not the end of the emergency; recovery from the water is often the hardest physical step.',
      required: true,
      warningIfSkipped: 'Skipping recovery and aftercare preparation risks failing at the final and most physical stage of MOB response.'
    }
  ]
};

export const coreChecklistTemplates: ChecklistTemplate[] = [
  departureReadinessTemplate,
  enginePreStartTemplate,
  nightArrivalTemplate,
  heavyWeatherDepartureTemplate,
  mobImmediateActionsTemplate
];

export function listChecklistTemplatesByCategory(category: ChecklistCategory): ChecklistTemplate[] {
  return coreChecklistTemplates.filter((template) => template.category === category);
}

export function getChecklistTemplateById(id: string): ChecklistTemplate | undefined {
  return coreChecklistTemplates.find((template) => template.id === id);
}