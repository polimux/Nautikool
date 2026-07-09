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

Date: 2026-07-10

Repository state reviewed:

- Repository exists and is writable.
- `ideas.md` remains the product source of truth.
- `README.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `docs/README.md`, `docs/architecture.md` and `docs/domain-model.md` exist.
- A runnable SvelteKit/TypeScript skeleton exists.
- Pure checklist domain types and state-transition logic exist under `src/lib/domain`.
- Checklist run summaries expose progress, completion eligibility, required open items and blocker messages.
- GitHub Actions CI validates install, Svelte/TypeScript checks, unit tests and production build.
- The starter content registry includes departure readiness, diesel inboard pre-start, night-arrival, heavy-weather departure and MOB immediate-action checklist templates.
- The Passage Planner slice has typed passage plan domain types, pure summary logic, tests and one realistic Turku to Pärnu H-323 sample route.
- The passage workload slice flags over-long family legs, likely daylight workload, exposed open-water legs, bailout coverage gaps and missing crew notes.
- The passage split recommendation slice turns workload blockers into concrete conservative split decisions and read-aloud briefs.
- The Harbour Notebook slice models static route-pack harbour notes, freshness, VHF/contact gaps, draft margin, night-arrival suitability and offline brief lines.
- The Harbour Route Pack slice separates committed stops from bailout/decision alternatives, computes a blocked/caution/ready status and produces a verification queue plus read-aloud cockpit brief.
- The Harbour Departure Gate slice converts the harbour route pack into day-of-departure verification requirements, usable-alternate counts, blocker/caution findings and read-aloud gate lines.
- The Vessel Profile slice has richer equipment, engine, rig, battery, tank and readiness-finding types.
- A first H-323 Elina vessel profile exists with identity data, Yanmar engine checks, Raymarine/Orca/em-trak equipment, safety equipment and explicit assumptions about unverified capacities.
- The Risk Engine slice models Baltic wind limits, stale forecasts, thunderstorms, waves, open-water exposure, fatigue, equipment gaps, night/overnight legs and restricted visibility.
- The NMEA/AIS slice has a typed network readiness model, skipper-facing PGN explanations, an H-323 Elina network profile, AIS traffic snapshot logic, prioritised watch actions, watch briefs and debriefs.
- The SRC/VHF slice has typed radio call cards for distress, urgency and safety situations linked to H-323 Elina training scenarios.
- The radio-log slice creates structured entries and a compact watch-change handover brief from H-323 Elina training and traffic-decision examples.
- The maintenance readiness slice has pure task/finding/summary logic plus an H-323 Elina pre-passage service pack.
- The spare readiness slice has pure requirement/finding/summary logic plus an H-323 Elina passage spare kit linked to maintenance tasks.
- The trip logbook slice has pure entry/summary/debrief logic plus an H-323 Elina Turku to Pärnu family-passage example.
- The pre-departure dashboard slice aggregates checklist, risk, maintenance, spares, harbour gate, NMEA/AIS and trip-log summaries into one conservative H-323 Elina preparation card.
- The departure skipper brief slice converts the dashboard into a printable/wet-hands route, weather, crew, boat, electronics and limitations brief.
- The launch packet slice now converts the printable departure brief into the final cockpit handover layer: crew roles, required berth actions, open-water reassessment, paper-pack checks and emergency reference lines.
- The landing page surfaces checklist, passage, vessel, maintenance, spares, trip logbook, pre-departure dashboard, risk, NMEA/AIS readiness, AIS traffic watch briefs, AIS debriefs and SRC/VHF radio call cards.
- The repository currently has `package.json` but no committed npm lockfile.

Decision:

- Continue the 80% implementation / 20% documentation shift.
- Add a Launch Packet slice as the next valuable improvement because the repository already has dashboard and printable skipper brief logic, but not yet a final "lines-off" cockpit handover artifact.
- Keep the change pure and static: the packet must not claim live clearance, current weather, harbour availability or traffic awareness.
- Use the H-323 Elina Turku to Pärnu family passage because crew roles, emergency references, paper backups and open-water reassessment are concrete value for the skipper, father and 15-year-old son scenario.
- Treat a no-go departure brief as a blocked launch packet; the launch packet is the last human handover before action, not a way to override blockers.

Rationale:

- The product has many strong preparation slices now; a launch packet makes them operational by turning them into a small cockpit ritual.
- A skipper with wet hands needs first action, crew read-back, emergency references and paper-pack checks more than another long planning artifact.
- The feature connects Content System, Checklist Engine, Passage Planner, Vessel Profile, Risk Engine and NMEA/AIS outcomes without creating a live-data dependency.
- This also creates a natural future UI target: a cockpit-mode card that can be printed or read aloud before casting off.

Working log:

- Added `src/lib/domain/launchPackets.ts` with typed launch packet inputs, actions, crew roles, status, cockpit checklist and briefing-line generation.
- Added `src/lib/content/launchPackets.ts` with H-323 Elina Turku to Pärnu launch packet content for 26 July 2026 planning.
- Added Vitest coverage for blocked packet behaviour, cockpit handover material, H-323 content publication and live/static limitation wording.
- Exported the launch packet domain slice from `src/lib/domain/index.ts`.
- Updated `CHANGELOG.md` with launch packet domain logic, H-323 content and test coverage.

## Feature backlog

### Core product

| ID | Feature | Description | Priority | Status |
|---|---|---|---|---|
| F-001 | Vessel profile | Store LOA, beam, draft, mast height, engine, batteries, safety equipment, electronics and owner notes. | High | Started |
| F-002 | Passage planner | Plan route legs, distances, ETAs, hazards, bailout harbours, daylight and crew notes. | High | Started |
| F-003 | Checklist engine | Configurable departure, arrival, engine, heavy-weather, night-sailing and emergency checklists. | High | Started |
| F-004 | Learning modules | Bite-sized nautical lessons for COLREGs, lights, buoys, VHF, anchoring, weather, navigation and sail trim. | High | Idea |
| F-005 | Scenario trainer | Interactive decisions for crossing traffic, squalls, harbour approaches, engine alarms and MOB. | Medium | Started |
| F-006 | Boat systems notebook | Document seacocks, fuel, engine, electrics, NMEA network, spares and known defects. | High | Started |
| F-007 | Maintenance log | Track engine hours, oil changes, filters, batteries, rig checks, extinguishers and liferaft service. | High | Started |
| F-008 | Trip logbook | Capture trip, crew, weather, sail setup, incidents, lessons learned and engine hours. | Medium | Started |
| F-009 | Harbour notebook | Store harbour notes, berth details, fees, VHF channels, fuel, groceries, sauna and approach notes. | Medium | Started |
| F-010 | Risk card | Generate green/yellow/red departure assessment from weather, route, crew and boat readiness. | High | Started |
| F-011 | Radio call cards | Generate short SRC/VHF read-aloud cards for distress, urgency, safety and routine harbour calls. | High | Started |
| F-012 | Radio log | Record radio calls, traffic decisions, training rehearsals, position sources, crew actions and follow-ups. | High | Started |
| F-013 | Spares readiness | Track passage-critical spares, quantities, stowage, failure modes and links to maintenance tasks. | High | Started |
| F-014 | Pre-departure dashboard | Aggregate checklist, risk, maintenance, spares, harbour gate, NMEA/AIS and logbook state into one conservative departure posture. | High | Started |
| F-015 | Departure skipper brief | Convert dashboard state into a printable/read-aloud route, weather, crew, boat, electronics and limitation brief. | High | Started |
| F-016 | Passage workload analysis | Convert passage legs into family-crew workload findings for distance, duration, daylight, exposure and bailout coverage. | High | Started |
| F-017 | Passage split recommendations | Turn workload blockers into named split-harbour decisions, read-aloud route alternatives and safety limitations. | High | Started |
| F-018 | Harbour route pack | Turn harbour notebook entries into committed stops, alternates, verification queues and read-aloud route-pack status. | High | Started |
| F-019 | Harbour departure gate | Convert harbour route packs into day-of-departure verification requirements, usable-alternate checks and read-aloud harbour gate status. | High | Started |
| F-020 | Harbour-aware departure dashboard | Promote harbour-gate blockers and cautions into the aggregated pre-departure dashboard status, score and first action. | High | Started |
| F-021 | Launch packet | Convert the departure brief into a final cockpit handover with crew roles, before-lines-off actions, open-water reassessment, emergency references and paper-pack checks. | High | Started |

### UX ideas

| ID | UX idea | Description | Priority | Status |
|---|---|---|---|---|
| UX-001 | Cockpit mode | High-contrast, large-button, low-distraction interface for underway use. | High | Idea |
| UX-002 | Pre-departure dashboard | One screen for weather, route risk, boat readiness, maintenance, spares, crew readiness and open checklist items. | High | Started |
| UX-003 | Traffic-light decisions | Green/yellow/red decisions with short explanation and assumptions. | High | Started |
| UX-004 | Skill-aware explanations | Beginner, competent crew, skipper and instructor explanation levels. | Medium | Idea |
| UX-005 | Quick capture | One-tap notes for defects, harbour notes, maintenance needs and log entries. | Medium | Idea |
| UX-006 | Emergency screen | MOB, mayday, DSC, position, nearest harbour and emergency checklist. | High | Idea |
| UX-007 | Boat-specific home | Home screen starts from the user's own vessel and active passage. | High | Started |
| UX-008 | Printable mode | Generate printable passage plans, checklists and emergency cards. | Medium | Started |
| UX-009 | Watch handover card | Compact read-aloud handover for AIS, weather, route and crew state. | High | Started |
| UX-010 | Scenario debrief card | Turn a drill or watch brief into what went well, what to verify and what to repeat. | High | Started |
| UX-011 | Radio call card | Present a single wet-hands radio script with vessel identity, position, risk and requested help. | High | Started |
| UX-012 | Radio log handover | Show recent radio calls, decisions, position sources and follow-ups during watch change. | High | Started |
| UX-013 | Maintenance readiness card | Show overdue, due-soon and unknown service items as skipper actions. | High | Started |
| UX-014 | Spare readiness card | Show missing, unknown and insufficient passage spares as locker-level skipper actions. | High | Started |
| UX-015 | Trip log debrief card | Show what changed, what broke, what needs follow-up and what to brief differently next time. | High | Started |
| UX-016 | Aggregated departure card | Show one conservative status, score, blockers and first action across all preparation slices. | High | Started |
| UX-017 | Printable departure brief | Show a paper-friendly skipper brief with decision, route, weather, crew, boat, electronics and limitation sections. | High | Started |
| UX-018 | Leg workload warnings | Show which passage legs exceed family crew distance, duration, daylight, exposure or bailout limits. | High | Started |
| UX-019 | Route split card | Show named conservative split options, decision points and limitation copy for difficult passage legs. | High | Started |
| UX-020 | Harbour route-pack card | Show harbour freshness, draft margin, contact gaps and night-arrival status for planned/bailout stops. | High | Started |
| UX-021 | Harbour departure gate card | Show final harbour readiness, usable alternates, missing verification topics and first harbour action before casting off. | High | Started |
| UX-022 | Harbour-aware dashboard card | Show harbour-gate blockers inside the main departure dashboard instead of requiring the skipper to inspect a separate harbour slice. | High | Started |
| UX-023 | Launch packet card | Show the final before-lines-off crew read-back, required actions, paper pack and emergency references as a cockpit-ready launch card. | High | Started |
