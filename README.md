# AI Development OS v4.3 — Prototype Enforcement Full Edition

v4.3 is a full superset of v4.2. This package policy requires an HTML review prototype and explicit user approval for every UI-impacting request before production UI editing.

## v4.3 core change

For `UI_IMPACT=MINOR|STRUCTURAL` or UI intent `REFINE|REFACTOR|REDESIGN`:

```text
Design Strategy
→ Prototype Requirement = REQUIRED
→ Prototype Mode = HTML
→ Renderable .html/.htm Prototype
→ Screenshot / Visual Reference
→ Design Critique
→ User Presentation
→ Explicit User Approval (`Approval Status: APPROVED`)
→ UI Lock
→ IMPLEMENTATION_READY=YES
→ Production UI implementation
```

The HTML artifact is the mandatory review format. Native/component-compatible previews may assist feasibility work, but they do not satisfy the approval gate or replace target-stack production implementation.

Prototype approval only authorizes implementation. It does not permit a “close enough” result. Before production UI edits, every prototype and legacy region must be mapped and the translation plan gate must pass. Before UI acceptance, same-viewport screenshots, structural closure, legacy removal, diff evidence and explicit user fidelity confirmation must pass the final fidelity gate.

Prototype interactions are governed separately from visual fidelity. Every material datum/action must map to AVAILABLE, DERIVABLE, API_EXTENSION, NEW_API, or NOT_SUPPORTED. Missing backend support must produce an assigned Backend Capability Request and `BACKEND_COORDINATION_REPORT.md`; production mocks or fake buttons are forbidden. UI acceptance requires `validate_ui_capabilities.py --phase accept` with all interactions verified end-to-end and no open backend items.

See `docs/UI_PROTOTYPE_ENFORCEMENT.md`.

---

# AI Development OS v4.2 — Domain & Workflow Consolidation

v4.2 keeps every v4.1 capability while tightening the business logic of the workflow. The system now centers on Project Baseline, Work Item, Business Invariants, Impact Map, Implementation Design, Vertical Slices/Scenario Matrix, and Acceptance Evidence.

See `.ai/rules/WORKFLOW_CORE.md` for the authoritative v4.3 lifecycle.

For a new product, begin with `/project`, `/research`, and `/prd`. Executable gates are deliberately scope-specific:

```bash
python .ai/scripts/gate.py package
python .ai/scripts/gate.py work --work-item docs/work-items/WI-XXX --phase ready
python .ai/scripts/gate.py work --work-item docs/work-items/WI-XXX --phase accept
python .ai/scripts/gate.py release --work-item docs/work-items/WI-XXX --release-evidence path/to/RELEASE_EVIDENCE.md
```

Package integrity is not implementation acceptance, and release preparation is not deployment.

---

# AI Development OS v4.1 — Full Edition

A repository-owned engineering operating system for AI coding agents.

## What v4.1 fixes

### 1. Workflow enforcement
`/work` is the main entry and routes before editing. Any UI-impacting work must pass HTML prototype review and explicit user approval before production UI changes.

### 2. Persistent project understanding
Agents read a reusable Project Baseline instead of rediscovering the entire repository every time. The baseline covers technology, architecture and accepted design language, and is versioned/updated when intentional major changes occur.

### 3. Frontend ↔ backend collaboration
Contract changes work both directions:
- backend change → frontend consumer handoff/update
- frontend need → backend capability request

No layer silently assumes another layer will adapt.

## Primary lifecycle

The current authoritative normal lifecycle is:

`REQUEST → UNDERSTAND → BASELINE FAST CONTEXT → ROUTE → DISCOVER → DESIGN → PLAN → IMPLEMENTATION_READY → IMPLEMENT → SELF_VERIFY → REVIEW → ACCEPT → BASELINE UPDATE → INTEGRATE → optional RELEASE → optional MONITOR`

`ACCEPTED`, `INTEGRATED`, and `RELEASED` are distinct evidence-backed states. The older “PRE-EDIT GUARD” name remains only as a compatibility reference; `IMPLEMENTATION_READY` is the hard production-edit gate.

## Main commands
- `/work` normal work
- `/continue` resume
- `/review` independent review
- `/release` release flow
- `/incident` incident fast lane
- `/ui` UI specialist entry
- `/baseline`, `/baseline-check`, `/rebaseline` baseline maintenance
- `/contract-handoff` contract collaboration specialist

Older specialist commands remain available but are supporting tools, not competing workflows.
