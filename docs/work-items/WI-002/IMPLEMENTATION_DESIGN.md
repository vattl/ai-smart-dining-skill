# Implementation Design — WI-002

## Root Fix / Owner

Make `.ai/scripts/validate_ui_gate.py` enforce the policy and align all routing/rules/templates/docs to it.

## Why this location

The gate is the only machine-checkable boundary before production UI editing; documentation alone would not guarantee compliance.

## End-to-End Change

### Backend

- Accept only `.html/.htm` prototype entries.
- Require actual `APPROVED`; remove waiver-as-approval.
- Add `--require-ui-prototype`, retaining the structural flag as an alias.

### Frontend

N/A for this Work Item. Future product frontend changes remain blocked until approval.

### UI / Interaction

All UI impact routes through HTML prototype → screenshot → presentation → explicit approval.

### Data / Persistence

Update evidence templates and final package manifest.

### Interfaces / Contracts

Backward-compatible CLI alias; stricter evidence semantics.

### Jobs / Events / Integrations

N/A.

## Preserve / Compatibility

Keep old `--require-structural-ui` invocations working, but apply the new stricter HTML-only policy. Preserve production-stack mapping requirements.

## API Consumer Migration / Handoff

N/A.

## Failure / Boundary Behavior

- Non-HTML renderable → blocked with HTML-specific message.
- Missing screenshot, APPROVED record or UI lock → blocked.
- `WAIVED_BY_USER` alone → blocked.
- No UI impact → gate not required.

## Runtime / Performance / Reliability

Small bounded filesystem scan; no new dependency.

## Security / Permissions

Read-only evidence validation; prototype remains isolated from credentials and production side effects.

## UI Design Track

N/A for the policy implementation itself.

## Vertical Slice Plan

1. Failing tests for non-HTML acceptance and waiver acceptance.
2. Gate logic and policy rule update.
3. Entry/template/document synchronization.
4. Full validation and manifest refresh.

## Verification Strategy

- Unit/integration tests invoke the real UI gate in temporary repositories.
- Positive case: HTML + PNG + APPROVED + lock passes.
- Negative cases: TSX-only and WAIVED-only evidence fail.
- Full v4.3 policy/release/package validation.

## Rollback / Recovery

All changes are policy/docs/Python. If strict HTML enforcement cannot be proven, remain PARTIAL and do not claim acceptance.

