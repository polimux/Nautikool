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

- Start with plain, maintainable project structure.
- Keep content, vessel data, voyage planning, checklists and integrations separable.
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

Date: 2026-07-07

Repository state reviewed:

- Repository exists and is writable.
- `ideas.md` exists as product source of truth.
- `README.md` existed but only contained a title.
- No application code, package setup, tests or documentation structure exists yet.

Decision:

- Expand `README.md` into a useful public project entry point before choosing a technical stack.
- Keep `ideas.md` as the detailed backlog and stewardship log.
- Do not introduce application code yet; the repository still benefits more from clear product framing and contribution structure.

Rationale:

- A readable README improves project orientation for future users, contributors and automated stewardship runs.
- Starting with a framework before documenting product boundaries could create accidental architecture.
- Nautikool has safety-critical implications, so public-facing documentation should state the safety posture early.

## Feature backlog

### Core product

| ID | Feature | Description | Priority | Status |
|---|---|---|---|---|
| F-001 | Vessel profile | Store LOA, beam, draft, mast height, engine, batteries, safety equipment, electronics and owner notes. | High | Idea |
| F-002 | Passage planner | Plan route legs, distances, ETAs, hazards, bailout harbours, daylight and crew notes. | High | Idea |
| F-003 | Checklist engine | Configurable departure, arrival, engine, heavy-weather, night-sailing and emergency checklists. | High | Idea |
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

### Navigation ideas

| ID | Navigation feature | Description | Priority | Status |
|---|---|---|---|---|
| NAV-001 | GPX import/export | Exchange routes and tracks with chartplotters and navigation apps. | High | Idea |
| NAV-002 | Leg table | Course, distance, ETA, hazards, bailout options and notes by leg. | High | Idea |
| NAV-003 | Harbour approach cards | Compact approach notes, lights, hazards and contact details. | Medium | Idea |
| NAV-004 | Pilotage notes | User-written notes for tricky channels and approaches. | Medium | Idea |
| NAV-005 | Chart references | Link paper chart numbers, app chart areas and route notes. | Medium | Idea |
| NAV-006 | Mast-height alerts | Use stored mast height for bridge and overhead-cable warnings where data is available. | Medium | Idea |
| NAV-007 | Night passage prep | Navigation lights, watch rhythm, rest, headlamp discipline and traffic plan. | High | Idea |

### Offline ideas

| ID | Offline feature | Description | Priority | Status |
|---|---|---|---|---|
| OFF-001 | Offline knowledge base | Core lessons and emergency procedures available without internet. | High | Idea |
| OFF-002 | Offline checklists | Vessel and passage checklists cached locally. | High | Idea |
| OFF-003 | Offline route pack | Save route, harbour notes, documents and weather snapshot for a trip. | High | Idea |
| OFF-004 | Freshness labels | Show when downloaded forecasts or harbour info were last updated. | High | Idea |
| OFF-005 | Export package | Export a complete trip pack as PDF or HTML. | Medium | Idea |

### NMEA2000 ideas

| ID | NMEA2000 feature | Description | Priority | Status |
|---|---|---|---|---|
| N2K-001 | Network inventory | Document devices, PGNs, power injection, terminators and adapter cables. | High | Idea |
| N2K-002 | Data dashboard | Show GPS, COG/SOG, depth, wind, heading, battery voltage and engine data if available. | Medium | Idea |
| N2K-003 | Health check | Detect missing GPS, stale data, duplicate sources and bus power issues where possible. | Medium | Idea |
| N2K-004 | Source priority notes | Document which device provides GPS, heading, AIS, wind and depth. | High | Idea |
| N2K-005 | Simulator input | Provide mock NMEA2000 data for development and tests. | High | Idea |

### AIS ideas

| ID | AIS feature | Description | Priority | Status |
|---|---|---|---|---|
| AIS-001 | AIS target list | Show targets sorted by CPA/TCPA, range and relevance. | Medium | Idea |
| AIS-002 | AIS learning mode | Explain CPA, TCPA, MMSI, COG, SOG and class A/B. | High | Idea |
| AIS-003 | Collision scenario trainer | Use simulated AIS traffic for crossing, overtaking and head-on exercises. | High | Idea |
| AIS-004 | Radio call helper | Create VHF call templates from AIS target name, bearing and situation. | Medium | Idea |
| AIS-005 | Stale target warning | Mark AIS targets as stale when updates stop. | High | Idea |
| AIS-006 | Own-ship checklist | MMSI, callsign, GPS fix, antenna/splitter status and transmit/receive state. | High | Idea |

### Weather ideas

| ID | Weather feature | Description | Priority | Status |
|---|---|---|---|---|
| WTH-001 | Forecast comparison | Compare wind, gusts, waves, rain and pressure across providers/models. | High | Idea |
| WTH-002 | Route weather table | Weather by leg and time window. | High | Idea |
| WTH-003 | Go/no-go logic | Conservative rule-based departure support by boat, route, crew and exposure. | High | Idea |
| WTH-004 | Gust risk explainer | Explain gust factor, squalls, lee shore and reefing decisions. | Medium | Idea |
| WTH-005 | Weather briefing generator | Produce a skipper briefing before departure. | High | Idea |
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

## Roadmap

### Phase 0: Repository foundation

Goal: make the repository understandable and ready for implementation.

Tasks:

- [x] Add `ideas.md`.
- [x] Add `README.md` with product pitch, target user and planned modules.
- [ ] Add `CHANGELOG.md`.
- [ ] Add `/docs` structure.
- [ ] Decide initial tech stack.
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

Success criteria:

- A user can create a route plan with hazards, weather, bailout options and assumptions.

### Phase 3: Training and scenario engine

Goal: make Nautikool genuinely educational.

Scope:

- Learning modules.
- Scenario trainer.
- AIS/COLREG exercises.
- Skill-level explanations.
- Progress tracking.

Success criteria:

- A user can learn and rehearse realistic sailing decisions.

### Phase 4: Boat data and integrations

Goal: connect Nautikool to real or simulated onboard context.

Scope:

- NMEA2000 adapter concept.
- AIS target ingest concept.
- GPS/sensor dashboard.
- Simulator for development and tests.

Success criteria:

- Nautikool can show simulated boat data and explain it before depending on hardware.

### Phase 5: Cockpit companion

Goal: make Nautikool useful underway without becoming distracting.

Scope:

- Cockpit mode.
- Emergency screen.
- AIS relevance filtering.
- Offline route pack.
- Read-aloud briefing concept.

Success criteria:

- The app supports quick, conservative decisions under real cockpit constraints.

## Initial technical direction

No final stack decision yet.

Current bias:

- App model: Progressive Web App first.
- Frontend candidates: SvelteKit or React.
- Storage: local-first, likely IndexedDB-backed in browser; SQLite later if native wrapper is chosen.
- Content: Markdown/MDX for lessons, checklists and reference material.
- Testing: unit tests for pure logic, parser tests for GPX/AIS/NMEA-like data, scenario tests for risk cards.
- Integrations: simulators and file import/export before live hardware integration.

Architecture concept:

```text
content + vessel profile + voyage plan + sensor context + decision support = Nautikool
```

## Test strategy

### MVP tests

- Vessel profile can be created, edited, saved and exported.
- Checklist state persists offline.
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

## Changelog

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

Changed:

- Marked the README foundation task as complete.
- Updated the current repository assessment to reflect that the README is now useful and the next gap is repository structure/changelog.

Removed:

- Temporary `test.txt` write-access probe from the repository.

## Working log

### 2026-07-07 - Initial product backlog

Role mix used: project manager, developer, tester, user and product manager.

Repository review:

- Repository was writable.
- Only a temporary write-access test file was present.
- No product documentation or code foundation existed.

Action taken:

- Removed the temporary test file.
- Added this `ideas.md` as the initial source of truth.

Testing/reasoning:

- Confirmed repository permissions include push/write access through successful file operations.
- No application tests were run because no application code exists yet.
- Product risk was assessed before implementation: safety, stale data, offline use, unit conversion and cockpit usability are the dominant early concerns.

Next best action:

- Add `README.md` with a concise product pitch, target user, planned modules, repository status and development setup placeholder.

Commit target:

- `docs: add Nautikool product backlog and working log`

### 2026-07-07 - README foundation

Role mix used: project manager, developer, tester, user and product manager.

Repository review:

- `ideas.md` exists and gives the project a backlog and decision log.
- `README.md` existed but only contained the project title.
- No application code exists yet, so repository usability is still mostly documentation-driven.

Decision:

- Expand `README.md` now instead of starting application code.

Action taken:

- Replaced the one-line README with a structured project overview.
- Added target user, product modules, repository status, development direction, safety posture and roadmap snapshot.
- Updated this file to record the decision, rationale, changelog and next best action.

Testing/reasoning:

- No application tests were run because there is no application code yet.
- Documentation was checked for consistency with the product thesis, roadmap and safety posture.
- From a user and product-manager perspective, the repository is now easier to understand before technical implementation starts.

Next best action:

- Add `CHANGELOG.md` and a minimal `/docs` structure so project history, decisions and future domain notes are easier to navigate.

Commit target:

- `docs: expand README project overview`
- `docs: log README foundation step`

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
