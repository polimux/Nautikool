# Nautikool

Nautikool is a local-first sailing companion for coastal skippers.

It is intended to combine vessel-specific preparation, passage planning, safety checklists, learning content and eventually onboard context from navigation electronics such as AIS, NMEA2000 sensors and weather data.

The product should feel like a calm co-skipper: practical, conservative, offline-capable and explicit about assumptions.

## Working positioning

> Duolingo meets Navionics meets a smart skipper notebook.

Nautikool should help a skipper answer four practical questions:

1. What do I need to know?
2. What do I need to prepare?
3. What is happening around my boat?
4. What should I do next?

## Target user

The first target user is a competent but still learning coastal skipper sailing a 9-11 m yacht in the Baltic Sea, often with limited crew or singlehanded.

This user needs a tool that works before departure, offline during a passage and under cockpit constraints such as glare, fatigue, wet hands and limited attention.

## Initial product modules

### Vessel profile

Store the boat-specific data that matters for preparation and decisions:

- dimensions: LOA, beam, draft, mast height,
- engine and fuel information,
- battery and electrical setup,
- safety equipment,
- navigation electronics,
- known defects and owner notes.

### Checklist engine

Provide configurable checklists for:

- departure,
- arrival,
- engine checks,
- night sailing,
- heavy weather,
- man overboard,
- mayday/DSC/VHF procedures,
- and boat-specific maintenance routines.

### Passage planner

Support practical route preparation:

- route legs,
- distances,
- ETAs,
- hazards,
- bailout harbours,
- daylight windows,
- crew notes,
- weather assumptions.

### Offline skipper pack

Prepare a passage pack that remains useful without internet:

- route plan,
- checklists,
- emergency cards,
- harbour notes,
- weather snapshot with freshness warning,
- printable/exportable summary.

### Learning and scenario training

Teach and rehearse sailing decisions through compact modules:

- COLREGs,
- lights and buoys,
- VHF,
- anchoring,
- weather,
- sail trim,
- AIS situations,
- harbour approaches,
- emergency scenarios.

### Future integrations

Later modules may include:

- GPX import/export,
- AIS target interpretation,
- NMEA2000 data dashboard,
- simulated sensor data for tests,
- weather model comparison,
- cockpit mode.

These integrations should remain optional adapters around a useful local-first core.

## Current repository status

This repository now has its first runnable application foundation and automated validation workflow.

Implemented so far:

- `ideas.md` as the product backlog, roadmap and working log,
- this `README.md` as the public project entry point,
- `CHANGELOG.md` as the project history,
- `docs/README.md`, `docs/architecture.md` and `docs/domain-model.md`,
- a SvelteKit and TypeScript project skeleton,
- pure checklist domain types and state-transition logic,
- Vitest tests for checklist state semantics,
- GitHub Actions CI for dependency install, Svelte/TypeScript checks, unit tests and production build.

Not implemented yet:

- local persistence,
- checklist authoring from Markdown/frontmatter,
- vessel profile UI,
- passage planning UI,
- offline/PWA caching,
- real onboard data integrations.

## Development setup

Install dependencies:

```sh
npm install
```

Run the development server:

```sh
npm run dev
```

Run type checks:

```sh
npm run check
```

Run domain tests:

```sh
npm test
```

Build the app:

```sh
npm run build
```

The same validation path is executed by GitHub Actions on pushes and pull requests to `main`.

## Development direction

Current stack:

- Progressive Web App first,
- SvelteKit,
- TypeScript,
- local-first storage later behind a repository abstraction,
- Markdown/MDX for learning content and checklists later,
- Vitest for pure domain logic first,
- Playwright later for workflow coverage.

The first implementation slice intentionally focuses on checklist state semantics before UI, persistence, sync, charts or hardware integrations.

## Safety posture

Nautikool must not pretend certainty.

Safety-related output should always show:

- assumptions,
- data freshness,
- source limitations,
- conservative escalation from green to yellow to red,
- and clear user responsibility.

No go/no-go logic should be implemented without explicit tests and visible reasoning.

## Roadmap snapshot

1. Repository foundation: README, ideas, changelog, docs structure.
2. Local-first MVP: vessel profile, checklist engine, static knowledge base and trip preparation pack.
3. Navigation and weather planning: GPX, leg table, weather briefing and risk card.
4. Training engine: learning modules and realistic scenarios.
5. Boat data and integrations: simulated and then real AIS/NMEA/weather context.
6. Cockpit companion: emergency screen, cockpit mode and underway decision support.

See [`ideas.md`](ideas.md) for the detailed backlog and working log.

## License

No license has been selected yet.
