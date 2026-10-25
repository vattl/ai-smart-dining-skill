# Scenario Matrix — WI-002

| ID | Scenario | Preconditions/Input | Expected Business Outcome | Invariants | Verification | Result |
|---|---|---|---|---|---|---|
| S01 | Approved HTML prototype | HTML + screenshot + same-record Presented YES/APPROVED + lock | UI gate passes | INV-UI-001..004 | `test_approved_html_prototype_passes_ui_gate` | PASS |
| S02 | Non-HTML prototype | TSX/Vue/Dart + other evidence | UI gate blocks and asks for HTML | INV-UI-001 | `test_non_html_prototype_is_rejected` | PASS |
| S03 | Waiver instead of approval | HTML + screenshot + WAIVED + lock | UI gate blocks and asks for APPROVED | INV-UI-002 | `test_waived_approval_is_rejected` | PASS |
| S04 | Minor/refine UI request | UI impact is MINOR | router requires HTML prototype and approval | INV-UI-001..004 | v4.3 semantic/package validation | PASS |
| S05 | Prototype not shown | HTML + APPROVED but Presented NO | UI gate blocks until user presentation | INV-UI-002 | `test_unpresented_html_prototype_is_rejected` | PASS |
| S06 | Evidence split across records | one record APPROVED, another Presented YES | UI gate rejects evidence stitching | INV-UI-002 | `test_presentation_and_approval_must_share_one_record` | PASS |

## Acceptance rule

All material scenarios must PASS. Any missing HTML, visual evidence, explicit approval or UI lock blocks acceptance and future production UI editing.

