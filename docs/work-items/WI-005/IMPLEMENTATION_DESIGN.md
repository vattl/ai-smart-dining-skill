# Implementation Design — WI-005

## Root Fix / Owner

Add an interaction-capability gate parallel to visual fidelity. Visual artifacts remain owned by `validate_ui_fidelity.py`; functional prototype-to-backend translation is owned by `validate_ui_capabilities.py`.

## Contract

Every UI evidence directory contains `PROTOTYPE_INTERACTION_CONTRACT.md` with one populated row per material datum/action:

`Interaction ID | Prototype Interaction | Classification | Production Integration | Capability Request | E2E Evidence | Status`

Classification is exactly AVAILABLE, DERIVABLE, API_EXTENSION, NEW_API, or NOT_SUPPORTED.

## Plan phase

- complete matrix and zero unmapped interactions;
- production integration destination identified;
- API_EXTENSION/NEW_API points to an in-repository Backend Capability Request with a usable status;
- NOT_SUPPORTED blocks until prototype revision/reapproval;
- no production fake/mock/placeholder substitution is authorized.

## Accept phase

- all rows VERIFIED with non-placeholder E2E evidence paths;
- capability requests for API_EXTENSION/NEW_API are VERIFIED;
- unresolved backend capability count and production fake count are zero;
- generated backend coordination report has no OPEN/BLOCKED items.

## Output behavior

On a capability gap, validator writes/refreshes `BACKEND_COORDINATION_REPORT.md` listing interaction ID, need, classification, request path, owner/status and required next action. The gate returns non-zero and forbids acceptance.

## Verification Strategy

TDD fixtures cover missing matrix, missing capability request, NOT_SUPPORTED, unresolved accept state, fake count, missing E2E evidence and full pass.

## Rollback / Recovery

New validator/artifacts are additive. Gate integration can be reverted independently without changing existing visual fidelity implementation.
