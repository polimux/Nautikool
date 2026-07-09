# Changelog

All notable project changes should be recorded here.

This project uses a simple human-readable changelog while the product and architecture are still being shaped. Once releases exist, this file can move toward a more formal Keep a Changelog style with version numbers.

## Unreleased

### Added

- Pre-departure dashboard domain logic that aggregates checklist, risk, maintenance, spares, NMEA/AIS and trip-log summaries into one conservative go/caution/no-go preparation card.
- Typed H-323 Elina Turku to Pärnu pre-departure dashboard content with explicit static-scenario assumptions and read-aloud cockpit brief lines.
- Vitest coverage for dashboard green-only-when-clean behaviour, required-checklist blockers, cross-slice blocker aggregation and H-323 dashboard publication.
- Trip logbook domain logic for structured passage entries, engine-hour deltas, missing-position prompts, follow-ups and compact debrief lines.
- Typed H-323 Elina Turku to Pärnu family-passage trip log content covering departure brief, archipelago motor-sail fatigue, diesel-filter spare follow-up and Hanko arrival lesson.
- Vitest coverage for trip-log summaries, missing operational positions, debrief output and H-323 trip-log content publication.
- Spare readiness domain logic for vessel-specific spare requirements, critical/recommended priorities, missing/unknown/insufficient findings and departure summaries.
- Typed H-323 Elina spare readiness content covering raw-water impeller kit, primary diesel filter, alternator belt, blade fuses, handheld VHF backup, softwood plugs, rig consumables and SeaTalkNG/NMEA2000 troubleshooting parts.
- Vitest coverage for spare blockers, insufficient quantities, H-323 spare-pack summaries, maintenance-task linkage and green-only-when-prepared behaviour.
- Maintenance readiness domain logic for vessel-specific service tasks, date/hour due checks, findings and departure summaries.
- Typed H-323 Elina maintenance readiness content covering Yanmar lubrication, raw-water cooling, fuel, liferaft, fire extinguishers, Ray90 DSC position, batteries and rig checks.
- Vitest coverage for maintenance status inference, engine-hour due windows, H-323 blocker logic, unknown safety items and conservative non-green summaries.
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
- AIS watch action domain logic that converts traffic findings into immediate, soon and monitor cockpit instructions.
- Typed H-323 Elina Tallinn ferry-lane AIS watch drill with ferry, RoPax, close-yacht and stale-workboat targets.
- Vitest coverage for prioritised AIS watch actions and the Tallinn ferry-lane family-crew training scenario.
- AIS watch brief domain logic that turns target snapshots and watch actions into compact cockpit handover lines.
- Typed H-323 Elina fog-bank AIS watch brief drill for restricted-visibility cockpit handover.
- Vitest coverage for AIS watch briefs, restricted-visibility drill content and the watch-brief drill registry.
- AIS watch debrief domain logic that converts watch briefs into lessons, positive signals, follow-up drills and conservative safety notes.
- Typed fog-bank debrief scenario notes for family-crew AIS training.
- Vitest coverage for AIS debrief lessons, data-quality prompts, practical fog-bank follow-up drills and the debrief registry.
- SRC/VHF radio call card domain logic for distress, urgency, safety and routine call prefixes, read-aloud lines and skipper prompts.
- Typed H-323 Elina radio-call training cards for MOB distress, Tallinn ferry-lane urgency and Hanko fog-bank safety broadcasts.
- Vitest coverage for radio-call urgency prefixes, read-aloud MOB content, urgency sorting and conservative live-transmission limitations.
- SRC/VHF radio-call drill summary logic for card counts, highest urgency, first read-aloud line and live-emergency-practice warning visibility.
- Vitest coverage for the H-323 Elina SRC drill pack summary and training safety constraints.
- Radio log domain logic for structured sent, received, decision and training entries with position, crew-role, follow-up and read-back prompts.
- Typed H-323 Elina radio log examples for MOB rehearsal, Tallinn ferry-lane decision logging and Hanko fog-bank Securite practice.
- Vitest coverage for radio log creation, summary counts, critical-entry selection, missing-position prompts and follow-up filtering.
- Radio log handover brief domain logic for prioritised critical lines, position-source prompts, follow-up lines, crew-role aggregation and conservative handover limitations.
- Typed H-323 Elina family-crew radio watch handover content for MOB rehearsal, Tallinn traffic decision and Hanko restricted-visibility Securite practice.
- Vitest coverage for radio handover critical ordering, position prompts, follow-up prompts, crew roles and safety limitation wording.

### Changed

- Landing page now surfaces the H-323 pre-departure dashboard with aggregated blockers, cautions, readiness score, source-level findings and read-aloud preparation brief.
- Domain barrel exports now include the departure dashboard module.
- Landing page now surfaces the H-323 trip logbook with engine-hour delta, caution/blocker counts, follow-ups and debrief lines.
- Domain barrel exports now include the trip logbook module.
- Landing page now surfaces H-323 spare readiness with critical spare gaps, blocker/caution findings, example kit items and locker-level skipper actions.
- Domain barrel exports now include the spare readiness module.
- Landing page now surfaces H-323 maintenance readiness with blockers, cautions, covered systems and skipper actions.
- Domain barrel exports now include the maintenance readiness module.
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
- Landing page now surfaces multiple AIS drills with prioritised watch actions instead of one target-only AIS card.
- Landing page now surfaces AIS watch briefs with compact handover lines instead of only watch-action lists.
- Landing page now surfaces AIS scenario debrief cards with lessons, positive signals and follow-up drills.
- Domain barrel exports now include the SRC/VHF radio call card module.
- Landing page now surfaces SRC/VHF radio call cards with urgency, channel guidance and read-aloud training lines.
- Domain barrel exports now include the radio log and handover module.
- Landing page now surfaces radio log and handover examples with action taken, follow-ups and position read-back prompts.
- `ideas.md` now records the radio-card UI integration decision, rationale, working log and hidden-safety-content risk.
- `ideas.md` now records the radio-log handover decision, rationale, working log and log-without-position risk.
- `ideas.md` now records the radio handover brief decision, rationale, working log and false-confidence risk.
- `ideas.md` now records the maintenance readiness decision, rationale, working log and maintenance false-green risk.
- `ideas.md` now records the spare readiness decision, rationale, working log and spares false-green risk.
- `ideas.md` now records the trip logbook decision, rationale, working log and debrief false-confidence risk.
- `ideas.md` now records the pre-departure dashboard decision, rationale, working log and dashboard false-green risk.

### Removed

- Temporary `test.txt` write-access probe was removed after connector permissions were verified.
