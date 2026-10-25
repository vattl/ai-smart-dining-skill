# Agent Entry — AI Development OS v4.3

Read `.ai/SKILL.md` first.

For normal work, use the unified `/work` lifecycle. Do not bypass its router or pre-edit guard.

Before broad discovery, read the durable Project Baseline. Validate relevant facts against repository evidence rather than rescanning the whole repository by default.

For any UI-impacting request, enter the UI Design Track and complete HTML prototype review before production UI edits.

For cross-layer changes, no frontend/backend layer may silently assume the other will adapt. Use direct same-Work-Item changes or explicit Contract Handoff artifacts.

Completion requires evidence, not agent assertion.

## v4.3 mandatory workflow rules

- Treat `.ai/rules/WORKFLOW_CORE.md` as the single authoritative lifecycle. `docs/WORKFLOW_V4_2.md` is compatibility/migration context only.
- For new products/material initiatives, complete `.ai/rules/PRODUCT_LIFECYCLE_RULES.md` before engineering implementation.
- Use `.ai/scripts/gate.py` for package, Work Item and release decisions; package PASS never proves acceptance or release.
- Do not edit production code until `IMPLEMENTATION_READY = YES`.
- Use the Work Item Impact Map as the affected-surface authority downstream.
- Preserve applicable business invariants and verify them before acceptance.
- Use Scenario Matrix coverage for STANDARD+ work.
- Distinguish ACCEPTED, INTEGRATED and RELEASED; do not collapse them into a vague DONE.



## v4.3 prototype enforcement

For any UI-impacting work, set `PROTOTYPE_REQUIREMENT=REQUIRED` and `PROTOTYPE_MODE=HTML`. Never equate a written strategy, implementation plan, or native-framework preview with the required review prototype. Create an isolated renderable `.html/.htm` prototype, capture visual evidence, critique it, present it to the user, record explicit `Approval Status: APPROVED`, lock the approved UI, and only then edit production UI. This workflow has no per-Work-Item prototype or approval waiver.

Prototype approval is not implementation acceptance. Before production UI editing, require a complete measured specification, implementation map, and classified legacy structural diff, then pass `validate_ui_fidelity.py --phase plan`. Before ACCEPT, require same-viewport prototype/production screenshots, diff evidence, zero HIGH/CRITICAL deltas, `Target State Match: YES`, `Legacy Remaining: NO`, final production presentation, and explicit user fidelity confirmation through `validate_ui_fidelity.py --phase accept`. Functional usability or approximate resemblance cannot override these gates.

Visual fidelity is not functional completion. Before production UI editing, map every prototype datum/action in `PROTOTYPE_INTERACTION_CONTRACT.md`, create assigned Backend Capability Requests for API_EXTENSION/NEW_API, resolve NOT_SUPPORTED interactions by revising/re-approving the prototype, and pass `validate_ui_capabilities.py --phase plan`. Before ACCEPT, require every interaction and backend request VERIFIED with real end-to-end evidence, zero production fake/mock/placeholder interactions, zero unresolved backend capabilities, and a CLEAR `BACKEND_COORDINATION_REPORT.md` through `validate_ui_capabilities.py --phase accept`. Any OPEN coordination item must be shown to the user and keeps the UI BLOCKED/PARTIAL.
