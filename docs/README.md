# Nautikool Documentation

This directory holds structured project documentation that should not overload the public `README.md` or the product working log in `ideas.md`.

## Documents

- `architecture.md` - application shape, initial stack decision, module boundaries, local-first storage, offline implications and testing direction.
- `domain-model.md` - first domain entities for vessel profile, checklists, passage plans, weather snapshots, risk assessments, assumptions, freshness and trip packs.

## Planned documents

- `safety.md` - safety posture, assumption handling, go/no-go wording and conservative escalation rules.
- `content-model.md` - how lessons, checklists and reference cards should be authored.
- `testing.md` - acceptance scenarios, offline tests, parser tests and safety-critical regression tests.

## Documentation principles

- Keep safety-critical assumptions visible.
- Prefer practical sailing workflows over abstract architecture.
- Keep hardware integrations optional until the local-first core is useful.
- Record decisions before introducing application code.