# Scenario Matrix — WI-004

| ID | Scenario | Expected Outcome | Invariants | Verification | Result |
|---|---|---|---|---|---|
| S01 | Package structure is complete | package gate passes without claiming work/release | INV-GATE-001 | automated test | PASS |
| S02 | Work Item lacks required evidence | work gate fails with named blockers | INV-GATE-002 | automated test | PASS |
| S03 | Routed Work Item evidence complete | work gate passes | INV-GATE-002 | automated test | PASS |
| S04 | Release requested outside Git | release gate fails | INV-REL-001 | automated test/manual current repo | PASS |
| S05 | Release lacks deploy/smoke/production evidence | release gate fails | INV-REL-001 | automated test | PASS |
| S06 | UI waiver remains in authoritative current docs | package semantic check fails | INV-UI-001 | package test/search | PASS |

## Acceptance rule

All scenarios must PASS before acceptance.
