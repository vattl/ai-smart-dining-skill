# Acceptance Rules

Acceptance is requirement validation, not merely test execution.

Before ACCEPTED/VERIFIED_DONE:
1. Re-read original Requirement Contract.
2. Map each acceptance criterion to implementation evidence.
3. Confirm all material affected layers/consumers are classified.
4. Confirm no required path is mocked/faked/placeholder production behavior.
5. Confirm regression checks proportionate to the impact.
6. Confirm unresolved consumer handoffs keep status partial/pending.
7. Confirm evidence actually exists (test output, code/diff, screenshots, contract checks, etc.).
8. For any UI impact, require `validate_ui_fidelity.py --phase accept` to pass. Functional usability, build success, interaction success, or approximate visual similarity cannot override a failed fidelity gate.
9. For any UI impact, require `validate_ui_capabilities.py --phase accept` to pass. Visual fidelity cannot override unresolved backend capabilities, fake/placeholder production interactions, unverified capability requests or missing end-to-end evidence.
10. If `BACKEND_COORDINATION_REPORT.md` contains OPEN items, output them to the user and keep the UI decision BLOCKED/PARTIAL.

Allowed decisions:
- ACCEPTED
- PARTIAL
- BLOCKED
- FALSE_COMPLETION
- REJECTED_FOR_REWORK
