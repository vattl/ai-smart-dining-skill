# Project Business Rules / Invariants

This file stores durable domain truths that future Work Items must preserve.

## How to use

- Keep rules domain-focused and stable.
- Give each invariant a durable ID, e.g. `INV-ORDER-001`.
- Link the owning capability/module when known.
- Do not add temporary requirements, UI preferences or implementation tricks.
- Update only after intentional production behavior has been accepted.

## Invariants

_No project-specific invariants have been established yet._

### Template

```text
ID: INV-<DOMAIN>-001
Capability: <capability>
Invariant: <business truth that must always hold>
Rationale: <why>
Verification: <how future changes can prove it remains true>
```
