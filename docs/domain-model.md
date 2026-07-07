# Nautikool Domain Model

## Status

Initial domain model for the documentation-first phase.

This document defines the first product concepts that should exist before application code is generated. The goal is not to finalize database schemas. The goal is to name the core entities, their responsibilities, safety-relevant metadata and first implementation boundaries.

## Domain-model goals

The Nautikool domain model should:

- support a useful local-first skipper notebook and checklist tool,
- keep sailing concepts separate from UI screens and storage details,
- make assumptions and data freshness explicit,
- support offline use before live integrations exist,
- make safety-relevant behavior testable,
- keep future AIS, NMEA2000 and weather adapters optional.

## Cross-cutting primitives

### Identifiers

Use stable string identifiers for all persisted entities.

Recommended convention:

```text
vessel:<slug>
checklist-template:<slug>
checklist-run:<timestamp-or-ulid>
passage:<slug-or-ulid>
trip-pack:<slug-or-ulid>
content:<slug>
```

The exact ID generator can be decided during implementation, but IDs should be stable across local persistence, export and import.

### Audit fields

Persisted entities should carry lightweight audit metadata:

```ts
interface AuditMetadata {
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
  version: number;
}
```

### Assumption

Safety-relevant guidance must be backed by visible assumptions.

```ts
interface Assumption {
  id: string;
  statement: string;
  source: 'user' | 'vessel-profile' | 'imported-data' | 'computed' | 'default';
  confidence: 'low' | 'medium' | 'high';
  safetyImpact: 'low' | 'medium' | 'high';
}
```

Examples:

- "Crew is rested enough for night sailing."
- "Weather snapshot is still valid for the planned departure window."
- "Vessel draft is entered correctly."
- "The route has not been checked against official notices to mariners."

### DataFreshness

Any imported or time-sensitive data should expose freshness.

```ts
interface DataFreshness {
  observedAt?: IsoDateTime;
  importedAt?: IsoDateTime;
  validFrom?: IsoDateTime;
  validUntil?: IsoDateTime;
  status: 'fresh' | 'stale' | 'expired' | 'unknown';
  explanation: string;
}
```

Freshness must be visible in UI for weather, harbour data, sensor snapshots and imported route packs.

### RiskLevel

Use a conservative traffic-light scale.

```ts
type RiskLevel = 'green' | 'yellow' | 'red' | 'unknown';
```

`unknown` is intentionally separate from green. Missing data must not silently produce a safe result.

## Core entities

### VesselProfile

The vessel profile is the anchor entity. Nautikool should feel boat-specific rather than generic.

```ts
interface VesselProfile {
  id: string;
  name: string;
  formerNames?: string[];
  type?: string;
  flag?: string;
  registrationNumber?: string;
  callSign?: string;
  mmsi?: string;
  dimensions: VesselDimensions;
  engine?: EngineProfile;
  electrical?: ElectricalProfile;
  safetyEquipment: SafetyEquipmentInventory;
  electronics: ElectronicsInventory;
  knownDefects: KnownDefect[];
  notes?: string;
  audit: AuditMetadata;
}
```

Important child concepts:

```ts
interface VesselDimensions {
  loaMeters?: number;
  beamMeters?: number;
  draftMeters?: number;
  mastHeightMeters?: number;
  displacementKg?: number;
}

interface EngineProfile {
  manufacturer?: string;
  model?: string;
  fuelType?: 'diesel' | 'petrol' | 'electric' | 'other';
  fuelCapacityLiters?: number;
  cruisingRpm?: number;
  serviceNotes?: string;
}

interface ElectricalProfile {
  nominalVoltage: 12 | 24 | 48;
  batteryBanks: BatteryBank[];
  chargingSources: ChargingSource[];
}
```

First implementation scope:

- represent vessel identity and dimensions,
- represent engine and safety basics,
- leave deeper electrical and electronics inventories extensible,
- do not block MVP on a perfect boat-system model.

### ChecklistTemplate

Checklist templates define reusable procedures.

```ts
interface ChecklistTemplate {
  id: string;
  title: string;
  category: 'departure' | 'arrival' | 'engine' | 'night' | 'heavy-weather' | 'emergency' | 'maintenance' | 'custom';
  vesselSpecific: boolean;
  safetyCritical: boolean;
  items: ChecklistItemTemplate[];
  assumptions: Assumption[];
  contentVersion: string;
}

interface ChecklistItemTemplate {
  id: string;
  text: string;
  helpText?: string;
  required: boolean;
  warningIfSkipped?: string;
  dependsOn?: string[];
}
```

Checklist templates should be content-first. They can initially be authored as Markdown/frontmatter and loaded into typed structures.

### ChecklistRun

A checklist run records execution state for a specific vessel, passage or maintenance activity.

```ts
interface ChecklistRun {
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

interface ChecklistItemState {
  itemId: string;
  status: 'open' | 'done' | 'skipped' | 'not-applicable';
  completedAt?: IsoDateTime;
  note?: string;
}
```

Safety rule:

A safety-critical checklist with required skipped items should not report as complete without visible warnings.

### PassagePlan

A passage plan captures route intent, not chart authority. Nautikool can support preparation, but it must not pretend to be the official navigational source.

```ts
interface PassagePlan {
  id: string;
  title: string;
  vesselId: string;
  departure: PassageEndpoint;
  destination: PassageEndpoint;
  plannedDeparture?: IsoDateTime;
  plannedArrival?: IsoDateTime;
  legs: PassageLeg[];
  bailoutOptions: BailoutOption[];
  hazards: PassageHazard[];
  crew: CrewProfile[];
  assumptions: Assumption[];
  audit: AuditMetadata;
}
```

```ts
interface PassageLeg {
  id: string;
  from: PassageWaypoint;
  to: PassageWaypoint;
  distanceNm?: number;
  plannedCourseDegreesTrue?: number;
  estimatedDurationHours?: number;
  notes?: string;
  hazards: PassageHazard[];
}

interface PassageWaypoint {
  name: string;
  latitude?: number;
  longitude?: number;
  source: 'manual' | 'gpx' | 'chart-reference' | 'unknown';
}
```

First implementation scope:

- manual route-leg entry is enough,
- GPX can be deferred until the core model and tests exist,
- each leg should be able to carry hazards, notes and bailout thinking.

### WeatherSnapshot

Weather data should be a snapshot with freshness, not an implicit live truth.

```ts
interface WeatherSnapshot {
  id: string;
  passageId?: string;
  provider?: string;
  model?: string;
  issuedAt?: IsoDateTime;
  freshness: DataFreshness;
  summary: string;
  wind?: WindForecast[];
  waves?: WaveForecast[];
  warnings?: WeatherWarning[];
  assumptions: Assumption[];
}
```

First implementation scope:

- allow a static or manually entered weather briefing,
- expose issued/imported/valid timestamps,
- do not implement automated provider comparison until later.

### RiskAssessment

Risk assessments should be conservative, explainable and testable.

```ts
interface RiskAssessment {
  id: string;
  passageId?: string;
  vesselId: string;
  createdAt: IsoDateTime;
  level: RiskLevel;
  summary: string;
  factors: RiskFactor[];
  assumptions: Assumption[];
  missingData: string[];
  recommendationLanguage: 'informational' | 'caution' | 'no-go';
}

interface RiskFactor {
  id: string;
  label: string;
  level: RiskLevel;
  explanation: string;
  source: 'weather' | 'vessel' | 'crew' | 'route' | 'checklist' | 'manual';
}
```

Rules:

- Missing critical data should push the result toward `unknown` or `yellow`, never silent green.
- `red` and `unknown` need explicit explanation.
- The UI must show assumptions and missing data with the result.
- This model supports guidance, not command authority.

### TripPack

A trip pack is the offline bundle for a passage.

```ts
interface TripPack {
  id: string;
  passageId: string;
  vesselId: string;
  generatedAt: IsoDateTime;
  includes: TripPackContents;
  freshness: DataFreshness;
  exportFormats: ('html' | 'pdf' | 'json')[];
  audit: AuditMetadata;
}

interface TripPackContents {
  vesselSummary: boolean;
  passagePlan: boolean;
  checklists: string[];
  emergencyCards: string[];
  harbourNotes: string[];
  weatherSnapshotIds: string[];
  assumptions: Assumption[];
}
```

First implementation scope:

- create a printable/exportable structure before implementing perfect rendering,
- preserve assumptions and freshness inside the pack,
- design for offline use by default.

## Derived views

The app can build UI views from the domain model. These should not become the source of truth.

Important derived views:

- pre-departure dashboard,
- active passage summary,
- open checklist warnings,
- trip-pack print view,
- vessel readiness summary,
- risk card.

## First implementation slice

The first code slice should cover only a small part of this model:

1. `VesselProfile` type with dimensions and basic identity.
2. `ChecklistTemplate` and `ChecklistRun` types.
3. Pure checklist state transition functions.
4. Unit tests for marking items done, skipped and complete.
5. A placeholder `Assumption` model so safety-related UI does not become an afterthought.

## Initial acceptance criteria

- A vessel profile can be represented without browser APIs.
- A checklist template can produce a checklist run.
- A checklist item can transition between open, done, skipped and not applicable.
- A safety-critical checklist with skipped required items cannot be silently treated as cleanly complete.
- Assumptions can be attached to checklist templates and later surfaced in UI.

## Deferred model decisions

Defer until the first runnable slice exists:

- full maintenance-log schema,
- GPX route geometry details,
- AIS target model,
- NMEA2000 PGN mapping,
- weather provider normalization,
- account/user model,
- cloud sync conflict resolution,
- chart object model.

## Next domain step

After this document, the next valuable improvement is to create a minimal SvelteKit/TypeScript project skeleton with pure domain types and tests for checklist state transitions.