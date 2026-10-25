# Scenario Matrix — WI-005

| ID | Scenario | Expected Business Outcome | Invariants | Verification | Result |
|---|---|---|---|---|---|
| S01 | UI evidence has no interaction contract | plan gate blocks | INV-INT-001 | unit test | PASS |
| S02 | NEW_API row lacks capability request | plan gate blocks and coordination report lists it | INV-INT-002/003 | unit test | PASS |
| S03 | NOT_SUPPORTED interaction remains | plan gate blocks prototype implementation | INV-INT-001 | unit test | PASS |
| S04 | backend request or interaction not VERIFIED | accept gate blocks and reports owner/action | INV-INT-003 | unit test | PASS |
| S05 | production fake count or E2E evidence invalid | accept gate blocks | INV-INT-002 | unit test | PASS |
| S06 | all interactions and contracts verified | plan and accept gates pass | all | unit/integration test | PASS |

## Acceptance rule

All material scenarios must PASS.
