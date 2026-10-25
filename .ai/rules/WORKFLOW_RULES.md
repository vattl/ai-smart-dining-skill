# Workflow Rules — v4.0

## One lifecycle, adaptive depth

All normal engineering work follows the Unified Workflow Core. Commands are entry points or specialist tools, not separate lifecycles.

Primary user-facing entry points:
- `/work` — normal work item
- `/continue` — resume existing work
- `/review` — independent review
- `/release` — release readiness/release flow
- `/incident` — production incident fast lane
- `/ui` — UI-led work; still belongs to a Work Item

Compatibility/expert commands remain available but must attach to the same Work Item.

## Routing

`/feature`, `/change`, `/bug`, `/repair` are typed aliases into `/work`.

`/bug` may automatically escalate to capability repair when repeated patches/shared rules/multiple consumers are discovered.

`/test`, `/verify`, `/contract-verify`, `/ui-verify`, `/perf`, `/reliability`, `/policy-check` are checks/audits supporting SELF_VERIFY/REVIEW/ACCEPT rather than mandatory user-managed stages.

`/workstream` is execution infrastructure and should normally be automatic.

## Artifact minimization

Prefer these core artifacts for non-trivial work:
1. WORK_ITEM
2. IMPACT_MAP
3. IMPLEMENTATION_DESIGN
4. TASKS/vertical slices
5. ACCEPTANCE_REPORT

Only create specialist artifacts when material (UI lock, DB migration, API consumer handoff, incident report, etc.).

## State precedence

Work Item → runtime registry/journal → Git → compatibility summaries.

Do not maintain multiple conflicting narratives.
