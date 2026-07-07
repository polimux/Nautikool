# Nautikool Architecture

## Status

Initial architecture decision for the documentation-first phase.

This document defines the first implementation direction. Nautikool should become useful as an offline skipper notebook and passage-preparation tool before depending on live sensors, cloud services or hardware integrations.

## Architecture goals

Nautikool should be:

- local-first and useful without internet,
- simple enough to build and test incrementally,
- structured around sailing workflows rather than around UI screens,
- explicit about assumptions and data freshness,
- able to grow toward mobile, AIS, NMEA2000 and weather integrations later,
- auditable where it supports preparation and operational decisions.

## Initial stack decision

The recommended first stack is:

- App model: Progressive Web App.
- Language: TypeScript.
- Frontend framework: SvelteKit.
- Storage: IndexedDB through a small repository/storage abstraction.
- Content: Markdown for lessons, checklists and reference cards, with frontmatter metadata.
- Testing: Vitest for pure domain logic and Playwright later for workflow tests.
- Styling: lightweight CSS or framework-light styling; no heavy UI dependency until cockpit constraints are better understood.

## Rationale

### Progressive Web App first

A PWA keeps the first product easy to run on laptop, tablet and phone while preserving a path toward offline use. It avoids committing too early to native iOS/Android complexity.

The first MVP needs offline checklists, passage notes, vessel profile data and printable or exportable trip packs more than it needs native sensors.

### SvelteKit over React for the first implementation

SvelteKit is recommended for the first implementation because:

- it supports a compact codebase,
- it works well for content-heavy applications,
- it has a straightforward path to PWA behavior,
- it keeps UI state and domain logic easier to separate in a small project,
- it avoids adding a large application framework before the domain model is clear.

React remains a valid alternative if ecosystem requirements later become dominant, but the first phase should optimize for clarity and iteration speed.

### IndexedDB behind an abstraction

Nautikool should not let browser storage details leak into domain logic.

Use IndexedDB for local persistence in the PWA, but access it through repository interfaces such as:

- VesselRepository,
- ChecklistRepository,
- PassageRepository,
- TripPackRepository,
- ContentRepository.

This keeps future migration to SQLite, a native wrapper or cloud sync possible.

### Markdown content

Lessons, checklists and reference cards should start as Markdown files with frontmatter. This keeps content reviewable in Git and lets sailing knowledge evolve without touching application logic.

Useful frontmatter fields include:

- id,
- type,
- audience,
- safety relevance,
- offline requirement,
- version.

## Module boundaries

The first application should be organized around domain modules:

- domain/vessel,
- domain/checklist,
- domain/passage,
- domain/risk,
- domain/units,
- domain/time,
- storage,
- content,
- app shell,
- integrations.

### Domain modules

Domain modules must contain pure logic where possible. They should be testable without browser APIs.

Important early domain concepts:

- VesselProfile,
- ChecklistTemplate,
- ChecklistRun,
- PassagePlan,
- PassageLeg,
- TripPack,
- WeatherSnapshot,
- RiskAssessment,
- Assumption,
- DataFreshness.

### Storage module

The storage module owns IndexedDB details and migration/version handling. Domain logic should not call IndexedDB directly.

### Content module

The content module loads Markdown-based lessons, checklists and reference cards, validates metadata and prepares offline bundles.

### Integration module

Integrations must be optional adapters. Initial integrations should be file-based or simulated:

1. GPX import/export.
2. AIS simulator.
3. NMEA2000 simulator.
4. Weather snapshot import or static fixture.

Live AIS, NMEA2000 and weather APIs should wait until the local-first core is useful and tested.

## Safety posture in the architecture

Preparation and decision-support outputs must show:

- assumptions,
- data freshness,
- missing data,
- conservative escalation language,
- user responsibility,
- and explainable reasoning.

Decision-support logic should live in tested domain modules rather than hidden inside UI components.

## Offline-first implications

The MVP should assume that the user may lose network before or during a passage.

Required early offline capabilities:

- vessel profile available offline,
- active checklists available offline,
- trip pack available offline,
- relevant knowledge content available offline,
- visible freshness timestamp for imported weather or harbour data,
- export or print fallback for passage plans and emergency cards.

## Testing implications

The first test investment should target pure logic and safety-relevant behavior:

- unit conversion,
- ETA and timezone handling,
- checklist completion state,
- stale data detection,
- risk assessment escalation,
- import/export validation,
- content metadata validation.

End-to-end tests should come after the first runnable skeleton exists.

## First implementation slice

The first runnable slice should not start with charts or integrations.

Recommended first slice:

1. SvelteKit and TypeScript project setup.
2. Static shell with home, vessel profile and checklist routes.
3. In-memory vessel profile and checklist state.
4. Pure domain types for vessel and checklist.
5. Unit tests for basic checklist state transitions.
6. Then add IndexedDB persistence.

Acceptance criteria:

- The app starts locally.
- A vessel profile draft can be represented in code.
- A checklist can be opened and marked item by item.
- Checklist state logic has unit tests.
- Preparation guidance shows assumptions where relevant.

## Deferred decisions

The following decisions are intentionally deferred:

- cloud sync,
- user accounts,
- native app wrapper,
- live weather API provider,
- live NMEA2000 bridge,
- live AIS ingest,
- chart rendering,
- paid product model.

These should not block the local-first MVP.

## Next architecture step

Create `docs/domain-model.md` to define the first data structures for vessel profile, checklist templates, checklist runs, passage plans, trip packs and risk assessments before generating application code.
