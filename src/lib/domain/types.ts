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

export interface VesselRigProfile {
  type: string;
  mainsail?: string;
  headsails: string[];
  downwindSails?: string[];
  reefingNotes?: string;
}

export interface VesselEngineProfile {
  make: string;
  model: string;
  type: 'diesel-inboard' | 'petrol-inboard' | 'outboard' | 'electric' | 'unknown';
  powerHp?: number;
  drive?: 'shaft' | 'saildrive' | 'outboard' | 'unknown';
  fuelType?: 'diesel' | 'petrol' | 'electric' | 'unknown';
  checks: string[];
}

export interface VesselTankProfile {
  fuelLiters?: number;
  waterLiters?: number;
  holdingTankLiters?: number;
  notes?: string;
}

export interface VesselBatteryProfile {
  houseBank?: string;
  starterBattery?: string;
  chargingSources: string[];
  notes?: string;
}

export type VesselEquipmentCategory =
  | 'safety'
  | 'navigation'
  | 'communication'
  | 'electrical'
  | 'ground-tackle'
  | 'spares'
  | 'documents';

export interface VesselEquipmentItem {
  id: string;
  name: string;
  category: VesselEquipmentCategory;
  installed: boolean;
  critical: boolean;
  notes?: string;
}

export interface VesselReadinessFinding {
  id: string;
  severity: 'info' | 'warning' | 'blocker';
  text: string;
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
  rig?: VesselRigProfile;
  engine?: VesselEngineProfile;
  tanks?: VesselTankProfile;
  batteries?: VesselBatteryProfile;
  equipment: VesselEquipmentItem[];
  assumptions: Assumption[];
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

export type RiskLevel = 'green' | 'yellow' | 'red';
export type RiskRuleSeverity = 'info' | 'caution' | 'no-go';

export interface RiskInputWeather {
  sustainedWindKn?: number;
  gustKn?: number;
  waveHeightMeters?: number;
  visibilityNm?: number;
  thunderstormRisk?: 'none' | 'low' | 'moderate' | 'high' | 'unknown';
  forecastAgeHours?: number;
}

export interface RiskInputCrew {
  skipperExperienceNm?: number;
  hasNightExperience?: boolean;
  crewCount: number;
  minorsOnBoard?: number;
  fatigueLevel?: 'low' | 'medium' | 'high' | 'unknown';
}

export interface RiskAssessmentInput {
  id: string;
  title: string;
  passage: PassagePlan;
  vessel: VesselProfile;
  weather: RiskInputWeather;
  crew: RiskInputCrew;
  assumptions: Assumption[];
}

export interface RiskRuleFinding {
  id: string;
  severity: RiskRuleSeverity;
  level: RiskLevel;
  text: string;
  recommendation: string;
}

export interface RiskAssessment {
  id: string;
  title: string;
  level: RiskLevel;
  canDepart: boolean;
  findings: RiskRuleFinding[];
  assumptions: Assumption[];
  summary: {
    noGoFindings: number;
    cautionFindings: number;
    infoFindings: number;
    highSeverityHazards: number;
    openWaterLegs: number;
    missingCriticalEquipment: number;
  };
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
  requiredOpenItems: number;
  requiredSkippedItems: number;
  completionPercent: number;
  canComplete: boolean;
  warnings: string[];
  blockers: string[];
}
