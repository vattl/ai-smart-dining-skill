# Scenario Matrix — WI-001

| ID | Scenario | Preconditions/Input | Expected Business Outcome | Invariants | Verification | Result |
|---|---|---|---|---|---|---|
| S01 | Normal policy check | pristine v4.3 package | validator identifies v4.3 and exits 0 | INV-001..004 | `python .ai/scripts/validate.py` + unit test | PASS |
| S02 | Release policy check | pristine package, no Git metadata | release checks pass; Git limitation is an explicit warning | INV-003..004 | `python .ai/scripts/validate.py --release` | PASS |
| S03 | Semantic workflow drift | isolated copy with required v4.3 marker removed | package validator exits non-zero and names the violated semantic requirement | INV-001..003 | `test_package_validator_rejects_missing_implementation_ready_semantics` | PASS |
| S04 | Manifest drift | isolated copy with a listed file modified or extra file added | package validator exits non-zero and identifies integrity mismatch | INV-004 | hash-drift and unlisted-file unit tests | PASS |
| S05 | Expected runtime mutation | isolated copy with `.ai-runtime/registry.json` changed | normal policy check passes; release integrity check fails with exact path | INV-004 | `test_runtime_state_drift_only_blocks_release_validation` | PASS |

## Acceptance rule

Material scenarios must be PASS or explicitly accepted as out of scope. UNKNOWN / NOT_VERIFIED material scenarios block acceptance.

