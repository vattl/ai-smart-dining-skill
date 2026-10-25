# Implementation Design — WI-003

## Root Fix / Owner

Add a post-implementation fidelity validator and make it mandatory for UI acceptance.

## Why this location

The existing pre-edit gate answers “may implementation start?”; a separate post-edit gate must answer “does production actually match the approved target?”. Combining them would blur lifecycle state.

## End-to-End Change

### Backend

Create dependency-free validator for mapping/spec/structural-diff/screenshot-report semantics and referenced evidence files.

### Frontend

Future product UI changes must produce complete translation and fidelity evidence.

### UI / Interaction

Require final production screenshot presentation and user confirmation.

### Data / Persistence

Add machine-readable completion fields to existing templates; refresh manifest.

### Interfaces / Contracts

New additive CLI only.

### Jobs / Events / Integrations

N/A.

## Preserve / Compatibility

Keep visual diff diagnostic rather than imposing a universal changed-pixel threshold. Existing HTML approval gate remains unchanged.

## API Consumer Migration / Handoff

N/A.

## Failure / Boundary Behavior

- Missing artifact or referenced screenshot/diff → BLOCKED.
- Mapping incomplete/unmapped count > 0 → BLOCKED.
- Legacy remaining or target mismatch → BLOCKED.
- HIGH/CRITICAL deltas or correction decision → BLOCKED.
- Production not presented/confirmed by user → BLOCKED.

## Runtime / Performance / Reliability

Bounded text parsing and file existence/non-empty checks; no image processing dependency.

## Security / Permissions

Resolve referenced paths under the repository root and reject escaping paths.

## UI Design Track

N/A for this workflow-policy implementation.

## Vertical Slice Plan

1. Failing validator tests.
2. Minimal gate implementation.
3. Template/rule/command synchronization.
4. Full validation and package integrity refresh.

## Verification Strategy

Use real CLI calls in temporary copies for complete evidence, missing mapping, legacy residue, and missing user confirmation. Run complete policy/release/package suites.

## Rollback / Recovery

Changes are additive policy/docs/Python. If the validator cannot distinguish required states, remain PARTIAL and do not weaken acceptance.

