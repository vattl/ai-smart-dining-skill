# Impact Map — WI-005

## Authoritative Owner

- UI capability policy: `.ai/rules/DATA_FEASIBILITY_RULES.md`, `.ai/rules/CONTRACT_COLLABORATION_RULES.md`
- Prototype translation: `.ai/rules/PROTOTYPE_TO_CODE_RULES.md`
- Machine enforcement: `.ai/scripts/validate_ui_capabilities.py`
- Orchestration: `.ai/scripts/gate.py`

## Change Propagation Path

```text
approved prototype interactions
→ interaction capability matrix
→ existing contract verification or backend capability request
→ backend implementation/verification
→ frontend integration
→ E2E interaction evidence
→ UI functional acceptance + visual acceptance
```

## Consumer Coverage

| Consumer | Classification | Change |
|---|---|---|
| `/ui` | AFFECTED | extract every interaction/data dependency before production |
| `/ui-implement` | AFFECTED | run capability plan gate before editing |
| `/ui-verify` | AFFECTED | run capability accept gate and report unresolved backend work |
| Work Gate | AFFECTED | orchestrate capability gate for routed UI work |
| Backend Capability Request | AFFECTED | add machine-readable ownership/status/evidence |
| Acceptance/review | AFFECTED | visual success cannot hide functional contract gaps |
| Existing UI fidelity tests | VERIFIED_UNAFFECTED | visual contract remains separate and mandatory |

## Layer Coverage

| Layer | Classification | Reason |
|---|---|---|
| Product UI | NOT_APPLICABLE | workflow package, no product UI |
| Interaction contract | AFFECTED | new authoritative matrix |
| Frontend/API | AFFECTED | real integration paths and fake-function prohibition |
| Backend/domain | AFFECTED | capability requests become mandatory/verified |
| Tests | AFFECTED | new positive and negative gate suite |
| Docs/templates | AFFECTED | new evidence artifacts and final coordination output |
| Security/NFR | VERIFIED_UNAFFECTED | local bounded text/path validation |

## Risks

- Pure text evidence cannot prove runtime behavior alone; accept gate therefore requires real evidence paths and VERIFIED statuses.
- Heuristic fake scans can false-positive; the hard contract uses explicit production integration and E2E evidence, with scans remaining review support.
