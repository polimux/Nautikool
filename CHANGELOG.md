# Changelog

All notable project changes should be recorded here.

This project uses a simple human-readable changelog while the product and architecture are still being shaped. Once releases exist, this file can move toward a more formal Keep a Changelog style with version numbers.

## Unreleased

### Added

- Harbour departure-gate domain logic that converts a harbour route pack into a day-of-departure verification gate with committed-stop blockers, usable-alternate counts, required verification coverage and read-aloud cockpit lines.
- H-323 Elina Turku to Pärnu harbour departure-gate content covering committed-stop contacts, draft/depth margin, daylight arrival posture, named bailout harbour verification and Pärnu destination logistics.
- Vitest scenario coverage for green harbour gates, committed-stop blockers, unusable alternates and the blocked H-323 Elina Turku to Pärnu harbour gate publication.
- Harbour route-pack domain logic that separates committed stops from bailout/decision alternatives, computes status from harbour blockers, creates verification queues and cockpit read-aloud brief lines.
- H-323 Elina Turku to Pärnu harbour route-pack content derived from the static harbour notebook, including committed stops, alternates, verification prompts and explicit live-data limitations.
- Vitest coverage for harbour route-pack committed/alternate grouping, blocked H-323 publication, verification queue output and static harbour safety limitations.
- Harbour notebook domain logic for static route-pack harbour notes, freshness, contact gaps, draft margin, night-arrival suitability and cockpit-readable offline brief lines.
- Typed H-323 Elina Turku to Pärnu harbour-note content for Turku, Nauvo, Hanko, Dirhami, Kärdla, Haapsalu, Virtsu/Muhu and Pärnu.
- Vitest coverage for harbour-note readiness, stale/unknown information, night-arrival blockers, H-323 route-pack content and offline brief generation.
- Passage split recommendation domain logic that turns over-long or exposed static passage legs into skipper-facing split decisions, read-aloud briefs and safety limitations.
- Typed H-323 Elina Turku to Pärnu split-scenario content for Hanko to Haapsalu, Haapsalu to Pärnu and Nauvo to Hanko fallback decisions, including Dirhami, Kärdla, Virtsu/Muhu and Kasnäs notes.
- Vitest coverage for route split blockers, static-planning limitations, H-323 split content publication and invalid leg IDs.
- Passage workload analysis domain logic that flags over-long family legs, likely daylight workload, long exposed open-water passages, missing bailout coverage and missing crew notes.
- Typed H-323 Elina Turku to Pärnu workload policy content using a 50 nm family target, 65 nm hard day-leg limit and explicit static-plan limitations.
- Vitest coverage for green short-hop workload, hard-limit blockers, bailout cautions and the H-323 Turku to Pärnu workload publication.
- Departure skipper brief domain logic that converts the pre-departure dashboard into printable/wet-hands sections for decision, route, weather, crew, boat, electronics, checklist and safety limitations.
- Typed H-323 Elina Turku to Pärnu printable skipper brief content with family-crew route focus, weather checkpoints, crew role assignments, boat checks, electronics checks and conservative go/no-go question.
- Vitest coverage for departure brief section generation, first-action visibility, static-copy safety limitations and H-323 Elina family-passage brief publication.
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
- Pure conservative risk engine for Baltic wind limits, stale forecasts, thunderstorms, waves, open-water exposure, fatigue and missing critical equipment.
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
