import type { HarbourRoutePack } from './harbours';

export type HarbourDepartureGateStatus = 'ready' | 'caution' | 'blocked';
export type HarbourDepartureGateSeverity = 'blocker' | 'caution';
export type HarbourDepartureGateScope = 'route' | 'committed-stops' | 'alternates';

export interface HarbourDepartureGateRequirement {
  id: string;
  label: string;
  scope: HarbourDepartureGateScope;
  priority: 'required' | 'recommended';
  verificationPrompt: string;
  evidenceKeywords: string[];
}

export interface HarbourDepartureGateFinding {
  severity: HarbourDepartureGateSeverity;
  text: string;
  skipperAction: string;
}

export interface HarbourDepartureGateChecklistItem {
  requirementId: string;
  label: string;
  scope: HarbourDepartureGateScope;
  priority: HarbourDepartureGateRequirement['priority'];
  coveredByRoutePack: boolean;
  verificationPrompt: string;
}

export interface HarbourDepartureGate {
  title: string;
  status: HarbourDepartureGateStatus;
  committedStopCount: number;
  alternateStopCount: number;
  usableAlternateCount: number;
  checklistItems: HarbourDepartureGateChecklistItem[];
  findings: HarbourDepartureGateFinding[];
  firstAction?: string;
  readAloudBrief: string[];
  safetyLimitations: string[];
}

export interface HarbourDepartureGateInput {
  title: string;
  routePack: HarbourRoutePack;
  requirements: HarbourDepartureGateRequirement[];
}

function queueCoversRequirement(queue: string[], requirement: HarbourDepartureGateRequirement): boolean {
  const normalizedQueue = queue.join(' ').toLowerCase();
  return requirement.evidenceKeywords.some((keyword) => normalizedQueue.includes(keyword.toLowerCase()));
}

function getUsableAlternateCount(routePack: HarbourRoutePack): number {
  return routePack.alternateStops.filter((stop) => stop.blockerCount === 0 && stop.contactRecorded).length;
}

export function createHarbourDepartureGate(input: HarbourDepartureGateInput): HarbourDepartureGate {
  const { title, routePack, requirements } = input;
  const findings: HarbourDepartureGateFinding[] = [];
  const committedBlockers = routePack.committedStops.reduce((total, stop) => total + stop.blockerCount, 0);
  const committedCautions = routePack.committedStops.reduce((total, stop) => total + stop.cautionCount, 0);
  const usableAlternateCount = getUsableAlternateCount(routePack);

  if (committedBlockers > 0) {
    findings.push({
      severity: 'blocker',
      text: `${committedBlockers} committed-stop harbour blocker(s) remain open in the route pack.`,
      skipperAction: 'Do not cast off for the planned route until committed-stop harbour blockers are verified or the route is re-split.'
    });
  }

  if (routePack.alternateStops.length === 0) {
    findings.push({
      severity: 'blocker',
      text: 'No alternate harbour is recorded for the route pack.',
      skipperAction: 'Add at least one verified bailout or decision harbour before treating the harbour pack as departure-ready.'
    });
  } else if (usableAlternateCount === 0) {
    findings.push({
      severity: 'caution',
      text: 'No alternate harbour currently has both zero blockers and a recorded contact method.',
      skipperAction: 'Verify one realistic bailout harbour with depth, approach notes and contact details before departure.'
    });
  }

  if (committedCautions > 0) {
    findings.push({
      severity: 'caution',
      text: `${committedCautions} committed-stop harbour caution(s) remain open.`,
      skipperAction: 'Brief the open harbour cautions during the skipper briefing and assign one person to verify them ashore.'
    });
  }

  const checklistItems = requirements.map((requirement) => {
    const coveredByRoutePack = queueCoversRequirement(routePack.verificationQueue, requirement);

    if (!coveredByRoutePack) {
      findings.push({
        severity: requirement.priority === 'required' ? 'blocker' : 'caution',
        text: `${requirement.label} is not covered by the current harbour verification queue.`,
        skipperAction: requirement.verificationPrompt
      });
    }

    return {
      requirementId: requirement.id,
      label: requirement.label,
      scope: requirement.scope,
      priority: requirement.priority,
      coveredByRoutePack,
      verificationPrompt: requirement.verificationPrompt
    };
  });

  const blockerCount = findings.filter((finding) => finding.severity === 'blocker').length;
  const cautionCount = findings.filter((finding) => finding.severity === 'caution').length;
  const status: HarbourDepartureGateStatus = blockerCount > 0 ? 'blocked' : cautionCount > 0 ? 'caution' : 'ready';
  const firstAction = findings[0]?.skipperAction;

  return {
    title,
    status,
    committedStopCount: routePack.committedStops.length,
    alternateStopCount: routePack.alternateStops.length,
    usableAlternateCount,
    checklistItems,
    findings,
    firstAction,
    readAloudBrief: [
      `${title}: ${status}. ${routePack.committedStops.length} committed stops, ${routePack.alternateStops.length} alternates, ${usableAlternateCount} usable alternate(s) with contact recorded.`,
      firstAction ? `First harbour action: ${firstAction}` : 'No harbour departure blockers recorded in the static gate.',
      'Before departure, verify harbour facts against current charts, notices, weather, water level and harbour contact information.'
    ],
    safetyLimitations: [
      'A harbour departure gate is a preparation checklist, not live berth availability or official pilotage advice.',
      'A green harbour gate still requires current chart, weather, daylight, water-level and crew-fatigue checks before departure.'
    ]
  };
}
