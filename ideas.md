# Nautikool Ideas, Product Backlog and Working Log

## Product thesis

Nautikool is a local-first sailing companion for coastal skippers. It should combine learning, vessel-specific preparation, passage planning, safety checklists and eventually live onboard context from navigation electronics.

The intended first user is a competent but still learning skipper sailing a 9-11 m yacht in the Baltic Sea, often with limited crew or singlehanded. The product should feel like a calm co-skipper: practical, conservative, offline-capable and transparent about assumptions.

Working positioning:

> Duolingo meets Navionics meets a smart skipper notebook.

Nautikool should help answer four cockpit-relevant questions:

1. What do I need to know?
2. What do I need to prepare?
3. What is happening around my boat?
4. What should I do next?

## Product principles

### Project manager view

- Ship small, coherent increments.
- Keep the repository understandable at every stage.
- Document decisions before implementation becomes random.
- Prefer workflows that reduce skipper workload and risk.
- Avoid feature bloat until the local-first core is useful.

### Developer view

- Keep content, vessel data, passage planning, checklists and integrations separable.
- Prefer local-first storage and offline operation.
- Treat hardware integrations as optional adapters, not as the product foundation.
- Put tests around calculations, parsers, state transitions and safety logic.

### Tester view

- Test realistic sailing scenarios, not only happy paths.
- Include failure modes: no internet, stale weather, wrong units, missing GPS, AIS noise, low battery and tired crew.
- Safety guidance must be conservative and assumption-driven.
- The app must not imply certainty when it only has incomplete information.

### User view

- The app must be useful with wet hands, glare, fatigue and limited attention.
- It must work without internet during a passage.
- It should expose reasoning quickly: why green, why yellow, why red.
- It should support pre-departure preparation as much as underway use.

### Product manager view

- The wedge is a practical skipper preparation and onboard reference tool.
- The moat is the combination of structured learning, vessel-specific data, route context and safety workflows.
- The first wow moment should be: "This understands my boat, my route and my current skill level."

## Current repository assessment

Date: 2026-07-09

Repository state reviewed:

- Repository exists and is writable.
- `ideas.md` remains the product source of truth.
- `README.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `docs/README.md`, `docs/architecture.md` and `docs/domain-model.md` exist.
- A runnable SvelteKit/TypeScript skeleton exists.
- Pure checklist domain types and state-transition logic exist under `src/lib/domain`.
- Checklist run summaries expose progress, completion eligibility, required open items and blocker messages.
- Vitest tests cover checklist state semantics, blocker/progress semantics and starter checklist content.
- GitHub Actions CI validates install, Svelte/TypeScript checks, unit tests and production build.
- The starter content registry includes departure readiness, diesel inboard pre-start, night-arrival, heavy-weather departure and MOB immediate-action checklist templates.
- The Passage Planner slice has typed passage plan domain types, pure summary logic, tests and one realistic Turku to Pärnu H-323 sample route.
- The Vessel Profile slice has richer equipment, engine, rig, battery, tank and readiness-finding types.
- A first H-323 Elina vessel profile exists with identity data, Yanmar engine checks, Raymarine/Orca/em-trak equipment, safety equipment and explicit assumptions about unverified capacities.
- The Risk Engine slice has typed weather, crew, vessel, passage and traffic-light risk assessment structures.
- A first static Turku to Pärnu H-323 family risk scenario exists and is surfaced on the landing page.
- Risk Engine v1 now also models likely night/overnight legs and restricted visibility as explicit decision inputs.
- A second static risk scenario now demonstrates the Hanko to Haapsalu night-crossing decision problem with limited visibility and no recorded night experience.
- The landing page surfaces checklist, passage, vessel and multiple risk content slices.
- The repository currently has `package.json` but no committed npm lockfile.

Decision:

- Continue the 80% implementation / 20% documentation shift.
- Extend Risk Engine v1 before starting a new major module, because the previous risk model had an unused crew night-experience field and visibility was not yet safety-relevant.
- Treat night crossing and restricted visibility as first-class skipper decision inputs for Baltic family passages.
- Keep every commit content-bearing: the new logic is paired with a concrete Turku to Pärnu / Hanko to Haapsalu night-crossing rehearsal scenario.
- Keep static scenarios clearly separated from live advice.

Rationale:

- The Hanko to Haapsalu leg is the most consequential leg in the existing passage plan: it is open-water, long, likely to involve night hours and has fewer immediate shelter options.
- A product that records `hasNightExperience` but does not use it creates false precision; the risk engine should explain why a likely night leg becomes yellow without recorded night experience.
- Visibility is cockpit-relevant and should not be hidden inside generic weather assumptions, especially for family crews, AIS/VHF watch discipline and harbour-entry timing.
- Adding a second risk scenario strengthens the product demo without building a new module prematurely.

Working log:

- Added pure risk rules for likely night or overnight legs without recorded night experience and unknown night experience.
- Added restricted-visibility rules: limited visibility becomes yellow; very poor visibility becomes red/no-go.
- Added conservative missing-visibility handling for exposed or likely overnight passages.
- Added a typed Turku to Pärnu H-323 night-crossing rehearsal scenario with limited visibility, watch-plan assumptions and static-scenario safety wording.
- Added tests for night-experience caution, limited-visibility caution and restricted-visibility no-go.
- Updated the landing page to render all risk cards from the shared risk assessment registry.
- Updated `CHANGELOG.md` with the new risk rules, scenario content, tests and UI change.

## Feature backlog

### Core product

| ID | Feature | Description | Priority | Status |
|---|---|---|---|---|
| F-001 | Vessel profile | Store LOA, beam, draft, mast height, engine, batteries, safety equipment, electronics and owner notes. | High | Started |
| F-002 | Passage planner | Plan route legs, distances, ETAs, hazards, bailout harbours, daylight and crew notes. | High | Started |
| F-003 | Checklist engine | Configurable departure, arrival, engine, heavy-weather, night-sailing and emergency checklists. | High | Started |
| F-004 | Learning modules | Bite-sized nautical lessons for COLREGs, lights, buoys, VHF, anchoring, weather, navigation and sail trim. | High | Idea |
| F-005 | Scenario trainer | Interactive decisions for crossing traffic, squalls, harbour approaches, engine alarms and MOB. | Medium | Idea |
| F-006 | Boat systems notebook | Document seacocks, fuel, engine, electrics, NMEA network, spares and known defects. | High | Idea |
| F-007 | Maintenance log | Track engine hours, oil changes, filters, batteries, rig checks, extinguishers and liferaft service. | Medium | Idea |
| F-008 | Trip logbook | Capture trip, crew, weather, sail setup, incidents, lessons learned and engine hours. | Medium | Idea |
| F-009 | Harbour notebook | Store harbour notes, berth details, fees, VHF channels, fuel, groceries, sauna and approach notes. | Medium | Idea |
| F-010 | Risk card | Generate green/yellow/red departure assessment from weather, route, crew and boat readiness. | High | Started |

### UX ideas

| ID | UX idea | Description | Priority | Status |
|---|---|---|---|---|
| UX-001 | Cockpit mode | High-contrast, large-button, low-distraction interface for underway use. | High | Idea |
| UX-002 | Pre-departure dashboard | One screen for weather, route risk, boat readiness, crew readiness and open checklist items. | High | Idea |
| UX-003 | Traffic-light decisions | Green/yellow/red decisions with short explanation and assumptions. | High | Started |
| UX-004 | Skill-aware explanations | Beginner, competent crew, skipper and instructor explanation levels. | Medium | Idea |
| UX-005 | Quick capture | One-tap notes for defects, harbour notes, maintenance needs and log entries. | Medium | Idea |
| UX-006 | Emergency screen | MOB, mayday, DSC, position, nearest harbour and emergency checklist. | High | Idea |
| UX-007 | Boat-specific home | Home screen starts from the user's own vessel and active passage. | High | Started |
| UX-008 | Printable mode | Generate printable passage plans, checklists and emergency cards. | Medium | Idea |

### Navigation, offline and integration ideas

| ID | Feature | Description | Priority | Status |
|---|---|---|---|---|
| NAV-001 | GPX import/export | Exchange routes and tracks with chartplotters and navigation apps. | High | Idea |
| NAV-002 | Leg table | Course, distance, ETA, hazards, bailout options and notes by leg. | High | Started |
| NAV-007 | Night passage prep | Navigation lights, watch rhythm, rest, headlamp discipline and traffic plan. | High | Started |
| OFF-001 | Offline knowledge base | Core lessons and emergency procedures available without internet. | High | Idea |
| OFF-002 | Offline checklists | Vessel and passage checklists cached locally. | High | Idea |
| OFF-003 | Offline route pack | Save route, harbour notes, documents and weather snapshot for a trip. | High | Idea |
| OFF-004 | Freshness labels | Show when downloaded forecasts or harbour info were last updated. | High | Idea |
| N2K-001 | Network inventory | Document devices, PGNs, power injection, terminators and adapter cables. | High | Idea |
| N2K-005 | Simulator input | Provide mock NMEA2000 data for development and tests. | High | Idea |
| AIS-002 | AIS learning mode | Explain CPA, TCPA, MMSI, COG, SOG and class A/B. | High | Idea |
| AIS-003 | Collision scenario trainer | Use simulated AIS traffic for crossing, overtaking and head-on exercises. | High | Idea |
| AIS-005 | Stale target warning | Mark AIS targets as stale when updates stop. | High | Idea |
| WTH-001 | Forecast comparison | Compare wind, gusts, waves, rain and pressure across providers/models. | High | Idea |
| WTH-003 | Go/no-go logic | Conservative rule-based departure support by boat, route, crew and exposure. | High | Started |
| WTH-006 | Weather freshness warning | Make stale forecasts impossible to overlook. | High | Started |

## Expected bug classes and prevention

| ID | Area | Risk | Prevention |
|---|---|---|---|
| B-001 | Unit conversion | Confusion between m, nm, kn, km/h and hours. | Central unit library and tests. |
| B-002 | Time zones | ETA and weather timestamps mismatch. | Store timezone metadata; test Baltic crossings. |
| B-003 | Offline data | Missing route/checklist content once network is gone. | Offline manifest and offline integration tests. |
| B-004 | AIS parsing | Wrong target sorting or stale targets shown as current. | Timestamp validation and simulator tests. |
| B-005 | Weather freshness | Old forecast displayed as current. | Expiry rules and prominent freshness banner. |
| B-006 | Safety language | Overconfident or unsafe recommendation wording. | Conservative copy, assumptions and red/yellow escalation. |
| B-007 | Vessel-specific data | Generic checklist ignores the actual boat setup. | Vessel profile linked to checklist generation. |
| B-008 | Checklist state | Skipped required items appear as safe completion. | Checklist completion logic distinguishes clean completion from warned completion. |
| B-009 | Missing data | Unknown weather, route or crew data defaults to green. | Model `unknown` separately and test conservative escalation. |
| B-010 | Domain/UI coupling | UI state becomes the source of truth. | Keep checklist logic as pure TypeScript functions with tests. |
| B-011 | Broken main branch | New features compile locally but break tests or build. | GitHub Actions validates checks, tests and build on push/PR. |
| B-012 | CI dependency setup | CI fails before product checks because dependency caching assumes a missing lockfile. | Avoid npm cache until a lockfile exists; then use lockfile-backed installs. |
| B-013 | Repository drift | Changes are made without a clear decision record, validation path or safety-sensitive review shape. | Use `CONTRIBUTING.md` and the `ideas.md` decision/working-log format for meaningful changes. |
| B-014 | Passage distance optimism | A nominal day plan hides that one leg is too long for family crew or daylight. | Keep leg-level distances and summary tests visible; later add thresholds and warnings. |
| B-015 | False checklist readiness | A checklist with required open items looks nearly complete and encourages departure. | Expose required-open blockers, completion eligibility and progress separately. |
| B-016 | Vessel false precision | Unknown tank or battery capacities are guessed and then reused in range or risk logic. | Store unknown capacities explicitly and test that unverified values remain undefined. |
| B-017 | Equipment string coupling | Features depend on UI text instead of stable equipment identifiers. | Use stable equipment IDs and tests for key navigation, communication and safety items. |
| B-018 | False green risk | Missing or stale weather, fatigue or equipment gaps are accidentally treated as acceptable. | Risk rules escalate missing and stale inputs to yellow/red with tests. |
| B-019 | Static scenario mistaken for live advice | Demo risk content is interpreted as current weather guidance. | Label static risk scenarios as planning examples and require explicit forecast timestamps. |
| B-020 | Night-risk blind spot | A passage can include likely night hours while crew night experience is ignored. | Treat non-daylight legs and unknown/missing night experience as explicit risk findings. |
| B-021 | Visibility blind spot | Fog or poor visibility is buried in weather text and does not affect departure advice. | Model visibility in nautical miles and escalate limited/restricted visibility with tests. |

## Roadmap

### Phase 0: Repository foundation

Goal: make the repository understandable and ready for implementation.

Tasks:

- [x] Add `ideas.md`.
- [x] Add `README.md` with product pitch, target user and planned modules.
- [x] Add `CHANGELOG.md`.
- [x] Add `/docs` structure.
- [x] Decide initial tech stack.
- [x] Define first domain model.
- [x] Create first runnable SvelteKit/TypeScript skeleton.
- [x] Add first pure domain logic and Vitest tests.
- [x] Add CI validation for checks, tests and production build.
- [x] Define contribution and decision-log format.

### Phase 1: Local-first MVP

Goal: useful offline skipper notebook and checklist tool.

Scope:

- Vessel profile.
- Checklist engine.
- Static knowledge base.
- Trip preparation pack.
- Printable/exportable passage plan.

Success criteria:

- A skipper can prepare a weekend passage without live integrations.
- Core content is available offline.
- The app creates value before hardware integration exists.

### Phase 2: Navigation and weather planning

Goal: practical passage planning assistant.

Scope:

- GPX import/export.
- Route leg table.
- Weather briefing template.
- Risk assessment card.
- Harbour notes.

### Phase 3: Training and scenario engine

Goal: make Nautikool genuinely educational.

Scope:

- Learning modules.
- Scenario trainer.
- AIS/COLREG exercises.
- Skill-level explanations.
- Progress tracking.
