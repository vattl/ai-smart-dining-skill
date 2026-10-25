# Impact Map — WI-002

## Authoritative Owner

- UI routing: `.ai/rules/WORKFLOW_ROUTER_RULES.md`
- Prototype policy: `.ai/rules/PROTOTYPE_ENFORCEMENT_RULES.md`
- Evidence enforcement: `.ai/scripts/validate_ui_gate.py`
- Production edit gate: `.ai/rules/IMPLEMENTATION_READY_RULES.md`

## Change Propagation Path

```text
UI request
→ /work route classifies any UI impact
→ HTML prototype required
→ screenshot + critique + user presentation
→ explicit APPROVED evidence
→ UI lock
→ IMPLEMENTATION_READY=YES
→ production-stack implementation
```

## Consumer Coverage

| Consumer | Relationship | Classification | Needs Change | Evidence |
|---|---|---|---|---|
| `/work` router | selects gate | AFFECTED | YES | currently structural-only |
| `/ui` command | operator workflow | AFFECTED | YES | currently offers 3 modes |
| UI gate validator | machine enforcement | AFFECTED | YES | accepts non-HTML and waiver |
| Prototype/approval/coverage templates | evidence producers | AFFECTED | YES | currently advertise alternatives |
| README/USAGE/INSTALL/docs | user guidance | AFFECTED | YES | currently allow variable technology/waiver |
| Production framework implementation | post-approval consumer | VERIFIED_UNAFFECTED | NO | remains target-stack native |

## Layer Coverage

| Layer | Classification | Reason / Evidence |
|---|---|---|
| UI | NOT_APPLICABLE | This Work Item changes workflow policy, not product UI. |
| Interaction | AFFECTED | User approval interaction becomes mandatory. |
| Frontend State | VERIFIED_UNAFFECTED | No product state implementation. |
| API Client | NOT_APPLICABLE | No API delta. |
| Request Contract | AFFECTED | All UI-impact requests now trigger the gate. |
| Backend/Domain | AFFECTED | Workflow policy and validator logic. |
| Persistence | AFFECTED | Approval/template artifacts and manifest metadata. |
| Response Contract | AFFECTED | UI gate failure/pass output. |
| Jobs/Events/Integrations | VERIFIED_UNAFFECTED | None. |
| Config/Security | VERIFIED_UNAFFECTED | No permissions or secrets. |
| Runtime/NFR | AFFECTED | File scan narrows to HTML and strict approval. |
| Tests | AFFECTED | Add HTML pass and non-HTML/waiver rejection coverage. |

## Duplicate Logic / Patch Smells

The same prototype-mode policy appears in router, rules, command, templates and docs. All must change together; validator remains the executable source of truth.

## Contract Delta Summary

Add `--require-ui-prototype` while preserving `--require-structural-ui` as a compatibility alias. Both enforce the same HTML-only gate.

## UI Semantic Impact

Workflow-level UI policy only. `UI_DESIGN_TRACK=NOT_REQUIRED` for this implementation because no product UI is being designed or edited.

## Risks

- HTML-only prototypes may drift from native production components; project-aware feasibility and mapping remain mandatory.
- Existing evidence using non-HTML prototypes will no longer pass future UI gates.
- Strict user approval increases intentional pause points, as requested.

