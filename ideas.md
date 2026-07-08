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
- `ideas.md` exists as product source of truth.
- `README.md` exists as a useful public project entry point.
- `CHANGELOG.md` exists as the project history file.
- `docs/README.md` exists as the documentation index.
- `docs/architecture.md` records the initial architecture decision.
- `docs/domain-model.md` defines the first implementation-facing domain concepts.
- A first SvelteKit/TypeScript skeleton exists.
- Pure checklist domain types and state-transition logic exist under `src/lib/domain`.
- Vitest tests cover the first checklist state semantics.
- GitHub Actions CI now validates install, Svelte/TypeScript checks, unit tests and production build.

Decision:

- Add CI before adding more product surface.
- Use the validation path `npm install`, `npm run check`, `npm test` and `npm run build` on pushes and pull requests to `main`.
- Keep the next product feature focused on checklist template loading from Markdown/frontmatter once CI is verified.

Rationale:

- The previous next best action was to run or stabilize the test/build path before adding Markdown checklist template loading.
- CI turns future changes from trust-based commits into repeatable validation.
- For a safety-oriented sailing tool, type checks, tests and production build must fail early before behaviour becomes complex.

## Feature backlog

### Core product

| ID | Feature | Description | Priority | Status |
|---|---|---|---|---|
| F-001 | Vessel profile | Store LOA, beam, draft, mast height, engine, batteries, safety equipment, electronics and owner notes. | High | Idea |
| F-002 | Passage planner | Plan route legs, distances, ETAs, hazards, bailout harbours, daylight and crew notes. | High | Idea |
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
| NAV-002 | Leg table | Course, distance, ETA, hazards, bailout options and notes by leg. | High | Idea |
| NAV-007 | Night passage prep | Navigation lights, watch rhythm, rest, headlamp discipline and traffic plan. | High | Idea |
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
- [ ] Define contribution and decision-log format.

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

Goal: connect Nautikool to real or simulated onboard context.

Scope:

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
- Integrations: simulators and file import/export before live hardware.

See `docs/architecture.md` for the current architecture decision.
See `docs/domain-model.md` for the first implementation-facing domain model.

## Test strategy

### MVP tests

- Vessel profile can be created, edited, saved and exported.
- Checklist state persists offline.
- Checklist state distinguishes clean completion, warned completion and incomplete state.
- Passage plan can be saved and reloaded.
- ETA calculations handle time zones correctly.
- Unit conversion is tested for nautical miles, knots, metres and hours.

### Scenario tests

- Turku to Hanko coastal route preparation.
- Hanko to Tallinn open-water leg assessment.
- Night arrival checklist.
- AIS crossing target with decreasing CPA.
- Forecast becomes stale while offline.
- Engine issue during departure.

### Safety tests

- No safety recommendation is displayed without assumptions.
- Missing critical data does not produce silent green.
- Red/no-go states are visually prominent.
- Stale weather is impossible to overlook.
- Emergency flow remains accessible from anywhere.

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

Changed:

- Marked the Phase 0 initial tech stack decision as complete.
- Marked the first domain model as complete.
- Marked the first runnable skeleton and first domain tests as complete.
- Marked CI validation as complete.
- Updated current repository assessment and next best action.
- Updated `README.md` with build and CI validation details.

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

### 2026-07-08 - CI validation foundation

Role mix used: project manager, developer, tester, user and product manager.

Repository review:

- The repository had a SvelteKit/TypeScript skeleton, domain logic and Vitest tests.
- `package.json` exposed `npm run check`, `npm test` and `npm run build`, but no automated validation workflow existed.
- README still listed production build verification in CI as not implemented.

Decision:

- Add a GitHub Actions workflow now, before adding Markdown/frontmatter checklist loading.
- Validate dependency installation, Svelte/TypeScript checks, unit tests and production build on push and pull request to `main`.

Action taken:

- Added `.github/workflows/ci.yml`.
- Updated `README.md` to describe CI and the build command.
- Updated `CHANGELOG.md` and this file.

Testing/reasoning:

- The workflow is designed to execute the same validation path a developer would run locally.
- From a tester perspective, this prevents unchecked safety-domain changes from reaching `main` unnoticed.
- From a developer perspective, CI is now in place before parsers, content loading and storage increase complexity.
- From a user/product perspective, this supports trust: Nautikool should not grow features faster than its validation discipline.

Next best action:

- Inspect the first CI run. If it fails, fix the dependency/configuration issue. If it passes, add checklist template loading from Markdown/frontmatter with tests.

Commit targets:

- `ci: add Node.js validation workflow`
- `docs: record CI workflow addition`
- `docs: update README for CI validation`
- `docs: log CI validation step`

### 2026-07-08 - First runnable skeleton and checklist tests

Role mix used: project manager, developer, tester, user and product manager.

Repository review:

- `ideas.md`, `README.md`, `CHANGELOG.md`, `docs/README.md`, `docs/architecture.md` and `docs/domain-model.md` were present.
- `docs/domain-model.md` explicitly identified a minimal SvelteKit/TypeScript skeleton with checklist state-transition tests as the next valuable improvement.
- No `package.json`, application code or automated tests existed before this run.

Decision:

- Add the first runnable SvelteKit/TypeScript foundation.
- Implement only pure checklist state logic and tests as the first application slice.
- Do not add persistence, UI workflows, Markdown loading, offline caching or integrations yet.

Action taken:

- Added `package.json`, TypeScript, SvelteKit, Vite/Vitest config and `.gitignore`.
- Added `src/app.html` and `src/routes/+page.svelte` with a minimal landing page and demo checklist summary.
- Added `src/lib/domain/types.ts`, `src/lib/domain/checklists.ts`, `src/lib/domain/index.ts` and `src/lib/domain/checklists.test.ts`.
- Updated `README.md`, `CHANGELOG.md` and this file.

Testing/reasoning:

- Tests were added but not executed in this connector run because dependencies are not installed in the repository environment.
- The test suite is designed to run with `npm install` followed by `npm test`.
- From a tester perspective, the key safety assertion is that skipped required checklist items produce `complete-with-warnings`, not `complete`.
- From a developer perspective, the domain functions are pure and can be tested without browser APIs, Svelte components or storage.
- From a product and user perspective, this is the smallest implementation that starts turning Nautikool into a usable checklist product while keeping safety semantics visible.

Next best action:

- Run the new test suite in a local/CI environment, fix any dependency or configuration issues, then add checklist template loading from Markdown/frontmatter.

Commit targets:

- `feat: add initial SvelteKit TypeScript skeleton`
- `feat: add initial domain types`
- `feat: add checklist state logic`
- `test: cover checklist state transitions`
- `docs: update README for runnable skeleton`
- `docs: log first runnable skeleton`
- `docs: log first runnable skeleton decision`

### Earlier working log summary

- 2026-07-08: Added `docs/domain-model.md` with implementation-facing domain model and acceptance criteria.
- 2026-07-08: Added `docs/architecture.md` with PWA-first SvelteKit/TypeScript architecture decision.
- 2026-07-07: Added `CHANGELOG.md` and `docs/README.md`.
- 2026-07-07: Expanded `README.md` from a title into a structured project overview.
- 2026-07-07: Removed temporary write-access test file and added the initial `ideas.md`.

## Repository stewardship protocol

At each review:

1. Inspect the current repository state.
2. Identify the next highest-value improvement.
3. Prefer small, coherent commits.
4. Update this file with the decision, progress, rationale, changelog and next best action.
5. Commit only when the repository is improved.
6. Avoid noisy changes.

Decision priority order:

1. Make the project understandable.
2. Make it runnable.
3. Make it useful offline.
4. Make it testable.
5. Make it safe and conservative.
6. Make it delightful.
7. Add integrations only after the core is solid.
