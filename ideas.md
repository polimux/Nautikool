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

Date: 2026-07-08

Repository state reviewed:

- Repository exists and is writable.
- `ideas.md` remains the product source of truth.
- `README.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `docs/README.md`, `docs/architecture.md` and `docs/domain-model.md` exist.
- A runnable SvelteKit/TypeScript skeleton exists.
- Pure checklist domain types and state-transition logic exist under `src/lib/domain`.
- Checklist run summaries now expose progress, completion eligibility, required open items and blocker messages.
- Vitest tests cover checklist state semantics, blocker/progress semantics and starter checklist content.
- GitHub Actions CI validates install, Svelte/TypeScript checks, unit tests and production build.
- The starter content registry now includes departure readiness, diesel inboard pre-start, night-arrival, heavy-weather departure and MOB immediate-action checklist templates.
- The landing page surfaces the checklist registry and readiness metrics rather than maintaining a separate hard-coded template list.
- The Passage Planner slice has typed passage plan domain types, pure summary logic, tests and one realistic Turku to Pärnu H-323 sample route.
- The repository currently has `package.json` but no committed npm lockfile.

Decision:

- Continue the 80% implementation / 20% documentation shift.
- Move the Checklist Engine from simple state transitions toward readiness evaluation by adding blocker and progress semantics.
- Add heavy-weather departure and MOB immediate-actions templates because they are high-value safety workflows and provide real product content in the same increment.
- Keep every commit content-bearing: domain logic, tests and UI all point at real user-facing sailing content.

Rationale:

- The current content registry was useful, but the product still needed a stronger distinction between "some items clicked" and "the skipper can complete this workflow".
- Required open items should become explicit blockers before a UI can safely show readiness.
- Heavy weather and MOB are practical, high-risk scenarios where conservative checklist content creates immediate value.
- Progress and blockers are pure TypeScript logic and therefore testable without UI, storage or hardware integrations.

## Feature backlog

### Core product

| ID | Feature | Description | Priority | Status |
|---|---|---|---|---|
| F-001 | Vessel profile | Store LOA, beam, draft, mast height, engine, batteries, safety equipment, electronics and owner notes. | High | Idea |
| F-002 | Passage planner | Plan route legs, distances, ETAs, hazards, bailout harbours, daylight and crew notes. | High | Started |
| F-003 | Checklist engine | Configurable departure, arrival, engine, heavy-weather, night-sailing and emergency checklists. | High | Started |
| F-004 | Learning modules | Bite-sized nautical lessons for COLREGs, lights, buoys, VHF, anchoring, weather, navigation and sail trim. | High | Idea |
| F-005 | Scenario trainer | Interactive decisions for crossing traffic, squalls, harbour approaches, engine alarms and MOB. | Medium | Idea |
| F-006 | Boat systems notebook | Document seacocks, fuel, engine, electrics, NMEA network, spares and known defects. | High | Idea |
| F-007 | Maintenance log | Track engine hours, oil changes, filters, batteries, rig checks, extinguishers and liferaft service. | Medium | Idea |
| F-008 | Trip logbook | Capture trip, crew, weather, sail setup, incidents, lessons learned and engine hours. | Medium | Idea |
| F-009 | Harbour notebook | Store harbour notes, berth details, fees, VHF channels, fuel, groceries, sauna and approach notes. | Medium | Idea |
| F-010 | Risk card | Generate green/yellow/red departure assessment from weather, route, crew and boat readiness. | High | Idea |

### UX ideas

| ID | UX idea | Description | Priority | Status |
|---|---|---|---|---|
| UX-001 | Cockpit mode | High-contrast, large-button, low-distraction interface for underway use. | High | Idea |
| UX-002 | Pre-departure dashboard | One screen for weather, route risk, boat readiness, crew readiness and open checklist items. | High | Idea |
| UX-003 | Traffic-light decisions | Green/yellow/red decisions with short explanation and assumptions. | High | Idea |
| UX-004 | Skill-aware explanations | Beginner, competent crew, skipper and instructor explanation levels. | Medium | Idea |
| UX-005 | Quick capture | One-tap notes for defects, harbour notes, maintenance needs and log entries. | Medium | Idea |
| UX-006 | Emergency screen | MOB, mayday, DSC, position, nearest harbour and emergency checklist. | High | Idea |
| UX-007 | Boat-specific home | Home screen starts from the user's own vessel and active passage. | High | Idea |
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
| WTH-003 | Go/no-go logic | Conservative rule-based departure support by boat, route, crew and exposure. | High | Idea |
| WTH-006 | Weather freshness warning | Make stale forecasts impossible to overlook. | High | Idea |

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

### Phase 4: Boat data and integrations

- NMEA2000 adapter concept.
- AIS target ingest concept.
- GPS/sensor dashboard.
- Simulator for development and tests.

### Phase 5: Cockpit companion

Goal: make Nautikool useful underway without becoming distracting.

Scope:

- Cockpit mode.
- Emergency screen.
- AIS relevance filtering.
- Offline route pack.
- Read-aloud briefing concept.

## Initial technical direction

Initial stack decision:

- App model: Progressive Web App first.
- Language: TypeScript.
- Frontend framework: SvelteKit.
- Storage: local-first IndexedDB behind a storage/repository abstraction.
- Content: Markdown for lessons, checklists and reference material, with metadata/frontmatter.
- Testing: Vitest for pure logic first; Playwright later for workflow coverage.
- CI: GitHub Actions validates install, Svelte/TypeScript checks, unit tests and production build.
- Contributions: `CONTRIBUTING.md` defines change shape, validation path, commit convention and decision-log format.
- Integrations: simulators and file import/export before live hardware.

See `docs/architecture.md` for the current architecture decision.
See `docs/domain-model.md` for the first implementation-facing domain model.
See `CONTRIBUTING.md` for contribution and decision-log conventions.

## Test strategy

### MVP tests

- Vessel profile can be created, edited, saved and exported.
- Checklist state persists offline.
- Checklist state distinguishes clean completion, warned completion and incomplete state.
- Checklist state exposes required-open blockers and completion eligibility.
- Passage plan can be saved and reloaded.
- ETA calculations handle time zones correctly.
- Unit conversion is tested for nautical miles, knots, metres and hours.

### Scenario tests

- Turku to Hanko coastal route preparation.
- Hanko to Tallinn open-water leg assessment.
- Turku to Pärnu family passage with one long open-water leg and conservative bailout notes.
- Night arrival checklist.
- Heavy-weather departure go/no-go checklist.
- MOB immediate actions checklist.
- AIS crossing target with decreasing CPA.
- Forecast becomes stale while offline.
- Engine issue during departure.

### Safety tests

- No safety recommendation is displayed without assumptions.
- Missing critical data does not produce silent green.
- Red/no-go states are visually prominent.
- Stale weather is impossible to overlook.
- Emergency flow remains accessible from anywhere.
- Open required checklist items remain visible as blockers.

## Product decisions

| Date | Decision | Rationale |
|---|---|---|
| 2026-07-07 | Define Nautikool as a local-first sailing learning, planning and decision-support tool. | This gives the product a clear identity beyond generic nautical notes. |
| 2026-07-07 | Start with product documentation before choosing a framework. | The repository needs direction before architecture. |
| 2026-07-07 | Prioritize offline, checklists, vessel profile and safety workflows first. | These create immediate value without requiring live integrations. |
| 2026-07-07 | Treat NMEA2000, AIS and weather as later adapters around a stable core. | Hardware and external data can be unreliable; the core product must remain useful without them. |
| 2026-07-07 | Expand `README.md` before adding code. | A clear public entry point improves repository readability and makes the next implementation choices easier to evaluate. |
| 2026-07-07 | Add `CHANGELOG.md` and `docs/README.md` before application code. | The project needs a clean place for history and deeper documentation before technical decisions accumulate. |
| 2026-07-08 | Choose a PWA-first SvelteKit and TypeScript architecture with IndexedDB abstraction. | This supports offline-first use and rapid iteration while keeping future native, sync and hardware choices open. |
| 2026-07-08 | Define the first domain model before code generation. | Vessel, checklist, passage, risk, assumption and freshness concepts need stable names before UI or persistence choices harden. |
| 2026-07-08 | Add the first runnable SvelteKit/TypeScript skeleton with pure checklist domain tests. | This turns the project from documentation-only into a testable product foundation while preserving small safe increments. |
| 2026-07-08 | Add GitHub Actions CI before adding checklist template loading. | Automated validation reduces regression risk before the app gains more content and parsing logic. |
| 2026-07-08 | Remove npm caching from CI until a lockfile exists. | This avoids lockfile-related CI setup failure while keeping the validation workflow useful. |
| 2026-07-08 | Add a contribution and decision-log guide before expanding product features. | The project now has enough moving parts that change shape, validation and decision records should be explicit before parser, storage or UI complexity grows. |
| 2026-07-08 | Add typed starter checklist content before Markdown/frontmatter loading. | Immediate user-facing content is more valuable than a parser abstraction before the content model stabilizes. |
| 2026-07-08 | Add night-arrival checklist content as the next Checklist Engine slice. | Night approaches combine pilotage, fatigue, lighting, traffic and abort planning; this is a high-value Baltic cruising scenario and satisfies the rule that every commit includes product-relevant content. |
| 2026-07-08 | Add a typed Turku to Pärnu passage plan before GPX import/export. | A real route sample turns Passage Planner into executable product content and creates a test target for distance, ETA, hazards, bailout harbours and crew notes. |
| 2026-07-08 | Add checklist progress and blocker semantics before persistence. | A safe checklist UI needs to separate progress, completion eligibility, required-open blockers and warned completion before saved runs or dashboard logic are added. |

## Changelog

### 2026-07-08

Added:

- Added `docs/architecture.md` with the initial architecture decision.
- Added `docs/domain-model.md` with first domain entities and acceptance criteria.
- Added initial SvelteKit and TypeScript project setup.
- Added pure checklist domain types and state-transition functions.
- Added Vitest tests for checklist run creation, item transitions, skipped required items, completion and unknown item handling.
- Added a minimal SvelteKit landing page that demonstrates the first checklist domain slice.
- Added GitHub Actions CI workflow for install, Svelte/TypeScript checks, unit tests and production build.
- Added `CONTRIBUTING.md` with contribution principles, validation path, commit message convention and decision-log format.
- Added typed starter checklist content for Baltic coastal departure readiness and diesel inboard pre-start checks.
- Added typed night-arrival checklist content for Baltic guest harbour approaches.
- Added Vitest coverage for starter checklist identifiers, categories, assumptions, skipped-item warnings and night-arrival pilotage content.
- Added passage plan domain types and pure passage summary logic.
- Added typed Turku to Pärnu family H-323 passage plan content with legs, distances, hazards, bailout harbours and crew notes.
- Added Vitest coverage for passage calculations and starter passage content.
- Added checklist summary metrics for completion percentage, completion eligibility, required-open blockers and warned completion.
- Added heavy-weather departure and MOB immediate-actions checklist content.
- Added Vitest coverage for checklist blocker/progress semantics and new safety content.

Changed:

- Marked the Phase 0 initial tech stack decision as complete.
- Marked the first domain model as complete.
- Marked the first runnable skeleton and first domain tests as complete.
- Marked CI validation as complete.
- Marked contribution and decision-log format as complete.
- Marked night passage prep as started.
- Marked Passage Planner and leg table as started.
- Removed npm caching from CI until a lockfile exists.
- Updated current repository assessment and next best action.
- Updated `README.md` with build and CI validation details.
- Updated `docs/README.md` to link the contribution guide.
- Updated landing page to show checklist templates from the shared content registry.
- Updated landing page to show the first passage plan summary and leg cards.
- Updated landing page to show readiness metrics and expanded safety checklist content.

### 2026-07-07

Added:

- Initial product thesis.
- Role-based product principles.
- Feature backlog for core product, UX, navigation, offline, NMEA2000, AIS and weather.
- Expected bug classes and prevention ideas.
- Multi-phase roadmap.
- Initial technical direction.
- Test strategy.
- Product decisions.
- Working log.
- Expanded `README.md` with product pitch, target user, modules, repository status, development direction, safety posture and roadmap snapshot.
- Added `CHANGELOG.md` for notable project changes.
- Added `docs/README.md` as the documentation index.

Removed:

- Temporary `test.txt` write-access probe from the repository.

## Working log

### 2026-07-08 - Checklist engine readiness and emergency content slice

Role mix used: project manager, developer, tester, user and product manager.

Repository review:

- The repository had working CI, typed checklist logic, starter checklist templates, passage-planning logic and a realistic Turku to Pärnu sample route.
- The checklist engine could create runs, set item states and distinguish incomplete, complete and complete-with-warnings.
- The product still needed a clearer readiness signal for UI and dashboard use: open required items should become explicit blockers, not just part of an item count.
- The content registry was missing heavy-weather departure and MOB emergency content, both high-value for Baltic family and short-handed sailing.

Decision:

- Add completion percentage, required-open item count, completion eligibility and blocker messages to checklist summaries.
- Keep skipped required items as warned completion, but keep open required items as hard blockers.
- Add two new content-bearing templates: defensive heavy-weather departure go/no-go and MOB immediate actions underway.
- Surface the new readiness metrics and expanded template registry on the landing page.

Action taken:

- Extended `ChecklistRunSummary` with `requiredOpenItems`, `completionPercent`, `canComplete` and `blockers`.
- Updated `summarizeChecklistRun` and `completeChecklistRun` to use blocker/completion semantics.
- Added heavy-weather departure and MOB immediate-actions checklist templates to `src/lib/content/checklistTemplates.ts`.
- Added tests for progress, blockers, heavy-weather content and MOB emergency content.
- Updated the landing page, `CHANGELOG.md` and this file.

Testing/reasoning:

- From a tester perspective, the new tests guard against false readiness by checking required-open blockers and completion eligibility.
- From a developer perspective, readiness remains pure domain logic and independent from UI state.
- From a user perspective, the app now contains more realistic high-risk workflows: heavy-weather departure and MOB.
- From a product manager perspective, this is aligned with the 80/20 rule: mostly domain logic, product content, tests and a small UI update.

Next best action:

- Add a Vessel Profile content slice for H-323 / Elina so checklist and passage content can become vessel-aware, or add threshold logic that flags passage legs above daily-distance and daylight limits.

Commit targets:

- `feat: expand checklist run summary metrics`
- `feat: add checklist completion blockers`
- `feat: add emergency checklist content`
- `test: cover checklist blockers and progress`
- `test: cover emergency checklist content`
- `feat: surface checklist readiness metrics`
- `docs: record checklist engine content slice`
- `docs: log checklist engine content decision`

### 2026-07-08 - Passage planner route content slice

Role mix used: project manager, developer, tester, user and product manager.

Repository review:

- The repository had a working CI foundation, typed checklist logic and starter checklist templates.
- The product focus explicitly included Passage Planner, but the implementation still had no executable passage plan model or route content.
- The user rule requires each commit to contain product-relevant content, not just infrastructure.

Decision:

- Add a first Passage Planner slice with typed route legs, hazards, bailout harbours, assumptions and summary metrics.
- Use the Turku to Pärnu family H-323 passage as the first realistic sample plan.
- Add pure summary logic and tests before adding persistence, GPX import/export or richer UI workflows.
- Surface the route summary and leg cards on the landing page so the product content is visible immediately.

Action taken:

- Added passage plan domain types to `src/lib/domain/types.ts`.
- Added `src/lib/domain/passages.ts` with leg-hour and passage-summary functions.
- Added `src/lib/content/passagePlans.ts` with a Turku to Pärnu family H-323 route: Turku to Nauvo, Nauvo to Hanko, Hanko to Haapsalu and Haapsalu to Pärnu.
- Added tests for ETA calculations, invalid distance/speed guards, route summary metrics and content semantics.
- Updated the landing page, `CHANGELOG.md` and this file.

Testing/reasoning:

- From a tester perspective, the new tests check numeric summary behaviour and prevent the sample route from losing assumptions, bailout harbours or crew notes.
- From a developer perspective, the calculations remain pure and independent from Svelte UI state.
- From a user perspective, the content is a real family Baltic passage scenario rather than placeholder data.
- From a product manager perspective, this is a high-value 80/20 increment: mostly domain logic, user-facing content, tests and a small UI surface.

Next best action:

- Add conservative threshold logic that flags route legs above a user-defined daily-distance limit, or add a Vessel Profile content slice for the H-323 / Elina so passage plans can become vessel-aware.

Commit targets:

- `feat: add passage plan domain types`
- `feat: add passage plan summary logic`
- `feat: add Baltic passage sample content`
- `test: cover passage plan summary logic`
- `test: cover starter passage plan content`
- `feat: surface starter passage plan on landing page`
- `docs: record passage planner content slice`
- `docs: log passage planner content decision`

### 2026-07-08 - Night arrival checklist slice

Role mix used: project manager, developer, tester, user and product manager.

Repository review:

- The repository had a working CI foundation, typed domain model and first checklist templates.
- The most valuable next small increment was another realistic checklist workflow rather than more generic documentation.

Decision:

- Add night-arrival checklist content as a conservative Baltic guest-harbour workflow.
- Add tests for category lookup, identifiers, safety assumptions and required pilotage content.
- Make the shared template registry visible from the landing page.

Action taken:

- Added `nightArrivalTemplate` to the checklist content registry.
- Expanded checklist content tests.
- Updated the landing page, `CHANGELOG.md` and this file.

Testing/reasoning:

- Night arrival is a high-risk but common coastal cruising situation.
- The template forces approach brief, light discipline, traffic/VHF and bailout thinking.
- The increment contains product-relevant content, tests and a visible UI slice.
