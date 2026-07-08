# Product Focus Sequence

Nautikool should now move from foundation work into product-shaped implementation.

The priority sequence is:

1. Content System: Markdown and frontmatter
2. Checklist Engine
3. Passage Planner
4. Vessel Profile
5. Risk Engine
6. NMEA/AIS Adapter

This sequence is intentionally product-led. Nautikool should become useful as a local-first skipper companion before it grows into live hardware integration.

## 1. Content System: Markdown and Frontmatter

### Product intent

Nautikool should be easy to extend with sailing knowledge, checklists, reference cards and later scenario content without hard-coding everything in Svelte components.

The content system is the bridge between nautical knowledge and application behaviour.

### First useful content types

- Checklist templates
- Learning cards
- Emergency reference cards
- Harbour or pilotage notes
- Passage briefing templates

### Initial content format

Use Markdown files with frontmatter metadata.

Example checklist content:

```md
---
id: checklist.departure.basic
kind: checklist
title: Basic departure checklist
category: departure
safetyCritical: true
vesselSpecific: false
contentVersion: 0.1.0
assumptions:
  - id: assumption.forecast-reviewed
    statement: The skipper has reviewed a current forecast.
    source: user
    confidence: medium
    safetyImpact: high
items:
  - id: item.weather
    text: Review wind, gusts, waves and visibility.
    required: true
    warningIfSkipped: Departure without weather review removes a critical safety barrier.
  - id: item.engine
    text: Check engine starts, cooling water flows and fuel level is sufficient.
    required: true
  - id: item.logbook
    text: Record departure time and crew.
    required: false
---

# Basic departure checklist

Use this checklist before leaving the berth for a normal coastal passage.
```

### Implementation target

- Define a typed content schema.
- Add example Markdown checklist content.
- Parse metadata into `ChecklistTemplate`.
- Validate malformed content with useful errors.
- Keep rendering separate from domain logic.

### Acceptance criteria

- A checklist template can be represented as Markdown/frontmatter.
- Frontmatter maps cleanly to the current `ChecklistTemplate` type.
- Invalid checklist content fails with explicit messages.
- Tests cover valid and invalid content.

## 2. Checklist Engine

### Product intent

The checklist engine is Nautikool's first operational safety workflow.

It should help the skipper prepare the boat and crew without pretending that a checklist alone makes a passage safe.

### Near-term scope

- Checklist template loading.
- Checklist run creation.
- Item state transitions.
- Required skipped item warnings.
- Summary status: incomplete, complete, complete-with-warnings.
- Later: persistence, filtering by vessel profile, passage type and conditions.

### Acceptance criteria

- Required items cannot disappear silently.
- Skipped required items are visible as warnings.
- The UI can show checklist progress without owning the safety logic.
- Checklist runs are deterministic and testable.

## 3. Passage Planner

### Product intent

The passage planner should turn a vague route idea into a usable skipper briefing.

It should support practical preparation:

- route legs,
- distances,
- ETAs,
- hazards,
- bailout harbours,
- daylight windows,
- crew notes,
- weather assumptions,
- and go/no-go review.

### Near-term scope

- Domain types for `PassagePlan`, `PassageLeg`, `Hazard`, `BailoutHarbour` and `DaylightWindow`.
- Manual entry first.
- GPX import/export later.
- Weather and risk integration later.

### Acceptance criteria

- A route can be decomposed into legs.
- Each leg can carry hazards and bailout notes.
- ETA and duration calculations are explicit about assumptions.
- Missing distance, speed or daylight data does not create false confidence.

## 4. Vessel Profile

### Product intent

Nautikool should understand the user's actual boat.

A generic checklist is useful; a vessel-aware checklist is much better.

### Near-term scope

- Vessel identity and dimensions.
- Engine and fuel notes.
- Electrical system notes.
- Safety equipment inventory.
- Navigation electronics inventory.
- Known defects and spares.

### Acceptance criteria

- A vessel profile can describe a 9-11 m coastal yacht.
- Checklist and risk logic can reference vessel data.
- Missing critical vessel data is visible, not silently assumed.

## 5. Risk Engine

### Product intent

The risk engine should produce conservative green/yellow/red support for departure and passage decisions.

It must never claim that sailing is safe. It can only explain whether the known assumptions look acceptable, marginal or unsuitable.

### Near-term scope

- Typed risk inputs.
- Explicit assumptions.
- Missing-data handling.
- Rule-based output before any machine-learning or external model complexity.

### Risk dimensions

- Wind and gusts
- Waves and exposure
- Daylight
- Crew strength and fatigue
- Boat readiness
- Navigation complexity
- Bailout options
- Data freshness

### Acceptance criteria

- Unknown critical data escalates risk.
- The output includes assumptions and reasons.
- Rules are covered by tests.
- Copy uses conservative wording.

## 6. NMEA/AIS Adapter

### Product intent

NMEA2000 and AIS should make Nautikool more context-aware, but they must not be the foundation.

The app should remain useful when sensors are unavailable, duplicated, stale or wrong.

### Near-term scope

- Simulator-first approach.
- Define adapter interfaces before real hardware.
- AIS target freshness and relevance rules.
- NMEA source inventory and health model.

### Acceptance criteria

- The app can ingest simulated own-ship and AIS data.
- Stale or missing data is clearly marked.
- AIS learning and scenario training can use the same concepts as future live data.
- Live adapters remain optional.

## Product-management decision

The next implementation should not be another broad documentation pass.

Next best implementation step:

1. Add a minimal content schema for checklist Markdown/frontmatter.
2. Add one real departure checklist content file.
3. Add parser/mapper tests that convert content metadata into `ChecklistTemplate`.

If dependency or parser libraries are not yet available, start with typed metadata objects and a parser boundary so the domain contract is clear before choosing the parsing implementation.
