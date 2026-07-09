# Changelog

All notable project changes should be recorded here.

This project uses a simple human-readable changelog while the product and architecture are still being shaped. Once releases exist, this file can move toward a more formal Keep a Changelog style with version numbers.

## Unreleased

### Added

- `ideas.md` as the product backlog, roadmap, decision log and working log.
- Expanded `README.md` as the public project entry point.
- `CHANGELOG.md` to separate project history from product discovery notes.
- `docs/README.md` as the documentation index for future architecture, domain model, safety and content notes.
- `docs/architecture.md` with the initial architecture decision: PWA, TypeScript, SvelteKit, IndexedDB abstraction, Markdown content and test-first domain logic.
- `docs/domain-model.md` with the first domain entities for vessel profile, checklist templates, checklist runs, passage plans, weather snapshots, risk assessments, assumptions, data freshness and trip packs.
- Initial SvelteKit and TypeScript project skeleton.
- Pure checklist domain types and state-transition logic under `src/lib/domain`.
- Vitest tests for checklist creation, item transitions, skipped required items, completion and unknown item handling.
- A minimal landing page that demonstrates the first checklist domain slice.
- GitHub Actions CI workflow for install, Svelte/TypeScript checks, unit tests and production build.
- `CONTRIBUTING.md` with contribution principles, validation path, commit message convention and decision-log format.
- Typed starter checklist content for Baltic coastal departure readiness and diesel inboard pre-start checks.
- Vitest coverage for starter checklist content identifiers, categories, assumptions and skipped-item warnings.
- Typed night-arrival checklist content for Baltic guest harbour approaches.
- Vitest coverage for night-arrival checklist category lookup, identifier lookup, high-impact assumptions and required pilotage items.
- Passage plan domain types for legs, hazards, bailout harbours, assumptions and summary data.
- Pure passage-planning summary logic for leg hours, total distance, planned hours, open-water legs, high-severity hazards, daylight-critical legs and bailout counts.
- Typed starter passage content for a Turku to Pärnu family H-323 route with leg distances, hazards, bailout harbours and crew notes.
- Vitest coverage for passage summary calculations and starter passage content semantics.
- Checklist run summary metrics for required open items, completion percentage, completion eligibility and blocker messages.
- Typed heavy-weather departure and MOB immediate-actions checklist content.
- Vitest coverage for checklist blockers, progress, heavy-weather content and MOB emergency content.
- Extended vessel profile domain types for rig, engine, tanks, batteries, equipment, assumptions and readiness findings.
- Pure vessel readiness logic for equipment lookup, missing critical equipment and profile validation.
- Typed H-323 Elina reference vessel profile with Yanmar engine checks, Raymarine/Orca/em-trak navigation stack, safety equipment and explicit unverified-capacity assumptions.
- Vitest coverage for vessel profile content, installed equipment, safety assumptions and readiness blockers.
- Risk assessment domain types for weather, crew, vessel, passage and traffic-light risk findings.
- Pure conservative risk engine for Baltic wind limits, stale forecasts, thunderstorms, wave height, open-water legs, crew fatigue and missing critical equipment.
- Typed Turku to Pärnu H-323 family passage risk scenario with moderate Baltic weather assumptions.
- Vitest coverage for yellow planning assessments, red no-go wind limits, stale forecasts, missing critical equipment and linked H-323 passage content.
- Night-leg and restricted-visibility risk rules for exposed or likely overnight Baltic passage planning.
- Typed Turku to Pärnu H-323 night crossing rehearsal scenario with watch-plan, visibility and static-scenario assumptions.
- Vitest coverage for night-experience cautions, limited-visibility cautions and red no-go restricted visibility.
- NMEA/AIS network readiness domain model for devices, protocols, PGN capabilities, backbone findings and summary metrics.
- Skipper-facing PGN reference content for GNSS position, AIS Class A/B reports and COG/SOG updates.
- Typed H-323 Elina SeaTalkNG/NMEA2000 network profile covering em-trak B953, Ray90, Axiom+ 9 and Orca Core 2 integration assumptions.
- Vitest coverage for NMEA network summaries, power-injection warnings, terminator blockers, missing GNSS blockers and skipper-facing AIS explanations.
- AIS traffic snapshot domain logic for stale targets, close CPA, fast-closing targets and close targets without CPA/TCPA.
- Typed H-323 Elina Hanko approach AIS traffic drill with ferry, small-craft and stale-target examples.
- Vitest coverage for AIS target summary counts, stale-target warnings, fast-closing close-CPA blockers and missing CPA/TCPA warnings.

### Changed

- The repository has moved from documentation-only foundation to the first runnable application foundation.
- The initial technical direction is now documented as an architecture decision rather than only a backlog bias.
- The documentation index now lists the domain model as an active document instead of a planned document.
- `README.md` now includes concrete development commands for install, dev server, type checks and tests.
- Repository validation is now automated for future pushes and pull requests.
- CI no longer enables npm dependency caching before a package lockfile exists.
- `docs/README.md` now links the contribution guide.
- Landing page now surfaces starter checklist templates as product content instead of only a synthetic demo checklist.
- Landing page now reads checklist template cards from the shared content registry.
- Landing page now surfaces the first passage planner content slice and summary metrics.
- Landing page now surfaces checklist readiness metrics and the expanded safety/emergency template registry.
- Landing page now surfaces the first vessel profile and vessel readiness summary.
- Landing page now surfaces a first traffic-light risk card for the Turku to Pärnu family passage.
- Domain barrel exports now include passage, vessel and risk modules.
- Landing page now surfaces multiple risk scenarios instead of a single hard-coded risk assessment.
- Landing page now surfaces the first NMEA/AIS network readiness card and device-level PGN explanations.
- Domain barrel exports now include the NMEA/AIS readiness module.
- Landing page now surfaces the static AIS traffic drill and target-level training notes.

### Removed

- Temporary `test.txt` write-access probe was removed after connector permissions were verified.
