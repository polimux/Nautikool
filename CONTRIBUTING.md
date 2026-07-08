# Contributing to Nautikool

Nautikool is early-stage and safety-oriented. Contributions should keep the repository understandable, testable and conservative before adding breadth.

## Contribution principles

- Ship small, coherent changes.
- Prefer domain logic, tests and documentation before UI surface area.
- Keep content, vessel data, passage planning, checklists and integrations separable.
- Do not add live integrations before a local-first workflow works without them.
- Make assumptions explicit when a feature touches safety, weather, navigation, crew readiness or boat readiness.
- Avoid wording that implies certainty where the app only has partial information.

## Recommended change shape

Each meaningful change should answer these questions:

1. What user or project risk does this reduce?
2. What product workflow does this improve?
3. What assumptions does this introduce?
4. How is it checked or tested?
5. What remains deliberately out of scope?

Small documentation-only changes do not need tests, but they should still improve clarity.

## Validation path

Before opening a pull request or committing a larger local change, run the same path as CI:

```sh
npm install
npm run check
npm test
npm run build
```

After a `package-lock.json` exists, the install command should move to `npm ci`.

## Commit message format

Use simple conventional prefixes:

- `feat:` for user-facing or domain capability,
- `fix:` for bug fixes,
- `test:` for test coverage,
- `docs:` for documentation,
- `ci:` for workflow and validation changes,
- `chore:` for maintenance with no product behaviour change.

Examples:

```text
feat: add checklist template parser
test: cover required checklist warning semantics
docs: record checklist parser decision
ci: use lockfile-backed npm install
```

## Decision log format

Record significant decisions in `ideas.md` under **Product decisions** and, when implementation-facing detail is needed, in the relevant file under `docs/`.

Use this format:

| Date | Decision | Rationale |
|---|---|---|
| YYYY-MM-DD | Short decision in active voice. | Why this is the right next step now; include safety, offline, testing or scope trade-offs when relevant. |

A good decision entry is short enough to scan later but concrete enough to prevent rediscovering the same debate.

## Working log format

For repository stewardship entries in `ideas.md`, use this structure:

```md
### YYYY-MM-DD - Short title

Role mix used: project manager, developer, tester, user and product manager.

Repository review:

- What was inspected.
- What was missing, risky or newly available.

Decision:

- What will be changed now.
- What is explicitly deferred.

Action taken:

- Files changed.
- Behaviour or documentation added.

Testing/reasoning:

- Project manager perspective.
- Developer perspective.
- Tester perspective.
- User/product perspective.

Next best action:

- One concrete next step.

Commit targets:

- `prefix: example commit message`
```

## Safety-sensitive changes

For changes that affect checklist completion, risk cards, weather freshness, emergency flows, go/no-go wording or vessel-specific assumptions:

- add or update tests first where practical,
- preserve warnings rather than silently downgrading them,
- model unknown data separately instead of treating it as safe,
- keep user responsibility visible,
- prefer yellow/red escalation when critical data is missing or stale.
