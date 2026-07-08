export type IsoDateTime = string;

export interface Assumption {
  id: string;
  statement: string;
  source: 'user' | 'vessel-profile' | 'imported-data' | 'computed' | 'default';
  confidence: 'low' | 'medium' | 'high';
  safetyImpact: 'low' | 'medium' | 'high';
}

export interface AuditMetadata {
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
  version: number;
}

export interface VesselDimensions {
  loaMeters?: number;
  beamMeters?: number;
  draftMeters?: number;
  mastHeightMeters?: number;
  displacementKg?: number;
}

export interface VesselProfile {
  id: string;
  name: string;
  formerNames?: string[];
  type?: string;
  flag?: string;
  registrationNumber?: string;
  callSign?: string;
  mmsi?: string;
  dimensions: VesselDimensions;
  notes?: string;
  audit: AuditMetadata;
}

export type PassageLegExposure = 'sheltered' | 'coastal' | 'open-water';

export interface PassageBailoutHarbour {
  name: string;
  note: string;
}

export interface PassageHazard {
  id: string;
  text: string;
  severity: 'low' | 'medium' | 'high';
}

export interface PassageLeg {
  id: string;
  from: string;
  to: string;
  distanceNm: number;
  plannedSpeedKn: number;
  exposure: PassageLegExposure;
  daylightPreferred: boolean;
  hazards: PassageHazard[];
  bailoutHarbours: PassageBailoutHarbour[];
  crewNotes: string[];
}

export interface PassagePlan {
  id: string;
  title: string;
  vesselId?: string;
  area: string;
  plannedDepartureDate?: string;
  assumptions: Assumption[];
  legs: PassageLeg[];
  contentVersion: string;
}

export interface PassageLegEta {
  legId: string;
  hours: number;
}

export interface PassagePlanSummary {
  totalDistanceNm: number;
  totalPlannedHours: number;
  openWaterLegs: number;
  highSeverityHazards: number;
  daylightCriticalLegs: number;
  bailoutHarbourCount: number;
}

export type ChecklistCategory =
  | 'departure'
  | 'arrival'
  | 'engine'
  | 'night'
  | 'heavy-weather'
  | 'emergency'
  | 'maintenance'
  | 'custom';

export interface ChecklistItemTemplate {
  id: string;
  text: string;
  helpText?: string;
  required: boolean;
  warningIfSkipped?: string;
  dependsOn?: string[];
}

export interface ChecklistTemplate {
  id: string;
  title: string;
  category: ChecklistCategory;
  vesselSpecific: boolean;
  safetyCritical: boolean;
  items: ChecklistItemTemplate[];
  assumptions: Assumption[];
  contentVersion: string;
}

export type ChecklistItemStatus = 'open' | 'done' | 'skipped' | 'not-applicable';

export interface ChecklistItemState {
  itemId: string;
  status: ChecklistItemStatus;
  completedAt?: IsoDateTime;
  note?: string;
}

export interface ChecklistRun {
  id: string;
  templateId: string;
  vesselId: string;
  passageId?: string;
  startedAt: IsoDateTime;
  completedAt?: IsoDateTime;
  itemStates: ChecklistItemState[];
  notes?: string;
  audit: AuditMetadata;
}

export type ChecklistRunStatus = 'incomplete' | 'complete' | 'complete-with-warnings';

export interface ChecklistRunSummary {
  status: ChecklistRunStatus;
  totalItems: number;
  openItems: number;
  doneItems: number;
  skippedItems: number;
  notApplicableItems: number;
  requiredSkippedItems: number;
  warnings: string[];
}
