# Impact Map — WI-003

## Authoritative Owner

- Translation policy: `.ai/rules/PROTOTYPE_TO_CODE_RULES.md`
- Visual acceptance: `.ai/commands/ui-verify.md` and `.ai/rules/VISUAL_FIDELITY_RULES.md`
- Machine enforcement: new `.ai/scripts/validate_ui_fidelity.py`
- Completion gate: `.ai/rules/ACCEPTANCE_RULES.md`

## Change Propagation Path

```text
Approved HTML prototype
→ measured specification + region/component map + legacy disposition
→ production implementation
→ same-viewport prototype/production capture
→ structural + visual diff
→ correction loop
→ production result presented to user
→ user fidelity confirmation
→ ACCEPT
```

## Consumer Coverage

| Consumer | Relationship | Classification | Needs Change | Evidence |
|---|---|---|---|---|
| `/ui-implement` | production translation entry | AFFECTED | YES | current mapping artifacts are advisory |
| `/ui-verify` | post-implementation acceptance | AFFECTED | YES | lacks executable artifact gate |
| `/review` and acceptance rules | completion authority | AFFECTED | YES | must reject approximate implementation |
| Mapping/spec/diff templates | evidence producers | AFFECTED | YES | need machine-readable final fields |
| v4.3 package validator | semantic guard | AFFECTED | YES | must require new gate and markers |
| HTML prototype approval gate | upstream prerequisite | VERIFIED_UNAFFECTED | NO | remains mandatory |

## Layer Coverage

| Layer | Classification | Reason / Evidence |
|---|---|---|
| UI | NOT_APPLICABLE | This Work Item modifies workflow policy, not a product UI. |
| Interaction | AFFECTED | Adds final production-result user confirmation. |
| Frontend State | VERIFIED_UNAFFECTED | No product state code. |
| API Client | NOT_APPLICABLE | No API change. |
| Request Contract | AFFECTED | UI completion now requires translation/fidelity evidence. |
| Backend/Domain | AFFECTED | New validator logic. |
| Persistence | AFFECTED | New/updated evidence artifacts and manifest. |
| Response Contract | AFFECTED | Gate PASS/BLOCKED output. |
| Jobs/Events/Integrations | VERIFIED_UNAFFECTED | None. |
| Config/Security | VERIFIED_UNAFFECTED | Read-only local validation. |
| Runtime/NFR | AFFECTED | Bounded artifact scan. |
| Tests | AFFECTED | Positive and negative gate coverage. |

## Duplicate Logic / Patch Smells

Rules already describe fidelity but no single executable acceptance authority exists. The new validator centralizes machine-verifiable evidence while leaving visual judgment to user/reviewer evidence.

## Contract Delta Summary

New CLI: `python .ai/scripts/validate_ui_fidelity.py --ui-dir <artifact-dir>`. No existing command is removed.

## UI Semantic Impact

Workflow-only. No product UI prototype is required for this implementation.

## Risks

- Artifact presence can still be fabricated; requiring real image paths, non-placeholder fields and final user confirmation raises but cannot mathematically eliminate dishonest evidence.
- Pixel equality is not universally safe; structural invariants and explicit deltas remain stronger than a single ratio threshold.

