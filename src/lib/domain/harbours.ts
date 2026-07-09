export type HarbourNoteStatus = 'ready' | 'caution' | 'incomplete';
export type HarbourFreshness = 'current' | 'stale' | 'unknown';
export type HarbourExposure = 'sheltered' | 'coastal' | 'open-approach';
export type HarbourFindingSeverity = 'blocker' | 'caution';

export interface HarbourFacility {
  type: 'berth' | 'fuel' | 'water' | 'electricity' | 'groceries' | 'sauna' | 'repair' | 'waste' | 'public-transport';
  available: boolean | 'unknown';
  note: string;
}

export interface HarbourApproachNote {
  pilotage: string;
  hazards: string[];
  nightArrival: 'suitable' | 'avoid' | 'unknown';
  vhfChannel?: string;
  depthMeters?: number;
  shelter: HarbourExposure;
}

export interface HarbourNote {
  id: string;
  name: string;
  country: string;
  area: string;
  role: 'home' | 'planned-stop' | 'bailout' | 'decision-point' | 'destination';
  vesselFit: {
    maxDraftMeters?: number;
    alongsideOrBox?: string;
    confidence: 'high' | 'medium' | 'low';
  };
  sourceFreshness: HarbourFreshness;
  approach: HarbourApproachNote;
  facilities: HarbourFacility[];
  skipperNotes: string[];
  verificationPrompts: string[];
  safetyLimitations: string[];
}

export interface HarbourFinding {
  harbourId: string;
  severity: HarbourFindingSeverity;
  text: string;
  skipperAction: string;
}

export interface HarbourNotebookSummary {
  harbourCount: number;
  readyCount: number;
  cautionCount: number;
  incompleteCount: number;
  blockerFindings: number;
  cautionFindings: number;
  firstAction?: string;
  offlineBrief: string[];
}

export interface HarbourRoutePackStop {
  harbourId: string;
  name: string;
  role: HarbourNote['role'];
  status: HarbourNoteStatus;
  sourceFreshness: HarbourFreshness;
  draftMarginMeters?: number;
  nightArrival: HarbourApproachNote['nightArrival'];
  contactRecorded: boolean;
  blockerCount: number;
  cautionCount: number;
  firstAction?: string;
}

export interface HarbourRoutePack {
  title: string;
  status: 'ready' | 'caution' | 'blocked';
  committedStops: HarbourRoutePackStop[];
  alternateStops: HarbourRoutePackStop[];
  verificationQueue: string[];
  readAloudBrief: string[];
  safetyLimitations: string[];
}

export function assessHarbourNote(note: HarbourNote, vesselDraftMeters: number): HarbourFinding[] {
  const findings: HarbourFinding[] = [];

  if (note.sourceFreshness !== 'current') {
    findings.push({
      harbourId: note.id,
      severity: note.sourceFreshness === 'unknown' ? 'blocker' : 'caution',
      text: `${note.name} harbour information is ${note.sourceFreshness}.`,
      skipperAction: `Verify ${note.name} harbour availability, contact details, approach notes and fees before relying on it.`
    });
  }

  if (!note.approach.vhfChannel && (note.role === 'planned-stop' || note.role === 'destination' || note.role === 'bailout')) {
    findings.push({
      harbourId: note.id,
      severity: 'caution',
      text: `${note.name} has no VHF or phone contact recorded in the harbour notebook.`,
      skipperAction: `Add a current harbour contact method for ${note.name} to the offline route pack.`
    });
  }

  if (note.approach.nightArrival !== 'suitable' && (note.role === 'planned-stop' || note.role === 'destination')) {
    findings.push({
      harbourId: note.id,
      severity: note.approach.nightArrival === 'avoid' ? 'blocker' : 'caution',
      text: `${note.name} is marked ${note.approach.nightArrival} for night arrival.`,
      skipperAction: `Plan ${note.name} arrival in daylight or brief a different verified harbour.`
    });
  }

  const maxDraft = note.vesselFit.maxDraftMeters ?? note.approach.depthMeters;
  if (maxDraft === undefined) {
    findings.push({
      harbourId: note.id,
      severity: 'blocker',
      text: `${note.name} has no recorded depth or draft-fit limit.`,
      skipperAction: `Check charted depths, harbour soundings and current water level before adding ${note.name} as a committed stop.`
    });
  } else if (maxDraft - vesselDraftMeters < 0.5) {
    findings.push({
      harbourId: note.id,
      severity: 'blocker',
      text: `${note.name} has less than 0.5 m recorded draft margin for this vessel.`,
      skipperAction: `Treat ${note.name} as tide/water-level dependent and keep a deeper verified alternative.`
    });
  }

  if (note.verificationPrompts.length === 0) {
    findings.push({
      harbourId: note.id,
      severity: 'caution',
      text: `${note.name} has no verification prompts.`,
      skipperAction: `Add at least one current chart, harbour, weather or berth-availability prompt for ${note.name}.`
    });
  }

  return findings;
}

export function getHarbourNoteStatus(note: HarbourNote, vesselDraftMeters: number): HarbourNoteStatus {
  const findings = assessHarbourNote(note, vesselDraftMeters);

  if (findings.some((finding) => finding.severity === 'blocker')) {
    return 'incomplete';
  }

  if (findings.length > 0 || note.vesselFit.confidence !== 'high') {
    return 'caution';
  }

  return 'ready';
}

export function summarizeHarbourNotebook(notes: HarbourNote[], vesselDraftMeters: number): HarbourNotebookSummary {
  const statuses = notes.map((note) => getHarbourNoteStatus(note, vesselDraftMeters));
  const findings = notes.flatMap((note) => assessHarbourNote(note, vesselDraftMeters));
  const blockerFindings = findings.filter((finding) => finding.severity === 'blocker').length;
  const cautionFindings = findings.filter((finding) => finding.severity === 'caution').length;

  return {
    harbourCount: notes.length,
    readyCount: statuses.filter((status) => status === 'ready').length,
    cautionCount: statuses.filter((status) => status === 'caution').length,
    incompleteCount: statuses.filter((status) => status === 'incomplete').length,
    blockerFindings,
    cautionFindings,
    firstAction: findings[0]?.skipperAction,
    offlineBrief: notes.map((note) => {
      const status = getHarbourNoteStatus(note, vesselDraftMeters);
      const contact = note.approach.vhfChannel ? `contact ${note.approach.vhfChannel}` : 'contact not recorded';
      return `${note.name}: ${status}; ${note.role}; ${contact}; ${note.approach.shelter} approach.`;
    })
  };
}

function getDraftMargin(note: HarbourNote, vesselDraftMeters: number): number | undefined {
  const maxDraft = note.vesselFit.maxDraftMeters ?? note.approach.depthMeters;

  if (maxDraft === undefined) {
    return undefined;
  }

  return Number((maxDraft - vesselDraftMeters).toFixed(2));
}

function toRoutePackStop(note: HarbourNote, vesselDraftMeters: number): HarbourRoutePackStop {
  const findings = assessHarbourNote(note, vesselDraftMeters);

  return {
    harbourId: note.id,
    name: note.name,
    role: note.role,
    status: getHarbourNoteStatus(note, vesselDraftMeters),
    sourceFreshness: note.sourceFreshness,
    draftMarginMeters: getDraftMargin(note, vesselDraftMeters),
    nightArrival: note.approach.nightArrival,
    contactRecorded: Boolean(note.approach.vhfChannel),
    blockerCount: findings.filter((finding) => finding.severity === 'blocker').length,
    cautionCount: findings.filter((finding) => finding.severity === 'caution').length,
    firstAction: findings[0]?.skipperAction
  };
}

export function createHarbourRoutePack(title: string, notes: HarbourNote[], vesselDraftMeters: number): HarbourRoutePack {
  const stops = notes.map((note) => toRoutePackStop(note, vesselDraftMeters));
  const committedStops = stops.filter((stop) => stop.role === 'home' || stop.role === 'planned-stop' || stop.role === 'destination');
  const alternateStops = stops.filter((stop) => stop.role === 'bailout' || stop.role === 'decision-point');
  const allFindings = notes.flatMap((note) => assessHarbourNote(note, vesselDraftMeters));
  const blockerCount = allFindings.filter((finding) => finding.severity === 'blocker').length;
  const status = blockerCount > 0 ? 'blocked' : allFindings.length > 0 ? 'caution' : 'ready';
  const verificationQueue = allFindings.map((finding) => finding.skipperAction);
  const firstCommittedBlocker = committedStops.find((stop) => stop.blockerCount > 0);
  const weakestAlternate = alternateStops.find((stop) => stop.status === 'incomplete') ?? alternateStops.find((stop) => stop.status === 'caution');

  return {
    title,
    status,
    committedStops,
    alternateStops,
    verificationQueue,
    readAloudBrief: [
      `${title}: ${status}. ${committedStops.length} committed stops and ${alternateStops.length} alternates in the offline harbour pack.`,
      firstCommittedBlocker
        ? `First committed-stop blocker: ${firstCommittedBlocker.name}. ${firstCommittedBlocker.firstAction}`
        : 'No committed-stop blockers recorded in the static harbour pack.',
      weakestAlternate
        ? `Weakest alternate: ${weakestAlternate.name}. Verify before treating it as shelter.`
        : 'No alternate harbour notes recorded; add at least one bailout for each long leg.'
    ],
    safetyLimitations: [
      'Harbour route packs are static cockpit preparation content, not live berth availability, harbour-master advice or navigation authority.',
      'Refresh charts, notices, weather, water level, harbour contacts and crew fatigue before turning any note into a go decision.'
    ]
  };
}
