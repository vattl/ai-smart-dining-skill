# Scenario Matrix — WI-003

| ID | Scenario | Preconditions/Input | Expected Business Outcome | Invariants | Verification | Result |
|---|---|---|---|---|---|---|
| S01 | Complete faithful implementation evidence | complete mapping/spec/diff/screenshots/user confirmation | plan and fidelity gates pass | INV-FID-001..004 | positive CLI tests | PASS |
| S02 | Missing implementation map | other evidence present | gate blocks | INV-FID-001 | `test_missing_implementation_map_blocks_acceptance` | PASS |
| S03 | Legacy structure remains | `Legacy Remaining: YES` | gate blocks | INV-FID-002 | `test_legacy_structure_remaining_blocks_acceptance` | PASS |
| S04 | Target state only partial | `Target State Match: PARTIAL` | gate blocks despite functional usability | INV-FID-003 | `test_partial_target_match_blocks_functionally_usable_ui` | PASS |
| S05 | Final production not user-confirmed | production screenshot exists but confirmation absent | gate blocks | INV-FID-004 | `test_missing_user_fidelity_confirmation_blocks_acceptance` | PASS |
| S06 | Status-only fake mapping | counts claim zero but mapping table is empty | gate blocks before acceptance | INV-FID-001 | `test_status_only_mapping_without_rows_blocks_acceptance` | PASS |

## Acceptance rule

All scenarios must PASS. Functional tests cannot override a failed fidelity/translation gate.

