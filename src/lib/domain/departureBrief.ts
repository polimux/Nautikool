import type { DepartureDashboardFinding, DepartureDashboardSummary } from './departureDashboard';

export type DepartureBriefSectionKind =
  | 'decision'
  | 'weather'
  | 'route'
  | 'crew'
  | 'boat'
  | 'electronics'
  | 'follow-up'
  | 'limitations';

export interface DepartureBriefSection {
  id: string;
  kind: DepartureBriefSectionKind;
  title: string;
  lines: string[];
}

export interface DepartureSkipperBriefInput {
  id: string;
  title: string;
  dashboard: DepartureDashboardSummary;
  generatedAtLabel: string;
  routeFocus: string[];
  weatherCheckpoints: string[];
  crewAssignments: string[];
  boatChecks: string[];
  electronicsChecks: string[];
  goNoGoQuestion: string;
  printNotes: string[];
}

export interface DepartureSkipperBrief {
  id: string;
  title: string;
  vesselName: string;
  passageTitle: string;
  status: DepartureDashboardSummary['status'];
  canDepart: boolean;
  generatedAtLabel: string;
  headline: string;
  firstAction: string;
  blockerCount: number;
  cautionCount: number;
  sectionCount: number;
  sections: DepartureBriefSection[];
  printChecklist: string[];
  readAloudLines: string[];
  limitations: string[];
}

function formatFinding(finding: DepartureDashboardFinding): string {
  return `${finding.source}: ${finding.title} Action: ${finding.skipperAction}`;
}

function firstLines(lines: string[], fallback: string): string[] {
  return lines.length > 0 ? lines : [fallback];
}

function topFindings(dashboard: DepartureDashboardSummary): DepartureDashboardFinding[] {
  const blockers = dashboard.findings.filter((finding) => finding.severity === 'blocker');
  const cautions = dashboard.findings.filter((finding) => finding.severity === 'caution');

  return [...blockers, ...cautions].slice(0, 5);
}

function buildDecisionSection(input: DepartureSkipperBriefInput): DepartureBriefSection {
  const findingLines = topFindings(input.dashboard).map(formatFinding);

  return {
    id: `${input.id}:decision`,
    kind: 'decision',
    title: `${input.dashboard.status.toUpperCase()} departure decision`,
    lines: [
      `${input.dashboard.vesselName} / ${input.dashboard.passageTitle}: ${input.dashboard.headline}`,
      `Go/no-go question: ${input.goNoGoQuestion}`,
      ...firstLines(findingLines, 'No dashboard blockers are open; still verify live weather, harbour status and crew readiness.')
    ]
  };
}

function makeSection(
  input: DepartureSkipperBriefInput,
  kind: DepartureBriefSectionKind,
  title: string,
  lines: string[],
  fallback: string
): DepartureBriefSection {
  return {
    id: `${input.id}:${kind}`,
    kind,
    title,
    lines: firstLines(lines, fallback)
  };
}

function printChecklistFor(input: DepartureSkipperBriefInput, firstAction: string): string[] {
  return [
    `Circle dashboard status: ${input.dashboard.status.toUpperCase()} / score ${input.dashboard.readinessScore}.`,
    `Close first action before departure: ${firstAction}`,
    `Read the route focus aloud: ${firstLines(input.routeFocus, 'route focus not set')[0]}`,
    `Verify live weather checkpoint: ${firstLines(input.weatherCheckpoints, 'live weather checkpoint not set')[0]}`,
    `Assign crew role: ${firstLines(input.crewAssignments, 'crew roles not set')[0]}`,
    `Confirm boat check: ${firstLines(input.boatChecks, 'boat checks not set')[0]}`,
    `Confirm electronics check: ${firstLines(input.electronicsChecks, 'electronics checks not set')[0]}`,
    'Write actual departure time, barometer, engine hours and first waypoint on the paper copy.'
  ];
}

export function buildDepartureSkipperBrief(input: DepartureSkipperBriefInput): DepartureSkipperBrief {
  const firstAction = input.dashboard.nextActions[0] ?? 'Verify live weather, crew state, harbour status and local notices.';
  const limitations = [
    'This skipper brief is static preparation content, not live navigation, weather or traffic advice.',
    'Do not depart on a green-looking printout if the current forecast, crew state, vessel condition or harbour information has changed.',
    ...input.printNotes
  ];
  const sections: DepartureBriefSection[] = [
    buildDecisionSection(input),
    makeSection(
      input,
      'route',
      'Route focus',
      input.routeFocus,
      'Route focus not set; reopen the passage plan before departure.'
    ),
    makeSection(
      input,
      'weather',
      'Weather verification',
      input.weatherCheckpoints,
      'Weather checkpoints not set; fetch and compare a current forecast before departure.'
    ),
    makeSection(input, 'crew', 'Crew and watch plan', input.crewAssignments, 'Crew roles not set.'),
    makeSection(input, 'boat', 'Boat readiness', input.boatChecks, 'Boat checks not set.'),
    makeSection(
      input,
      'electronics',
      'Electronics and radio',
      input.electronicsChecks,
      'Electronics checks not set.'
    ),
    makeSection(input, 'limitations', 'Limitations', limitations, 'Skipper judgement remains decisive.')
  ];

  return {
    id: input.id,
    title: input.title,
    vesselName: input.dashboard.vesselName,
    passageTitle: input.dashboard.passageTitle,
    status: input.dashboard.status,
    canDepart: input.dashboard.canDepart,
    generatedAtLabel: input.generatedAtLabel,
    headline: input.dashboard.headline,
    firstAction,
    blockerCount: input.dashboard.blockerCount,
    cautionCount: input.dashboard.cautionCount,
    sectionCount: sections.length,
    sections,
    printChecklist: printChecklistFor(input, firstAction),
    readAloudLines: [
      `${input.dashboard.vesselName} departure brief for ${input.dashboard.passageTitle}: status ${input.dashboard.status.toUpperCase()}, score ${input.dashboard.readinessScore}.`,
      `First action: ${firstAction}`,
      `Decision question: ${input.goNoGoQuestion}`,
      'If live conditions differ from this brief, stop and rebuild the departure decision.'
    ],
    limitations
  };
}
