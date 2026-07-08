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

### Changed

- The repository has moved from documentation-only foundation to the first runnable application foundation.
- The initial technical direction is now documented as an architecture decision rather than only a backlog bias.
- The documentation index now lists the domain model as an active document instead of a planned document.
- `README.md` now includes concrete development commands for install, dev server, type checks and tests.
- Repository validation is now automated for future pushes and pull requests.
- CI no longer enables npm dependency caching before a package lockfile exists.
- `docs/README.md` now links the contribution guide.

### Removed

- Temporary `test.txt` write-access probe was removed after connector permissions were verified.
